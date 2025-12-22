'use client';

import { useApp } from '@/context/AppContext';
import { DB, Post, Tenant, User, PlatformAuditEvent } from '@/lib/data';
import { useMemo, useState, useEffect } from 'react';
import {
    Lightning, Newspaper, Briefcase, CheckCircle,
    Plus, FileText, ArrowRight, Clock, Folder,
    FilePdf, FileVideo, FileImage, Link as LinkIcon, SpeakerHigh, Play, Kanban,
    Buildings, Users, Database, ChartLineUp, ShieldCheck, WarningCircle
} from '@phosphor-icons/react';
import Link from 'next/link';
import PostViewerModal from '@/components/PostViewerModal';
import WorkNotesWidget from '@/components/WorkNotesWidget';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { currentUser, currentTenant, isSuperAdmin } = useApp();
    const router = useRouter();

    useEffect(() => {
        // Tenant User Redirection Logic if Dashboard disabled
        if (currentTenant && !currentTenant.features?.includes('DASHBOARD') && !isSuperAdmin) {
            const feats = currentTenant.features || [];
            if (feats.includes('WORKFLOWS')) router.push('/dashboard/workflows');
            else if (feats.includes('REPOSITORY')) router.push('/dashboard/repository');
            else if (feats.includes('CHAT')) router.push('/dashboard/chat');
            else if (feats.includes('ANALYTICS')) router.push('/dashboard/analytics');
        }
    }, [currentTenant, isSuperAdmin, router]);

    if (!currentUser) return <div className="p-8">Cargando...</div>;

    // --- SUPER ADMIN DASHBOARD ---
    if (isSuperAdmin) {
        return <GlobalDashboard />;
    }

    // --- TENANT USER DASHBOARD ---

    // Don't render content if redirecting (basic protection)
    if (currentTenant && !currentTenant.features?.includes('DASHBOARD')) return null;

    return <TenantDashboard />;
}

