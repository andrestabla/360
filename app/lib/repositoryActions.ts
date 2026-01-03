'use server';

import { db } from '@/server/db';
import { documents, folders, units, favorite_documents, documentVersions, users } from '@/shared/schema';
import { eq, and, like, desc, isNull, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { getStorageService } from '@/lib/services/storageService';

// --- Types ---
export type RepositoryFile = typeof documents.$inferSelect;
export type RepositoryFolder = typeof folders.$inferSelect;

// --- Helper: Serialize ---
function serialize<T>(obj: T): any {
    return JSON.parse(JSON.stringify(obj));
}

// --- FOLDERS ---

export async function getFoldersAction(parentId: string | null, unitId?: string) {
    try {
        const conditions = [
            parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId)
        ];

        if (unitId) conditions.push(eq(folders.unitId, unitId));

        const res = await db.select().from(folders)
            .where(and(...conditions))
            .orderBy(desc(folders.createdAt));

        return { success: true, data: serialize(res) };
    } catch (error) {
        console.error("Error in getFoldersAction:", error);
        return { success: false, error: 'Error al obtener carpetas' };
    }
}

export async function createFolderAction(data: { name: string; parentId?: string | null; unitId?: string; description?: string; process?: string; color?: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "No autorizado" };

        const [newFolder] = await db.insert(folders).values({
            id: `fod-${Date.now()}`,
            name: data.name,
            parentId: data.parentId || null,
            unitId: data.unitId,
            creatorId: session.user.id,
            description: data.description,
            process: data.process,
            color: data.color || '#fbbf24'
        }).returning();

        revalidatePath('/dashboard/repository');
        return { success: true, data: serialize(newFolder) };
    } catch (error: any) {
        console.error("Error creating folder:", error);
        return { success: false, error: error.message || 'Error al crear carpeta' };
    }
}

export async function updateFolderAction(folderId: string, data: Partial<RepositoryFolder>) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "No autorizado" };

        const [updated] = await db.update(folders)
            .set(data)
            .where(eq(folders.id, folderId))
            .returning();

        revalidatePath('/dashboard/repository');
        return { success: true, data: serialize(updated) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteFolderAction(folderId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "No autorizado" };

        await db.delete(folders).where(eq(folders.id, folderId));
        revalidatePath('/dashboard/repository');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


// --- DOCUMENTS ---


export async function getDocumentByIdAction(docId: string) {
    try {
        const [doc] = await db.select().from(documents).where(eq(documents.id, docId));
        if (!doc) return null;
        return serialize(doc);
    } catch {
        return null;
    }
}

export async function getDocumentsAction(folderId: string | null, unitId?: string, search?: string) {
    let conditions = [];

    if (search && search.length > 0) {
        conditions.push(like(documents.title, `%${search}%`));
    } else {
        conditions.push(folderId ? eq(documents.folderId, folderId) : isNull(documents.folderId));
    }

    if (unitId) conditions.push(eq(documents.unitId, unitId));

    try {
        const res = await db.select().from(documents)
            .where(and(...conditions))
            .orderBy(desc(documents.createdAt));

        return serialize(res);
    } catch (error) {
        console.error("Error in getDocumentsAction:", error);
        return [];
    }
}

export async function uploadDocumentAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const linkType = formData.get('linkType') as string || 'file';
    const folderId = formData.get('folderId') as string | null;
    const unitId = formData.get('unitId') as string | null;

    const rawProcess = formData.get('process') as string;
    const process = rawProcess && rawProcess.trim() !== '' ? rawProcess.trim() : null;

    const expiresAtStr = formData.get('expiresAt') as string | null;
    const description = formData.get('description') as string | null;

    let expiresAt: Date | null = null;
    if (expiresAtStr && expiresAtStr.trim() !== '') {
        const d = new Date(expiresAtStr);
        if (!isNaN(d.getTime())) {
            expiresAt = d;
        }
    }

    const title = formData.get('title') as string;
    const keywordsStr = formData.get('keywords') as string;
    const tags = keywordsStr ? keywordsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    let url: string | null = null;
    let size = '0 KB';
    let finalType = 'file';
    let content: string | null = description;

    if (linkType === 'file') {
        const file = formData.get('file') as File;
        if (!file || file.size === 0) throw new Error("No file provided");

        let storagePath = 'repository/General';
        if (unitId) {
            try {
                const userUnit = await db.select({ name: units.name }).from(units).where(eq(units.id, unitId)).limit(1);
                if (userUnit && userUnit.length > 0) {
                    const safeUnitName = userUnit[0].name.replace(/[^a-zA-Z0-9-_]/g, '_');
                    storagePath = `repository/${safeUnitName}`;
                }
            } catch (e) {
                console.error("Error fetching unit for path:", e);
            }
        }

        const storage = getStorageService();
        const uploadRes = await storage.upload(file, storagePath);
        if (!uploadRes.success || !uploadRes.url) {
            throw new Error(uploadRes.error || "Upload failed");
        }
        url = uploadRes.url;
        size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        finalType = file.name.split('.').pop() || 'file';
    } else if (linkType === 'link') {
        url = formData.get('url') as string;
        finalType = 'link';
        if (!url) throw new Error("URL Required");
    } else if (linkType === 'embed') {
        const embedCode = formData.get('embedCode') as string;
        if (!embedCode) throw new Error("Embed Code Required");
        content = embedCode;
        finalType = 'embed';
    }

    const [newDoc] = await db.insert(documents).values({
        id: `doc-${Date.now()}`,
        title: title || (linkType === 'file' ? (formData.get('file') as File).name : 'Untitled'),
        type: finalType,
        size: size,
        status: 'ACTIVE',
        version: '1.0',
        url: url,
        content: content,
        folderId: folderId || null,
        unitId: unitId,
        process: process,
        expiresAt: expiresAt,
        tags: tags,
        ownerId: session.user.id,
        likes: 0,
        commentsCount: 0
    }).returning();

    revalidatePath('/dashboard/repository');
    return serialize(newDoc);
}

