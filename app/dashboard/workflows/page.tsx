'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import toast from 'react-hot-toast';
import { DB, WorkflowCase, Project, ProjectFolder } from '@/lib/data';
import { createProjectFolderAction, getProjectFoldersAction, getProjectByIdAction } from '@/app/actions/projectActions';
import {
    Plus, CheckCircle, Clock, XCircle, CaretRight, FileCsv,
    Briefcase, Folder, CloudArrowUp, FolderPlus, CaretLeft, DownloadSimple, PencilSimple, Trash, Copy
} from '@phosphor-icons/react';
import { deleteProjectFolderAction, updateProjectFolderAction, duplicateProjectAction, deleteProjectAction } from '@/app/actions/projectActions';

// --- GLOBAL PROGRESS UTILS ---
const getProjectProgress = (proj: Project) => {
    if (!proj.phases || proj.phases.length === 0) return 0;
    // Simple mock calculation or real one if phases have status
    // Reusing the same calculation logic would be good, but for the card view a simplified one is fine.
    // Let's iterate if phases exist
    let totalWeight = 0;
    let count = 0;
    const weights: Record<string, number> = {
        'PENDING': 0, 'IN_PROGRESS': 50, 'COMPLETED': 80,
        'IN_REVIEW': 90, 'DELIVERED': 95, 'VALIDATED': 100
    };

    proj.phases.forEach(p => {
        if (p.activities) {
            p.activities.forEach(a => {
                count++;
                totalWeight += weights[a.status] || 0;
            });
        }
    });

    return count === 0 ? 0 : Math.round(totalWeight / count);
};

