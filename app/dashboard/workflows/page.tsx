'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import { DB, WorkflowCase, WorkflowDefinition, Project, ProjectPhase, ProjectDocument, ProjectActivity, ProjectFolder, User as ProjectUser } from '@/lib/data';
import {
    Plus, Kanban, CheckCircle, Clock, XCircle, User, Calendar,
    Tray, ArrowRight, CaretRight, ChatCircle, Paperclip, Funnel, UserSwitch, MagnifyingGlass,
    Briefcase, Folder, Trash, Upload, FileText, YoutubeLogo, Link as LinkIcon, Camera, PencilSimple, Bell, Copy, FileCsv,
    FilePpt, FileDoc, FileXls, Presentation, Minus, MagnifyingGlassPlus, DownloadSimple, CloudArrowUp, ChartPie
} from '@phosphor-icons/react';

// --- GLOBAL PROGRESS UTILS ---
const getStatusValue = (status: string) => {
    switch (status) {
        case 'VALIDATED': return 100;
        case 'DELIVERED': return 90;
        case 'IN_REVIEW': return 80;
        case 'COMPLETED': return 60;
        case 'IN_PROGRESS': return 20;
        default: return 0;
    }
};

const getProjectProgress = (proj: Project) => {
    if (!proj.phases || proj.phases.length === 0) return 0;
    // Simple mock calculation
    return 45;
};

export default function WorkflowsPage() {
    const { currentUser, createProject, updateProject, deleteProjectFolder, version } = useApp();
    const { t } = useTranslation();
    const [mainView, setMainView] = useState<'WORKFLOWS' | 'PROJECTS'>('PROJECTS');
    const [activeTab, setActiveTab] = useState<'REQUESTS' | 'TASKS'>('REQUESTS');
    const [selectedCase, setSelectedCase] = useState<WorkflowCase | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);

    // PROJECT STATES
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);

    const [isClient, setIsClient] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [filterUnit, setFilterUnit] = useState('ALL');

    useEffect(() => { setIsClient(true); }, []);


    // Filter Logic
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
        // Global projects in Single Tenant
        return DB.projects.filter(p =>
            !search || p.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [isClient, version, search]);


    if (!isClient) return <div className="p-8 text-slate-400">Cargando workflows...</div>;

    const activeList = activeTab === 'REQUESTS' ? myRequests : myTasks;

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all ${selectedCase || selectedProject ? 'mr-0' : ''}`}>

                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shadow-sm z-10">
                    <div>
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
                        <h1 className="text-2xl font-bold text-slate-900">
                            {mainView === 'WORKFLOWS' ? t('wf_title_requests') : t('wf_title_projects')}
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        {mainView === 'PROJECTS' ? (
                            <button
                                onClick={() => setShowNewProjectModal(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-600/20 flex items-center gap-2"
                            >
                                <Plus weight="bold" size={18} /> {t('wf_new_project')}
                            </button>
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
                    <div className="p-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {projectsList.map(p => (
                            <div key={p.id} onClick={() => setSelectedProject(p)} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md cursor-pointer hover:border-purple-300 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-lg bg-purple-50 text-purple-600"><Briefcase size={24} weight="duotone" /></div>
                                    <span className="text-xs font-bold text-slate-400">{p.status}</span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">{p.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{p.description}</p>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${getProjectProgress(p)}%` }}></div>
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

            {/* Detail Drawer - Projects */}
            {selectedProject && (
                <div className="w-[600px] bg-white border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-slideLeft z-20">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center p-6 bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
                        <button onClick={() => setSelectedProject(null)}><XCircle size={24} className="text-slate-400 hover:text-slate-600" weight="fill" /></button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1">
                        <h3 className="font-bold text-sm text-slate-500 uppercase mb-4">Fases del Proyecto</h3>
                        <div className="space-y-4">
                            {selectedProject.phases.map((phase) => (
                                <div key={phase.id} className="border border-slate-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-slate-800">{phase.name}</h4>
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">{phase.status}</span>
                                    </div>
                                    <div className="pl-4 border-l-2 border-slate-100 space-y-2">
                                        {phase.activities.map((act) => (
                                            <div key={act.id} className="flex justify-between items-center text-sm py-1">
                                                <span className="text-slate-700">{act.name}</span>
                                                <span className={`text-[10px] font-bold ${act.status === 'COMPLETED' ? 'text-green-600' : 'text-slate-400'}`}>{act.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* New Project Modal */}
            {showNewProjectModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="font-bold text-lg mb-4">Nuevo Proyecto</h3>
                        <p className="text-sm text-slate-500 mb-4">Creación rápida de proyectos.</p>
                        <button onClick={() => {
                            createProject({
                                title: 'Nuevo Proyecto Demo',
                                description: 'Descripción del proyecto...',
                                startDate: new Date().toISOString(),
                                endDate: new Date().toISOString(),
                                // Eliminado tenantId
                                phases: []
                            });
                            setShowNewProjectModal(false);
                        }} className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold">Crear Proyecto</button>
                        <button onClick={() => setShowNewProjectModal(false)} className="w-full mt-2 text-slate-500 text-sm">Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
