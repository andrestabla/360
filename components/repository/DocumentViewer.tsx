"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    X, DownloadSimple, ShareNetwork, Eye, DotsThreeVertical,
    PencilSimple, ClipboardText, FolderMinus, Trash,
    FilePdf, FileDoc, FileXls, FilePpt, Image, Link as LinkIcon,
    Code, FileText, Folder, CaretLeft, Star, CaretDoubleLeft, SidebarSimple, ClockCounterClockwise, Camera, Bell, ChatCircle, Crosshair
} from '@phosphor-icons/react';
import { RepositoryFile, updateDocumentMetadataAction, getDocumentDownloadUrlAction, deleteDocumentAction, toggleLikeAction } from '@/app/lib/repositoryActions';
import { getSignedUrlAction } from '@/app/actions/storageActions';
import { createCommentAction, getCommentsAction } from '@/app/lib/commentActions';
import { Unit } from '@/shared/schema';
import { RepositorySidebar } from './RepositorySidebar';
import html2canvas from 'html2canvas'; // Import html2canvas
import { Document, Page, pdfjs } from 'react-pdf';
import dynamic from 'next/dynamic';
import './AnnotationLayer.css';
import './TextLayer.css';

const InteractivePDFViewer = dynamic(() => import('./InteractivePDFViewer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 animate-pulse">Iniciando motor PDF...</div>
});

// Configure worker to use Local File (Copied via postinstall - Guarantees version match + No CORS)
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

const pdfOptions = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
};

// Reusing helper from sidebar/page (should be in utils)
// Reusing helper from sidebar/page (should be in utils)
const getFileIcon = (type: string, title: string, size: number) => {
    const t = (type || '').toLowerCase();
    const name = (title || '').toLowerCase();

    if (t.includes('pdf') || name.endsWith('.pdf')) return <FilePdf size={size} weight="duotone" className="text-red-500" />;
    if (t.match(/(doc|word)/) || name.match(/\.(doc|docx)$/)) return <FileDoc size={size} weight="duotone" className="text-blue-500" />;
    if (t.match(/(xls|sheet|csv)/) || name.match(/\.(xls|xlsx|csv)$/)) return <FileXls size={size} weight="duotone" className="text-green-500" />;
    if (t.match(/(ppt|powerpoint)/) || name.match(/\.(ppt|pptx)$/)) return <FilePpt size={size} weight="duotone" className="text-orange-500" />;
    if (t.match(/(image|png|jpg)/) || name.match(/\.(jpg|jpeg|png|gif|webp)$/)) return <Image size={size} weight="duotone" className="text-purple-500" />;
    if (t === 'carpeta') return <Folder size={size} weight="duotone" className="text-yellow-400" />;
    if (t === 'link') return <LinkIcon size={size} weight="duotone" className="text-blue-400" />;
    if (t === 'embed') return <Code size={size} weight="duotone" className="text-slate-600" />;
    return <FileText size={size} weight="duotone" className="text-slate-400" />;
};

interface DocumentViewerProps {
    initialDoc: RepositoryFile;
    units: Unit[];
    initialMode?: 'repository' | 'view' | 'work';
    onClose?: () => void;
}

import { NotifyChangeModal } from './NotifyChangeModal';

