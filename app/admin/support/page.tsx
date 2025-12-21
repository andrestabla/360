'use client';
import { useApp } from '@/context/AppContext';
import { DB, User } from '@/lib/data';
import { MagnifyingGlass, UserSwitch, CaretRight } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';

export default function SupportPage() {
    const { impersonateUser } = useApp();
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [reason, setReason] = useState('');

    const results = useMemo(() => {
        if (!search || search.length < 2) return [];
        const term = search.toLowerCase();
        return DB.users.filter(u =>
            u.name.toLowerCase().includes(term) ||
            (u.email && u.email.toLowerCase().includes(term)) ||
            u.id.toLowerCase().includes(term)
        ).slice(0, 20); // Limit results
    }, [search]);

    const handleImpersonate = () => {
        if (selectedUser && reason) {
            impersonateUser(selectedUser.id, selectedUser.tenantId);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Support Helper</h1>
                <p className="text-slate-500">Find users and access their accounts securely to troubleshoot issues.</p>
            </header>

            {/* Search */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Find User</label>
                <div className="relative">
                    <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                    <input
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        placeholder="Search by name, email, or user ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="mt-2 text-xs text-slate-400 pl-1">
                    Showing top 20 matches.
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                {results.map(user => {
                    const tenant = DB.tenants.find(t => t.id === user.tenantId);
                    return (
                        <div key={user.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-lg font-bold text-slate-500">
                                    {user.initials}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{user.name}</div>
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <span className="font-mono bg-slate-100 px-1 rounded">{user.email || 'No Email'}</span>
                                        <span>•</span>
                                        <span className="text-indigo-600 font-medium">{tenant?.name || user.tenantId}</span>
                                        <span>•</span>
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <UserSwitch size={20} /> Access
                            </button>
                        </div>
                    );
                })}

                {results.length === 0 && search.length >= 2 && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No users found matching "{search}".
                    </div>
                )}
            </div>

            {/* Impersonation Warning Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                        <div className="bg-amber-400 p-4 flex items-center justify-center">
                            <UserSwitch size={48} className="text-amber-900 opacity-50" />
                        </div>
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">Confirm Access</h2>
                            <p className="text-sm text-slate-600 text-center mb-6">
                                You are about to log in as <strong>{selectedUser.name}</strong>.
                                <br />All actions performed will be audited.
                            </p>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reason for Access (Required)</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                                    rows={3}
                                    placeholder="e.g. Ticket #1024 - Unable to upload file"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setSelectedUser(null); setReason(''); }}
                                    className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImpersonate}
                                    disabled={!reason.trim()}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                >
                                    Start Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
