'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { DB, Doc, RepoFolder } from '@/lib/data';
import {
    FilePdf, FileDoc, FileXls, FileText, MagnifyingGlass,
    UploadSimple, DownloadSimple, Eye, Trash, ClockCounterClockwise,
    Lock, ShareNetwork, Globe, Buildings, DotsThree,
    X, Heart, ChatCircle, UserCircle, CaretRight, ShieldCheck,
    Funnel, Check, ArrowsDownUp, Paperclip, Clock, GridFour, ListDashes, ListChecks, User, ArrowsOutSimple, ArrowsInSimple,
    Link as LinkIcon, YoutubeLogo, Folder, FolderPlus, CaretLeft, Palette, Info, PencilSimple, CloudArrowUp,
    FilePpt
} from '@phosphor-icons/react';

// Tipos para Filtros Avanzados
type FilterState = {
    search: string;
    type: string | null;
    unit: string | null;
    process: string | null;
    status: 'APPROVED' | 'DRAFT' | 'REVIEW' | null;
    onlyFavorites: boolean;
};

const DOC_TYPES = ['pdf', 'doc', 'xls', 'ppt', 'carpeta'];

// Helper para iconos
const getFileIcon = (type: string, size: number) => {
    const t = type.toLowerCase();
    if (t.includes('pdf')) return <FilePdf size={size} weight="duotone" className="text-red-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileDoc size={size} weight="duotone" className="text-blue-500" />;
    if (t.includes('xls') || t.includes('sheet')) return <FileXls size={size} weight="duotone" className="text-green-500" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <FilePpt size={size} weight="duotone" className="text-orange-500" />;
    if (t === 'carpeta') return <Folder size={size} weight="duotone" className="text-yellow-400" />;
    return <FileText size={size} weight="duotone" className="text-slate-400" />;
};

const getVisibilityBadge = (v: string) => {
    if (v === 'public') return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-200 bg-green-50 text-green-600 flex items-center gap-1"><Globe weight="bold" /> Global</span>;
    if (v === 'unit') return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-600 flex items-center gap-1"><Buildings weight="bold" /> Unidad</span>;
    return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500 flex items-center gap-1"><Lock weight="bold" /> Privado</span>;
};


