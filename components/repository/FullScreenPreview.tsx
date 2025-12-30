'use client';

import React from 'react';
import { X, DownloadSimple } from '@phosphor-icons/react';

interface FullScreenPreviewProps {
    doc: {
        title: string;
        url: string | null;
        type: string | null;
        content?: string | null;
    };
    onClose: () => void;
}

export function FullScreenPreview({ doc, onClose }: FullScreenPreviewProps) {
    // Determine content type
    const isImage = doc.type?.match(/(image|jpg|jpeg|png|gif|webp)/i);
    const isPDF = doc.type?.match(/pdf/i);
    const isEmbed = doc.type === 'embed';
    const isOffice = doc.type?.match(/(doc|docx|xls|xlsx|ppt|pptx|msword|officedocument)/i);
    const isText = doc.type?.match(/(txt|csv|json|log)/i);

    // Google Docs Viewer URL
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url || '')}&embedded=true`;

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/60 text-white border-b border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white/10 rounded-lg">
                        {/* Icon placeholder based on type could go here */}
                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{doc.type || 'FILE'}</span>
                    </div>
                    <h2 className="font-bold text-lg truncate max-w-xl text-white/90">{doc.title}</h2>
                </div>

                <div className="flex items-center gap-4">
                    {doc.url && (
                        <a
                            href={doc.url}
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
                {!doc.url && !doc.content ? (
                    <div className="text-center text-white/50">
                        <p className="text-xl">Recurso no disponible</p>
                    </div>
                ) : isImage ? (
                    <img
                        src={doc.url!}
                        alt={doc.title}
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                    />
                ) : isPDF ? (
                    <iframe
                        src={doc.url!}
                        className="w-full h-full rounded-lg shadow-2xl bg-white"
                        title="PDF Preview"
                    />
                ) : isEmbed && doc.content ? (
                    <div
                        className="w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl"
                        dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
                ) : isOffice ? (
                    <iframe
                        src={googleDocsUrl}
                        className="w-full h-full rounded-lg shadow-2xl bg-white"
                        title="Office Preview"
                    />
                ) : (
                    // Fallback for generic/text or unknown types: Try Google Docs Viewer or Show Link
                    <div className="flex flex-col items-center gap-6 text-center">
                        <iframe
                            src={googleDocsUrl}
                            className="w-full max-w-5xl h-[70vh] rounded-lg shadow-2xl bg-white mb-4"
                            title="Generic Preview"
                            onError={(e) => {
                                // Fallback UI if iframe fails (hard to detect cross-origin, but visual fallback helps)
                                (e.target as HTMLIFrameElement).style.display = 'none';
                            }}
                        />
                        <div className="text-white/60 max-w-md">
                            <p className="mb-4">Si la vista previa no carga, puedes descargar el archivo directamente.</p>
                            {doc.url && (
                                <a href={doc.url} target="_blank" rel="noreferrer" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                    Abrir / Descargar
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
