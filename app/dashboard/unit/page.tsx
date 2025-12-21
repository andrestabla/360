'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, WorkflowDefinition, User } from '@/lib/data';
import {
    Users, Folder, FileText, Plus, MagnifyingGlass,
    CaretRight, SquaresFour, ArrowRight, UserCircle, CheckCircle
} from '@phosphor-icons/react';

export default function UnitPage() {
    const { currentUser, currentTenant, adminCreateWorkflow } = useApp();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'processes' | 'team'>('processes');

    // 1. Resolve My Unit
    const myUnit = useMemo(() => {
        if (!currentUser || !currentTenant) return null;
        // Try to find Unit Object by Name (Legacy link)
        return DB.units.find(u => u.tenantId === currentTenant.id && u.name === currentUser.unit);
    }, [currentUser, currentTenant]);

    // 2. Fetch Data
    const { subUnits, teamMembers, unitProcesses } = useMemo(() => {
        if (!currentUser || !currentTenant) return { subUnits: [], teamMembers: [], unitProcesses: [] };

        const unitName = currentUser.unit;

        // Members
        const members = DB.users.filter(u =>
            u.tenantId === currentTenant.id &&
            u.unit === unitName
        );

        // Processes (Workflows) defined for this unit
        const processes = DB.workflowDefinitions.filter(w =>
            w.tenantId === currentTenant.id &&
            w.unit === unitName
        );

        // Sub-units (Only if we found the structural Unit object)
        const subs = myUnit
            ? DB.units.filter(u => u.parentId === myUnit.id)
            : [];

        return { subUnits: subs, teamMembers: members, unitProcesses: processes };
    }, [currentUser, currentTenant, myUnit]);

    if (!currentUser) return <div>Cargando...</div>;

    return (
        <div className="max-w-7xl mx-auto p-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Mi Unidad: {currentUser.unit}</h1>
                    <p className="text-slate-500">Gestiona tu equipo, procesos y sub-áreas desde un solo lugar.</p>
                </div>
                {activeTab === 'processes' && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <Plus weight="bold" /> Nuevo Proceso
                    </button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-slate-200 mb-8">
                <button
                    onClick={() => setActiveTab('processes')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'processes' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Procesos y Sub-áreas
                    {activeTab === 'processes' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'team' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Colaboradores ({teamMembers.length})
                    {activeTab === 'team' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>}
                </button>
            </div>

            {/* CONTENT: PROCESSES */}
            {activeTab === 'processes' && (
                <div className="space-y-8 animate-slideUp">

                    {/* Sub Areas Section */}
                    {subUnits.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <SquaresFour /> Sub-áreas Dependientes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {subUnits.map(unit => (
                                    <div key={unit.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Folder weight="duotone" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{unit.name}</h4>
                                                <span className="text-[10px] text-slate-500">{unit.code || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Processes Section */}
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FileText /> Procesos Definidos
                        </h3>
                        {unitProcesses.length === 0 ? (
                            <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-10 text-center">
                                <FileText className="mx-auto text-slate-300 mb-3" size={48} />
                                <h4 className="text-slate-600 font-bold mb-1">No hay procesos definidos</h4>
                                <p className="text-sm text-slate-400 mb-4">Crea el primer flujo de trabajo para tu unidad.</p>
                                <button onClick={() => setIsCreateModalOpen(true)} className="text-blue-600 font-bold text-sm hover:underline">Crear Proceso</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {unitProcesses.map(proc => {
                                    const owner = teamMembers.find(m => m.id === proc.ownerId);
                                    return (
                                        <div key={proc.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-full">
                                                    <CaretRight weight="bold" />
                                                </button>
                                            </div>
                                            <div className="mb-4">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                                                    SLA: {proc.slaHours}h
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-1">{proc.title}</h3>
                                            <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{proc.description}</p>

                                            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                                {owner ? (
                                                    <>
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                            {owner.initials}
                                                        </div>
                                                        <span className="text-xs text-slate-600 truncate">Resp: {owner.name}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Sin responsable asignado</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* CONTENT: TEAM */}
            {activeTab === 'team' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
                    {teamMembers.map(member => (
                        <div key={member.id} className="bg-white p-5 rounded-xl border border-slate-200 flex items-start gap-4 hover:border-blue-200 transition-all">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
                                {member.initials}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900">{member.name}</h4>
                                <p className="text-xs text-blue-600 font-medium mb-1">{member.jobTitle}</p>
                                <p className="text-xs text-slate-500 mb-3">{member.email}</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                                        Nivel {member.level}
                                    </span>
                                    {member.status === 'ACTIVE' && (
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-medium border border-emerald-100 flex items-center gap-1">
                                            <CheckCircle weight="fill" size={10} /> Activo
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL: CREATE PROCESS */}
            {isCreateModalOpen && (
                <CreateProcessModal
                    onClose={() => setIsCreateModalOpen(false)}
                    unitName={currentUser.unit}
                    teamMembers={teamMembers}
                    onCreate={adminCreateWorkflow}
                />
            )}
        </div>
    );
}

function CreateProcessModal({ onClose, unitName, teamMembers, onCreate }: any) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        slaHours: 24,
        ownerId: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate({
            ...formData,
            unit: unitName,
            icon: 'FileText',
            active: true,
            schema: {}
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Crear Nuevo Proceso</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre del Proceso</label>
                        <input
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej. Solicitud de Vacaciones"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Descripción</label>
                        <textarea
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all h-24 resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Breve descripción del objetivo del proceso..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">SLA (Horas)</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                value={formData.slaHours}
                                onChange={e => setFormData({ ...formData, slaHours: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Asignar Responsable</label>
                            <div className="relative">
                                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all text-sm"
                                    value={formData.ownerId}
                                    onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
                                >
                                    <option value="">Seleccionar...</option>
                                    {teamMembers.map((m: User) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 bg-blue-50 text-blue-600 p-3 rounded-lg border border-blue-100">
                        * El responsable asignado será el encargado de gestionar y configurar este proceso.
                    </p>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold shadow-lg shadow-blue-500/20">
                            Crear Proceso
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