export default function RepositoryPage() {
    const {
        currentUser, uploadDoc, updateDoc, deleteDoc,
        toggleDocLike, addDocComment, createRepoFolder, updateRepoFolder, deleteRepoFolder, version
    } = useApp();
    const { t } = useTranslation();

    // --- Estado Global ---
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState<RepoFolder | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        search: '', type: null, unit: null, process: null, status: null, onlyFavorites: false
    });
    const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);

    const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [fullScreenDoc, setFullScreenDoc] = useState<Doc | null>(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [docToMove, setDocToMove] = useState<Doc | null>(null);

    // Task Assignment Logic
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [targetDoc, setTargetDoc] = useState<Doc | null>(null);
    const handleAssign = (doc: Doc) => { setTargetDoc(doc); setShowTaskModal(true); };
    const handleCreateTask = (data: any) => {
        const newTask: any = {
            id: `task-${Date.now()}`,
            workflowId: 'ADHOC',
            title: `${data.action}: ${targetDoc?.title}`,
            status: 'IN_PROGRESS',
            creatorId: currentUser!.id,
            assigneeId: data.userId,
            unit: 'Repository',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: { docId: targetDoc?.id, action: data.action, note: data.note },
            history: [{ status: 'RECEIVED', by: currentUser!.name, date: new Date().toISOString(), comment: 'Tarea creada desde repositorio' }],
            comments: []
        };
        DB.workflowCases.unshift(newTask);
        setShowTaskModal(false);
        setTargetDoc(null);
        alert(`Tarea "${newTask.title}" asignada correctamente.`);
    };

    // Helper for dropdown toggling avoiding propagation issues
    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdown(prev => prev === id ? null : id);
    };

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);
    // Para simplificar, asumimos unidades globales
    const tenantUnits = useMemo(() => DB.units, []);

    // --- Atajos ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape') setSelectedDoc(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedDoc]);

    // --- Lógica de Filtrado ---
    const hasActiveFilters = filters.type || filters.onlyFavorites || filters.search || filters.unit || filters.process;

    const currentFolder = useMemo(() => {
        if (!currentFolderId) return null;
        return DB.repoFolders.find(f => f.id === currentFolderId) || null;
    }, [currentFolderId, version]);

    const filteredFolders = useMemo(() => {
        // Filtro por tipo
        if (filters.type && filters.type !== 'carpeta') {
            return []; // Si filtramos por PDF, no mostramos carpetas
        }

        // Si hay búsqueda o filtros activos, mostramos todas las carpetas que coincidan
        if (hasActiveFilters) {
            let f = DB.repoFolders;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                f = f.filter(fol => fol.name.toLowerCase().includes(q) || (fol.description || '').toLowerCase().includes(q));
            }
            if (filters.unit) f = f.filter(fol => fol.unit === filters.unit);
            if (filters.process) f = f.filter(fol => fol.process === filters.process);
            return f;
        }

        // Si no hay filtros, mostramos solo las carpetas del nivel actual
        return DB.repoFolders.filter(fol => fol.parentId === currentFolderId);
    }, [currentFolderId, filters, hasActiveFilters, version]);

    const filteredDocs = useMemo(() => {
        let d = DB.docs; // Todos los docs (Single Tenant)

        if (currentUser && currentUser.level > 1) {
            d = d.filter(doc => {
                if (doc.authorId === currentUser.id) return true;
                if (doc.visibility === 'public') return true;
                if (doc.visibility === 'unit' && doc.unit === currentUser.unit) return true;
                return false;
            });
        }

        if (hasActiveFilters) {
            if (filters.search) {
                const q = filters.search.toLowerCase();
                d = d.filter(doc => doc.title.toLowerCase().includes(q) || doc.unit.toLowerCase().includes(q));
            }
            if (filters.type) {
                if (filters.type === 'carpeta') return []; // Si filtramos por carpetas, no mostramos docs
                d = d.filter(doc => doc.type.toLowerCase().includes(filters.type!));
            }
            if (filters.unit) d = d.filter(doc => doc.unit === filters.unit);
            if (filters.process) d = d.filter(doc => doc.process === filters.process);
            if (filters.onlyFavorites) d = d.filter(doc => doc.likes > 0);
        } else {
            // Sin filtros, solo los del folder actual
            d = d.filter(doc => (doc.folderId || null) === currentFolderId);
        }

        return d;
    }, [currentUser, filters, currentFolderId, hasActiveFilters, version]);

    // Breadcrumbs
    const breadcrumbs = useMemo(() => {
        const chain: RepoFolder[] = [];
        let current = currentFolder;
        while (current) {
            chain.unshift(current);
            const parentId = current.parentId;
            current = parentId ? DB.repoFolders.find(f => f.id === parentId) || null : null;
        }
        return chain;
    }, [currentFolder]);

    // --- Drag & Drop Handlers ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Simular subida
        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            uploadDoc({
                title: file.name,
                unit: currentUser?.unit || 'General', visibility: 'unit',
                version: '1.0', status: 'pending', type: file.name.split('.').pop() || 'file',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                authorId: currentUser?.id || 'unknown',
                tags: [],
                history: []
            });
            alert(`Archivo "${file.name}" subido (simulación).`);
        }
    };

    // --- Actions ---
    const handleDownload = (doc: Doc) => {
        const toast = document.createElement('div');
        toast.textContent = `Descargando ${doc.title}...`;
        toast.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-fadeIn font-medium flex items-center gap-2';
        toast.innerHTML = `<span class="animate-spin text-white opacity-80">⟳</span> Descargando ${doc.title}...`;
        document.body.appendChild(toast);

        setTimeout(() => {
            const a = document.createElement('a');
            const blob = new Blob([`Contenido Ficticio de ${doc.title}\n\nTipo: ${doc.type}\nID: ${doc.id}\n\nEste archivo es una demostración de Maturity360.`], { type: 'text/plain' });
            a.href = window.URL.createObjectURL(blob);
            a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${doc.type}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.className = 'fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-fadeIn font-medium flex items-center gap-2';
            toast.innerHTML = `✓ Descarga completada`;
            setTimeout(() => toast.remove(), 3000);
        }, 1500);
    };

    const handleShare = async (doc: Doc) => {
        const url = `${window.location.origin}/doc/${doc.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: doc.title,
                    text: `Revisa este documento: ${doc.title}`,
                    url: url
                });
                return;
            } catch (err) {
                // Fallback
            }
        }
        navigator.clipboard.writeText(url);
        alert('Enlace copiado al portapapeles');
    };

    const clearFilters = () => setFilters({ search: '', type: null, unit: null, process: null, status: null, onlyFavorites: false });

    return (
        <div
            className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => setActiveDropdown(null)}
        >
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-4 border-blue-500 border-dashed m-4 rounded-3xl flex items-center justify-center animate-pulse">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center pointer-events-none">
                        <UploadSimple size={48} className="mx-auto text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">{t('repo_upload_title')}</h3>
                        <p className="text-slate-500">{t('repo_empty_desc')}</p>
                    </div>
                </div>
            )}

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedDoc ? 'mr-0 border-r border-slate-200' : ''}`}>

                {/* Header Sticky */}
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1 group">
                            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={t('repo_search_placeholder')}
                                value={filters.search}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-sm font-medium shadow-inner"
                            />
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                        >
                            <UploadSimple weight="bold" size={18} /> <span>{t('repo_upload_btn')}</span>
                        </button>
                        <button
                            onClick={() => {
                                if (currentFolder && (currentFolder.level || 1) >= 5) {
                                    alert('Máximo nivel de carpetas alcanzado (5)');
                                    return;
                                }
                                setShowNewFolderModal(true);
                            }}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                            <FolderPlus weight="bold" size={18} className="text-blue-500" /> <span>Nueva Carpeta</span>
                        </button>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                        <button
                            onClick={() => setCurrentFolderId(null)}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-colors whitespace-nowrap ${!currentFolderId ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Folder size={16} weight={!currentFolderId ? 'fill' : 'regular'} />
                            Repositorio
                        </button>
                        {breadcrumbs.map((f, i) => (
                            <React.Fragment key={f.id}>
                                <CaretRight size={12} className="text-slate-300 flex-shrink-0" />
                                <button
                                    onClick={() => setCurrentFolderId(f.id)}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors whitespace-nowrap ${i === breadcrumbs.length - 1 ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Folder size={16} weight={i === breadcrumbs.length - 1 ? 'fill' : 'regular'} style={{ color: f.color }} />
                                    {f.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                    {(filteredFolders.length > 0 || filteredDocs.length > 0) ? (
                        <div className={`grid gap-4 ${selectedDoc ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
                            {filteredFolders.map(folder => (
                                <FolderCard
                                    key={folder.id}
                                    folder={folder}
                                    onOpen={() => setCurrentFolderId(folder.id)}
                                    onEdit={() => { setEditingFolder(folder); setShowNewFolderModal(true); }}
                                    onDelete={() => { if (confirm('¿Seguro quieres eliminar esta carpeta?')) deleteRepoFolder(folder.id); }}
                                    showDetails={hasActiveFilters}
                                />
                            ))}
                            {filteredDocs.map(doc => (
                                <GridCard
                                    key={doc.id}
                                    doc={doc}
                                    isSelected={selectedDoc?.id === doc.id}
                                    onClick={() => setSelectedDoc(doc)}
                                    onToggleLike={() => toggleDocLike(doc.id)}
                                    onDownload={() => handleDownload(doc)}
                                    onMenu={(e: React.MouseEvent) => toggleDropdown(doc.id, e)}
                                    isMenuOpen={activeDropdown === doc.id}
                                    onCloseMenu={() => setActiveDropdown(null)}
                                    onShare={() => handleShare(doc)}
                                    onAssign={() => handleAssign(doc)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-500">Carpeta vacía</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PANEL DERECHO (Drawer) --- */}
            {selectedDoc && (
                <div className={`${isSidebarMaximized ? 'w-[750px]' : 'w-[400px]'} flex-shrink-0 bg-white border-l border-slate-200 h-full overflow-hidden flex flex-col shadow-2xl z-20 transition-all duration-300 animate-slideLeft`}>
                    <DetailPanel
                        doc={selectedDoc}
                        onClose={() => { setSelectedDoc(null); setIsSidebarMaximized(false); }}
                        currentUser={currentUser}
                        onUpdate={(updates: any) => updateDoc(selectedDoc.id, updates)}
                        onDelete={() => { deleteDoc(selectedDoc.id); setSelectedDoc(null); }}
                        onLike={() => toggleDocLike(selectedDoc.id)}
                        onDownload={() => handleDownload(selectedDoc)}
                        onShare={() => handleShare(selectedDoc)}
                        onAssign={() => handleAssign(selectedDoc)}
                        onExpand={() => setFullScreenDoc(selectedDoc)}
                        onMove={() => { setDocToMove(selectedDoc); setShowMoveModal(true); }}
                        isMaximized={isSidebarMaximized}
                        onToggleMaximize={() => setIsSidebarMaximized(!isSidebarMaximized)}
                    />
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="font-bold text-lg mb-4">Subir Documento</h3>
                        {/* Mock simple form */}
                        <p className="text-sm text-slate-500 mb-4">Funcionalidad simulada para la demo.</p>
                        <button onClick={() => {
                            uploadDoc({
                                title: "Documento Nuevo.pdf",
                                unit: currentUser?.unit || 'General', visibility: 'unit',
                                version: '1.0', status: 'APPROVED', type: 'pdf',
                                size: '1.5 MB',
                                authorId: currentUser?.id || 'unknown',
                                tags: [],
                                history: [],
                                folderId: currentFolderId || undefined
                            });
                            setShowUploadModal(false);
                        }} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Subir Simulado</button>
                        <button onClick={() => setShowUploadModal(false)} className="w-full mt-2 text-slate-500 text-sm">Cancelar</button>
                    </div>
                </div>
            )}

            {/* Folder Modal */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="font-bold text-lg mb-4">{editingFolder ? 'Editar Carpeta' : 'Nueva Carpeta'}</h3>
                        <button onClick={() => {
                            if (editingFolder) {
                                // updateRepoFolder(editingFolder.id, { name: 'Carpeta Editada' });
                                // Simple mock
                            } else {
                                createRepoFolder({
                                    name: 'Nueva Carpeta',
                                    parentId: currentFolderId || undefined,
                                    level: (currentFolder?.level || 0) + 1,
                                    unit: 'General',
                                    color: '#3b82f6',
                                    process: 'General'
                                });
                            }
                            setShowNewFolderModal(false);
                            setEditingFolder(null);
                        }} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Guardar</button>
                        <button onClick={() => { setShowNewFolderModal(false); setEditingFolder(null); }} className="w-full mt-2 text-slate-500 text-sm">Cancelar</button>
                    </div>
                </div>
            )}

        </div>
    );
}

// Components
function FolderCard({ folder, onOpen, onEdit, onDelete, showDetails }: any) {
    return (
        <div
            onClick={onOpen}
            className="group relative flex flex-col bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer p-4"
        >
            <div className="flex items-center gap-3">
                <Folder size={32} weight="duotone" style={{ color: folder.color || '#fbbf24' }} />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{folder.name}</h4>
                    <p className="text-[10px] text-slate-500">Carpeta</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600">
                    <DotsThree size={20} weight="bold" />
                </button>
            </div>
        </div>
    )
}

function GridCard({ doc, isSelected, onClick, onToggleLike, onDownload, onMenu, isMenuOpen, onCloseMenu, onShare, onAssign }: any) {
    const { t } = useTranslation();
    const baseClasses = "group relative flex flex-col bg-white border rounded-xl transition-all cursor-pointer overflow-visible hover:shadow-md";
    const selectedClasses = isSelected ? "ring-2 ring-blue-500 shadow-md border-transparent" : "border-slate-200 hover:border-blue-300";

    return (
        <div onClick={onClick} className={`${baseClasses} ${selectedClasses}`}>
            <div className="h-32 bg-slate-50 flex items-center justify-center relative border-b border-slate-100 group-hover:bg-slate-100 transition-colors rounded-t-xl">
                <div className="absolute top-2 left-2 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-500 uppercase z-0">
                    {doc.type}
                </div>
                <div className="transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm z-0">
                    {getFileIcon(doc.type, 48)}
                </div>
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={onMenu}
                        className={`p-1 rounded-full transition-colors ${isMenuOpen ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                    >
                        <DotsThree weight="bold" size={24} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 origin-top-right cursor-default" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600"><Eye size={16} /> Ver</button>
                            <button onClick={(e) => { e.stopPropagation(); onDownload(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600"><DownloadSimple size={16} /> Descargar</button>
                            <button onClick={(e) => { e.stopPropagation(); onCloseMenu?.(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash size={16} /> Eliminar</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1">
                    <h4 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                        {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <Buildings size={12} /> {doc.unit}
                    </p>
                </div>
            </div>
        </div>
    )
}

function DetailPanel({ doc, onClose, currentUser, onUpdate, onDelete, onLike, onDownload, onShare, onAssign, onExpand, onMove, isMaximized, onToggleMaximize }: any) {
    // Simplified Detail Panel
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-5 border-b border-slate-100 bg-white relative z-10 shadow-sm flex justify-between items-center">
                <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><X size={20} weight="bold" /></button>
                <div className="flex gap-2">
                    <button onClick={onDownload} className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600"><DownloadSimple size={20} weight="bold" /></button>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-center p-8 bg-slate-50 rounded-xl mb-6">
                    {getFileIcon(doc.type, 64)}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{doc.title}</h2>
                <div className="space-y-4 text-sm text-slate-600">
                    <div className="flex justify-between border-b pb-2"><span>Tipo</span> <span className="font-semibold uppercase">{doc.type}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Unidad</span> <span className="font-semibold">{doc.unit}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Tamaño</span> <span className="font-semibold">{doc.size}</span></div>
                    <div className="flex justify-between border-b pb-2"><span>Estado</span> <span className="font-semibold">{doc.status}</span></div>
                </div>
                <button onClick={onDownload} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20">
                    Descargar Documento
                </button>
            </div>
        </div>
    )
}
