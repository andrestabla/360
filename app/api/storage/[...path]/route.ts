import { NextRequest, NextResponse } from 'next/server';
import { getStorageService } from '@/lib/services/storageService';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    try {
        // Next.js 15: params is a Promise
        const { path } = await context.params;

        console.log('[Storage Proxy] Request for path:', path);

        if (!path || path.length === 0) {
            return new NextResponse('File path not provided', { status: 400 });
        }

        // Reconstruct the key from the path segments
        const key = path.join('/');

        const storageService = getStorageService();
        // NOTE: If using LOCAL provider in Vercel, this will likely fail for uploaded files (ephemeral storage).
        // It is imperative to use S3/R2 in production.
        const result = await storageService.download(key);

        if (result.success && result.url) {
            // Redirect to the signed URL (offload bandwidth to R2/S3)
            return NextResponse.redirect(result.url);
        } else {
            console.error('[Storage Proxy] File not found or access denied for key:', key, result.error);
            return new NextResponse(`File not found: ${result.error || 'Unknown error'}`, { status: 404 });
        }
    } catch (error: any) {
        console.error('[Storage Proxy] Critical Error:', error);
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
}