// ==========================================
// SUPER ADMIN DASHBOARD COMPONENT
// ==========================================
function GlobalDashboard() {
    // Calculate Metrics
    const metrics = useMemo(() => {
        const totalTenants = DB.tenants.length;
        const activeTenants = DB.tenants.filter(t => t.status === 'ACTIVE').length;
        const totalUsers = DB.users.length;
        const recentAudit = DB.platformAudit.slice(0, 5);
        const recentTenants = [...DB.tenants].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

        // Mock Storage Calculation (parse "10 GB", "500 MB" etc if needed, simplified here)
        const storageUsed = "1.2 TB"; // Mocked for aggregator

        return { totalTenants, activeTenants, totalUsers, recentAudit, recentTenants, storageUsed };
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fadeIn space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vista Global del Sistema</h1>
                    <p className="text-slate-500">Monitoreo en tiempo real de toda la plataforma SaaS.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Sistema Operativo
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tenants Activos"
                    value={`${metrics.activeTenants}/${metrics.totalTenants}`}
                    icon={Buildings}
                    color="text-blue-600"
                    bg="bg-blue-50"
                    trend="+2 este mes"
                />
                <StatCard
                    title="Usuarios Totales"
                    value={metrics.totalUsers}
                    icon={Users}
                    color="text-purple-600"
                    bg="bg-purple-50"
                    trend="+12% vs mes anterior"
                />
                <StatCard
                    title="Almacenamiento"
                    value={metrics.storageUsed}
                    icon={Database}
                    color="text-orange-600"
                    bg="bg-orange-50"
                    trend="65% de capacidad"
                />
                <StatCard
                    title="Uptime (SLA)"
                    value="99.98%"
                    icon={ChartLineUp}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    trend="Últimos 30 días"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Tenants */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Buildings className="text-indigo-600" weight="duotone" /> Nuevos Tenants
                        </h2>
                        <Link href="/dashboard/tenants" className="text-sm font-medium text-blue-600 hover:underline">Gestionar Todos</Link>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Empresa</th>
                                    <th className="px-6 py-3">Plan / Sector</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3 text-right">Fecha Registro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {metrics.recentTenants.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-900">{t.name}</td>
                                        <td className="px-6 py-3 text-slate-500">{t.sector || 'N/A'}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-slate-500 text-xs">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Logs Quick View */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="text-slate-600" weight="duotone" /> Auditoría Reciente
                        </h2>
                        <Link href="/dashboard/audit" className="text-sm font-medium text-blue-600 hover:underline">Ver Logs</Link>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
                        {metrics.recentAudit.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">Sin actividad reciente.</div>
                        ) : (
                            metrics.recentAudit.map(log => (
                                <div key={log.id} className="flex gap-3 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="mt-1">
                                        {log.event_type.includes('FAIL') ? (
                                            <WarningCircle className="text-red-500" size={16} weight="fill" />
                                        ) : log.event_type.includes('DELETE') ? (
                                            <WarningCircle className="text-orange-500" size={16} weight="fill" />
                                        ) : (
                                            <CheckCircle className="text-blue-500" size={16} weight="fill" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700">{log.event_type}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            <span className="font-semibold">{log.actor_name}</span> &bull; {new Date(log.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

function StatCard({ title, value, icon: Icon, color, bg, trend }: any) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start z-10">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                </div>
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon size={24} weight="fill" />
                </div>
            </div>
            <div className="z-10 mt-auto">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    {trend.includes('+') ? <ChartLineUp className="text-green-500" weight="bold" /> : null}
                    {trend}
                </span>
            </div>
            <Icon size={80} weight="fill" className={`absolute -right-4 -bottom-4 opacity-[0.03] ${color} group-hover:scale-110 transition-transform duration-500`} />
        </div>
    );
}


// ==========================================
// TENANT DASHBOARD COMPONENT (Original)
// ==========================================
function TenantDashboard() {
    const { currentUser, currentTenant } = useApp();
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const feed = useMemo(() => {
        if (!currentTenant) return [];
        return DB.posts
            .filter(p => p.tenantId === currentTenant.id && p.status === 'published')
            .slice(0, 5);
    }, [currentTenant]);

    const myCreated = useMemo(() => {
        if (!currentUser || !currentTenant) return [];
        return DB.workflowCases.filter(
            c => c.tenantId === currentTenant.id &&
                c.creatorId === currentUser.id
        ).slice(0, 5);
    }, [currentUser, currentTenant]);

    if (!currentUser || !currentTenant) return null;

    return (
        <div className="max-w-7xl mx-auto p-2 animate-fadeIn relative">
            <PostViewerModal post={selectedPost} onClose={() => setSelectedPost(null)} />

            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Hola, {currentUser.name.split(' ')[0]} 👋</h1>
                        <p className="opacity-90 text-sm md:text-base">Bienvenido a tu centro de trabajo en {currentTenant.name}. Aquí tienes lo más relevante para hoy.</p>
                    </div>
                    <div className="hidden md:block opacity-80">
                        <span className="text-xs font-mono uppercase tracking-widest">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Feed & Actions) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Access */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Lightning className="text-amber-500" weight="fill" /> Accesos Rápidos
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <ActionCard icon={Folder} label="Repositorio" color="text-purple-600" bg="bg-purple-50" href="/dashboard/repository" />
                            <ActionCard icon={Kanban} label="Mis Workflows" color="text-emerald-600" bg="bg-emerald-50" href="/dashboard/workflows" />
                        </div>
                    </section>

                    {/* News Feed */}
                    <section>
                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Newspaper className="text-blue-600" weight="fill" /> Noticias Institucionales
                        </h2>
                        <div className="space-y-4">
                            {feed.length > 0 ? feed.map(post => (
                                <div
                                    key={post.id}
                                    onClick={() => setSelectedPost(post)}
                                    className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200 relative border border-slate-100">
                                            {post.mediaType === 'video' ? (
                                                <div className="w-full h-full bg-slate-900 group-hover:bg-slate-800 transition-colors flex items-center justify-center relative overflow-hidden">
                                                    {post.image && <img src={post.image} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video thumbnail" />}
                                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white relative z-10 shadow-lg">
                                                        <Play weight="fill" size={14} className="translate-x-0.5" />
                                                    </div>
                                                </div>
                                            ) : post.mediaType === 'audio' ? (
                                                <div className="w-full h-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors flex items-center justify-center">
                                                    <SpeakerHigh weight="duotone" size={28} className="text-indigo-500" />
                                                </div>
                                            ) : post.image ? (
                                                <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                    <Newspaper size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                    <Clock size={12} /> {post.date}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{post.title}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <EmptyState text="No hay noticias recientes." />
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column (My Work & Notes) */}
                <div className="space-y-8">
                    {/* Work Notes Widget */}
                    <WorkNotesWidget userId={currentUser.id} tenantId={currentTenant.id} />

                    {/* Created by Me */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Kanban className="text-emerald-600" weight="fill" /> Mis Workflows
                            </h2>
                            <Link href="/dashboard/workflows" className="text-xs font-semibold text-blue-600 hover:underline">Ver todo</Link>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                            {myCreated.length > 0 ? myCreated.map(c => (
                                <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(c.status)}`}>
                                            {c.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{c.id}</span>
                                    </div>
                                    <h4 className="font-semibold text-sm text-slate-800 mb-0.5 line-clamp-2">{c.title}</h4>
                                </div>
                            )) : (
                                <EmptyState text="No has creado solicitudes." compact />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

// Helpers
function ActionCard({ icon: Icon, label, color, bg, href }: any) {
    return (
        <Link href={href} className={`${bg} p-4 rounded-xl border border-transparent hover:border-slate-200 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 text-center group h-28`}>
            <Icon size={32} weight="fill" className={`${color} group-hover:scale-110 transition-transform`} />
            <span className="text-xs font-bold text-slate-700">{label}</span>
        </Link>
    );
}

function EmptyState({ text, compact }: { text: string, compact?: boolean }) {
    return (
        <div className={`text-center ${compact ? 'py-8' : 'py-12'} text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200`}>
            <p className="text-sm">{text}</p>
        </div>
    );
}

function getCategoryColor(cat: string) {
    switch (cat) {
        case 'Institucional': return 'bg-blue-100 text-blue-700';
        case 'Alerta': return 'bg-red-100 text-red-700';
        case 'Social': return 'bg-pink-100 text-pink-700';
        default: return 'bg-slate-100 text-slate-600';
    }
}

function getStatusColor(status: string) {
    if (status === 'IN_PROGRESS' || status === 'En Proceso') return 'bg-blue-50 text-blue-700 border-blue-100';
    if (status === 'REVIEW' || status === 'Pendiente') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (status === 'APPROVED' || status === 'Aprobado') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (status === 'REJECTED' || status === 'Rechazado') return 'bg-rose-50 text-rose-700 border-rose-100';
    if (status === 'CLOSED' || status === 'Cerrado') return 'bg-slate-50 text-slate-500 border-slate-100';
    if (status === 'RECEIVED') return 'bg-purple-50 text-purple-700 border-purple-100';
    return 'bg-slate-50 text-slate-600 hover:bg-slate-100';
}

function csvContains(value: string, list: string[]) {
    return list.some(item => value.includes(item));
}

function getMediaIcon(type: string) {
    switch (type) {
        case 'video': return <FileVideo weight="fill" />;
        case 'audio': return <SpeakerHigh weight="fill" />;
        case 'image': return <FileImage weight="fill" />;
        default: return <FileText weight="fill" />;
    }
}
