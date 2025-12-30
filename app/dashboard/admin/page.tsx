"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
    Palette,
    ShieldCheck,
    FloppyDisk,
    ArrowCounterClockwise,
    Users,
    Briefcase
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import AdminGuide from '@/components/AdminGuide';
import { adminDashboardGuide } from '@/lib/adminGuides';
import { getAdminStatsAction } from '@/app/lib/userActions';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
    const { currentUser, isSuperAdmin, platformSettings, updatePlatformSettings } = useApp();
    const router = useRouter();

    // Quick Stats (Mocked for now)
    // Real Stats State
    const [stats, setStats] = useState([
        { label: 'Usuarios', value: '-', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Unidades', value: '-', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Auditoría', value: '-', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            const res = await getAdminStatsAction();
            if (res.success && res.data) {
                setStats([
                    { label: 'Usuarios', value: String(res.data.users), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Unidades', value: String(res.data.units), icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Auditoría', value: String(res.data.audits), icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
                ]);
            }
        };
        fetchStats();
    }, []);

    const isAdmin = isSuperAdmin || currentUser?.role?.toLowerCase().includes('admin');

    if (!isAdmin) {
        return <div className="p-8 text-center text-slate-500">Acceso restringido.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fadeIn space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
                <p className="text-slate-500">Gestión global de la organización.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} weight="fill" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ActionCard
                    title="Gestión de Usuarios"
                    desc="Añadir, editar o desactivar usuarios."
                    icon={Users}
                    onClick={() => router.push('/dashboard/admin/users')}
                />
                <ActionCard
                    title="Configuración Global"
                    desc="Branding, correo y seguridad del sitio."
                    icon={Palette}
                    onClick={() => router.push('/dashboard/admin/settings')}
                />
                <ActionCard
                    title="Auditoría"
                    desc="Ver logs de actividad del sistema."
                    icon={ShieldCheck}
                    onClick={() => router.push('/dashboard/admin/audit')}
                />
            </div>

            {/* Admin Guide */}
            <AdminGuide {...adminDashboardGuide} />
        </div>
    );
}

function ActionCard({ title, desc, icon: Icon, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all text-left w-full group"
        >
            <div className="p-3 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 mb-4 transition-colors">
                <Icon size={24} weight="duotone" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
        </button>
    );
}
