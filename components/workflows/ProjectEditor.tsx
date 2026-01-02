"use client";

import { useState, useMemo, useEffect } from 'react';
import { Project, ProjectPhase, ProjectActivity, DB, User, Doc, ProjectFolder } from '@/lib/data';

interface ProjectEditorProps {
    project: Project;
    folders: ProjectFolder[];
    onUpdate?: (id: string, updates: Partial<Project>) => void; // Optional if we handle it internally via useApp pending refactor, but kept for compatibility
    readOnly?: boolean;
}

const STATUS_WEIGHTS: Record<string, number> = {
    'PENDING': 0,
    'IN_PROGRESS': 50,
    'COMPLETED': 80,
    'IN_REVIEW': 90,
    'DELIVERED': 95,
    'VALIDATED': 100
};

const STATUS_LABELS: Record<string, string> = {
    'PENDING': 'Sin iniciar',
    'IN_PROGRESS': 'En proceso',
    'COMPLETED': 'Finalizado',
    'IN_REVIEW': 'En revisión (QA)',
    'DELIVERED': 'Entregado',
    'VALIDATED': 'Validado'
};

export default function ProjectEditor({ project, folders, onUpdate, readOnly = false }: ProjectEditorProps) {
    const { currentUser, updateProject, refreshData } = useApp();
    const router = useRouter();

    // Toggle Edit Mode - Default to false unless explicitly new?
    // For a dedicated page, we might want "Edit" button or always editable fields with auto-save?
    // Let's keep the explicit "Edit" mode from the drawer for consistency and safety.
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<{ doc: any, mode: 'view' | 'work' } | null>(null);

    // Handle Document Open (View/Work)
    const handleOpenDocument = (doc: any, mode: 'view' | 'work') => {
        const repoFile = {
            id: doc.id,
            title: doc.name || doc.title,
            type: doc.type,
            url: doc.url,
            content: doc.content,
            size: doc.size,
            createdAt: doc.createdAt ? new Date(doc.createdAt) : new Date(),
        };
        setSelectedDoc({ doc: repoFile, mode });
    };

    // Helper for safe date parsing
    const formatDateForInput = (date: string | Date | undefined | null) => {
        if (!date) return '';
        if (date instanceof Date) return date.toISOString().split('T')[0];
        if (typeof date === 'string') return date.split('T')[0];
        return '';
    };

    // Buffer state
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description || '');
    const [folderId, setFolderId] = useState(project.folderId || '');
    const [color, setColor] = useState(project.color || '#3b82f6');
    const [startDate, setStartDate] = useState(formatDateForInput(project.startDate));
    const [endDate, setEndDate] = useState(formatDateForInput(project.endDate));
    const [phases, setPhases] = useState<ProjectPhase[]>(project.phases || []);

    // Sync state if project prop changes (e.g. re-fetched)
    useEffect(() => {
        setTitle(project.title);
        setDescription(project.description || '');
        setFolderId(project.folderId || '');
        setColor(project.color || '#3b82f6');
        setStartDate(formatDateForInput(project.startDate));
        setEndDate(formatDateForInput(project.endDate));
        setPhases(project.phases || []);
    }, [project]);

    // Modals state
    const [showUserPicker, setShowUserPicker] = useState<{ active: boolean; phaseId?: string; activityId?: string }>({ active: false });
    const [showDocPicker, setShowDocPicker] = useState<{ active: boolean; phaseId?: string; activityId?: string }>({ active: false });
    const [showTeamModal, setShowTeamModal] = useState(false);

    // Search states for pickers
    const [userSearch, setUserSearch] = useState('');
    const [unitFilter, setUnitFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [docSearch, setDocSearch] = useState('');
    const [sendNotification, setSendNotification] = useState(true);

    // Save Display
    const [isSaving, setIsSaving] = useState(false);

    // Calculate Progress (Weighted)
    const progress = useMemo(() => {
        if (!phases.length) return 0;
        let totalWeight = 0;
        let totalActivities = 0;

        phases.forEach(p => {
            if (p.activities) {
                p.activities.forEach(a => {
                    totalActivities++;
                    const weight = STATUS_WEIGHTS[a.status] || 0;
                    totalWeight += weight;
                });
            }
        });

        return totalActivities === 0 ? 0 : Math.round(totalWeight / totalActivities);
    }, [phases]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Use local updateProject from useApp which calls the Server Action
            // We use the Promise wrapper if available or just await
            await updateProject(project.id, {
                title,
                description,
                folderId,
                color,
                startDate: (startDate || null) as any,
                endDate: (endDate || null) as any,
                phases
            });

            // Allow context to refresh
            // Optional: Show success toast
            setIsEditing(false);
            if (onUpdate) onUpdate(project.id, { title, phases }); // Notify parent if needed
        } catch (error) {
            console.error("Failed to save project", error);
            alert("Error al guardar los cambios.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- PHASE MANAGEMENT ---
    const addPhase = () => {
        const newPhase: ProjectPhase = {
            id: `ph-${Date.now()}`,
            name: `Fase ${phases.length + 1}: Nueva Fase`,
            status: 'PENDING',
            order: phases.length + 1,
            activities: []
        };
        setPhases([...phases, newPhase]);
    };

    const deletePhase = (phaseId: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta fase y todas sus actividades?")) return;
        setPhases(phases.filter(p => p.id !== phaseId));
    };

    const updatePhaseName = (phaseId: string, name: string) => {
        setPhases(phases.map(p => p.id === phaseId ? { ...p, name } : p));
    };

    // --- ACTIVITY MANAGEMENT ---
    const addActivity = (phaseId: string) => {
        setPhases(phases.map(p => {
            if (p.id !== phaseId) return p;
            const newActivity: ProjectActivity = {
                id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                name: 'Nueva Actividad',
                status: 'PENDING',
                participants: [],
                documents: []
            };
            return { ...p, activities: [...(p.activities || []), newActivity] };
        }));
    };

    const updateActivity = (phaseId: string, activityId: string, updates: Partial<ProjectActivity>) => {
        setPhases(phases.map(p => {
            if (p.id !== phaseId) return p;
            return {
                ...p,
                activities: p.activities.map(a => a.id === activityId ? { ...a, ...updates } : a)
            };
        }));
    };

    const deleteActivity = (phaseId: string, activityId: string) => {
        setPhases(phases.map(p => {
            if (p.id !== phaseId) return p;
            return { ...p, activities: p.activities.filter(a => a.id !== activityId) };
        }));
    };

    // --- PICKERS HANDLERS ---
    const handleCloseUserPicker = () => {
        setShowUserPicker({ active: false });
        setSelectedUser(null);
        setUnitFilter('');
        setUserSearch('');
    };

    const handleAddMember = (user: User) => {
        if (!showUserPicker.phaseId || !showUserPicker.activityId) return;

        setPhases(prev => prev.map(p => {
            if (p.id !== showUserPicker.phaseId) return p;
            return {
                ...p,
                activities: p.activities.map(a => {
                    if (a.id !== showUserPicker.activityId) return a;
                    // Add user if not exists
                    const exists = a.participants.some(part =>
                        typeof part === 'string' ? part === user.id : part.userId === user.id
                    );
                    if (exists) return a;

                    return {
                        ...a,
                        participants: [...a.participants, { userId: user.id, role: 'assignee' }]
                    };
                })
            };
        }));

        if (sendNotification) {
            const phase = phases.find(p => p.id === showUserPicker.phaseId);
            const activity = phase?.activities?.find(a => a.id === showUserPicker.activityId);

            if (phase && activity) {
                sendAssignmentNotification({
                    projectName: project.title,
                    projectId: project.id,
                    phaseName: phase.name,
                    activityName: activity.name,
                    startDate: activity.startDate,
                    endDate: activity.endDate,
                    assigneeEmail: user.email || '',
                    assigneeName: user.name
                }).catch(console.error);
            }
        }

        handleCloseUserPicker();
    };

    const handleAddEvidence = async (evidence: any) => {
        if (!showDocPicker.phaseId || !showDocPicker.activityId) return;

        // Optimistic State Update
        const newDoc = {
            id: evidence.id || `doc-${Date.now()}`,
            name: evidence.name,
            type: evidence.type,
            url: evidence.url,
            content: evidence.content
        };

        const updatedPhases = phases.map(p => {
            if (p.id !== showDocPicker.phaseId) return p;
            return {
                ...p,
                activities: p.activities.map(a => {
                    if (a.id !== showDocPicker.activityId) return a;
                    return {
                        ...a,
                        documents: [...(a.documents || []), newDoc]
                    };
                })
            };
        });

        setPhases(updatedPhases);
        setShowDocPicker({ active: false });

        // Auto Save to Persistent Store
        try {
            await updateProject(project.id, { phases: updatedPhases });
            // Optional: toast success
        } catch (error) {
            console.error("Auto-save failed:", error);
            alert("Error al guardar el documento. Intenta de nuevo.");
            setPhases(phases); // Revert on failure
        }
    };


    const handleDeleteDocument = async (phaseId: string, activityId: string, docId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) return;

        // Optimistic Update
        const updatedPhases = phases.map(p => {
            if (p.id !== phaseId) return p;
            return {
                ...p,
                activities: p.activities.map(a => {
                    if (a.id !== activityId) return a;
                    return {
                        ...a,
                        documents: (a.documents || []).filter(d => d.id !== docId)
                    };
                })
            };
        });

        setPhases(updatedPhases);

        // Auto Save
        try {
            await updateProject(project.id, { phases: updatedPhases });
        } catch (error) {
            console.error("Auto-save deletion failed:", error);
            alert("Error al eliminar el documento. Intenta de nuevo.");
            setPhases(phases); // Revert
        }
    };

    return (
        <div className="bg-white min-h-full">
            {/* Header / Toolbar */}
            <div className="px-8 py-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white sticky top-0 z-20 shadow-sm">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-2xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 w-full placeholder:text-slate-300"
                            placeholder="Nombre del Proyecto"
                        />
                    ) : (
                        <h1 className="text-2xl font-bold text-slate-900 truncate">{title}</h1>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {project.status || 'PLANNED'}
                        </span>
                        <span className="text-sm text-slate-400">• Última actualización: {new Date(project.updatedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={() => router.push('/dashboard/workflows')}
                        className="px-4 py-2 text-slate-500 font-bold text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Volver
                    </button>
                    {!readOnly && (
                        isEditing ? (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-green-600/20"
                            >
                                {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FloppyDisk size={18} weight="fill" />}
                                Guardar Cambios
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowTeamModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <Users size={18} />
                                    Equipo
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    <PencilSimple size={18} weight="fill" />
                                    Editar Proyecto
                                </button>
                            </>
                        )
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8 space-y-8">
                {/* General Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Información General</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Descripción</label>
                            {isEditing ? (
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descripción detallada del proyecto..."
                                    rows={3}
                                    className="w-full text-sm text-slate-700 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all resize-none"
                                />
                            ) : (
                                <p className="text-sm text-slate-700 leading-relaxed">{description || 'Sin descripción'}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Carpeta</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <Folder size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <select
                                            value={folderId}
                                            onChange={(e) => setFolderId(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-none focus:border-blue-400 transition-all"
                                        >
                                            <option value="">-- Raíz --</option>
                                            {folders.map(f => (
                                                <option key={f.id} value={f.id}>{f.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                        <Folder size={18} className="text-blue-500" weight="duotone" />
                                        {folders.find(f => f.id === folderId)?.name || 'Carpeta Raíz'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Color Distintivo</label>
                                {isEditing ? (
                                    <div className="flex gap-2 py-1.5 flex-wrap">
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setColor(c)}
                                                className={`w-6 h-6 rounded-full transition-all ring-2 ring-offset-1 ${color === c ? 'ring-slate-400 scale-110' : 'ring-transparent hover:scale-105'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: color }}></div>
                                        <span className="text-xs text-slate-500 font-mono">{color}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fecha Inicio</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Calendar className="text-slate-400" />
                                        {startDate || '-'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fecha Fin</label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                        <Calendar className="text-slate-400" />
                                        {endDate || '-'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Progreso Global</span>
                                <span className="text-lg font-bold text-slate-800">{progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full w-full overflow-hidden shadow-inner">
                                <div className="h-full rounded-full transition-all duration-700 ease-out relative" style={{ width: `${progress}%`, backgroundColor: color }}>
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Structure / Kanban */}
                <div>
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Kanban size={24} className="text-slate-400" weight="duotone" />
                            Estructura y Fases
                        </h3>
                        {isEditing && (
                            <button
                                onClick={addPhase}
                                className="text-white bg-slate-800 hover:bg-slate-900 border border-transparent shadow-lg shadow-slate-900/20 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition-all active:scale-95"
                            >
                                <Plus weight="bold" /> Nueva Fase
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        {phases.map((phase, pIndex) => (
                            <div key={phase.id} className="bg-slate-50/50 rounded-2xl border border-slate-200 p-1 group/phase transition-all hover:bg-slate-50 hover:border-blue-200 hover:shadow-md">
                                <div className="flex items-center gap-4 p-4 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-lg bg-white text-slate-500 border border-slate-100 flex items-center justify-center font-bold text-sm shadow-sm">
                                        {pIndex + 1}
                                    </div>

                                    <div className="flex-1">
                                        {isEditing ? (
                                            <input
                                                className="bg-white border border-slate-200 focus:border-blue-400 font-bold text-slate-800 w-full px-3 py-1.5 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-50 transition-all"
                                                value={phase.name}
                                                onChange={(e) => updatePhaseName(phase.id, e.target.value)}
                                                placeholder="Nombre de la fase"
                                            />
                                        ) : (
                                            <h4 className="font-bold text-slate-800 text-lg">{phase.name}</h4>
                                        )}
                                    </div>

                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{phase.activities?.length || 0} ITEMS</div>

                                    {isEditing && (
                                        <button onClick={() => deletePhase(phase.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar Fase">
                                            <Trash size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="p-4 space-y-3">
                                    {phase.activities?.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                                            <p className="text-slate-400 text-sm font-medium">No hay actividades en esta fase</p>
                                        </div>
                                    )}

                                    {phase.activities?.map((act) => (
                                        <div key={act.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        {isEditing ? (
                                                            <input
                                                                className="font-bold text-slate-700 text-sm border border-transparent hover:border-slate-200 focus:border-blue-300 focus:bg-slate-50 rounded px-2 py-1 -ml-2 w-full transition-all"
                                                                value={act.name}
                                                                onChange={(e) => updateActivity(phase.id, act.id, { name: e.target.value })}
                                                            />
                                                        ) : (
                                                            <h5 className="font-bold text-slate-700 text-sm">{act.name}</h5>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                            <Calendar weight="duotone" className="text-blue-500" />
                                                            {isEditing ? (
                                                                <input
                                                                    type="date"
                                                                    className="bg-transparent border-none p-0 text-xs w-24 focus:ring-0"
                                                                    value={formatDateForInput(act.startDate)}
                                                                    onChange={e => updateActivity(phase.id, act.id, { startDate: e.target.value })}
                                                                />
                                                            ) : (
                                                                <span>{formatDateForInput(act.startDate) || 'Fecha Inicio'}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                            {isEditing ? (
                                                                <input
                                                                    type="date"
                                                                    className="bg-transparent border-none p-0 text-xs w-24 focus:ring-0"
                                                                    value={formatDateForInput(act.endDate)}
                                                                    onChange={e => updateActivity(phase.id, act.id, { endDate: e.target.value })}
                                                                />
                                                            ) : (
                                                                <>
                                                                    <span className="text-slate-300">→</span>
                                                                    <span>{formatDateForInput(act.endDate) || 'Fecha Fin'}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-end justify-between gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                                                    <select
                                                        value={act.status}
                                                        onChange={(e) => updateActivity(phase.id, act.id, { status: e.target.value })}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 appearance-none cursor-pointer text-center w-full transition-colors ${act.status === 'VALIDATED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            act.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-slate-50 text-slate-600 border-slate-200'
                                                            }`}
                                                    >
                                                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                                            <option key={key} value={key}>{label}</option>
                                                        ))}
                                                    </select>

                                                    <div className="flex items-center gap-2">
                                                        {/* Avatars */}
                                                        <div className="flex -space-x-2">
                                                            {act.participants?.map((p, i) => (
                                                                <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold" title={typeof p === 'object' ? p.userId : p}>
                                                                    U
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => setShowUserPicker({ active: true, phaseId: phase.id, activityId: act.id })}
                                                                className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border-2 border-white flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors"
                                                            >
                                                                <Users size={12} weight="bold" />
                                                            </button>
                                                        </div>

                                                        <div className="w-px h-4 bg-slate-200 mx-1"></div>

                                                        {/* Docs Button (counter only) */}
                                                        <div className="flex items-center gap-1">
                                                            {act.documents?.length > 0 && <span className="text-xs font-bold text-slate-600">{act.documents.length}</span>}
                                                            <button
                                                                onClick={() => setShowDocPicker({ active: true, phaseId: phase.id, activityId: act.id })}
                                                                className={`p-1 rounded-md ${act.documents?.length > 0 ? 'text-blue-500 bg-blue-50' : 'text-slate-300 hover:text-slate-500'}`}
                                                            >
                                                                <Paperclip size={16} weight="duotone" />
                                                            </button>
                                                        </div>

                                                        {isEditing && (
                                                            <button onClick={() => deleteActivity(phase.id, act.id)} className="ml-2 text-slate-300 hover:text-red-500">
                                                                <XCircle size={18} weight="fill" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Document List Inside Card */}
                                            {act.documents && act.documents.length > 0 && (
                                                <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
                                                    {act.documents.map((doc: any) => (
                                                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 gap-3 group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded-lg border border-slate-100 text-pink-500">
                                                                    <FileText size={20} weight="duotone" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{doc.name || 'Documento sin nombre'}</p>
                                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">{doc.type || 'Archivo'}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                                                <button
                                                                    onClick={() => handleOpenDocument(doc, 'view')}
                                                                    className="px-3 py-1.5 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-xs font-bold rounded-lg transition-colors"
                                                                >
                                                                    Ver
                                                                </button>
                                                                <button
                                                                    onClick={() => handleOpenDocument(doc, 'work')}
                                                                    className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-xs font-bold rounded-lg transition-colors"
                                                                >
                                                                    Trabajar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteDocument(phase.id, act.id, doc.id)}
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar documento"
                                                                >
                                                                    <Trash size={16} weight="bold" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {isEditing && (
                                        <button
                                            onClick={() => addActivity(phase.id)}
                                            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-sm hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus weight="bold" /> Nueva Actividad
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODALS (Reused from logic) --- */}

            {/* USER PICKER MODAL */}
            {showUserPicker.active && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                        <div className="p-5 border-b flex justify-between items-center shrink-0">
                            <h4 className="font-bold text-lg text-slate-800">Asignar Responsable</h4>
                            <button onClick={handleCloseUserPicker} className="bg-slate-100 p-1 rounded-full text-slate-400 hover:text-slate-700"><X size={20} /></button>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto min-h-0">
                            <div className="relative mb-3">
                                {!userSearch && <MagnifyingGlass className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" size={16} />}
                                <input
                                    autoFocus
                                    placeholder="Buscar por nombre o rol..."
                                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50 focus:bg-white"
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                {DB.users.filter(u => {
                                    const matchesName = !userSearch || (u.name || '').toLowerCase().includes(userSearch.toLowerCase());
                                    const matchesUnit = !unitFilter || u.unit === unitFilter;
                                    return matchesName && matchesUnit;
                                }).map(u => (
                                    <div
                                        key={u.id}
                                        onClick={() => setSelectedUser(u)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedUser?.id === u.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                                            {u.name?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{u.role} • {u.unit || 'General'}</p>
                                        </div>
                                        {selectedUser?.id === u.id && <Check className="text-blue-600" size={20} weight="bold" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 border-t bg-slate-50 rounded-b-2xl shrink-0 flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`relative w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ${sendNotification ? 'bg-blue-500' : 'bg-slate-300'}`} onClick={() => setSendNotification(!sendNotification)}>
                                    <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${sendNotification ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-xs font-bold text-slate-600">Notificar</span>
                            </label>

                            <button
                                onClick={() => selectedUser && handleAddMember(selectedUser)}
                                disabled={!selectedUser}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                Asignar Usuario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TEAM STRUCTURE MODAL */}
            {showTeamModal && (
                <TeamStructureModal
                    project={project}
                    phases={phases}
                    onClose={() => setShowTeamModal(false)}
                />
            )}

            {/* EVIDENCE MODAL */}
            {showDocPicker.active && (
                <AddEvidenceModal
                    isOpen={showDocPicker.active}
                    projectId={project.id} // Pass project ID
                    onClose={() => setShowDocPicker({ active: false })}
                    onAdd={handleAddEvidence}
                />
            )}
            {/* Document Viewer Modal - Full Screen Overlay */}
            {selectedDoc && (
                <div className="fixed inset-0 z-[100] bg-white">
                    <DocumentViewer
                        initialDoc={selectedDoc.doc}
                        units={[]} // Pass units if available in context, or empty array if acceptable for now
                        initialMode={selectedDoc.mode}
                        onClose={() => setSelectedDoc(null)}
                    />
                </div>
            )}
        </div>
    );
}
