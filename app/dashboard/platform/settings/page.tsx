'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
    Envelope, ShieldCheck, Key, FloppyDisk, CircleNotch, CheckCircle, XCircle, PaperPlaneTilt, Eye, EyeSlash, Gear
} from '@phosphor-icons/react';
import EmailSetupWizard from '@/components/email/EmailSetupWizard';

export default function PlatformSettingsPage() {
    const { isSuperAdmin } = useApp();
    const [activeTab, setActiveTab] = useState<'email' | 'security' | 'session'>('email');

    const [emailConfig, setEmailConfig] = useState({
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        smtpSecure: false,
        fromName: 'Maturity 360',
        fromEmail: '',
        replyToEmail: ''
    });
    const [emailConfigLoaded, setEmailConfigLoaded] = useState(false);
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailTesting, setEmailTesting] = useState(false);
    const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [testEmailAddress, setTestEmailAddress] = useState('');
    const [showEmailWizard, setShowEmailWizard] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [securityConfig, setSecurityConfig] = useState({
        sessionDurationHours: 24,
        maxLoginAttempts: 5,
        lockoutDurationMinutes: 15,
        requireStrongPassword: true,
        minPasswordLength: 8
    });
    const [securitySaving, setSecuritySaving] = useState(false);

    useEffect(() => {
        loadEmailConfig();
        loadSecurityConfig();
    }, []);

    const loadEmailConfig = async () => {
        try {
            const res = await fetch('/api/admin/email-config?tenantId=platform');
            const data = await res.json();
            if (data.success && data.config) {
                setEmailConfig({
                    smtpHost: data.config.smtpHost || '',
                    smtpPort: String(data.config.smtpPort || 587),
                    smtpUser: data.config.smtpUser || '',
                    smtpPassword: '',
                    smtpSecure: data.config.smtpSecure || false,
                    fromName: data.config.fromName || 'Maturity 360',
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

    const loadSecurityConfig = async () => {
        try {
            const res = await fetch('/api/platform/security-config');
            const data = await res.json();
            if (data.success && data.config) {
                setSecurityConfig(data.config);
            }
        } catch (error) {
            console.error('Error loading security config:', error);
        }
    };

    const handleSaveEmail = async () => {
        if (!emailConfig.smtpHost || !emailConfig.smtpUser || !emailConfig.fromEmail) {
            alert('Por favor completa los campos obligatorios: Servidor SMTP, Usuario y Email de envío.');
            return;
        }
        setEmailSaving(true);
        setEmailTestResult(null);
        try {
            const res = await fetch('/api/admin/email-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: 'platform',
                    ...emailConfig,
                    createdBy: 'superadmin'
                })
            });
            const data = await res.json();
            if (data.success) {
                setEmailTestResult({ success: true, message: 'Configuración guardada correctamente.' });
            } else {
                setEmailTestResult({ success: false, message: data.error || 'Error al guardar' });
            }
        } catch (error: any) {
            setEmailTestResult({ success: false, message: error.message });
        } finally {
            setEmailSaving(false);
        }
    };

    const handleTestEmail = async () => {
        setEmailTesting(true);
        setEmailTestResult(null);
        try {
            const res = await fetch('/api/admin/email-config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: 'platform',
                    sendTestTo: testEmailAddress || null
                })
            });
            const data = await res.json();
            setEmailTestResult({
                success: data.success,
                message: data.message || data.error || 'Test completado'
            });
        } catch (error: any) {
            setEmailTestResult({ success: false, message: error.message });
        } finally {
            setEmailTesting(false);
        }
    };

    const handleSaveSecurity = async () => {
        setSecuritySaving(true);
        try {
            const res = await fetch('/api/platform/security-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(securityConfig)
            });
            const data = await res.json();
            if (data.success) {
                alert('Configuración de seguridad guardada.');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setSecuritySaving(false);
        }
    };

    if (!isSuperAdmin) {
        return <div className="p-10 text-center text-slate-500">Acceso Restringido: Solo Super Admins.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 animate-fadeIn">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Gear className="text-blue-600" weight="duotone" />
                    Configuración de Plataforma
                </h1>
                <p className="text-slate-500">Administra el correo saliente y seguridad del Super Admin.</p>
            </header>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('email')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><Envelope size={16} /> Correo Saliente</div>
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><ShieldCheck size={16} /> Seguridad</div>
                </button>
                <button
                    onClick={() => setActiveTab('session')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'session' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <div className="flex items-center gap-2"><Key size={16} /> Sesión</div>
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[400px]">

                {activeTab === 'email' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Configuración SMTP</h3>
                                <p className="text-slate-500 text-sm">Configura el servidor de correo para notificaciones de la plataforma.</p>
                            </div>
                            <button
                                onClick={() => setShowEmailWizard(true)}
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                            >
                                Asistente de Configuración
                            </button>
                        </div>

                        {!emailConfigLoaded ? (
                            <div className="flex items-center justify-center py-12">
                                <CircleNotch size={24} className="animate-spin text-indigo-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Servidor SMTP <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="smtp.gmail.com"
                                        value={emailConfig.smtpHost}
                                        onChange={e => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Puerto</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                        value={emailConfig.smtpPort}
                                        onChange={e => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                                    >
                                        <option value="25">25 (Sin encriptar)</option>
                                        <option value="465">465 (SSL)</option>
                                        <option value="587">587 (TLS - Recomendado)</option>
                                        <option value="2525">2525 (Alternativo)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Usuario SMTP <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="tu-email@gmail.com"
                                        value={emailConfig.smtpUser}
                                        onChange={e => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña SMTP</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 font-mono text-sm"
                                            placeholder="••••••••••••••"
                                            value={emailConfig.smtpPassword}
                                            onChange={e => setEmailConfig({ ...emailConfig, smtpPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Deja vacío para mantener la contraseña actual.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Remitente</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                        placeholder="Maturity 360"
                                        value={emailConfig.fromName}
                                        onChange={e => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email de Envío <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="noreply@maturity.online"
                                        value={emailConfig.fromEmail}
                                        onChange={e => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email de Respuesta (Reply-To)</label>
                                    <input
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm"
                                        placeholder="soporte@maturity.online"
                                        value={emailConfig.replyToEmail}
                                        onChange={e => setEmailConfig({ ...emailConfig, replyToEmail: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="smtpSecure"
                                        className="w-4 h-4 text-indigo-600 rounded"
                                        checked={emailConfig.smtpSecure}
                                        onChange={e => setEmailConfig({ ...emailConfig, smtpSecure: e.target.checked })}
                                    />
                                    <label htmlFor="smtpSecure" className="text-sm text-slate-700">Usar conexión segura (SSL/TLS)</label>
                                </div>
                            </div>
                        )}

                        {emailTestResult && (
                            <div className={`p-4 rounded-lg flex items-start gap-3 ${emailTestResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                {emailTestResult.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                <p className="text-sm">{emailTestResult.message}</p>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="Email de prueba (opcional)"
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
                                    value={testEmailAddress}
                                    onChange={e => setTestEmailAddress(e.target.value)}
                                />
                                <button
                                    onClick={handleTestEmail}
                                    disabled={emailTesting || !emailConfig.smtpHost}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {emailTesting ? <CircleNotch size={16} className="animate-spin" /> : <PaperPlaneTilt size={16} />}
                                    Probar Conexión
                                </button>
                            </div>
                            <button
                                onClick={handleSaveEmail}
                                disabled={emailSaving}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {emailSaving ? <CircleNotch size={18} className="animate-spin" /> : <FloppyDisk size={18} />}
                                Guardar Configuración
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 text-lg">Políticas de Seguridad</h3>
                            <p className="text-slate-500 text-sm">Configura las políticas de seguridad para el acceso de administradores.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Intentos de Login Máximos</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                    value={securityConfig.maxLoginAttempts}
                                    onChange={e => setSecurityConfig({ ...securityConfig, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                                />
                                <p className="text-xs text-slate-400 mt-1">Bloqueo después de N intentos fallidos.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Duración del Bloqueo (minutos)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                    value={securityConfig.lockoutDurationMinutes}
                                    onChange={e => setSecurityConfig({ ...securityConfig, lockoutDurationMinutes: parseInt(e.target.value) || 15 })}
                                />
                                <p className="text-xs text-slate-400 mt-1">Tiempo de espera tras bloqueo.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Longitud Mínima de Contraseña</label>
                                <input
                                    type="number"
                                    min="6"
                                    max="32"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                    value={securityConfig.minPasswordLength}
                                    onChange={e => setSecurityConfig({ ...securityConfig, minPasswordLength: parseInt(e.target.value) || 8 })}
                                />
                            </div>
                            <div className="flex items-center gap-3 self-end pb-2">
                                <input
                                    type="checkbox"
                                    id="strongPassword"
                                    className="w-4 h-4 text-indigo-600 rounded"
                                    checked={securityConfig.requireStrongPassword}
                                    onChange={e => setSecurityConfig({ ...securityConfig, requireStrongPassword: e.target.checked })}
                                />
                                <label htmlFor="strongPassword" className="text-sm text-slate-700">Requerir contraseña fuerte (mayúsculas, números, símbolos)</label>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={handleSaveSecurity}
                                disabled={securitySaving}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {securitySaving ? <CircleNotch size={18} className="animate-spin" /> : <FloppyDisk size={18} />}
                                Guardar Políticas
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'session' && (
                    <div className="space-y-6 max-w-3xl">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-slate-900 text-lg">Configuración de Sesión</h3>
                            <p className="text-slate-500 text-sm">Define la duración y comportamiento de las sesiones de administrador.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Duración de Sesión (horas)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="168"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                    value={securityConfig.sessionDurationHours}
                                    onChange={e => setSecurityConfig({ ...securityConfig, sessionDurationHours: parseInt(e.target.value) || 24 })}
                                />
                                <p className="text-xs text-slate-400 mt-1">Tiempo máximo antes de requerir re-login.</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-amber-800 text-sm">
                            <p><strong>Nota:</strong> Los cambios de sesión aplicarán a partir del próximo inicio de sesión. Las sesiones activas no se verán afectadas.</p>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={handleSaveSecurity}
                                disabled={securitySaving}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {securitySaving ? <CircleNotch size={18} className="animate-spin" /> : <FloppyDisk size={18} />}
                                Guardar Configuración
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <EmailSetupWizard
                isOpen={showEmailWizard}
                tenantId="platform"
                onClose={() => setShowEmailWizard(false)}
                onComplete={(config) => {
                    setEmailConfig({
                        ...emailConfig,
                        smtpHost: config.smtpHost,
                        smtpPort: String(config.smtpPort),
                        smtpUser: config.smtpUser || '',
                        smtpPassword: config.smtpPassword || '',
                        smtpSecure: config.smtpSecure,
                        fromName: config.fromName || 'Maturity 360',
                        fromEmail: config.fromEmail || ''
                    });
                    setShowEmailWizard(false);
                }}
            />
        </div>
    );
}
