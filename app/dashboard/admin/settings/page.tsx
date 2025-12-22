'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
    ShieldCheck, LockKey, Globe, Plugs, Plus, Trash, CheckCircle, Warning, FloppyDisk, Envelope, PaperPlaneTilt, CircleNotch, XCircle
} from '@phosphor-icons/react';
import { TenantIntegration } from '@/lib/data';
import AdminGuide from '@/components/AdminGuide';
import { technicalSettingsGuide } from '@/lib/adminGuides';

export default function TenantSettingsPage() {
    const { currentTenant, updateTenant, isSuperAdmin } = useApp();
    const [activeTab, setActiveTab] = useState<'auth' | 'integrations' | 'security' | 'email'>('auth');

    // Auth State
    const [ssoEnabled, setSsoEnabled] = useState(false);
    const [ssoConfig, setSsoConfig] = useState({
        provider: 'OAUTH2', authUrl: '', tokenUrl: '', clientId: '', clientSecret: '', domain: ''
    });

    // Security State
    const [security, setSecurity] = useState({
        sessionDuration: 60,
        maxFailedLogins: 3,
        mfaRequired: false,
        ipWhitelist: ''
    });

    // Integrations State
    const [integrations, setIntegrations] = useState<TenantIntegration[]>([]);
    const [newIntegration, setNewIntegration] = useState<any>({ type: 'REST', enabled: true });
    const [showIntModal, setShowIntModal] = useState(false);

    // Email State
    const [emailConfig, setEmailConfig] = useState({
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        smtpSecure: false,
        fromName: '',
        fromEmail: '',
        replyToEmail: ''
    });
    const [emailConfigLoaded, setEmailConfigLoaded] = useState(false);
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailTesting, setEmailTesting] = useState(false);
    const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [testEmailAddress, setTestEmailAddress] = useState('');

    // Load initial data
    useEffect(() => {
        if (currentTenant) {
            // Auth
            if (currentTenant.ssoConfig) {
                setSsoEnabled(currentTenant.ssoConfig.enabled);
                setSsoConfig({ ...currentTenant.ssoConfig } as any);
            }
            // Security
            setSecurity({
                sessionDuration: currentTenant.policies?.session_duration_minutes || 60,
                maxFailedLogins: currentTenant.policies?.max_failed_logins || 3,
                mfaRequired: currentTenant.policies?.mfa_required || false,
                ipWhitelist: (currentTenant.policies?.ip_whitelist || []).join('\n')
            });
            // Integrations
            setIntegrations(currentTenant.integrations || []);
            // Load email config
            loadEmailConfig();
        }
    }, [currentTenant]);

    const loadEmailConfig = async () => {
        if (!currentTenant) return;
        try {
            const tenantId = isSuperAdmin ? 'platform' : currentTenant.id;
            const res = await fetch(`/api/admin/email-config?tenantId=${tenantId}`);
            const data = await res.json();
            if (data.success && data.config) {
                setEmailConfig({
                    smtpHost: data.config.smtpHost || '',
                    smtpPort: String(data.config.smtpPort || 587),
                    smtpUser: data.config.smtpUser || '',
                    smtpPassword: '',
                    smtpSecure: data.config.smtpSecure || false,
                    fromName: data.config.fromName || '',
                    fromEmail: data.config.fromEmail || '',
                    replyToEmail: data.config.replyToEmail || ''
                });
            }
            setEmailConfigLoaded(true);
        } catch (error) {
            console.error('Error loading email config:', error);
            setEmailConfigLoaded(true);
        }
    };

    const handleSaveEmail = async () => {
        if (!currentTenant) return;
        if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.fromEmail) {
            alert('Por favor completa los campos obligatorios: Servidor SMTP, Usuario y Email de envío.');
            return;
        }
        setEmailSaving(true);
        setEmailTestResult(null);
        try {
            const tenantId = isSuperAdmin ? 'platform' : currentTenant.id;
            const res = await fetch('/api/admin/email-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId,
                    ...emailConfig,
                    createdBy: 'admin'
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Configuración de correo guardada correctamente.');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error: any) {
            alert(`Error al guardar: ${error.message}`);
        } finally {
            setEmailSaving(false);
        }
    };

    const handleTestEmail = async () => {
        if (!currentTenant) return;
        setEmailTesting(true);
        setEmailTestResult(null);
        try {
            const tenantId = isSuperAdmin ? 'platform' : currentTenant.id;
            const res = await fetch('/api/admin/email-config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId,
                    sendTestTo: testEmailAddress || null
                })
            });
            const data = await res.json();
            setEmailTestResult({
                success: data.success,
                message: data.message || data.error || 'Test completado'
            });
        } catch (error: any) {
            setEmailTestResult({
                success: false,
                message: error.message
            });
        } finally {
            setEmailTesting(false);
        }
    };

    if (!currentTenant) return <div className="p-8">Cargando configuración...</div>;

    const handleSaveAuth = () => {
        if (ssoEnabled && (!ssoConfig.authUrl || !ssoConfig.clientId)) {
            alert('Por favor completa los campos obligatorios para SSO.');
            return;
        }
        updateTenant(currentTenant.id, {
            ssoConfig: {
                enabled: ssoEnabled,
                provider: ssoConfig.provider as any,
                authUrl: ssoConfig.authUrl,
                tokenUrl: ssoConfig.tokenUrl,
                clientId: ssoConfig.clientId,
                clientSecret: ssoConfig.clientSecret,
                domain: ssoConfig.domain
            }
        });
        alert('Configuración de autenticación guardada.');
    };

    const handleSaveSecurity = () => {
        updateTenant(currentTenant.id, {
            policies: {
                ...currentTenant.policies,
                session_duration_minutes: Number(security.sessionDuration),
                max_failed_logins: Number(security.maxFailedLogins),
                mfa_required: security.mfaRequired,
                ip_whitelist: security.ipWhitelist.split('\n').filter(ip => ip.trim() !== ''),
                updated_at: new Date().toISOString()
            }
        });
        alert('Políticas de seguridad actualizadas.');
    };

    const handleAddIntegration = () => {
        if (!newIntegration.name || !newIntegration.baseUrl) {
            alert('Nombre y URL Base son requeridos.');
            return;
        }
        const newInt: TenantIntegration = {
            id: `int-${Date.now()}`,
            name: newIntegration.name!,
            type: newIntegration.type as any || 'REST',
            enabled: true,
            baseUrl: newIntegration.baseUrl!,
            apiKey: newIntegration.apiKey,
            description: newIntegration.description,
            active: newIntegration.active || true
        };
        const updated = [...integrations, newInt];
        updateTenant(currentTenant.id, { integrations: updated });
        setIntegrations(updated); // Optimistic update
        setShowIntModal(false);
        setNewIntegration({ type: 'REST', enabled: true, active: true });
    };

    const handleDeleteIntegration = (id: string) => {
        if (!confirm('¿Eliminar esta integración?')) return;
        const updated = integrations.filter(i => i.id !== id);
        updateTenant(currentTenant.id, { integrations: updated });
        setIntegrations(updated);
    };

    const handleToggleIntegration = (id: string) => {
        const updated = integrations.map(i => i.id === id ? { ...i, active: !i.active } : i);
        updateTenant(currentTenant.id, { integrations: updated });
        setIntegrations(updated);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Configuración Técnica</h1>
                <p className="text-slate-500">Administra autenticación, seguridad e integraciones externas.</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('auth')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'auth' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><LockKey size={16} /> Autenticación (SSO)</div>
                </button>
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'integrations' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><Plugs size={16} /> Integraciones API</div>
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><ShieldCheck size={16} /> Políticas de Acceso</div>
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><Envelope size={16} /> Correo Saliente</div>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[400px]">

                {/* --- AUTHENTICATION TAB --- */}
                {activeTab === 'auth' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Método de Login</h3>
                                <p className="text-slate-500 text-sm">Define cómo acceden tus usuarios a la plataforma.</p>
                            </div>
                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                <button
                                    onClick={() => setSsoEnabled(false)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!ssoEnabled ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                                >
                                    Nativo
                                </button>
                                <button
                                    onClick={() => setSsoEnabled(true)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${ssoEnabled ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                                >
                                    SSO (Single Sign-On)
                                </button>
                            </div>
                        </div>

                        {ssoEnabled && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Proveedor</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                        value={ssoConfig.provider}
                                        onChange={e => setSsoConfig({ ...ssoConfig, provider: e.target.value })}
                                    >
                                        <option value="OAUTH2">OAuth 2.0 Genérico</option>
                                        <option value="SAML">SAML 2.0</option>
                                        <option value="GOOGLE">Google Workspace</option>
                                        <option value="MICROSOFT">Microsoft Azure AD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">URL de Autorización <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="https://auth.example.com/oauth/authorize"
                                        value={ssoConfig.authUrl}
                                        onChange={e => setSsoConfig({ ...ssoConfig, authUrl: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">URL de Token</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="https://auth.example.com/oauth/token"
                                        value={ssoConfig.tokenUrl}
                                        onChange={e => setSsoConfig({ ...ssoConfig, tokenUrl: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Client ID <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        value={ssoConfig.clientId}
                                        onChange={e => setSsoConfig({ ...ssoConfig, clientId: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Client Secret</label>
                                    <input
                                        type="password"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="••••••••••••••"
                                        value={ssoConfig.clientSecret}
                                        onChange={e => setSsoConfig({ ...ssoConfig, clientSecret: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Dominio Restringido</label>
                                    <p className="text-xs text-slate-400 mb-2">Solo permitir login a usuarios con emails de este dominio (opcional).</p>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="ejemplo: miempresa.com"
                                        value={ssoConfig.domain}
                                        onChange={e => setSsoConfig({ ...ssoConfig, domain: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        {!ssoEnabled && (
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3">
                                <CheckCircle size={20} className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-sm">Autenticación Nativa Activada</p>
                                    <p className="text-xs mt-1">Los usuarios usarán el sistema de email y contraseña gestionado por Maturity360.</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button onClick={handleSaveAuth} className="btn btn-primary flex items-center gap-2">
                                <FloppyDisk size={18} /> Guardar Configuración
                            </button>
                        </div>
                    </div>
                )}

                {/* --- INTEGRATIONS TAB --- */}
                {activeTab === 'integrations' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">APIs Externas</h3>
                                <p className="text-slate-500 text-sm">Conecta sistemas externos para usar en workflows.</p>
                            </div>
                            <button onClick={() => setShowIntModal(true)} className="btn btn-primary text-sm flex items-center gap-2">
                                <Plus size={16} weight="bold" /> Nueva Integración
                            </button>
                        </div>

                        <div className="space-y-4">
                            {integrations.length === 0 ? (
                                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Plugs size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-slate-500 text-sm">No hay integraciones configuradas.</p>
                                </div>
                            ) : (
                                integrations.map(int => (
                                    <div key={int.id} className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 transition-colors bg-white">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                                <Globe size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-800">{int.name}</h4>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${int.type === 'REST' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                                        {int.type}
                                                    </span>
                                                    {!int.active && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Inactivo</span>}
                                                </div>
                                                <p className="text-xs text-slate-500 font-mono mt-1">{int.baseUrl}</p>
                                                {int.description && <p className="text-xs text-slate-400 mt-1">{int.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:self-center self-end">
                                            <button
                                                onClick={() => handleToggleIntegration(int.id)}
                                                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${int.active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                            >
                                                {int.active ? 'Activo' : 'Pausado'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteIntegration(int.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === 'security' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 text-amber-800 text-sm mb-6">
                            <Warning size={20} className="shrink-0 mt-0.5" />
                            <p>Cambiar estas políticas afectará a todos los usuarios del tenant. Asegúrate de comunicar cambios importantes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Duración de Sesión (minutos)</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                    value={security.sessionDuration}
                                    onChange={e => setSecurity({ ...security, sessionDuration: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Intentos Fallidos antes de Bloqueo</label>
                                <input
                                    type="number"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                    value={security.maxFailedLogins}
                                    onChange={e => setSecurity({ ...security, maxFailedLogins: Number(e.target.value) })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-indigo-600 rounded"
                                        checked={security.mfaRequired}
                                        onChange={e => setSecurity({ ...security, mfaRequired: e.target.checked })}
                                    />
                                    <div>
                                        <div className="font-bold text-slate-800">Requerir Autenticación de Dos Pasos (2FA)</div>
                                        <div className="text-xs text-slate-500">Todos los usuarios deberán configurar 2FA en su próximo login.</div>
                                    </div>
                                </label>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Lista Blanca de IPs (Opcional)</label>
                                <p className="text-xs text-slate-400 mb-2">Ingresa una IP por línea. Dejar vacío para permitir acceso desde cualquier lugar.</p>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm h-32"
                                    placeholder="192.168.1.1&#10;10.0.0.5"
                                    value={security.ipWhitelist}
                                    onChange={e => setSecurity({ ...security, ipWhitelist: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button onClick={handleSaveSecurity} className="btn btn-primary flex items-center gap-2">
                                <FloppyDisk size={18} /> Actualizar Políticas
                            </button>
                        </div>
                    </div>
                )}

                {/* --- EMAIL TAB --- */}
                {activeTab === 'email' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="border-b border-slate-100 pb-6">
                            <h3 className="font-bold text-slate-900 text-lg">Configuración de Correo Saliente</h3>
                            <p className="text-slate-500 text-sm">Configura el servidor SMTP para enviar notificaciones por email a los usuarios.</p>
                        </div>

                        {!emailConfigLoaded ? (
                            <div className="flex items-center justify-center py-12">
                                <CircleNotch size={32} className="animate-spin text-indigo-500" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Envelope size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-medium text-blue-800 text-sm">Servidor SMTP</p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Puedes usar servicios como Gmail SMTP, SendGrid, Mailgun, Amazon SES, o tu propio servidor SMTP.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            Servidor SMTP <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                            placeholder="smtp.gmail.com"
                                            value={emailConfig.smtpHost}
                                            onChange={e => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Puerto</label>
                                        <input
                                            type="number"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                            placeholder="587"
                                            value={emailConfig.smtpPort}
                                            onChange={e => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            Usuario SMTP <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                            placeholder="tu-email@empresa.com"
                                            value={emailConfig.smtpUser}
                                            onChange={e => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            Contraseña SMTP
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                            placeholder="••••••••••••"
                                            value={emailConfig.smtpPassword}
                                            onChange={e => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Dejar vacío para mantener la contraseña actual</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 text-indigo-600 rounded"
                                                checked={emailConfig.smtpSecure}
                                                onChange={e => setEmailConfig({ ...emailConfig, smtpSecure: e.target.checked })}
                                            />
                                            <div>
                                                <div className="font-bold text-slate-800">Usar SSL/TLS</div>
                                                <div className="text-xs text-slate-500">Activar para puerto 465 (SSL). Desactivar para STARTTLS en puerto 587.</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                        <h4 className="font-bold text-slate-800 mb-4">Información del Remitente</h4>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de Remitente</label>
                                        <input
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                            placeholder="Maturity 360"
                                            value={emailConfig.fromName}
                                            onChange={e => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            Email de Envío <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                            placeholder="noreply@empresa.com"
                                            value={emailConfig.fromEmail}
                                            onChange={e => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Email de Respuesta (Reply-To)</label>
                                        <input
                                            type="email"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                            placeholder="soporte@empresa.com (opcional)"
                                            value={emailConfig.replyToEmail}
                                            onChange={e => setEmailConfig({ ...emailConfig, replyToEmail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Test Section */}
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-6">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <PaperPlaneTilt size={20} /> Probar Configuración
                                    </h4>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <input
                                            type="email"
                                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                            placeholder="Email para prueba (opcional)"
                                            value={testEmailAddress}
                                            onChange={e => setTestEmailAddress(e.target.value)}
                                        />
                                        <button
                                            onClick={handleTestEmail}
                                            disabled={emailTesting}
                                            className="px-6 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {emailTesting ? (
                                                <>
                                                    <CircleNotch size={18} className="animate-spin" /> Probando...
                                                </>
                                            ) : (
                                                <>
                                                    <PaperPlaneTilt size={18} /> Probar Conexión
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {emailTestResult && (
                                        <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${emailTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                            {emailTestResult.success ? (
                                                <CheckCircle size={20} className="shrink-0 mt-0.5" weight="fill" />
                                            ) : (
                                                <XCircle size={20} className="shrink-0 mt-0.5" weight="fill" />
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">{emailTestResult.success ? 'Conexión exitosa' : 'Error de conexión'}</p>
                                                <p className="text-xs mt-1">{emailTestResult.message}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button
                                        onClick={handleSaveEmail}
                                        disabled={emailSaving}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        {emailSaving ? (
                                            <>
                                                <CircleNotch size={18} className="animate-spin" /> Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <FloppyDisk size={18} /> Guardar Configuración
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Integration Modal */}
            {showIntModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-scaleIn">
                        <h3 className="font-bold text-xl text-slate-900 mb-6">Nueva Integración</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                    placeholder="e.g. CRM Conector"
                                    value={newIntegration.name || ''}
                                    onChange={e => setNewIntegration({ ...newIntegration, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo</label>
                                <select
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                    value={newIntegration.type}
                                    onChange={e => setNewIntegration({ ...newIntegration, type: e.target.value as any })}
                                >
                                    <option value="REST">REST API</option>
                                    <option value="GRAPHQL">GraphQL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL Base</label>
                                <input
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono"
                                    placeholder="https://api.external.com/v1"
                                    value={newIntegration.baseUrl || ''}
                                    onChange={e => setNewIntegration({ ...newIntegration, baseUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API Key / Token (Encriptado)</label>
                                <input
                                    type="password"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono"
                                    placeholder="sk_live_..."
                                    value={newIntegration.apiKey || ''}
                                    onChange={e => setNewIntegration({ ...newIntegration, apiKey: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20"
                                    value={newIntegration.description || ''}
                                    onChange={e => setNewIntegration({ ...newIntegration, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setShowIntModal(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700">Cancelar</button>
                            <button onClick={handleAddIntegration} className="btn btn-primary">Guardar Integración</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Guide */}
            <AdminGuide {...technicalSettingsGuide as any} />
        </div>
    );
}
