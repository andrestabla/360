'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Buildings, Trash, Power, CheckCircle, Warning, MagnifyingGlass, CaretRight, CaretDown, Factory, CircleNotch } from '@phosphor-icons/react';
import { Tenant, TenantBranding, TenantPolicy, DB } from '@/lib/data';
import { SECTOR_BENCHMARKS_LIST } from '@/lib/benchmark';

const SUBSCRIPTION_PLANS = [
    { id: 'custom', name: 'Personalizado', features: [] },
    { id: 'starter', name: 'Plan Starter', features: ['DASHBOARD', 'WORKFLOWS'] },
    { id: 'pro', name: 'Plan Pro', features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT'] },
    { id: 'enterprise', name: 'Plan Enterprise', features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS', 'SURVEYS', 'AUDIT'] },
];

const MODULE_DEFINITIONS = [
    { id: 'DASHBOARD', label: 'Dashboard' },
    { id: 'WORKFLOWS', label: 'Gestión de Trámites' },
    { id: 'REPOSITORY', label: 'Repositorio Documental' },
    { id: 'CHAT', label: 'Mensajería Corporativa' },
    { id: 'ANALYTICS', label: 'Analítica Avanzada' },
    { id: 'SURVEYS', label: 'Encuestas y Clima' },
    { id: 'ADMIN', label: 'Panel Administrativo' },
    { id: 'AUDIT', label: 'Auditoría' },
];

export default function TenantsPage() {
    const { isSuperAdmin, createTenant, updateTenant, deleteTenant } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 6;

    const fetchTenants = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/admin/tenants');
            const data = await response.json();
            if (data.success) {
                setTenants(data.tenants || []);
            } else {
                setError(data.error || 'Error al cargar los tenants');
            }
        } catch (err) {
            console.error('Error fetching tenants:', err);
            setError('Error de conexión. Intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTenants();
    }, [fetchTenants, refreshKey]);

    // Form State
    const [formData, setFormData] = useState<Omit<Partial<Tenant>, 'branding' | 'policies'> & { branding: Partial<TenantBranding>, policies: Partial<TenantPolicy> }>({
        name: '',
        slug: '',
        domains: [],
        timezone: 'America/Bogota',
        locale: 'es-CO',
        branding: { primary_color: '#2563eb', accent_color: '#1d4ed8' },
        policies: { max_failed_logins: 3 },
        features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS', 'SURVEYS'],
        sector: SECTOR_BENCHMARKS_LIST[0]?.sector || 'technology',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
    });

    const [selectedPlan, setSelectedPlan] = useState('custom');
    const [domainInput, setDomainInput] = useState('');

    if (!isSuperAdmin) {
        return <div className="p-8 text-center text-slate-500">Access Denied. Platform Admins only.</div>;
    }

    const openCreate = () => {
        setEditingId(null);
        setFormData({
            name: '', slug: '', domains: [],
            timezone: 'America/Bogota',
            locale: 'es-CO',
            branding: { primary_color: '#2563eb', accent_color: '#1d4ed8' },
            policies: { max_failed_logins: 3 },
            features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS', 'SURVEYS'],
            sector: SECTOR_BENCHMARKS_LIST[0]?.sector || 'technology',
            contactName: '', contactEmail: '', contactPhone: ''
        });
        setSelectedPlan('custom');
        setDomainInput('');
        setIsModalOpen(true);
    };

    const openEdit = (tenant: Tenant) => {
        setEditingId(tenant.id);
        const { branding, policies, ...rest } = tenant;
        setFormData({
            ...rest,
            branding: { ...branding },
            policies: { ...policies },
            features: tenant.features || [],
            sector: tenant.sector || SECTOR_BENCHMARKS_LIST[0]?.sector || 'technology',
            contactName: tenant.contactName || '',
            contactEmail: tenant.contactEmail || '',
            contactPhone: tenant.contactPhone || ''
        });
        // Determine plan based on features if exact match
        const matchingPlan = SUBSCRIPTION_PLANS.find(p =>
            p.id !== 'custom' &&
            p.features.length === (tenant.features || []).length &&
            p.features.every(f => tenant.features?.includes(f))
        );
        setSelectedPlan(matchingPlan ? matchingPlan.id : 'custom');

        setDomainInput(tenant.domains[0] || '');
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            domains: domainInput ? [domainInput] : []
        };

        if (editingId) {
            updateTenant(editingId, dataToSave as any);
        } else {
            createTenant(dataToSave as any);
        }

        setIsModalOpen(false);
        setRefreshKey(prev => prev + 1);
    };

    const handleToggleStatus = (tenant: Tenant) => {
        const newStatus = tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        updateTenant(tenant.id, { status: newStatus });
        setRefreshKey(prev => prev + 1);
    };

    const handleDelete = (tenant: Tenant) => {
        if (tenant.status !== 'SUSPENDED') {
            alert('Solo puede eliminar tenants suspendidos.');
            return;
        }
        if (confirm(`¿ELIMINAR ${tenant.name}? Esta acción es irreversible.`)) {
            deleteTenant(tenant.id);
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleFeatureToggle = (feat: string, isChecked: boolean) => {
        const current = formData.features || [];
        if (!isChecked) {
            // Confirm disable - HI 2.1
            if (['DASHBOARD', 'ADMIN'].includes(feat)) {
                alert('No se puede desactivar este módulo base.');
                return;
            }
            if (!confirm(`¿Desactivar módulo ${feat}? Los usuarios perderán acceso inmediato a esta funcionalidad.`)) {
                return;
            }
            setFormData(prev => ({ ...prev, features: current.filter(f => f !== feat) }));
            setSelectedPlan('custom');
        } else {
            setFormData(prev => ({ ...prev, features: [...current, feat] }));
            setSelectedPlan('custom');
        }
    };

    const handlePlanChange = (planId: string) => {
        setSelectedPlan(planId);
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        if (plan && planId !== 'custom') {
            // HI 2.2 - Apply features from plan
            setFormData(prev => ({ ...prev, features: [...plan.features] }));
        }
    };

    const filteredTenants = tenants;
    const totalPages = Math.ceil(filteredTenants.length / ITEMS_PER_PAGE);
    const displayedTenants = filteredTenants.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (isLoading) {
        return (
            <div className="p-6 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <CircleNotch size={40} className="animate-spin text-blue-600" />
                    <p className="text-slate-500">Cargando tenants...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                    <p className="font-medium">Error al cargar los tenants</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button 
                        onClick={() => setRefreshKey(prev => prev + 1)}
                        className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-sm font-medium"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Gestión de Tenants</h1>
                    <p className="text-slate-500 text-sm">Administra las empresas y organizaciones en la plataforma.</p>
                </div>
                <button onClick={openCreate} className="btn btn-primary flex items-center gap-2">
                    <Plus weight="bold" /> Nuevo Tenant
                </button>
            </div>

            {tenants.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-12 text-center">
                    <Buildings size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay tenants registrados</h3>
                    <p className="text-slate-500 mb-4">Crea tu primer tenant para comenzar.</p>
                    <button onClick={openCreate} className="btn btn-primary">
                        <Plus weight="bold" /> Crear Tenant
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <TenantList
                        tenants={displayedTenants}
                        onEdit={openEdit}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-slate-500 self-center">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Editar Organización' : 'Crear Nueva Organización'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre Empresa</label>
                                    <input
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => {
                                            const name = e.target.value;
                                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                                            setFormData(prev => ({ ...prev, name, slug: slug }));
                                        }}
                                        placeholder="Ej. Acme Corp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Slug (URL)</label>
                                    <input
                                        required
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all ${editingId ? 'bg-slate-50 text-slate-500 opacity-70' : ''}`}
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="ej. acme"
                                        disabled={!!editingId} // Prevent breaking existing links
                                    />
                                </div>
                            </div>

                            {/* Plan Selection - HI 2.2 */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">Plan de Suscripción</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {SUBSCRIPTION_PLANS.map(plan => (
                                        <button
                                            key={plan.id}
                                            type="button"
                                            onClick={() => handlePlanChange(plan.id)}
                                            className={`px-2 py-2 rounded-lg border text-xs font-medium transition-all ${selectedPlan === plan.id
                                                ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                                        >
                                            {plan.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sector Selection - ADDED */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Sector / Industria</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none px-3 py-2 border rounded-lg bg-white focus:ring-2 ring-blue-500/20 outline-none pr-8 cursor-pointer"
                                        value={formData.sector}
                                        onChange={e => setFormData({ ...formData, sector: e.target.value })}
                                    >
                                        {SECTOR_BENCHMARKS_LIST.map((s, i) => (
                                            <option key={i} value={s.sector}>{s.sector}</option>
                                        ))}
                                    </select>
                                    <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="bold" />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Este campo configura automáticamente los benchmarks del sector.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Dominio Principal (Single Sign-On)</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                    value={domainInput}
                                    onChange={e => setDomainInput(e.target.value)}
                                    placeholder="ej. acme.com (opcional)"
                                />
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-800 mb-2 uppercase">Datos de Contacto</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre Contacto</label>
                                        <input
                                            className="w-full px-3 py-2 border rounded-lg"
                                            value={formData.contactName}
                                            onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                            placeholder="Nombre del Admin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Email (Admin)</label>
                                        <input
                                            className="w-full px-3 py-2 border rounded-lg"
                                            value={formData.contactEmail}
                                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                            placeholder="admin@empresa.com"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 mb-1">Teléfono</label>
                                        <input
                                            className="w-full px-3 py-2 border rounded-lg"
                                            value={formData.contactPhone}
                                            onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                            placeholder="+57..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Timezone</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                        value={formData.timezone}
                                        onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                                    >
                                        <option value="America/Bogota">Bogotá (GMT-5)</option>
                                        <option value="America/Mexico_City">México (GMT-6)</option>
                                        <option value="America/Santiago">Santiago (GMT-4)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Idioma</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg bg-white"
                                        value={formData.locale}
                                        onChange={e => setFormData({ ...formData, locale: e.target.value })}
                                    >
                                        <option value="es-CO">Español (CO)</option>
                                        <option value="en-US">English (US)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-2">Módulos Habilitados (HI 2.1)</label>
                                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                                    {MODULE_DEFINITIONS.map(mod => (
                                        <label key={mod.id} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                checked={formData.features?.includes(mod.id) || false}
                                                onChange={e => handleFeatureToggle(mod.id, e.target.checked)}
                                            />
                                            <span className="text-sm font-medium text-slate-700">
                                                {mod.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {!editingId && DB.platformSettings.authPolicy.enforceSSO && (
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 mt-2 flex items-center gap-2 text-xs text-amber-800">
                                    <Warning size={16} weight="fill" />
                                    <strong>Política Global:</strong> Este tenant requerirá configuración obligatoria de SSO.
                                </div>
                            )}

                            {!editingId && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                                    <div className="flex gap-3">
                                        <div className="text-blue-600"><CheckCircle size={20} weight="fill" /></div>
                                        <div className="text-xs text-blue-800">
                                            <span className="font-bold block mb-1">Configuración Automática</span>
                                            Se creará un <strong>Admin user</strong> inicial y una estructura base. Los datos estarán aislados.
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-lg shadow-blue-500/20">
                                    {editingId ? 'Guardar Cambios' : 'Crear Tenant'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function TenantList({ tenants, onEdit, onToggleStatus, onDelete }: { tenants: Tenant[], onEdit: (t: Tenant) => void, onToggleStatus: (t: Tenant) => void, onDelete: (t: Tenant) => void }) {
    return (
        <>
            {tenants.map(tenant => (
                <div key={tenant.id} className={`bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all group relative overflow-hidden ${tenant.status === 'SUSPENDED' ? 'opacity-70 grayscale' : ''}`}>
                    <div className={`absolute top-0 left-0 w-1 h-full`} style={{ background: tenant.branding.primary_color }}></div>

                    <div className="flex justify-between items-start mb-3 pl-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center text-xl font-bold text-slate-600 uppercase">
                                {tenant.branding.logo_url ? (
                                    <img src={tenant.branding.logo_url} className="w-full h-full object-cover rounded-lg" alt="logo" />
                                ) : (
                                    tenant.name.substring(0, 2)
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{tenant.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{tenant.id}</span>
                                    <span>•</span>
                                    <span>{tenant.slug}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {tenant.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pl-2 mt-4">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="uppercase text-[10px] tracking-wide mb-1 opacity-70">Dominios</div>
                            <div className="font-medium text-slate-700 truncate">{tenant.domains[0] || 'N/A'}</div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="uppercase text-[10px] tracking-wide mb-1 opacity-70">Sector</div>
                            <div className="font-medium text-slate-700 flex items-center gap-1">
                                {tenant.sector ? <><Factory size={12} /> {tenant.sector}</> : 'No definido'}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 col-span-2">
                            <div className="uppercase text-[10px] tracking-wide mb-1 opacity-70">Módulos Activos ({tenant.features?.length || 0})</div>
                            <div className="flex flex-wrap gap-1">
                                {tenant.features?.map(f => (
                                    <span key={f} className="text-[9px] px-1.5 py-0.5 bg-white text-slate-600 rounded border border-slate-200 shadow-sm" title={f}>
                                        {{
                                            'DASHBOARD': 'Dash', 'WORKFLOWS': 'Flows', 'REPOSITORY': 'Docs',
                                            'CHAT': 'Chat', 'ANALYTICS': 'Data', 'SURVEYS': 'Enc',
                                            'ADMIN': 'Admin', 'AUDIT': 'Audit'
                                        }[f] || f}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 col-span-2">
                            <div className="uppercase text-[10px] tracking-wide mb-1 opacity-70">Portal de Acceso (Local)</div>
                            <a
                                href={`https://${tenant.id}.maturity.online`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-blue-600 hover:underline block truncate"
                            >
                                https://{tenant.id}.maturity.online
                            </a>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2 pl-2">
                        <button
                            onClick={() => onToggleStatus(tenant)}
                            className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${tenant.status === 'ACTIVE' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                        >
                            <Power size={14} weight="bold" /> {tenant.status === 'ACTIVE' ? 'Suspender' : 'Activar'}
                        </button>
                        <button
                            onClick={() => onEdit(tenant)}
                            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors font-medium"
                        >
                            Administrar <CaretRight />
                        </button>
                        {tenant.status === 'SUSPENDED' && (
                            <button
                                onClick={() => onDelete(tenant)}
                                className="text-xs flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                                title="Eliminar Definitivamente"
                            >
                                <Trash size={14} weight="bold" />
                            </button>
                        )}
                    </div>
                </div >
            ))
            }
        </>
    );
}