export default function DocumentViewer({ initialDoc, units, initialMode = 'repository', onClose }: DocumentViewerProps) {
    const router = useRouter();
    const [doc, setDoc] = useState(initialDoc);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(initialMode !== 'view');
    const [sidebarMode, setSidebarMode] = useState<'comments' | 'history' | 'details'>('comments'); // Track what sidebar shows
    const [mode, setMode] = useState(initialMode);

    // Notify Modal State
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Refresh doc data logic (could just be revalidating path, but handling local state for speed)
    const refreshDoc = async () => {
        // In a real app, we might re-fetch or use router.refresh()
        router.refresh();
    };

    // Helper to check extensions (Reusing checkExt)
    const checkExt = (str: string | undefined | null, regex: RegExp) => (str || '').match(regex);
    const urlExt = doc.url?.split('?')[0].split('.').pop()?.toLowerCase();
    const isStrictOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'msword'].includes(urlExt || '');

    // Priority: If URL says it's Office, trust it over metadata
    const isImage = checkExt(doc.type, /(image|jpg|jpeg|png|gif|webp)/i) || checkExt(doc.title, /\.(jpg|jpeg|png|gif|webp)$/i) || checkExt(doc.url, /\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
    // Only treat as PDF if NOT strictly office
    const isPDF = !isStrictOffice && (checkExt(doc.type, /pdf/i) || checkExt(doc.title, /\.pdf$/i) || checkExt(doc.url, /\.pdf(\?|$)/i));
    const isVideo = checkExt(doc.type, /(video|mp4|webm|mov)/i) || checkExt(doc.title, /\.(mp4|webm|mov)$/i) || checkExt(doc.url, /\.(mp4|webm|mov)(\?|$)/i);
    const isOffice = isStrictOffice || checkExt(doc.type, /(doc|docx|xls|xlsx|ppt|pptx|msword|officedocument)/i) || checkExt(doc.title, /\.(doc|docx|xls|xlsx|ppt|pptx)$/i) || checkExt(doc.url, /\.(doc|docx|xls|xlsx|ppt|pptx)(\?|$)/i);
    const isEmbed = doc.type === 'embed';



    // Helper to ensure absolute URL for proxy consumption
    const toAbsolute = (u: string) => {
        if (!u) return '';
        if (u.startsWith('http')) return u;
        if (typeof window !== 'undefined') return `${window.location.origin}${u.startsWith('/') ? '' : '/'}${u}`;
        return u;
    };

    // Fetch secure URL for preview
    useEffect(() => {
        const fetchUrl = async () => {
            if (!doc.url) {
                console.log('[DocumentViewer] No URL found for doc:', doc);
                setLoadingPreview(false);
                return;
            }

            let docUrl = doc.url;

            // FIX: If URL is an old "bad" public URL (pointing to app domain or just /projects/), rewrite it to the proxy
            // This ensures we use the /api/storage/ route which handles R2 signing correctly.
            if (docUrl && docUrl.includes('/projects/') && !docUrl.includes('/api/storage/')) {
                const parts = docUrl.split('/projects/');
                if (parts.length > 1) {
                    docUrl = `/api/storage/projects/${parts[1]}`;
                    console.log(`[DocumentViewer] Rewriting legacy URL to proxy: ${docUrl}`);
                }
            }

            // OPTIMIZATION: If URL is already an internal storage route, use it directly (Streaming if PDF)
            if (docUrl && docUrl.includes('/api/storage/')) {
                let finalUrl = docUrl;
                if (isPDF) {
                    // Force server-side streaming to avoid CORS/Redirection issues with R2
                    finalUrl = `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}stream=true`;
                    // Ensure absolute URL for react-pdf
                    finalUrl = toAbsolute(finalUrl);
                }
                console.log('[DocumentViewer] Using internal storage path:', finalUrl);
                setPreviewUrl(finalUrl);
                setLoadingPreview(false);
                return;
            }



            console.log('[DocumentViewer] Fetching URL for:', doc.id, 'Original URL:', doc.url, 'Effective URL:', docUrl);
            try {
                // First try standard repo action
                const res = await getDocumentDownloadUrlAction(doc.id);
                if (res.success && res.url) {
                    let finalUrl = res.url;
                    // Always proxy PDFs to avoid "Access-Control-Allow-Origin" errors
                    if (isPDF) {
                        finalUrl = `/api/proxy?url=${encodeURIComponent(toAbsolute(finalUrl))}`;
                    }
                    console.log('[DocumentViewer] Final Preview URL (Repo):', finalUrl);
                    setPreviewUrl(finalUrl);
                } else {
                    // Fallback: If not found in repo (e.g. project evidence), try generic signer or proxy


                    const signRes = await getSignedUrlAction(docUrl);
                    console.log('[DocumentViewer] Signed URL result:', JSON.stringify(signRes));

                    if (signRes.success && 'url' in signRes && signRes.url) {
                        let finalUrl = signRes.url;
                        // Always proxy PDFs to avoid "Access-Control-Allow-Origin" errors
                        if (isPDF) {
                            finalUrl = `/api/proxy?url=${encodeURIComponent(toAbsolute(finalUrl))}`;
                        }
                        setPreviewUrl(finalUrl);
                    } else if (signRes.error) {
                        console.error("Signer error:", signRes.error);
                        // Silent fallback
                        let finalUrl = docUrl;
                        if (isPDF && !finalUrl.includes('/api/proxy')) {
                            finalUrl = `/api/proxy?url=${encodeURIComponent(toAbsolute(finalUrl))}`;
                        }
                        setPreviewUrl(finalUrl);
                    } else {
                        let finalUrl = docUrl;
                        if (isPDF && !finalUrl.includes('/api/proxy')) {
                            finalUrl = `/api/proxy?url=${encodeURIComponent(toAbsolute(finalUrl))}`;
                        }
                        setPreviewUrl(finalUrl);
                    }
                }
            } catch (error: any) {
                console.error("Error fetching preview URL:", error);
                setPreviewUrl(docUrl);
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
            if (onClose) onClose();
            else router.push('/dashboard/repository');
        } catch (e: any) {
            alert(e.message);
        }
    };

    const getGoogleDocsUrl = (url: string) => {
        let fullUrl = url;
        // Ensure absolute URL for Google Docs Viewer
        if (url && url.startsWith('/')) {
            if (typeof window !== 'undefined') {
                fullUrl = `${window.location.origin}${url}`;
            }
        }
        return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
    };

    // Capture State
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [pendingCommentLocation, setPendingCommentLocation] = useState<{ x: number, y: number, page: number } | null>(null);
    const [isMarking, setIsMarking] = useState(false); // New state for explicit marking mode
    const [savedComments, setSavedComments] = useState<any[]>([]); // Saved comments for markers
    const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

    // Sync savedComments from sidebar (This would realistically come from a shared context or prop if not fetched here)
    // For now, assuming DocumentViewer or Sidebar manages fetching. 
    // Actually, DocumentViewer doesn't fetch comments, RepositorySidebar does.
    // We need to either lift the state up or refetch here. 
    // Given the architecture, let's allow InteractivePDFViewer to just render what we pass.
    // We already have `savedComments` state, but it wasn't populated.
    // Let's populate it via a side-effect or prop if possible, but for now we'll rely on the fact that sidebar might need to pass it back.
    // To make this work bidirectionally without refactoring the whole sidebar, we'll listen to a custom event or shared store, but simplest is to just fetch comments here too for the markers.

    useEffect(() => {
        const loadMarkers = async () => {
            if (!doc.id) return;
            const res = await getCommentsAction(doc.id);
            if (res.success && res.data) {
                // Parse markers from comment metadata (assuming we store x,y,page there)
                // The current schema might not have x/y on comments directly unless we put it in content or a metadata field.
                // For this demo, we'll assume the API/Action supports returning 'location' or we parse it.
                // Since we don't have a 'location' column in schema yet, let's assume it's in the comment text or a specific field we added previously?
                // Wait, the Schema has separate 'location' field if we migrated, or we use JSON in 'content'? 
                // Let's use the 'data' field if available (RepositoryComment doesn't have it in standard schema but we might have added it).
                // Let's assume we map standard comments to markers if they have x/y in their `location` property (if we added it to schema).
                // If not, we might need to parse.

                // MOCKING for stability if schema isn't updated:
                // We'll trust the checked files. `commentActions.ts` implies simple comments.
                // We need to ensure we can save/load location.
                // For now, let's map what we can.
                const markers = res.data.map((c: any) => ({
                    id: c.id,
                    x: c.location?.x || 0,
                    y: c.location?.y || 0,
                    page: c.location?.page || 1,
                    content: c.content,
                    user: c.user
                })).filter((c: any) => c.x > 0 && c.y > 0);
                setSavedComments(markers);
            }
        };
        loadMarkers();
        // Poll or listen for updates?
        const interval = setInterval(loadMarkers, 5000); // Poll for now
        return () => clearInterval(interval);
    }, [doc.id]);

    const handleCommentClick = (commentId: string) => {
        setHighlightedCommentId(commentId);
        setSidebarMode('comments');
        setIsSidebarOpen(true);
        // Dispatch event or callback to scroll sidebar? 
        // We'll need to pass this state down to sidebar or use a ref.
    };

    const handleTextSelection = (text: string, rect: { x: number, y: number, page: number }) => {
        setPendingCommentLocation(rect);
        // Pre-fill comment box? We need a way to pass this "Draft" context to the sidebar.
        // For now, just open sidebar and marker.
        setSidebarMode('comments');
        setIsSidebarOpen(true);
        // Provide visual feedback
        console.log("Text selected:", text);
    };

    const handleCapture = async () => {
        const element = document.getElementById('document-preview-container');
        if (!element) return;

        try {
            // Attempt to use html2canvas with forced sRGB to avoid oklab issues if possible, 
            // though html2canvas doesn't strictly support color profiles options, we just catch the error.
            const canvas = await html2canvas(element, {
                useCORS: true,
                logging: false,
                backgroundColor: null, // Transparent
                ignoreElements: (el) => {
                    // Ignore video elements as they crash or show blank
                    return el.tagName === 'VIDEO' || el.tagName === 'IFRAME';
                }
            });
            const image = canvas.toDataURL("image/png");
            setCapturedImage(image);
            setSidebarMode('comments');
            setIsSidebarOpen(true);
        } catch (err) {
            console.error("Capture failed:", err);
            // Fallback: Proceed without image, just open comments
            alert("No se pudo generar la imagen de vista previa (contenido protegido o no compatible), pero puedes dejar tu comentario en la ubicación marcada.");
            setCapturedImage(null); // Ensure null
            setSidebarMode('comments');
            setIsSidebarOpen(true);
        }
    };

    const handleMarkingClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMarking) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100); // Percentage integer
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100); // Percentage integer

        setPendingCommentLocation({ x, y, page: 1 }); // Default page 1 for now
        console.log("Comment location set:", { x, y });

        // Disable marking mode after valid click
        setIsMarking(false);

        // Open comments sidebar if not open
        setSidebarMode('comments');
        setIsSidebarOpen(true);
    };




    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            {/* Header - Full Width */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-30 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (onClose) onClose();
                            else if (window.history.length > 2) router.back();
                            else window.close();
                        }}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <CaretLeft size={20} weight="bold" />
                    </button>
                    <div className="flex items-center gap-3">
                        {getFileIcon(doc.type || '', doc.title, 24)}
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 leading-tight truncate max-w-md">{doc.title}</h1>
                            <p className="text-xs text-slate-500 font-medium">
                                {(doc.size ? doc.size : '')} • {isClient ? new Date(doc.createdAt || Date.now()).toLocaleDateString() : ''}
                                {mode === 'view' && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">SOLO LECTURA</span>}
                                {mode === 'work' && <span className="ml-2 text-slate-400">Editando en línea • v{doc.version || '0'}</span>}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* WORK MODE ACTIONS */}
                    {mode === 'work' ? (
                        <>
                            {/* Capture - Purple Outline */}
                            <button
                                onClick={handleCapture}
                                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-lg text-xs transition-colors border border-purple-200"
                            >
                                <Camera size={18} weight="bold" />
                                <span className="hidden sm:inline">Capturar</span>
                            </button>

                            {/* Reference Mode - Toggle */}
                            <button
                                onClick={() => {
                                    if (isMarking) setIsMarking(false);
                                    else {
                                        setIsMarking(true);
                                        // Ensure sidebar is open on comments
                                        setSidebarMode('comments');
                                        setIsSidebarOpen(true);
                                    }
                                }}
                                className={`flex items-center gap-2 px-3 py-2 font-bold rounded-lg text-xs transition-colors border ${isMarking ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' : 'bg-white text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-200'}`}
                            >
                                <Crosshair size={18} weight="bold" />
                                <span className="hidden sm:inline">Referencia</span>
                            </button>

                            {/* Notify - Purple Fill/Light */}
                            <button
                                onClick={() => setShowNotifyModal(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold rounded-lg text-xs transition-colors"
                            >
                                <Bell size={18} weight="bold" />
                                <span className="hidden sm:inline">Notificar</span>
                            </button>

                            {/* History - Grey */}
                            <button
                                onClick={() => {
                                    setSidebarMode('history');
                                    setIsSidebarOpen(true);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 font-bold rounded-lg text-xs transition-all ${isSidebarOpen && sidebarMode === 'history' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                <ClockCounterClockwise size={18} weight="bold" />
                                <span className="hidden sm:inline">Historial</span>
                            </button>

                            {/* Comments - Blue */}
                            <button
                                onClick={() => {
                                    setSidebarMode('comments');
                                    setIsSidebarOpen(!isSidebarOpen || sidebarMode !== 'comments'); // Toggle if already open on comments
                                }}
                                className={`flex items-center gap-2 px-3 py-2 font-bold rounded-lg text-xs transition-all ${isSidebarOpen && sidebarMode === 'comments' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-blue-50 text-blue-600 border border-transparent hover:bg-blue-100'}`}
                            >
                                <ChatCircle size={18} weight="bold" />
                                <span className="hidden sm:inline">Comentarios</span>
                            </button>

                            {/* Download - Black */}
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors shadow-lg shadow-slate-900/10"
                            >
                                <span className="hidden sm:inline">Descargar</span>
                            </button>
                        </>
                    ) : (
                        /* VIEW/REPO MODE ACTIONS (Existing simplified) */
                        <>
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className={`flex items-center gap-2 px-3 py-2 border font-bold rounded-lg text-xs transition-all shadow-sm ${isSidebarOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:text-blue-600 hover:border-blue-200'}`}
                                title="Ver historial y detalles"
                            >
                                {isSidebarOpen ? <SidebarSimple size={18} weight="fill" /> : <ClockCounterClockwise size={18} />}
                                <span className="hidden sm:inline">Historial</span>
                            </button>

                            <button
                                onClick={() => window.open(previewUrl || doc.url || '', '_blank')}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
                            >
                                <DownloadSimple size={18} />
                                <span className="hidden sm:inline">Descargar</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content: Preview + Sidebar */}
            <div className="flex-1 flex min-h-0">
                {/* Left: Preview Area */}
                <div
                    id="document-preview-container"
                    className={`flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-100/50 relative ${mode === 'work' && isMarking ? 'cursor-crosshair' : ''}`}
                >
                    {/* CLICK OVERLAY FOR MARKING - Active only when isMarking is true */}
                    {mode === 'work' && isMarking && (
                        <div
                            className="absolute inset-0 z-[60] cursor-crosshair bg-transparent"
                            onClick={handleMarkingClick}
                        ></div>
                    )}

                    {/* Render SAVED Markers */}
                    {savedComments.map((c) => (
                        (c.x !== undefined && c.y !== undefined) && (
                            <div
                                key={c.id}
                                className="absolute z-40 w-6 h-6 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-transform hover:scale-110"
                                style={{
                                    left: `${c.x}%`,
                                    top: `${c.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSidebarMode('comments');
                                    setIsSidebarOpen(true);
                                }}
                                title={`${c.user?.name || 'Usuario'}: ${c.content}`}
                            >
                                {c.user?.initials || '?'}
                            </div>
                        )
                    ))}

                    {/* Render Pending Marker */}
                    {pendingCommentLocation && (
                        <div
                            className="absolute z-50 w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold animate-bounce pointer-events-none"
                            style={{
                                left: `${pendingCommentLocation.x}%`,
                                top: `${pendingCommentLocation.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            +
                        </div>
                    )}
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
                        /* MODE DECISION: Work vs View */
                        mode === 'work' ? (
                            <InteractivePDFViewer
                                url={previewUrl!}
                                comments={savedComments}
                                onCommentClick={handleCommentClick}
                                onTextSelect={handleTextSelection}
                                highlightedCommentId={highlightedCommentId}
                                isMarking={isMarking}
                                onMarkClick={(x, y, page) => {
                                    setPendingCommentLocation({ x, y, page });
                                    setIsMarking(false);
                                    setSidebarMode('comments');
                                    setIsSidebarOpen(true);
                                }}
                            />
                        ) : (
                            /* STANDARD PDF VIEWER (Iframe) - View Mode */
                            <div className="w-full h-full bg-white rounded-lg shadow-lg relative group">
                                <iframe
                                    src={previewUrl!}
                                    className="w-full h-full rounded-lg"
                                    title="PDF Preview"
                                />
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => window.open(previewUrl || '', '_blank')}
                                        className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg"
                                    >
                                        Abrir en nueva pestaña
                                    </button>
                                </div>
                            </div>
                        )
                    ) : isVideo ? (
                        <div className="w-full max-w-4xl bg-black rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
                            <video
                                src={previewUrl!}
                                controls
                                className="max-w-full max-h-[80vh]"
                            >
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </div>
                    ) : isEmbed && doc.content ? (
                        <div
                            className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                            dangerouslySetInnerHTML={{ __html: doc.content }}
                        />
                    ) : (isEmbed || doc.type === 'link') ? (
                        <div className="w-full h-full bg-white rounded-lg shadow-lg relative">
                            <iframe
                                src={previewUrl || doc.url || ''}
                                className="w-full h-full rounded-lg"
                                title="Web Preview"
                            />
                            <div className="absolute top-2 right-2 md:bottom-4 md:right-4 z-10">
                                <button
                                    onClick={() => window.open(previewUrl || doc.url || '', '_blank')}
                                    className="bg-white/90 hover:bg-white text-blue-600 text-xs px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 font-bold backdrop-blur-sm transition-all"
                                >
                                    Abrir sitio original ↗
                                </button>
                            </div>
                        </div>
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

                {/* Right Sidebar: Metadata & Comments */}
                {
                    isSidebarOpen && (
                        <div className="w-[400px] border-l border-slate-200 bg-white flex flex-col z-20 shadow-xl animate-in slide-in-from-right-10 duration-300">
                            <RepositorySidebar
                                doc={doc}
                                units={units}
                                mode={mode} // Pass mode
                                activeTabOverride={sidebarMode === 'history' ? 'history' : (sidebarMode === 'comments' ? 'comments' : undefined)}
                                onClose={() => setIsSidebarOpen(false)}
                                onDownload={handleDownload}
                                onUpdate={refreshDoc}
                                onAssign={() => { /* Implement if needed or use modal logic */ }}
                                onToggleLike={async (d) => { await toggleLikeAction(d.id); refreshDoc(); }}
                                onShare={() => { navigator.clipboard.writeText(doc.url || ''); alert("Link copiado!"); }}
                                onDelete={handleDelete}
                                onMove={() => { /* Implement move logic if needed */ }}
                                onExpand={() => { /* Already expanded */ }}
                                /* Propagated props for features */
                                capturedImage={capturedImage}
                                onClearCapture={() => setCapturedImage(null)}
                                pendingLocation={pendingCommentLocation}
                                onClearLocation={() => setPendingCommentLocation(null)}
                                /* Marking Props */
                                isMarking={isMarking}
                                onToggleMarking={() => {
                                    if (isMarking) setIsMarking(false);
                                    else {
                                        setIsMarking(true);
                                        // Ensure sidebar is open on comments if not already? Maybe or maybe wait for click.
                                        setSidebarMode('comments');
                                        setIsSidebarOpen(true);
                                    }
                                }}
                                onCommentsLoaded={setSavedComments}
                            />
                        </div>
                    )
                }
            </div>

            {/* Notify Modal */}
            <NotifyChangeModal
                isOpen={showNotifyModal}
                onClose={() => setShowNotifyModal(false)}
                documentId={doc.id}
                teamMembers={[]} // Pass real team members if available, or fetch in modal
            />
        </div>
    );
}
