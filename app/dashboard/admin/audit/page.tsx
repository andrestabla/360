'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DB } from '@/lib/data'; // Kept for other references if needed, but not for logs
import { ShieldCheck, MagnifyingGlass, DownloadSimple, ArrowClockwise, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { getAuditLogsAction } from '@/app/lib/userActions';
import AdminGuide from "@/components/AdminGuide";
import { auditGuide } from "@/lib/adminGuides";

const ITEMS_PER_PAGE = 20;

export default function AuditPage() {
    const { isSuperAdmin, currentUser } = useApp();
    const [search, setSearch] = useState('');
    const [filterEventType, setFilterEventType] = useState('ALL');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Logs
    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            const res = await getAuditLogsAction();
            if (res.success && res.data) {
                setLogs(res.data);
            }
            setIsLoading(false);
        };

        if (isSuperAdmin || currentUser?.role === 'Admin Global') {
            fetchLogs();
        }
    }, [isSuperAdmin, currentUser, refreshKey]);

    // Ensure access control
    const hasAccess = isSuperAdmin || currentUser?.role === 'Admin Global';

    if (!currentUser) return <div className="p-8 text-center text-slate-500">Cargando...</div>;

    if (!hasAccess) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl m-8 border border-red-100">
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="font-bold text-lg mb-2">Acceso Denegado</h3>
                <p className="text-sm">Solo los Super Admins o Administradores Globales pueden ver la auditoría.</p>
                <div className="mt-4 text-xs bg-white p-2 rounded border border-red-200 inline-block text-left">
                    <p><strong>Tu Rol:</strong> {currentUser.role}</p>
                    <p><strong>Requerido:</strong> Admin Global / Super Admin</p>
                </div>
            </div>
        );
    }

    // Get unique event types for filter
    const eventTypes = Array.from(new Set(logs.map(log => log.event_type))).sort();

    // Filter Logs
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            // Text Search
            const searchLower = search.toLowerCase();
            const matchesSearch =
                (log.event_type?.toLowerCase() || '').includes(searchLower) ||
                (log.actor_name?.toLowerCase() || '').includes(searchLower) ||
                (log.target_user_id?.toLowerCase() || '').includes(searchLower);

            // Type Filter
            const matchesType = filterEventType === 'ALL' || log.event_type === filterEventType;

            // Date Filter
            let matchesDate = true;
            if (filterDateFrom) {
                matchesDate = matchesDate && new Date(log.created_at) >= new Date(filterDateFrom);
            }
            if (filterDateTo) {
                // Add one day to include the end date fully
                const endDate = new Date(filterDateTo);
                endDate.setDate(endDate.getDate() + 1);
                matchesDate = matchesDate && new Date(log.created_at) < endDate;
            }

            return matchesSearch && matchesType && matchesDate;
        }); // Sorted by DB already DESC
    }, [logs, search, filterEventType, filterDateFrom, filterDateTo]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
    const currentLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Export Handler
    const handleExport = () => {
        // Generate CSV content
        const headers = ['ID', 'Fecha', 'Evento', 'Actor ID', 'Actor Nombre', 'Target User', 'IP', 'Metadata'];
        const rows = filteredLogs.map(log => [
            log.id,
            new Date(log.created_at).toISOString(),
            log.event_type,
            log.actor_id,
            `"${log.actor_name}"`,
            log.target_user_id || '',
            log.ip,
            `"${JSON.stringify(log.metadata).replace(/"/g, '""')}"` // Escape quotes for CSV
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `auditoria_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-purple-600" /> Auditoría Global
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Registro inalterable de actividades críticas en la plataforma.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setRefreshKey(prev => prev + 1)} className="btn btn-secondary" title="Actualizar">
                        <ArrowClockwise className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button onClick={handleExport} className="btn btn-primary flex items-center gap-2">
                        <DownloadSimple weight="bold" /> Exportar CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Búsqueda</label>
                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 ring-purple-500/20 outline-none"
                                placeholder="Buscar por evento, usuario..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                    </div>

                    <div className="w-48">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tipo de Evento</label>
                        <select
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 ring-purple-500/20 outline-none bg-slate-50"
                            value={filterEventType}
                            onChange={e => { setFilterEventType(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="ALL">Todos</option>
                            {eventTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-36">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Desde</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 ring-purple-500/20 outline-none"
                            value={filterDateFrom}
                            onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    <div className="w-36">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Hasta</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 ring-purple-500/20 outline-none"
                            value={filterDateTo}
                            onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
                {isLoading && logs.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
                                    <tr>
                                        <th className="px-6 py-4 whitespace-nowrap">Fecha / Hora</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Evento</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Actor</th>
                                        <th className="px-6 py-4 whitespace-nowrap">Contexto</th>
                                        <th className="px-6 py-4 min-w-[300px]">Detalle (Metadata)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">
                                                No se encontraron eventos de auditoría {logs.length === 0 ? '(Base de datos vacía)' : 'con los filtros actuales'}.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-mono text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-700 border border-slate-200">
                                                        {log.event_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{log.actor_name}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono">{log.actor_id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        {log.target_user_id && (
                                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                👤 {log.target_user_id}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-600 break-all font-mono bg-slate-50/50">
                                                    <div className="max-h-20 overflow-y-auto custom-scrollbar">
                                                        {JSON.stringify(log.metadata, null, 2)}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div className="text-xs text-slate-500">
                                    Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} de {filteredLogs.length} eventos
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-slate-200 rounded bg-white disabled:opacity-50 hover:bg-slate-100"
                                    >
                                        <CaretLeft />
                                    </button>
                                    <span className="flex items-center px-4 text-xs font-medium text-slate-600">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-slate-200 rounded bg-white disabled:opacity-50 hover:bg-slate-100"
                                    >
                                        <CaretRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Admin Guide */}
            <AdminGuide {...auditGuide} />
        </div>
    );
}