export async function deleteDocumentAction(docId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [doc] = await db.select().from(documents).where(eq(documents.id, docId));
    if (!doc) return { success: false };

    await db.delete(documents).where(eq(documents.id, docId));
    revalidatePath('/dashboard/repository');
    return { success: true };
}

export async function toggleLikeAction(docId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const existingFavorite = await db.select().from(favorite_documents)
        .where(and(
            eq(favorite_documents.userId, session.user.id),
            eq(favorite_documents.documentId, docId)
        ))
        .limit(1);

    if (existingFavorite.length > 0) {
        await db.delete(favorite_documents)
            .where(and(
                eq(favorite_documents.userId, session.user.id),
                eq(favorite_documents.documentId, docId)
            ));

        await db.update(documents)
            .set({ likes: sql`GREATEST(${documents.likes} - 1, 0)` })
            .where(eq(documents.id, docId));

        revalidatePath('/dashboard/repository');
        return { success: true, isFavorite: false };
    } else {
        await db.insert(favorite_documents).values({
            userId: session.user.id,
            documentId: docId
        });

        await db.update(documents)
            .set({ likes: sql`${documents.likes} + 1` })
            .where(eq(documents.id, docId));

        revalidatePath('/dashboard/repository');
        return { success: true, isFavorite: true };
    }
}

export async function moveItemAction(itemId: string, type: 'folder' | 'doc', newParentId: string | null) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    if (type === 'folder') {
        if (itemId === newParentId) throw new Error("Cannot move folder into itself");
        await db.update(folders).set({ parentId: newParentId }).where(eq(folders.id, itemId));
    } else {
        await db.update(documents).set({ folderId: newParentId }).where(eq(documents.id, itemId));
    }

    revalidatePath('/dashboard/repository');
    return { success: true };
}

export async function moveDocumentAction(docId: string, folderId: string | null) {
    return moveItemAction(docId, 'doc', folderId);
}

