"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    X, DownloadSimple, ShareNetwork, Eye, DotsThreeVertical,
    PencilSimple, ClipboardText, FolderMinus, Trash,
    FilePdf, FileDoc, FileXls, FilePpt, Image, Link as LinkIcon,
    Code, FileText, Folder, CaretLeft, Star, CaretDoubleLeft, SidebarSimple, Camera
} from '@phosphor-icons/react';
import { RepositoryFile, updateDocumentMetadataAction, getDocumentDownloadUrlAction, deleteDocumentAction, toggleLikeAction } from '@/app/lib/repositoryActions';
import { createCommentAction, getCommentsAction } from '@/app/lib/commentActions';
import { Unit } from '@/shared/schema';
import { RepositorySidebar } from './RepositorySidebar';

// Reusing helper from sidebar/page (should be in utils)
const getFileIcon = (type: string, size: number) => {
    const t = (type || '').toLowerCase();
    if (t.includes('pdf')) return <FilePdf size={size} weight="duotone" className="text-red-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileDoc size={size} weight="duotone" className="text-blue-500" />;
    if (t.includes('xls') || t.includes('sheet') || t.includes('csv')) return <FileXls size={size} weight="duotone" className="text-green-500" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <FilePpt size={size} weight="duotone" className="text-orange-500" />;
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <Image size={size} weight="duotone" className="text-purple-500" />;
    if (t === 'carpeta') return <Folder size={size} weight="duotone" className="text-yellow-400" />;
    if (t === 'link') return <LinkIcon size={size} weight="duotone" className="text-blue-400" />;
    if (t === 'embed') return <Code size={size} weight="duotone" className="text-slate-600" />;
    return <FileText size={size} weight="duotone" className="text-slate-400" />;
};

interface DocumentViewerProps {
    initialDoc: RepositoryFile;
    units: Unit[];
    initialMode?: 'repository' | 'view' | 'work';
}

export default function DocumentViewer({ initialDoc, units, initialMode = 'repository' }: DocumentViewerProps) {
    const router = useRouter();
    const [doc, setDoc] = useState(initialDoc);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(initialMode !== 'view');
    const [mode, setMode] = useState(initialMode);

    // Refresh doc data logic (could just be revalidating path, but handling local state for speed)
    const refreshDoc = async () => {
        // In a real app, we might re-fetch or use router.refresh()
        router.refresh();
    };

    // Fetch secure URL for preview
    useEffect(() => {
        const fetchUrl = async () => {
            if (!doc.url) {
                setLoadingPreview(false);
                return;
            }
            try {
                const res = await getDocumentDownloadUrlAction(doc.id);
                if (res.success && res.url) {
                    setPreviewUrl(res.url);
                } else {
                    setPreviewUrl(doc.url);
                }
            } catch (error) {
                console.error("Error fetching preview URL:", error);
                setPreviewUrl(doc.url);
            } finally {
                setLoadingPreview(false);
            }
        };
        fetchUrl();
    }, [doc.id, doc.url]);

    const handleDownload = async () => {
        if (previewUrl) {
            window.open(previewUrl, '_blank');
        } else if (doc.url) {
            window.open(doc.url, '_blank');
        } else {
            alert("No URL available");
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar este documento?")) return;
        try {
            await deleteDocumentAction(doc.id);
            router.push('/dashboard/repository');
        } catch (e: any) {
            alert(e.message);
        }
    };

    const getGoogleDocsUrl = (url: string) => {
        return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    };

    // Mock capture for "Trabajar" mode
    const handleCapture = () => {
        alert("Captura de pantalla simulada: Se ha tomado una instantánea de la vista actual.");
    };

    const isImage = doc.type?.match(/(image|jpg|jpeg|png|gif|webp)/i);
    const isPDF = doc.type?.match(/pdf/i);
    const isOffice = doc.type?.match(/(doc|docx|xls|xlsx|ppt|pptx|msword|officedocument)/i);
    const isEmbed = doc.type === 'embed';


    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            {/* Left/Main Area: Preview */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button // Disable back in standalone mode? Or close window?
                            onClick={() => {
                                if (window.history.length > 2) router.back();
                                else window.close();
                            }}
                            className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <CaretLeft size={20} weight="bold" />
                        </button>
                        <div className="flex items-center gap-3">
                            {getFileIcon(doc.type || '', 24)}
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 leading-tight truncate max-w-md">{doc.title}</h1>
                                <p className="text-xs text-slate-500 font-medium">
                                    {(doc.size ? doc.size : '')} • {new Date(doc.createdAt || Date.now()).toLocaleDateString()}
                                    {mode === 'view' && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">SOLO LECTURA</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Work Mode Actions */}
                        {mode === 'work' && (
                            <>
                                <button
                                    onClick={handleCapture}
                                    className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-lg text-xs transition-colors"
                                >
                                    <Camera size={18} />
                                    <span className="hidden sm:inline">Capturar</span>
                                </button>
                                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            </>
                        )}

                        {/* Sidebar Toggle - Only if not View mode or explicitly allowed */}
                        {mode !== 'view' && !isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 font-bold rounded-lg text-xs transition-all shadow-sm"
                                title="Mostrar detalles"
                            >
                                <SidebarSimple size={18} />
                                <span className="hidden sm:inline">Detalles</span>
                            </button>
                        )}

                        <button
                            onClick={() => window.open(previewUrl || doc.url || '', '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
                        >
                            <DownloadSimple size={18} />
                            <span className="hidden sm:inline">Descargar</span>
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-100/50">
                    {loadingPreview ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    ) : !previewUrl && !doc.content ? (
                        <div className="text-center text-slate-400">
                            <Eye size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Vista previa no disponible</p>
                        </div>
                    ) : isImage ? (
                        <img src={previewUrl!} alt={doc.title} className="max-w-full max-h-full object-contain shadow-lg rounded-lg bg-white" />
                    ) : isPDF ? (
                        <iframe src={previewUrl!} className="w-full h-full rounded-lg shadow-lg bg-white" title="PDF Preview" />
                    ) : isEmbed && doc.content ? (
                        <div
                            className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                    ) : isOffice ? (
                        <iframe
                            src={getGoogleDocsUrl(previewUrl!)}
                            className="w-full h-full rounded-lg shadow-lg bg-white"
                            title="Office Preview"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <FileText size={64} className="text-slate-300" weight="duotone" />
                            <p className="text-slate-500 font-medium">Este archivo no tiene vista previa directa.</p>
                            <button onClick={handleDownload} className="text-blue-600 font-bold hover:underline">Descargar para ver</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar: Metadata & Comments */}
            {isSidebarOpen && (
                <div className="w-[400px] border-l border-slate-200 bg-white flex flex-col z-20 shadow-xl animate-in slide-in-from-right-10 duration-300">
                    <RepositorySidebar
                        doc={doc}
                        units={units}
                        mode={mode} // Pass mode
                        onClose={() => setIsSidebarOpen(false)}
                        onDownload={handleDownload}
                        onUpdate={refreshDoc}
                        onAssign={() => { /* Implement if needed or use modal logic */ }}
                        onToggleLike={async (d) => { await toggleLikeAction(d.id); refreshDoc(); }}
                        onShare={() => { navigator.clipboard.writeText(doc.url || ''); alert("Link copiado!"); }}
                        onDelete={handleDelete}
                        onMove={() => { /* Implement move logic if needed */ }}
                        onExpand={() => { /* Already expanded */ }}
                    />
                </div>
            )}
        </div>
    );
}
