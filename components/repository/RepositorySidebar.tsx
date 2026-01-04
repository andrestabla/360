'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, DownloadSimple, PencilSimple, ChatCircle, Eye, FloppyDisk, Check, Star, ShareNetwork, ClipboardText, DotsThreeVertical, Trash, FolderMinus, CaretDown, PaperPlaneRight, CaretDoubleRight, ClockCounterClockwise, Smiley, Paperclip, Plus, MapPin } from '@phosphor-icons/react';
import { RepositoryFile, updateDocumentMetadataAction } from '@/app/lib/repositoryActions';
import { createCommentAction, getCommentsAction } from '@/app/lib/commentActions';
import { Unit } from '@/shared/schema';
import { FilePdf, FileDoc, FileXls, FilePpt, Image, Link as LinkIcon, Code, FileText, Folder } from '@phosphor-icons/react';

// Helper reuse (moved to utils in real app)
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

interface RepositorySidebarProps {
    doc: RepositoryFile;
    units: Unit[];
    mode?: 'repository' | 'view' | 'work'; // Add mode
    onClose: () => void;
    onDownload: (doc: RepositoryFile) => void;
    onUpdate: () => void; // Trigger refresh
    onAssign: (doc: RepositoryFile) => void; // New
    onToggleLike: (doc: RepositoryFile) => void; // New
    onShare: (doc: RepositoryFile) => void; // New
    onDelete: (doc: RepositoryFile) => void; // New
    onMove: (doc: RepositoryFile) => void; // New
    onExpand: (doc: RepositoryFile) => void; // New
    activeTabOverride?: 'view' | 'edit' | 'comments' | 'history';
    // New Props for Features
    capturedImage?: string | null;
    onClearCapture?: () => void;
    pendingLocation?: { x: number, y: number, page: number } | null;
    onClearLocation?: () => void;
    // New Marking Props
    isMarking?: boolean;
    onToggleMarking?: () => void;
}

