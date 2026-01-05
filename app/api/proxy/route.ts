import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        // Validate URL protocol
        if (!url.startsWith('http')) {
            return new NextResponse('Invalid URL', { status: 400 });
        }

        console.log('[Proxy] Fetching:', url);

        const response = await fetch(url, {
            headers: {
                // Mimic a browser request to avoid some blocklists, but keep it minimal
                'User-Agent': 'Maturity360-Proxy/1.0',
            }
        });

        if (!response.ok) {
            console.error(`[Proxy] Upstream error: ${response.status} ${response.statusText}`);
            return new NextResponse(`Upstream Error: ${response.statusText}`, { status: response.status });
        }

        const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

        // Security: Ensure we are only proxying safe content types if possible, or just allow PDF/Images
        // For now, lenient, but logging.
        console.log('[Proxy] Content-Type:', contentType);

        // Convert ReadableStream to what NextResponse expects (it supports standard Streams)
        // @ts-ignore - native fetch stream compat
        return new NextResponse(response.body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for speed
                'Access-Control-Allow-Origin': '*', // Allow our client to read it
            }
        });
    } catch (error: any) {
        console.error('[Proxy] Access Error:', error);
        return new NextResponse(`Proxy Error: ${error.message}`, { status: 500 });
    }
}
