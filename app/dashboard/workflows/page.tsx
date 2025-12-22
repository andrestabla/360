'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { DB, WorkflowCase, WorkflowDefinition, Project, ProjectPhase, ProjectDocument, ProjectActivity, ProjectFolder, User as ProjectUser } from '@/lib/data';
import {
    Plus, Kanban, CheckCircle, Clock, XCircle, User, Calendar,
    Tray, ArrowRight, CaretRight, ChatCircle, Paperclip, Funnel, UserSwitch, MagnifyingGlass,
    Briefcase, Folder, Trash, Upload, FileText, YoutubeLogo, Link as LinkIcon, Camera, PencilSimple, Bell, Copy, FileCsv,
    FilePpt, FileDoc, FileXls, Presentation, Minus, MagnifyingGlassPlus, DownloadSimple, CloudArrowUp
} from '@phosphor-icons/react';
import VisualPDFEditor from '@/components/VisualPDFEditor';

// --- GLOBAL PROGRESS UTILS ---
const getStatusValue = (status: string) => {
    switch (status) {
        case 'VALIDATED': return 100; // Validado
        case 'DELIVERED': return 90;  // Entregado
        case 'IN_REVIEW': return 80;  // En revisión (QA)
        case 'COMPLETED': return 60;  // Finalizado
        case 'IN_PROGRESS': return 20; // En proceso
        default: return 0; // Sin iniciar
    }
};

const getPhaseProgress = (phase: ProjectPhase) => {
    if (!phase.activities || phase.activities.length === 0) return 0;
    const total = phase.activities.reduce((acc, act) => acc + getStatusValue(act.status), 0);
    return Math.round(total / phase.activities.length);
};

const getProjectProgress = (proj: Project) => {
    if (!proj.phases || proj.phases.length === 0) return 0;
    const totalPhaseProgress = proj.phases.reduce((acc, p) => acc + getPhaseProgress(p), 0);
    return Math.round(totalPhaseProgress / proj.phases.length);
};

