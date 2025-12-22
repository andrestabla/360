'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, Unit, User } from '@/lib/data';
import { TreeStructure, Folder, FolderOpen, Plus, Pencil, Trash, UserCircle, CheckCircle, GitFork, UploadSimple } from '@phosphor-icons/react';
import ImportUnitsModal from '@/components/ImportUnitsModal';
import AdminGuide from '@/components/AdminGuide';
import { unitsGuide } from '@/lib/adminGuides';

export default function UnitsPage() {
    const { currentUser, currentTenant, isSuperAdmin, createUnit, updateUnit, deleteUnit } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [formData, setFormData] = useState<Partial<Unit>>({
        name: '',
        code: '',
        parentId: '',
        ownerId: '',
        description: '',
        members: [],
        type: 'UNIT'
    });

    const handleImport = (units: Partial<Unit>[]) => {
        // Import all units
        units.forEach(unit => {
            createUnit(unit);
        });
        setRefreshKey(prev => prev + 1);
    };

    // Get units for current tenant
    const tenantUnits = useMemo(() => {
        if (!currentTenant) return [];
        return DB.units.filter(u => u.tenantId === currentTenant.id);
    }, [currentTenant, refreshKey]);

    // Build hierarchy
    const rootUnits = useMemo(() => tenantUnits.filter(u => !u.parentId || u.parentId === 'ROOT' || u.depth === 0), [tenantUnits]);
    const getChildren = (parentId: string) => tenantUnits.filter(u => u.parentId === parentId);

    // Get eligible users for owner
    const eligibleUsers = useMemo(() => {
        if (!currentTenant) return [];
        return DB.users.filter(u => u.tenantId === currentTenant.id);
    }, [currentTenant]);

    if (!currentUser) return <div className="p-8 text-center text-slate-500">Cargando sesión...</div>;

    if (currentUser.level !== 1) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl m-8">
                <h3 className="font-bold">Acceso Denegado</h3>
                <p className="text-sm">Solo los administradores de tenant pueden gestionar la estructura organizacional.</p>
            </div>
        );
    }

    if (!currentTenant) return <div className="p-8 text-center text-slate-500">Cargando datos de la organización...</div>;

    const handleCreate = (type: 'UNIT' | 'PROCESS', parentId: string = '') => {
        setEditingId(null);
        setFormData({
            name: '',
            code: '',
            parentId: parentId,
            ownerId: '',
            description: '',
            members: [],
            type: type
        });
        setIsModalOpen(true);
    };

    const handleEdit = (unit: Unit) => {
        setEditingId(unit.id);
        setFormData({ ...unit });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta unidad?')) {
            deleteUnit(id);
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate depth
        let depth = 0;
        if (formData.parentId) {
            const parent = tenantUnits.find(u => u.id === formData.parentId);
            if (parent) depth = parent.depth + 1;
        }

        const dataToSave = { ...formData, depth };

        if (editingId) {
            updateUnit(editingId, dataToSave);
        } else {
            createUnit(dataToSave);
        }
        setIsModalOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    // Recursive component for Tree Item
    const UnitItem = ({ unit }: { unit: Unit }) => {
        const children = getChildren(unit.id);
        const [isOpen, setIsOpen] = useState(true);
        const owner = eligibleUsers.find(u => u.id === unit.ownerId);

        return (
            <div className="ml-6 border-l border-slate-200 pl-4 py-2 relative animate-fadeIn">
                {/* Connector line */}
                <div className="absolute top-5 -left-4 w-4 h-[1px] bg-slate-200"></div>

                <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-blue-500">
                            {children.length > 0 ? (isOpen ? <FolderOpen size={20} weight="fill" className="text-blue-200 text-blue-500" /> : <Folder size={20} weight="fill" className="text-blue-300" />) : <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold">{unit.code || 'U'}</div>}
                        </button>
                        <div>
                            <div className="font-bold text-slate-700 text-sm">{unit.name}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                {unit.code && <span className="bg-slate-50 px-1 rounded border border-slate-100">{unit.code}</span>}
                                {owner && <span className="flex items-center gap-1 text-slate-500"><UserCircle /> {owner.name}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleCreate('UNIT', unit.id)} className="p-1.5 hover:bg-green-50 text-green-600 rounded" title="Agregar sub-unidad">
                            <Plus />
                        </button>
                        <button onClick={() => handleCreate('PROCESS', unit.id)} className="p-1.5 hover:bg-purple-50 text-purple-600 rounded" title="Agregar Proceso">
                            <GitFork />
                        </button>
                        <button onClick={() => handleEdit(unit)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Editar">
                            <Pencil />
                        </button>
                        <button onClick={() => handleDelete(unit.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Eliminar">
                            <Trash />
                        </button>
                    </div>
                </div>

                {isOpen && children.length > 0 && (
                    <div className="space-y-1">
                        {children.map(child => <UnitItem key={child.id} unit={child} />)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <TreeStructure className="text-blue-600" /> Estructura Organizacional
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Define y gestiona las áreas y departamentos de {currentTenant.name}.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 shadow-lg"
                    >
                        <UploadSimple weight="bold" /> Importar CSV
                    </button>
                    <button onClick={() => handleCreate('UNIT')} className="btn btn-primary flex items-center gap-2">
                        <Plus weight="bold" /> Nueva Área Raíz
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 min-h-[400px]">
                {rootUnits.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <TreeStructure size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No hay unidades definidas.</p>
                        <button onClick={() => handleCreate('UNIT')} className="text-blue-600 text-sm hover:underline mt-2">Crear la primera unidad</button>
                    </div>
                ) : (
                    <div className="-ml-6">
                        {rootUnits.map(unit => <UnitItem key={unit.id} unit={unit} />)}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">
                                {editingId ? 'Editar' : 'Crear'} {formData.type === 'PROCESS' ? 'Proceso' : 'Unidad'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    {formData.type === 'PROCESS' ? 'Nombre del Proceso' : 'Nombre Unidad / Área'}
                                </label>
                                <input
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={formData.type === 'PROCESS' ? "Ej. Gestión de Talento" : "Ej. Recursos Humanos"}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Código (Opcional)</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                        value={formData.code || ''}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="Ej. TH"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        {formData.type === 'PROCESS' ? 'Unidad Responsable' : 'Unidad Padre'}
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                        value={formData.parentId || ''}
                                        onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                                    >
                                        <option value="">(Raíz)</option>
                                        {tenantUnits.filter(u => u.id !== editingId).map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    {formData.type === 'PROCESS' ? 'Líder del Proceso (Owner)' : 'Jefe de Área (Owner)'}
                                </label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                    value={formData.ownerId || ''}
                                    onChange={e => setFormData({ ...formData, ownerId: e.target.value })}
                                >
                                    <option value="">Seleccionar responsable...</option>
                                    {eligibleUsers.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1">El owner tendrá permisos extendidos.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">
                                    {formData.type === 'PROCESS' ? 'Objetivo / Descripción' : 'Descripción de la Unidad'}
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all resize-none"
                                    rows={3}
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe el propósito o alcance..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Otros Miembros del Equipo</label>
                                <div className="border rounded-lg p-2 max-h-32 overflow-y-auto bg-slate-50">
                                    {eligibleUsers.filter(u => u.id !== formData.ownerId).map(u => (
                                        <label key={u.id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.members?.includes(u.id) || false}
                                                onChange={e => {
                                                    const current = formData.members || [];
                                                    if (e.target.checked) setFormData({ ...formData, members: [...current, u.id] });
                                                    else setFormData({ ...formData, members: current.filter(id => id !== u.id) });
                                                }}
                                                className="rounded text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-slate-700">{u.name}</span>
                                        </label>
                                    ))}
                                    {eligibleUsers.length === 0 && <span className="text-xs text-slate-400 p-2">No hay usuarios disponibles.</span>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-lg shadow-blue-500/20">
                                    {editingId ? 'Guardar Cambios' : (formData.type === 'PROCESS' ? 'Crear Proceso' : 'Crear Unidad')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            <ImportUnitsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
                tenantId={currentTenant.id}
            />

            {/* Admin Guide */}
            <AdminGuide {...unitsGuide as any} />
        </div>
    );
}
