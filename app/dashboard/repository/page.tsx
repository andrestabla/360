'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
// import { DB } from '@/lib/data'; // REMOVED MOCK
import { RepositoryFile, RepositoryFolder, getFoldersAction, getDocumentsAction, createFolderAction, uploadDocumentAction, deleteDocumentAction, deleteFolderAction, updateFolderAction, moveItemAction } from '@/app/lib/repositoryActions';
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
    const t = (type || '').toLowerCase();
    if (t.includes('pdf')) return <FilePdf size={size} weight="duotone" className="text-red-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileDoc size={size} weight="duotone" className="text-blue-500" />;
    if (t.includes('xls') || t.includes('sheet') || t.includes('csv')) return <FileXls size={size} weight="duotone" className="text-green-500" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <FilePpt size={size} weight="duotone" className="text-orange-500" />;
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <FileText size={size} weight="duotone" className="text-purple-500" />;
    if (t === 'carpeta') return <Folder size={size} weight="duotone" className="text-yellow-400" />;
    return <FileText size={size} weight="duotone" className="text-slate-400" />;
};

export default function RepositoryPage() {
    const { currentUser } = useApp();
    const { t } = useTranslation();

    // --- Estado Global ---
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState<RepositoryFolder[]>([]);
    const [docs, setDocs] = useState<RepositoryFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState<RepositoryFolder | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        search: '', type: null, unit: null, process: null, status: null, onlyFavorites: false
    });
    const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);

    const [selectedDoc, setSelectedDoc] = useState<RepositoryFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [fullScreenDoc, setFullScreenDoc] = useState<RepositoryFile | null>(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [docToMove, setDocToMove] = useState<RepositoryFile | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadInputRef, setUploadInputRef] = useState<HTMLInputElement | null>(null);

    // Helper for dropdown toggling avoiding propagation issues
    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdown(prev => prev === id ? null : id);
    };

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);

    // --- Fetch Data ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Parallel fetch
                const [f, d] = await Promise.all([
                    getFoldersAction(currentFolderId, currentUser?.unit), // Filter by unit optionally?
                    getDocumentsAction(currentFolderId, currentUser?.unit, filters.search)
                ]);
                setFolders(f);
                setDocs(d);
            } catch (error) {
                console.error("Failed to load repo data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [currentFolderId, refreshTrigger, filters.search, currentUser]); // Refresh on folder change or search

    const refresh = () => setRefreshTrigger(prev => prev + 1);

    // --- Breadcrumbs Logic (Simplified) ---
    // In a real app with deep nesting, we need to fetch the full chain or store it.
    // For MVP, we can keep a local history stack or just fetch parent info. 
    // Since we don't return parent info in `getFoldersAction`, breadcrumbs might be tricky without a `getFolderDetails` fetch.
    // Let's implement a simple "Up" button or track history manually for now.
    // Enhanced: We track history of {id, name} locally.
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Repositorio' }]);

    const navigateTo = (folder: RepositoryFolder | null) => {
        if (!folder) {
            setCurrentFolderId(null);
            setBreadcrumbs([{ id: null, name: 'Repositorio' }]);
        } else {
            setCurrentFolderId(folder.id);
            // Append if navigating down, Slice if navigating up (needs logic)
            // For simple drill-down:
            setBreadcrumbs(prev => {
                const existingIdx = prev.findIndex(b => b.id === folder.id);
                if (existingIdx >= 0) return prev.slice(0, existingIdx + 1);
                return [...prev, { id: folder.id, name: folder.name }];
            });
        }
    };

    const handleBreadcrumbClick = (item: { id: string | null, name: string }) => {
        setCurrentFolderId(item.id);
        const idx = breadcrumbs.findIndex(b => b.id === item.id);
        if (idx >= 0) setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
    };


    // --- Drag & Drop Handlers ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await performUpload(file);
        }
    };

    const performUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (currentFolderId) formData.append('folderId', currentFolderId);
            if (currentUser?.unit) formData.append('unitId', currentUser.unit);

            await uploadDocumentAction(formData);
            refresh();
            setTimeout(() => alert('Archivo subido correctamente'), 500);
        } catch (error: any) {
            alert(`Error al subir: ${error.message}`);
        } finally {
            setIsUploading(false);
            setShowUploadModal(false);
        }
    };

    // --- Actions ---
    const handleCreateFolder = async (name: string, description?: string) => {
        try {
            if (editingFolder) {
                await updateFolderAction(editingFolder.id, { name, description });
            } else {
                await createFolderAction({
                    name,
                    parentId: currentFolderId,
                    unitId: currentUser?.unit,
                    description
                });
            }
            setShowNewFolderModal(false);
            setEditingFolder(null);
            refresh();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleDeleteDoc = async (id: string) => {
        if (!confirm('¿Seguro quieres eliminar este documento?')) return;
        try {
            await deleteDocumentAction(id);
            if (selectedDoc?.id === id) setSelectedDoc(null);
            refresh();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteFolder = async (id: string) => {
        if (!confirm('¿Seguro quieres eliminar esta carpeta?')) return;
        try {
            await deleteFolderAction(id);
            refresh();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownload = (doc: RepositoryFile) => {
        if (doc.url) window.open(doc.url, '_blank');
        else alert('URL no disponible');
    };

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

            {isUploading && (
                <div className="absolute inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                        <p className="font-semibold text-slate-700">Subiendo archivo...</p>
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                        >
                            <UploadSimple weight="bold" size={18} /> <span>{t('repo_upload_btn')}</span>
                        </button>
                        <button
                            onClick={() => setShowNewFolderModal(true)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                            <FolderPlus weight="bold" size={18} className="text-blue-500" /> <span>Nueva Carpeta</span>
                        </button>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                        {breadcrumbs.map((item, i) => (
                            <React.Fragment key={item.id || 'root'}>
                                {i > 0 && <CaretRight size={12} className="text-slate-300 flex-shrink-0" />}
                                <button
                                    onClick={() => handleBreadcrumbClick(item)}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors whitespace-nowrap ${i === breadcrumbs.length - 1 ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Folder size={16} weight={i === breadcrumbs.length - 1 ? 'fill' : 'regular'} className={i === breadcrumbs.length - 1 ? 'text-blue-500' : 'text-slate-400'} />
                                    {item.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
                        </div>
                    ) : (folders.length > 0 || docs.length > 0) ? (
                        <div className={`grid gap-4 ${selectedDoc ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}`}>
                            {folders.map(folder => (
                                <FolderCard
                                    key={folder.id}
                                    folder={folder}
                                    onOpen={() => navigateTo(folder)}
                                    onEdit={() => { setEditingFolder(folder); setShowNewFolderModal(true); }}
                                    onDelete={() => handleDeleteFolder(folder.id)}
                                    showDetails={!!filters.search}
                                />
                            ))}
                            {docs.map(doc => (
                                <GridCard
                                    key={doc.id}
                                    doc={doc}
                                    isSelected={selectedDoc?.id === doc.id}
                                    onClick={() => setSelectedDoc(doc)}
                                    onToggleLike={() => { }}
                                    onDownload={() => handleDownload(doc)}
                                    onMenu={(e: React.MouseEvent) => toggleDropdown(doc.id, e)}
                                    isMenuOpen={activeDropdown === doc.id}
                                    onCloseMenu={() => setActiveDropdown(null)}
                                    onShare={() => { }}
                                    onAssign={() => { }}
                                    onDelete={() => handleDeleteDoc(doc.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-500">Carpeta vacía</p>
                            <p className="text-xs text-slate-400 mt-2">Arrastra archivos aquí o usa el botón "Subir"</p>
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
                        onUpdate={() => { }}
                        onDelete={() => handleDeleteDoc(selectedDoc.id)}
                        onLike={() => { }}
                        onDownload={() => handleDownload(selectedDoc)}
                        onShare={() => { }}
                        onAssign={() => { }}
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
                        <input
                            type="file"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) performUpload(e.target.files[0]);
                            }}
                        />
                        <button onClick={() => setShowUploadModal(false)} className="w-full mt-4 text-slate-500 text-sm">Cancelar</button>
                    </div>
                </div>
            )}

            {/* Folder Modal */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="font-bold text-lg mb-4">{editingFolder ? 'Editar Carpeta' : 'Nueva Carpeta'}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            handleCreateFolder(formData.get('name') as string, formData.get('description') as string);
                        }}>
                            <input name="name" defaultValue={editingFolder?.name} placeholder="Nombre de la carpeta" className="w-full border p-2 rounded mb-2" required />
                            <input name="description" defaultValue={editingFolder?.description || ''} placeholder="Descripción (opcional)" className="w-full border p-2 rounded mb-4" />

                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Guardar</button>
                            <button type="button" onClick={() => { setShowNewFolderModal(false); setEditingFolder(null); }} className="w-full mt-2 text-slate-500 text-sm">Cancelar</button>
                        </form>
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
                    <p className="text-[10px] text-slate-500">{folder.description || 'Carpeta'}</p>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={onEdit} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-500"><PencilSimple size={14} /></button>
                    <button onClick={onDelete} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500"><Trash size={14} /></button>
                </div>
            </div>
        </div>
    )
}

function GridCard({ doc, isSelected, onClick, onToggleLike, onDownload, onMenu, isMenuOpen, onCloseMenu, onShare, onAssign, onDelete }: any) {
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
                            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash size={16} /> Eliminar</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1">
                    <h4 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                        {doc.title}
                    </h4>
                    {/* <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <Buildings size={12} /> {doc.unit}
                    </p> */}
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
                    {/* <div className="flex justify-between border-b pb-2"><span>Unidad</span> <span className="font-semibold">{doc.unitId}</span></div> */}
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
