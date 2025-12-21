'use client';
import { useApp } from '@/context/AppContext';
import { Pulse, Buildings, ShieldCheck, Scroll, SignOut, User, UserSwitch, CloudArrowUp } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
    const { logout, currentUser } = useApp();
    const pathname = usePathname();

    const menu = [
        { name: 'Platform Health', icon: <Pulse size={20} />, path: '/admin' },
        { name: 'Tenants', icon: <Buildings size={20} />, path: '/admin/tenants' },
        { name: 'Users & Permissions', icon: <User size={20} />, path: '/admin/users' },
        { name: 'Support Helper', icon: <UserSwitch size={20} />, path: '/admin/support' },
        { name: 'Security & Access', icon: <ShieldCheck size={20} />, path: '/admin/security' },
        { name: 'Almacenamiento', icon: <CloudArrowUp size={20} />, path: '/admin/storage' },
        { name: 'Audit Logs', icon: <Scroll size={20} />, path: '/admin/audit' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                        <ShieldCheck weight="fill" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-tight">M360 Admin</h1>
                        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Platform Console</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menu.map(item => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                        <User weight="fill" size={20} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">{currentUser?.name}</div>
                        <div className="text-xs text-slate-500 truncate">{currentUser?.email || 'Super Admin'}</div>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                    <SignOut size={16} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
