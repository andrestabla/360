"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { RepositoryFile } from '@/app/lib/repositoryActions';
import { User } from '@/lib/data';
import './AnnotationLayer.css';
import './TextLayer.css';

// Ensure worker is configured (Redundant safety check)
if (typeof window !== 'undefined' && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

const pdfOptions = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
};

interface CommentMarker {
    id: string;
    x: number;
    y: number;
    page: number; // 1-indexed
    content: string;
    user?: User;
}

interface InteractivePDFViewerProps {
    url: string;
    comments: CommentMarker[];
    onCommentClick: (commentId: string) => void;
    onTextSelect: (text: string, rect: { x: number, y: number, page: number }) => void;
    highlightedCommentId: string | null;
    isMarking: boolean;
    onMarkClick: (x: number, y: number, page: number) => void;
}

export default function InteractivePDFViewer({
    url,
    comments,
    onCommentClick,
    onTextSelect,
    highlightedCommentId,
    isMarking,
    onMarkClick
}: InteractivePDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.2);
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectionRect, setSelectionRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handleMouseUp = (e: React.MouseEvent, pageNumber: number) => {
        // 1. Check for text selection
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Convert to relative coords inside the Page container
            // We need the page element to normalize
            const pageEl = e.currentTarget.closest('.react-pdf__Page');
            if (pageEl) {
                const pageRect = pageEl.getBoundingClientRect();

                // Calculate percentage relative to page
                // We use the center of the selection for the marker
                const relX = ((rect.left + rect.width / 2 - pageRect.left) / pageRect.width) * 100;
                const relY = ((rect.top - pageRect.top) / pageRect.height) * 100;

                onTextSelect(selection.toString(), { x: Math.round(relX), y: Math.round(relY), page: pageNumber });

                // Clear selection native highlight if desired, or keep it
                // selection.removeAllRanges(); 
            }
        }
    };

    const handlePageClick = (e: React.MouseEvent) => {
        if (!isMarking) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

        // Assume single page view or find page number context
        // For simplicity in this v1, we assume Page 1 or context passed
        // Ideally we attach this handler to the Page component itself
    };

    return (
        <div className="flex flex-col items-center w-full min-h-full pb-20 relative bg-slate-500/10 overflow-auto" ref={containerRef}>
            {/* Controls (Floating) */}
            <div className="sticky top-4 z-50 flex gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg mb-4">
                <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="px-2 font-bold text-slate-600 hover:text-blue-600">-</button>
                <span className="text-xs font-bold text-slate-500 py-1">{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} className="px-2 font-bold text-slate-600 hover:text-blue-600">+</button>
            </div>

            <Document
                file={url}
                options={pdfOptions}
                className="flex flex-col items-center p-4 gap-4"
                loading={<div className="animate-pulse text-slate-400 mt-10">Cargando documento...</div>}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(e) => console.error("PDF LOAD ERROR:", e)}
                error={
                    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] gap-4 p-8">
                        <div className="text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                            ⚠️ Error cargando motor interactivo
                        </div>
                        <p className="text-xs text-slate-400">Mostrando vista clásica (iframe) por seguridad.</p>
                        <iframe
                            src={url}
                            className="w-full h-[800px] border border-slate-200 rounded-lg shadow-sm bg-white"
                            title="PDF Fallback"
                        />
                    </div>
                }
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="relative shadow-xl">
                        <Page
                            pageNumber={index + 1}
                            scale={scale}
                            onClick={(e) => {
                                if (isMarking) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                    onMarkClick(x, y, index + 1);
                                }
                            }}
                            onMouseUp={(e) => handleMouseUp(e, index + 1)}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        >
                            {/* RENDER MARKERS FOR THIS PAGE */}
                            {comments
                                .filter(c => (c.page || 1) === (index + 1))
                                .map(c => {
                                    const isHighlighted = highlightedCommentId === c.id;
                                    return (
                                        <div
                                            key={c.id}
                                            className={`absolute z-40 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300
                                                ${isHighlighted
                                                    ? 'w-8 h-8 bg-blue-600 text-white scale-125 z-50 ring-4 ring-blue-500/30'
                                                    : 'w-6 h-6 bg-yellow-400 text-yellow-900 hover:scale-110 hover:bg-yellow-300'
                                                }
                                            `}
                                            style={{
                                                left: `${c.x}%`,
                                                top: `${c.y}%`,
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCommentClick(c.id);
                                            }}
                                            title={`${c.user?.name || 'Usuario'}: ${c.content}`}
                                        >
                                            {c.user?.initials || (c.user?.name ? c.user.name.substring(0, 2).toUpperCase() : '?')}
                                        </div>
                                    );
                                })
                            }

                            {/* PENDING MARKER (Phantom) */}
                            {isMarking && (
                                <div className="absolute inset-0 cursor-crosshair z-30" />
                            )}
                        </Page>
                    </div>
                ))}
            </Document>
        </div>
    );
}