// --- MAIN PAGE COMPONENT ---
export default function WorkflowsPage() {
    const { currentUser, currentTenantId, createProject, updateProject, createProjectFolder, updateProjectFolder, deleteProjectFolder, version } = useApp();
    const { t } = useTranslation();
    const [mainView, setMainView] = useState<'WORKFLOWS' | 'PROJECTS'>('PROJECTS');
    const [activeTab, setActiveTab] = useState<'REQUESTS' | 'TASKS'>('REQUESTS');
    const [selectedCase, setSelectedCase] = useState<WorkflowCase | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);

    // PROJECT STATES
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [currentFolderViewId, setCurrentFolderViewId] = useState<string | null>(null);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);



    const [isClient, setIsClient] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // Filters
    const [search, setSearch] = useState('');
    const [filterUnit, setFilterUnit] = useState('ALL');
    const [filterProcess, setFilterProcess] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterDate, setFilterDate] = useState('');

    const availableUnits = useMemo(() => {
        return DB.units
            .filter(u => u.tenantId === currentTenantId && u.type === 'UNIT')
            .map(u => u.name);
    }, [currentTenantId, updateTrigger]);

    const availableProcesses = useMemo(() => {
        // Obtener todos los procesos únicos de proyectos y carpetas
        const allProjects = DB.projects.filter(p => p.tenantId === currentTenantId);
        const allFolders = DB.projectFolders.filter(f => f.tenantId === currentTenantId);

        // Combinar procesos de proyectos y carpetas
        const processesFromData = new Set<string>();

        allProjects.forEach(p => {
            if (p.process) {
                // Si hay filtro de unidad, solo incluir procesos de esa unidad
                if (filterUnit === 'ALL' || p.unit === filterUnit) {
                    processesFromData.add(p.process);
                }
            }
        });

        allFolders.forEach(f => {
            if (f.process) {
                // Si hay filtro de unidad, solo incluir procesos de esa unidad
                if (filterUnit === 'ALL' || f.unit === filterUnit) {
                    processesFromData.add(f.process);
                }
            }
        });

        // Convertir a array de strings únicos y ordenar
        return Array.from(processesFromData).sort();
    }, [currentTenantId, filterUnit, updateTrigger]);

    const matchesFilters = (c: WorkflowCase) => {
        const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
        const matchUnit = filterUnit === 'ALL' || c.unit === filterUnit;
        // WorkflowCase doesn't officially track process yet, so we skip matchProcess for now to avoid errors
        const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
        const matchDate = !filterDate || c.createdAt.startsWith(filterDate);
        return matchSearch && matchUnit && matchStatus && matchDate;
    };
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Reset process filter when unit changes
    useEffect(() => {
        setFilterProcess('ALL');
    }, [filterUnit]);

    const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

    // Filter Logic
    const myRequests = useMemo(() => {
        if (!isClient) return [];
        return DB.workflowCases.filter(c =>
            c.tenantId === currentTenantId &&
            c.creatorId === currentUser?.id &&
            matchesFilters(c)
        );
    }, [currentTenantId, currentUser?.id, isClient, updateTrigger, search, filterUnit, filterStatus, filterDate, version]);

    const myTasks = useMemo(() => {
        if (!currentUser || !isClient) return [];
        return DB.workflowCases.filter(c =>
            c.tenantId === currentTenantId &&
            c.status === 'IN_PROGRESS' &&
            // Logic: Assigned to me OR (Unassigned AND in my Unit)
            (c.assigneeId === currentUser.id || (!c.assigneeId && c.unit === currentUser.unit)) &&
            matchesFilters(c)
        );
    }, [currentTenantId, currentUser, isClient, updateTrigger, search, filterUnit, filterStatus, filterDate, version]);

    const projectsList = useMemo(() => {
        if (!isClient) return [];
        return DB.projects.filter(p => {
            const matchTenant = p.tenantId === currentTenantId;
            const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
            const matchUnit = filterUnit === 'ALL' || p.unit === filterUnit;
            const matchProcess = filterProcess === 'ALL' || p.process === filterProcess;
            const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
            const matchDate = !filterDate || p.createdAt.startsWith(filterDate);
            return matchTenant && matchSearch && matchUnit && matchProcess && matchStatus && matchDate;
        });
    }, [currentTenantId, isClient, updateTrigger, version, search, filterUnit, filterProcess, filterStatus, filterDate]);

    const foldersList = useMemo(() => {
        if (!isClient) return [];
        return DB.projectFolders.filter(f => {
            const matchTenant = f.tenantId === currentTenantId;
            const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
            const matchUnit = filterUnit === 'ALL' || f.unit === filterUnit;
            const matchProcess = filterProcess === 'ALL' || f.process === filterProcess;
            // Folders don't have status, so we ignore filterStatus for folders, OR checking if it matches 'ALL' implies we show them. 
            // If filterStatus is set to specific project status, maybe we hide folders? 
            // Ideally folders are containers. Let's show them unless they are explicitly filtered out by Unit/Process/Search.
            const matchDate = !filterDate || f.createdAt.startsWith(filterDate);
            return matchTenant && matchSearch && matchUnit && matchProcess && matchDate;
        });
    }, [currentTenantId, isClient, updateTrigger, version, search, filterUnit, filterProcess, filterStatus, filterDate]);

    // Add Doc State (Lifted)
    const [addingDocTarget, setAddingDocTarget] = useState<{ projectId: string, phaseId: string, activityId: string } | null>(null);

    const handleAddDocToProject = (doc: ProjectDocument) => {
        if (!addingDocTarget || !selectedProject) return;
        const { phaseId, activityId } = addingDocTarget;

        const newPhases = selectedProject.phases.map((p: ProjectPhase) => {
            if (p.id === phaseId) {
                const newActivities = p.activities.map((a: ProjectActivity) => {
                    if (a.id === activityId) {
                        return { ...a, documents: [...a.documents, doc] };
                    }
                    return a;
                });
                return { ...p, activities: newActivities };
            }
            return p;
        });

        const updatedProject = { ...selectedProject, phases: newPhases };
        updateProject(selectedProject.id, updatedProject);
        setSelectedProject(updatedProject); // Immediate UI update
        setSelectedProject(updatedProject); // Immediate UI update
        setAddingDocTarget(null);
    };

    // Add Member State
    const [addingMemberTarget, setAddingMemberTarget] = useState<{ type: 'GLOBAL' | 'ACTIVITY', phaseId?: string, activityId?: string } | null>(null);

    const handleAddMemberToProject = (user: ProjectUser) => {
        if (!addingMemberTarget || !selectedProject) return;
        const { type, phaseId, activityId } = addingMemberTarget;
        const newMember = { userId: user.id, role: 'Member' };

        let updatedProject = { ...selectedProject };

        if (type === 'GLOBAL') {
            // Avoid duplicates
            if (updatedProject.participants.some(p => typeof p === 'object' && p.userId === user.id)) {
                alert('El usuario ya es parte del equipo global.');
                return;
            }
            updatedProject.participants = [...updatedProject.participants, newMember];
        } else if (type === 'ACTIVITY' && phaseId && activityId) {
            const newPhases = selectedProject.phases.map(p => {
                if (p.id === phaseId) {
                    const newActivities = p.activities.map(a => {
                        if (a.id === activityId) {
                            if (a.participants.some(p => typeof p === 'object' && p.userId === user.id)) return a;
                            return { ...a, participants: [...a.participants, newMember] };
                        }
                        return a;
                    });
                    return { ...p, activities: newActivities };
                }
                return p;
            });
            updatedProject = { ...updatedProject, phases: newPhases };
        }

        updateProject(selectedProject.id, updatedProject);
        setSelectedProject(updatedProject);
        setAddingMemberTarget(null);
    };



    // Work On Doc State
    const [workingDocTarget, setWorkingDocTarget] = useState<{ projectId: string, phaseId: string, activityId: string, docId: string, mode: 'VIEW' | 'WORK' } | null>(null);

    const handleSaveDocVersion = (phaseId: string, activityId: string, docId: string, newVersion: any) => {
        // Implementation will be handled in Modal logic updating the project via updateProject
        // But better to have a handler here to keep logic centralized or pass `updateProject` to modal.
        // For simplicity, I'll pass `onSave` to Modal which calls a handler here.
    };

    if (!isClient) return <div className="p-8 text-slate-400">Cargando workflows...</div>;

    const activeList = activeTab === 'REQUESTS' ? myRequests : myTasks;

    const handleCreateWrapper = (def: WorkflowDefinition) => {
        // Create new case logic
        const newCase: WorkflowCase = {
            id: `case-${Date.now()}`,
            workflowId: def.id,
            tenantId: currentTenantId!,
            title: `${def.title} - ${currentUser?.name}`,
            status: 'RECEIVED',
            creatorId: currentUser!.id,
            unit: def.unit,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: {},
            history: [{ status: 'RECEIVED', by: currentUser!.name, date: new Date().toISOString(), comment: 'Solicitud creada' }],
            comments: []
        };
        DB.workflowCases.unshift(newCase); // Add to local DB mock
        forceUpdate();
        setShowNewModal(false);
        setActiveTab('REQUESTS');
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all ${selectedCase || selectedProject ? 'mr-0' : ''}`}>

                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex bg-slate-100 p-1 rounded-lg">
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
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            {mainView === 'WORKFLOWS' ? <Kanban className="text-blue-600" weight="duotone" /> : <Briefcase className="text-purple-600" weight="duotone" />}
                            {mainView === 'WORKFLOWS' ? t('wf_title_requests') : t('wf_title_projects')}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            {mainView === 'WORKFLOWS' ? t('wf_desc_requests') : t('wf_desc_projects')}
                        </p>
                    </div>

                    {mainView === 'WORKFLOWS' ? (
                        <button
                            onClick={() => setShowNewModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus weight="bold" size={18} /> {t('wf_new_request')}
                        </button>
                    ) : (
                        (currentUser?.role === 'ADMIN' || currentUser?.role === 'superadmin' || currentUser?.role === 'Admin Global' || currentUser?.level === 1) ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowNewProjectModal(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <Plus weight="bold" size={18} /> {t('wf_new_project')}
                                </button>
                                <button
                                    onClick={() => setShowNewFolderModal(true)}
                                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                >
                                    <Folder weight="duotone" size={18} /> {t('wf_new_folder')}
                                </button>
                                <button
                                    onClick={() => setShowImportModal(true)}
                                    className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                    title={t('wf_import')}
                                >
                                    <FileCsv weight="duotone" size={18} /> {t('wf_import')}
                                </button>
                            </div>
                        ) : null
                    )}
                </div>


                {/* Filters Toolbar */}
                <div className="px-8 mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            placeholder={mainView === 'WORKFLOWS' ? "Buscar por asunto o ID..." : "Buscar proyecto..."}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Unit Filter */}
                    <div className="relative">
                        <select
                            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                            value={filterUnit}
                            onChange={e => setFilterUnit(e.target.value)}
                        >
                            <option value="ALL">Todas las Áreas</option>
                            {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <CaretRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={12} />
                    </div>

                    {/* Process Filter - New Addition for Projects/Workflows granularity */}
                    <div className="relative">
                        <select
                            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                            value={filterProcess}
                            onChange={e => setFilterProcess(e.target.value)}
                        >
                            <option value="ALL">Todos los Procesos</option>
                            {availableProcesses.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <CaretRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={12} />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">Todos los Estados</option>
                            {mainView === 'WORKFLOWS' ? (
                                <>
                                    <option value="RECEIVED">Recibido</option>
                                    <option value="IN_PROGRESS">En Proceso</option>
                                    <option value="REVIEW">En Revisión</option>
                                    <option value="APPROVED">Aprobado</option>
                                    <option value="REJECTED">Rechazado</option>
                                    <option value="CLOSED">Cerrado</option>
                                </>
                            ) : (
                                <>
                                    <option value="PLANNING">Planning</option>
                                    <option value="ACTIVE">En Ejecución</option>
                                    <option value="COMPLETED">Completado</option>
                                    <option value="ON_HOLD">En Espera</option>
                                    <option value="CANCELLED">Cancelado</option>
                                </>
                            )}
                        </select>
                        <CaretRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={12} />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="date"
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                        />
                    </div>
                </div>

                {mainView === 'WORKFLOWS' && (
                    <>
                        {/* Tabs */}
                        <div className="px-8 mt-6">
                            <div className="flex gap-6 border-b border-slate-200">
                                <TabButton
                                    active={activeTab === 'REQUESTS'}
                                    onClick={() => setActiveTab('REQUESTS')}
                                    label="Mis Solicitudes"
                                    count={myRequests.length}
                                />
                                <TabButton
                                    active={activeTab === 'TASKS'}
                                    onClick={() => setActiveTab('TASKS')}
                                    label="Mis Tareas"
                                    count={myTasks.length}
                                    alert={myTasks.length > 0}
                                />
                            </div>
                        </div>



                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {activeList.length > 0 ? (
                                <div className="space-y-3">
                                    {activeList.map((c) => (
                                        <CaseCard
                                            key={c.id}
                                            data={c}
                                            onClick={() => setSelectedCase(c)}
                                            active={selectedCase?.id === c.id}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState type={activeTab} onAction={() => setShowNewModal(true)} />
                            )}
                        </div>
                    </>
                )}

                {/* PROJECTS VIEW */}
                {mainView === 'PROJECTS' && (
                    <ProjectsView
                        projects={projectsList}
                        folders={foldersList}
                        onSelect={setSelectedProject}
                        selectedId={selectedProject?.id}
                        forceUpdate={forceUpdate}
                        currentFolderId={currentFolderViewId}
                        setCurrentFolderId={setCurrentFolderViewId}
                    />
                )}

            </div>

            {/* Detail Drawer - Workflows */}
            {
                selectedCase && (
                    <div className="w-[450px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-slideLeft z-20">
                        <CaseDetail
                            workflowCase={selectedCase}
                            onClose={() => { setSelectedCase(null); forceUpdate(); }}
                            currentUser={currentUser}
                        />
                    </div>
                )
            }

            {/* Detail Drawer - Projects */}
            {
                selectedProject && (
                    <ProjectDrawer
                        project={selectedProject}
                        folders={foldersList}
                        onClose={() => { setSelectedProject(null); forceUpdate(); }}
                        onSave={forceUpdate}
                        currentUser={currentUser}
                        active={true}
                        onRequestAddDoc={(phaseId, activityId) => setAddingDocTarget({ projectId: selectedProject.id, phaseId, activityId })}
                        onRequestAddMember={(target) => setAddingMemberTarget(target)}
                        onRequestWorkOnDoc={(phaseId, activityId, docId, mode) => setWorkingDocTarget({ projectId: selectedProject.id, phaseId, activityId, docId, mode })}
                    />
                )
            }

            {/* New Workflow Modal */}
            {showNewModal && <NewWorkflowModal onClose={() => setShowNewModal(false)} onCreate={handleCreateWrapper} tenantId={currentTenantId!} />}

            {/* New Project Modal */}
            {
                showNewProjectModal && (
                    <NewProjectModal
                        onClose={() => setShowNewProjectModal(false)}
                        onCreate={(data) => {
                            if (createProject) createProject(data);
                            forceUpdate();
                            setShowNewProjectModal(false);
                        }}
                        tenantId={currentTenantId!}
                        folders={foldersList}
                    />
                )
            }

            {/* New Folder Modal */}
            {
                showNewFolderModal && (
                    <NewFolderModal
                        onClose={() => setShowNewFolderModal(false)}
                        onCreate={(data: any) => {
                            // Logic to create folder with detailed data
                            // We need to extend createProjectFolder or use a custom handler here since existing createProjectFolder might be simple
                            // But for now let's assume we can pass the data object if we modify the context or we just mock it here directly via DB/forceUpdate if context is limited.
                            // Checking context: createProjectFolder(name, parentId?)
                            // We might need to update the folder after creation or just push to DB if context is limited.
                            // Let's rely on DB push for the extra fields if context function is too simple, OR assuming `createProjectFolder` is flexible.
                            // Actually, I'll update DB directly here to support the full object for this demo or use the context if it supports it.
                            // Since I can't easily see Context implementation, I'll direct DB update for extra fields if needed.

                            const newFolder = {
                                id: `fld-${Date.now()}`,
                                tenantId: currentTenantId!,
                                createdAt: new Date().toISOString(),
                                ...data
                            };
                            DB.projectFolders.push(newFolder);
                            forceUpdate();
                            setShowNewFolderModal(false);
                        }}
                        folders={foldersList}
                    />
                )
            }

            {/* Import Project Modal */}
            {
                showImportModal && (
                    <ImportProjectModal
                        onClose={() => setShowImportModal(false)}
                        onImport={(csvText) => {
                            const lines = csvText.split('\n').filter(l => l.trim().length > 0);

                            // Map key: "Folder1|Folder2|ProjectName"
                            const projectsMap: any = {};

                            for (let i = 1; i < lines.length; i++) {
                                const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, '')); // Basic quote removal
                                if (cols.length < 3) continue;

                                const l1 = cols[0];
                                const l2 = cols[1];
                                const projName = cols[2];
                                const phaseName = cols[3];
                                const actName = cols[4];
                                const start = cols[5];
                                const end = cols[6];

                                if (!projName) continue;

                                const key = `${l1}|${l2}|${projName}`;
                                if (!projectsMap[key]) {
                                    projectsMap[key] = {
                                        l1, l2, projName, startDate: start, endDate: end, phases: {}
                                    };
                                }

                                if (phaseName) {
                                    if (!projectsMap[key].phases[phaseName]) {
                                        projectsMap[key].phases[phaseName] = [];
                                    }
                                    if (actName) {
                                        projectsMap[key].phases[phaseName].push({ name: actName, start, end });
                                    }
                                }
                            }

                            Object.values(projectsMap).forEach((p: any) => {
                                let folderId = undefined;
                                if (p.l1) {
                                    let f1 = DB.projectFolders.find(f => f.tenantId === currentTenantId && f.name.toLowerCase() === p.l1.toLowerCase() && !f.parentId);
                                    if (!f1) {
                                        createProjectFolder(p.l1);
                                        f1 = DB.projectFolders[DB.projectFolders.length - 1];
                                    }
                                    folderId = f1.id;

                                    if (p.l2) {
                                        let f2 = DB.projectFolders.find(f => f.tenantId === currentTenantId && f.name.toLowerCase() === p.l2.toLowerCase() && f.parentId === f1!.id);
                                        if (!f2) {
                                            createProjectFolder(p.l2, f1.id);
                                            f2 = DB.projectFolders[DB.projectFolders.length - 1];
                                        }
                                        folderId = f2.id;
                                    }
                                }

                                const phases: ProjectPhase[] = Object.keys(p.phases).map((phName, idx) => ({
                                    id: `ph-${Date.now()}-${idx}`,
                                    name: phName,
                                    order: idx + 1,
                                    status: 'NOT_STARTED',
                                    activities: p.phases[phName].map((act: any, aIdx: number) => ({
                                        id: `act-${Date.now()}-${idx}-${aIdx}`,
                                        name: act.name,
                                        status: 'NOT_STARTED',
                                        participants: [],
                                        documents: [],
                                        startDate: act.start,
                                        endDate: act.end
                                    }))
                                }));

                                if (phases.length === 0) {
                                    phases.push({
                                        id: `ph-${Date.now()}`,
                                        name: 'Fase Inicial',
                                        order: 1,
                                        status: 'NOT_STARTED',
                                        activities: []
                                    });
                                }

                                createProject({
                                    title: p.projName,
                                    description: 'Importado vía CSV',
                                    startDate: p.startDate,
                                    endDate: p.endDate,
                                    folderId,
                                    phases
                                });
                            });

                            alert('Proyectos importados exitosamente.');
                            setShowImportModal(false);
                            forceUpdate();
                        }}
                    />
                )
            }

            {/* Add Doc Modal */}
            {addingDocTarget && (
                <AddProjectDocModal
                    onClose={() => setAddingDocTarget(null)}
                    onAdd={handleAddDocToProject}
                    tenantId={currentTenantId || ''}
                />
            )}

            {/* Add Member Modal */}
            {addingMemberTarget && (
                <AddMemberModal
                    onClose={() => setAddingMemberTarget(null)}
                    onAdd={handleAddMemberToProject}
                    tenantId={currentTenantId || ''}
                />
            )}

            {/* Add Member Modal */}
            {addingMemberTarget && (
                <AddMemberModal
                    onClose={() => setAddingMemberTarget(null)}
                    onAdd={handleAddMemberToProject}
                    tenantId={currentTenantId || ''}
                />
            )}

            {/* Document Editor Modal */}
            {workingDocTarget && selectedProject && (
                <DocumentEditorModal
                    project={selectedProject}
                    target={workingDocTarget}
                    onClose={() => setWorkingDocTarget(null)}
                    onUpdate={(updatedProject) => {
                        updateProject(selectedProject.id, updatedProject);
                        setSelectedProject(updatedProject);
                    }}
                />
            )}
        </div >
    );
}

// --- SUB COMPONENTS ---

function TabButton({ active, onClick, label, count, alert }: any) {
    return (
        <button
            onClick={onClick}
            className={`pb-3 font-semibold text-sm transition-all relative flex items-center gap-2 ${active ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
        >
            {label}
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-blue-100' : 'bg-slate-100'} ${alert ? 'text-white bg-rose-500' : ''}`}>
                {count}
            </span>
        </button>
    )
}

