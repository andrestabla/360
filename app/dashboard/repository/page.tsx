'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
// import { DB } from '@/lib/data'; // REMOVED MOCK
import { getUnitsAction } from '@/app/lib/unitActions';
import { Unit } from '@/shared/schema';
import { RepositoryFile, RepositoryFolder, getFoldersAction, getDocumentsAction, createFolderAction, uploadDocumentAction, deleteDocumentAction, deleteFolderAction, updateFolderAction, moveItemAction } from '@/app/lib/repositoryActions';
import { UploadSimple, Folder, FilePdf, FileDoc, FileXls, Image, Link as LinkIcon, Code, DotsThree, Trash, DownloadSimple, Eye, CloudArrowUp, CaretRight, FolderPlus, Check, MagnifyingGlass, Funnel, X, ListBullets, SquaresFour, PencilSimple, ClipboardText, FilePpt, FileText } from '@phosphor-icons/react';
import { AssignTaskModal } from '@/components/repository/AssignTaskModal';
import { EditMetadataModal } from '@/components/repository/EditMetadataModal';

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
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <Image size={size} weight="duotone" className="text-purple-500" />;
    if (t === 'carpeta') return <Folder size={size} weight="duotone" className="text-yellow-400" />;
    if (t === 'link') return <LinkIcon size={size} weight="duotone" className="text-blue-400" />;
    if (t === 'embed') return <Code size={size} weight="duotone" className="text-slate-600" />;
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

    // New Actions State
    const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
    const [showEditMetadataModal, setShowEditMetadataModal] = useState(false);
    const [selectedDocForAction, setSelectedDocForAction] = useState<RepositoryFile | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        search: '', type: null, unit: null, process: null, status: null, onlyFavorites: false
    });
    const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');




    const [selectedDoc, setSelectedDoc] = useState<RepositoryFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [fullScreenDoc, setFullScreenDoc] = useState<RepositoryFile | null>(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [docToMove, setDocToMove] = useState<RepositoryFile | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    // Units Data
    const [units, setUnits] = useState<Unit[]>([]);

    // Upload Form State
    const [uploadTab, setUploadTab] = useState<'file' | 'link' | 'embed'>('file');

    // Helper for dropdown toggling avoiding propagation issues
    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdown(prev => prev === id ? null : id);
    };

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);

    // --- Fetch Data ---
    useEffect(() => {
        const loadUnits = async () => {
            const res = await getUnitsAction();
            if (res.success && res.data) setUnits(res.data);
        };
        loadUnits();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Parallel fetch
                const [f, d] = await Promise.all([
                    getFoldersAction(currentFolderId, currentUser?.unit),
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

    const handleFolderClick = navigateTo;

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
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {folders.map(folder => (
                                    <FolderCard
                                        key={folder.id}
                                        folder={folder}
                                        onOpen={() => handleFolderClick(folder)}
                                        onEdit={(e: any) => { e.stopPropagation(); setEditingFolder(folder); setShowNewFolderModal(true); }}
                                        onDelete={(e: any) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                                    />
                                ))}
                                {docs.map(doc => (
                                    <GridCard
                                        key={doc.id}
                                        doc={doc}
                                        isSelected={selectedDoc?.id === doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        onMenu={(e: any) => toggleDropdown(doc.id, e)}
                                        isMenuOpen={activeDropdown === doc.id}
                                        onCloseMenu={() => setActiveDropdown(null)}

                                        onDownload={() => handleDownload(doc)}
                                        // onShare={() => handleShare(doc)}
                                        onShare={() => alert('Compartir: Próximamente')}

                                        onAssign={() => { setSelectedDocForAction(doc); setShowAssignTaskModal(true); setActiveDropdown(null); }}
                                        onEdit={() => { setSelectedDocForAction(doc); setShowEditMetadataModal(true); setActiveDropdown(null); }}

                                        onDelete={() => handleDeleteDoc(doc.id)}
                                    />
                                ))}
                            </div>
                        ) : (
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
                                        onAssign={() => { setSelectedDocForAction(doc); setShowAssignTaskModal(true); setActiveDropdown(null); }}
                                        onEdit={() => { setSelectedDocForAction(doc); setShowEditMetadataModal(true); setActiveDropdown(null); }}
                                        onDelete={() => handleDeleteDoc(doc.id)}
                                    />
                                ))}
                            </div>
                        )
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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                            <h3 className="font-bold text-lg text-gray-800">Subir Archivo</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 px-6 pt-2">
                            <button onClick={() => setUploadTab('link')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${uploadTab === 'link' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                <LinkIcon className="inline mr-2" size={16} /> Enlace
                            </button>
                            <button onClick={() => setUploadTab('file')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${uploadTab === 'file' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                <UploadSimple className="inline mr-2" size={16} /> Archivo
                            </button>
                            <button onClick={() => setUploadTab('embed')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${uploadTab === 'embed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                <Code className="inline mr-2" size={16} /> Incrustado
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            formData.append('linkType', uploadTab);
                            if (currentFolderId) formData.append('folderId', currentFolderId);

                            // Handle Unit logic: if subarea selected, use it, else use area, else null
                            // Done via native select

                            setIsUploading(true);
                            uploadDocumentAction(formData)
                                .then(() => { refresh(); setShowUploadModal(false); })
                                .catch(err => alert(err.message))
                                .finally(() => setIsUploading(false));
                        }} className="p-6 space-y-5">

                            {/* Dynamic Input based on Tab */}
                            {uploadTab === 'link' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL del Recurso</label>
                                    <input name="url" type="url" placeholder="https://ejemplo.com/documento" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" required />
                                </div>
                            )}

                            {uploadTab === 'file' && (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <CloudArrowUp size={48} className="text-gray-300 mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Haz clic o arrastra un archivo</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, Office, Imágenes (Max 10MB)</p>
                                    <input name="file" type="file" className="absolute inset-0 opacity-0 cursor-pointer" required onChange={(e) => {
                                        // Optional: Show selected filename
                                    }} />
                                </div>
                            )}

                            {uploadTab === 'embed' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código Embed (Iframe)</label>
                                    <textarea name="embedCode" rows={4} placeholder="<iframe src='...'></iframe>" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-mono" required />
                                    <p className="text-[10px] text-gray-400 mt-1">Pega el código HTML del iframe o la URL directa del recurso embebible.</p>
                                </div>
                            )}

                            {/* Metadata Fields */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Documento</label>
                                <input name="title" placeholder="Título descriptivo..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unidad / Subárea</label>
                                    <select name="unitId" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white">
                                        <option value="">Seleccionar...</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.path || u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Proceso</label>
                                    <input name="process" placeholder="Ej: Auditoría" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Accesibilidad</label>
                                    <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white">
                                        <option>Solo Unidad</option>
                                        <option>Público</option>
                                        <option>Privado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Palabras Clave</label>
                                    <input name="keywords" placeholder="Ej: Auditoría, 2024" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha de Expiración</label>
                                <input name="expiresAt" type="date" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                                <textarea name="description" rows={2} placeholder="Notas adicionales..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            </div>

                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                                    {isUploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    {isUploading ? 'Subiendo...' : 'Subir'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Folder Modal */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">{editingFolder ? 'Editar Carpeta' : 'Nueva Carpeta'}</h3>
                            <button onClick={() => setShowNewFolderModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const unitId = formData.get('subarea') as string || formData.get('area') as string || currentUser?.unit;
                            // Inject unitId into payload call
                            // Need to handle manual call since createFolderAction expects object
                            const payload = {
                                name: formData.get('name') as string,
                                description: formData.get('description') as string,
                                unitId: unitId,
                                process: formData.get('process') as string,
                                color: formData.get('color') as string
                            };

                            if (editingFolder) {
                                // update
                                updateFolderAction(editingFolder.id, payload).then(() => { refresh(); setShowNewFolderModal(false); });
                            } else {
                                // create
                                createFolderAction({ ...payload, parentId: currentFolderId }).then(() => { refresh(); setShowNewFolderModal(false); });
                            }

                        }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre de la Carpeta</label>
                                <input name="name" defaultValue={editingFolder?.name} placeholder="Ej: Documentación Técnica" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" required />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción (Opcional)</label>
                                <textarea name="description" defaultValue={editingFolder?.description || ''} placeholder="Breve descripción del contenido..." rows={2} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Área</label>
                                    <select name="area" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white">
                                        <option value="">Seleccionar Área</option>
                                        {units.filter(u => !u.parentId).map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subárea</label>
                                    <select name="subarea" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-white">
                                        <option value="">Seleccionar Subárea</option>
                                        {units.filter(u => !!u.parentId).map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Proceso Asociado</label>
                                <input name="process" defaultValue={editingFolder?.process || ''} placeholder="Ej: Auditoría Anual" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color de Carpeta</label>
                                <div className="flex gap-2">
                                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'].map(c => (
                                        <label key={c} className="cursor-pointer relative">
                                            <input type="radio" name="color" value={c} defaultChecked={(editingFolder?.color || '#3b82f6') === c} className="peer sr-only" />
                                            <div className="w-8 h-8 rounded-full transition-all peer-checked:scale-110 peer-checked:ring-2 ring-offset-2 peer-checked:ring-gray-400" style={{ backgroundColor: c }}></div>
                                            <Check size={14} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" weight="bold" />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => { setShowNewFolderModal(false); setEditingFolder(null); }} className="px-5 py-2.5 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                                    {editingFolder ? 'Guardar Cambios' : 'Crear Carpeta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* New Modals */}
            {selectedDocForAction && (
                <AssignTaskModal
                    isOpen={showAssignTaskModal}
                    onClose={() => setShowAssignTaskModal(false)}
                    documentId={selectedDocForAction.id}
                    documentTitle={selectedDocForAction.title}
                />
            )}
            {selectedDocForAction && (
                <EditMetadataModal
                    isOpen={showEditMetadataModal}
                    onClose={() => setShowEditMetadataModal(false)}
                    document={selectedDocForAction}
                    units={units}
                    onSuccess={refresh}
                />
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

function GridCard({ doc, isSelected, onClick, onToggleLike, onDownload, onMenu, isMenuOpen, onCloseMenu, onShare, onAssign, onEdit, onDelete }: any) {
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
                            <button onClick={(e) => { e.stopPropagation(); onShare(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600"><LinkIcon size={16} /> Compartir</button>
                            <hr className="border-slate-100 my-1" />
                            <button onClick={(e) => { e.stopPropagation(); onAssign(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-blue-600"><ClipboardText size={16} /> Asignar Tarea</button>
                            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600"><PencilSimple size={16} /> Editar Metadatos</button>
                            <hr className="border-slate-100 my-1" />
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
