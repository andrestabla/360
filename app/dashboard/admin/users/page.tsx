"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { User } from '@/lib/data';
import {
    Users,
    Plus,
    Pencil,
    Trash,
    MagnifyingGlass,
    Sparkle,
    PaperPlaneRight,
    Upload
} from '@phosphor-icons/react';
import { createUserAction, updateUserAction, deleteUserAction, getUsersAction, sendWelcomeEmailAction } from '@/app/lib/userActions';
import { generateSecurePassword } from '@/lib/utils/passwordUtils';
import UserCreatedModal from '@/components/UserCreatedModal';
import ImportUsersModal from '@/components/ImportUsersModal';
import { getUnitsAction } from '@/app/lib/unitActions';

const LEVELS = [
    { level: 1, label: 'Nivel 1 (Administrador)' },
    { level: 2, label: 'Nivel 2 (Gerencia)' },
    { level: 3, label: 'Nivel 3 (Liderazgo)' },
    { level: 4, label: 'Nivel 4 (Especialista)' },
    { level: 5, label: 'Nivel 5 (Asistente)' },
    { level: 6, label: 'Nivel 6 (Operativo)' },
];

export default function UsersPage() {
    const { currentUser, isSuperAdmin, addNotification } = useApp();
    const isAdmin = isSuperAdmin || currentUser?.role?.toLowerCase().includes('admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterUnit, setFilterUnit] = useState<string>('');
    const [filterLevel, setFilterLevel] = useState<number | ''>('');
    const [units, setUnits] = useState<any[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [createdUser, setCreatedUser] = useState<{ email: string; password?: string; emailSent: boolean } | null>(null);

    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        password: '',
        jobTitle: '',
        level: 3,
        status: 'ACTIVE',
        role: 'Usuario'
    });
    const [sendInvitation, setSendInvitation] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'security' | 'activity'>('details');

    const loadUsers = useCallback(async () => {
        setLoading(true);
        const result = await getUsersAction();
        if (result.success && result.data) {
            // Convert database types to User type (dates to strings)
            const convertedUsers: User[] = result.data.map((dbUser: any) => ({
                ...dbUser,
                email: dbUser.email || undefined,
                inviteSentAt: dbUser.inviteSentAt ? dbUser.inviteSentAt.toISOString() : undefined,
                inviteExpiresAt: dbUser.inviteExpiresAt ? dbUser.inviteExpiresAt.toISOString() : undefined,
                emailVerified: dbUser.emailVerified ? dbUser.emailVerified.toISOString() : undefined,
                createdAt: dbUser.createdAt ? dbUser.createdAt.toISOString() : undefined,
                updatedAt: dbUser.updatedAt ? dbUser.updatedAt.toISOString() : undefined,
            }));
            setUsers(convertedUsers);
        } else {
            addNotification({ title: 'Error', message: result.error || 'No se pudieron cargar los usuarios', type: 'error' });
        }
        setLoading(false);
    }, [addNotification]);

    const loadUnits = useCallback(async () => {
        const result = await getUnitsAction();
        if (result.success && result.data) {
            setUnits(result.data);
        }
    }, []);

    useEffect(() => {
        loadUsers();
        loadUnits();
    }, [loadUsers, loadUnits]);

    // Filtering
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
                (u.jobTitle || '').toLowerCase().includes(search.toLowerCase());
            const matchesUnit = !filterUnit || u.unit === filterUnit;
            const matchesLevel = filterLevel === '' || u.level === filterLevel;
            return matchesSearch && matchesUnit && matchesLevel;
        });
    }, [users, search, filterUnit, filterLevel]);

    if (!isAdmin) {
        return <div className="p-8 text-center text-slate-500">Acceso restringido.</div>;
    }

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            jobTitle: '',
            level: 3,
            status: 'ACTIVE',
            role: 'Usuario'
        });
        setSendInvitation(false);
        setActiveTab('details');
        setIsModalOpen(true);
    };

    const handleGeneratePassword = () => {
        const newPassword = generateSecurePassword();
        setFormData({ ...formData, password: newPassword });
    };

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            jobTitle: user.jobTitle,
            level: user.level,
            status: user.status,
            role: user.role,
            mustChangePassword: user.mustChangePassword
        });
        setActiveTab('details');
        setIsModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setLoading(true);
        const result = await deleteUserAction(userToDelete.id);
        if (result.success) {
            addNotification({ title: 'Éxito', message: 'Usuario eliminado correctamente', type: 'success' });
            await loadUsers();
        } else {
            addNotification({ title: 'Error', message: result.error || 'No se pudo eliminar el usuario', type: 'error' });
        }
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        setLoading(false);
    };

    const handleResendCredentials = async () => {
        if (!editingId || !formData.password) {
            addNotification({ title: 'Aviso', message: 'Debes ingresar una contraseña temporal en la pestaña "Seguridad & Acceso" para reenviar credenciales', type: 'warning' });
            return;
        }

        setLoading(true);
        const result = await sendWelcomeEmailAction(editingId, formData.password);
        if (result.success) {
            addNotification({ title: 'Éxito', message: 'Credenciales enviadas correctamente', type: 'success' });
        } else {
            addNotification({ title: 'Error', message: result.error || 'No se pudieron enviar las credenciales', type: 'error' });
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingId) {
            // Edit
            const result = await updateUserAction(editingId, formData);
            if (result.success) {
                addNotification({ title: 'Éxito', message: 'Usuario actualizado correctamente', type: 'success' });
                await loadUsers();
                setIsModalOpen(false);
            } else {
                addNotification({ title: 'Error', message: result.error || 'No se pudo actualizar el usuario', type: 'error' });
            }
        } else {
            // Create
            const result = await createUserAction(formData, sendInvitation);
            const anyResult = result as any; // Cast to any to avoid persistent TS build errors with union types

            if (anyResult.success) {
                // Check if email was requested but failed
                if (sendInvitation && anyResult.emailSent === false) {
                    addNotification({
                        title: 'Usuario creado con advertencia',
                        message: `Usuario creado pero el email falló: ${anyResult.emailError || 'Error desconocido'}`,
                        type: 'warning'
                    });
                }

                setCreatedUser({
                    email: formData.email || '',
                    password: anyResult.temporaryPassword,
                    emailSent: anyResult.emailSent !== false
                });
                setIsSuccessModalOpen(true);
                await loadUsers();
                setIsModalOpen(false);
            } else {
                addNotification({ title: 'Error', message: anyResult.error || 'No se pudo crear el usuario', type: 'error' });
            }
        }
        setLoading(false);
    };

    const handleImport = async (importedUsers: Partial<User>[]) => {
        setLoading(true);
        let successCount = 0;
        const errors: string[] = [];

        for (const user of importedUsers) {
            const result = await createUserAction(user, sendInvitation);
            const anyResult = result as any; // Cast to any to avoid TS union type errors
            if (anyResult.success) {
                successCount++;
            } else {
                errors.push(`${user.email}: ${anyResult.error}`);
            }
        }

        if (successCount > 0) {
            addNotification({
                title: 'Importación completada',
                message: `${successCount} de ${importedUsers.length} usuarios importados`,
                type: 'success'
            });
        }
        if (errors.length > 0) {
            console.error('Import errors:', errors);
            addNotification({
                title: 'Errores en importación',
                message: `${errors.length} usuarios no se pudieron importar`,
                type: 'error'
            });
        }

        await loadUsers();
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="text-blue-600" size={32} /> Gestión de Usuarios
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Administra los usuarios de la organización.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                        <Upload weight="bold" /> Importar CSV
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus weight="bold" /> Nuevo Usuario
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Search Bar & Filters */}
                <div className="p-4 border-b border-slate-100 space-y-3">
                    <div className="relative max-w-md">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500/10"
                            placeholder="Buscar por nombre, email o cargo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={filterUnit}
                            onChange={e => setFilterUnit(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500/10"
                        >
                            <option value="">Todas las Unidades</option>
                            {units.map(unit => (
                                <option key={unit.id} value={unit.name}>{unit.name}</option>
                            ))}
                        </select>

                        <select
                            value={filterLevel}
                            onChange={e => setFilterLevel(e.target.value === '' ? '' : Number(e.target.value))}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500/10"
                        >
                            <option value="">Todos los Niveles</option>
                            {LEVELS.map(l => (
                                <option key={l.level} value={l.level}>{l.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Rol / Nivel</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                            <div className="text-xs text-slate-400">{user.jobTitle}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        Nivel {user.level} - {LEVELS.find(l => l.level === user.level)?.label.split('(')[1].replace(')', '') || 'N/A'}
                                    </span>
                                </td>
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
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(user)} className="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Eliminar">
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-slate-200 bg-white">
                            <div className="flex px-6">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Detalles
                                </button>
                                {editingId && (
                                    <>
                                        <button
                                            onClick={() => setActiveTab('security')}
                                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            Seguridad & Acceso
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('activity')}
                                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity'
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            Actividad
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            {/* Tab: Details */}
                            {activeTab === 'details' && (
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre Completo</label>
                                        <input
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Cargo</label>
                                        <input
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                            value={formData.jobTitle}
                                            onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                        />
                                    </div>

                                    {!editingId && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Contraseña Temporal</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="password"
                                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none"
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="Dejar vacío para generar automáticamente"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleGeneratePassword}
                                                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
                                                >
                                                    <Sparkle size={18} weight="fill" />
                                                    Generar
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Si no se especifica, se generará automáticamente</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Nivel</label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                                value={formData.level}
                                                onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
                                            >
                                                {LEVELS.map(l => (
                                                    <option key={l.level} value={l.level}>{l.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
                                            <select
                                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                            >
                                                <option value="ACTIVE">Activo</option>
                                                <option value="SUSPENDED">Suspendido</option>
                                                <option value="PENDING_INVITE">Pendiente</option>
                                            </select>
                                        </div>
                                    </div>

                                    {!editingId && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={sendInvitation}
                                                    onChange={e => setSendInvitation(e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 ring-blue-500/20"
                                                />
                                                <div className="flex items-center gap-2 text-sm">
                                                    <PaperPlaneRight size={16} weight="fill" className="text-blue-600" />
                                                    <span className="font-medium text-blue-900">Enviar email de bienvenida con credenciales</span>
                                                </div>
                                            </label>
                                            <p className="text-xs text-blue-700 ml-6 mt-1">El usuario recibirá sus credenciales por correo electrónico</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Security & Access */}
                            {activeTab === 'security' && editingId && (
                                <div className="p-6 space-y-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="text-amber-600">⚠️</div>
                                            <div>
                                                <h4 className="font-semibold text-amber-900 mb-1">Comunicación</h4>
                                                <p className="text-sm text-amber-800">Envía un correo electrónico al usuario con instrucciones para restablecer su acceso.</p>
                                                <button
                                                    type="button"
                                                    onClick={handleResendCredentials}
                                                    disabled={loading}
                                                    className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
                                                >
                                                    {loading ? 'Enviando...' : 'Reenviar Credenciales'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-slate-800">Forzar cambio de contraseña</h4>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.mustChangePassword || false}
                                                onChange={e => setFormData({ ...formData, mustChangePassword: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <span className="text-sm text-slate-700">El usuario deberá actualizar su clave en el próximo inicio de sesión.</span>
                                        </label>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-slate-800">Asignación manual de contraseña</h4>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Nueva contraseña (dejar vacío si no desea cambiar)</label>
                                            <input
                                                type="password"
                                                className="w-full px-3 py-2 border rounded-lg"
                                                placeholder="Nueva contraseña..."
                                                value={formData.password || ''}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            <p className="text-xs text-slate-400 mt-1">Escribe un solo texto si deseas sobreescribir la contraseña actual del usuario manualmente.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Activity */}
                            {activeTab === 'activity' && editingId && (
                                <div className="p-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                            <div className="flex-1">
                                                <div className="font-medium text-sm text-slate-900">LOGIN_SUCCESS</div>
                                                <div className="text-xs text-slate-500 mt-1">22/12/2025, 8:19:06 p.m.</div>
                                            </div>
                                            <div className="text-xs text-slate-400">-</div>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                            <div className="flex-1">
                                                <div className="font-medium text-sm text-slate-900">LOGIN_SUCCESS</div>
                                                <div className="text-xs text-slate-500 mt-1">22/12/2025, 8:18:17 p.m.</div>
                                            </div>
                                            <div className="text-xs text-slate-400">-</div>
                                        </div>
                                        <div className="text-center py-8 text-slate-400 text-sm">
                                            Mostrando actividad reciente del usuario
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-sm font-medium">
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeIn">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash size={32} weight="bold" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Confirmar eliminación?</h3>
                            <p className="text-slate-500 mb-6">
                                Estás a punto de eliminar a <span className="font-semibold text-slate-700">{userToDelete?.name}</span>. Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-slate-300 font-medium transition-colors"
                                >
                                    {loading ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            <ImportUsersModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />

            {/* Success Modal */}
            <UserCreatedModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                userEmail={createdUser?.email || ''}
                temporaryPassword={createdUser?.password}
                emailSent={createdUser?.emailSent || false}
            />
        </div>
    );
}
