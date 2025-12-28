import { NextRequest, NextResponse } from 'next/server';
import { getStorageService } from '@/lib/services/storageService';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    params: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await params.params;

        if (!path || path.length === 0) {
            return new NextResponse('File path not provided', { status: 400 });
        }

        // Reconstruct the key from the path segments
        const key = path.join('/');

        const storageService = getStorageService();
        const result = await storageService.download(key);

        if (result.success && result.url) {
            // Redirect to the signed URL (offload bandwidth to R2/S3)
            return NextResponse.redirect(result.url);
        } else {
            return new NextResponse('File not found or access denied', { status: 404 });
        }
    } catch (error) {
        console.error('[Storage Proxy] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
