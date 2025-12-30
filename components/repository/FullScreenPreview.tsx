'use client';

import React, { useEffect, useState } from 'react';
import { X, DownloadSimple, Spinner } from '@phosphor-icons/react';
import { getDocumentDownloadUrlAction } from '@/app/lib/repositoryActions';

interface FullScreenPreviewProps {
    doc: {
        id: string;
        title: string;
        url: string | null;
        type: string | null;
        content?: string | null;
    };
    onClose: () => void;
}

export function FullScreenPreview({ doc, onClose }: FullScreenPreviewProps) {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUrl = async () => {
            if (!doc.url) {
                setLoading(false);
                return;
            }
            try {
                // Fetch a fresh signed URL (or absolute public URL) from the server
                const res = await getDocumentDownloadUrlAction(doc.id);
                if (res.success && res.url) {
                    setSignedUrl(res.url);
                } else {
                    // Fallback to existing URL if action fails
                    setSignedUrl(doc.url);
                }
            } catch (error) {
                console.error("Error fetching preview URL:", error);
                setSignedUrl(doc.url);
            } finally {
                setLoading(false);
            }
        };

        fetchUrl();
    }, [doc.id, doc.url]);

    // Helpers
    const getAbsoluteUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
        }
        return url;
    };

    const finalUrl = signedUrl || doc.url;
    const absUrl = finalUrl ? getAbsoluteUrl(finalUrl) : '';

    // Determine content type
    const isImage = doc.type?.match(/(image|jpg|jpeg|png|gif|webp)/i);
    const isPDF = doc.type?.match(/pdf/i);
    const isEmbed = doc.type === 'embed';
    const isOffice = doc.type?.match(/(doc|docx|xls|xlsx|ppt|pptx|msword|officedocument)/i);

    // Google Docs Viewer logic: needs absolute URL
    // If we have a signedUrl (likely absolute from S3), use it.
    // If we have a relative URL, convert to absolute.
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absUrl)}&embedded=true`;

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/60 text-white border-b border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{doc.type || 'FILE'}</span>
                    </div>
                    <h2 className="font-bold text-lg truncate max-w-xl text-white/90">{doc.title}</h2>
                </div>

                <div className="flex items-center gap-4">
                    {finalUrl && (
                        <a
                            href={finalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all"
                        >
                            <DownloadSimple size={18} />
                            <span className="hidden sm:inline">Descargar</span>
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 hover:rotate-90 rounded-full transition-all duration-300 text-white/70 hover:text-white"
                    >
                        <X size={24} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Content Viewer */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 sm:p-8">
                {loading ? (
                    <div className="flex flex-col items-center gap-3 text-white/50">
                        <Spinner size={32} className="animate-spin" />
                        <p>Cargando vista previa...</p>
                    </div>
                ) : !finalUrl && !doc.content ? (
                    <div className="text-center text-white/50">
                        <p className="text-xl">Recurso no disponible</p>
                    </div>
                ) : isImage ? (
                    <img
                        src={finalUrl!}
                        alt={doc.title}
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                    />
                ) : isPDF ? (
                    <iframe
                        src={finalUrl!}
                        className="w-full h-full rounded-lg shadow-2xl bg-white"
                        title="PDF Preview"
                    />
                ) : isEmbed && doc.content ? (
                    <div
                        className="w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                        dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
                ) : isOffice ? (
                    <iframe
                        src={googleDocsUrl}
                        className="w-full h-full rounded-lg shadow-2xl bg-white"
                        title="Office Preview"
                    />
                ) : (
                    // Fallback for generic/text or unknown types
                    <div className="flex flex-col items-center gap-6 text-center w-full h-full">
                        <iframe
                            src={googleDocsUrl}
                            className="w-full h-full rounded-lg shadow-2xl bg-white"
                            title="Universal Preview"
                            onError={(e) => {
                                (e.target as HTMLIFrameElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
