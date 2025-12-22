'use client';
import { DB, PlatformAdmin } from '@/lib/data';
import { ShieldCheck, Plus, Trash, LockKey, User } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';

export default function SecurityPage() {
    const [admins, setAdmins] = useState<PlatformAdmin[]>(DB.platformAdmins);
    const [showModal, setShowModal] = useState(false);

    // Normally this would come from an API/Context hook
    const handleAddAdmin = (data: Partial<PlatformAdmin>) => {
        const newAdmin: PlatformAdmin = {
            id: `sa-${Date.now()}`,
            email: data.email!,
            name: data.name || 'Admin',
            role: data.role as any || 'READONLY',
            mfaEnabled: false,
            status: 'ACTIVE'
        };
        // Update DB directly for prototype
        DB.platformAdmins.push(newAdmin);
        setAdmins([...DB.platformAdmins]);
        setShowModal(false);
    };

    const handleToggleStatus = (id: string) => {
        const idx = DB.platformAdmins.findIndex(a => a.id === id);
        if (idx >= 0) {
            const current = DB.platformAdmins[idx];
            current.status = current.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
            setAdmins([...DB.platformAdmins]);
        }
    };

    const handleDelete = (id: string) => {
        const idx = DB.platformAdmins.findIndex(a => a.id === id);
        if (idx >= 0) {
            DB.platformAdmins.splice(idx, 1);
            setAdmins([...DB.platformAdmins]);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Platform Security</h1>
                    <p className="text-slate-500">Manage superadmin access and security policies.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                    <Plus weight="bold" /> Invite Admin
                </button>
            </header>

            {/* Admin Users Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-indigo-600" />
                    <h2 className="font-bold text-slate-700">Platform Administrators</h2>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">MFA Status</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {admins.map(admin => (
                            <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                            <User weight="fill" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{admin.name}</div>
                                            <div className="text-xs text-slate-500 font-mono">{admin.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${admin.mfaEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                        <span className={`text-sm ${admin.mfaEnabled ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                            {admin.mfaEnabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold border ${admin.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {admin.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(admin.id)}
                                        title={admin.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    >
                                        <LockKey size={20} weight="bold" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        title="Revoke Access"
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash size={20} weight="bold" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Global Settings (Mock) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 opacity-60 pointer-events-none">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={24} className="text-slate-400" />
                    <h2 className="text-lg font-bold text-slate-900">Global Security Policies (Coming Soon)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password Policy</label>
                        <select className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50">
                            <option>NIST Standard (Recommended)</option>
                            <option>Strict (Symbols required)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Session Timeout</label>
                        <select className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50">
                            <option>30 Minutes</option>
                            <option>1 Hour</option>
                            <option>4 Hours</option>
                        </select>
                    </div>
                </div>
            </div>

            {showModal && <NewAdminModal onClose={() => setShowModal(false)} onInvite={handleAddAdmin} />}
        </div>
    )
}

function NewAdminModal({ onClose, onInvite }: any) {
    const [data, setData] = useState({ name: '', email: '', role: 'READONLY' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Invite Administrator</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                        <input
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                            placeholder="e.g. Jane Doe"
                            value={data.name}
                            onChange={e => setData({ ...data, name: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                        <input
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                            placeholder="jane@m360.com"
                            value={data.email}
                            onChange={e => setData({ ...data, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                        <select
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none bg-white"
                            value={data.role}
                            onChange={e => setData({ ...data, role: e.target.value })}
                        >
                            <option value="READONLY">Read Only (Observer)</option>
                            <option value="SUPPORT">Support Agent</option>
                            <option value="SUPERADMIN">Super Admin (Full Access)</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700">Cancel</button>
                    <button
                        onClick={() => onInvite(data)}
                        disabled={!data.email}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    )
}
