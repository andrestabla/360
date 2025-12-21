'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, PlatformAuditEvent } from '@/lib/data';
import {
    ShieldCheck, MagnifyingGlass, Funnel, DownloadSimple,
    CalendarBlank, User, Buildings, Clock
} from '@phosphor-icons/react';

export default function AuditPage() {
    const { isSuperAdmin, currentTenant, currentUser } = useApp();
    const [search, setSearch] = useState('');
    const [filterTenant, setFilterTenant] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');

    // Authorization Check
    const hasAccess = isSuperAdmin || currentTenant?.roleTemplates[currentUser?.level || 6]?.includes('VIEW_AUDIT'); // Simplified check based on permission availability if not superadmin

    // Get Unique Event Types & Tenants for filters
    const eventTypes = useMemo(() => Array.from(new Set(DB.platformAudit.map(e => e.event_type))), []);
    const tenants = useMemo(() => DB.tenants, []);

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return DB.platformAudit.filter(log => {
            // Permission Scope: SuperAdmin sees ALL, Tenant Admin sees ONLY their tenant
            if (!isSuperAdmin && log.target_tenant_id !== currentTenant?.id) return false;

            // UI Filters
            const matchSearch =
                log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
                log.event_type.toLowerCase().includes(search.toLowerCase()) ||
                (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(search.toLowerCase()));

            const matchTenant = filterTenant === 'ALL' || log.target_tenant_id === filterTenant;
            const matchType = filterType === 'ALL' || log.event_type === filterType;

            return matchSearch && matchTenant && matchType;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [search, filterTenant, filterType, isSuperAdmin, currentTenant]);

    // Export Handler
    const handleExport = (format: 'CSV' | 'JSON') => {
        if (filteredLogs.length === 0) return alert('No hay datos para exportar.');

        let content = '';
        let mimeType = '';
        let fileName = `audit_logs_${new Date().toISOString().split('T')[0]}`;

        if (format === 'JSON') {
            content = JSON.stringify(filteredLogs, null, 2);
            mimeType = 'application/json';
            fileName += '.json';
        } else {
            // CSV
            const headers = ['ID', 'Fecha', 'Tipo Evento', 'Actor', 'Tenant ID', 'IP', 'Metadata'];
            const rows = filteredLogs.map(l => [
                l.id,
                l.created_at,
                l.event_type,
                l.actor_name,
                l.target_tenant_id || '-',
                l.ip,
                JSON.stringify(l.metadata || {}).replace(/"/g, '""') // Escape quotes
            ]);
            content = [
                headers.join(','),
                ...rows.map(r => r.map(c => `"${c}"`).join(','))
            ].join('\n');
            mimeType = 'text/csv';
            fileName += '.csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isSuperAdmin && !hasAccess) {
        return <div className="p-10 text-center text-slate-500">Acceso Restringido: No tienes permisos para ver auditoría.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-blue-600" weight="duotone" />
                        Auditoría {isSuperAdmin ? 'Global' : 'Corporativa'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Registro inmutable de actividades y seguridad del sistema.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleExport('CSV')} className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm text-sm">
                        <DownloadSimple weight="bold" /> Exportar CSV
                    </button>
                    <button onClick={() => handleExport('JSON')} className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm text-sm">
                        <DownloadSimple weight="bold" /> JSON
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all text-sm"
                        placeholder="Buscar por usuario, acción o detalles..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {isSuperAdmin && (
                    <div className="relative min-w-[200px]">
                        <Buildings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            className="w-full pl-9 pr-8 py-2 border rounded-lg bg-white text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer"
                            value={filterTenant}
                            onChange={e => setFilterTenant(e.target.value)}
                        >
                            <option value="ALL">Todos los Tenants</option>
                            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <Funnel className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                    </div>
                )}

                <div className="relative min-w-[200px]">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        className="w-full pl-9 pr-8 py-2 border rounded-lg bg-white text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="ALL">Todos los Eventos</option>
                        {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <Funnel className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 w-[180px]">Fecha / Hora</th>
                            <th className="px-6 py-3 w-[200px]">Actor</th>
                            <th className="px-6 py-3 w-[250px]">Acción</th>
                            {isSuperAdmin && <th className="px-6 py-3">Tenant</th>}
                            <th className="px-6 py-3">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={isSuperAdmin ? 5 : 4} className="p-8 text-center text-slate-400">
                                    No se encontraron registros de auditoría con los filtros actuales.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                        <div className="flex items-center gap-2">
                                            <CalendarBlank />
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-slate-900">
                                            <User size={16} className="text-slate-400" />
                                            {log.actor_name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                            {log.event_type}
                                        </span>
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="px-6 py-4 text-slate-600">
                                            {log.target_tenant_id ? (
                                                <span className="flex items-center gap-1">
                                                    <Buildings size={14} className="text-slate-400" />
                                                    {tenants.find(t => t.id === log.target_tenant_id)?.name || log.target_tenant_id}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Sistema Global</span>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs truncate max-w-xs">
                                        {JSON.stringify(log.metadata)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center text-xs text-slate-400">
                Mostrando {filteredLogs.length} registros. Los logs se retienen por 90 días según política.
            </div>
        </div>
    );
}
