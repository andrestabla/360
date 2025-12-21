'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { FloppyDisk, Palette, ShieldCheck, ArrowCounterClockwise, Eye, DeviceMobile, Monitor, X, CloudArrowUp, Megaphone } from '@phosphor-icons/react';
import { createPortal } from 'react-dom';
import AuthScreen from '@/components/AuthScreen';
import { TenantBranding, TenantPolicy } from '@/lib/data';
import AdminGuide from '@/components/AdminGuide';
import { adminGeneralGuide } from '@/lib/adminGuides';

export default function TenantAdminPage() {
    const { currentUser, currentTenant, updateTenant } = useApp();
    const [activeTab, setActiveTab] = useState<'branding' | 'policies'>('branding');

    // Local state for editing
    const [branding, setBranding] = useState<Partial<TenantBranding>>({});
    const [policies, setPolicies] = useState<Partial<TenantPolicy>>({});

    const LOGIN_BACKGROUNDS = [
        { id: 'none', url: '', label: 'Sin Imagen (Color Sólido)' },
        { id: 'abstract-blue', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200', label: 'Abstract Blue' },
        { id: 'modern-office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', label: 'Modern Office' },
        { id: 'tech-network', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', label: 'Tech Network' },
        { id: 'soft-gradient', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200', label: 'Soft Gradient' },
        { id: 'dark-corporate', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200', label: 'Corporate Professional' },
        { id: 'innovation', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', label: 'Innovation' }
    ];

    const [tenantName, setTenantName] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    useEffect(() => {
        if (currentTenant) {
            setBranding(currentTenant.branding);
            setPolicies(currentTenant.policies);
            setTenantName(currentTenant.name);
        }
    }, [currentTenant]);

    if (!currentUser || currentUser.level !== 1) {
        return <div className="p-8 text-center text-slate-500">Access Denied. Tenant Admins only.</div>;
    }

    if (!currentTenant) return <div>Loading...</div>;

    const handleSave = () => {
        if (currentTenant) {
            updateTenant(currentTenant.id, {
                name: tenantName,
                branding: { ...currentTenant.branding, ...branding, updated_at: new Date().toISOString() },
                policies: { ...currentTenant.policies, ...policies, updated_at: new Date().toISOString() },
                ssoConfig: { ...currentTenant.ssoConfig, enabled: policies.sso_enabled || false } as any
            });
            setMessage({ type: 'success', text: 'Configuración guardada exitosamente.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleResetBranding = () => {
        setBranding({
            ...branding,
            primary_color: '#2563eb',
            accent_color: '#1d4ed8',
            app_title: tenantName
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Administración de Empresa</h1>
                    <p className="text-slate-500 text-sm">Personaliza la apariencia y políticas de seguridad.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors"
                >
                    <FloppyDisk weight="bold" /> Guardar Cambios
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700'}`}>
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('branding')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'branding' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Palette size={18} /> Apariencia & Branding
                    </button>
                    <button
                        onClick={() => setActiveTab('policies')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'policies' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <ShieldCheck size={18} /> Políticas & Seguridad
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'branding' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Identidad</h3>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Nombre Organización</label>
                                        <input
                                            value={tenantName}
                                            onChange={e => setTenantName(e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Título Aplicación (Visible en Login)</label>
                                        <input
                                            value={branding.app_title || ''}
                                            onChange={e => setBranding({ ...branding, app_title: e.target.value })}
                                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Descripción del Portal (Visible en Login)</label>
                                        <textarea
                                            value={branding.login_description || ''}
                                            onChange={e => setBranding({ ...branding, login_description: e.target.value })}
                                            placeholder="Breve mensaje de bienvenida o propósito..."
                                            rows={3}
                                            maxLength={200}
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm bg-slate-50/30 transition-all"
                                        />
                                        <div className="text-[10px] text-right text-slate-400 mt-1">{(branding.login_description || '').length}/200 caracteres</div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mensaje de Soporte / Ayuda</label>
                                        <textarea
                                            value={branding.support_message || ''}
                                            onChange={e => setBranding({ ...branding, support_message: e.target.value })}
                                            placeholder="Ej: Para soporte, escribe a IT@empresa.com"
                                            rows={2}
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm bg-slate-50/30 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 flex justify-between">
                                        Colores Corporativos
                                        <button onClick={handleResetBranding} className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 normal-case font-normal">
                                            <ArrowCounterClockwise /> Restaurar Default
                                        </button>
                                    </h3>

                                    <div className="flex items-center gap-4">
                                        <input
                                            type="color"
                                            value={branding.primary_color || '#2563eb'}
                                            onChange={e => setBranding({ ...branding, primary_color: e.target.value })}
                                            className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-slate-700">Color Primario</div>
                                            <div className="text-xs text-slate-500">Usado en botones, navegación activa y encabezados principales.</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 group">
                                        <input
                                            type="color"
                                            value={branding.login_bg_color || '#f8fafc'}
                                            onChange={e => setBranding({ ...branding, login_bg_color: e.target.value })}
                                            className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-100 p-0 overflow-hidden transition-transform group-hover:scale-110"
                                        />
                                        <div>
                                            <div className="text-sm font-bold text-slate-700">Color de Fondo Login</div>
                                            <div className="text-xs text-slate-500">Color que se verá si no hay una imagen seleccionada.</div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Fondo del Login</label>

                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={branding.login_bg_image || ''}
                                                    onChange={e => setBranding({ ...branding, login_bg_image: e.target.value })}
                                                    placeholder="URL de imagen personalizada (https://...)"
                                                    className="flex-1 p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                                                />
                                                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 transition-all flex items-center gap-1">
                                                    <CloudArrowUp size={14} /> Subir
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = (ev) => setBranding({ ...branding, login_bg_image: ev.target?.result as string });
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                {LOGIN_BACKGROUNDS.map(bg => (
                                                    <div
                                                        key={bg.id}
                                                        onClick={() => setBranding({ ...branding, login_bg_image: bg.url })}
                                                        className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${branding.login_bg_image === bg.url ? 'border-blue-600 ring-2 ring-blue-500 ring-offset-1' : 'border-slate-100 hover:border-slate-300'}`}
                                                        title={bg.label}
                                                    >
                                                        {bg.id === 'none' ? (
                                                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase p-2 text-center">Color Sólido</div>
                                                        ) : (
                                                            <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                                                        )}
                                                        {branding.login_bg_image === bg.url && (
                                                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                                <div className="bg-blue-600 text-white p-1 rounded-full"><ShieldCheck weight="fill" size={14} /></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">URL del Logo Corporativo</label>
                                        <input
                                            value={branding.logo_url || ''}
                                            onChange={e => setBranding({ ...branding, logo_url: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm bg-slate-50/30 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-8 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 transform -skew-x-12 -translate-x-1"></div>
                                <div className="flex justify-between items-center relative z-10">
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                                            <Eye weight="fill" className="text-blue-600" /> Previsualización del Portal
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1">Verifica cómo verán tus usuarios la página de inicio de sesión.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-lg shadow-slate-900/20 hover:bg-black transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        <Monitor size={16} /> Abrir Vista Previa Completa
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'policies' && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Seguridad de Acceso</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="card border p-4">
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Intentos Fallidos (Bloqueo)</label>
                                        <input
                                            type="number"
                                            value={policies.max_failed_logins}
                                            onChange={e => setPolicies({ ...policies, max_failed_logins: parseInt(e.target.value) })}
                                            className="w-full text-center text-xl font-bold border-slate-200"
                                            min={1} max={10}
                                        />
                                    </div>
                                    <div className="card border p-4">
                                        <label className="block text-xs font-bold text-slate-500 mb-2">Tiempo Bloqueo (min)</label>
                                        <input
                                            type="number"
                                            value={policies.lock_minutes}
                                            onChange={e => setPolicies({ ...policies, lock_minutes: parseInt(e.target.value) })}
                                            className="w-full text-center text-xl font-bold border-slate-200"
                                            min={1} max={60}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Gestión de Archivos</h3>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Tamaño Máximo Archivo (Bytes)</label>
                                    <input
                                        type="number"
                                        value={policies.file_max_size_bytes}
                                        onChange={e => setPolicies({ ...policies, file_max_size_bytes: parseInt(e.target.value) })}
                                        className="w-full p-2 border border-slate-300 rounded"
                                    />
                                    <div className="text-xs text-slate-400 mt-1">{(policies.file_max_size_bytes || 0) / 1024 / 1024} MB</div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Autenticación Externa (SSO)</h3>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${policies.sso_enabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                            <ShieldCheck weight="bold" size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">Habilitar Single Sign-On</div>
                                            <div className="text-[10px] text-slate-500">Permite a los usuarios entrar con Google o Microsoft Entra ID.</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPolicies({ ...policies, sso_enabled: !policies.sso_enabled })}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${policies.sso_enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${policies.sso_enabled ? 'translate-x-6' : ''}`}></div>
                                    </button>
                                </div>

                                {policies.sso_enabled && (
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl animate-fadeIn space-y-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dominios de Email Permitidos</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 p-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="ej: miempresa.com"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        const val = (e.target as HTMLInputElement).value.trim();
                                                        if (val && !policies.ip_whitelist?.includes(val)) {
                                                            // Using ip_whitelist for simplicity in this proto, but ideally sso_domains
                                                            // For now let's just use ip_whitelist or add sso_domains to policies
                                                        }
                                                    }
                                                }}
                                            />
                                            <button className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all">Añadir</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(currentTenant.ssoConfig?.domain ? [currentTenant.ssoConfig.domain] : ['acme.com', 'mi-empresa.co']).map(d => (
                                                <div key={d} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100">
                                                    {d} <X className="cursor-pointer hover:text-blue-900" size={12} />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-400">Si dejas esto vacío, cualquier usuario con un link de invitación podrá intentar login vía SSO.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Guide */}
            <AdminGuide {...adminGeneralGuide} />

            {/* Login Preview Modal */}
            {showPreview && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-fadeIn">
                    <div className="absolute top-6 right-8 flex items-center gap-6">
                        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${previewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Monitor size={18} /> Desktop
                            </button>
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${previewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <DeviceMobile size={18} /> Mobile
                            </button>
                        </div>
                        <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-white/10 text-white border border-white/20 grid place-items-center hover:bg-white hover:text-slate-900 transition-all group active:scale-90">
                            <X size={20} weight="bold" />
                        </button>
                    </div>

                    <div className={`transition-all duration-500 shadow-2xl overflow-hidden border-8 border-slate-800 bg-white relative ${previewMode === 'mobile' ? 'w-[375px] h-[667px] rounded-[3rem]' : 'w-[90%] h-[80%] rounded-2xl'}`}>
                        {/* Simulation Frame */}
                        {previewMode === 'mobile' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-[110]"></div>
                        )}
                        <div className="w-full h-full overflow-y-auto pointer-events-none origin-top scale-[1.0] transition-transform">
                            <AuthScreen previewBranding={branding} />
                        </div>
                        {/* Interactive overlay disclaimer */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest pointer-events-none">
                            Sólo Visualización
                        </div>
                    </div>

                    <div className="absolute bottom-8 text-center max-w-lg">
                        <p className="text-slate-400 text-xs leading-relaxed italic">
                            Esta previsualización refleja cómo se verá el portal corporativo para tus colaboradores. Asegúrate de que los colores y mensajes se alineen con la cultura de **{tenantName}**.
                        </p>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
