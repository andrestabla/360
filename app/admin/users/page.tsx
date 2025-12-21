'use client';
import { useState, useMemo } from 'react';
import { DB, User } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import ImportUsersModal from './ImportUsersModal';
import {
    Users, MagnifyingGlass, Funnel, CaretLeft, CaretRight,
    Circle, Eye, PencilSimple, Shield, UserCircle, Plus,
    Lock, LockOpen, Trash, FileCsv, PaperPlaneRight
} from '@phosphor-icons/react';

const ENTRIES_PER_PAGE = 10;

export default function AdminUsersPage() {
    const { isSuperAdmin } = useApp();
    const [search, setSearch] = useState('');
    const [filterTenant, setFilterTenant] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: '', email: '', tenantId: '', role: 'Analista', sendNotification: true
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState({
        name: '', email: '', tenantId: '', role: '', status: ''
    });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { adminCheckEmailUnique, adminCreateUser, adminUpdateUser, adminDeleteUser, adminResendInvite } = useApp();

    // Derived Data
    const tenants = useMemo(() => DB.tenants, []);
    const roles = useMemo(() => Array.from(new Set(DB.users.map(u => u.role))), []);

    const filteredUsers = useMemo(() => {
        let res = DB.users;

        // Search
        if (search) {
            const lowerDate = search.toLowerCase();
            res = res.filter(u =>
                u.name.toLowerCase().includes(lowerDate) ||
                (u.email || '').toLowerCase().includes(lowerDate)
            );
        }

        // Filters
        if (filterTenant) res = res.filter(u => u.tenantId === filterTenant);
        if (filterRole) res = res.filter(u => u.role === filterRole);
        if (filterStatus) res = res.filter(u => u.status === filterStatus);

        return res;
    }, [search, filterTenant, filterRole, filterStatus]);

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / ENTRIES_PER_PAGE);
    const paginatedUsers = filteredUsers.slice((page - 1) * ENTRIES_PER_PAGE, page * ENTRIES_PER_PAGE);

    if (!isSuperAdmin) return <div className="p-8">Access Denied</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="text-indigo-600" /> User Management
                </h1>
                <p className="text-slate-500 text-sm mt-1">Super Admin Console / Global Users</p>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <FileCsv weight="bold" size={18} /> Bulk Import
                </button>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus weight="bold" /> Create User
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                {/* Search */}
                <div className="relative flex-1">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-indigo-500"
                        value={filterTenant}
                        onChange={e => { setFilterTenant(e.target.value); setPage(1); }}
                    >
                        <option value="">All Tenants</option>
                        {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>

                    <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-indigo-500"
                        value={filterRole}
                        onChange={e => { setFilterRole(e.target.value); setPage(1); }}
                    >
                        <option value="">All Roles</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 outline-none focus:border-indigo-500"
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING_INVITE">Pending Invite</option>
                        <option value="DELETED">Deleted</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Tenant</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created / Access</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map(user => {
                                const tenant = tenants.find(t => t.id === user.tenantId);
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-white shadow-sm">
                                                    {user.initials}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email || 'No email'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Shield weight="duotone" className="text-slate-400" />
                                                <span className="font-medium text-slate-700">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tenant ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs border border-slate-200">
                                                    {tenant.name}
                                                    <span className="text-[10px] text-slate-400">({tenant.id})</span>
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Global / None</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                user.status === 'SUSPENDED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                <Circle weight="fill" className="mr-1.5 text-[8px]" />
                                                {user.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-slate-500">
                                                <div>Created: <span className="text-slate-700">Recent</span></div>
                                                <div>Last seen: <span className="text-slate-700">Today</span></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => {
                                                        adminResendInvite(user.id);
                                                        alert('Invitation resent');
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                    title="Resend Invitation"
                                                >
                                                    <PaperPlaneRight size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setEditForm({
                                                            name: user.name,
                                                            email: user.email || '',
                                                            tenantId: user.tenantId,
                                                            role: user.role,
                                                            status: user.status
                                                        });
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                                    title="Edit User"
                                                >
                                                    <PencilSimple size={16} />
                                                </button>
                                                {user.status === 'SUSPENDED' ? (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Reactivate this user?')) {
                                                                adminUpdateUser(user.id, { status: 'ACTIVE' });
                                                            }
                                                        }}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                        title="Reactivate User"
                                                    >
                                                        <LockOpen size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Suspend this user? They will effectively be blocked from logging in.')) {
                                                                adminUpdateUser(user.id, { status: 'SUSPENDED' });
                                                            }
                                                        }}
                                                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                                        title="Suspend User"
                                                    >
                                                        <Lock size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to reset this user\'s password? A temporary password will be sent via email.')) {
                                                            adminUpdateUser(user.id, {
                                                                password: 'TempPassword123!', // In real app, generate random
                                                                mustChangePassword: true
                                                            });
                                                            alert('Password reset to: TempPassword123!');
                                                        }
                                                    }}
                                                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <Lock weight="bold" size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this user? This action performs a soft delete.')) {
                                                            adminDeleteUser(user.id);
                                                        }
                                                    }}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                            <Users size={24} className="text-slate-400" />
                                        </div>
                                        <p className="font-medium">No users found</p>
                                        <p className="text-xs">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Showing <span className="font-medium">{(page - 1) * ENTRIES_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(page * ENTRIES_PER_PAGE, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1.5 rounded bg-white border border-slate-200 shadow-sm text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            <CaretLeft size={16} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1.5 rounded bg-white border border-slate-200 shadow-sm text-slate-500 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            <CaretRight size={16} />
                        </button>
                    </div>
                </div>
            </div>


            {/* Detail Modal */}
            {
                selectedUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <UserCircle size={20} className="text-indigo-600" />
                                    User Details
                                </h3>
                                <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                            </div>
                            <div className="p-6 grid gap-4 text-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500">
                                        {selectedUser.initials}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{selectedUser.name}</h2>
                                        <p className="text-slate-500">{selectedUser.jobTitle}</p>
                                        <p className="text-indigo-600 font-mono text-xs mt-1">{selectedUser.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                                        <div className="text-slate-900">{selectedUser.email || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
                                        <div className="text-slate-900">{selectedUser.phone || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tenant</label>
                                        <div className="text-slate-900">{tenants.find(t => t.id === selectedUser.tenantId)?.name || 'Global'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Unit</label>
                                        <div className="text-slate-900">{selectedUser.unit || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Role / Level</label>
                                        <div>{selectedUser.role} (L{selectedUser.level})</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${selectedUser.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100'
                                            }`}>
                                            {selectedUser.status || 'Active'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 mt-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Bio</label>
                                    <p className="text-slate-600 italic">{selectedUser.bio || 'No biography.'}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-6 py-4 flex justify-end">
                                <button onClick={() => setSelectedUser(null)} className="btn btn-secondary text-xs">Close</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create User Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Create New User</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (!adminCheckEmailUnique(createForm.email)) {
                                alert('This email is already registered.');
                                return;
                            }
                            adminCreateUser({
                                name: createForm.name,
                                email: createForm.email,
                                tenantId: createForm.tenantId || 'global',
                                role: createForm.role,
                                status: 'ACTIVE' // Default active for manual creation
                            }, { sendNotification: createForm.sendNotification });

                            alert('User created successfully.');
                            setIsCreateModalOpen(false);
                            setCreateForm({ name: '', email: '', tenantId: '', role: 'Analista', sendNotification: true });
                        }}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-indigo-500/20 outline-none"
                                        value={createForm.name}
                                        onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                                    <input
                                        type="email" required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-indigo-500/20 outline-none"
                                        value={createForm.email}
                                        onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tenant</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                            value={createForm.tenantId}
                                            onChange={e => setCreateForm({ ...createForm, tenantId: e.target.value })}
                                        >
                                            <option value="">Global / Platform</option>
                                            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Role</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                            value={createForm.role}
                                            onChange={e => setCreateForm({ ...createForm, role: e.target.value })}
                                        >
                                            {createForm.tenantId ? (
                                                <>
                                                    <option value="Admin Global">Admin Global</option>
                                                    <option value="Analista">Analista</option>
                                                    <option value="Auditor">Auditor</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="Super Admin">Super Admin</option>
                                                    <option value="Support">Support</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="sendNotif"
                                        checked={createForm.sendNotification}
                                        onChange={e => setCreateForm({ ...createForm, sendNotification: e.target.checked })}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="sendNotif" className="text-sm text-slate-700">Send welcome notification with credentials</label>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-2 border-t border-slate-100">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-500/20">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Edit User: {editingUser.name}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (editForm.email !== editingUser.email && !adminCheckEmailUnique(editForm.email)) {
                                alert('This email is already registered.');
                                return;
                            }

                            adminUpdateUser(editingUser.id, {
                                name: editForm.name,
                                email: editForm.email,
                                tenantId: editForm.tenantId,
                                role: editForm.role,
                                status: editForm.status as any
                            });

                            alert('User updated successfully.');
                            setIsEditModalOpen(false);
                            setEditingUser(null);
                        }}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                                    <input
                                        type="text" required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-indigo-500/20 outline-none"
                                        value={editForm.name}
                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                                        <input
                                            type="email" required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-indigo-500/20 outline-none"
                                            value={editForm.email}
                                            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                            value={editForm.status}
                                            onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="SUSPENDED">Suspended</option>
                                            <option value="PENDING_INVITE">Pending Invite</option>
                                            <option value="DELETED">Deleted</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tenant</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                            value={editForm.tenantId}
                                            onChange={e => setEditForm({ ...editForm, tenantId: e.target.value })}
                                        >
                                            <option value="global">Global / Platform</option>
                                            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Role</label>
                                        <select
                                            className="w-full px-3 py-2 border rounded-lg bg-white"
                                            value={editForm.role}
                                            onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                                        >
                                            {editForm.tenantId !== 'global' ? (
                                                <>
                                                    <option value="Admin Global">Admin Global</option>
                                                    <option value="Analista">Analista</option>
                                                    <option value="Auditor">Auditor</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="Super Admin">Super Admin</option>
                                                    <option value="Support">Support</option>
                                                    <option value="Platform Owner">Platform Owner</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
                                    <p className="font-bold mb-1">Warning:</p>
                                    <p>Changing Role or Tenant will be logged in the Audit Trail. Ensure the user is notified if access changes significantly.</p>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-2 border-t border-slate-100">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-500/20">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ImportUsersModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={(users) => {
                    // Import users using the admin function
                    users.forEach(user => {
                        adminCreateUser(user, { sendNotification: false });
                    });
                    setIsImportModalOpen(false);
                    setPage(1); // Refresh list
                }}
                tenantId={filterTenant || 'global'}
            />
        </div>
    );
}
