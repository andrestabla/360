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
            const stream = request.nextUrl.searchParams.get('stream') === 'true';

            if (stream) {
                console.log('[Storage Proxy] Streaming file from:', result.url);
                try {
                    const upstream = await fetch(result.url);
                    if (!upstream.ok) {
                        console.error('[Storage Proxy] Upstream fetch failed:', upstream.status, upstream.statusText);
                        return new NextResponse(`Upstream Error: ${upstream.statusText}`, { status: upstream.status });
                    }

                    const headers = new Headers();
                    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/pdf');
                    headers.set('Cache-Control', 'public, max-age=3600');

                    // CORS for Credentials (Required for withCredentials: true)
                    const origin = request.headers.get('origin') || '*';
                    headers.set('Access-Control-Allow-Origin', origin);
                    headers.set('Access-Control-Allow-Credentials', 'true');
                    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

                    // Helper to clone/pass body
                    // @ts-ignore
                    return new NextResponse(upstream.body, {
                        status: 200,
                        headers: headers
                    });
                } catch (fetchError: any) {
                    console.error('[Storage Proxy] Stream fetch failed:', fetchError);
                    return new NextResponse(`Stream Error: ${fetchError.message}`, { status: 500 });
                }
            }

            // Default: Redirect to the signed URL (offload bandwidth to R2/S3)
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
