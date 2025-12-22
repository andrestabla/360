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
    Link as LinkIcon, YoutubeLogo, Folder, FolderPlus, CaretLeft, Palette, Info, PencilSimple, CloudArrowUp
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
const VISIBILITY_OPTIONS = ['GLOBAL', 'UNIT', 'PRIVATE'];

export default function RepositoryPage() {
    const {
        currentUser, currentTenantId, uploadDoc, updateDoc, deleteDoc,
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
            tenantId: currentTenantId!,
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
    const tenantUnits = useMemo(() => DB.units.filter(u => u.tenantId === currentTenantId), [currentTenantId]);

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
        if (!currentTenantId) return [];

        // Filtro por tipo
        if (filters.type && filters.type !== 'carpeta') {
            return []; // Si filtramos por PDF, no mostramos carpetas
        }

        // Si hay búsqueda o filtros activos, mostramos todas las carpetas que coincidan
        if (hasActiveFilters) {
            let f = DB.repoFolders.filter(fol => fol.tenantId === currentTenantId);
            if (filters.search) {
                const q = filters.search.toLowerCase();
                f = f.filter(fol => fol.name.toLowerCase().includes(q) || (fol.description || '').toLowerCase().includes(q));
            }
            if (filters.unit) f = f.filter(fol => fol.unit === filters.unit);
            if (filters.process) f = f.filter(fol => fol.process === filters.process);
            return f;
        }

        // Si no hay filtros, mostramos solo las carpetas del nivel actual
        return DB.repoFolders.filter(fol =>
            fol.tenantId === currentTenantId &&
            fol.parentId === currentFolderId
        );
    }, [currentTenantId, currentFolderId, filters, hasActiveFilters, version]);

    const filteredDocs = useMemo(() => {
        if (!currentTenantId) return [];
        let d = DB.docs.filter(doc => doc.tenantId === currentTenantId);

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
    }, [currentTenantId, currentUser, filters, currentFolderId, hasActiveFilters, version]);

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
                tenantId: currentTenantId!, title: file.name,
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
        // Create a dummy file for the demo matching the doc type
        const type = doc.type.toLowerCase();
        let mime = 'text/plain';
        if (type === 'pdf') mime = 'application/pdf';
        if (type.includes('xls')) mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (type.includes('doc')) mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        // Use a generic placeholder URL for binary files logic simulation
        // In a real app this would call an API. Here we simulate a download.
        const toast = document.createElement('div');
        toast.textContent = `Descargando ${doc.title}...`;
        toast.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl z-[100] animate-fadeIn font-medium flex items-center gap-2';
        toast.innerHTML = `<span class="animate-spin text-white opacity-80">⟳</span> Descargando ${doc.title}...`;
        document.body.appendChild(toast);

        setTimeout(() => {
            // Fake download Trigger
            const a = document.createElement('a');
            // For demo purposes, we will stick to a text file payload or a data URI if simple.
            // But let's just simulate the browser "download started" UX for now with a text file acting as the doc.
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
                // Fallback to clipboard
                console.log('Share cancelado o fallido, usando clipboard');
            }
        }

        navigator.clipboard.writeText(url);
        const toast = document.createElement('div');
        toast.textContent = 'Enlace copiado al portapapeles';
        toast.className = 'fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-[100] animate-fadeIn text-sm font-medium';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    };

    // --- Helpers UI ---
    const clearFilters = () => setFilters({ search: '', type: null, unit: null, process: null, status: null, onlyFavorites: false });

    return (
        <div
            className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => setActiveDropdown(null)} // Close dropdowns on outside click
        >
            {/* Overlay Drag & Drop */}
            {/* Overlay Drag & Drop */}
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-4 border-blue-500 border-dashed m-4 rounded-3xl flex items-center justify-center animate-pulse">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center pointer-events-none">
                        <UploadSimple size={48} className="mx-auto text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">{t('repo_upload_title')}</h3>
                        <p className="text-slate-500">{t('repo_empty_desc')}</p>
                    </div>
                </div>
            )}

            {/* --- LISTA PRINCIPAL (Grid) --- */}
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
                    {/* Filters Row - Flex Wrap to avoid scroll */}
                    <div className="flex flex-wrap items-center gap-2">
                        <FilterChip
                            label={t('repo_filter_type')}
                            active={!!filters.type}
                            value={filters.type}
                            options={DOC_TYPES}
                            onSelect={(v: string) => setFilters({ ...filters, type: v === filters.type ? null : v })}
                        />
                        <FilterChip
                            label="Unidad"
                            active={!!filters.unit}
                            value={filters.unit}
                            options={Array.from(new Set(DB.docs.filter(d => d.tenantId === currentTenantId).map(d => d.unit)))}
                            onSelect={(v: string) => setFilters({ ...filters, unit: v === filters.unit ? null : v })}
                        />
                        <FilterChip
                            label="Proceso"
                            active={!!filters.process}
                            value={filters.process}
                            options={Array.from(new Set(DB.docs.filter(d => d.tenantId === currentTenantId && d.process).map(d => d.process)))}
                            onSelect={(v: string) => setFilters({ ...filters, process: v === filters.process ? null : v })}
                        />
                        <button
                            onClick={() => setFilters(f => ({ ...f, onlyFavorites: !f.onlyFavorites }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 flex items-center gap-1.5 ${filters.onlyFavorites ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                            <Heart weight={filters.onlyFavorites ? 'fill' : 'bold'} /> {t('repo_filter_favorites')}
                        </button>

                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="ml-auto text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2">
                                <X weight="bold" /> {t('repo_filter_clear')}
                            </button>
                        )}

                        {!hasActiveFilters && <div className="ml-auto text-xs text-slate-400 font-medium">{filteredDocs.length} arch.</div>}
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
                        <EmptyState filterMode={hasActiveFilters} onClear={clearFilters} />
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

            {/* Full Screen Viewer */}
            {fullScreenDoc && (
                <FullScreenViewer doc={fullScreenDoc} onClose={() => setFullScreenDoc(null)} />
            )}

            {/* Task Modal */}
            {showTaskModal && targetDoc && (
                <TaskAssignmentModal
                    doc={targetDoc}
                    onClose={() => setShowTaskModal(false)}
                    onCreate={handleCreateTask}
                    users={DB.users.filter(u => u.tenantId === currentTenantId)}
                />
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    units={tenantUnits}
                    storageConfig={DB.tenants.find(t => t.id === currentTenantId)?.storageConfig}
                    onUpload={(data: any) => {
                        uploadDoc({
                            ...data,
                            tenantId: currentTenantId!,
                            authorId: currentUser?.id,
                            size: '2 MB',
                            history: [],
                            folderId: currentFolderId
                        } as any);
                        setShowUploadModal(false);
                    }}
                />
            )}

            {/* Folder Modal */}
            {showNewFolderModal && (
                <FolderModal
                    onClose={() => { setShowNewFolderModal(false); setEditingFolder(null); }}
                    onSave={(data: any) => {
                        if (editingFolder) {
                            updateRepoFolder(editingFolder.id, data);
                        } else {
                            createRepoFolder({
                                ...data,
                                parentId: currentFolderId,
                                level: (currentFolder?.level || 0) + 1
                            });
                        }
                        setShowNewFolderModal(false);
                        setEditingFolder(null);
                    }}
                    initialData={editingFolder}
                    units={tenantUnits}
                />
            )}

            {/* Move Doc Modal */}
            {showMoveModal && docToMove && (
                <MoveDocModal
                    doc={docToMove}
                    folders={DB.repoFolders.filter(f => f.tenantId === currentTenantId && f.unit === docToMove.unit)}
                    onClose={() => { setShowMoveModal(false); setDocToMove(null); }}
                    onMove={(folderId: string | null) => {
                        updateDoc(docToMove.id, { folderId: folderId ?? undefined });
                        setShowMoveModal(false);
                        setDocToMove(null);
                        // If selected doc is the one moved, update local state if needed
                        if (selectedDoc?.id === docToMove.id) {
                            setSelectedDoc({ ...selectedDoc, folderId: folderId ?? undefined });
                        }
                    }}
                />
            )}
        </div>
    );
}

