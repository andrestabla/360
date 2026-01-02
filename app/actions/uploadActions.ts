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
        return result;

    } catch (e: any) {
        console.error('Upload Error:', e);
        return { success: false, error: e.message };
    }
}
