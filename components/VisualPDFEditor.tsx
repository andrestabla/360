'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MapPin, PlusCircle, ChatCircle } from '@phosphor-icons/react';

// Vital: Configure PDF.js worker
console.log("Configuring PDF Worker to local file: /pdf.worker.js");
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface CommentType {
    id: string;
    userName: string;
    content: string;
    date: string;
    position?: {
        page: number; // 1-indexed to match PDF
        x: number; // Percentage 0-100
        y: number; // Percentage 0-100
    };
}

interface VisualPDFEditorProps {
    url: string;
    comments?: CommentType[];
    selectedCommentId?: string | null;
    onCommentClick?: (commentId: string) => void;
    onCanvasClick?: (pos: { page: number, x: number, y: number }) => void;
    pendingMarker?: { page: number, x: number, y: number } | null;
}

export default function VisualPDFEditor({
    url,
    comments = [],
    selectedCommentId,
    onCommentClick,
    onCanvasClick,
    pendingMarker
}: VisualPDFEditorProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.0);
    const [pdfSource, setPdfSource] = useState<string | { data: Uint8Array } | null>(null);
    const [loadError, setLoadError] = useState<Error | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Prevent unnecessary reloads by memoizing options
    const options = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
    }), []);

    // Convert Data URL to format react-pdf can handle safely (Blob URL)
    useEffect(() => {
        let objectUrl: string | null = null;

        // Reset state on url change to prevent stale render attempts
        setPdfSource(null);
        setLoadError(null);

        if (url.startsWith('data:')) {
            // Convert Data URL to Blob URL (safer for React re-renders)
            fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    objectUrl = URL.createObjectURL(blob);
                    setPdfSource(objectUrl);
                })
                .catch(err => {
                    console.error('Error converting Data URL:', err);
                    setLoadError(err);
                });
        } else {
            // Regular URL
            setPdfSource(url);
        }

        // Cleanup Blob URL on unmount or url change
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [url]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handlePageClick = (e: React.MouseEvent, pageIndex: number) => {
        if (!onCanvasClick) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        onCanvasClick({ page: pageIndex + 1, x, y });
    };

    if (!pdfSource && !loadError) {
        return (
            <div className="bg-slate-200 h-full w-full flex items-center justify-center">
                <div className="text-slate-500 font-bold animate-pulse">Preparando documento...</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-200 h-full w-full overflow-y-auto flex justify-center p-8" ref={containerRef}>
            <div className="max-w-3xl w-full">
                <Document
                    file={pdfSource}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => {
                        console.error("PDF Load Error:", error);
                        setLoadError(error);
                    }}
                    className="flex flex-col gap-4 items-center"
                    loading={<div className="text-slate-500 font-bold animate-pulse mt-10">Cargando PDF...</div>}
                    error={
                        <div className="text-center mt-10 p-6 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
                            <div className="text-red-500 font-bold mb-2">Error al cargar el PDF</div>
                            <p className="text-xs text-red-600 mb-2">
                                {loadError?.message || (url.startsWith('data:')
                                    ? 'El archivo puede estar corrupto o no ser un PDF válido.'
                                    : 'Verifica que la URL sea válida y permita CORS.')}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                                Src: {url.substring(0, 30)}...
                            </p>
                        </div>
                    }
                    options={options}
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="relative group shadow-lg">
                            <Page
                                pageNumber={index + 1}
                                width={containerRef.current ? Math.min(containerRef.current.offsetWidth - 64, 800) : 600}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                onClick={(e) => handlePageClick(e, index)}
                                className="bg-white cursor-crosshair"
                            />

                            {/* Render Comments for this Page */}
                            {comments.filter(c => c.position?.page === index + 1).map(c => (
                                <div
                                    key={c.id}
                                    onClick={(e) => { e.stopPropagation(); onCommentClick?.(c.id); }}
                                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 z-10 
                                        ${selectedCommentId === c.id ? 'z-20 scale-125' : ''}`}
                                    style={{ left: `${c.position!.x}%`, top: `${c.position!.y}%` }}
                                >
                                    <div className={`
                                        w-8 h-8 rounded-full shadow-md flex items-center justify-center border-2 
                                        ${selectedCommentId === c.id
                                            ? 'bg-blue-600 border-white text-white rotate-[360deg] transition-transform duration-500'
                                            : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'}
                                    `}>
                                        <div className="text-xs font-bold">{c.userName.substring(0, 1)}</div>
                                        {/* Tooltip */}
                                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity">
                                            {c.userName}
                                        </div>
                                    </div>

                                    {/* Connectivity Line (Simulated via SVG overlay if sidebar matches?) 
                                        Actually pure CSS lines to sidebar are hard. Highlighting the pin is usually enough.
                                    */}
                                </div>
                            ))}

                            {/* Pending Marker */}
                            {pendingMarker?.page === index + 1 && (
                                <div
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce"
                                    style={{ left: `${pendingMarker.x}%`, top: `${pendingMarker.y}%` }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shadow-lg flex items-center justify-center text-yellow-900">
                                        <PlusCircle size={20} weight="fill" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}