// --- COMPONENTES VISUALES ---

function GridCard({ doc, isSelected, onClick, onToggleLike, onDownload, onMenu, isMenuOpen, onCloseMenu, onShare, onAssign }: any) {
    const { t } = useTranslation();
    // Determine card styling based on selection
    const baseClasses = "group relative flex flex-col bg-white border rounded-xl transition-all cursor-pointer overflow-visible hover:shadow-md";
    const selectedClasses = isSelected ? "ring-2 ring-blue-500 shadow-md border-transparent" : "border-slate-200 hover:border-blue-300";

    return (
        <div onClick={onClick} className={`${baseClasses} ${selectedClasses}`}>
            {/* Top: Icon Preview Area */}
            <div className="h-32 bg-slate-50 flex items-center justify-center relative border-b border-slate-100 group-hover:bg-slate-100 transition-colors rounded-t-xl">
                {/* Type Badge */}
                <div className="absolute top-2 left-2 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-bold text-slate-500 uppercase z-0">
                    {doc.type}
                </div>

                {/* Main Icon */}
                <div className="transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm z-0">
                    {getFileIcon(doc.type, 48)}
                </div>

                {/* Menu Button (Always usable directly) */}
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={onMenu}
                        className={`p-1 rounded-full transition-colors ${isMenuOpen ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}
                    >
                        <DotsThree weight="bold" size={24} />
                    </button>
                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-scaleIn origin-top-right cursor-default" onClick={e => e.stopPropagation()}>
                            <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                <Eye size={16} /> {t('view')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onShare(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                <ShareNetwork size={16} /> {t('share')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDownload(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-slate-600">
                                <DownloadSimple size={16} /> {t('download')}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onAssign(); onCloseMenu?.(); }} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-50 flex items-center gap-2 text-indigo-600 bg-indigo-50/50">
                                <ListChecks size={16} weight="bold" /> Asignar Tarea
                            </button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-red-50 text-red-600 flex items-center gap-2">
                                <Trash size={16} /> Eliminar
                            </button>
                        </div>
                    )}
                </div>

                {/* Hover Overlay Actions (Download/Heart) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px] rounded-t-xl z-0 pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDownload(); }}
                        className="bg-white text-slate-700 p-2 rounded-full shadow-lg hover:text-blue-600 hover:scale-110 transition-all pointer-events-auto"
                        title="Descargar"
                    >
                        <DownloadSimple weight="bold" size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
                        className={`bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-all pointer-events-auto ${doc.likes > 0 ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                        title="Favorito"
                    >
                        <Heart weight={doc.likes > 0 ? 'fill' : 'bold'} size={18} />
                    </button>
                </div>
            </div>

            {/* Bottom: Info */}
            <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1">
                    <h4 className={`font-bold text-sm leading-tight mb-1 line-clamp-2 ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                        {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <Buildings size={12} /> {doc.unit}
                    </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium border-t border-slate-50 pt-2 mt-1">
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">v{doc.version}</span>
                    <span>{doc.date}</span>
                </div>
            </div>
        </div>
    )
}

function DetailPanel({ doc, onClose, currentUser, onUpdate, onDelete, onLike, onDownload, onShare, onAssign, onExpand, onMove, isMaximized, onToggleMaximize }: any) {
    const [activeTab, setActiveTab] = useState<'PREVIEW' | 'INFO' | 'COMMENTS'>('PREVIEW');
    const { addDocComment } = useApp();
    const { t } = useTranslation();
    const [comment, setComment] = useState('');
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...doc });
    const comments = DB.publicComments.filter((c: any) => c.docId === doc.id) || [];
    const dummyRef = useRef<HTMLDivElement>(null);

    // Update editData when doc changes
    useEffect(() => {
        setEditData({ ...doc });
    }, [doc]);

    const folderName = useMemo(() => {
        if (!doc.folderId) return 'Raíz';
        return DB.repoFolders.find(f => f.id === doc.folderId)?.name || 'Raíz';
    }, [doc.folderId]);

    // Scroll chat to bottom
    useEffect(() => { if (dummyRef.current) dummyRef.current.scrollIntoView({ behavior: 'smooth' }); }, [comments]);

    const handleSave = () => {
        if (!editData.title) return alert('El título es obligatorio');
        if (!editData.unit) return alert('La unidad es obligatoria');
        onUpdate(editData);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header + Actions */}
            <div className="p-5 border-b border-slate-100 bg-white relative z-10 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-full transition-colors"><X size={20} weight="bold" /></button>
                    <div className="flex gap-2">
                        <button onClick={onLike} className={`p-2 rounded-full border transition-all ${doc.likes > 0 ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'}`}>
                            <Heart size={20} weight={doc.likes > 0 ? 'fill' : 'bold'} />
                        </button>
                        <button onClick={onShare} className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all">
                            <ShareNetwork size={20} weight="bold" />
                        </button>
                        <button onClick={onAssign} title="Asignar Tarea" className="p-2 rounded-full bg-white border border-indigo-200 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
                            <ListChecks size={20} weight="bold" />
                        </button>
                        <button onClick={onExpand} title="Expandir Vista" className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all">
                            <ArrowsOutSimple size={20} weight="bold" />
                        </button>
                        <button
                            onClick={() => {
                                setShowMoreActions(!showMoreActions);
                                if (!showMoreActions && !isMaximized) onToggleMaximize();
                            }}
                            className={`p-2 rounded-full border transition-all ${showMoreActions ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'}`}
                        >
                            <DotsThree size={20} weight="bold" />
                        </button>
                        {showMoreActions && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-scaleIn origin-top-right">
                                <button
                                    onClick={() => { onToggleMaximize(); setShowMoreActions(false); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 text-slate-600 flex items-center gap-2"
                                >
                                    {isMaximized ? <ArrowsInSimple size={16} weight="bold" /> : <ArrowsOutSimple size={16} weight="bold" />}
                                    {isMaximized ? 'Contraer Panel' : 'Maximizar Panel'}
                                </button>
                                <button
                                    onClick={() => { setIsEditing(true); setActiveTab('INFO'); setShowMoreActions(false); if (!isMaximized) onToggleMaximize(); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 text-slate-600 flex items-center gap-2"
                                >
                                    <PencilSimple size={16} weight="bold" /> Editar Metadatos
                                </button>
                                <button
                                    onClick={() => { onMove(); setShowMoreActions(false); }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 text-blue-600 flex items-center gap-2"
                                >
                                    <ArrowsDownUp size={16} weight="bold" /> Mover a Carpeta
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button
                                    onClick={() => {
                                        if (confirm('¿Seguro quieres eliminar este documento?')) {
                                            onDelete();
                                            setShowMoreActions(false);
                                        }
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-red-50 text-red-600 flex items-center gap-2"
                                >
                                    <Trash size={16} weight="bold" /> {t('delete')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-shrink-0">{getFileIcon(doc.type, 32)}</div>
                    <div className="min-w-0">
                        <h2 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2">{doc.title}</h2>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{doc.size}</span>
                            {getVisibilityBadge(doc.visibility)}
                        </div>
                    </div>
                </div>

                <button onClick={onDownload} className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <DownloadSimple size={20} weight="bold" /> {t('download')}
                </button>
            </div>

            {/* Tabs Content */}
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
                <div className="flex border-b border-slate-200 bg-white shadow-sm flex-shrink-0">
                    <button onClick={() => setActiveTab('PREVIEW')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PREVIEW' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('view')}</button>
                    <button onClick={() => { setActiveTab('INFO'); if (!isEditing && isMaximized) setIsEditing(true); }} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'INFO' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{isEditing ? 'Editar' : t('description')}</button>
                    <button onClick={() => setActiveTab('COMMENTS')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex justify-center gap-2 ${activeTab === 'COMMENTS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                        {t('doc_viewer_comments')} {doc.commentsCount > 0 && <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full ml-1">{doc.commentsCount}</span>}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto w-full relative">
                    {activeTab === 'PREVIEW' && (
                        <div className="h-full w-full flex flex-col p-4">
                            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex items-center justify-center relative">
                                {(() => {
                                    const t = doc.type.toLowerCase();
                                    if (t.includes('pdf')) return <iframe src="https://pdfobject.com/pdf/sample.pdf" className="w-full h-full" title="PDF" />;
                                    if (t.match(/(jpg|jpeg|png|gif|webp)/)) return <img src={`https://placehold.co/600x800/EEE/31343C?text=${encodeURIComponent(doc.title)}`} className="w-full h-full object-contain" />;

                                    let sampleUrl = '';
                                    if (t.includes('doc') || t.includes('word')) sampleUrl = 'https://filesamples.com/samples/document/docx/sample1.docx';
                                    else if (t.includes('xls') || t.includes('sheet')) sampleUrl = 'https://filesamples.com/samples/document/xlsx/sample1.xlsx';
                                    else if (t.includes('ppt') || t.includes('powerpoint')) sampleUrl = 'https://filesamples.com/samples/document/pptx/sample1.pptx';

                                    if (sampleUrl) {
                                        return <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${sampleUrl}`} className="w-full h-full" title="Office Preview" />;
                                    }

                                    return (
                                        <div className="text-center p-8">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                {getFileIcon(doc.type, 48)}
                                            </div>
                                            <h3 className="text-slate-900 font-bold text-lg mb-2">Vista previa no disponible</h3>
                                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                                Este formato ({doc.type.toUpperCase()}) no tiene vista previa.
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {activeTab === 'INFO' && (
                        <div className="p-5 space-y-6 animate-fadeIn pb-24">
                            {isEditing ? (
                                <div className="space-y-6 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            <PencilSimple size={18} className="text-blue-500" /> Editar Metadatos
                                        </h3>
                                        <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Documento</label>
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={e => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Descripción</label>
                                        <textarea
                                            value={editData.description || ''}
                                            onChange={e => setEditData({ ...editData, description: e.target.value })}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 transition-all h-20 resize-none"
                                            placeholder="Añade una descripción..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Unidad / Subárea</label>
                                            <select
                                                value={editData.unit}
                                                onChange={e => setEditData({ ...editData, unit: e.target.value })}
                                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                                            >
                                                {/* Reusing hierarchy logic */}
                                                {DB.units.filter((u: any) => u.tenantId === doc.tenantId && u.depth === 1).map((u: any) => (
                                                    <React.Fragment key={u.id}>
                                                        <option value={u.name} className="font-bold">{u.name}</option>
                                                        {DB.units.filter((s: any) => s.parentId === u.id).map((s: any) => (
                                                            <option key={s.id} value={`${u.name} > ${s.name}`}>&nbsp;&nbsp;↳ {s.name}</option>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Proceso</label>
                                            <input
                                                type="text"
                                                value={editData.process || ''}
                                                onChange={e => setEditData({ ...editData, process: e.target.value })}
                                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                                                placeholder="Ej: Auditoría"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Palabras Clave (Separadas por coma)</label>
                                            <input
                                                type="text"
                                                value={editData.tags?.join(', ') || ''}
                                                onChange={e => setEditData({ ...editData, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                                                placeholder="Ej: Auditoría, 2024, Reporte"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Fecha de Expiración</label>
                                            <input
                                                type="date"
                                                value={editData.expiryDate || ''}
                                                onChange={e => setEditData({ ...editData, expiryDate: e.target.value })}
                                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Etiqueta de Color</label>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', ''].map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setEditData({ ...editData, color: c })}
                                                    className={`w-6 h-6 rounded-full border-2 transition-all ${editData.color === c ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'}`}
                                                    style={{ backgroundColor: c || '#f1f5f9' }}
                                                >
                                                    {!c && <X size={10} className="mx-auto text-slate-400" />}
                                                </button>
                                            ))}
                                            <div className="relative flex items-center">
                                                <Palette size={16} className="absolute left-1.5 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="color"
                                                    value={editData.color || '#3b82f6'}
                                                    onChange={e => setEditData({ ...editData, color: e.target.value })}
                                                    className="w-10 h-6 rounded-lg overflow-hidden border border-slate-200 cursor-pointer bg-transparent pl-5"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Section title="Estructura">
                                        <InfoRow label="Unidad / Subárea" value={doc.unit} icon={<Buildings size={16} className="text-blue-500" />} />
                                        <InfoRow label="Carpeta" value={folderName} icon={<Folder size={16} style={{ color: doc.color || '#f59e0b' }} />} />
                                        <InfoRow label="Proceso" value={doc.process || 'General'} icon={<Info size={16} className="text-slate-400" />} />
                                    </Section>

                                    {doc.description && (
                                        <Section title="Descripción">
                                            <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 italic">
                                                "{doc.description}"
                                            </p>
                                        </Section>
                                    )}

                                    <Section title="Metadatos">
                                        <InfoRow label="Propietario" value={`Usuario #${doc.authorId.split('-').pop()}`} icon={<UserCircle size={16} className="text-slate-400" />} />
                                        <InfoRow label="Subido el" value={doc.date} icon={<Clock size={16} className="text-slate-400" />} />
                                        <InfoRow label="Expiración" value={doc.expiryDate || 'Sin fecha'} icon={<Clock size={16} className={doc.expiryDate ? 'text-amber-500' : 'text-slate-400'} />} />
                                        <InfoRow label="Estado" value={doc.status === 'APPROVED' ? 'Aprobado' : 'Borrador'} icon={<ShieldCheck size={16} className={doc.status === 'APPROVED' ? 'text-emerald-500' : 'text-amber-500'} />} />
                                    </Section>

                                    {doc.tags && doc.tags.length > 0 && (
                                        <Section title="Palabras Clave">
                                            <div className="flex flex-wrap gap-2">
                                                {doc.tags.map((tag: string) => (
                                                    <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 uppercase tracking-tighter">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </Section>
                                    )}

                                    <Section title="Historial de Versiones">
                                        <div className="border-l-2 border-slate-200 ml-1.5 pl-4 py-1 space-y-6">
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-50 border border-white"></div>
                                                <p className="text-sm font-bold text-slate-900">v{doc.version} (Actual)</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Editado hace un momento por ti</p>
                                            </div>
                                            {doc.history?.map((h: any, i: number) => (
                                                <div key={i} className="relative opacity-60">
                                                    <div className="absolute -left-[20px] top-1.5 w-2 h-2 bg-slate-300 rounded-full"></div>
                                                    <p className="text-xs font-bold text-slate-700">v{h.version}</p>
                                                    <p className="text-[10px] text-slate-500">{h.date} • {h.author}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>

                                    <div className="pt-4 border-t border-slate-200">
                                        <button onClick={() => { setIsEditing(true); if (!isMaximized) onToggleMaximize(); }} className="w-full mb-3 flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 transition-all group shadow-sm">
                                            <span className="flex items-center gap-2"><PencilSimple className="text-blue-500" size={18} /> Editar Metadatos</span>
                                        </button>
                                        <button onClick={() => alert('Próximamente: Nueva Versión')} className="w-full mb-3 flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:border-purple-200 hover:bg-purple-50/50 hover:text-purple-700 transition-all group shadow-sm">
                                            <span className="flex items-center gap-2"><ClockCounterClockwise className="text-purple-500" size={18} /> {t('doc_viewer_upload_new')}</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'COMMENTS' && (
                        <div className="flex flex-col h-full bg-slate-50">
                            <div className="flex-1 overflow-y-auto space-y-4 p-5">
                                {comments.length > 0 ? comments.map((c: any) => (
                                    <div key={c.id} className="flex gap-3 animate-fadeIn">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700 flex-shrink-0 shadow-sm">
                                            {c.userName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="font-bold text-slate-800 text-xs">{c.userName}</span>
                                                <span className="text-[10px] text-slate-400">{c.date}</span>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed">{c.content}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-12">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <ChatCircle size={24} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">Sin comentarios</p>
                                        <p className="text-xs text-slate-400">Sé el primero en opinar.</p>
                                    </div>
                                )}
                                <div ref={dummyRef}></div>
                            </div>

                            {/* Input area fixed at bottom of tab content */}
                            <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0">
                                <form onSubmit={(e) => { e.preventDefault(); if (comment.trim()) { addDocComment(doc.id, comment); setComment(''); } }} className="relative">
                                    <input
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Escribe un comentario..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-inner"
                                    />
                                    <button type="submit" disabled={!comment.trim()} className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-0 disabled:scale-90 transition-all">
                                        <CaretRight weight="bold" size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function FilterChip({ label, active, value, options, onSelect }: any) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 flex items-center gap-1.5 ${active ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
                {label} {value && <span className="bg-white/20 text-white px-1 rounded-sm ml-0.5 uppercase text-[9px] backdrop-blur-sm">{value}</span>}
                <ArrowsDownUp size={12} className={active ? 'text-blue-100' : 'text-slate-400'} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-scaleIn origin-top-left">
                        {options.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => { onSelect(opt); setOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-xs font-medium hover:bg-slate-50 flex justify-between items-center border-b border-slate-50 last:border-0 ${active && value === opt ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'}`}
                            >
                                <span className="capitalize">{opt}</span>
                                {active && value === opt && <Check weight="bold" className="text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

// --- COMPONENTS ---

function FolderCard({ folder, onOpen, onEdit, onDelete, showDetails }: any) {
    return (
        <div
            onClick={onOpen}
            className="group bg-white border border-slate-200 rounded-xl p-4 transition-all cursor-pointer hover:border-blue-400 hover:shadow-md relative"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${folder.color}15`, color: folder.color }}>
                    <Folder size={32} weight="fill" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <PencilSimple size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash size={18} />
                    </button>
                </div>
            </div>

            <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{folder.name}</h4>
            <p className="text-[10px] text-slate-400 font-medium mb-2">Nivel {folder.level} • {folder.unit}</p>

            {(showDetails && folder.description) && (
                <p className="text-[10px] text-slate-500 line-clamp-1 mb-2 italic">"{folder.description}"</p>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-50 pt-2">
                <span className="flex items-center gap-1"><Info size={12} /> {folder.process || 'Sin proceso'}</span>
                <CaretRight size={12} />
            </div>
        </div>
    );
}

function FolderModal({ onClose, onSave, initialData, units }: any) {
    const [data, setData] = useState(initialData || {
        name: '',
        description: '',
        unit: '',
        process: '',
        color: '#3b82f6'
    });

    const areas = units.filter((u: any) => u.depth === 1);
    const [selectedAreaId, setSelectedAreaId] = useState(() => {
        if (!initialData?.unit) return '';
        const area = areas.find((a: any) => a.name === initialData.unit.split(' > ')[0]);
        return area?.id || '';
    });

    const subareas = units.filter((u: any) => u.parentId === selectedAreaId);

    const handleSave = () => {
        if (!data.name) return alert('El nombre es obligatorio');
        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-0 overflow-hidden animate-scaleIn">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Editar Carpeta' : 'Nueva Carpeta'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre de la Carpeta</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData({ ...data, name: e.target.value })}
                            placeholder="Ej: Documentación Técnica"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción (Opcional)</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData({ ...data, description: e.target.value })}
                            placeholder="Breve descripción del contenido..."
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium h-20 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Área</label>
                            <select
                                value={selectedAreaId}
                                onChange={e => {
                                    const area = areas.find((a: any) => a.id === e.target.value);
                                    setSelectedAreaId(e.target.value);
                                    setData({ ...data, unit: area ? area.name : '' });
                                }}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-xs font-medium"
                            >
                                <option value="">Seleccionar Área</option>
                                {areas.map((a: any) => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Subárea</label>
                            <select
                                value={data.unit.split(' > ')[1] || ''}
                                onChange={e => {
                                    const area = areas.find((a: any) => a.id === selectedAreaId);
                                    if (area) {
                                        setData({ ...data, unit: e.target.value ? `${area.name} > ${e.target.value}` : area.name });
                                    }
                                }}
                                disabled={!selectedAreaId}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-xs font-medium disabled:opacity-50"
                            >
                                <option value="">Seleccionar Subárea</option>
                                {subareas.map((s: any) => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proceso Asociado</label>
                        <input
                            type="text"
                            value={data.process}
                            onChange={e => setData({ ...data, process: e.target.value })}
                            placeholder="Ej: Auditoría Anual"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Color de Carpeta</label>
                        <div className="flex flex-wrap gap-3">
                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setData({ ...data, color: c })}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${data.color === c ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                            <div className="relative flex items-center">
                                <Palette size={20} className="absolute left-2 text-slate-400 pointer-events-none" />
                                <input
                                    type="color"
                                    value={data.color}
                                    onChange={e => setData({ ...data, color: e.target.value })}
                                    className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 cursor-pointer bg-transparent pl-8"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                    >
                        {initialData ? 'Guardar Cambios' : 'Crear Carpeta'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ... rest of code (GridCard, DetailPanel, etc)
function MoveDocModal({ doc, folders, onMove, onClose }: any) {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-0 overflow-hidden animate-scaleIn">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <ArrowsDownUp size={20} weight="bold" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Mover Documento</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">
                        Selecciona la carpeta de destino para <span className="font-bold text-slate-700">{doc.title}</span>.
                        Solo se muestran carpetas asociadas a <span className="font-bold text-blue-600">{doc.unit}</span>.
                    </p>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <button
                            onClick={() => onMove(null)}
                            className={`w-full p-3 flex items-center gap-3 rounded-xl border transition-all text-left ${doc.folderId === null ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-600'}`}
                        >
                            <Folder size={20} weight={doc.folderId === null ? 'fill' : 'regular'} />
                            <span className="text-sm font-semibold">Raíz del Repositorio</span>
                            {doc.folderId === null && <Check size={16} className="ml-auto" />}
                        </button>

                        {folders.length > 0 ? folders.map((f: any) => (
                            <button
                                key={f.id}
                                onClick={() => onMove(f.id)}
                                className={`w-full p-3 flex items-center gap-3 rounded-xl border transition-all text-left ${doc.folderId === f.id ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-slate-50 border-transparent hover:bg-slate-100 text-slate-600'}`}
                            >
                                <Folder size={20} weight={doc.folderId === f.id ? 'fill' : 'regular'} style={{ color: f.color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold truncate">{f.name}</div>
                                    <div className="text-[10px] opacity-70">Nivel {f.level} • {f.process || 'Sin proceso'}</div>
                                </div>
                                {doc.folderId === f.id && <Check size={16} className="ml-auto flex-shrink-0" />}
                            </button>
                        )) : (
                            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400">No hay otras carpetas disponibles en esta unidad.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

function getFileIcon(type: string, size = 20) {
    const t = type.toLowerCase();
    const props = { size, weight: "duotone" as const };
    if (t.includes('pdf')) return <FilePdf {...props} className="text-red-500" />;
    if (t.includes('xls') || t.includes('sheet')) return <FileXls {...props} className="text-emerald-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileDoc {...props} className="text-blue-500" />;
    return <FileText {...props} className="text-slate-400" />;
}

function getVisibilityBadge(vis: string, compact = false) {
    if (compact) {
        if (vis === 'GLOBAL') return <Globe className="text-emerald-500" />;
        if (vis === 'PRIVATE') return <Lock className="text-slate-400" />;
        return <Buildings className="text-blue-500" />;
    }
    // Full badges logic same as before...
    if (vis === 'GLOBAL') return <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full"><Globe weight="bold" /> Global</span>;
    if (vis === 'PRIVATE') return <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full"><Lock weight="bold" /> Privado</span>;
    return <span className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full"><Buildings weight="bold" /> Unidad</span>;
}

// Helpers components
const Section = ({ title, children }: any) => (
    <div className="mb-6">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</h4>
        {children}
    </div>
);
const InfoRow = ({ label, value, icon }: any) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <div className="flex items-center gap-2 text-sm text-slate-800">{icon}{value}</div>
    </div>
);

function EmptyState({ filterMode, onClear }: any) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                {filterMode ? <Funnel size={32} className="text-slate-400" /> : <UploadSimple size={32} className="text-blue-400" />}
            </div>
            <h3 className="text-slate-900 font-bold text-lg mb-1">{filterMode ? t('repo_empty_title') : t('repo_empty_title')}</h3>
            <p className="text-slate-500 text-sm max-w-xs text-center mb-6">
                {filterMode ? 'No encontramos documentos con esos filtros.' : t('repo_empty_desc')}
            </p>
            {filterMode && <button onClick={onClear} className="text-blue-600 font-semibold text-sm hover:underline">{t('repo_filter_clear')}</button>}
        </div>
    )
}

function UploadModal({ onClose, onUpload, units, storageConfig }: any) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<'LINK' | 'FILE' | 'EMBED' | 'STORAGE'>('LINK');
    const [data, setData] = useState({ title: '', unit: '', visibility: 'UNIT', description: '', process: '', tags: '', expiryDate: '' });
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState('');
    const [embed, setEmbed] = useState('');

    const handleSubmit = () => {
        let submission: any = {
            title: data.title,
            unit: data.unit,
            process: (data as any).process,
            visibility: data.visibility,
            description: data.description,
            tags: data.tags.split(',').map(s => s.trim()).filter(Boolean),
            expiryDate: data.expiryDate,
            date: new Date().toISOString().split('T')[0],
            version: '1.0',
            status: 'DRAFT',
            history: []
        };

        if (tab === 'FILE') {
            if (!file) return;
            submission.type = file.name.split('.').pop() || 'file';
            submission.size = (file.size / 1024 / 1024).toFixed(2) + ' MB';
            submission.content = URL.createObjectURL(file); // Store local blob ref
        } else if (tab === 'LINK') {
            submission.type = 'url';
            submission.size = 'Enlace';
            submission.content = url;
            submission.title = data.title || 'Nuevo Enlace';
        } else if (tab === 'EMBED') {
            submission.type = 'embed';
            submission.size = 'Embed';
            // Extract src if iframe tag
            const srcMatch = embed.match(/src="([^"]+)"/);
            submission.content = srcMatch ? srcMatch[1] : embed;
            submission.title = data.title || 'Recurso Embebido';
        } else if (tab === 'STORAGE') {
            submission.type = 'cloud';
            submission.size = 'Cloud';
            submission.content = 'Cloud Reference';
            submission.title = data.title || `Archivo de ${storageConfig?.provider || 'Storage'}`;
        }

        if (!data.unit) return alert('Debes seleccionar una unidad o subárea');
        if (!data.title && tab === 'FILE' && !file) return alert('El título es obligatorio');

        onUpload(submission);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-0 overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800">{t('repo_upload_title')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button onClick={() => setTab('LINK')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${tab === 'LINK' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                        <LinkIcon size={16} /> {t('repo_tab_link')}
                    </button>
                    <button onClick={() => setTab('FILE')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${tab === 'FILE' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                        <UploadSimple size={16} /> {t('repo_tab_file')}
                    </button>
                    <button onClick={() => setTab('EMBED')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${tab === 'EMBED' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                        <YoutubeLogo size={16} /> {t('repo_tab_embed')}
                    </button>
                    {storageConfig && storageConfig.enabled && (
                        <button onClick={() => setTab('STORAGE')} className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${tab === 'STORAGE' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}>
                            <CloudArrowUp size={16} /> {storageConfig.provider.replace('_', ' ')}
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-5 overflow-y-auto">
                    {/* Content Input Area */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        {tab === 'FILE' && (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative group">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
                                <UploadSimple size={32} className={`mx-auto mb-2 ${file ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
                                <p className="text-sm font-bold text-slate-700">{file ? file.name : 'Haz clic o arrastra un archivo'}</p>
                                <p className="text-xs text-slate-400 mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, Office, Imágenes (Max 10MB)'}</p>
                            </div>
                        )}
                        {tab === 'LINK' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL del Recurso</label>
                                <input
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://ejemplo.com/documento"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        )}
                        {tab === 'EMBED' && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código Embed (Iframe)</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder='<iframe src="..."></iframe>'
                                    rows={3}
                                    value={embed}
                                    onChange={e => setEmbed(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Pega el código HTML del iframe o la URL directa del recurso embebible.</p>
                            </div>
                        )}
                        {tab === 'STORAGE' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                    <CloudArrowUp size={32} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 mb-1">Importar desde {storageConfig.provider.replace('_', ' ')}</h3>
                                <p className="text-xs text-slate-500 mb-4 px-4">Utiliza el selector oficial de {storageConfig.provider.replace('_', ' ')} para importar archivos directamente.</p>
                                <button className="bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
                                    Abrir Selector de {storageConfig.provider.replace('_', ' ')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Metadata Fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Documento</label>
                                <input
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                    placeholder="Título descriptivo..."
                                    value={data.title}
                                    onChange={e => setData({ ...data, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unidad / Subárea</label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.unit}
                                    onChange={e => setData({ ...data, unit: e.target.value, process: '' } as any)}
                                    required
                                >
                                    <option value="">Seleccionar...</option>
                                    {/* Areas */}
                                    {units.filter((u: any) => u.depth === 1).map((u: any) => (
                                        <React.Fragment key={u.id}>
                                            <option value={u.name} className="font-bold">{u.name}</option>
                                            {/* Subareas */}
                                            {units.filter((s: any) => s.parentId === u.id).map((s: any) => (
                                                <option key={s.id} value={`${u.name} > ${s.name}`}>&nbsp;&nbsp;↳ {s.name}</option>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proceso</label>
                                <input
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={(data as any).process || ''}
                                    onChange={e => setData({ ...data, process: e.target.value } as any)}
                                    placeholder="Ej: Auditoría"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Accesibilidad</label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    value={data.visibility}
                                    onChange={e => setData({ ...data, visibility: e.target.value })}
                                >
                                    <option value="UNIT">Solo Unidad</option>
                                    <option value="GLOBAL">Global (Público)</option>
                                    <option value="PRIVATE">Privado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Palabras Clave (Separadas por coma)</label>
                                <input
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="Ej: Auditoría, 2024"
                                    value={data.tags}
                                    onChange={e => setData({ ...data, tags: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Expiración</label>
                                <input
                                    type="date"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={data.expiryDate}
                                    onChange={e => setData({ ...data, expiryDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                            <textarea
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                placeholder="Notas adicionales..."
                                rows={2}
                                value={data.description}
                                onChange={e => setData({ ...data, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">{t('cancel')}</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!data.title || (!file && !url && !embed)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                        {t('repo_upload_btn')}
                    </button>
                </div>
            </div>
        </div>
    )
}

function FullScreenViewer({ doc, onClose }: any) {
    const getContent = () => {
        const t = doc.type.toLowerCase();
        if (t.includes('pdf')) {
            return <iframe src="https://pdfobject.com/pdf/sample.pdf" className="w-full h-full" title="PDF" />;
        }
        if (t.match(/(jpg|jpeg|png|gif|webp)/)) {
            return <img src={`https://placehold.co/1920x1080?text=${encodeURIComponent(doc.title)}`} className="w-full h-full object-contain" alt="Preview" />;
        }

        // Office Handling via Office Apps Viewer (using known public samples for demo)
        let sampleUrl = '';
        if (t.includes('doc') || t.includes('word')) sampleUrl = 'https://filesamples.com/samples/document/docx/sample1.docx';
        else if (t.includes('xls') || t.includes('sheet')) sampleUrl = 'https://filesamples.com/samples/document/xlsx/sample1.xlsx';
        else if (t.includes('ppt') || t.includes('powerpoint')) sampleUrl = 'https://filesamples.com/samples/document/pptx/sample1.pptx';

        if (sampleUrl) {
            const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${sampleUrl}`;
            return <iframe src={viewerUrl} className="w-full h-full bg-white" title="Office Viewer" />;
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText size={64} className="mb-4" />
                <p>Vista previa no disponible para este formato.</p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col animate-fadeIn">
            <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-white/10 shrink-0">
                <div className="text-white">
                    <h2 className="font-bold text-lg line-clamp-1">{doc.title}</h2>
                    <p className="text-xs text-slate-400">{doc.type.toUpperCase()} • {doc.size}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                        <DownloadSimple size={18} /> Descargar
                    </button>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-slate-800">
                {getContent()}
            </div>
        </div>
    );
}

function TaskAssignmentModal({ doc, onClose, onCreate, users }: any) {
    const [data, setData] = useState({ action: 'Revisar', userId: '', note: '' });
    const [search, setSearch] = useState('');

    const filteredUsers = useMemo(() => {
        if (!search) return users;
        const q = search.toLowerCase();
        return users.filter((u: any) =>
            u.name.toLowerCase().includes(q) ||
            (u.email && u.email.toLowerCase().includes(q))
        );
    }, [users, search]);

    const actions = ['Revisar', 'Ajustar', 'Versionar', 'Crear', 'Aprobar'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Asignar Tarea</h2>
                        <p className="text-xs text-slate-500 mt-1">Documento: {doc.title}</p>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-700" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Acción</label>
                        <div className="grid grid-cols-2 gap-2">
                            {actions.map(act => (
                                <button
                                    key={act}
                                    onClick={() => setData({ ...data, action: act })}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${data.action === act ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                >
                                    {act}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asignar a Usuario</label>

                        {/* Search Input */}
                        <div className="relative mb-2">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Buscar por nombre o correo..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        {/* User List */}
                        <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white custom-scrollbar">
                            {filteredUsers.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {filteredUsers.map((u: any) => (
                                        <button
                                            key={u.id}
                                            onClick={() => setData({ ...data, userId: u.id })}
                                            className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 group ${data.userId === u.id ? 'bg-blue-50 ring-1 ring-blue-500 inset-ring' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${data.userId === u.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-200 group-hover:text-blue-700'}`}>
                                                {u.initials || u.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={`text-sm font-bold ${data.userId === u.id ? 'text-blue-700' : 'text-slate-700'}`}>{u.name}</div>
                                                <div className="text-xs text-slate-400 font-mono">{u.email || 'Sin correo'} • {u.role}</div>
                                            </div>
                                            {data.userId === u.id && <Check className="ml-auto text-blue-600" weight="bold" />}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-xs text-slate-400 italic">
                                    No se encontraron usuarios.
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nota / Instrucciones</label>
                        <textarea
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Detalles adicionales para la tarea..."
                            value={data.note}
                            onChange={e => setData({ ...data, note: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                        <button onClick={onClose} className="text-slate-500 font-medium hover:text-slate-800 text-sm">Cancelar</button>
                        <button
                            onClick={() => onCreate(data)}
                            disabled={!data.userId}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Asignar Tarea
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
