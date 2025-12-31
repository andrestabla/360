import { useState, useMemo, useEffect } from 'react';
import { Project, ProjectPhase, ProjectActivity, DB, User, Doc, ProjectFolder } from '@/lib/data';
import {
    X, FloppyDisk, Plus, Trash, Calendar, User as UserIcon,
    FileText, CaretDown, CaretRight, Check, XCircle,
    Paperclip, MagnifyingGlass, Folder, Kanban, PencilSimple
} from '@phosphor-icons/react';
import { useApp } from '@/context/AppContext';

interface ProjectDetailDrawerProps {
    project: Project;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Project>) => void;
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

export default function ProjectDetailDrawer({ project, onClose, onUpdate }: ProjectDetailDrawerProps) {
    const { currentUser } = useApp();

    // Toggle Edit Mode
    const [isEditing, setIsEditing] = useState(false);

    // Local state for editing (buffered)
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description || '');
    const [folderId, setFolderId] = useState(project.folderId || '');
    const [color, setColor] = useState(project.color || '#3b82f6');
    const [startDate, setStartDate] = useState(project.startDate?.split('T')[0] || '');
    const [endDate, setEndDate] = useState(project.endDate?.split('T')[0] || '');
    const [phases, setPhases] = useState<ProjectPhase[]>(project.phases || []);

    // Modals state
    const [showUserPicker, setShowUserPicker] = useState<{ active: boolean; phaseId?: string; activityId?: string }>({ active: false });
    const [showDocPicker, setShowDocPicker] = useState<{ active: boolean; phaseId?: string; activityId?: string }>({ active: false });

    // Search states for pickers
    const [userSearch, setUserSearch] = useState('');
    const [docSearch, setDocSearch] = useState('');

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
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));

        onUpdate(project.id, {
            title,
            description,
            folderId,
            color,
            startDate,
            endDate,
            phases
        });
        setIsSaving(false);
        setIsEditing(false); // Exit edit mode on save
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
                id: `act-${Date.now()}`,
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
        setShowUserPicker({ active: false });
    };

    const handleAddDoc = (doc: Doc) => {
        if (!showDocPicker.phaseId || !showDocPicker.activityId) return;

        setPhases(prev => prev.map(p => {
            if (p.id !== showDocPicker.phaseId) return p;
            return {
                ...p,
                activities: p.activities.map(a => {
                    if (a.id !== showDocPicker.activityId) return a;

                    return {
                        ...a,
                        documents: [...a.documents, {
                            id: doc.id,
                            name: doc.title,
                            type: doc.type,
                            url: '/dashboard/repository?docId=' + doc.id // Simple link
                        }]
                    };
                })
            };
        }));
        setShowDocPicker({ active: false });
    };


    return (
        <div className="w-[800px] bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full animate-slideLeft z-30 fixed right-0 top-0 bottom-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                {isEditing ? (
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-xl font-bold text-slate-900 bg-transparent border-none focus:ring-0 w-full"
                    />
                ) : (
                    <h2 className="text-xl font-bold text-slate-900 truncate pr-4">{title}</h2>
                )}

                <div className="flex gap-2 shrink-0">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FloppyDisk size={18} weight="fill" />}
                            Guardar
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all"
                        >
                            <PencilSimple size={18} weight="fill" />
                            Editar
                        </button>
                    )}

                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
                        <XCircle size={24} weight="fill" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white">

                {/* General Info */}
                <div className="grid gap-6 mb-8">
                    <div className="space-y-1">
                        {isEditing ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Descripción del proyecto..."
                                rows={2}
                                className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-blue-400 resize-none"
                            />
                        ) : (
                            <p className="text-sm text-slate-600">{description || 'Sin descripción'}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Carpeta</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Folder size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <select
                                        value={folderId}
                                        onChange={(e) => setFolderId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-none focus:border-blue-400"
                                    >
                                        <option value="">-- Sin Carpeta (Raíz) --</option>
                                        {DB.projectFolders.map(f => (
                                            <option key={f.id} value={f.id}>{f.name} {f.parentId ? '(Sub-carpeta)' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                    <Folder size={18} className="text-slate-400" />
                                    {DB.projectFolders.find(f => f.id === folderId)?.name || 'Raíz'}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Color de Tarjeta</label>
                            {isEditing ? (
                                <div className="flex gap-2 py-1">
                                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#64748b'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-6 h-6 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Inicio</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                                />
                            ) : (
                                <p className="text-sm text-slate-700 font-medium">{startDate || '-'}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Fin</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
                                />
                            ) : (
                                <p className="text-sm text-slate-700 font-medium">{endDate || '-'}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span>Progreso Total</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: color }}></div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 my-8"></div>

                {/* Structure */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-sm text-slate-500 uppercase flex items-center gap-2">
                        <Kanban size={18} /> Estructura del Proyecto
                    </h3>
                    {isEditing && (
                        <button
                            onClick={addPhase}
                            className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors"
                        >
                            <Plus weight="bold" /> Agregar Fase
                        </button>
                    )}
                </div>

                <div className="space-y-6 pb-20">
                    {phases.map((phase, pIndex) => (
                        <div key={phase.id} className="bg-slate-50 rounded-xl p-1 border border-transparent hover:border-slate-200 transition-colors group/phase">
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-6 h-6 rounded bg-white text-slate-500 flex items-center justify-center font-bold text-xs shadow-sm shadow-slate-200">
                                    {pIndex + 1}
                                </div>
                                {isEditing ? (
                                    <input
                                        className="bg-transparent font-bold text-slate-700 flex-1 border-none focus:ring-0 p-0 text-sm focus:bg-white focus:px-2 focus:py-1 rounded transition-all"
                                        value={phase.name}
                                        onChange={(e) => updatePhaseName(phase.id, e.target.value)}
                                    />
                                ) : (
                                    <h4 className="font-bold text-slate-700 flex-1 text-sm">{phase.name}</h4>
                                )}

                                <div className="text-xs text-slate-400 mr-2">{phase.activities?.length || 0} Actividades</div>

                                {isEditing && (
                                    <button onClick={() => deletePhase(phase.id)} className="text-slate-300 hover:text-red-500">
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Activities Container */}
                            <div className="ml-9 pr-3 pb-3 space-y-3">
                                {phase.activities?.map((act) => (
                                    <div key={act.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            {isEditing ? (
                                                <input
                                                    className="font-bold text-slate-800 text-sm border-none focus:ring-0 p-0 w-full"
                                                    value={act.name}
                                                    onChange={(e) => updateActivity(phase.id, act.id, { name: e.target.value })}
                                                />
                                            ) : (
                                                <h5 className="font-bold text-slate-800 text-sm w-full">{act.name}</h5>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={act.status}
                                                    onChange={(e) => updateActivity(phase.id, act.id, { status: e.target.value })}
                                                    // Status is always editable? Probably yes, to update progress without full edit mode
                                                    // User Requirement: "Verificar estados de la actividad" implies checking them.
                                                    // But typically status is updated frequently. I will keep it enabled always for now, 
                                                    // or enable it only in Edit mode. 
                                                    // Request says: "Al dar clic sobre la tarjeta del proyecto, mostrar side con opción de "Editar". Al dar clic sobre "Editar" cambia opción a "Guardar"".
                                                    // This usually implies view-only default. 
                                                    // However, updating Status is a "Task execution" action, not necessarily "Configuration/Editing". 
                                                    // I will allow status update ALWAYS because it's the main interaction.
                                                    className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border-slate-200 bg-slate-50 text-slate-600 cursor-pointer min-w-[120px]`}
                                                >
                                                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                                        <option key={key} value={key}>{label}</option>
                                                    ))}
                                                </select>

                                                {isEditing && (
                                                    <button onClick={() => deleteActivity(phase.id, act.id)} className="text-slate-300 hover:text-red-500">
                                                        <Trash size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 border rounded p-1.5 px-3 bg-slate-50">
                                                <Calendar size={14} className="text-slate-400" />
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        value={act.startDate?.split('T')[0] || ''}
                                                        onChange={(e) => updateActivity(phase.id, act.id, { startDate: e.target.value })}
                                                        className="text-xs text-slate-600 border-none p-0 focus:ring-0 w-full bg-transparent"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-slate-600">{act.startDate?.split('T')[0] || '-'}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 border rounded p-1.5 px-3 bg-slate-50">
                                                <Calendar size={14} className="text-slate-400" />
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        value={act.endDate?.split('T')[0] || ''}
                                                        onChange={(e) => updateActivity(phase.id, act.id, { endDate: e.target.value })}
                                                        className="text-xs text-slate-600 border-none p-0 focus:ring-0 w-full bg-transparent"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-slate-600">{act.endDate?.split('T')[0] || '-'}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity Footer: Participants & Docs */}
                                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {act.participants?.map((p, i) => {
                                                        const uid = typeof p === 'string' ? p : p.userId;
                                                        // const user = DB.users.find(u => u.id === uid);
                                                        return (
                                                            <div key={i} className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 border border-white flex items-center justify-center text-[10px] font-bold" title={uid}>
                                                                U
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                {/* Allow assigning/attaching always or just in edit? Usually always for easier work. */}
                                                <button
                                                    onClick={() => setShowUserPicker({ active: true, phaseId: phase.id, activityId: act.id })}
                                                    className="text-[10px] font-bold text-blue-500 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1"
                                                >
                                                    <UserIcon /> + Asignar
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {act.documents?.length > 0 && (
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Paperclip size={12} /> {act.documents.length}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => setShowDocPicker({ active: true, phaseId: phase.id, activityId: act.id })}
                                                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 px-2 py-1 rounded flex items-center gap-1"
                                                >
                                                    <Paperclip /> + Adjuntar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isEditing && (
                                    <button
                                        onClick={() => addActivity(phase.id)}
                                        className="w-full border-2 border-dashed border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-400 hover:border-purple-200 hover:text-purple-500 hover:bg-purple-50 transition-all"
                                    >
                                        + Nueva Actividad
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* USER PICKER MODAL */}
            {showUserPicker.active && (
                <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-8">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-200 animate-in zoom-in-95">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h4 className="font-bold text-sm">Agregar Miembro</h4>
                            <button onClick={() => setShowUserPicker({ active: false })}><X size={18} className="text-slate-400" /></button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-3">
                                <MagnifyingGlass className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    autoFocus
                                    placeholder="Buscar por nombre..."
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-400"
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                                {DB.users.filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                                    <div key={u.id} onClick={() => handleAddMember(u)} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer group">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {u.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.role}</p>
                                        </div>
                                        <Plus className="ml-auto text-blue-500 opacity-0 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DOC PICKER MODAL */}
            {showDocPicker.active && (
                <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-8">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-200 animate-in zoom-in-95">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h4 className="font-bold text-sm">Seleccionar Documento</h4>
                            <button onClick={() => setShowDocPicker({ active: false })}><X size={18} className="text-slate-400" /></button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-3">
                                <MagnifyingGlass className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    autoFocus
                                    placeholder="Buscar documento..."
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-400"
                                    value={docSearch}
                                    onChange={e => setDocSearch(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                                {DB.docs.filter(d => !docSearch || d.title.toLowerCase().includes(docSearch.toLowerCase())).map(d => (
                                    <div key={d.id} onClick={() => handleAddDoc(d)} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer group">
                                        <FileText size={24} className="text-blue-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{d.title}</p>
                                            <p className="text-xs text-slate-500">{new Date(d.date || '').toLocaleDateString()}</p>
                                        </div>
                                        <Plus className="text-blue-500 opacity-0 group-hover:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
