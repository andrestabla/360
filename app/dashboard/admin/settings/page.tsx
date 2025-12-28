"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import {
    Gear,
    PaintBucket,
    Shield,
    Globe,
    FloppyDisk,
    SpinnerGap,
    CheckCircle,
    WarningCircle,
    CreditCard,
    Desktop,
    ArrowCounterClockwise,
    EnvelopeSimple,
    Lightning,
    PaperPlaneRight,
    MagicWand,
    CloudArrowUp,
    X
} from "@phosphor-icons/react";
import EmailConfigWizard from "@/components/email/EmailConfigWizard";
import { updateOrganizationBranding, getEmailSettings, updateEmailSettings, testSmtpConnection, updateSecurityPolicies, getOrganizationSettings, createCheckoutSession, getBillingPortalUrl } from '@/app/lib/actions';
import StorageConfigPanel from "@/components/storage/StorageConfigPanel";
import LoginForm from "@/app/login/LoginForm";

export default function AdminSettingsPage() {
    const { isSuperAdmin, currentUser, updatePlatformSettings, platformSettings } = useApp();
    const isAdmin = isSuperAdmin || currentUser?.role?.toLowerCase().includes('admin');

    const [activeTab, setActiveTab] = useState("general");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [testEmail, setTestEmail] = useState("");
    const [showEmailWizard, setShowEmailWizard] = useState(false);
    const [showPreviewConfig, setShowPreviewConfig] = useState(false);
    const [isTestingEmail, setIsTestingEmail] = useState(false);
    const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState<any>({
        orgName: "Maturity 360 Corp",
        orgDomain: "maturity.online",
        primaryColor: "#3b82f6",
        accentColor: "#1d4ed8",
        logoUrl: "",
        faviconUrl: "",
        supportEmail: "soporte@maturity360.com",
        timezone: "America/Bogota",
        dateFormat: "DD/MM/YYYY",
        plan: "ENTERPRISE",
        customModules: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'],

        // Email Settings
        emailProvider: "smtp",
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpPassword: "",
        smtpFrom: "no-reply@maturity360.com",
        testEmailTo: "", // For test input
        hasEncryptedPassword: false,

        // Branding
        appTitle: "Algoritmo",
        portalDescription: "",
        supportMessage: "",
        loginBackgroundColor: "#ffffff",
        loginBackgroundImage: "/images/auth/login-bg-3.jpg",

        // Security
        mfaRequired: false,
        sessionTimeout: 60,
        passwordHistory: 3,
        passwordMinLength: 8,
        passwordRequireSymbols: false,
        passwordRequireNumbers: true,
        passwordRequireUppercase: true,
        passwordExpiryDays: 90,

        allowedDomains: "",

        // Billing (Safe Init)
        billingPeriod: 'monthly',
        subscriptionStatus: 'active',
        stripeCustomerId: null
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev: any) => ({
                    ...prev,
                    loginBackgroundImage: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev: any) => ({
                    ...prev,
                    faviconUrl: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getOrganizationSettings();
            if (settings) {
                const branding = settings.branding as any || {};
                const policies = settings.policies as any || {};

                setFormData((prev: any) => ({
                    ...prev,
                    plan: settings.plan || "ENTERPRISE",
                    customModules: (settings.features as string[]) || prev.customModules,

                    // Branding
                    orgName: settings.name || "Maturity 360 Corp",
                    appTitle: branding.appTitle || "Algoritmo",
                    portalDescription: branding.portalDescription || "",
                    supportMessage: branding.supportMessage || "",
                    primaryColor: branding.primaryColor || "#3b82f6",
                    loginBackgroundColor: branding.loginBackgroundColor || "#ffffff",
                    loginBackgroundImage: branding.loginBackgroundImage || "/images/auth/login-bg-3.jpg",
                    logoUrl: branding.logoUrl || "",
                    faviconUrl: branding.faviconUrl || "",

                    // Security Policies
                    mfaRequired: policies.mfaRequired || false,
                    sessionTimeout: policies.sessionTimeout || 60,
                    passwordHistory: policies.passwordHistory || 3,
                    passwordMinLength: policies.passwordMinLength || 8,
                    passwordRequireSymbols: policies.passwordRequireSymbols || false,
                    passwordRequireNumbers: policies.passwordRequireNumbers !== undefined ? policies.passwordRequireNumbers : true,
                    passwordRequireUppercase: policies.passwordRequireUppercase !== undefined ? policies.passwordRequireUppercase : true,
                    passwordExpiryDays: policies.passwordExpiryDays || 90,

                    allowedDomains: policies.allowedDomains || "",

                    // Billing Hydration (Defensive)
                    billingPeriod: settings.billingPeriod || 'monthly',
                    subscriptionStatus: settings.subscriptionStatus || 'active',
                    stripeCustomerId: settings.stripeCustomerId || null,
                }));
            }
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        };

        const loadEmailSettings = async () => {
            const settings = await getEmailSettings();
            if (settings) {
                setFormData((prev: any) => ({
                    ...prev,
                    emailProvider: settings.provider || "smtp",
                    smtpHost: settings.smtpHost || "",
                    smtpPort: settings.smtpPort?.toString() || "587",
                    smtpUser: settings.smtpUser || "",
                    smtpPassword: "", // Don't fill password for security
                    smtpFrom: settings.fromEmail || "",
                    // If we have encrypted password, we keep track internally to not overwrite if empty
                    hasEncryptedPassword: !!settings.smtpPasswordEncrypted
                }));
            }
        };

        loadSettings();
        loadEmailSettings();
    }, [platformSettings]);

    const [isPending, startTransition] = React.useTransition();

    const handleSave = () => {
        setIsSaving(true);
        setMessage(null);

        // Optimistic UI update (only for general settings that affect UI immediately)
        if (activeTab === 'general') {
            updatePlatformSettings({
                plan: formData.plan,
                defaultModules: formData.plan === 'CUSTOM' ? formData.customModules : undefined,
                branding: {
                    appTitle: formData.appTitle,
                    portalDescription: formData.portalDescription,
                    supportMessage: formData.supportMessage,
                    primaryColor: formData.primaryColor,
                    loginBackgroundColor: formData.loginBackgroundColor,
                    loginBackgroundImage: formData.loginBackgroundImage,
                }
            });

            const root = document.documentElement;
            root.style.setProperty('--primary', formData.primaryColor);
        }


        // Server Action
        startTransition(async () => {
            let result;
            if (activeTab === 'general') {
                result = await updateOrganizationBranding({
                    appTitle: formData.appTitle,
                    portalDescription: formData.portalDescription,
                    supportMessage: formData.supportMessage,
                    primaryColor: formData.primaryColor,
                    loginBackgroundColor: formData.loginBackgroundColor,
                    loginBackgroundImage: formData.loginBackgroundImage,
                    logoUrl: formData.logoUrl,
                    faviconUrl: formData.faviconUrl
                });
            } else if (activeTab === 'email') {
                const emailData = {
                    provider: formData.emailProvider,
                    smtpHost: formData.smtpHost,
                    smtpPort: parseInt(formData.smtpPort),
                    smtpUser: formData.smtpUser,
                    // Only send password if changed (non-empty)
                    ...(formData.smtpPassword ? { smtpPassword: formData.smtpPassword } : {}),
                    fromEmail: formData.smtpFrom,
                    fromName: formData.appTitle // Reuse app title as From Name default
                };
                result = await updateEmailSettings(emailData);
            } else if (activeTab === 'security') {
                result = await updateSecurityPolicies({
                    mfaRequired: formData.mfaRequired,
                    sessionTimeout: Number(formData.sessionTimeout),
                    passwordHistory: Number(formData.passwordHistory),
                    passwordMinLength: Number(formData.passwordMinLength),
                    passwordRequireSymbols: formData.passwordRequireSymbols,
                    passwordRequireNumbers: formData.passwordRequireNumbers,
                    passwordRequireUppercase: formData.passwordRequireUppercase,
                    passwordExpiryDays: Number(formData.passwordExpiryDays),
                    allowedDomains: formData.allowedDomains
                });
            } else {
                // Placeholder for other tabs if they need a generic save
                result = { success: true, message: "Settings saved successfully." }; // Or handle other specific saves
            }

            if (result.success) {
                setMessage({ type: 'success', text: 'Configuración guardada en servidor exitosamente' });
            } else {
                setMessage({ type: 'error', text: 'Error al guardar en servidor: ' + result.error });
            }
            setIsSaving(false);
        });
    };

    const handleTestConnection = async () => {
        setIsTestingEmail(true);
        setTestEmailResult(null);
        try {
            const result = await testSmtpConnection({
                smtpHost: formData.smtpHost,
                smtpPort: parseInt(formData.smtpPort),
                smtpUser: formData.smtpUser,
                smtpPassword: formData.smtpPassword,
                fromEmail: formData.smtpFrom,
                fromName: formData.appTitle
            }, formData.testEmailTo);

            if (result.success) {
                setTestEmailResult({ success: true, message: "Conexión exitosa. Revisa tu bandeja de entrada." });
            } else {
                setTestEmailResult({ success: false, message: result.error || "Falló la conexión." });
            }
        } catch (error: any) {
            setTestEmailResult({ success: false, message: error.message || "Error testing connection." });
        } finally {
            setIsTestingEmail(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData((prev: any) => ({
            ...prev,
            [name]: val
        }));
    };


    const handleCheckout = async (planId: string) => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const result = await createCheckoutSession(planId, formData.billingPeriod || 'monthly');
            if (result.success) {
                setMessage({ type: 'success', text: `¡Plan ${planId} activado correctamente!` });
                // Optimistic update
                setFormData((prev: any) => ({ ...prev, plan: planId, subscriptionStatus: 'active' }));
            } else {
                setMessage({ type: 'error', text: result.error || "Error al iniciar pago" });
            }
        } catch (e) { setMessage({ type: 'error', text: "Error inesperado" }); }
        setIsSaving(false);
    };

    const handleManageBilling = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const result = await getBillingPortalUrl();
            if (result?.url) {
                window.open(result.url, '_blank');
                setMessage({ type: 'success', text: "Portal de facturación abierto en nueva pestaña" });
            }
        } catch (e) {
            setMessage({ type: 'error', text: "No se pudo abrir el portal" });
        }
        setIsSaving(false);
    };

    if (!isAdmin) {
        return (
            <div className="p-8 text-center text-slate-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
                <p>Solo los administradores pueden acceder a esta configuración.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <Gear className="w-8 h-8 text-slate-500" />
                        Configuración Global
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Gestiona la configuración general de la organización, marca y seguridad.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <SpinnerGap className="w-4 h-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <FloppyDisk className="w-4 h-4" />
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <WarningCircle className="w-5 h-5 flex-shrink-0" />}
                    <p>{message.text}</p>
                </div>
            )}

            {/* Tabs Layout */}
            <div className="grid grid-cols-12 gap-8">

                {/* Sidebar Nav */}
                <div className="col-span-12 md:col-span-3 space-y-2">
                    <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0">
                        <button
                            onClick={() => setActiveTab("general")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "general"
                                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                        >
                            <PaintBucket className="w-4 h-4" />
                            Apariencia & Branding
                        </button>
                        <button
                            onClick={() => setActiveTab("email")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "email"
                                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                        >
                            <EnvelopeSimple className="w-4 h-4" />
                            Correo (SMTP)
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "security"
                                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            Seguridad
                        </button>
                        <button
                            onClick={() => setActiveTab("storage")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "storage"
                                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                }`}
                        >
                            <CloudArrowUp className="w-4 h-4" />
                            Almacenamiento
                        </button>
                        {isSuperAdmin && (
                            <button
                                onClick={() => setActiveTab("subscription")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "subscription"
                                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    }`}
                            >
                                <CreditCard className="w-4 h-4" />
                                Suscripción y Pagos
                            </button>
                        )}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="col-span-12 md:col-span-9">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <SpinnerGap className="w-8 h-8 animate-spin text-slate-400" />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[500px]">

                            {/* Branding Tab */}
                            {activeTab === "general" && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Identidad */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold uppercase text-slate-900 dark:text-white mb-4">Identidad</h3>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre Organización</label>
                                                    <input
                                                        type="text"
                                                        name="orgName"
                                                        value={formData.orgName}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Título Aplicación (Visible en Login)</label>
                                                    <input
                                                        type="text"
                                                        name="appTitle"
                                                        value={formData.appTitle}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">Descripción del Portal (Visible en Login)</label>
                                                    <textarea
                                                        name="portalDescription"
                                                        value={formData.portalDescription}
                                                        onChange={handleChange as any}
                                                        rows={3}
                                                        placeholder="Breve mensaje de bienvenida o propósito..."
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                    />
                                                    <p className="text-right text-xs text-slate-400">0/200 caracteres</p>
                                                </div>

                                                <div className="space-y-2 pt-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase">Mensaje de Soporte / Ayuda</label>
                                                    <textarea
                                                        name="supportMessage"
                                                        value={formData.supportMessage}
                                                        onChange={handleChange as any}
                                                        rows={2}
                                                        placeholder="Ej: Para soporte, escribe a IT@empresa.com"
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border-l-4 border-blue-500 shadow-sm">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                                        <Desktop className="text-blue-600" weight="fill" />
                                                        PREVISUALIZACIÓN DEL PORTAL
                                                    </h4>
                                                    <button
                                                        onClick={() => setShowPreviewConfig(true)}
                                                        className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors"
                                                    >
                                                        <Desktop />
                                                        Abrir Vista Previa Completa
                                                    </button>
                                                </div>
                                                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden aspect-video relative flex items-center justify-center">
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                                                        style={{
                                                            backgroundColor: formData.loginBackgroundColor,
                                                            backgroundImage: formData.loginBackgroundImage ? `url(${formData.loginBackgroundImage})` : 'none'
                                                        }}
                                                    />
                                                    <div className="relative bg-white/90 dark:bg-slate-900/90 p-6 rounded-lg shadow-xl w-64 backdrop-blur-sm">
                                                        <div className="flex justify-center mb-4">
                                                            {formData.logoUrl ? (
                                                                <img src={formData.logoUrl} alt="Logo" className="h-8" />
                                                            ) : (
                                                                <div className="h-8 w-8 bg-slate-200 rounded-full" />
                                                            )}
                                                        </div>
                                                        <h5 className="text-center font-bold text-slate-900 dark:text-white mb-1">
                                                            {formData.appTitle || 'Título Aplicación'}
                                                        </h5>
                                                        <p className="text-center text-xs text-slate-500 mb-4">
                                                            {formData.portalDescription.slice(0, 50) || 'Descripción del portal...'}...
                                                        </p>
                                                        <div className="space-y-2">
                                                            <div className="h-8 bg-white border border-slate-200 rounded text-xs px-2 flex items-center text-slate-400">email@empresa.com</div>
                                                            <div className="h-8 bg-white border border-slate-200 rounded text-xs px-2 flex items-center text-slate-400">••••••••</div>
                                                            <div
                                                                className="h-8 rounded flex items-center justify-center text-xs text-white font-medium"
                                                                style={{ backgroundColor: formData.primaryColor }}
                                                            >
                                                                Iniciar Sesión
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Colors & Visuals */}
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-bold uppercase text-slate-900 dark:text-white">Colores Corporativos</h3>
                                                <button
                                                    onClick={() => setFormData((prev: any) => ({ ...prev, primaryColor: '#3b82f6', loginBackgroundColor: '#ffffff' }))}
                                                    className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                                                >
                                                    <ArrowCounterClockwise />
                                                    Restaurar Default
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            name="primaryColor"
                                                            value={formData.primaryColor}
                                                            onChange={handleChange}
                                                            className="w-16 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white">Color Primario</label>
                                                        <p className="text-xs text-slate-500">Usado en botones, navegación activa y encabezados principales.</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                                                    <div className="relative">
                                                        <input
                                                            type="color"
                                                            name="loginBackgroundColor"
                                                            value={formData.loginBackgroundColor}
                                                            onChange={handleChange}
                                                            className="w-16 h-10 rounded cursor-pointer border-0 p-0 overflow-hidden"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white">Color de Fondo Login</label>
                                                        <p className="text-xs text-slate-500">Color que se verá si no hay una imagen seleccionada.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold uppercase text-slate-500 mb-2 mt-6">Fondo del Login</h3>
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="text"
                                                    name="loginBackgroundImage"
                                                    value={formData.loginBackgroundImage}
                                                    onChange={handleChange}
                                                    placeholder="URL de imagen personalizada (https://...)"
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors"
                                                >
                                                    <CloudArrowUp className="w-4 h-4" />
                                                    Subir
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                {['#ffffff', '#1e293b', '#0f172a', '#000000'].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setFormData((prev: any) => ({ ...prev, loginBackgroundImage: '', loginBackgroundColor: color }))}
                                                        className="h-16 rounded-lg border border-slate-200 relative overflow-hidden group"
                                                        style={{ backgroundColor: color }}
                                                    >
                                                        {formData.loginBackgroundColor === color && !formData.loginBackgroundImage && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                <CheckCircle className="text-white w-6 h-6" weight="fill" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-x-0 bottom-0 bg-white/90 text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">SOLID</div>
                                                    </button>
                                                ))}
                                                {[
                                                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
                                                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80'
                                                ].map((bg, idx) => (
                                                    <button
                                                        key={bg}
                                                        onClick={() => setFormData((prev: any) => ({ ...prev, loginBackgroundImage: bg }))}
                                                        className="h-16 rounded-lg border border-slate-200 relative overflow-hidden group bg-cover bg-center"
                                                        style={{ backgroundImage: `url(${bg})` }}
                                                    >
                                                        {formData.loginBackgroundImage === bg && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-blue-600/40">
                                                                <CheckCircle className="text-white w-6 h-6" weight="fill" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold uppercase text-slate-500 mb-2 mt-6">URL del Logo Corporativo</h3>
                                            <input
                                                type="text"
                                                name="logoUrl"
                                                value={formData.logoUrl}
                                                onChange={handleChange}
                                                placeholder="https://..."
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Favicon</h3>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    name="faviconUrl"
                                                    value={formData.faviconUrl}
                                                    onChange={handleChange}
                                                    placeholder="URL o subir imagen (.ico, .png)"
                                                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <input
                                                    type="file"
                                                    ref={faviconInputRef}
                                                    className="hidden"
                                                    accept="image/x-icon,image/png,image/jpeg"
                                                    onChange={handleFaviconUpload}
                                                />
                                                <button
                                                    onClick={() => faviconInputRef.current?.click()}
                                                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors"
                                                >
                                                    <CloudArrowUp className="w-4 h-4" />
                                                    Subir
                                                </button>
                                                {formData.faviconUrl && (
                                                    <div className="w-10 h-10 border border-slate-200 rounded flex items-center justify-center bg-white">
                                                        <img src={formData.faviconUrl} alt="Favicon" className="w-6 h-6 object-contain" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email Tab */}
                            {activeTab === "email" && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Configuración de Correo (SMTP)</h3>
                                            <p className="text-sm text-slate-500">Configura el servidor de correo saliente para notificaciones.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowEmailWizard(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
                                        >
                                            <MagicWand weight="fill" className="w-4 h-4" />
                                            Asistente de Configuración
                                        </button>
                                    </div>

                                    {formData.smtpHost && formData.smtpUser ? (
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                                    <CheckCircle weight="fill" className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-green-900 dark:text-green-100">Configuración Exitosa</h4>
                                                    <p className="text-sm text-green-700 dark:text-green-300">
                                                        Actualmente enviando a través de <strong>{formData.smtpHost}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowEmailWizard(true)}
                                                className="text-sm font-semibold text-green-700 hover:text-green-800 underline decoration-green-300 hover:decoration-green-500 underline-offset-2"
                                            >
                                                Reconfigurar
                                            </button>
                                        </div>
                                    ) : null}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Proveedor</label>
                                            <select
                                                name="emailProvider"
                                                value={formData.emailProvider}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="smtp">SMTP Personalizado</option>
                                                <option value="aws_ses">AWS SES (Próximamente)</option>
                                                <option value="sendgrid">SendGrid (Próximamente)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Host SMTP</label>
                                            <input
                                                type="text"
                                                name="smtpHost"
                                                value={formData.smtpHost}
                                                onChange={handleChange}
                                                placeholder="smtp.ejemplo.com"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Puerto</label>
                                            <input
                                                type="number"
                                                name="smtpPort"
                                                value={formData.smtpPort}
                                                onChange={handleChange}
                                                placeholder="587"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Usuario</label>
                                            <input
                                                type="text"
                                                name="smtpUser"
                                                value={formData.smtpUser}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
                                            <input
                                                type="password"
                                                name="smtpPassword"
                                                value={formData.smtpPassword}
                                                onChange={handleChange}
                                                autoComplete="new-password"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Remitente (From)</label>
                                            <input
                                                type="email"
                                                name="smtpFrom"
                                                value={formData.smtpFrom}
                                                onChange={handleChange}
                                                placeholder="no-reply@tuempresa.com"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <h4 className="text-sm font-bold uppercase text-slate-500 mb-4">Pruebas de Conexión</h4>
                                        <div className="flex flex-col md:flex-row gap-4 items-end">
                                            <div className="flex-1 w-full relative">
                                                <label className="text-xs font-semibold text-slate-500 mb-1.5 ml-1 block">Enviar correo de prueba a:</label>
                                                <div className="relative">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        <EnvelopeSimple />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="testEmailTo"
                                                        value={formData.testEmailTo}
                                                        onChange={handleChange}
                                                        placeholder="tu@email.com"
                                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={handleTestConnection}
                                                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium border border-slate-200 dark:border-slate-700 ${isTestingEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={isTestingEmail || !formData.testEmailTo}
                                                >
                                                    {isTestingEmail ? <SpinnerGap className="animate-spin" /> : <Lightning />}
                                                    {isTestingEmail ? "Probando..." : "Enviar Prueba"}
                                                </button>
                                            </div>
                                        </div>

                                        {testEmailResult && (
                                            <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 text-sm ${testEmailResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {testEmailResult.success ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <WarningCircle className="w-5 h-5 flex-shrink-0" />}
                                                <span>{testEmailResult.message}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === "security" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Políticas de Seguridad</h3>
                                        <p className="text-sm text-slate-500 mb-4">Controla el acceso y la seguridad de los usuarios.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 max-w-2xl">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div>
                                                <h4 className="font-medium text-slate-900 dark:text-white">Autenticación de Dos Factor (MFA)</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Requerir MFA para todos los usuarios administradores.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="mfaRequired"
                                                    checked={formData.mfaRequired}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tiempo de inactividad (minutos)</label>
                                            <input
                                                type="number"
                                                name="sessionTimeout"
                                                value={formData.sessionTimeout}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <p className="text-xs text-slate-500">Sesiones inactivas se cerrarán automáticamente después de este tiempo.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Historial de contraseñas</label>
                                            <input
                                                name="passwordHistory"
                                                value={formData.passwordHistory}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <p className="text-xs text-slate-500">Número de contraseñas anteriores que no pueden ser reutilizadas.</p>
                                        </div>

                                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Complejidad de Contraseñas</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Longitud Mínima</label>
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="range"
                                                            name="passwordMinLength"
                                                            min="6"
                                                            max="20"
                                                            value={formData.passwordMinLength}
                                                            onChange={handleChange}
                                                            className="flex-1"
                                                        />
                                                        <span className="font-bold w-8 text-center">{formData.passwordMinLength}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiración (días)</label>
                                                    <input
                                                        type="number"
                                                        name="passwordExpiryDays"
                                                        value={formData.passwordExpiryDays}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="passwordRequireUppercase"
                                                        checked={formData.passwordRequireUppercase}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Requerir Mayúsculas (A-Z)</span>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="passwordRequireNumbers"
                                                        checked={formData.passwordRequireNumbers}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Requerir Números (0-9)</span>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="passwordRequireSymbols"
                                                        checked={formData.passwordRequireSymbols}
                                                        onChange={handleChange}
                                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Requerir Símbolos (!@#)</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Globe className="w-5 h-5 text-slate-500" />
                                                <h4 className="font-bold text-slate-900 dark:text-white">Restricción de Dominios</h4>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-3">
                                                Si se especifica, solo se permitirán registros/invitaciones de estos dominios. Deja vacío para permitir cualquiera.
                                            </p>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    name="allowedDomains"
                                                    value={formData.allowedDomains}
                                                    onChange={handleChange}
                                                    placeholder="ej: miempresa.com, subsidiaria.com"
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                                />
                                                <p className="text-xs text-slate-400">Separar múltiples dominios con comas.</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}


                            {/* Storage Tab */}
                            {activeTab === "storage" && (
                                <StorageConfigPanel />
                            )}

                            {/* Subscription Tab */}
                            {activeTab === "subscription" && isSuperAdmin && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Suscripción y Pagos</h3>
                                            <p className="text-sm text-slate-500">Gestiona tu plan, método de pago y facturación.</p>
                                        </div>
                                        <button
                                            onClick={handleManageBilling}
                                            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white"
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Gestionar Facturación
                                        </button>
                                    </div>

                                    {/* Usage Limits */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Usuarios Activos</span>
                                                <span className="text-slate-500">5 / {formData.plan === 'STARTER' ? '5' : formData.plan === 'PRO' ? '20' : '∞'}</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[80%] rounded-full" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-700 dark:text-slate-300">Almacenamiento</span>
                                                <span className="text-slate-500">1.2GB / {formData.plan === 'STARTER' ? '5GB' : '50GB'}</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 w-[24%] rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billing Interval Toggle */}
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                                            <button
                                                onClick={() => setFormData((prev: any) => ({ ...prev, billingPeriod: 'monthly' }))}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${formData.billingPeriod === 'monthly' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Mensual
                                            </button>
                                            <button
                                                onClick={() => setFormData((prev: any) => ({ ...prev, billingPeriod: 'yearly' }))}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${formData.billingPeriod === 'yearly' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Anual <span className="ml-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-20%</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pricing Table */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 'STARTER', name: 'Starter', price: 0, features: ['Hasta 5 Usuarios', '5GB Almacenamiento', 'Soporte por Email'] },
                                            { id: 'PRO', name: 'Pro', price: 29, features: ['Hasta 20 Usuarios', '50GB Almacenamiento', 'Soporte Prioritario', 'Analítica Básica'] },
                                            { id: 'ENTERPRISE', name: 'Enterprise', price: 99, features: ['Usuarios Ilimitados', '1TB Almacenamiento', 'Soporte 24/7', 'SSO & Auditoría'] },
                                        ].map(plan => {
                                            const isCurrent = (formData.plan || 'ENTERPRISE') === plan.id;
                                            const price = formData.billingPeriod === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price;

                                            return (
                                                <div key={plan.id} className={`relative p-6 rounded-xl border-2 transition-all ${isCurrent ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 bg-white dark:bg-slate-800'}`}>
                                                    {isCurrent && (
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                            Plan Actual
                                                        </div>
                                                    )}
                                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h4>
                                                    <div className="flex items-baseline gap-1 mb-6">
                                                        <span className="text-3xl font-bold text-slate-900 dark:text-white">${price}</span>
                                                        <span className="text-slate-500">/mes</span>
                                                    </div>
                                                    <ul className="space-y-3 mb-8">
                                                        {plan.features.map((f, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <button
                                                        onClick={() => isCurrent ? null : handleCheckout(plan.id)}
                                                        disabled={isCurrent || isSaving}
                                                        className={`w-full py-2.5 rounded-lg font-bold transition-all ${isCurrent
                                                            ? 'bg-slate-200 text-slate-500 cursor-default'
                                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'}`}
                                                    >
                                                        {isCurrent ? 'Plan Activo' : 'Mejorar Plan'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                    }
                </div >
            </div >

            {/* Preview Modal */}
            {
                showPreviewConfig && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="relative w-full max-w-6xl h-[90vh] bg-transparent rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                            <button
                                onClick={() => setShowPreviewConfig(false)}
                                className="absolute top-4 right-4 z-[110] bg-white text-slate-900 rounded-full p-2 hover:bg-slate-200 transition-colors shadow-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="w-full h-full bg-slate-100 rounded-2xl overflow-hidden">
                                <LoginForm branding={formData} mode="preview" />
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showEmailWizard && (
                    <EmailConfigWizard
                        isOpen={showEmailWizard}
                        onClose={() => setShowEmailWizard(false)}
                        onSave={(config) => {
                            setFormData((prev: any) => ({
                                ...prev,
                                ...config,
                                smtpFrom: config.fromEmail,
                            }));
                            setMessage({ type: 'success', text: 'Configuración aplicada desde el asistente. No olvides guardar.' });
                            setShowEmailWizard(false);
                        }}
                    />
                )
            }
        </div >
    );
}
