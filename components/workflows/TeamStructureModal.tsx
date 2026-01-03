
import React, { useState } from 'react';
import { X, User as UserIcon, CaretDown, CaretRight, Users } from '@phosphor-icons/react';
import { Project, User, ProjectPhase } from '@/lib/data';
import { DB } from '@/lib/data';

interface TeamStructureModalProps {
    project: Project;
    phases: ProjectPhase[];
    onClose: () => void;
}

import { getUsersAction } from '@/app/lib/repositoryActions';

export function TeamStructureModal({ project, phases, onClose }: TeamStructureModalProps) {
    const [expandedPhases, setExpandedPhases] = useState<string[]>(phases.map(p => p.id));
    const [users, setUsers] = useState<any[]>(DB.users || []);

    React.useEffect(() => {
        getUsersAction().then(res => {
            if (res.success && res.data) {
                setUsers(res.data);
            }
        });
    }, []);

    const togglePhase = (phaseId: string) => {
        setExpandedPhases(prev =>
            prev.includes(phaseId) ? prev.filter(id => id !== phaseId) : [...prev, phaseId]
        );
    };

    const getUser = (userId: string | { userId: string, role?: string }): User | undefined => {
        const id = typeof userId === 'string' ? userId : userId.userId;
        const u = users.find(u => u.id === id);
        // Fallback to mock DB if not found in real DB (hybrid mode during migration)
        return u || DB.users.find(u => u.id === id);
    };

    const getRole = (userId: string | { userId: string, role?: string }): string => {
        return typeof userId === 'string' ? 'Miembro' : (userId.role || 'Miembro');
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-[1px] flex items-center justify-center p-8">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center shrink-0 bg-slate-50 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        <h4 className="font-bold text-lg text-slate-800">Equipo del Proyecto</h4>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                </div>

                <div className="p-6 overflow-y-auto min-h-0 bg-slate-50/50">
                    {/* Project Level Members */}
                    <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Líderes y Miembros del Proyecto
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {project.participants.map((p, idx) => {
                                const user = getUser(p);
                                if (!user) return null;
                                return (
                                    <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {user.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500">{getRole(p)} • {user.unit}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {project.participants.length === 0 && (
                                <p className="text-sm text-slate-400 italic">No hay miembros asignados directamente al proyecto.</p>
                            )}
                        </div>
                    </div>

                    {/* Breakdown by Phase/Activity */}
                    <div className="space-y-4">
                        <h5 className="text-sm font-bold text-slate-700 mb-2 px-1">Desglose por Actividad</h5>
                        {phases.map(phase => (
                            <div key={phase.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div
                                    className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => togglePhase(phase.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        {expandedPhases.includes(phase.id) ? <CaretDown size={14} /> : <CaretRight size={14} />}
                                        <span className="font-bold text-slate-700 text-sm">{phase.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium bg-slate-200 px-2 py-0.5 rounded-full">
                                        {phase.activities.length} Actividades
                                    </span>
                                </div>

                                {expandedPhases.includes(phase.id) && (
                                    <div className="divide-y divide-slate-100">
                                        {phase.activities.map(activity => (
                                            <div key={activity.id} className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{activity.name}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {activity.startDate || 'Sin inicio'} - {activity.endDate || 'Sin fin'}
                                                        </p>
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${activity.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                        activity.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {activity.status === 'IN_PROGRESS' ? 'En Progreso' :
                                                            activity.status === 'COMPLETED' ? 'Completada' : 'Sin Iniciar'}
                                                    </span>
                                                </div>

                                                {activity.participants && activity.participants.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {activity.participants.map((p, idx) => {
                                                            const user = getUser(p);
                                                            if (!user) return null;
                                                            return (
                                                                <div key={idx} className="flex items-center gap-2 bg-blue-50 pl-1 pr-3 py-1 rounded-full border border-blue-100">
                                                                    <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                                                        {user.initials}
                                                                    </div>
                                                                    <span className="text-xs font-medium text-blue-900">{user.name}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic flex items-center gap-1">
                                                        <UserIcon size={14} /> Sin asignaciones
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        {phase.activities.length === 0 && (
                                            <div className="p-4 text-center text-sm text-slate-400">No hay actividades en esta fase.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
