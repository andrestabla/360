'use client';

import { useApp } from '@/context/AppContext';
import { DB, Tenant } from '@/lib/data';
import { SECTOR_BENCHMARKS } from '@/lib/benchmark';
import { Plus, MagnifyingGlass, DotsThree, Buildings, User, Lock, CheckCircle, Warning, CaretDown, Factory, Trash, ToggleLeft, ToggleRight, Package } from '@phosphor-icons/react';
import { useState, useMemo } from 'react';

// Define Modules and Plans
const AVAILABLE_MODULES = [
    { id: 'DASHBOARD', label: 'Dashboard Main' },
    { id: 'WORKFLOWS', label: 'Gestión de Trámites' },
    { id: 'REPOSITORY', label: 'Repositorio Documental' },
    { id: 'CHAT', label: 'Mensajería & Colaboración' },
    { id: 'ANALYTICS', label: 'Analítica Avanzada' },
];

const SUBSCRIPTION_PLANS = [
    { id: 'custom', name: 'Personalizado', features: [] },
    { id: 'starter', name: 'Plan Starter', features: ['DASHBOARD', 'WORKFLOWS'] },
    { id: 'pro', name: 'Plan Pro', features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT'] },
    { id: 'enterprise', name: 'Plan Enterprise', features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'] },
];

export default function TenantsPage() {
    const { createTenant, updateTenant, deleteTenant } = useApp();
    const [search, setSearch] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Forces re-render on DB changes
    const [revision, setRevision] = useState(0);

    const filteredTenants = useMemo(() => {
        return DB.tenants.filter(t =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.slug.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, revision]);

    const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
    const displayedTenants = filteredTenants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSave = (data: any) => {
        if (editingTenant) {
            updateTenant(editingTenant.id, {
                name: data.name,
                // Slug usually shouldn't change easily but we allow it for simplicity or restrict it
                // slug: data.slug, 
                domains: data.domain ? [data.domain] : [],
                sector: data.sector,
                features: data.features, // Save selected features
                contactName: data.contactName,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone
            });
            setEditingTenant(null);
        } else {
            createTenant({
                name: data.name,
                slug: data.slug,
                domains: data.domain ? [data.domain] : [],
                sector: data.sector,
                features: data.features, // Save selected features
                contactName: data.contactName,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone
            });
            setShowNewModal(false);
        }
        setRevision(r => r + 1);
    };

    const handleToggleStatus = (t: Tenant) => {
        const newStatus = t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        updateTenant(t.id, { status: newStatus });
        setRevision(r => r + 1);
        setActiveDropdown(null);
    };

    const handleDelete = (t: Tenant) => {
        if (t.status !== 'SUSPENDED') {
            alert('Solo se pueden eliminar empresas inactivas (Suspendidas). Primero suspenda la empresa.');
            return;
        }
        if (confirm(`¿ELIMINAR DEFINITIVAMENTE a ${t.name}? Esta acción no se puede deshacer y borrará todos los datos asociados.`)) {
            deleteTenant(t.id);
            setActiveDropdown(null);
            setRevision(r => r + 1);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Tenants</h1>
                    <p className="text-slate-500">Crea, configura y monitorea las empresas SaaS.</p>
                </div>
                <button
                    onClick={() => { setEditingTenant(null); setShowNewModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                >
                    <Plus weight="bold" /> Registrar Empresa
                </button>
            </header>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o slug..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Empresa / Sector</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Módulos</th>
                            <th className="px-6 py-4">Procesamiento</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {displayedTenants.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                            {t.branding?.logo_url ? <img src={t.branding.logo_url} className="w-full h-full object-cover rounded-lg" /> : <Buildings size={20} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{t.name}</div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                                                <span>{t.slug}</span>
                                                {t.sector && (
                                                    <>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-1.5 rounded-sm"><Factory size={10} /> {t.sector}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles(t.status)}`}>
                                        {t.status === 'ACTIVE' ? <CheckCircle weight="fill" /> : <Warning weight="fill" />}
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex -space-x-1">
                                        {(t.features || []).slice(0, 4).map(f => (
                                            <div key={f} title={f} className="w-6 h-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                                                {f[0]}
                                            </div>
                                        ))}
                                        {(t.features || []).length > 4 && (
                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] text-slate-600 font-bold">
                                                +{(t.features?.length || 0) - 4}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(t.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === t.id ? null : t.id)}
                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <DotsThree size={24} weight="bold" />
                                    </button>

                                    {activeDropdown === t.id && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                            <div className="absolute right-8 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden animate-scaleIn origin-top-right">
                                                <button
                                                    onClick={() => { setEditingTenant(t); setActiveDropdown(null); }}
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                                                >
                                                    Editar Detalles
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(t)}
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2"
                                                >
                                                    <Lock size={16} /> {t.status === 'ACTIVE' ? 'Suspender' : 'Reactivar'}
                                                </button>
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button
                                                    onClick={() => handleDelete(t)}
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <Trash size={16} /> Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTenants.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <Buildings size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No se encontraron tenants.</p>
                    </div>
                )}
            </div>

            {/* Pagination settings */}
            {filteredTenants.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center mt-6 gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-slate-500">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {(showNewModal || editingTenant) && (
                <TenantModal
                    initialData={editingTenant}
                    onClose={() => { setShowNewModal(false); setEditingTenant(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function statusStyles(status: string) {
    switch (status) {
        case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'SUSPENDED': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'DELETED': return 'bg-slate-50 text-slate-500 border-slate-100';
        default: return 'bg-slate-50 text-slate-700';
    }
}

function TenantModal({ initialData, onClose, onSave }: { initialData?: Tenant | null, onClose: () => void, onSave: (data: any) => void }) {
    const [data, setData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        domain: initialData?.domains?.[0] || '',
        sector: initialData?.sector || SECTOR_BENCHMARKS[0].sector,
        plan: 'custom',
        features: initialData?.features || ['DASHBOARD'],
        contactName: initialData?.contactName || '',
        contactEmail: initialData?.contactEmail || '',
        contactPhone: initialData?.contactPhone || ''
    });

    // Auto-generate slug from name only if creating
    const handleNameChange = (val: string) => {
        const updates: any = { name: val };
        if (!initialData) {
            updates.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        setData(prev => ({ ...prev, ...updates }));
    };

    const handlePlanChange = (planId: string) => {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        if (plan && planId !== 'custom') {
            setData(prev => ({ ...prev, plan: planId, features: [...plan.features] }));
        } else {
            setData(prev => ({ ...prev, plan: planId }));
        }
    };

    const toggleFeature = (featId: string) => {
        setData(prev => {
            const newFeatures = prev.features.includes(featId)
                ? prev.features.filter(f => f !== featId)
                : [...prev.features, featId];
            return { ...prev, features: newFeatures, plan: 'custom' };
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-slate-900 mb-6">{initialData ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Información General</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Comercial</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                                placeholder="Ej: Acme Corp"
                                value={data.name}
                                onChange={e => handleNameChange(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Slug</label>
                            <div className={`flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 ${initialData ? 'opacity-70' : ''}`}>
                                <span className="px-3 text-slate-500 text-sm border-r border-slate-200">m360.com/</span>
                                <input
                                    className="w-full bg-white px-4 py-2.5 focus:bg-indigo-50/10 outline-none"
                                    placeholder="acme"
                                    value={data.slug}
                                    onChange={e => setData({ ...data, slug: e.target.value })}
                                    disabled={!!initialData}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sector / Industria</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none bg-white pr-10 cursor-pointer"
                                    value={data.sector}
                                    onChange={e => setData({ ...data, sector: e.target.value })}
                                >
                                    {Object.values(SECTOR_BENCHMARKS).map((s, i) => (
                                        <option key={i} value={s.sector}>{s.sector}</option>
                                    ))}
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} weight="bold" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dominio (Opcional)</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                                placeholder="Ej: acme.com"
                                value={data.domain}
                                onChange={e => setData({ ...data, domain: e.target.value })}
                            />
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 pt-2">Datos de Contacto</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Contacto</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                                placeholder="Ej: Juan Pérez"
                                value={data.contactName}
                                onChange={e => setData({ ...data, contactName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Contacto / Admin</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                                placeholder="Ej: admin@empresa.com"
                                value={data.contactEmail}
                                onChange={e => setData({ ...data, contactEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                            <input
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:border-indigo-500 outline-none"
                                placeholder="Ej: +57 300 123 4567"
                                value={data.contactPhone}
                                onChange={e => setData({ ...data, contactPhone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right Column: Plan & Modules */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Plan y Módulos</h3>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan de Suscripción</label>
                            <div className="grid grid-cols-2 gap-2">
                                {SUBSCRIPTION_PLANS.map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => handlePlanChange(plan.id)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex flex-col gap-1 transition-all ${data.plan === plan.id
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                                            }`}
                                    >
                                        <span className="font-bold">{plan.name}</span>
                                        {plan.id !== 'custom' && <span className="opacity-70 text-[10px]">{plan.features.length} módulos</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Módulos Activos</label>
                            <div className="space-y-2 bg-slate-50 p-3 rounded-xl max-h-[200px] overflow-y-auto">
                                {AVAILABLE_MODULES.map(mod => {
                                    const isActive = data.features.includes(mod.id);
                                    return (
                                        <div
                                            key={mod.id}
                                            onClick={() => toggleFeature(mod.id)}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white cursor-pointer transition-colors group"
                                        >
                                            <span className={`text-sm ${isActive ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{mod.label}</span>
                                            {isActive
                                                ? <ToggleRight size={24} weight="fill" className="text-indigo-600" />
                                                : <ToggleLeft size={24} className="text-slate-300 group-hover:text-slate-400" />
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {!initialData && (
                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2 mb-6">
                        <User weight="bold" size={16} className="mt-0.5 shrink-0" />
                        <div>
                            <strong>Admin Inicial:</strong> Se creará automáticamente un usuario administrador con <code>admin@{data.slug || 'empresa'}.com</code>. La contraseña temporal será enviada por correo.
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700">Cancelar</button>
                    <button
                        onClick={() => onSave(data)}
                        disabled={!data.name || !data.slug || !data.sector}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        {initialData ? 'Guardar Cambios' : 'Crear Empresa'}
                    </button>
                </div>
            </div>
        </div>
    )
}
// Note: handleSave in parent needs to be updated to accept `features` and `sector`

