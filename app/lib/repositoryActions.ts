'use server';

import { db } from '@/server/db';
import { documents, folders } from '@/shared/schema';
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

        return serialize(res);
    } catch (error) {
        console.error("Error in getFoldersAction:", error);
        // Return empty array to avoid client crash, or throw valid error
        return [];
    }
}

export async function createFolderAction(data: { name: string; parentId?: string | null; unitId?: string; description?: string; process?: string; color?: string }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [newFolder] = await db.insert(folders).values({
        id: `fod-${Date.now()}`, // Simple ID gen
        name: data.name,
        parentId: data.parentId || null,
        unitId: data.unitId,
        creatorId: session.user.id,
        description: data.description,
        process: data.process,
        color: data.color || '#fbbf24' // Default folder yellow
    }).returning();

    revalidatePath('/dashboard/repository');
    return serialize(newFolder);
}

export async function updateFolderAction(folderId: string, data: Partial<RepositoryFolder>) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Validate ownership/permissions if needed

    const [updated] = await db.update(folders)
        .set(data)
        .where(eq(folders.id, folderId))
        .returning();

    revalidatePath('/dashboard/repository');
    return serialize(updated);
}

export async function deleteFolderAction(folderId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Cascade delete is handled by DB constraints usually, but for S3 files inside we might need manual cleanup if strict.
    // For now relying on DB cascade for metadata.

    await db.delete(folders).where(eq(folders.id, folderId));
    revalidatePath('/dashboard/repository');
    return { success: true };
}


// --- DOCUMENTS ---

export async function getDocumentsAction(folderId: string | null, unitId?: string, search?: string) {
    let conditions = [];

    // If search is present, we might ignore folder structure or search within.
    // For now: if search, global search (filtered by unit). If no search, filtered by folder.

    if (search && search.length > 0) {
        conditions.push(like(documents.title, `%${search}%`));
    } else {
        conditions.push(folderId ? eq(documents.folderId, folderId) : isNull(documents.folderId));
    }

    if (unitId) conditions.push(eq(documents.unitId, unitId));

    try {
        // Default draft filter? Maybe show all for now.

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

    const linkType = formData.get('linkType') as string || 'file'; // 'file', 'link', 'embed'
    const folderId = formData.get('folderId') as string | null;
    const unitId = formData.get('unitId') as string | null;
    const process = formData.get('process') as string | null;
    const expiresAtStr = formData.get('expiresAt') as string | null;
    const description = formData.get('description') as string | null; // Stored in content? No, schema needs desc. Documents usage: content text. We can use content for description OR embed code.
    // Let's use `content` for Description usually, or EmbedCode.
    // If type=embed, content=code. If type=file/link, content=description.

    const title = formData.get('title') as string;
    const keywordsStr = formData.get('keywords') as string; // Comma separated
    const tags = keywordsStr ? keywordsStr.split(',').map(s => s.trim()) : [];

    let url: string | null = null;
    let size = '0 KB';
    let finalType = 'file';
    let content: string | null = description; // Default to description

    if (linkType === 'file') {
        const file = formData.get('file') as File;
        if (!file) throw new Error("No file provided");

        // Upload
        const storage = getStorageService();
        const uploadRes = await storage.upload(file, 'repository');
        if (!uploadRes.success || !uploadRes.url) {
            throw new Error(uploadRes.error || "Upload failed");
        }
        url = uploadRes.url;
        size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        finalType = file.name.split('.').pop() || 'file';
        // If not title provided, use filename
        // But typical usage is Title provided.
    } else if (linkType === 'link') {
        url = formData.get('url') as string;
        finalType = 'link';
        if (!url) throw new Error("URL Required");
    } else if (linkType === 'embed') {
        const embedCode = formData.get('embedCode') as string;
        if (!embedCode) throw new Error("Embed Code Required");
        content = embedCode; // Override description with code for render
        finalType = 'embed';
    }

    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

    // 2. Create DB Record
    const [newDoc] = await db.insert(documents).values({
        id: `doc-${Date.now()}`,
        title: title || (linkType === 'file' ? (formData.get('file') as File).name : 'Untitled'),
        type: finalType,
        size: size,
        status: 'ACTIVE',
        version: '1.0',
        url: url,
        content: content, // Description or EmbedCode
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

    // 1. Get doc to find S3 key/url
    const [doc] = await db.select().from(documents).where(eq(documents.id, docId));
    if (!doc) return { success: false };

    // 2. Delete from DB
    await db.delete(documents).where(eq(documents.id, docId));

    // 3. Delete from Storage (Optional optimization, good practice)
    // if (doc.url) ...

    revalidatePath('/dashboard/repository');
    return { success: true };
}

export async function toggleLikeAction(docId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Simple toggle logic: In real app we need a `likes` table. 
    // For MVP we just increment/decrement counter blindly or check a session cache.
    // Let's just increment for 'Like' simulation.

    await db.update(documents)
        .set({ likes: sql`${documents.likes} + 1` })
        .where(eq(documents.id, docId));

    revalidatePath('/dashboard/repository');
    return { success: true };
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