export default function WorkflowsPage() {
    const { currentUser, createProject, updateProject, deleteProjectFolder, version, refreshData, createWorkflowCase } = useApp();
    const { t } = useTranslation();
    const [mainView, setMainView] = useState<'WORKFLOWS' | 'PROJECTS'>('PROJECTS');
    const [activeTab, setActiveTab] = useState<'REQUESTS' | 'TASKS'>('REQUESTS');
    const [selectedCase, setSelectedCase] = useState<WorkflowCase | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);

    // PROJECT STATES
    // Removed selectedProject state as we now navigate
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [editingFolder, setEditingFolder] = useState<ProjectFolder | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);

    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // Filters
    const [search, setSearch] = useState('');

    const [folders, setFolders] = useState<ProjectFolder[]>([]);

    const handleDeleteFolder = async (folderId: string) => {
        if (!confirm(t('wf_confirm_delete_folder') || '¿Seguro que deseas eliminar esta carpeta?')) return;
        const res = await deleteProjectFolderAction(folderId);
        if (res.success) {
            toast.success('Carpeta eliminada');
            loadFolders();
        } else {
            toast.error('Error al eliminar: ' + res.error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadFolders();
    }, []);

    const loadFolders = async () => {
        const res = await getProjectFoldersAction();
        if (res.success && res.data) {
            // Map DB data to UI type
            const mapped: ProjectFolder[] = res.data.map(f => ({
                id: f.id,
                name: f.name,
                description: f.description || '',
                parentId: f.parentId || undefined,
                createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
                color: f.color || undefined
            }));
            setFolders(mapped);
        }
    };

    // Filter Logic
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isClient && searchParams) {
            // We might want to handle initial folder selection via params later
        }
    }, [isClient, searchParams]);

    const myRequests = useMemo(() => {
        if (!isClient) return [];
        return DB.workflowCases.filter(c =>
            c.creatorId === currentUser?.id &&
            (!search || c.title.toLowerCase().includes(search.toLowerCase()))
        );
    }, [currentUser?.id, isClient, search, version]);

    const myTasks = useMemo(() => {
        if (!currentUser || !isClient) return [];
        return DB.workflowCases.filter(c =>
            c.status === 'IN_PROGRESS' &&
            (c.assigneeId === currentUser.id)
        );
    }, [currentUser, isClient, version]);

    const projectsList = useMemo(() => {
        if (!isClient) return [];
        return DB.projects.filter(p => {
            const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
            const matchesFolder = selectedFolderId ? p.folderId === selectedFolderId : !p.folderId;
            return matchesSearch && matchesFolder;
        });
    }, [isClient, version, search, selectedFolderId]);

    const foldersList = useMemo(() => {
        if (!isClient) return [];
        return folders.filter(f => {
            const matchesSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
            const matchesParent = selectedFolderId ? f.parentId === selectedFolderId : !f.parentId;
            return matchesSearch && matchesParent;
        });
    }, [isClient, version, search, selectedFolderId, folders]);

    const breadcrumbs = useMemo(() => {
        const path = [];
        let curr = selectedFolderId;
        while (curr) {
            const f = folders.find(folder => folder.id === curr);
            if (f) {
                path.unshift(f);
                curr = f.parentId || null;
            } else {
                curr = null;
            }
        }
        return path;
    }, [selectedFolderId, version, folders]);

    const handleDownloadProjectCSV = async (projectId: string, title: string) => {
        const toastId = toast.loading('Generando CSV...');
        try {
            const res = await getProjectByIdAction(projectId);
            if (!res.success || !res.data) {
                toast.error('Error al obtener datos del proyecto', { id: toastId });
                return;
            }

            const p = res.data;
            const rows = [['Carpeta Nivel 1', 'Carpeta Nivel 2', 'Nombre Proyecto', 'Fase', 'Actividad', 'Fecha Inicio', 'Fecha Fin', 'Estado']];

            // Helper to clean strings
            const clean = (s: string | null | undefined) => (s || '').replace(/,/g, ' ');

            // Find folder names
            let f1Name = '';
            let f2Name = '';
            if (p.folderId) {
                const f2 = folders.find(f => f.id === p.folderId);
                if (f2) {
                    if (f2.parentId) {
                        const f1 = folders.find(f => f.id === f2.parentId);
                        f1Name = f1 ? f1.name : '';
                        f2Name = f2.name;
                    } else {
                        f1Name = f2.name;
                    }
                }
            }

            if (!p.phases || p.phases.length === 0) {
                rows.push([clean(f1Name), clean(f2Name), clean(p.title), '', '', clean(p.startDate?.toString()), clean(p.endDate?.toString()), clean(p.status)]);
            } else {
                p.phases.forEach((ph: any) => {
                    if (!ph.activities || ph.activities.length === 0) {
                        rows.push([clean(f1Name), clean(f2Name), clean(p.title), clean(ph.name), '', clean(ph.startDate?.toString() || p.startDate?.toString()), clean(ph.endDate?.toString() || p.endDate?.toString()), clean(ph.status)]);
                    } else {
                        ph.activities.forEach((act: any) => {
                            rows.push([clean(f1Name), clean(f2Name), clean(p.title), clean(ph.name), clean(act.name), clean(act.startDate?.toString() || ph.startDate?.toString()), clean(act.endDate?.toString() || ph.endDate?.toString()), clean(act.status)]);
                        });
                    }
                });
            }

            const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${title.replace(/\s+/g, '_')}_structure.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Descarga iniciada', { id: toastId });

        } catch (error) {
            console.error(error);
            toast.error('Error al generar CSV', { id: toastId });
        }
    };



    const handleDownloadFolderCSV = (folderId: string, folderName: string) => {
        const toastId = toast.loading('Generando reporte de carpeta...');
        try {
            // Filter projects in this folder from known projects
            // Ideally should fetch from server to be sure, but using current view data for now
            const folderProjects = DB.projects.filter(p => p.folderId === folderId);

            if (folderProjects.length === 0) {
                toast.success('Carpeta vacía', { id: toastId });
                return;
            }

            const rows = [['Nombre Proyecto', 'Estado', 'Progreso', 'Fecha Inicio', 'Fecha Fin']];
            folderProjects.forEach(p => {
                rows.push([
                    p.title.replace(/,/g, ' '),
                    p.status,
                    getProjectProgress(p) + '%',
                    p.startDate ? new Date(p.startDate).toLocaleDateString() : '',
                    p.endDate ? new Date(p.endDate).toLocaleDateString() : ''
                ]);
            });

            const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${folderName.replace(/\s+/g, '_')}_projects.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Descarga completada', { id: toastId });
        } catch (e) {
            console.error(e);
            toast.error('Error al descargar carpeta', { id: toastId });
        }
    };

    const handleDuplicateProject = async (projectId: string) => {
        const toastId = toast.loading('Duplicando proyecto...');
        try {
            const res = await duplicateProjectAction(projectId);
            if (res.success) {
                toast.success('Proyecto duplicado correctamente', { id: toastId });
                refreshData();
            } else {
                toast.error('Error al duplicar: ' + res.error, { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error inesperado al duplicar', { id: toastId });
        }
    };


    const handleDeleteProject = async (projectId: string) => {
        if (!confirm('¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.')) return;

        const toastId = toast.loading('Eliminando proyecto...');
        try {
            const res = await deleteProjectAction(projectId);
            if (res.success) {
                toast.success('Proyecto eliminado', { id: toastId });
                refreshData();
            } else {
                toast.error('Error al eliminar: ' + res.error, { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error inesperado al eliminar', { id: toastId });
        }
    };

    const handleImportCSV = async (file: File) => {
        const text = await file.text();
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        // Skip header if present
        const startIdx = lines[0].toLowerCase().includes('carpeta') ? 1 : 0;

        for (let i = startIdx; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            // Carpeta Nivel 1,Carpeta Nivel 2,Nombre Proyecto,Fase,Actividad,Fecha Inicio,Fecha Fin
            if (cols.length < 5) continue;

            const [f1Name, f2Name, projName, phaseName, actName, dateStart, dateEnd] = cols;

            // 1. L1 Folder
            let f1 = DB.projectFolders.find(f => f.name === f1Name && !f.parentId);
            if (!f1) {
                f1 = { id: `pf-${Date.now()}-${Math.random()}`, name: f1Name, createdAt: new Date().toISOString() };
                DB.projectFolders.push(f1);
            }

            // 2. L2 Folder
            let f2 = DB.projectFolders.find(f => f.name === f2Name && f.parentId === f1!.id);
            if (!f2 && f2Name) {
                f2 = { id: `pf-${Date.now()}-${Math.random()}`, name: f2Name, parentId: f1.id, createdAt: new Date().toISOString() };
                DB.projectFolders.push(f2);
            }

            const targetFolderId = f2 ? f2.id : f1.id;

            // 3. Project
            let proj = DB.projects.find(p => p.title === projName && p.folderId === targetFolderId);
            if (!proj) {
                proj = {
                    id: `pj-${Date.now()}-${Math.random()}`,
                    title: projName,
                    folderId: targetFolderId,
                    status: 'PLANNED',
                    phases: [],
                    creatorId: currentUser?.id || 'sys',
                    createdAt: new Date().toISOString(),
                    participants: [],
                    startDate: dateStart,
                    endDate: dateEnd
                };
                DB.projects.push(proj);
            }

            // 4. Phase
            let phase = proj.phases.find(p => p.name === phaseName);
            if (!phase) {
                phase = { id: `ph-${Date.now()}-${Math.random()}`, name: phaseName, activities: [], status: 'PENDING', order: proj.phases.length + 1 };
                proj.phases.push(phase);
            }

            // 5. Activity
            if (actName) {
                phase.activities.push({
                    id: `act-${Date.now()}-${Math.random()}`,
                    name: actName,
                    status: 'PENDING',
                    participants: [],
                    documents: [],
                    startDate: dateStart,
                    endDate: dateEnd
                });
            }
        }
        refreshData();
        setShowImportModal(false);
    };


    if (!isClient) return <div className="p-8 text-slate-400">Cargando workflows...</div>;

    const activeList = activeTab === 'REQUESTS' ? myRequests : myTasks;

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all`}>

                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row justify-between items-center shadow-sm z-10 gap-4">
                    <div>
                        {/* Nav Tabs */}
                        <div className="flex bg-slate-100 p-1 rounded-lg w-fit mb-4">
                            <button
                                onClick={() => setMainView('PROJECTS')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mainView === 'PROJECTS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t('nav_projects')}
                            </button>
                            <button
                                onClick={() => setMainView('WORKFLOWS')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mainView === 'WORKFLOWS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {t('nav_requests')}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {mainView === 'PROJECTS' && selectedFolderId && (
                                <button onClick={() => {
                                    // Go UP
                                    const curr = DB.projectFolders.find(f => f.id === selectedFolderId);
                                    setSelectedFolderId(curr?.parentId || null);
                                }} className="p-1 hover:bg-slate-100 rounded-full mr-2">
                                    <CaretLeft size={20} />
                                </button>
                            )}
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                {mainView === 'WORKFLOWS' ? t('wf_title_requests') : (
                                    <>
                                        {breadcrumbs.length > 0 ? (
                                            <div className="flex items-center text-lg">
                                                <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => setSelectedFolderId(null)}>Proyectos</span>
                                                {breadcrumbs.map(b => (
                                                    <span key={b.id} className="flex items-center">
                                                        <CaretRight size={14} className="mx-1 text-slate-300" />
                                                        <span className="cursor-pointer hover:underline" onClick={() => setSelectedFolderId(b.id)}>{b.name}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        ) : t('wf_title_projects')}
                                    </>
                                )}
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {mainView === 'PROJECTS' ? (
                            <>
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2"
                                >
                                    <FileCsv size={18} className="text-green-600" /> Importar
                                </button>
                                <button
                                    onClick={() => setShowNewFolderModal(true)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2"
                                >
                                    <FolderPlus size={18} className="text-yellow-500" /> Nueva Carpeta
                                </button>
                                <button
                                    onClick={() => setShowNewProjectModal(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 flex items-center gap-2"
                                >
                                    <Plus weight="bold" size={18} /> {t('wf_new_project')}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowNewModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2"
                            >
                                <Plus weight="bold" size={18} /> {t('wf_new_request')}
                            </button>
                        )}
                    </div>
                </div>

                {mainView === 'PROJECTS' ? (
                    <div className="p-8 grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                        {/* Folders */}
                        {foldersList.map(f => (
                            <div key={f.id} onClick={() => setSelectedFolderId(f.id)} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md cursor-pointer hover:border-blue-300 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-lg bg-yellow-50 text-yellow-500 group-hover:bg-yellow-100 transition-colors">
                                        <Folder size={28} weight="duotone" />
                                    </div>
                                    <div className="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                                        <button onClick={(e) => { e.stopPropagation(); handleDownloadFolderCSV(f.id, f.name); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-green-600 transition-colors" title="Descargar Reporte"><DownloadSimple size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingFolder(f); setShowNewFolderModal(true); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-500 transition-colors" title="Editar"><PencilSimple size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash size={18} /></button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">{f.name}</h3>
                                <p className="text-xs text-slate-400">{new Date(f.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}

                        {/* Projects */}
                        {projectsList.map(p => (
                            <div key={p.id} onClick={() => router.push(`/dashboard/workflows/${p.id}`)} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md cursor-pointer hover:border-purple-300 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-lg bg-purple-50 text-purple-600" style={{ backgroundColor: p.color ? `${p.color}20` : undefined, color: p.color }}>
                                        <Briefcase size={24} weight="duotone" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{p.status}</span>
                                </div>
                                <div className="flex justify-between items-start mb-2 group-actions">
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{p.title}</h3>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleDownloadProjectCSV(p.id, p.title); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-green-600 transition-colors" title="Descargar estructura CSV"><DownloadSimple size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDuplicateProject(p.id); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-purple-600 transition-colors" title="Duplicar"><Copy size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash size={18} /></button>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{p.description}</p>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${getProjectProgress(p)}%`, backgroundColor: p.color }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                    <span>Progreso</span>
                                    <span>{getProjectProgress(p)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Simple list for workflows */}
                        {activeList.map(c => (
                            <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 mb-3 flex justify-between items-center hover:shadow-sm cursor-pointer" onClick={() => setSelectedCase(c)}>
                                <div>
                                    <h3 className="font-bold text-slate-800">{c.title}</h3>
                                    <p className="text-xs text-slate-500">{c.status} • {new Date(c.createdAt).toLocaleDateString()}</p>
                                </div>
                                <CaretRight size={18} className="text-slate-300" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* NEW PROJECT MODAL */}
            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        createProject({
                            title: fd.get('title') as string,
                            description: fd.get('desc') as string,
                            startDate: fd.get('start') as string,
                            endDate: fd.get('end') as string,
                            color: fd.get('color') as string,
                            folderId: fd.get('folderId') as string || undefined,
                        });
                        setShowNewProjectModal(false);
                    }} className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Nuevo Proyecto</h3>
                            <button type="button" onClick={() => setShowNewProjectModal(false)}><XCircle size={24} className="text-slate-300 hover:text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Proyecto</label>
                                <input name="title" className="w-full border p-2.5 rounded-lg text-sm" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea name="desc" rows={3} className="w-full border p-2.5 rounded-lg text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ubicación</label>
                                <select name="folderId" className="w-full border p-2.5 rounded-lg text-sm bg-white" defaultValue={selectedFolderId || ''}>
                                    <option value="">Carpeta Raíz (Primer Nivel)</option>
                                    {DB.projectFolders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Color de Tarjeta</label>
                                <div className="flex gap-2">
                                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                                        <label key={c} className="cursor-pointer">
                                            <input type="radio" name="color" value={c} className="peer sr-only" defaultChecked={c === '#3b82f6'} />
                                            <div className="w-8 h-8 rounded-full bg-current border-2 border-transparent peer-checked:border-slate-800 active:scale-95 transition-all" style={{ color: c }}></div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Inicio</label>
                                    <input type="date" name="start" className="w-full border p-2.5 rounded-lg text-sm" required defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Fin</label>
                                    <input type="date" name="end" className="w-full border p-2.5 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t bg-slate-50 rounded-b-xl flex justify-end gap-2">
                            <button type="button" onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm shadow-lg shadow-purple-500/30">Crear Proyecto</button>
                        </div>
                    </form>
                </div>
            )}

            {/* NEW FOLDER MODAL */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);

                        const newFolderData = {
                            id: `pf-${Date.now()}`,
                            name: fd.get('name') as string,
                            description: fd.get('desc') as string,
                            parentId: (fd.get('parentId') as string) || undefined,
                            color: fd.get('color') as string
                        };


                        // ...


                        // Check if updating or creating
                        let res;
                        if (editingFolder) {
                            res = await updateProjectFolderAction(editingFolder.id, {
                                name: newFolderData.name,
                                description: newFolderData.description,
                                parentId: newFolderData.parentId ?? null, // Convert undefined to null for DB if needed, depends on action sig
                                color: newFolderData.color
                            });
                        } else {
                            res = await createProjectFolderAction({
                                ...newFolderData,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            });
                        }

                        if (res.success) {
                            toast.success(editingFolder ? 'Carpeta actualizada' : 'Carpeta creada correcta');
                            loadFolders();
                            setShowNewFolderModal(false);
                            setEditingFolder(null);
                        } else {
                            toast.error('Error: ' + (res.error || 'Desconocido'));
                        }
                    }} className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingFolder ? 'Editar Carpeta' : 'Nueva Carpeta'}</h3>
                            <button type="button" onClick={() => setShowNewFolderModal(false)}><XCircle size={24} className="text-slate-300 hover:text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                                <input name="name" defaultValue={editingFolder?.name} className="w-full border p-2.5 rounded-lg text-sm" required autoFocus />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea name="desc" defaultValue={editingFolder?.description} rows={2} className="w-full border p-2.5 rounded-lg text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ubicación</label>
                                <select name="parentId" className="w-full border p-2.5 rounded-lg text-sm bg-white" defaultValue={editingFolder?.parentId || selectedFolderId || ''}>
                                    <option value="">Nivel Principal (Raíz)</option>
                                    {folders.filter(f => f.id !== editingFolder?.id).map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Color</label>
                                <div className="flex gap-2">
                                    {['#fbbf24', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'].map(c => (
                                        <label key={c} className="cursor-pointer">
                                            <input type="radio" name="color" value={c} className="peer sr-only" defaultChecked={editingFolder ? editingFolder.color === c : c === '#fbbf24'} />
                                            <div className="w-8 h-8 rounded-full bg-current border-2 border-transparent peer-checked:border-slate-800 active:scale-95 transition-all" style={{ color: c }}></div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t bg-slate-50 rounded-b-xl flex justify-end gap-2">
                            <button type="button" onClick={() => { setShowNewFolderModal(false); setEditingFolder(null); }} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-lg shadow-blue-500/30">{editingFolder ? 'Guardar Cambios' : 'Crear Carpeta'}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* IMPORT MODAL */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <FileCsv size={24} className="text-green-600" /> Importar Estructura de Proyectos
                            </h3>
                            <button onClick={() => setShowImportModal(false)}><XCircle size={24} className="text-slate-300 hover:text-slate-500" /></button>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-600 mb-6">Carga un archivo CSV para generar automáticamente carpetas, proyectos, fases y actividades.</p>

                            <div className="bg-slate-50 border rounded-xl p-6 mb-6">
                                <h4 className="font-bold text-sm mb-2">1. Descarga la plantilla</h4>
                                <p className="text-xs text-slate-500 mb-4">Usa este archivo como base para llenar tu información.</p>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 text-slate-700">
                                    <DownloadSimple size={18} /> Descargar CSV Ejemplo
                                </button>
                            </div>

                            <div className="bg-slate-50 border rounded-xl p-6">
                                <h4 className="font-bold text-sm mb-2">2. Sube tu archivo</h4>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors relative cursor-pointer">
                                    <CloudArrowUp size={48} className="mx-auto text-slate-300 mb-2" />
                                    <p className="font-bold text-slate-700">Seleccionar archivo</p>
                                    <p className="text-xs text-slate-400">CSV hasta 5MB</p>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) handleImportCSV(e.target.files[0]);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t bg-slate-50 rounded-b-xl flex justify-end gap-2">
                            <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* NEW REQUEST MODAL */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        createWorkflowCase({
                            title: fd.get('title') as string,
                            description: fd.get('description') as string,
                            priority: (fd.get('priority') as any) || 'MEDIUM',
                            dueDate: (fd.get('dueDate') as string) || undefined,
                        });
                        setShowNewModal(false);
                    }} className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
                        <div className="p-5 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Nueva Solicitud</h3>
                            <button type="button" onClick={() => setShowNewModal(false)}><XCircle size={24} className="text-slate-300 hover:text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                <input name="title" className="w-full border p-2.5 rounded-lg text-sm" required autoFocus placeholder="Ej. Aprobación de Presupuesto" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea name="description" rows={3} className="w-full border p-2.5 rounded-lg text-sm" placeholder="Detalles de la solicitud..."></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prioridad</label>
                                    <select name="priority" className="w-full border p-2.5 rounded-lg text-sm bg-white">
                                        <option value="LOW">Baja</option>
                                        <option value="MEDIUM">Media</option>
                                        <option value="HIGH">Alta</option>
                                        <option value="URGENT">Urgente</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Límite</label>
                                    <input type="date" name="dueDate" className="w-full border p-2.5 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border-t bg-slate-50 rounded-b-xl flex justify-end gap-2">
                            <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm shadow-lg shadow-blue-500/30">Crear Solicitud</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