export async function updateDocumentMetadataAction(docId: string, data: {
    title?: string;
    unitId?: string;
    process?: string;
    expiresAt?: Date | null;
    tags?: string[];
    description?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(documents).set({
        title: data.title,
        unitId: data.unitId,
        process: data.process,
        expiresAt: data.expiresAt,
        tags: data.tags,
        content: data.description
    }).where(eq(documents.id, docId));

    revalidatePath('/dashboard/repository');
    return { success: true };
}

export async function getDocumentDownloadUrlAction(docId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [doc] = await db.select().from(documents).where(eq(documents.id, docId));
    if (!doc || !doc.url) return { success: false, error: 'Document not found' };

    console.log(`[DownloadAction] Processing doc: ${doc.id}, type: ${doc.type}, url: ${doc.url}`);

    // If it's a link type or external URL (that is NOT our internal storage), return it as is
    const isInternal = doc.url && (doc.url.includes('/api/storage/') || doc.url.includes('/repository/'));
    const isExternalUrl = doc.url.startsWith('http') || doc.url.startsWith('https');

    // If explicit link/embed AND it looks like a URL/Code, return it. 
    // BUT if it's 'link' but looks like a filename, fall through to signing.
    if ((doc.type === 'link' || doc.type === 'embed') && (isExternalUrl || isInternal)) {
        return { success: true, url: doc.url };
    }

    // If it's effectively an external URL and not internal storage, return it
    // EXCEPTION: If it is our R2 domain (files.maturity360.co), we must treat it as internal to sign it if needed.
    const isR2Domain = doc.url.includes('files.maturity360.co');

    if (isExternalUrl && !isInternal && !isR2Domain) {
        return { success: true, url: doc.url };
    }

    // It's a file path potentially proxied or misconfigured absolute URL
    // We need to extract the clean key (e.g., "repository/General/file.pdf")

    let key = doc.url;

    if (doc.url.includes('/api/storage/')) {
        key = doc.url.split('/api/storage/')[1];
    } else if (doc.url.includes('/repository/')) {
        const parts = doc.url.split('/repository/');
        if (parts.length > 1) {
            key = 'repository/' + parts[1];
        }
    } else if (doc.url.includes('files.maturity360.co/')) {
        // Handle R2 Custom Domain: Extract key after domain
        const parts = doc.url.split('files.maturity360.co/');
        if (parts.length > 1) {
            key = parts[1];
        }
    }

    console.log(`[DownloadAction] Extracted key: ${key}`);

    // Perform cleanup just in case (e.g. double slashes)
    key = key.replace(/\/\/\//g, '/');

    const storageService = getStorageService();
    const result = await storageService.download(key);

    console.log(`[DownloadAction] Storage result:`, result.success, result.url ? 'URL_PRESENT' : 'NO_URL');

    return result;
}

// --- VERSIONS ---

export async function getDocumentVersionsAction(docId: string) {
    try {
        const res = await db.select({
            id: documentVersions.id,
            version: documentVersions.version,
            url: documentVersions.url,
            size: documentVersions.size,
            changeLog: documentVersions.changeLog,
            createdAt: documentVersions.createdAt,
            creator: {
                name: users.name
            }
        })
            .from(documentVersions)
            .leftJoin(users, eq(documentVersions.creatorId, users.id))
            .where(eq(documentVersions.documentId, docId))
            .orderBy(desc(documentVersions.createdAt)); // Newest first

        return { success: true, data: res };
    } catch (error: any) {
        console.error("Error fetching versions:", error);
        return { success: false, error: error.message };
    }
}

export async function uploadNewVersionAction(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const docId = formData.get('docId') as string;
        const changeLog = formData.get('changeLog') as string;
        const file = formData.get('file') as File;

        if (!docId || !file) return { success: false, error: "Missing data" };

        const [currentDoc] = await db.select().from(documents).where(eq(documents.id, docId));
        if (!currentDoc) return { success: false, error: "Doc not found" };

        // Archive current (OLD) state
        await db.insert(documentVersions).values({
            id: `ver-${Date.now()}`,
            documentId: docId,
            version: currentDoc.version || '1.0',
            url: currentDoc.url || '',
            size: currentDoc.size,
            changeLog: changeLog || 'Versión previa',
            creatorId: currentDoc.ownerId,
            createdAt: currentDoc.updatedAt || new Date()
        });

        // Upload NEW file
        const storage = getStorageService();
        const path = `repository/versions/${docId}/${Date.now()}_${file.name}`;
        const uploadRes = await storage.upload(file, path);

        if (!uploadRes.success || !uploadRes.url) return { success: false, error: "Upload failed" };

        // Calculate new version number
        let newVer = '1.1';
        const oldVerNum = parseFloat(currentDoc.version || '1.0');
        if (!isNaN(oldVerNum)) {
            newVer = (oldVerNum + 0.1).toFixed(1);
        }

        // Update Main Doc
        await db.update(documents).set({
            version: newVer,
            url: uploadRes.url,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            updatedAt: new Date(),
        }).where(eq(documents.id, docId));

        revalidatePath('/dashboard/repository');
        return { success: true, version: newVer };
    } catch (error: any) {
        console.error("Error uploading version:", error);
        return { success: false, error: error.message };
    }
}

// --- USERS ---
export async function getUsersAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "No autorizado" };

        const activeUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            avatar: users.avatar
        }).from(users).where(eq(users.status, 'ACTIVE'));

        return { success: true, data: serialize(activeUsers) };
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return { success: false, error: error.message };
    }
}
