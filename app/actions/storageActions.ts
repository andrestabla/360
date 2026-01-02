'use server';

import { auth } from '@/lib/auth';
import { getStorageService } from '@/lib/services/storageService';

export async function getSignedUrlAction(url: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    if (!url) return { success: false, error: 'No URL provided' };

    // Check if it matches our R2 domain or internal storage path
    const isR2 = url.includes('files.maturity360.co');
    const isInternal = url.includes('/api/storage/');
    const isRepo = url.includes('/repository/'); // Legacy/Misconfig

    // If it's a completely external URL (e.g. google.com), return as is
    if (!isR2 && !isInternal && !isRepo && url.startsWith('http')) {
        return { success: true, url };
    }

    let key = url;

    // Extract Key
    if (url.includes('files.maturity360.co/')) {
        key = url.split('files.maturity360.co/')[1];
    } else if (url.includes('/api/storage/')) {
        key = url.split('/api/storage/')[1];
    } else if (url.includes('/repository/')) {
        // Fallback for paths that might have been saved incorrectly
        const parts = url.split('/repository/');
        if (parts.length > 1) key = 'repository/' + parts[1];
    }

    // Cleanup
    key = key.split('?')[0]; // Remove existing query params if any
    key = key.replace(/\/\//g, '/');

    try {
        const storage = getStorageService();
        return await storage.download(key);
    } catch (error: any) {
        console.error("Sign URL Error:", error);
        return { success: false, error: error.message };
    }
}
