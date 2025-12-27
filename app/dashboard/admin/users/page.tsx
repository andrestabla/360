"use client";

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, User } from '@/lib/data';
import {
    Users,
    Plus,
    Pencil,
    Trash,
    MagnifyingGlass,
    UserCircle
} from '@phosphor-icons/react';

const LEVELS = [
    { level: 1, label: 'Nivel 1 (Administrador)' },
    { level: 2, label: 'Nivel 2 (Gerencia)' },
    { level: 3, label: 'Nivel 3 (Liderazgo)' },
    { level: 4, label: 'Nivel 4 (Especialista)' },
    { level: 5, label: 'Nivel 5 (Asistente)' },
    { level: 6, label: 'Nivel 6 (Operativo)' },
];

export default function UsersPage() {
    const { currentUser, isSuperAdmin } = useApp();
    const isAdmin = isSuperAdmin || currentUser?.role?.toLowerCase().includes('admin');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Mock Data Management directly here for now as AppContext functions were removed
    // In a real app this would use API calls
    const [localUsers, setLocalUsers] = useState<User[]>(DB.users);

    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        jobTitle: '',
        level: 6,
        status: 'ACTIVE',
        role: 'Usuario'
    });

    // Filtering
    const filteredUsers = useMemo(() => {
        return localUsers.filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.jobTitle || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [localUsers, search]);

    if (!isAdmin) {
        return <div className="p-8 text-center text-slate-500">Acceso restringido.</div>;
    }

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            email: '',
            jobTitle: '',
            level: 6,
            status: 'ACTIVE',
            role: 'Usuario'
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            jobTitle: user.jobTitle,
            level: user.level,
            status: user.status,
            role: user.role
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            // Mock delete
            setLocalUsers(prev => prev.filter(u => u.id !== id));
            // Also update DB for consistency in session
            const idx = DB.users.findIndex(u => u.id === id);
            if (idx !== -1) DB.users.splice(idx, 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Edit
            setLocalUsers(prev => prev.map(u =>
                u.id === editingId ? { ...u, ...formData } as User : u
            ));
        } else {
            // Create
            const newUser: User = {
                ...formData as User,
                id: editingId || `u-${Date.now()}`
            };
            setLocalUsers(prev => [...prev, newUser]);
            DB.users.push(newUser);
        }
        setIsModalOpen(false);
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
                <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                    <Plus weight="bold" /> Nuevo Usuario
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 ring-blue-500/10"
                            placeholder="Buscar por nombre, email o cargo..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
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
                                        <button onClick={() => handleDelete(user.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Eliminar">
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
