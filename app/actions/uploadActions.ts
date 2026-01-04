'use server';

import { auth } from '@/lib/auth';
import { getStorageService } from '@/lib/services/storageService';

export async function uploadProjectEvidenceAction(projectId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file provided' };

    try {
        const storage = getStorageService();
        // Path: projects/{projectId}/evidence
        const path = `projects/${projectId}/evidence`;

        const result = await storage.upload(file, path);

        // NEW: Insert into documents table for FK validity
        const docId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // We need to import db and schema
        // Lazy import to avoid top-level issues if any
        const { db } = await import('@/server/db');
        const { documents } = await import('@/shared/schema');

        await db.insert(documents).values({
            id: docId,
            title: file.name,
            type: file.type || 'application/octet-stream',
            size: (file.size / 1024).toFixed(2) + ' KB',
            url: result.url,
            status: 'APPROVED', // Evidence is considered approved/final? Or DRAFT? Let's say APPROVED so it's searchable
            folderId: null, // No specific folder initially? Or project specific?
            ownerId: session.user.id,
            version: '1.0',
            process: 'PROJECT_EVIDENCE' // Marker
        });

        return { ...result, id: docId };

    } catch (e: any) {
        console.error('Upload Error:', e);
        return { success: false, error: e.message };
    }
}
