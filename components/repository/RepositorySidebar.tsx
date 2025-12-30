'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, DownloadSimple, PencilSimple, ChatCircle, Eye, FloppyDisk, Check, Star, ShareNetwork, ClipboardText, DotsThreeVertical, Trash, FolderMinus, CaretDown, PaperPlaneRight } from '@phosphor-icons/react';
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
    onClose: () => void;
    onDownload: (doc: RepositoryFile) => void;
    onUpdate: () => void; // Trigger refresh
    onAssign: (doc: RepositoryFile) => void; // New
    onToggleLike: (doc: RepositoryFile) => void; // New
    onShare: (doc: RepositoryFile) => void; // New
    onDelete: (doc: RepositoryFile) => void; // New
    onMove: (doc: RepositoryFile) => void; // New
    onExpand: (doc: RepositoryFile) => void; // New
}

export function RepositorySidebar({ doc, units, onClose, onDownload, onUpdate, onAssign, onToggleLike, onShare, onDelete, onMove, onExpand }: RepositorySidebarProps) {
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'comments'>('view');
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-1">
                    <button onClick={() => onToggleLike(doc)} title={doc.likes ? "Quitar favorito" : "Marcar favorito"} className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${doc.likes ? 'text-yellow-400' : 'text-slate-400'}`}>
                        <Star size={20} weight={doc.likes ? "fill" : "regular"} />
                    </button>
                    <button onClick={() => onShare(doc)} title="Compartir" className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors">
                        <ShareNetwork size={20} />
                    </button>
                    {/* <button onClick={() => onAssign(doc)} title="Asignar Tarea" className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition-colors">
                        <ClipboardText size={20} />
                    </button> */}
                    <button onClick={() => onExpand(doc)} title="Pantalla Completa" className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye size={20} />
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <DotsThreeVertical size={20} weight="bold" />
                        </button>
                        {showMoreMenu && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 origin-top-left animate-in fade-in zoom-in-95 duration-200">
                                <button onClick={() => { setShowMoreMenu(false); onClose(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                    <X size={16} /> Contraer Panel
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
                </div>

                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 ml-auto">
                    <X size={24} />
                </button>
            </div>

            {/* Tabs */}
            <div className="px-4 py-2 border-b border-slate-100 bg-white">
                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                    <TabButton active={activeTab === 'view'} onClick={() => setActiveTab('view')} label="Ver" />
                    <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} label="Editar" />
                    <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label="Comentarios" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
                {activeTab === 'view' && <ViewTab doc={doc} onDownload={() => onDownload(doc)} />}
                {activeTab === 'edit' && <EditTab doc={doc} units={units} onUpdate={onUpdate} />}
                {activeTab === 'comments' && <CommentsTab doc={doc} />}
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

function ViewTab({ doc, onDownload }: { doc: RepositoryFile, onDownload: () => void }) {
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
                <InfoRow label="Unidad" value={doc.unitId || 'General'} />
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


function CommentsTab({ doc }: { doc: RepositoryFile }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
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
        setComments(prev => [optimisticComment, ...prev]); // Prepending for newest first if list is distinct, but usually chat is chronological. 
        // Wait, typical comments are reverse chrono? Or chat style?
        // Let's assume standard comment feed: Newest at TOP or Bottom?
        // Code in action does orderBy(desc(createdAt)), so Newest FIRST.

        try {
            await createCommentAction(doc.id, newComment);
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
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-300"></div></div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-10 text-center h-full">
                        <ChatCircle size={48} className="mb-4 text-slate-200" weight="duotone" />
                        <p className="font-medium text-slate-600">Sin comentarios</p>
                        <p className="text-xs">Sé el primero en opinar.</p>
                    </div>
                ) : (
                    comments.map((c: any) => (
                        <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                                {c.user?.initials || c.user?.name?.substring(0, 2).toUpperCase() || '?'}
                            </div>
                            <div className="bg-white p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-100 shadow-sm flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-700">{c.user?.name || 'Usuario'}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-slate-600">{c.content}</p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                <div className="relative">
                    <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={sending || !newComment.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                        <PaperPlaneRight weight="bold" size={16} />
                    </button>
                </div>
            </form>
        </div>
    )
}
