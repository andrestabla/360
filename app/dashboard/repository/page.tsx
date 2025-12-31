'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { getUnitsAction } from '@/app/lib/unitActions';
import { Unit } from '@/shared/schema';
import { RepositoryFile, RepositoryFolder, getFoldersAction, createFolderAction, deleteFolderAction, updateFolderAction, getDocumentsAction, getDocumentByIdAction, uploadDocumentAction, deleteDocumentAction, toggleLikeAction } from '@/app/lib/repositoryActions';
import { UploadSimple, Folder, FilePdf, FileDoc, FileXls, Image, Link as LinkIcon, Code, DotsThree, Trash, DownloadSimple, Eye, CloudArrowUp, CaretRight, FolderPlus, Check, MagnifyingGlass, Funnel, X, ListBullets, SquaresFour, PencilSimple, ClipboardText, FilePpt, FileText, ShareNetwork, CaretDown, Star } from '@phosphor-icons/react';
import { AssignTaskModal } from '@/components/repository/AssignTaskModal';
import { MoveDocumentModal } from '@/components/repository/MoveDocumentModal';
import { FullScreenPreview } from '@/components/repository/FullScreenPreview';
import { RepositorySidebar } from '@/components/repository/RepositorySidebar';

// Tipos para Filtros Avanzados
type FilterState = {
    search: string;
    type: string | null;
    unit: string | null;
    process: string | null;
    status: 'APPROVED' | 'DRAFT' | 'REVIEW' | null;
    onlyFavorites: boolean;
};

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

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState<RepositoryFolder | null>(null);

    const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
    const [selectedDocForAction, setSelectedDocForAction] = useState<RepositoryFile | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        search: '', type: null, unit: null, process: null, status: null, onlyFavorites: false
    });
    const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedDoc, setSelectedDoc] = useState<RepositoryFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [fullScreenDoc, setFullScreenDoc] = useState<RepositoryFile | null>(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [docToMove, setDocToMove] = useState<RepositoryFile | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [units, setUnits] = useState<Unit[]>([]);
    const [uploadTab, setUploadTab] = useState<'file' | 'link' | 'embed'>('file');
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Repositorio' }]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const searchInputRef = useRef<HTMLInputElement>(null);


    // --- Deep Linking & Data Fetching ---

    // 1. Initial Load: Check for docId
    useEffect(() => {
        const handleDeepLink = async () => {
            // We access searchParams via window location here to avoid hydration mismatches 
            // or just use the hook but ensure we only run ONCE on mount
            const params = new URLSearchParams(window.location.search);
            const deepLinkDocId = params.get('docId');

            if (deepLinkDocId) {
                const doc = await getDocumentByIdAction(deepLinkDocId);
                if (doc) {
                    // Set the folder context so the doc is visible
                    if (doc.folderId) {
                        setCurrentFolderId(doc.folderId);
                        // We might need to fetch the breadcrumb trail here if we want to be perfect, 
                        // but setting currentFolderId will trigger the main loadData effect which fetches folders/docs
                    }
                    // Select the doc immediately to open sidebar
                    setSelectedDoc(doc);
                }
            }
        };
        handleDeepLink();
    }, []);

    // 2. Main Data Load (Folders & Docs) depending on currentFolderId
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
    }, [currentFolderId, refreshTrigger, filters.search, currentUser]);

    const refresh = () => setRefreshTrigger(prev => prev + 1);

    const navigateTo = (folder: RepositoryFolder | null) => {
        if (!folder) {
            setCurrentFolderId(null);
            setBreadcrumbs([{ id: null, name: 'Repositorio' }]);
        } else {
            setCurrentFolderId(folder.id);
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

    const handleDownload = async (doc: RepositoryFile) => {
        if (!doc.url) {
            alert('URL no disponible');
            return;
        }
        try {
            const { getDocumentDownloadUrlAction } = await import('@/app/lib/repositoryActions');
            const res = await getDocumentDownloadUrlAction(doc.id);
            if (res.success && res.url) {
                window.open(res.url, '_blank');
            } else {
                // Fallback
                window.open(doc.url, '_blank');
            }
        } catch (e) {
            console.error(e);
            window.open(doc.url, '_blank');
        }
    };

    const handleDeleteDoc = async (id: string) => {
        if (!confirm('¿Seguro quieres eliminar este documento?')) return;
        try {
            await deleteDocumentAction(id);
            if (selectedDoc?.id === id) setSelectedDoc(null);
            refresh();
        } catch (e) { console.error(e); }
    };

    const handleDeleteFolder = async (id: string) => {
        if (!confirm('¿Seguro quieres eliminar esta carpeta?')) return;
        try {
            await deleteFolderAction(id);
            refresh();
        } catch (e) { console.error(e); }
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdown(prev => prev === id ? null : id);
    };

    return (
        <div
            className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={async (e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files.length > 0) {
                    const file = e.dataTransfer.files[0];
                    setIsUploading(true);
                    try {
                        const formData = new FormData();
                        formData.append('file', file);
                        if (currentFolderId) formData.append('folderId', currentFolderId);
                        if (currentUser?.unit) formData.append('unitId', currentUser.unit);
                        await uploadDocumentAction(formData);
                        refresh();
                        alert('Archivo subido correctamente');
                    } catch (error: any) { alert(`Error al subir: ${error.message}`); }
                    finally { setIsUploading(false); }
                }
            }}
            onClick={() => setActiveDropdown(null)}
        >
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-4 border-blue-500 border-dashed m-4 rounded-3xl flex items-center justify-center animate-pulse">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center pointer-events-none">
                        <UploadSimple size={48} className="mx-auto text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">Suelta para subir</h3>
                        <p className="text-slate-500">Tus archivos se guardarán en la carpeta actual.</p>
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
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1 group">
                            {!filters.search && <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" size={20} />}
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Buscar en el repositorio..."
                                value={filters.search}
                                onChange={e => setFilters({ ...filters, search: e.target.value })}
                                className={`w-full ${filters.search ? 'pl-4' : 'pl-11'} pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-sm font-medium shadow-inner`}
                            />
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                        >
                            <UploadSimple weight="bold" size={18} /> <span>Subir</span>
                        </button>
                        <button
                            onClick={() => setShowNewFolderModal(true)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                        >
                            <FolderPlus weight="bold" size={18} className="text-blue-500" /> <span>Nueva Carpeta</span>
                        </button>
                    </div>

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

                    {/* Filters Bar */}
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                        {/* Filter: Tipo */}
                        <div className="relative">
                            <select
                                value={filters.type || ''}
                                onChange={e => setFilters({ ...filters, type: e.target.value || null })}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-slate-300 transition-all"
                            >
                                <option value="">Tipo</option>
                                <option value="pdf">PDF</option>
                                <option value="image">Imagen</option>
                                <option value="document">Documento</option>
                                <option value="spreadsheet">Hoja de Cálculo</option>
                                <option value="presentation">Presentación</option>
                                <option value="link">Enlace</option>
                                <option value="embed">Embed</option>
                                <option value="folder">Carpeta</option>
                            </select>
                            <CaretDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Filter: Unidad */}
                        <div className="relative">
                            <select
                                value={filters.unit || ''}
                                onChange={e => setFilters({ ...filters, unit: e.target.value || null })}
                                className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer hover:border-slate-300 transition-all"
                            >
                                <option value="">Unidad</option>
                                {units.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                            <CaretDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Filter: Proceso */}
                        <div className="relative">
                            <input
                                value={filters.process || ''}
                                onChange={e => setFilters({ ...filters, process: e.target.value || null })}
                                placeholder="Proceso"
                                className="w-32 pl-3 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none hover:border-slate-300 transition-all placeholder:text-slate-500"
                            />
                        </div>

                        {/* Filter: Favoritos */}
                        <button
                            onClick={() => setFilters({ ...filters, onlyFavorites: !filters.onlyFavorites })}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${filters.onlyFavorites
                                ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <Star size={14} weight={filters.onlyFavorites ? 'fill' : 'regular'} />
                            Favoritos
                        </button>

                        {/* Clear Filters */}
                        {(filters.type || filters.unit || filters.process || filters.onlyFavorites) && (
                            <button
                                onClick={() => setFilters({ search: filters.search, type: null, unit: null, process: null, status: null, onlyFavorites: false })}
                                className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <X size={12} /> Limpiar
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
                        </div>
                    ) : (folders.length > 0 || docs.length > 0) ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {folders.map(folder => (
                                <FolderCard
                                    key={folder.id}
                                    folder={folder}
                                    onOpen={() => navigateTo(folder)}
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
                                    onShare={() => {
                                        if (doc.url) {
                                            navigator.clipboard.writeText(doc.url);
                                            alert('Enlace copiado');
                                        } else alert('No hay URL');
                                    }}
                                    onAssign={() => { setSelectedDocForAction(doc); setShowAssignTaskModal(true); setActiveDropdown(null); }}
                                    onEdit={() => { setSelectedDoc(doc); setActiveDropdown(null); }}
                                    onDelete={() => handleDeleteDoc(doc.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <p className="text-sm font-medium">Carpeta vacía</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedDoc && (
                <div className={`${isSidebarMaximized ? 'w-[750px]' : 'w-[400px]'} flex-shrink-0 bg-white border-l border-slate-200 h-full overflow-hidden flex flex-col shadow-2xl z-20 transition-all duration-300 animate-slideLeft`}>
                    <RepositorySidebar
                        doc={selectedDoc}
                        units={units}
                        onClose={() => { setSelectedDoc(null); setIsSidebarMaximized(false); }}
                        onDownload={handleDownload}
                        onUpdate={refresh}
                        onAssign={(doc) => { setSelectedDocForAction(doc); setShowAssignTaskModal(true); }}
                        onToggleLike={async (doc) => {
                            try {
                                await toggleLikeAction(doc.id);
                                refresh();
                            } catch (e: any) { alert(e.message); }
                        }}
                        onShare={(doc) => {
                            if (doc.url) {
                                navigator.clipboard.writeText(doc.url);
                                alert('Enlace copiado al portapapeles');
                            } else alert('Este documento no tiene una URL pública.');
                        }}
                        onDelete={(doc) => handleDeleteDoc(doc.id)}
                        onMove={(doc) => { setDocToMove(doc); setShowMoveModal(true); }}
                        onExpand={(doc) => setFullScreenDoc(doc)}
                    />
                </div>
            )}

            {/* Modals */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                            <h3 className="font-bold text-lg text-gray-800">Subir Archivo</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="flex border-b border-gray-100 px-6 pt-2">
                            <button onClick={() => setUploadTab('file')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${uploadTab === 'file' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Archivo</button>
                            <button onClick={() => setUploadTab('link')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${uploadTab === 'link' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Enlace</button>
                            <button onClick={() => setUploadTab('embed')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${uploadTab === 'embed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Incrustado</button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            formData.append('linkType', uploadTab);
                            if (currentFolderId) formData.append('folderId', currentFolderId);
                            setIsUploading(true);
                            try {
                                await uploadDocumentAction(formData);
                                refresh();
                                setShowUploadModal(false);
                            } catch (err: any) { alert(err.message); }
                            finally { setIsUploading(false); }
                        }} className="p-6 space-y-5">

                            {uploadTab === 'file' && (
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors relative ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                                    {selectedFile ? (
                                        <div className="flex flex-col items-center">
                                            <FileText size={48} className="text-blue-500 mb-2" weight="duotone" />
                                            <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                                            <p className="text-xs text-slate-500 mb-4">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                }}
                                                className="px-3 py-1 bg-white border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50"
                                            >
                                                Cambiar Archivo
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <CloudArrowUp size={48} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm font-medium text-slate-600">Arrastra un archivo aquí o haz clic para seleccionar</p>
                                        </>
                                    )}
                                    <input
                                        name="file"
                                        type="file"
                                        className={`absolute inset-0 opacity-0 cursor-pointer ${selectedFile ? 'pointer-events-none' : ''}`}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setSelectedFile(e.target.files[0]);
                                            }
                                        }}
                                        required={!selectedFile}
                                    />
                                </div>
                            )}
                            {uploadTab === 'link' && <input name="url" type="url" placeholder="URL del recurso" className="w-full border p-2.5 rounded-lg text-sm" required />}
                            {uploadTab === 'embed' && <textarea name="embedCode" rows={4} placeholder="Código iframe..." className="w-full border p-2.5 rounded-lg text-sm font-mono" required />}

                            <input name="title" placeholder="Título..." className="w-full border p-2.5 rounded-lg text-sm" required defaultValue={selectedFile?.name || ''} />
                            <div className="grid grid-cols-2 gap-4">
                                <select name="unitId" className="border p-2.5 rounded-lg text-sm bg-white">
                                    <option value="">Unidad...</option>
                                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                <input name="process" placeholder="Proceso..." className="border p-2.5 rounded-lg text-sm" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setShowUploadModal(false); setSelectedFile(null); }} className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-lg">Cancelar</button>
                                <button type="submit" disabled={isUploading} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                                    {isUploading ? 'Subiendo...' : 'Subir'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-gray-800">{editingFolder ? 'Editar Carpeta' : 'Nueva Carpeta'}</h3>
                            <button onClick={() => setShowNewFolderModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const payload = {
                                name: formData.get('name') as string,
                                description: formData.get('description') as string,
                                unitId: (formData.get('unitId') as string) || currentUser?.unit,
                                process: formData.get('process') as string,
                                color: formData.get('color') as string
                            };
                            try {
                                if (editingFolder) await updateFolderAction(editingFolder.id, payload);
                                else await createFolderAction({ ...payload, parentId: currentFolderId });
                                refresh();
                                setShowNewFolderModal(false);
                                setEditingFolder(null);
                            } catch (e: any) { alert(e.message); }
                        }} className="space-y-4">
                            <input name="name" defaultValue={editingFolder?.name} placeholder="Nombre..." className="w-full border p-2.5 rounded-lg text-sm" required />
                            <textarea name="description" defaultValue={editingFolder?.description || ''} placeholder="Descripción..." rows={2} className="w-full border p-2.5 rounded-lg text-sm" />
                            <select name="unitId" className="w-full border p-2.5 rounded-lg text-sm bg-white">
                                <option value="">Seleccionar Unidad...</option>
                                {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            <input name="process" defaultValue={editingFolder?.process || ''} placeholder="Proceso..." className="w-full border p-2.5 rounded-lg text-sm" />
                            <div className="flex gap-2">
                                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'].map(c => (
                                    <label key={c} className="cursor-pointer relative">
                                        <input type="radio" name="color" value={c} defaultChecked={(editingFolder?.color || '#3b82f6') === c} className="peer sr-only" />
                                        <div className="w-8 h-8 rounded-full peer-checked:scale-110 peer-checked:ring-2 ring-offset-2 ring-gray-400" style={{ backgroundColor: c }}></div>
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => { setShowNewFolderModal(false); setEditingFolder(null); }} className="px-5 py-2.5 text-gray-500 font-bold">Cancelar</button>
                                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg">
                                    {editingFolder ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAssignTaskModal && selectedDocForAction && (
                <AssignTaskModal
                    isOpen={showAssignTaskModal}
                    onClose={() => setShowAssignTaskModal(false)}
                    documentId={selectedDocForAction.id}
                    documentTitle={selectedDocForAction.title}
                />
            )}

            {showMoveModal && docToMove && (
                <MoveDocumentModal
                    isOpen={showMoveModal}
                    onClose={() => setShowMoveModal(false)}
                    doc={docToMove}
                    onMoveConfirm={refresh}
                />
            )}

            {fullScreenDoc && (
                <FullScreenPreview
                    doc={fullScreenDoc}
                    onClose={() => setFullScreenDoc(null)}
                />
            )}
        </div>
    );
}

// Components
function FolderCard({ folder, onOpen, onEdit, onDelete }: any) {
    return (
        <div onClick={onOpen} className="group flex flex-col bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer p-4">
            <div className="flex items-center gap-3">
                <Folder size={32} weight="duotone" style={{ color: folder.color || '#fbbf24' }} />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{folder.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{folder.description || 'Carpeta'}</p>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={onEdit} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-500"><PencilSimple size={14} /></button>
                    <button onClick={onDelete} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500"><Trash size={14} /></button>
                </div>
            </div>
        </div>
    )
}

function GridCard({ doc, isSelected, onClick, onDownload, onMenu, isMenuOpen, onShare, onAssign, onEdit, onDelete }: any) {
    return (
        <div onClick={onClick} className={`group flex flex-col bg-white border rounded-xl transition-all cursor-pointer overflow-visible hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500 shadow-md border-transparent' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className="h-32 bg-slate-50 flex items-center justify-center relative border-b border-slate-100 group-hover:bg-slate-100 transition-colors rounded-t-xl">
                <div className="absolute top-2 left-2 bg-white px-1.5 py-0.5 rounded border text-[10px] font-bold text-slate-500 uppercase">{doc.type}</div>
                <div className="transform group-hover:scale-110 transition-transform duration-300">{getFileIcon(doc.type, 48)}</div>
                <div className="absolute top-2 right-2 z-10">
                    <button onClick={onMenu} className={`p-1 rounded-full ${isMenuOpen ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-white'}`}><DotsThree weight="bold" size={24} /></button>
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 origin-top-right cursor-default" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2"><Eye size={16} /> Ver</button>
                            <button onClick={(e) => { e.stopPropagation(); onDownload(); }} className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2"><DownloadSimple size={16} /> Descargar</button>
                            <button onClick={(e) => { e.stopPropagation(); onShare(); }} className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2"><ShareNetwork size={16} /> Compartir Enlace</button>
                            <button onClick={(e) => { e.stopPropagation(); onAssign(); }} className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-blue-600"><ClipboardText size={16} /> Asignar Tarea</button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash size={16} /> Eliminar</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3">
                <h4 className={`font-bold text-sm leading-tight line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{doc.title}</h4>
            </div>
        </div>
    )
}
