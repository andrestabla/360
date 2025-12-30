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

        // Reconstruct the key. 
        // URL is typically /chat-attachments/file-123.pdf -> path=["file-123.pdf"]
        // The storage key might be just "file-123.pdf" or "chat-attachments/file-123.pdf"?
        // storageService.upload puts it in "chat-attachments" folder if path arg is provided?
        // Let's check storageService.upload calls.

        // In chatActions.ts: `storage.upload(file, 'chat-attachments')`.
        // So the key in S3/R2 is `chat-attachments/file-123.pdf`.

        // If the URL logic was `${baseUrl}/${key}`, and key was `chat-attachments/file-123.pdf`
        // Then the URL is `domain.com/chat-attachments/file-123.pdf`.
        // So `params.path` will be `['file-123.pdf']`.
        // Meaning we need to prepend 'chat-attachments' to the key if it's missing?
        // OR the key passed to download should include it.

        let key = path.join('/');

        // If the key doesn't start with chat-attachments, we might need to prepend it, 
        // BUT `download` takes the full key. 
        // Let's assume the key stored is indeed `chat-attachments/...`
        // The URL pattern implies `chat-attachments` is the "folder" mapping to the route.
        // So the `path` param contains the filename.
        // We probably need to re-add the folder prefix to find it in the bucket.

        if (!key.startsWith('chat-attachments/')) {
            key = `chat-attachments/${key}`;
        }

        const storageService = getStorageService();
        const result = await storageService.download(key);

        if (result.success && result.url) {
            return NextResponse.redirect(result.url);
        } else {
            // Fallback: Try without prefix just in case
            if (key.startsWith('chat-attachments/')) {
                const simpleKey = path.join('/');
                const retry = await storageService.download(simpleKey);
                if (retry.success && retry.url) {
                    return NextResponse.redirect(retry.url);
                }
            }

            return new NextResponse('File not found or access denied', { status: 404 });
        }
    } catch (error) {
        console.error('[Attachment Proxy] Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
