'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, User, Unit } from '@/lib/data';
import { Users, Plus, Pencil, Trash, MagnifyingGlass, UserCircle, Buildings, ShieldCheck, ClockCounterClockwise, Key, Envelope, List } from '@phosphor-icons/react';
import ImportUsersModal from '@/components/ImportUsersModal';
import AdminGuide from '@/components/AdminGuide';
import { usersGuide } from '@/lib/adminGuides';

const LEVELS = [
    { level: 1, label: 'Nivel 1 (Admin Tenant)' },
    { level: 2, label: 'Nivel 2 (Jefe Área)' },
    { level: 3, label: 'Nivel 3 (Analista Sr)' },
    { level: 4, label: 'Nivel 4 (Analista Jr)' },
    { level: 5, label: 'Nivel 5 (Asistente)' },
    { level: 6, label: 'Nivel 6 (Operativo)' },
];

export default function UsersPage() {
    const { currentUser, currentTenant, adminCreateUser, adminUpdateUser, adminDeleteUser, adminResendInvite, isSuperAdmin, adminCheckEmailUnique } = useApp();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'security' | 'logs'>('details');
    const [filterUnit, setFilterUnit] = useState('');
    const [filterLevel, setFilterLevel] = useState('');

    const [formData, setFormData] = useState<Partial<User> & { password?: string, passwordMode?: 'auto' | 'manual', mustChangePassword?: boolean, tenantId?: string }>({
        name: '',
        email: '',
        jobTitle: '',
        level: 6,
        unit: '',
        status: 'ACTIVE',
        passwordMode: 'auto',
        password: '',
        mustChangePassword: true,
        tenantId: ''
    });

    // Super Admin: Global Tenant Filter
    const [filterTenantId, setFilterTenantId] = useState('ALL');
    const { currentTenant: actualCurrentTenant } = useApp();

    // Determine effective scope
    // If SuperAuth, we use filterTenantId. If strict tenant admin, we use actualCurrentTenant.id
    const effectiveTenantId = isSuperAdmin ? (filterTenantId === 'ALL' ? null : filterTenantId) : actualCurrentTenant?.id;

    // Get units based on selection
    // Get units based on selection in FORM or Filter
    const formTenantId = formData.tenantId || (isSuperAdmin ? filterTenantId : actualCurrentTenant?.id);

    const tenantUnits = useMemo(() => {
        // If creating/editing, use the form's selected tenant
        const targetTenant = formTenantId === 'ALL' ? null : formTenantId;

        if (targetTenant && targetTenant !== 'global') {
            return DB.units.filter(u => u.tenantId === targetTenant);
        }
        return [];
    }, [formTenantId]);

    // Get users
    const tenantUsers = useMemo(() => {
        return DB.users.filter(u => {
            // 1. Tenant Scope
            let matchesTenant = true;
            if (isSuperAdmin) {
                if (filterTenantId !== 'ALL') matchesTenant = u.tenantId === filterTenantId;
            } else {
                if (!actualCurrentTenant) return false;
                matchesTenant = u.tenantId === actualCurrentTenant.id;
            }

            const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase()); // Added email search

            const matchesUnit = filterUnit ? u.unit === filterUnit : true;
            const matchesLevel = filterLevel ? u.level === Number(filterLevel) : true;

            return matchesTenant && matchesSearch && matchesUnit && matchesLevel;
        });
    }, [actualCurrentTenant, isSuperAdmin, filterTenantId, search, refreshKey, filterUnit, filterLevel]);

    // Get logs for editing user
    const logs = useMemo(() => {
        if (!editingId) return [];
        return DB.platformAudit.filter(log => log.target_user_id === editingId || log.actor_id === editingId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 50);
    }, [editingId, refreshKey]);

    // Access Control: Allow if SuperAdmin OR if Tenant Admin (Level 1)
    if (!isSuperAdmin && (!currentUser || currentUser.level !== 1)) {
        return <div className="p-8 text-center text-red-500">Acceso Denegado. Solo Admin Tenant.</div>;
    }

    if (!currentUser) return <div>Loading...</div>; // Allow render if SuperAdmin even without currentTenant context
    const displayTenantName = isSuperAdmin ? (filterTenantId === 'ALL' ? 'Todos los Tenants' : DB.tenants.find(t => t.id === filterTenantId)?.name) : currentTenant?.name;

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            email: '',
            jobTitle: '',
            level: 6,
            unit: '',
            status: 'ACTIVE',
            passwordMode: 'auto',
            password: '',
            mustChangePassword: true,
            tenantId: isSuperAdmin ? (filterTenantId === 'ALL' ? '' : filterTenantId) : currentTenant?.id
        });
        setActiveTab('details');
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        const unitId = tenantUnits.find(u => u.name === user.unit)?.id || ''; // Try to match name or keep empty if mismatch
        setFormData({
            name: user.name,
            email: user.email || '',
            jobTitle: user.jobTitle,
            level: user.level,
            unit: user.unit, // We store Unit Name in User model currently, not ID. Legacy issue.
            status: user.status,
            mustChangePassword: user.mustChangePassword,
            tenantId: user.tenantId
        });
        setActiveTab('details');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            adminDeleteUser(id);
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleResendInvite = () => {
        if (!editingId) return;
        if (confirm(`¿Reenviar credenciales de acceso a ${formData.email}?`)) {
            adminResendInvite(editingId);
            alert('Credenciales enviadas correctamente.');
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check for unique email
        if (!editingId && formData.email) {
            if (!adminCheckEmailUnique(formData.email)) {
                alert('El correo electrónico ya está registrado.');
                return;
            }
        }

        // Validate password if manual
        if (!editingId && formData.passwordMode === 'manual' && !formData.password) {
            alert('Por favor, ingresa una contraseña manual.');
            return;
        }

        // Map level to role name for display
        // Map level to role name for display
        let roleName = LEVELS.find(l => l.level === Number(formData.level))?.label.split('(')[1].replace(')', '') || 'Usuario';

        // Special Case: Global Admin
        if (formData.tenantId === 'global') {
            roleName = 'Super Admin';
        }

        const { password, passwordMode, ...userData } = formData;
        const dataToSave = { ...userData, role: roleName };

        if (editingId) {
            adminUpdateUser(editingId, dataToSave);
        } else {
            console.log(`[Notification System] Creating user ${formData.email} with role ${roleName}`);
            adminCreateUser(dataToSave, {
                sendNotification: formData.passwordMode === 'auto',
                customPassword: formData.passwordMode === 'manual' ? formData.password : undefined
            });
            alert(`Usuario creado exitosamente. ${formData.passwordMode === 'auto' ? 'Se envió invitación por correo.' : 'Contraseña asignada manualmente.'}`);
        }
        setIsModalOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-blue-600" /> Gestión de Usuarios
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Administra el talento humano de {displayTenantName}.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsImportModalOpen(true)} className="btn btn-secondary flex items-center gap-2">
                        Importar CSV
                    </button>
                    <button onClick={handleCreate} className="btn btn-primary flex items-center gap-2">
                        <Plus weight="bold" /> Invitar Usuario
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-2 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500/10"
                            placeholder="Buscar por nombre o cargo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Super Admin: Tenant Filter */}
                    {isSuperAdmin && (
                        <select
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 ring-blue-500/10 font-bold text-blue-800"
                            value={filterTenantId}
                            onChange={e => { setFilterTenantId(e.target.value); setFilterUnit(''); }} // Reset unit filter on tenant change
                        >
                            <option value="ALL">🏢 Global (Todos)</option>
                            {DB.tenants.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    )}
                    <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 ring-blue-500/10"
                        value={filterUnit}
                        onChange={e => setFilterUnit(e.target.value)}
                    >
                        <option value="">Todas las Unidades</option>
                        {tenantUnits.map(u => (
                            <option key={u.id} value={u.name}>{u.name}</option>
                        ))}
                    </select>
                    <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 ring-blue-500/10"
                        value={filterLevel}
                        onChange={e => setFilterLevel(e.target.value)}
                    >
                        <option value="">Todos los Niveles</option>
                        {LEVELS.map(l => (
                            <option key={l.level} value={l.level}>{l.label}</option>
                        ))}
                    </select>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Rol / Nivel</th>
                            <th className="px-6 py-4">Unidad</th>
                            {isSuperAdmin && filterTenantId === 'ALL' && <th className="px-6 py-4">Tenant</th>}
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tenantUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {user.initials}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.jobTitle}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        Nivel {user.level} - {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.unit ? (
                                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                                            <Buildings size={14} /> {user.unit}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 italic">Sin asignar</span>
                                    )}
                                </td>
                                {isSuperAdmin && filterTenantId === 'ALL' && (
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded ${user.tenantId === 'global' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {user.tenantId === 'global' ? '🌎 Global' : (DB.tenants.find(t => t.id === user.tenantId)?.name || 'N/A')}
                                        </span>
                                    </td>
                                )}
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                                        user.status === 'SUSPENDED' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {user.status === 'ACTIVE' ? 'Activo' : user.status === 'SUSPENDED' ? 'Suspendido' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => handleEdit(user)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded" title="Editar">
                                            <Pencil />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Eliminar">
                                            <Trash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Editar Usuario' : 'Invitar Usuario'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>

                        {/* Tabs */}
                        {editingId && (
                            <div className="flex border-b border-slate-100 px-6 gap-6">
                                <button onClick={() => setActiveTab('details')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    Detalles
                                </button>
                                <button onClick={() => setActiveTab('security')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    Seguridad & Acceso
                                </button>
                                <button onClick={() => setActiveTab('logs')} className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                    Actividad
                                </button>
                            </div>
                        )}

                        <div className="p-6 h-[450px] overflow-y-auto">
                            {activeTab === 'details' && (
                                <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre Completo</label>
                                            <input
                                                required
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ej. Juan Pérez"
                                            />
                                        </div>

                                        {/* Super Admin: Tenant Selector takes 2nd slot if present, else Status */}
                                        {isSuperAdmin ? (
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Organización / Tenant</label>
                                                <select
                                                    className={`w-full px-3 py-2 border rounded-lg bg-white ${formData.tenantId === 'global' ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50' : ''}`}
                                                    value={formData.tenantId}
                                                    onChange={e => setFormData({ ...formData, tenantId: e.target.value, unit: '' })}
                                                    disabled={!!editingId}
                                                >
                                                    <option value="" disabled>Seleccionar...</option>
                                                    <option value="global">🌎 Global System (Super Admin)</option>
                                                    {DB.tenants.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                                {formData.tenantId === 'global' && (
                                                    <p className="text-[10px] text-purple-600 mt-1 font-bold">⚠️ Este usuario tendrá acceso total a la plataforma.</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
                                                <select
                                                    className="w-full px-3 py-2 border rounded-lg bg-white"
                                                    value={formData.status}
                                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                                >
                                                    <option value="ACTIVE">Activo</option>
                                                    <option value="PENDING_INVITE">Pendiente</option>
                                                    <option value="SUSPENDED">Suspendido</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* If Super Admin, show Status in a separate row or new grid */}
                                    {isSuperAdmin && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                            >
                                                <option value="ACTIVE">Activo</option>
                                                <option value="PENDING_INVITE">Pendiente</option>
                                                <option value="SUSPENDED">Suspendido</option>
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email Corporativo</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="usuario@empresa.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Cargo / Puesto</label>
                                        <input
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                            value={formData.jobTitle}
                                            onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                            placeholder="Ej. Analista Senior"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Capa / Nivel</label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                                value={formData.level}
                                                onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
                                                disabled={formData.tenantId === 'global'}
                                            >
                                                {formData.tenantId === 'global' ? (
                                                    <option value="1">Nivel Global (Super Admin)</option>
                                                ) : (
                                                    LEVELS.map(l => (
                                                        <option key={l.level} value={l.level}>{l.label}</option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Unidad Org.</label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                                value={formData.unit || ''}
                                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                            >
                                                <option value="">(Sin asignar)</option>
                                                {tenantUnits.map(u => (
                                                    <option key={u.id} value={u.name}>{u.name}</option>
                                                ))}
                                            </select>
                                            {formData.tenantId === 'global' && <p className="text-[10px] text-slate-400 mt-1">Global no tiene unidades.</p>}
                                        </div>
                                    </div>

                                    {!editingId && (
                                        <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4">
                                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                                <UserCircle size={16} className="text-blue-600" /> Configuración de Acceso
                                            </h4>

                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="pwdMode"
                                                        checked={formData.passwordMode === 'auto'}
                                                        onChange={() => setFormData({ ...formData, passwordMode: 'auto' })}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Auto-generar y enviar</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="pwdMode"
                                                        checked={formData.passwordMode === 'manual'}
                                                        onChange={() => setFormData({ ...formData, passwordMode: 'manual' })}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Asignar manual</span>
                                                </label>
                                            </div>

                                            {formData.passwordMode === 'manual' && (
                                                <div className="animate-fadeIn">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contraseña Manual</label>
                                                    <input
                                                        type="password"
                                                        required={formData.passwordMode === 'manual'}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                                        value={formData.password}
                                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                        placeholder="Mínimo 8 caracteres"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                        <h4 className="flex items-center gap-2 font-bold text-orange-800 text-sm mb-2">
                                            <Envelope size={18} /> Comunicación
                                        </h4>
                                        <p className="text-xs text-orange-700 mb-3">
                                            Envía un correo electrónico al usuario con instrucciones para restablecer su acceso.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleResendInvite}
                                            className="bg-white border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-colors shadow-sm"
                                        >
                                            Reenviar Credenciales
                                        </button>
                                    </div>

                                    <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                                        <div className="border-t border-slate-100 pt-4">
                                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                    checked={formData.mustChangePassword}
                                                    onChange={e => setFormData({ ...formData, mustChangePassword: e.target.checked })}
                                                />
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-800">Forzar cambio de contraseña</div>
                                                    <div className="text-xs text-slate-500">El usuario deberá actualizar su clave en el próximo inicio de sesión.</div>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="border-t border-slate-100 pt-4">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                                <Key size={14} /> Asignación Manual de Contraseña
                                            </h4>
                                            <div className="space-y-3">
                                                <input
                                                    type="password"
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all text-sm"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="Nueva contraseña (dejar vacío si no desea cambiar)"
                                                />
                                                <p className="text-[10px] text-slate-400">
                                                    Escribe aquí solo si deseas sobrescribir la contraseña actual del usuario manualmente.
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'logs' && (
                                <div className="space-y-4">
                                    {logs.length === 0 ? (
                                        <div className="text-center py-10 text-slate-400 text-sm">
                                            No hay actividad registrada recientemente.
                                        </div>
                                    ) : (
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="border-b border-slate-100 text-slate-500">
                                                    <th className="py-2">Evento</th>
                                                    <th className="py-2">Fecha</th>
                                                    <th className="py-2">Detalle</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {logs.map((log) => (
                                                    <tr key={log.id} className="hover:bg-slate-50">
                                                        <td className="py-2 font-medium text-slate-700">{log.event_type}</td>
                                                        <td className="py-2 text-slate-500">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </td>
                                                        <td className="py-2 text-slate-500 max-w-[150px] truncate" title={JSON.stringify(log.metadata)}>
                                                            {log.metadata?.changes ? log.metadata.changes.join(', ') : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                            {activeTab !== 'logs' && (
                                <button form="userForm" type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-lg shadow-blue-500/20">
                                    {editingId ? 'Guardar Cambios' : 'Enviar Invitación'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            <ImportUsersModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={(users) => {
                    // Import users
                    users.forEach(user => {
                        adminCreateUser(user, { sendNotification: false });
                    });
                    setIsImportModalOpen(false);
                    setRefreshKey(prev => prev + 1);
                }}
                tenantId={isSuperAdmin ? (filterTenantId === 'ALL' ? 'global' : filterTenantId) : (currentTenant?.id || 'global')}
            />

            {/* Admin Guide */}
            <AdminGuide {...usersGuide} />

        </div >
    );
}
