'use client';

import { useState } from 'react';
import {
    X,
    Envelope,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    WarningCircle,
    SpinnerGap,
    GoogleLogo,
    WindowsLogo,
    AmazonLogo,
    PaperPlaneTilt,
    Gear
} from '@phosphor-icons/react';

interface EmailConfigWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
}

const PROVIDERS = [
    {
        id: 'gmail',
        name: 'Gmail / Google Workspace',
        host: 'smtp.gmail.com',
        port: 587,
        icon: <GoogleLogo weight="fill" className="w-8 h-8 text-red-500" />,
        instructions: 'Debes habilitar la autenticación de 2 pasos y generar una "Contraseña de Aplicación".'
    },
    {
        id: 'outlook',
        name: 'Microsoft 365 / Outlook',
        host: 'smtp.office365.com',
        port: 587,
        icon: <WindowsLogo weight="fill" className="w-8 h-8 text-blue-500" />,
        instructions: 'Utiliza tu correo y contraseña. Si tienes MFA, necesitarás una contraseña de aplicación.'
    },
    {
        id: 'sendgrid',
        name: 'SendGrid',
        host: 'smtp.sendgrid.net',
        port: 587,
        icon: <Envelope weight="fill" className="w-8 h-8 text-blue-400" />,
        instructions: 'Genera una API Key con permisos de "Mail Send".'
    },
    {
        id: 'mailgun',
        name: 'Mailgun',
        host: 'smtp.mailgun.org',
        port: 587,
        icon: <PaperPlaneTilt weight="fill" className="w-8 h-8 text-red-400" />,
        instructions: 'Usa las credenciales SMTP de tu dominio en Mailgun.'
    },
    {
        id: 'aws',
        name: 'Amazon SES',
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        icon: <AmazonLogo weight="fill" className="w-8 h-8 text-orange-500" />,
        instructions: 'Crea credenciales SMTP en la consola de IAM.'
    },
    {
        id: 'custom',
        name: 'Servidor SMTP Personalizado',
        host: '',
        port: 587,
        icon: <Gear weight="fill" className="w-8 h-8 text-slate-500" />,
        instructions: 'Ingresa los datos de tu servidor SMTP manualmente.'
    }
];

export default function EmailConfigWizard({ isOpen, onClose, onSave }: EmailConfigWizardProps) {
    const [step, setStep] = useState(1);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [config, setConfig] = useState({
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: ''
    });
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

    if (!isOpen) return null;

    const handleSelectProvider = (provider: any) => {
        setSelectedProvider(provider);
        setConfig(prev => ({
            ...prev,
            smtpHost: provider.host,
            smtpPort: provider.port
        }));
        setStep(2);
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleVerify = async () => {
        setVerifying(true);
        setVerificationResult(null);
        try {
            const res = await fetch('/api/admin/email-config/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...config, isDraft: true })
            });
            const data = await res.json();
            setVerificationResult(data);
        } catch (error) {
            setVerificationResult({ success: false, error: 'Error de conexión' });
        } finally {
            setVerifying(false);
        }
    };

    const handleFinish = () => {
        onSave({
            ...config,
            emailProvider: selectedProvider?.id || 'smtp'
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Envelope weight="fill" className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Configurar Correo Saliente</h2>
                                <p className="text-slate-400 text-sm">Asistente de configuración</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
                    <div className="flex items-center justify-between text-sm">
                        {[
                            { id: 1, label: 'Proveedor' },
                            { id: 2, label: 'Instrucciones' },
                            { id: 3, label: 'Credenciales' },
                            { id: 4, label: 'Verificar' }
                        ].map((s, idx) => (
                            <div key={s.id} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}>
                                    {s.id}
                                </div>
                                <span className={step >= s.id ? 'text-white' : 'text-slate-500'}>{s.label}</span>
                                {idx < 3 && <div className="w-8 h-px bg-slate-700 mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Selecciona tu proveedor</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {PROVIDERS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSelectProvider(p)}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left group"
                                    >
                                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                            {p.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Puerto {p.port} - {p.host || 'Manual'}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-6">
                                {selectedProvider?.icon}
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedProvider?.name}</h3>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                                    <WarningCircle weight="fill" />
                                    Instrucciones Importantes
                                </h4>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                    {selectedProvider?.instructions}
                                </p>
                            </div>

                            <div className="text-sm text-slate-500">
                                <p>Asegúrate de tener a mano:</p>
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    <li>Servidor SMTP (Ya configurado)</li>
                                    <li>Puerto (Ya configurado)</li>
                                    <li>Usuario (Tu correo completo)</li>
                                    <li>Contraseña (o App Password / API Key)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Ingresa tus credenciales</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Host SMTP</label>
                                    <input
                                        type="text"
                                        value={config.smtpHost}
                                        onChange={e => setConfig({ ...config, smtpHost: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Puerto</label>
                                    <input
                                        type="number"
                                        value={config.smtpPort}
                                        onChange={e => setConfig({ ...config, smtpPort: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Usuario / Email</label>
                                <input
                                    type="text"
                                    value={config.smtpUser}
                                    onChange={e => setConfig({ ...config, smtpUser: e.target.value, fromEmail: e.target.value })}
                                    placeholder="usuario@dominio.com"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <p className="text-xs text-slate-500">Se usará también como remitente predeterminado.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contraseña / API Key</label>
                                <input
                                    type="password"
                                    value={config.smtpPassword}
                                    onChange={e => setConfig({ ...config, smtpPassword: e.target.value })}
                                    placeholder="••••••••••••"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-8">
                            {!verificationResult ? (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                                        <PaperPlaneTilt weight="fill" className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verificar Conexión</h3>
                                        <p className="text-slate-500">Haremos una prueba rápida de conexión SMTP.</p>
                                    </div>
                                    <button
                                        onClick={handleVerify}
                                        disabled={verifying}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                                    >
                                        {verifying ? (
                                            <span className="flex items-center gap-2">
                                                <SpinnerGap className="animate-spin" /> Verificando...
                                            </span>
                                        ) : 'Iniciar Prueba'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in zoom-in">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${verificationResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {verificationResult.success ? (
                                            <CheckCircle weight="fill" className="w-10 h-10" />
                                        ) : (
                                            <WarningCircle weight="fill" className="w-10 h-10" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {verificationResult.success ? '¡Conexión Exitosa!' : 'Error de Conexión'}
                                        </h3>
                                        <p className="text-slate-500 max-w-sm mx-auto">
                                            {verificationResult.message || verificationResult.error}
                                        </p>
                                    </div>
                                    {verificationResult.success ? (
                                        <button
                                            onClick={handleFinish}
                                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                                        >
                                            Guardar Configuración
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleVerify}
                                            className="text-slate-500 hover:text-slate-700 font-medium underline"
                                        >
                                            Intentar de nuevo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Nav */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between">
                    <button
                        onClick={step === 1 ? onClose : handleBack}
                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2"
                    >
                        {step === 1 ? 'Cancelar' : <><ArrowLeft /> Atrás</>}
                    </button>

                    {step > 1 && step < 4 && (
                        <button
                            onClick={handleNext}
                            disabled={step === 3 && (!config.smtpUser || !config.smtpPassword)}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            Siguiente <ArrowRight />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