function CaseCard({ data, onClick, active }: { data: WorkflowCase, onClick: () => void, active: boolean }) {
    const statusMap: any = {
        'RECEIVED': { color: 'bg-slate-100 text-slate-600', label: 'Recibido', icon: Tray },
        'IN_PROGRESS': { color: 'bg-blue-50 text-blue-600', label: 'En Proceso', icon: Clock },
        'CLOSED': { color: 'bg-emerald-50 text-emerald-600', label: 'Cerrado', icon: CheckCircle },
        'REJECTED': { color: 'bg-rose-50 text-rose-600', label: 'Rechazado', icon: XCircle },
    };
    const st = statusMap[data.status] || statusMap['RECEIVED'];
    const StatusIcon = st.icon;

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md bg-white ${active ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1.5 ${st.color}`}>
                    <StatusIcon weight="bold" /> {st.label}
                </div>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar /> {new Date(data.createdAt).toLocaleDateString()}
                </span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{data.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="truncate max-w-[150px]">{data.unit}</span>
                <span>•</span>
                <span>ID: {data.id.split('-').pop()}</span>
            </div>
        </div>
    )
}

function CaseDetail({ workflowCase, onClose, currentUser }: { workflowCase: WorkflowCase, onClose: () => void, currentUser: any }) {
    const isAssignee = workflowCase.assigneeId === currentUser?.id ||
        (!workflowCase.assigneeId && workflowCase.unit === currentUser?.unit) ||
        currentUser?.role === 'ADMIN'; // Allow Admins for demo
    const [comment, setComment] = useState('');

    const handleTransition = (newStatus: 'IN_PROGRESS' | 'CLOSED' | 'REJECTED') => {
        // Mock transition logic
        workflowCase.status = newStatus;
        if (newStatus === 'IN_PROGRESS' && !workflowCase.assigneeId) workflowCase.assigneeId = currentUser.id;

        workflowCase.history.unshift({
            status: newStatus,
            by: currentUser.name,
            date: new Date().toISOString(),
            comment: `Estado cambiado a ${newStatus}`
        });
        // Force update trick would be needed in real React if not using global store correctly, assuming parent re-renders or we rely on DB ref
        onClose(); // Close to refresh/simple UX
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <button onClick={onClose} className="mb-4 text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
                    <ArrowRight className="rotate-180" /> Volver
                </button>
                <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2">{workflowCase.title}</h2>
                <div className="flex gap-2 text-xs">
                    <span className="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-600 font-medium">{workflowCase.unit}</span>
                    <span className="bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-600 font-medium">Creado por {workflowCase.creatorId.split('-').pop()}</span>
                </div>
            </div>

            {/* Action Bar */}
            {workflowCase.status !== 'CLOSED' && workflowCase.status !== 'REJECTED' && (
                <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-2 gap-3">
                    {/* Leader Assignment */}
                    {currentUser?.level <= 3 && (
                        <div className="col-span-2 mb-2 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold">
                                <UserSwitch size={18} />
                                <span>Líder de Área ({currentUser.unit}): Asignar Responsable</span>
                            </div>
                            <select
                                className="bg-white border border-indigo-200 text-xs rounded px-2 py-1 outline-none text-indigo-700"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        workflowCase.assigneeId = e.target.value;
                                        workflowCase.history.unshift({ status: workflowCase.status, by: currentUser.name, date: new Date().toISOString(), comment: `Reasignado a usuario ${e.target.value}` });
                                        onClose();
                                    }
                                }}
                                value={workflowCase.assigneeId || ''}
                            >
                                <option value="">-- Sin Asignar --</option>
                                {DB.users.filter(u => u.tenantId === workflowCase.tenantId).map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isAssignee ? (
                        workflowCase.status === 'RECEIVED' ? (
                            <button onClick={() => handleTransition('IN_PROGRESS')} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-md shadow-blue-500/20">
                                Iniciar Trámite
                            </button>
                        ) : (
                            <>
                                <button onClick={() => handleTransition('REJECTED')} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 rounded-lg text-sm transition-all">
                                    Rechazar
                                </button>
                                <button onClick={() => handleTransition('CLOSED')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm transition-all shadow-md shadow-emerald-500/20">
                                    Aprobar / Cerrar
                                </button>
                            </>
                        )
                    ) : (
                        <div className="col-span-2 text-center text-xs text-slate-400 italic py-2">
                            Solo el responsable asignado puede gestionar este caso.
                        </div>
                    )}
                </div>
            )}

            {/* Content Scroller */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Timeline */}
                <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Línea de Tiempo</h4>
                    <div className="border-l-2 border-slate-100 ml-2 space-y-6 pl-6 relative">
                        {workflowCase.history.map((h, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute -left-[31px] w-3 h-3 rounded-full border-2 border-white ring-2 ${i === 0 ? 'bg-blue-500 ring-blue-100' : 'bg-slate-300 ring-slate-100'}`}></div>
                                <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    {h.status} <span className="text-[10px] font-normal text-slate-400">{new Date(h.date).toLocaleDateString()}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{h.by}</p>
                                {h.comment && <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded border border-slate-100 inline-block">"{h.comment}"</p>}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Form Data Preview (Mock) */}
                <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Datos de la Solicitud</h4>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-xs text-slate-500">ID Referencia</span>
                            <span className="text-xs font-medium text-slate-900">{workflowCase.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-xs text-slate-500">Prioridad</span>
                            <span className="text-xs font-medium text-amber-600">Alta (Simulado)</span>
                        </div>
                        <div className="pt-2">
                            <p className="text-xs text-slate-500 mb-1">Descripción / Motivo</p>
                            <p className="text-sm text-slate-800">Solicitud generada automáticamente para demostración de flujos de trabajo.</p>
                        </div>
                    </div>
                </section>

                {/* Comments/Chat */}
                <section>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Comentarios Internos</h4>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 p-6 text-center text-xs text-slate-400">
                            <ChatCircle size={24} className="mx-auto mb-2 opacity-50" />
                            No hay comentarios aún.
                        </div>
                        <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
                            <input className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Escribe un comentario..." />
                            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"><CaretRight weight="bold" /></button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

function NewWorkflowModal({ onClose, onCreate, tenantId }: { onClose: () => void, onCreate: (def: WorkflowDefinition) => void, tenantId: string }) {
    // Mock Catalog
    const catalog = useMemo(() => DB.workflowDefinitions.filter(w => w.tenantId === tenantId && w.active), [tenantId]);
    const [filterUnit, setFilterUnit] = useState('ALL');
    const [search, setSearch] = useState('');

    const units = useMemo(() => Array.from(new Set(catalog.map(w => w.unit))), [catalog]);

    const filtered = useMemo(() => {
        return catalog.filter(w => {
            const matchUnit = filterUnit === 'ALL' || w.unit === filterUnit;
            const matchSearch = w.title.toLowerCase().includes(search.toLowerCase());
            return matchUnit && matchSearch;
        });
    }, [catalog, filterUnit, search]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Iniciar Nueva Solicitud</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800"><XCircle size={24} /></button>
                </div>

                {/* Filters */}
                <div className="px-6 py-3 bg-white border-b border-slate-100 flex gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Buscar proceso..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <select
                            className="pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                            value={filterUnit}
                            onChange={e => setFilterUnit(e.target.value)}
                        >
                            <option value="ALL">Todas las Áreas</option>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50">
                    {filtered.map(wf => (
                        <button
                            key={wf.id}
                            onClick={() => onCreate(wf)}
                            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 text-left transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <Paperclip weight="duotone" size={20} /> {/* Should be dynamic icon */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{wf.title}</h3>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wide">{wf.unit}</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{wf.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

function EmptyState({ type, onAction }: any) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <Tray size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No hay {type === 'REQUESTS' ? 'solicitudes' : 'tareas'}</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
                {type === 'REQUESTS'
                    ? 'Aún no has creado ninguna solicitud. Inicia un nuevo trámite desde el botón superior.'
                    : 'Estás al día. No tienes tareas pendientes asignadas a ti o tu unidad.'}
            </p>
            {type === 'REQUESTS' && (
                <button onClick={onAction} className="text-blue-600 font-bold hover:underline">Crear Solicitud</button>
            )}
        </div>
    )
}

function ImportProjectModal({ onClose, onImport }: { onClose: () => void, onImport: (csv: string) => void }) {
    const [csvText, setCsvText] = useState('');

    const downloadTemplate = () => {
        const header = "Carpeta Nivel 1,Carpeta Nivel 2,Nombre Proyecto,Fase,Actividad,Fecha Inicio (YYYY-MM-DD),Fecha Fin (YYYY-MM-DD)";
        const row1 = "Educación,Virtual,Curso de Python,Fase 1: Introducción,Instalación de Entorno,2025-01-10,2025-01-12";
        const row2 = "Educación,Virtual,Curso de Python,Fase 1: Introducción,Variables y Tipos,2025-01-13,2025-01-15";
        const row3 = "Educación,Virtual,Curso de Python,Fase 2: Estructuras,Bucles y Condicionales,2025-01-16,2025-01-20";
        const content = `${header}\n${row1}\n${row2}\n${row3}`;

        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "plantilla_proyectos_m360.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const text = evt.target?.result as string;
                setCsvText(text);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scaleIn relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XCircle size={24} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <FileCsv className="text-green-600" size={24} /> Importar Estructura de Proyectos
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                    Carga un archivo CSV para generar automáticamente carpetas, proyectos, fases y actividades.
                </p>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 mb-2">1. Descarga la plantilla</h3>
                        <p className="text-xs text-slate-500 mb-3">Usa este archivo como base para llenar tu información.</p>
                        <button onClick={downloadTemplate} className="text-xs bg-white border border-slate-300 px-3 py-2 rounded font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Upload size={14} /> Descargar CSV Ejemplo
                        </button>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 mb-2">2. Sube tu archivo</h3>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {csvText && (
                        <div className="bg-green-50 text-green-700 p-3 rounded text-xs font-bold flex items-center gap-2">
                            <CheckCircle size={16} /> Archivo cargado y listo para procesar.
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">Cancelar</button>
                    <button
                        onClick={() => { if (csvText) onImport(csvText); }}
                        disabled={!csvText}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Procesar e Importar
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- PROJECT SUBCOMPONENTS ---

function ProjectsView({ projects, folders, onSelect, selectedId, forceUpdate, currentFolderId, setCurrentFolderId }: any) {
    const { deleteProject, deleteProjectFolder, updateProjectFolder, duplicateProject, currentUser } = useApp();
    const { t } = useTranslation();
    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'superadmin' || currentUser?.role === 'Admin Global' || currentUser?.level === 1;
    // Removed internal state for currentFolderId

    // FOLDER EDIT STATE
    const [editingFolder, setEditingFolder] = useState<any | null>(null);
    const [editFolderData, setEditFolderData] = useState({ name: '', color: '', startDate: '', endDate: '', parentId: '', unit: '', process: '' });

    const currentFolder = folders.find((f: any) => f.id === currentFolderId);

    const displayedProjects = useMemo(() => {
        if (currentFolderId) {
            return projects.filter((p: Project) => p.folderId === currentFolderId);
        }
        return projects.filter((p: Project) => !p.folderId); // Root projects only
    }, [projects, currentFolderId]);

    const displayedFolders = useMemo(() => {
        if (!currentFolderId) return folders.filter((f: any) => !f.parentId); // Root
        return folders.filter((f: any) => f.parentId === currentFolderId); // Subfolders
    }, [folders, currentFolderId]);

    return (
        <div className="flex-1 overflow-y-auto p-8">

            {/* Breadcrumb / Back Navigation */}
            {/* Breadcrumb / Back Navigation */}
            {currentFolderId && (
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                    <button onClick={() => setCurrentFolderId(null)} className="hover:underline flex items-center gap-1">
                        <Folder /> {t('nav_projects')}
                    </button>
                    <CaretRight size={12} />
                    {currentFolder?.parentId && (
                        <>
                            <button
                                onClick={() => setCurrentFolderId(currentFolder.parentId)}
                                className="hover:underline"
                            >
                                {folders.find((f: any) => f.id === currentFolder.parentId)?.name}
                            </button>
                            <CaretRight size={12} />
                        </>
                    )}
                    <span className="font-bold text-slate-900">{currentFolder?.name}</span>
                </div>
            )}

            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">

                {/* Folders List (only at root) */}
                {displayedFolders.map((f: any) => {
                    const folderProjects = projects.filter((p: any) => p.folderId === f.id);
                    const folderProgress = folderProjects.length > 0
                        ? Math.round(folderProjects.reduce((acc: number, p: Project) => acc + getProjectProgress(p), 0) / folderProjects.length)
                        : 0;

                    return (
                        <div
                            key={f.id}
                            onClick={() => setCurrentFolderId(f.id)}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-5 cursor-pointer hover:bg-white hover:shadow-lg hover:border-blue-200 transition-all group relative"
                        >
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (confirm('¿Seguro que deseas eliminar esta carpeta?')) deleteProjectFolder(f.id); }}
                                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                        title="Eliminar Carpeta"
                                    >
                                        <Trash size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingFolder(f);
                                            setEditFolderData({
                                                name: f.name,
                                                color: f.color || '#3b82f6',
                                                startDate: f.startDate || '',
                                                endDate: f.endDate || '',
                                                parentId: f.parentId || '',
                                                unit: f.unit || '',
                                                process: f.process || ''
                                            });
                                        }}
                                        className="absolute top-2 right-9 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 mr-1"
                                        title="Editar Carpeta"
                                    >
                                        <PencilSimple size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Recursive function to get all projects in folder and subfolders
                                            const getAllProjectsInFolder = (folderId: string): Project[] => {
                                                const directProjects = projects.filter((p: Project) => p.folderId === folderId);
                                                const subFolders = folders.filter((sf: any) => sf.parentId === folderId);
                                                let allProjs = [...directProjects];
                                                subFolders.forEach((sf: any) => {
                                                    allProjs = [...allProjs, ...getAllProjectsInFolder(sf.id)];
                                                });
                                                return allProjs;
                                            };

                                            const allFolderProjects = getAllProjectsInFolder(f.id);

                                            // Generate XLS Logic (reused)
                                            const headers = ['Folder', 'Project', 'Phase', 'Phase Status', 'Activity', 'Activity Status', 'Start Date', 'End Date', 'Participants'];
                                            const rows: string[][] = [];

                                            if (allFolderProjects.length === 0) {
                                                alert('Esta carpeta no contiene proyectos para exportar.');
                                                return;
                                            }

                                            allFolderProjects.forEach(p => {
                                                // Find folder name for this project
                                                const pFolder = folders.find((fol: any) => fol.id === p.folderId);
                                                const folderName = pFolder ? pFolder.name : 'Root';

                                                if (!p.phases || p.phases.length === 0) {
                                                    rows.push([folderName, p.title, '', '', '', '', p.startDate || '', p.endDate || '', '']);
                                                } else {
                                                    p.phases.forEach(ph => {
                                                        if (!ph.activities || ph.activities.length === 0) {
                                                            rows.push([folderName, p.title, ph.name, ph.status, '', '', ph.startDate || '', ph.endDate || '', '']);
                                                        } else {
                                                            ph.activities.forEach(act => {
                                                                const participants = act.participants ? act.participants.map(pt => typeof pt === 'object' ? pt.userId : pt).join('; ') : '';
                                                                rows.push([
                                                                    folderName,
                                                                    p.title,
                                                                    ph.name,
                                                                    ph.status,
                                                                    act.name,
                                                                    act.status || 'NOT_STARTED',
                                                                    act.startDate || '',
                                                                    act.endDate || '',
                                                                    participants
                                                                ]);
                                                            });
                                                        }
                                                    });
                                                }
                                            });

                                            // HTML Table for XLS
                                            let table = '<table border="1"><thead><tr>';
                                            headers.forEach(h => {
                                                table += `<th style="background-color:#f0f0f0; font-weight:bold;">${h}</th>`;
                                            });
                                            table += '</tr></thead><tbody>';

                                            rows.forEach(r => {
                                                table += '<tr>';
                                                r.forEach(c => {
                                                    table += `<td>${c || ''}</td>`;
                                                });
                                                table += '</tr>';
                                            });
                                            table += '</tbody></table>';

                                            const excelFile = `
                                                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                                                <head>
                                                    <!--[if gte mso 9]>
                                                    <xml>
                                                        <x:ExcelWorkbook>
                                                            <x:ExcelWorksheets>
                                                                <x:ExcelWorksheet>
                                                                    <x:Name>Folder_Structure</x:Name>
                                                                    <x:WorksheetOptions>
                                                                        <x:DisplayGridlines/>
                                                                    </x:WorksheetOptions>
                                                                </x:ExcelWorksheet>
                                                            </x:ExcelWorksheets>
                                                        </x:ExcelWorkbook>
                                                    </xml>
                                                    <![endif]-->
                                                    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                                                </head>
                                                <body>${table}</body>
                                                </html>
                                            `;

                                            const blob = new Blob([excelFile], { type: 'application/vnd.ms-excel' });
                                            const url = URL.createObjectURL(blob);
                                            const link = document.createElement("a");
                                            link.setAttribute("href", url);
                                            link.setAttribute("download", `${f.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_full_structure.xls`);
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                        className="absolute top-2 right-[76px] p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                        title="Descargar Estructura Carpeta (.xls)"
                                    >
                                        <DownloadSimple size={16} />
                                    </button>
                                </>
                            )}
                            <div className="flex justify-between items-start mb-3">
                                <div
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ backgroundColor: `${f.color || '#3b82f6'}20`, color: f.color || '#3b82f6' }}
                                >
                                    <Folder size={24} weight="duotone" />
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{f.name}</h3>
                            {(f.unit || f.process) && (
                                <div className="flex items-center gap-2 mt-1 mb-2">
                                    {f.unit && <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wide">{f.unit}</span>}
                                    {f.process && <span className="text-[9px] text-slate-400">• {f.process}</span>}
                                </div>
                            )}
                            <p className="text-xs text-slate-500 mt-1 mb-2">{folderProjects.length} proyectos</p>

                            {(f.startDate || f.endDate) && (
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3">
                                    <Calendar size={12} />
                                    <span>
                                        {f.startDate ? new Date(f.startDate).toLocaleDateString() : ''}
                                        {f.startDate && f.endDate ? ' - ' : ''}
                                        {f.endDate ? new Date(f.endDate).toLocaleDateString() : ''}
                                    </span>
                                </div>
                            )}

                            {/* Folder Progress Bar */}
                            <div className="mt-auto">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Avance Promedio</span>
                                    <span className={`text-[10px] font-bold ${folderProgress === 100 ? 'text-green-600' : 'text-slate-600'}`}>{folderProgress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${folderProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                        style={{ width: `${folderProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Projects List */}
                {displayedProjects.map((p: Project) => (
                    <div
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className={`bg-white rounded-xl border p-5 cursor-pointer hover:shadow-lg transition-all group relative ${selectedId === p.id ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-200 hover:border-purple-300'}`}
                    >
                        {isAdmin && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (confirm('¿Seguro que deseas eliminar este proyecto?')) deleteProject(p.id); }}
                                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                    title="Eliminar Proyecto"
                                >
                                    <Trash size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); duplicateProject(p.id); }}
                                    className="absolute top-2 right-9 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 mr-1"
                                    title="Duplicar Proyecto"
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const headers = ['Project', 'Phase', 'Phase Status', 'Activity', 'Activity Status', 'Start Date', 'End Date', 'Participants'];
                                        const rows: string[][] = [];

                                        // If no phases, add project row
                                        if (!p.phases || p.phases.length === 0) {
                                            rows.push([p.title, '', '', '', '', p.startDate || '', p.endDate || '', '']);
                                        } else {
                                            p.phases.forEach(ph => {
                                                // If phase has no activities, just add phase row
                                                if (!ph.activities || ph.activities.length === 0) {
                                                    rows.push([p.title, ph.name, ph.status, '', '', ph.startDate || '', ph.endDate || '', '']);
                                                } else {
                                                    ph.activities.forEach(act => {
                                                        const participants = act.participants ? act.participants.map(pt => typeof pt === 'object' ? pt.userId : pt).join('; ') : '';
                                                        rows.push([
                                                            p.title,
                                                            ph.name,
                                                            ph.status,
                                                            act.name,
                                                            act.status || 'NOT_STARTED',
                                                            act.startDate || '',
                                                            act.endDate || '',
                                                            participants
                                                        ]);
                                                    });
                                                }
                                            });
                                        }

                                        // Generar HTML compatible con Excel
                                        let table = '<table border="1"><thead><tr>';
                                        headers.forEach(h => {
                                            table += `<th style="background-color:#f0f0f0; font-weight:bold;">${h}</th>`;
                                        });
                                        table += '</tr></thead><tbody>';

                                        rows.forEach(r => {
                                            table += '<tr>';
                                            r.forEach(c => {
                                                table += `<td>${c || ''}</td>`;
                                            });
                                            table += '</tr>';
                                        });
                                        table += '</tbody></table>';

                                        const excelFile = `
                                            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                                            <head>
                                                <!--[if gte mso 9]>
                                                <xml>
                                                    <x:ExcelWorkbook>
                                                        <x:ExcelWorksheets>
                                                            <x:ExcelWorksheet>
                                                                <x:Name>Structure</x:Name>
                                                                <x:WorksheetOptions>
                                                                    <x:DisplayGridlines/>
                                                                </x:WorksheetOptions>
                                                            </x:ExcelWorksheet>
                                                        </x:ExcelWorksheets>
                                                    </x:ExcelWorkbook>
                                                </xml>
                                                <![endif]-->
                                                <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                                            </head>
                                            <body>${table}</body>
                                            </html>
                                        `;

                                        const blob = new Blob([excelFile], { type: 'application/vnd.ms-excel' });
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement("a");
                                        link.setAttribute("href", url);
                                        link.setAttribute("download", `${p.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_structure.xls`);
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="absolute top-2 right-[76px] p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                                    title="Descargar Estructura (.xls)"
                                >
                                    <DownloadSimple size={16} />
                                </button>
                            </>
                        )}
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 rounded-lg transition-colors" style={{ backgroundColor: `${p.color || '#9333ea'}20`, color: p.color || '#9333ea' }}>
                                <Briefcase size={24} weight="duotone" />
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {p.status}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        < div className="mb-3 mt-1" >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Progreso</span>
                                <span className="text-[10px] font-bold text-slate-600">{getProjectProgress(p)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${getProjectProgress(p)}%`, backgroundColor: p.color || '#9333ea' }} />
                            </div>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1 transition-colors" style={{ color: selectedId === p.id ? (p.color || '#9333ea') : undefined }}>{p.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{p.description}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>{p.participants.length}</span>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                                <Folder size={14} />
                                <span>{p.phases.length} Fases</span>
                            </div>
                        </div>
                    </div>
                ))
                }

                {
                    displayedProjects.length === 0 && displayedFolders.length === 0 && (
                        <div className="col-span-full text-center py-20 opacity-60">
                            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">No hay proyectos</h3>
                            <p className="text-sm text-slate-500">Crea un proyecto para comenzar a gestionar fases y documentos.</p>
                        </div>
                    )
                }
            </div >

            {/* Edit Folder Modal */}
            {
                editingFolder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Editar Carpeta</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                                    <input
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                        value={editFolderData.name}
                                        onChange={e => setEditFolderData({ ...editFolderData, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Ubicación</label>
                                    <select
                                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
                                        value={editFolderData.parentId || ''}
                                        onChange={e => setEditFolderData({ ...editFolderData, parentId: e.target.value })}
                                    >
                                        <option value="">Raíz (Primer Nivel)</option>
                                        <optgroup label="Carpetas Existentes">
                                            {folders.filter((f: any) => !f.parentId && f.id !== editingFolder.id).map((f: any) => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Unidad</label>
                                        <select
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
                                            value={editFolderData.unit || ''}
                                            onChange={e => setEditFolderData({ ...editFolderData, unit: e.target.value, process: '' })}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {DB.units.filter(u => u.tenantId === currentUser?.tenantId && u.type === 'UNIT').map(u => (
                                                <option key={u.id} value={u.name}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Proceso</label>
                                        <select
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700 disabled:bg-slate-100"
                                            value={editFolderData.process || ''}
                                            onChange={e => setEditFolderData({ ...editFolderData, process: e.target.value })}
                                            disabled={!editFolderData.unit}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {editFolderData.unit && DB.units
                                                .filter(u => u.tenantId === currentUser?.tenantId && u.type === 'PROCESS' && DB.units.find(p => p.id === u.parentId)?.name === editFolderData.unit)
                                                .map(u => <option key={u.id} value={u.name}>{u.name}</option>)
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setEditFolderData({ ...editFolderData, color: c })}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${editFolderData.color === c ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Inicio</label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
                                            value={editFolderData.startDate}
                                            onChange={e => setEditFolderData({ ...editFolderData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Fin</label>
                                        <input
                                            type="date"
                                            className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-700"
                                            value={editFolderData.endDate}
                                            onChange={e => setEditFolderData({ ...editFolderData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button onClick={() => setEditingFolder(null)} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">Cancelar</button>
                                    <button
                                        onClick={() => {
                                            if (!editFolderData.name.trim()) return;
                                            updateProjectFolder(editingFolder.id, {
                                                name: editFolderData.name,
                                                color: editFolderData.color,
                                                startDate: editFolderData.startDate,
                                                endDate: editFolderData.endDate,
                                                parentId: editFolderData.parentId || undefined,
                                                unit: editFolderData.unit,
                                                process: editFolderData.process
                                            });
                                            setEditingFolder(null);
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-sm"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

function ProjectDrawer({ project, folders, onClose, onSave, currentUser, active, onRequestAddDoc, onRequestAddMember, onRequestWorkOnDoc }: { project: Project, folders: ProjectFolder[], onClose: () => void, onSave?: () => void, currentUser: any, active: boolean, onRequestAddDoc: (pid: string, aid: string) => void, onRequestAddMember: (target: { type: 'GLOBAL' | 'ACTIVITY', phaseId?: string, activityId?: string }) => void, onRequestWorkOnDoc: (pid: string, aid: string, did: string, mode: 'VIEW' | 'WORK') => void }) {
    const { updateProject } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState<Project>(project);
    // Expand controls
    const [expandPhase, setExpandPhase] = useState<string | null>(null);
    const [expandActivity, setExpandActivity] = useState<string | null>(null);

    useEffect(() => {
        setEditedProject(project);
        if (project.phases.length > 0) setExpandPhase(project.phases[0].id);
    }, [project]);

    if (!active) return null;

    const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'superadmin' || currentUser?.role === 'Admin Global' || currentUser?.level === 1;

    const handleSave = () => {
        updateProject(editedProject.id, editedProject);
        setIsEditing(false);
        if (onSave) onSave();
    };

    // --- MANAGE PHASES ---
    const addPhase = () => {
        const newPhase: ProjectPhase = {
            id: `ph-${Date.now()}`,
            name: `Nueva Fase ${editedProject.phases.length + 1}`,
            order: editedProject.phases.length + 1,
            status: 'NOT_STARTED',
            activities: []
        };
        setEditedProject({ ...editedProject, phases: [...editedProject.phases, newPhase] });
        setExpandPhase(newPhase.id);
    };

    // --- MANAGE ACTIVITIES ---
    const addActivity = (phaseId: string) => {
        const newActivity: ProjectActivity = {
            id: `act-${Date.now()}`,
            name: 'Nueva Actividad',
            status: 'NOT_STARTED',
            participants: [],
            documents: []
        };
        const newPhases = editedProject.phases.map(p => {
            if (p.id === phaseId) {
                return { ...p, activities: [...p.activities, newActivity] };
            }
            return p;
        });
        setEditedProject({ ...editedProject, phases: newPhases });
        setExpandActivity(newActivity.id);
    }

    // --- MANAGE DOCS ---
    // --- MANAGE DOCS ---
    // (Doc logic handled by parent via onRequestAddDoc)

    const addParticipantToActivity = (phaseId: string, activityId: string) => {
        onRequestAddMember({ type: 'ACTIVITY', phaseId, activityId });
    };

    // Add Global Participant
    const addGlobalParticipant = () => {
        onRequestAddMember({ type: 'GLOBAL' });
    };



    const projectProgress = getProjectProgress(editedProject);

    return (
        <div className="w-[700px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-slideLeft z-20 h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    className="w-full font-bold text-xl bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedProject.title}
                                    onChange={e => setEditedProject({ ...editedProject, title: e.target.value })}
                                />
                                <textarea
                                    className="w-full text-xs text-slate-600 bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={2}
                                    value={editedProject.description}
                                    onChange={e => setEditedProject({ ...editedProject, description: e.target.value })}
                                />
                                {/* Folder Select */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Carpeta:</span>
                                    <select
                                        className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500"
                                        value={editedProject.folderId || ''}
                                        onChange={e => setEditedProject({ ...editedProject, folderId: e.target.value || undefined })}
                                    >
                                        <option value="">-- Sin Carpeta (Raíz) --</option>
                                        {folders.filter(f => !f.parentId).map(f => {
                                            const subFolders = folders.filter(sub => sub.parentId === f.id);
                                            return (
                                                <optgroup key={f.id} label={f.name}>
                                                    <option value={f.id}>{f.name} (Nivel 1)</option>
                                                    {subFolders.map(sub => (
                                                        <option key={sub.id} value={sub.id}>&nbsp;&nbsp;└ {sub.name} (Nivel 2)</option>
                                                    ))}
                                                </optgroup>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Color de Tarjeta</label>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'].map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setEditedProject({ ...editedProject, color: c })}
                                                    className={`w-5 h-5 rounded-full border border-slate-200 transition-all ${editedProject.color === c ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Inicio</label>
                                            <input
                                                type="date"
                                                className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                                value={editedProject.startDate ? editedProject.startDate.substring(0, 10) : ''}
                                                onChange={e => setEditedProject({ ...editedProject, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-1">Fin</label>
                                            <input
                                                type="date"
                                                className="text-xs bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                                value={editedProject.endDate ? editedProject.endDate.substring(0, 10) : ''}
                                                onChange={e => setEditedProject({ ...editedProject, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-slate-900 leading-snug">{editedProject.title}</h2>
                                <p className="text-xs text-slate-500 mt-1">{editedProject.description}</p>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && !isEditing && (
                            <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200 transition-colors">
                                Editar
                            </button>
                        )}
                        {isEditing && (
                            <button onClick={handleSave} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-md">
                                Guardar
                            </button>
                        )}
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 transition-colors"><XCircle size={24} className="text-slate-400" /></button>
                    </div>
                </div>

                {/* Project Progress Bar */}
                <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-slate-500">Progreso Total</span>
                        <span className="font-bold text-slate-700">{projectProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${projectProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">

                {/* Structure: Phase > Activity > Docs */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Kanban size={14} /> Estructura del Proyecto
                        </h3>
                        {isEditing && (
                            <button onClick={addPhase} className="text-xs text-purple-600 font-bold hover:underline">+ Agregar Fase</button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {editedProject.phases.map((phase, idx) => {
                            const phaseProgress = getPhaseProgress(phase);
                            return (
                                <div key={phase.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    {/* Phase Header */}
                                    <div
                                        className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-100"
                                        onClick={() => setExpandPhase(expandPhase === phase.id ? null : phase.id)}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                                            {isEditing ? (
                                                <input
                                                    className="bg-white border border-slate-300 rounded px-2 py-0.5 text-sm font-bold text-slate-700 outline-none w-48 focus:ring-1 focus:ring-purple-500"
                                                    value={phase.name}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        const newPhases = editedProject.phases.map((p, i) => i === idx ? { ...p, name: e.target.value } : p);
                                                        setEditedProject({ ...editedProject, phases: newPhases });
                                                    }}
                                                />
                                            ) : (
                                                <span className="font-bold text-slate-700 text-sm">{phase.name}</span>
                                            )}
                                        </div>

                                        {/* Phase Progress */}
                                        <div className="flex items-center gap-4 mr-4">
                                            <div className="w-24">
                                                <div className="flex justify-between text-[9px] mb-0.5 text-slate-400 font-bold">
                                                    <span>{phaseProgress}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${phaseProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${phaseProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 px-2 border-r border-slate-200">{phase.activities.length} Actividades</span>
                                            <CaretRight size={14} className={`text-slate-400 transition-transform ${expandPhase === phase.id ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>

                                    {/* Activities List */}
                                    {expandPhase === phase.id && (
                                        <div className="p-4 bg-slate-50/50 space-y-3">
                                            {/* Phase Level Controls if any */}
                                            {isEditing && (
                                                <div className="flex justify-end mb-2">
                                                    <button onClick={() => addActivity(phase.id)} className="text-[10px] bg-white border border-dashed border-purple-300 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50 font-bold">
                                                        + Nueva Actividad
                                                    </button>
                                                </div>
                                            )}

                                            {phase.activities.map((act, aIdx) => (
                                                <div key={act.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        {isEditing ? (
                                                            <input
                                                                className="flex-1 font-bold text-sm text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 outline-none focus:border-purple-500 mr-2"
                                                                value={act.name}
                                                                onChange={e => {
                                                                    const newPhases = editedProject.phases.map((p, i) => {
                                                                        if (i === idx) {
                                                                            const newActivities = p.activities.map((a, j) => j === aIdx ? { ...a, name: e.target.value } : a);
                                                                            return { ...p, activities: newActivities };
                                                                        }
                                                                        return p;
                                                                    });
                                                                    setEditedProject({ ...editedProject, phases: newPhases });
                                                                }}
                                                            />
                                                        ) : (
                                                            <h4 className="flex-1 font-bold text-sm text-slate-800">{act.name}</h4>
                                                        )}
                                                        {isEditing ? (
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    className="text-[10px] bg-white border border-slate-200 rounded px-1 py-0.5 outline-none focus:border-purple-500 cursor-pointer max-w-[100px]"
                                                                    value={act.status || 'NOT_STARTED'}
                                                                    onChange={(e) => {
                                                                        const newPhases = editedProject.phases.map((p, i) => {
                                                                            if (i === idx) {
                                                                                const newActivities = p.activities.map((a, j) => j === aIdx ? { ...a, status: e.target.value as any } : a);
                                                                                return { ...p, activities: newActivities };
                                                                            }
                                                                            return p;
                                                                        });
                                                                        setEditedProject({ ...editedProject, phases: newPhases });
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <option value="NOT_STARTED">Sin iniciar</option>
                                                                    <option value="IN_PROGRESS">En proceso</option>
                                                                    <option value="COMPLETED">Finalizado</option>
                                                                    <option value="IN_REVIEW">En revisión (QA)</option>
                                                                    <option value="DELIVERED">Entregado</option>
                                                                    <option value="VALIDATED">Validado</option>
                                                                </select>
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('¿Estás seguro de eliminar esta actividad?')) {
                                                                            const newPhases = editedProject.phases.map((p, i) => {
                                                                                if (i === idx) {
                                                                                    const newActivities = p.activities.filter((_, j) => j !== aIdx);
                                                                                    return { ...p, activities: newActivities };
                                                                                }
                                                                                return p;
                                                                            });
                                                                            setEditedProject({ ...editedProject, phases: newPhases });
                                                                        }
                                                                    }}
                                                                    className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50"
                                                                    title="Eliminar Actividad"
                                                                >
                                                                    <Trash size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className={`text-[9px] px-2 py-0.5 rounded border font-medium whitespace-nowrap
                                                            ${act.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                                                            ${act.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' : ''}
                                                            ${(act.status === 'NOT_STARTED' || !act.status) ? 'bg-slate-100 text-slate-500 border-slate-200' : ''}
                                                            ${act.status === 'IN_REVIEW' ? 'bg-amber-50 text-amber-600 border-amber-100' : ''}
                                                            ${act.status === 'DELIVERED' ? 'bg-teal-50 text-teal-600 border-teal-100' : ''}
                                                            ${act.status === 'VALIDATED' ? 'bg-purple-50 text-purple-600 border-purple-100' : ''}
                                                        `}>
                                                                {(!act.status || act.status === 'NOT_STARTED') ? 'Sin iniciar' :
                                                                    act.status === 'IN_PROGRESS' ? 'En proceso' :
                                                                        act.status === 'COMPLETED' ? 'Finalizado' :
                                                                            act.status === 'IN_REVIEW' ? 'En revisión (QA)' :
                                                                                act.status === 'DELIVERED' ? 'Entregado' :
                                                                                    act.status === 'VALIDATED' ? 'Validado' : act.status}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Activity Details: Dates, Team */}
                                                    <div className="flex items-center gap-4 mb-3 border-b border-slate-50 pb-2">
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                                            <Calendar size={12} />
                                                            {isEditing ? (
                                                                <div className="flex gap-1">
                                                                    <input type="date" className="w-20 border rounded px-1" value={act.startDate || ''} onChange={(e) => {
                                                                        const newPhases = editedProject.phases.map((p, i) => {
                                                                            if (i === idx) {
                                                                                const newActivities = p.activities.map((a, j) => j === aIdx ? { ...a, startDate: e.target.value } : a);
                                                                                return { ...p, activities: newActivities };
                                                                            }
                                                                            return p;
                                                                        });
                                                                        setEditedProject({ ...editedProject, phases: newPhases });
                                                                    }} />
                                                                    <span>-</span>
                                                                    <input type="date" className="w-20 border rounded px-1" value={act.endDate || ''} onChange={(e) => {
                                                                        const newPhases = editedProject.phases.map((p, i) => {
                                                                            if (i === idx) {
                                                                                const newActivities = p.activities.map((a, j) => j === aIdx ? { ...a, endDate: e.target.value } : a);
                                                                                return { ...p, activities: newActivities };
                                                                            }
                                                                            return p;
                                                                        });
                                                                        setEditedProject({ ...editedProject, phases: newPhases });
                                                                    }} />
                                                                </div>
                                                            ) : (
                                                                <span>{act.startDate ? `${new Date(act.startDate).toLocaleDateString()} - ${act.endDate ? new Date(act.endDate).toLocaleDateString() : '...'}` : 'Sin fechas'}</span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 ml-auto">
                                                            <User size={12} />
                                                            <span>{act.participants.length}</span>
                                                            {isEditing && <button onClick={() => addParticipantToActivity(phase.id, act.id)} className="text-blue-500 hover:underline ml-1">+ Asignar</button>}
                                                        </div>
                                                    </div>

                                                    {/* Documents in Activity */}
                                                    <div className="space-y-2">
                                                        {act.documents.map((doc, dIdx) => (
                                                            <div key={doc.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                                                                <div className="text-purple-600">
                                                                    {doc.type === 'URL' ? <LinkIcon size={14} /> : (doc.type === 'EMBED' ? <YoutubeLogo size={14} /> : <FileText size={14} />)}
                                                                </div>
                                                                <span className="text-xs text-slate-700 flex-1 truncate">{doc.name}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <button onClick={() => onRequestWorkOnDoc(phase.id, act.id, doc.id, 'VIEW')} className="text-[10px] text-blue-500 hover:underline">Ver</button>
                                                                    <button onClick={() => onRequestWorkOnDoc(phase.id, act.id, doc.id, 'WORK')} className="text-[10px] text-purple-600 hover:text-purple-800 font-bold hover:underline">Trabajar</button>
                                                                    {isEditing && (
                                                                        <button onClick={() => {
                                                                            const newPhases = editedProject.phases.map((p, i) => {
                                                                                if (i === idx) {
                                                                                    const newActivities = p.activities.map((a, j) => {
                                                                                        if (j === aIdx) {
                                                                                            return { ...a, documents: a.documents.filter((_, k) => k !== dIdx) };
                                                                                        }
                                                                                        return a;
                                                                                    });
                                                                                    return { ...p, activities: newActivities };
                                                                                }
                                                                                return p;
                                                                            });
                                                                            setEditedProject({ ...editedProject, phases: newPhases });
                                                                        }} className="text-rose-400 hover:text-rose-600"><Trash size={12} /></button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {/* Add Document Button: Available for Editors OR Participants */}
                                                        <button onClick={() => onRequestAddDoc(phase.id, act.id)} className="w-full py-1 text-[10px] text-slate-400 border border-dashed border-slate-200 rounded hover:border-blue-400 hover:text-blue-600 transition-colors">
                                                            + Agregar Documento
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {phase.activities.length === 0 && <p className="text-xs text-slate-400 italic text-center py-2">No hay actividades en esta fase.</p>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Team */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} /> Equipo Global del Proyecto
                        </h3>
                        {isEditing && (
                            <button onClick={addGlobalParticipant} className="text-xs text-purple-600 font-bold hover:underline">+ Agregar Miembro</button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {editedProject.participants.map((p, i) => {
                            const userId = typeof p === 'object' ? p.userId : p;
                            const role = typeof p === 'object' ? p.role || 'Member' : 'Member';
                            return (
                            <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                                <span className="w-6 h-6 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                                    {role.charAt(0)}
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 leading-tight">User {userId.split('-').pop()}</span>
                                    <span className="text-[9px] text-slate-400 leading-tight">{role}</span>
                                </div>
                            </div>
                        )})}
                    </div>
                </section>

            </div>
        </div>
    )
}

function NewProjectModal({ onClose, onCreate, tenantId, folders }: { onClose: () => void, onCreate: (data: Partial<Project>) => void, tenantId: string, folders: ProjectFolder[] }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [folderId, setFolderId] = useState('');

    const handleCreate = () => {
        const defaultActivity: ProjectActivity = {
            id: `act-init`,
            name: 'Actividad Inicial',
            status: 'NOT_STARTED',
            participants: [],
            documents: []
        };

        const defaultPhase: ProjectPhase = {
            id: `ph-init`,
            name: 'Fase 1: Planificación',
            order: 1,
            status: 'NOT_STARTED',
            activities: [defaultActivity]
        };

        onCreate({
            title, description: desc, startDate, endDate, color,
            phases: [defaultPhase],
            participants: [],
            folderId: folderId || undefined
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Nuevo Proyecto</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800"><XCircle size={24} /></button>
                </div>

                <div className="p-8 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre del Proyecto</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ubicación</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                value={folderId}
                                onChange={e => setFolderId(e.target.value)}
                            >
                                <option value="">Carpeta Raíz (Primer Nivel)</option>
                                {folders.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Color de Tarjeta</label>
                            <div className="flex gap-2 items-center h-[38px]">
                                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-6 h-6 rounded-full border transition-all ${color === c ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha Inicio</label>
                            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha Fin</label>
                            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">Cancelar</button>
                    <button onClick={handleCreate} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 active:scale-95 transition-all">
                        Crear Proyecto
                    </button>
                </div>
            </div>
        </div>
    )
}

function NewFolderModal({ onClose, onCreate, folders }: { onClose: () => void, onCreate: (data: any) => void, folders: ProjectFolder[] }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [parentId, setParentId] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Nueva Carpeta</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-800"><XCircle size={24} /></button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={e => setName(e.target.value)} autoFocus />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Descripción</label>
                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500" rows={2} value={desc} onChange={e => setDesc(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ubicación</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            value={parentId}
                            onChange={e => setParentId(e.target.value)}
                        >
                            <option value="">Nivel Principal (Raíz)</option>
                            <optgroup label="Carpetas Existentes">
                                {folders.filter(f => !f.parentId).map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1">Selecciona 'Raíz' para primer nivel o una carpeta para segundo nivel.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Color</label>
                        <div className="flex gap-2 items-center flex-wrap">
                            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border transition-all ${color === c ? 'ring-2 ring-offset-1 ring-slate-400 scale-110 shadow-md' : 'hover:scale-110'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha Inicio</label>
                            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fecha Fin</label>
                            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm">Cancelar</button>
                    <button
                        onClick={() => {
                            if (!name.trim()) return;
                            onCreate({ name, description: desc, startDate, endDate, color, parentId: parentId || undefined });
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                        Crear Carpeta
                    </button>
                </div>
            </div>
        </div>
    )
}


function AddProjectDocModal({ onClose, onAdd, tenantId }: { onClose: () => void, onAdd: (doc: ProjectDocument) => void, tenantId: string }) {
    const storageConfig = DB.tenants.find(t => t.id === tenantId)?.storageConfig;
    const [tab, setTab] = useState<'REPO' | 'URL' | 'UPLOAD' | 'EMBED' | 'STORAGE'>('REPO');
    const [search, setSearch] = useState('');
    const [selectedRepoDoc, setSelectedRepoDoc] = useState<any>(null);
    const [urlForm, setUrlForm] = useState({ url: '', name: '' });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [embedCode, setEmbedCode] = useState('');

    // Filter Repo Docs
    const repoDocs = useMemo(() => {
        return DB.docs.filter(d =>
            d.tenantId === tenantId &&
            d.status === 'APPROVED' &&
            d.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [tenantId, search]);

    const handleSave = () => {
        const newDocBase = { id: `pdoc-${Date.now()}` };
        let finalDoc: ProjectDocument | null = null;

        if (tab === 'REPO') {
            if (!selectedRepoDoc) return;
            finalDoc = {
                ...newDocBase,
                name: selectedRepoDoc.title,
                type: 'URL',
                content: `repo://${selectedRepoDoc.id}`
            };
        } else if (tab === 'URL') {
            if (!urlForm.name || !urlForm.url) return;
            finalDoc = {
                ...newDocBase,
                name: urlForm.name,
                type: 'URL',
                content: urlForm.url
            };
        } else if (tab === 'UPLOAD') {
            if (!uploadFile) return;

            // Convert file to Data URL for local storage
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                finalDoc = {
                    ...newDocBase,
                    name: uploadFile.name,
                    type: 'FILE',
                    content: dataUrl // Store as Data URL
                };

                if (finalDoc) {
                    onAdd(finalDoc);
                }
            };
            reader.readAsDataURL(uploadFile);
            return; // Exit early, callback will handle the rest
        } else if (tab === 'EMBED') {
            if (!embedCode) return;
            // Extract src if it's an iframe tag
            const srcMatch = embedCode.match(/src="([^"]+)"/);
            const url = srcMatch ? srcMatch[1] : embedCode;

            finalDoc = {
                ...newDocBase,
                name: 'Recurso Embebido',
                type: 'EMBED',
                content: url
            };
        } else if (tab === 'STORAGE') {
            finalDoc = {
                ...newDocBase,
                name: `Cloud Doc - ${storageConfig?.provider || 'Storage'}`,
                type: 'URL',
                content: `cloud://${storageConfig?.provider || 'storage'}/ref`
            };
        }

        if (finalDoc) {
            onAdd(finalDoc);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-scaleIn">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Agregar Evidencia / Documento</h3>
                    <button onClick={onClose}><XCircle size={24} className="text-slate-400 hover:text-slate-700" /></button>
                </div>

                <div className="flex border-b border-slate-100">
                    <button onClick={() => setTab('REPO')} className={`flex-1 py-3 text-xs font-bold ${tab === 'REPO' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                        Repositorio
                    </button>
                    <button onClick={() => setTab('URL')} className={`flex-1 py-3 text-xs font-bold ${tab === 'URL' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                        Enlace Externo
                    </button>
                    <button onClick={() => setTab('UPLOAD')} className={`flex-1 py-3 text-xs font-bold ${tab === 'UPLOAD' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                        Cargar Archivo
                    </button>
                    <button onClick={() => setTab('EMBED')} className={`flex-1 py-3 text-xs font-bold ${tab === 'EMBED' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                        Embed / Iframe
                    </button>
                    {storageConfig && storageConfig.enabled && (
                        <button onClick={() => setTab('STORAGE')} className={`flex-1 py-3 text-xs font-bold ${tab === 'STORAGE' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                            {storageConfig.provider.replace('_', ' ')}
                        </button>
                    )}
                </div>

                <div className="p-6 h-[300px] overflow-y-auto">
                    {tab === 'REPO' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Buscar documento aprobado..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                {repoDocs.map(d => (
                                    <div
                                        key={d.id}
                                        onClick={() => setSelectedRepoDoc(d)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${selectedRepoDoc?.id === d.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                                    >
                                        <div className="p-2 bg-white rounded shadow-sm text-blue-600">
                                            <FileText weight="duotone" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{d.title}</p>
                                            <p className="text-xs text-slate-500">{d.type} • {d.unit}</p>
                                        </div>
                                        {selectedRepoDoc?.id === d.id && <CheckCircle weight="fill" className="text-blue-600" />}
                                    </div>
                                ))}
                                {repoDocs.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No se encontraron documentos</div>}
                            </div>
                        </div>
                    )}

                    {tab === 'URL' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nombre del Recurso</label>
                                <input
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    placeholder="Ej: Reporte Financiero Q3"
                                    value={urlForm.name}
                                    onChange={e => setUrlForm({ ...urlForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">URL / Enlace</label>
                                <input
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    placeholder="https://..."
                                    value={urlForm.url}
                                    onChange={e => setUrlForm({ ...urlForm, url: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {tab === 'UPLOAD' && (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                            <input
                                type="file"
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                                onChange={e => setUploadFile(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer text-center p-6 w-full">
                                <Upload size={32} className={`mx-auto mb-2 ${uploadFile ? 'text-blue-600' : 'text-slate-400'}`} />
                                <span className="block text-sm font-bold text-slate-600 mb-1">
                                    {uploadFile ? uploadFile.name : 'Haz clic para cargar'}
                                </span>
                                {uploadFile ? (
                                    <span className="block text-xs text-blue-600">
                                        {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                ) : (
                                    <span className="block text-xs text-slate-400">PDF, DOCX, XLSX, Imágenes (Max 10MB)</span>
                                )}
                            </label>
                        </div>
                    )}

                    {tab === 'EMBED' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Código Embed o URL Embebible</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-32 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder='<iframe src="https://..." ...></iframe> o https://...'
                                    value={embedCode}
                                    onChange={e => setEmbedCode(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400 mt-2">
                                    Pega el código completo del iframe (YouTube, Vimeo, Maps, etc.) o la URL directa.
                                </p>
                            </div>
                        </div>
                    )}

                    {tab === 'STORAGE' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <CloudArrowUp size={32} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">Importar Evidencia desde {storageConfig?.provider.replace('_', ' ')}</h3>
                            <p className="text-xs text-slate-500 mb-6 px-8">Selecciona archivos directamente de tu almacenamiento corporativo para vincularlos como entregables.</p>
                            <button
                                onClick={handleSave}
                                className="bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                            >
                                Abrir Selector de {storageConfig?.provider.replace('_', ' ')}
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
                        disabled={
                            (tab === 'REPO' && !selectedRepoDoc) ||
                            (tab === 'URL' && (!urlForm.name || !urlForm.url)) ||
                            (tab === 'UPLOAD' && !uploadFile) ||
                            (tab === 'EMBED' && !embedCode)
                        }
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function AddMemberModal({ onClose, onAdd, tenantId }: { onClose: () => void, onAdd: (user: ProjectUser) => void, tenantId: string }) {
    const [search, setSearch] = useState('');
    const [unit, setUnit] = useState('ALL');
    const [selectedUser, setSelectedUser] = useState<ProjectUser | null>(null);

    const availableUnits = useMemo(() => {
        const users = DB.users.filter(u => u.tenantId === tenantId);
        return Array.from(new Set(users.map(u => u.unit)));
    }, [tenantId]);

    const filteredUsers = useMemo(() => {
        return DB.users.filter(u =>
            u.tenantId === tenantId &&
            u.status === 'ACTIVE' &&
            (unit === 'ALL' || u.unit === unit) &&
            (u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()))
        );
    }, [tenantId, search, unit]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Agregar Miembro</h3>
                    <button onClick={onClose}><XCircle size={24} className="text-slate-400 hover:text-slate-700" /></button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Buscar por nombre o rol..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Funnel className="text-slate-400" size={16} />
                        <select
                            className="flex-1 bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                        >
                            <option value="ALL">Todas las Áreas</option>
                            {availableUnits.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredUsers.map(u => (
                        <div
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className={`p-3 rounded-lg border cursor-pointer flex items-center gap-3 transition-colors ${selectedUser?.id === u.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {u.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800">{u.name}</p>
                                <p className="text-xs text-slate-500">{u.role} • {u.unit}</p>
                            </div>
                            {selectedUser?.id === u.id && <CheckCircle weight="fill" className="text-blue-600" size={20} />}
                        </div>
                    ))}
                    {filteredUsers.length === 0 && <p className="text-center text-xs text-slate-400 py-8">No se encontraron usuarios.</p>}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                    <button
                        onClick={() => selectedUser && onAdd(selectedUser)}
                        disabled={!selectedUser}
                        className="px-6 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function DocumentEditorModal({ project, target, onClose, onUpdate }: { project: Project, target: { phaseId: string, activityId: string, docId: string, mode: 'VIEW' | 'WORK' }, onClose: () => void, onUpdate: (p: Project) => void }) {
    const [showComments, setShowComments] = useState(target.mode === 'WORK');
    const [showVersions, setShowVersions] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [comment, setComment] = useState('');
    const [commentRef, setCommentRef] = useState('');
    const [pendingPos, setPendingPos] = useState<{ page: number, x: number, y: number } | null>(null);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [commentAttachment, setCommentAttachment] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [versionTab, setVersionTab] = useState<'UPLOAD' | 'LINK' | 'EMBED'>('UPLOAD');
    const [newVerEmbed, setNewVerEmbed] = useState('');
    const { currentUser } = useApp();
    const currentUserId = currentUser?.id || 'anonymous';

    // State for viewing historical versions
    // State for viewing historical versions
    const [viewingContent, setViewingContent] = useState('');
    const [viewingVersion, setViewingVersion] = useState<number | null>(null); // null means current/latest

    // Scroll to selected comment
    useEffect(() => {
        if (selectedCommentId) {
            setShowComments(true);
            setTimeout(() => {
                document.getElementById(`comment-${selectedCommentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [selectedCommentId]);

    // Version Upload State
    const [newVerUrl, setNewVerUrl] = useState('');
    const [newVerLog, setNewVerLog] = useState('');

    const phase = project.phases.find(p => p.id === target.phaseId);
    const activity = phase?.activities.find(a => a.id === target.activityId);
    const doc = activity?.documents.find(d => d.id === target.docId);

    if (!doc || !phase || !activity) return null;

    // Update viewing content when doc changes (e.g. after upload)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setViewingContent(doc.content || '');
        setViewingVersion(null);
    }, [doc.content]);

    const handleResolveComment = (commentId: string) => {
        const updatedDoc = {
            ...doc,
            comments: doc.comments?.map((c: any) =>
                c.id === commentId ? { ...c, resolved: !c.resolved } : c
            )
        };
        // Update document in project (mock update logic - reusing parent update mechanism needed)
        // Since we don't have a direct 'updateDocument' prop, we update the whole project structure
        const updatedProject = { ...project };
        const pIdx = updatedProject.phases.findIndex(p => p.id === phase.id);
        const aIdx = updatedProject.phases[pIdx].activities.findIndex(a => a.id === activity.id);
        const dIdx = updatedProject.phases[pIdx].activities[aIdx].documents.findIndex(d => d.id === doc.id);
        updatedProject.phases[pIdx].activities[aIdx].documents[dIdx] = updatedDoc;
        onUpdate(updatedProject);
        onUpdate(updatedProject);
    };

    const handleDeleteComment = (commentId: string) => {
        if (!confirm('¿Estás seguro de eliminar este comentario?')) return;
        const newComments = doc.comments?.filter((c: any) => c.id !== commentId) || [];
        const newDoc = { ...doc, comments: newComments };
        updateDocInProject(newDoc);
        if (selectedCommentId === commentId) setSelectedCommentId(null);
    };

    const handleReplyComment = (authorName: string) => {
        setComment(`@${authorName} `);
        // Focus textarea logic is handled by auto-focus when comment state changes or ref
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.indexOf("image") === 0) {
                const blob = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    setCommentAttachment(event.target?.result as string);
                };
                reader.readAsDataURL(blob!);
            }
        }
    };

    const handleScreenCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            // Capture frame slightly after playing
            setTimeout(() => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d")?.drawImage(video, 0, 0);
                setCommentAttachment(canvas.toDataURL("image/png"));
                setShowComments(true);
                stream.getTracks().forEach(t => t.stop());
            }, 300);
        } catch (e) {
            console.error("Screen capture skipped", e);
        }
    };

    const handleAddComment = () => {
        if (!comment.trim() && !commentAttachment) return;
        const newComment = {
            id: `c-${Date.now()}`,
            userId: currentUser?.id || 'anonymous',
            userName: currentUser?.name || 'Usuario',
            authorId: currentUser?.id || 'anonymous',
            authorName: currentUser?.name || 'Usuario',
            createdAt: new Date().toISOString(),
            content: comment,
            reference: commentRef || (pendingPos ? `Pág ${pendingPos.page}` : 'General'),
            position: pendingPos || undefined,
            date: new Date().toISOString(),
            likes: 0,
            attachment: commentAttachment || undefined
        };

        // Mock update
        const updatedDoc = {
            ...doc,
            comments: [...(doc.comments || []), newComment]
        };

        // Update document in project (mock update logic)
        const updatedProject = { ...project };
        const pIdx = updatedProject.phases.findIndex(p => p.id === phase.id);
        const aIdx = updatedProject.phases[pIdx].activities.findIndex(a => a.id === activity.id);
        const dIdx = updatedProject.phases[pIdx].activities[aIdx].documents.findIndex(d => d.id === doc.id);
        updatedProject.phases[pIdx].activities[aIdx].documents[dIdx] = updatedDoc;
        onUpdate(updatedProject);

        setComment('');
        setCommentRef('');
        setPendingPos(null);
        setCommentAttachment(null);
    };

    const handleUploadVersion = () => {
        let contentToSave = '';

        if (versionTab === 'LINK') {
            if (!newVerUrl) return;
            contentToSave = newVerUrl;
        } else if (versionTab === 'EMBED') {
            if (!newVerEmbed) return;
            // Extract src if iframe tag is pasted
            const srcMatch = newVerEmbed.match(/src="([^"]+)"/);
            contentToSave = srcMatch ? srcMatch[1] : newVerEmbed;
        } else if (versionTab === 'UPLOAD') {
            // Already handled by FileReader in UI, but we need variables.
            // Actually, for upload we need to handle it properly.
            // Let's rely on newVerUrl being set by the upload handler instantly for now, 
            // similar to how handlePaste works or repurpose newVerUrl as the generic content holder.
            if (!newVerUrl) return;
            contentToSave = newVerUrl;
        }

        if (!contentToSave) return;

        const nextVer = (doc.versions?.length || 0) + 1;
        const newVersionEntry = {
            version: nextVer,
            content: contentToSave,
            date: new Date().toISOString(),
            author: currentUser?.name || 'Admin User',
            changeLog: newVerLog || 'Actualización de documento'
        };

        const newDoc = {
            ...doc,
            content: contentToSave, // Update current content
            type: versionTab === 'EMBED' ? 'EMBED' : doc.type, // Update type if needed
            versions: [newVersionEntry, ...(doc.versions || [])]
        };

        updateDocInProject(newDoc);
        setShowUpload(false);
        setNewVerUrl('');
        setNewVerEmbed('');
        setNewVerLog('');
    };

    const updateDocInProject = (newDoc: any) => {
        const newPhases = project.phases.map(p => {
            if (p.id === phase.id) {
                const newActs = p.activities.map(a => {
                    if (a.id === activity.id) {
                        return { ...a, documents: a.documents.map(d => d.id === doc.id ? newDoc : d) };
                    }
                    return a;
                });
                return { ...p, activities: newActs };
            }
            return p;
        });
        onUpdate({ ...project, phases: newPhases });
    };

    const isUrl = viewingContent.startsWith('http');
    const isDataUrl = viewingContent.startsWith('data:');

    // Enhanced PDF detection: check URL extension, Data URL mime type, or filename (for current doc)
    const isPdf = (isUrl && (viewingContent.toLowerCase().endsWith('.pdf') || viewingContent.includes('.pdf'))) ||
        (isDataUrl && viewingContent.startsWith('data:application/pdf')) ||
        (doc.name.toLowerCase().endsWith('.pdf'));

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-900 animate-fadeIn h-screen w-screen overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center shadow-sm z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <FileText weight="duotone" className="text-blue-600" />
                            {doc.name}
                        </h2>
                        <p className="text-[10px] text-slate-500">{target.mode === 'WORK' ? 'Editando en línea' : 'Visualizando documento'} • v{doc.versions?.length || 0}</p>
                    </div>
                </div>



                <div className="flex items-center gap-2">
                    {target.mode === 'WORK' && (
                        <>
                            <button
                                onClick={handleScreenCapture}
                                title="Capturar Pantalla y Comentar"
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors mr-2 border border-slate-200"
                            >
                                <Camera size={18} className="text-purple-600" />
                                <span className="text-xs font-bold text-purple-700 hidden sm:inline">Capturar</span>
                            </button>
                            <button
                                onClick={() => setShowNotifyModal(true)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                                <Bell size={16} /> Notificar
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setShowVersions(!showVersions)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${showVersions ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Clock size={16} /> Historial
                    </button>
                    {target.mode === 'WORK' && (
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${showComments ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <ChatCircle size={16} /> Comentarios
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (isDataUrl) {
                                // For Data URLs, trigger download
                                const link = document.createElement('a');
                                link.href = doc.content || '';
                                link.download = doc.name;
                                link.click();
                            } else {
                                // For regular URLs, open in new tab
                                window.open(doc.content || '', '_blank');
                            }
                        }}
                        className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                    >
                        {isDataUrl ? 'Descargar' : 'Abrir Original'}
                    </button>
                </div>
            </div >

            {/* Main Content Split */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Visualizer */}
                <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center">
                    {/* Version Banner if viewing history */}
                    {viewingVersion !== null && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[50] bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold border border-yellow-200 shadow-sm flex items-center gap-2">
                            <Clock /> Viendo versión histórica {viewingVersion}
                            <button onClick={() => { setViewingContent(doc.content || ''); setViewingVersion(null); }} className="ml-2 hover:underline">Volver a actual</button>
                        </div>
                    )}

                    {
                        isPdf ? (
                            <VisualPDFEditor
                                url={viewingContent}
                                comments={(doc.comments as any[]) || []}
                                onCommentClick={setSelectedCommentId}
                                selectedCommentId={selectedCommentId || undefined}
                                onCanvasClick={(pos) => {
                                    setPendingPos(pos);
                                    if (!showComments) setShowComments(true);
                                }
                                }
                                pendingMarker={pendingPos}
                            />
                        ) : (
                            // Unified Viewer Logic for Images, Office Docs, and URLs
                            (() => {
                                // 1. Image Handling (Data URL or Remote)
                                if (viewingContent.startsWith('data:image/') || (isUrl && viewingContent.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
                                    return (
                                        <div className="w-full h-full flex items-center justify-center p-8">
                                            <img
                                                src={viewingContent}
                                                alt={doc.name}
                                                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                                            />
                                        </div>
                                    );
                                }

                                // 2. Office Document Handling
                                const isOfficeDoc = doc.name.match(/\.(pptx|docx|xlsx|doc|ppt|xls)$/i) || viewingContent.match(/\.(pptx|docx|xlsx|doc|ppt|xls)$/i);
                                if (isOfficeDoc) {
                                    let fileUrl = viewingContent;
                                    // If local/data-url, use sample for demo because Office Online Viewer requires public URLs
                                    if (viewingContent.startsWith('data:') || viewingContent.startsWith('blob:') || !viewingContent.startsWith('http')) {
                                        const t = doc.name.toLowerCase();
                                        if (t.includes('doc') || t.includes('word')) fileUrl = 'https://www.filesampleshub.com/download/document/docx/sample1.docx';
                                        else if (t.includes('xls') || t.includes('sheet')) fileUrl = 'https://www.filesampleshub.com/download/document/xlsx/sample1.xlsx';
                                        else fileUrl = 'https://www.filesampleshub.com/download/document/pptx/sample1.pptx';
                                    }
                                    return (
                                        <iframe
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                                            className="w-full h-full bg-white shadow-2xl"
                                            title="Office Document Preview"
                                        />
                                    );
                                }

                                // 3. Generic URL Iframe
                                if (isUrl && !viewingContent.startsWith('data:')) {
                                    return (
                                        <iframe
                                            src={viewingContent}
                                            className="w-full h-full bg-white shadow-2xl"
                                            title="Document Preview"
                                        />
                                    );
                                }

                                // 4. Fallback
                                return (
                                    <div className="text-center p-10 max-w-md">
                                        <FileText size={64} className="mx-auto text-slate-300 mb-4" />
                                        <h3 className="text-lg font-bold text-slate-600">Vista previa no disponible</h3>
                                        <p className="text-sm text-slate-500 mb-6">Este archivo no se puede previsualizar aquí. Usa el botón de descarga.</p>
                                        <a href={viewingContent} download={doc.name} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Descargar Archivo</a>
                                    </div>
                                );
                            })()
                        )
                    }
                </div >

                {/* Right Sidebar: Comments (Word Style) */}
                {
                    showComments && (
                        <div className="w-[350px] bg-slate-50 border-l border-slate-200 flex flex-col shadow-xl z-20 animate-slideLeft">
                            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 text-sm">Comentarios</h3>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">{doc.comments?.length || 0}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {(!doc.comments || doc.comments.length === 0) && (
                                    <div className="text-center py-20 text-slate-400">
                                        <p className="text-sm">No hay comentarios aún.</p>
                                        <p className="text-xs mt-1">Selecciona texto o escribe abajo para comentar.</p>
                                    </div>
                                )}
                                {doc.comments?.map((c: any) => (
                                    <div
                                        key={c.id}
                                        id={`comment-${c.id}`}
                                        className={`group relative rounded-xl p-4 transition-all duration-300 cursor-pointer
                                            ${selectedCommentId === c.id
                                                ? 'bg-blue-50 border-2 border-blue-500 ring-4 ring-blue-100 shadow-xl scale-[1.02] z-10'
                                                : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300'}
                                            ${c.resolved ? 'opacity-60 grayscale' : 'border-l-4 border-l-blue-500'}
                                        `}
                                        onClick={() => setSelectedCommentId(c.id)}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                                    {c.userName.substring(0, 1)}
                                                </div>
                                                <span className="text-xs font-bold text-slate-800">{c.userName}</span>
                                                {c.resolved && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full uppercase font-bold">Resuelto</span>}
                                            </div>
                                            <span className="text-[10px] text-slate-400">{new Date(c.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        {(c.reference && c.reference !== 'General') && (
                                            <div className="mb-2 px-2 py-1 bg-yellow-50 border-l-2 border-yellow-400 text-[10px] text-slate-600 italic">
                                                "{c.reference}"
                                            </div>
                                        )}
                                        <p className="text-sm text-slate-700 leading-relaxed">{c.content}</p>
                                        {c.attachment && (
                                            <div className="mt-2 group/img relative inline-block">
                                                <img
                                                    src={c.attachment}
                                                    alt="Adjunto"
                                                    onClick={(e) => { e.stopPropagation(); setPreviewImage(c.attachment); }}
                                                    className="max-w-full h-auto rounded border border-slate-200 shadow-sm cursor-zoom-in hover:brightness-95 transition-all"
                                                />
                                            </div>
                                        )}

                                        {!c.resolved && (
                                            <div className="mt-3 pt-2 border-t border-slate-50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleReplyComment(c.userName); }}
                                                        className="text-[10px] text-slate-500 hover:text-blue-600 font-bold flex items-center gap-1"
                                                    >
                                                        Responder
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleResolveComment(c.id); }}
                                                        className="text-[10px] text-slate-500 hover:text-green-600 font-bold flex items-center gap-1 ml-2"
                                                    >
                                                        <CheckCircle size={12} /> Resolver
                                                    </button>
                                                </div>
                                                {c.userId === currentUserId && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteComment(c.id); }}
                                                        className="text-[10px] text-slate-400 hover:text-red-600"
                                                        title="Eliminar comentario"
                                                    >
                                                        <Trash size={12} weight="bold" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {c.resolved && (
                                            <div className="mt-2 pt-2 border-t border-slate-100 text-right">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleResolveComment(c.id); }}
                                                    className="text-[10px] text-slate-400 hover:text-slate-600"
                                                >
                                                    Reabrir hilo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white border-t border-slate-200 space-y-2">
                                {pendingPos && (
                                    <div className="px-3 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-lg flex justify-between items-center">
                                        <span>Agregando marcador en <strong>Pag {pendingPos.page}</strong></span>
                                        <button onClick={() => setPendingPos(null)}><XCircle size={16} /></button>
                                    </div>
                                )}
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder={pendingPos ? "Referencia (automática)" : "Referencia (ej: Pág 2)..."}
                                    value={commentRef}
                                    onChange={e => setCommentRef(e.target.value)}
                                    disabled={!!pendingPos}
                                />
                                {commentAttachment && (
                                    <div className="relative mb-2 inline-block group">
                                        <img src={commentAttachment} className="h-20 rounded border border-slate-300 object-cover" />
                                        <button
                                            onClick={() => setCommentAttachment(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <XCircle size={12} weight="fill" />
                                        </button>
                                    </div>
                                )}
                                <div className="relative">
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-blue-500 pr-10 resize-none"
                                        rows={2}
                                        placeholder="Escribe un comentario..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        onPaste={handlePaste}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className={`absolute right-2 bottom-2 p-1.5 ${comment.trim() || commentAttachment ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'} text-white rounded-lg transition-colors`}
                                        disabled={!comment.trim() && !commentAttachment}
                                    >
                                        <Paperclip size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >

            {/* Versions Popover */}
            {
                showVersions && (
                    <div className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 animate-scaleIn origin-top-right">
                        <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h4 className="font-bold text-xs text-slate-700 uppercase">Historial de Versiones</h4>
                            <button onClick={() => setShowVersions(false)}><XCircle size={16} className="text-slate-400" /></button>
                        </div>
                        <div className="max-h-60 overflow-y-auto p-2">
                            {doc.versions?.map((v: any, i: number) => (
                                <div
                                    key={i}
                                    onClick={() => { setViewingContent(v.content); setViewingVersion(v.version); }}
                                    className={`mb-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0 cursor-pointer p-2 rounded-lg transition-colors
                                            ${viewingVersion === v.version ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-slate-50'}
                                        `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-xs text-slate-700">Versión {v.version}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(v.date).toLocaleString()}</p>
                                        </div>
                                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{v.author}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{v.changeLog}</p>
                                </div>
                            ))}{(!doc.versions || doc.versions.length === 0) && <p className="text-xs text-slate-400 text-center py-4">Versión inicial</p>}
                        </div>

                        {target.mode === 'WORK' && (
                            <button
                                onClick={() => setShowUpload(true)}
                                className="w-full mt-4 p-2 bg-purple-600 text-white text-[10px] font-bold rounded-lg hover:bg-purple-700 transition-all shadow-sm"
                            >
                                + Cargar Nueva Versión
                            </button>
                        )}
                    </div>
                )
            }

            {/* Upload Version Modal */}
            {showUpload && (
                <div className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center animate-fadeIn">
                    <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 animate-scaleIn">
                        <h3 className="font-bold text-lg text-slate-800 mb-4">Cargar Nueva Versión</h3>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 mb-4">
                            <button
                                onClick={() => setVersionTab('UPLOAD')}
                                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${versionTab === 'UPLOAD' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Subir Archivo
                            </button>
                            <button
                                onClick={() => setVersionTab('LINK')}
                                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${versionTab === 'LINK' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Enlace Externo
                            </button>
                            <button
                                onClick={() => setVersionTab('EMBED')}
                                className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors ${versionTab === 'EMBED' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Embed / Iframe
                            </button>
                        </div>

                        <div className="space-y-4">
                            {versionTab === 'UPLOAD' && (
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    setNewVerUrl(ev.target?.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                                    <p className="text-sm font-bold text-slate-600">
                                        {newVerUrl && newVerUrl.startsWith('data:') ? 'Archivo seleccionado' : 'Haz clic para subir un archivo'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, Imágenes, Office</p>
                                </div>
                            )}

                            {versionTab === 'LINK' && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Nuevo Enlace / URL</label>
                                    <input
                                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                        placeholder="https://..."
                                        value={newVerUrl}
                                        onChange={e => setNewVerUrl(e.target.value)}
                                    />
                                </div>
                            )}

                            {versionTab === 'EMBED' && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Código Embed / Iframe</label>
                                    <textarea
                                        className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono text-xs"
                                        placeholder='<iframe src="..."></iframe>'
                                        rows={3}
                                        value={newVerEmbed}
                                        onChange={e => setNewVerEmbed(e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="text-xs font-bold text-slate-500">Notas de Cambio</label>
                                <textarea
                                    className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                                    placeholder="Descripción de cambios..."
                                    rows={2}
                                    value={newVerLog}
                                    onChange={e => setNewVerLog(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setShowUpload(false)} className="px-4 py-2 text-slate-500 text-xs font-bold hover:bg-slate-100 rounded-lg">Cancelar</button>
                            <button onClick={handleUploadVersion} className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700">Guardar Versión</button>
                        </div>
                    </div>
                </div>
            )}

            {/* NOTIFICATION MODAL */}
            {showNotifyModal && createPortal(
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-purple-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell className="text-purple-600" weight="fill" /> Notificar Novedad</h3>
                            <button onClick={() => setShowNotifyModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destinatario (Equipo)</label>
                                <select className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500">
                                    <option value="">Seleccionar miembro...</option>
                                    <option value="1">Javier User (Diseñador)</option>
                                    <option value="2">Maria Lead (Project Manager)</option>
                                    <option value="3">Carlos Dev (Desarrollador)</option>
                                    <option value="all">Todo el equipo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mensaje</label>
                                <textarea
                                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                                    placeholder="Escribe la novedad sobre el flujo o documento..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setShowNotifyModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg font-medium">Cancelar</button>
                                <button onClick={() => { setShowNotifyModal(false); alert('Notificación enviada con éxito'); }} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 shadow-md shadow-purple-200">Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Lightbox Portal */}
            {previewImage && createPortal(
                <div
                    className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-10 animate-fadeIn"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
                    >
                        <XCircle size={40} />
                    </button>
                    <img
                        src={previewImage}
                        className="max-w-full max-h-full rounded-lg shadow-2xl animate-scaleIn object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}

        </div>,
        document.body
    );
}
