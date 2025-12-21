'use client';
import { DB, PlatformAuditEvent } from '@/lib/data';
import { MagnifyingGlass, Funnel, Clock, User, Buildings, Code, DownloadSimple, CalendarBlank, CaretDown } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';

export default function AuditPage() {
    const [search, setSearch] = useState('');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Unique Event Types for Filter
    const eventTypes = useMemo(() => {
        const types = new Set(DB.platformAudit.map(e => e.event_type));
        return ['ALL', ...Array.from(types)];
    }, []);

    const logs = useMemo(() => {
        let data = DB.platformAudit;

        // Text Search
        if (search) {
            const term = search.toLowerCase();
            data = data.filter(l =>
                l.event_type.toLowerCase().includes(term) ||
                l.actor_name.toLowerCase().includes(term) ||
                (l.target_tenant_id && l.target_tenant_id.toLowerCase().includes(term))
            );
        }

        // Type Filter
        if (eventTypeFilter !== 'ALL') {
            data = data.filter(l => l.event_type === eventTypeFilter);
        }

        // Date Filter
        if (dateRange.start) {
            data = data.filter(l => new Date(l.created_at) >= new Date(dateRange.start));
        }
        if (dateRange.end) {
            // Include the whole end day
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59, 999);
            data = data.filter(l => new Date(l.created_at) <= endDate);
        }

        return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [search, eventTypeFilter, dateRange]);

    const handleExportCS = () => {
        const headers = ['ID', 'Timestamp', 'Event Type', 'Actor', 'Tenant', 'IP Address', 'Metadata'];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => [
                log.id,
                log.created_at,
                log.event_type,
                log.actor_name,
                log.target_tenant_id || 'Global',
                log.ip,
                `"${JSON.stringify(log.metadata).replace(/"/g, '""')}"` // Escape quotes
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Global Audit Logs</h1>
                    <p className="text-slate-500">Track all critical actions across the platform and tenants.</p>
                </div>
                <button
                    onClick={handleExportCS}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all"
                >
                    <DownloadSimple weight="bold" size={18} /> Export CSV
                </button>
            </header>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search logs by event, actor, or tenant ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <div className="relative min-w-[180px]">
                        <select
                            className="w-full appearance-none px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
                            value={eventTypeFilter}
                            onChange={e => setEventTypeFilter(e.target.value)}
                        >
                            {eventTypes.map(t => (
                                <option key={t} value={t}>{t === 'ALL' ? 'All Event Types' : t}</option>
                            ))}
                        </select>
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="bold" />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <CalendarBlank size={16} className="text-slate-400" />
                        <input
                            type="date"
                            className="bg-transparent text-xs outline-none text-slate-600 w-24"
                            value={dateRange.start}
                            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            className="bg-transparent text-xs outline-none text-slate-600 w-24"
                            value={dateRange.end}
                            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

                <div className="text-xs font-mono text-slate-400 whitespace-nowrap">
                    {logs.length} events
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 w-48">Timestamp</th>
                                <th className="px-6 py-3">Event Type</th>
                                <th className="px-6 py-3">Actor</th>
                                <th className="px-6 py-3">Target Tenant</th>
                                <th className="px-6 py-3 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map(log => (
                                <>
                                    <tr
                                        key={log.id}
                                        onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                                        className={`cursor-pointer transition-colors ${expandedRow === log.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <td className="px-6 py-3 text-slate-500 font-mono whitespace-nowrap">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold border ${getEventColor(log.event_type)}`}>
                                                {log.event_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <User weight="bold" size={14} className="text-slate-400" />
                                                <span className="font-medium text-slate-700">{log.actor_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">
                                            {log.target_tenant_id ? (
                                                <div className="flex items-center gap-2">
                                                    <Buildings weight="bold" size={14} className="text-slate-400" />
                                                    <code>{log.target_tenant_id}</code>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Code size={16} className={`ml-auto ${expandedRow === log.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        </td>
                                    </tr>
                                    {expandedRow === log.id && (
                                        <tr className="bg-indigo-50/30">
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="bg-slate-900 rounded-lg p-4 text-xs font-mono text-slate-300 overflow-x-auto shadow-inner">
                                                    <pre>{JSON.stringify({
                                                        id: log.id,
                                                        ip_address: log.ip,
                                                        metadata: log.metadata,
                                                        full_timestamp: log.created_at
                                                    }, null, 2)}</pre>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            <Clock size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No audit events found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getEventColor(type: string) {
    if (type.includes('CREATED')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (type.includes('DELETED') || type.includes('SUSPENDED')) return 'bg-red-50 text-red-700 border-red-100';
    if (type.includes('IMPERSONATION')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (type.includes('LOGIN')) return 'bg-blue-50 text-blue-700 border-blue-100';
    return 'bg-slate-100 text-slate-600 border-slate-200';
}
