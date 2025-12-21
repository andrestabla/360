'use client';
import { DB } from '@/lib/data';
import { CheckCircle, Warning, XCircle, Pulse, Buildings, Database, HardDrives } from '@phosphor-icons/react';

export default function AdminDashboard() {
    const totalTenants = DB.tenants.length;
    const totalUsers = DB.users.length;
    const activeTenants = DB.tenants.filter(t => t.status === 'ACTIVE').length;

    // Simulated Metrics
    const services = [
        { name: 'PostgreSQL Primary', status: 'healthy', latency: '12ms', load: '45%' },
        { name: 'Redis Cache', status: 'healthy', latency: '2ms', load: '20%' },
        { name: 'Blob Storage', status: 'healthy', latency: '85ms', load: '12%' },
        { name: 'Email Gateway', status: 'healthy', latency: '150ms', load: '5%' },
        { name: 'Search Service', status: 'warning', latency: '450ms', load: '88%' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
                <p className="text-slate-500">Real-time system health and global metrics.</p>
            </header>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Tenants" value={totalTenants} sub={`Active: ${activeTenants}`} icon={<Buildings size={24} className="text-indigo-500" />} />
                <StatCard label="Global Users" value={totalUsers} sub="Last 24h: +12" icon={<Pulse size={24} className="text-emerald-500" />} />
                <StatCard label="Storage Used" value="46.2 GB" sub="Capacity: 5TB" icon={<HardDrives size={24} className="text-blue-500" />} />
                <StatCard label="System Status" value="Healthy" sub="99.99% Uptime" icon={<CheckCircle size={24} className="text-emerald-500" />} highlight />
            </div>

            {/* System Health Grid */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Database size={20} className="text-slate-400" /> Infrastructure Status
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-200 p-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <div className="col-span-2">Service</div>
                        <div>Status</div>
                        <div>Latency</div>
                        <div>Load</div>
                    </div>
                    {services.map((svc) => (
                        <div key={svc.name} className="grid grid-cols-5 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors items-center">
                            <div className="col-span-2 font-medium text-slate-700">{svc.name}</div>
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${svc.status === 'healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    svc.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {svc.status === 'healthy' && <CheckCircle weight="fill" />}
                                    {svc.status === 'warning' && <Warning weight="fill" />}
                                    {svc.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-slate-600 text-sm font-mono">{svc.latency}</div>
                            <div className="text-slate-600 text-sm font-mono">{svc.load}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Critical Events (Audit) */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Warning size={20} className="text-slate-400" /> Recent Alerts
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                    <CheckCircle size={48} className="mx-auto text-emerald-200 mb-2" />
                    <p>No critical alerts in the last 24 hours.</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, icon, highlight }: any) {
    return (
        <div className={`p-6 rounded-xl border flex flex-col justify-between ${highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                {icon}
            </div>
            <div>
                <div className={`text-2xl font-bold ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>{value}</div>
                <div className="text-xs text-slate-400 mt-1">{sub}</div>
            </div>
        </div>
    )
}
