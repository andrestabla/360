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
    const isImage = doc.type?.includes('image') || doc.type?.match(/(jpg|jpeg|png|gif)/i);
    const isPDF = doc.type?.includes('pdf');
    const isEmbed = doc.type === 'embed';
    const isOffice = doc.type?.includes('doc') || doc.type?.includes('xls') || doc.type?.includes('ppt');

    // For Office docs, we often need a viewer. Google Docs Viewer is a common quick hack for public URLs.
    // If local/private, typically we just download or rely on browser PDF support.

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 bg-black/50 text-white">
                <h2 className="font-bold text-lg truncate max-w-xl">{doc.title}</h2>
                <div className="flex items-center gap-4">
                    {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors">
                            <DownloadSimple size={20} /> Descargar
                        </a>
                    )}
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
                {isImage && doc.url ? (
                    <img src={doc.url} alt={doc.title} className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                ) : isPDF && doc.url ? (
                    <iframe src={doc.url} className="w-full h-full rounded-lg shadow-2xl bg-white" />
                ) : isEmbed && doc.content ? (
                    <div className="w-full h-full bg-white rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: doc.content }} />
                ) : (
                    <div className="text-center text-white/50">
                        <p className="text-xl mb-4">Vista previa no disponible</p>
                        {doc.url && (
                            <a href={doc.url} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors">
                                Abrir en nueva pestaña
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