export function RepositorySidebar({ doc, units, mode = 'repository', activeTabOverride, onClose, onDownload, onUpdate, onAssign, onToggleLike, onShare, onDelete, onMove, onExpand, capturedImage, onClearCapture, pendingLocation, onClearLocation, isMarking, onToggleMarking }: RepositorySidebarProps) {
    // In 'view' mode, we default to history and show NOTHING else (per user request).
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'comments' | 'history'>(
        activeTabOverride || (mode === 'view' ? 'history' : (mode === 'work' ? 'comments' : 'view'))
    );

    // Sync override
    useEffect(() => {
        if (activeTabOverride) setActiveTab(activeTabOverride);
    }, [activeTabOverride]);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Initial favorite state - ideally passed as prop or fetched.
    // For now, if likes > 0 we'll assume it's liked for UI demonstration if not per-user data available yet.
    // Actually, onToggleLike will handle the real logic.

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        onToggleLike(doc);
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Top Toolbar - Updated for new UI requirements */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-1">
                    {/* In View/History mode, maybe hide actions except close? User said "no debe desplegar más opciones". 
                        Let's keep close but maybe hide others if truly "exclusive". 
                        The request says "The option History must display exclusively previous versions... not display more options or views".
                        Safest is to hide the toolbar actions in 'view' mode too, keeping only Close.
                    */}
                    {mode !== 'view' && (
                        <>
                            <button
                                onClick={handleToggleFavorite}
                                title={isFavorite ? "Quitar favorito" : "Marcar favorito"}
                                className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${isFavorite ? 'text-yellow-400' : 'text-slate-400'}`}
                            >
                                <Star size={20} weight={isFavorite ? "fill" : "regular"} />
                            </button>

                            {/* Show Share and Menu ONLY in repository mode (not in work mode) */}
                            {mode !== 'work' && (
                                <>
                                    <button onClick={() => onShare(doc)} title="Compartir enlace" className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors">
                                        <ShareNetwork size={20} />
                                    </button>

                                    <div className="relative">
                                        <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                                            <DotsThreeVertical size={20} weight="bold" />
                                        </button>
                                        {showMoreMenu && (
                                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 origin-top-left animate-in fade-in zoom-in-95 duration-200">
                                                <button onClick={() => { setShowMoreMenu(false); onClose(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                                    <CaretDoubleRight size={16} /> Contraer Panel
                                                </button>
                                                <button onClick={() => { setShowMoreMenu(false); setActiveTab('edit'); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                                    <PencilSimple size={16} /> Editar Metadatos
                                                </button>
                                                <button onClick={() => { setShowMoreMenu(false); onAssign(doc); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-blue-600">
                                                    <ClipboardText size={16} /> Asignar Tarea
                                                </button>
                                                <hr className="border-slate-100 my-1" />
                                                <button onClick={() => { setShowMoreMenu(false); onMove(doc); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                                    <FolderMinus size={16} /> Mover a Carpeta
                                                </button>
                                                <button onClick={() => { setShowMoreMenu(false); onDelete(doc); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2">
                                                    <Trash size={16} /> Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Show Edit Pencil ONLY in work mode */}
                            {mode === 'work' && (
                                <button
                                    onClick={() => setActiveTab('edit')}
                                    title="Editar Metadatos"
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <PencilSimple size={20} weight="bold" />
                                </button>
                            )}
                        </>
                    )}
                    {mode === 'view' && <span className="text-sm font-bold text-slate-500 px-2">Historial de Versiones</span>}
                </div>

                <button onClick={onClose} title="Contraer panel" className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 ml-auto">
                    <CaretDoubleRight size={24} />
                </button>
            </div>

            {/* Tabs - Only show in default repository mode, not in 'view' (read-only) or 'work' (toolbar nav) */}
            {mode === 'repository' && (
                <div className="px-4 py-2 border-b border-slate-100 bg-white">
                    <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                        <TabButton active={activeTab === 'view'} onClick={() => setActiveTab('view')} label="Ver" />
                        <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} label="Editar" />
                        <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label="Comentarios" />
                        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Historial" />
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
                {activeTab === 'view' && <ViewTab doc={doc} units={units} onDownload={() => onDownload(doc)} />}
                {activeTab === 'edit' && <EditTab doc={doc} units={units} onUpdate={onUpdate} />}
                {activeTab === 'comments' && mode !== 'view' && <CommentsTab doc={doc} mode={mode} capturedImage={capturedImage} onClearCapture={onClearCapture} pendingLocation={pendingLocation} onClearLocation={onClearLocation} isMarking={isMarking} onToggleMarking={onToggleMarking} />}
                {activeTab === 'history' && <HistoryTab doc={doc} mode={mode} onUpdate={onUpdate} />}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 px-4 py-2 text-xs font-bold rounded-lg transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
        >
            {label}
        </button>
    );
}

// --- TABS ---

// Update ViewTab signature to accept units
function ViewTab({ doc, units, onDownload }: { doc: RepositoryFile, units: Unit[], onDownload: () => void }) {
    // Lookup unit name
    const unitName = units.find(u => u.id === doc.unitId)?.name || 'General';

    return (
        <div className="p-6">
            <div className="flex items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl mb-8 shadow-sm">
                {getFileIcon(doc.type || '', 80)}
            </div>

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{doc.title}</h2>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded tracking-wide">
                        {doc.type}
                    </span>
                </div>
            </div>

            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100">
                <InfoRow label="Tamaño" value={doc.size || 'N/A'} />
                <InfoRow label="Unidad" value={unitName} />
                {/* <InfoRow label="Subido por" value="Andrés Tabla" />  */}
                <InfoRow label="Fecha" value={new Date(doc.createdAt || Date.now()).toLocaleDateString()} />
                {doc.type === 'document' && doc.process && <InfoRow label="Proceso" value={doc.process} />}
                {/* Hack: itemType isn't strictly on RepositoryFile but useful if added later */}
            </div>

            <button
                onClick={onDownload}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <DownloadSimple size={20} weight="bold" />
                Descargar Archivo
            </button>
        </div>
    );
}

function InfoRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs font-medium text-slate-500 uppercase">{label}</span>
            <span className="text-sm font-semibold text-slate-700 text-right truncate max-w-[60%]">{value}</span>
        </div>
    )
}

function EditTab({ doc, units, onUpdate }: { doc: RepositoryFile, units: Unit[], onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: doc.title || '',
        description: doc.content || '', // Mapping content to description
        unitId: doc.unitId || '',
        process: doc.process || '',
        keywords: Array.isArray(doc.tags) ? doc.tags.join(', ') : '',
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString().split('T')[0] : '',
        color: '#3b82f6' // Default logic or stored
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateDocumentMetadataAction(doc.id, {
                title: formData.title,
                unitId: formData.unitId || undefined,
                process: formData.process,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
                tags: formData.keywords.split(',').map(s => s.trim()).filter(Boolean),
                description: formData.description
            });
            onUpdate();
            alert('Metadatos actualizados');
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-4">
                <PencilSimple size={16} /> Editar Metadatos
            </h3>

            <div className="space-y-4">
                <InputGroup label="Nombre del Documento">
                    <input
                        value={formData.title}
                        onChange={e => handleChange('title', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </InputGroup>

                <InputGroup label="Descripción">
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => handleChange('description', e.target.value)}
                        placeholder="Añade una descripción..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Unidad / Subárea">
                        <select
                            value={formData.unitId}
                            onChange={e => handleChange('unitId', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                            <option value="">General</option>
                            {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Proceso">
                        <input
                            value={formData.process}
                            onChange={e => handleChange('process', e.target.value)}
                            placeholder="Ej: Auditoría"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </InputGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Palabras Clave">
                        <input
                            value={formData.keywords}
                            onChange={e => handleChange('keywords', e.target.value)}
                            placeholder="Ej: Auditoría, 2024"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </InputGroup>
                    <InputGroup label="Expiración">
                        <input
                            type="date"
                            value={formData.expiresAt}
                            onChange={e => handleChange('expiresAt', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </InputGroup>
                </div>

            </div>

            <div className="pt-4 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}

function InputGroup({ label, children }: any) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
            {children}
        </div>
    )
}


function CommentsTab({ doc, mode, capturedImage, onClearCapture, pendingLocation, onClearLocation, isMarking, onToggleMarking }: { doc: RepositoryFile, mode: string, capturedImage?: string | null, onClearCapture?: () => void, pendingLocation?: any, onClearLocation?: () => void, isMarking?: boolean, onToggleMarking?: () => void }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadComments = async () => {
        try {
            const res = await getCommentsAction(doc.id);
            if (res.success && res.data) setComments(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => {
        loadComments();
    }, [doc.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newComment.trim()) return;

        setSending(true);
        // Optimistic update
        const tempId = Date.now();
        const optimisticComment = {
            id: tempId,
            content: newComment,
            createdAt: new Date(),
            user: { name: 'Tú', initials: 'YO' } // Placeholder until reload or refined auth context
        };
        setComments(prev => [optimisticComment, ...prev]);

        try {
            let finalContent = newComment;

            if (capturedImage) {
                finalContent += `\n\n[Captura de Pantalla Adjunta]`;
                if (onClearCapture) onClearCapture();
            }

            await createCommentAction(doc.id, finalContent, {
                x: pendingLocation?.x,
                y: pendingLocation?.y,
                page: pendingLocation?.page,
                version: doc.version || undefined
            });

            if (onClearLocation) onClearLocation();
            setNewComment('');
            loadComments(); // Refresh for real data
        } catch (e) {
            console.error(e);
            alert('Error al enviar comentario');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header with Counter */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Comentarios</h3>
                <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full text-xs">
                    {comments.length}
                </span>
            </div>

            {/* Comments List / Empty State */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-300"></div></div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-full text-slate-500 mt-20">
                        <p className="text-sm font-medium text-slate-400 mb-1">No hay comentarios aún.</p>
                        <p className="text-xs text-slate-400 max-w-[200px]">Selecciona texto o escribe abajo para comentar.</p>
                    </div>
                ) : (
                    comments.map((c: any) => (
                        <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                                {c.user?.initials || c.user?.name?.substring(0, 2).toUpperCase() || '?'}
                            </div>
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-700">{c.user?.name || 'Usuario'}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-slate-600">{c.content}</p>
                                {c.x && (
                                    <div className="mt-2 text-[10px] text-blue-500 flex items-center gap-1">
                                        <MapPin weight="fill" /> Marcador en documento
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex flex-col gap-3">

                {/* Reference Input (Only in WORK mode) */}
                {mode === 'work' && (
                    <div className="w-full space-y-2">
                        <div className="flex gap-2 items-center">
                            {/* Mark Button */}
                            {onToggleMarking && (
                                <button
                                    type="button"
                                    onClick={onToggleMarking}
                                    className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 flex-1 justify-center border ${isMarking
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md animate-pulse'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                >
                                    <MapPin size={16} weight={isMarking ? 'fill' : 'bold'} />
                                    {isMarking ? 'Haz clic en el documento...' : 'Marcar Referencia'}
                                </button>
                            )}
                        </div>

                        {/* Location Indicator */}
                        {pendingLocation && (
                            <div className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                                <span className="flex items-center gap-2">
                                    <MapPin weight="fill" size={14} />
                                    <b>Ubicación guardada</b>
                                </span>
                                <button type="button" onClick={onClearLocation} className="text-blue-400 hover:text-blue-600"><X size={12} /></button>
                            </div>
                        )}
                        {/* Capture Indicator */}
                        {capturedImage && (
                            <div className="relative w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                                <img src={capturedImage} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">Captura Adjunta</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClearCapture}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 text-slate-500 hover:text-red-500 shadow-sm"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <input
                            placeholder="Referencia (ej: Pág 2)..."
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                )}

                {/* Textarea */}
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        rows={3}
                        className="w-full pl-3 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <div className="absolute right-2 bottom-2 flex gap-1">
                        {/* Emoji Picker Trigger */}
                        <div className="relative">
                            <button
                                type="button"
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                            >
                                <Paperclip size={20} weight="bold" />
                            </button>

                            {/* Simple Custom Emoji Picker */}
                            {showEmojiPicker && (
                                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded-xl shadow-xl border border-slate-100 grid grid-cols-5 gap-1 z-50 w-48 animate-in fade-in zoom-in-95">
                                    {['👍', '👎', '🎉', '🔥', '❤️', '👀', '✅', '❌', '😊', '🤔', '🚀', '⚠️', '📝', '👏', '🙌'].map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                setNewComment(prev => prev + emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-50 rounded-lg transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Send Button */}
                        <button
                            type="button"
                            onClick={() => handleSend()}
                            disabled={!newComment.trim()}
                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <PaperPlaneRight size={16} weight="bold" />
                        </button>
                    </div>
                </div>
            </form>
        </div >
    )
}

import { getDocumentVersionsAction, uploadNewVersionAction } from '@/app/lib/repositoryActions';
import { UploadSimple } from '@phosphor-icons/react';

function HistoryTab({ doc, mode, onUpdate }: { doc: RepositoryFile, mode: string, onUpdate?: () => void }) {
    const [versions, setVersions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load versions
        // Since getDocumentVersionsAction was added to repositoryActions.ts in previous step, we can call it.
        // But wait, I might have added it to 'app/lib/repositoryActions.ts' but the import calls it 'app/actions/repositoryActions'.
        // I need to be careful with imports. I'll use the one I edited: '@/app/lib/repositoryActions'.

        async function load() {
            // @ts-ignore - dynamic import fix if needed or just standard
            const { getDocumentVersionsAction } = await import('@/app/lib/repositoryActions');
            const res = await getDocumentVersionsAction(doc.id);
            if (res.success && res.data) setVersions(res.data);
            setLoading(false);
        }
        load();
    }, [doc.id]);

    const handleUploadVersion = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm(`¿Subir "${file.name}" como nueva versión?`)) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('docId', doc.id);
            formData.append('file', file);
            formData.append('changeLog', 'Actualización manual');

            const { uploadNewVersionAction } = await import('@/app/lib/repositoryActions');
            const res = await uploadNewVersionAction(formData);

            if (res.success) {
                alert(`Nueva versión ${res.version} cargada exitosamente.`);
                if (onUpdate) onUpdate();
            } else {
                alert('Error: ' + res.error);
            }
        } catch (err: any) {
            console.error(err);
            alert('Error al subir versión');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-6">
            {(mode === 'work' || mode === 'repository') && (
                <div className="mb-6">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleUploadVersion}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-50"
                    >
                        {loading ? 'Subiendo...' : <><UploadSimple size={16} weight="bold" /> Cargar Nueva Versión</>}
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {/* Current version */}
                <div className="flex items-start gap-3 relative pl-4 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Versión {doc.version || '1.0'} <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded ml-1">ACTUAL</span></p>
                        <p className="text-xs text-slate-500 mt-0.5">Editado por {(doc as any).owner?.name || 'Usuario'} • {new Date(doc.updatedAt || doc.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* History list */}
                {versions.map((v: any) => (
                    <div key={v.id} className="flex items-start gap-3 relative pl-4 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0 opacity-75 hover:opacity-100 transition-opacity">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                        <div>
                            <p className="text-sm font-bold text-slate-600">Versión {v.version}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Subido por {v.creator?.name || 'Usuario'} • {new Date(v.createdAt).toLocaleDateString()}</p>
                            <a href={v.url} target="_blank" className="text-[10px] text-blue-500 hover:underline mt-1 inline-block">Ver Archivo</a>
                        </div>
                    </div>
                ))}

                {versions.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                        No hay versiones anteriores.
                    </div>
                )}
            </div>
        </div>
    );
}
