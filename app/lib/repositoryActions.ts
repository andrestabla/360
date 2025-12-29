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

export async function createFolderAction(data: { name: string; parentId?: string | null; unitId?: string; description?: string }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [newFolder] = await db.insert(folders).values({
        id: `fod-${Date.now()}`, // Simple ID gen
        name: data.name,
        parentId: data.parentId || null,
        unitId: data.unitId,
        creatorId: session.user.id,
        description: data.description,
        color: '#fbbf24' // Default folder yellow
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

    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string | null;
    const unitId = formData.get('unitId') as string | null;

    if (!file) throw new Error("No file provided");

    // 1. Upload to Storage (R2/S3)
    const storage = getStorageService();
    const uploadRes = await storage.upload(file, 'repository');

    if (!uploadRes.success || !uploadRes.url) {
        throw new Error(uploadRes.error || "Upload failed");
    }

    // 2. Create DB Record
    const [newDoc] = await db.insert(documents).values({
        id: `doc-${Date.now()}`,
        title: file.name,
        type: file.name.split('.').pop() || 'file',
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'ACTIVE',
        version: '1.0',
        url: uploadRes.url,
        folderId: folderId || null,
        unitId: unitId,
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
