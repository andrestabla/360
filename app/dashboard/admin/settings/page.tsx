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
import { updateOrganizationBranding } from '@/app/lib/actions';
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
        // Hydrate form data from platform settings on load
        if (platformSettings) {
            setFormData((prev: any) => ({
                ...prev,
                plan: platformSettings.plan || "ENTERPRISE",
                customModules: platformSettings.defaultModules || ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'],
                appTitle: platformSettings.branding?.appTitle || "Algoritmo",
                portalDescription: platformSettings.branding?.portalDescription || "",
                supportMessage: platformSettings.branding?.supportMessage || "",
                primaryColor: platformSettings.branding?.primaryColor || "#3b82f6",
                loginBackgroundColor: platformSettings.branding?.loginBackgroundColor || "#ffffff",
                loginBackgroundImage: platformSettings.branding?.loginBackgroundImage || "/images/auth/login-bg-3.jpg",
                logoUrl: platformSettings.branding?.logoUrl || "",
                faviconUrl: platformSettings.branding?.faviconUrl || "",
            }));
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [platformSettings]);

    const [isPending, startTransition] = React.useTransition();

    const handleSave = () => {
        setIsSaving(true);
        setMessage(null);

        // Optimistic UI update
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

        // Server Action
        startTransition(async () => {
            const result = await updateOrganizationBranding({
                appTitle: formData.appTitle,
                portalDescription: formData.portalDescription,
                supportMessage: formData.supportMessage,
                primaryColor: formData.primaryColor,
                loginBackgroundColor: formData.loginBackgroundColor,
                loginBackgroundImage: formData.loginBackgroundImage,
                logoUrl: formData.logoUrl,
                faviconUrl: formData.faviconUrl
            });

            if (result.success) {
                setMessage({ type: 'success', text: 'Configuración guardada en servidor exitosamente' });
            } else {
                setMessage({ type: 'error', text: 'Error al guardar en servidor: ' + result.error });
            }
            setIsSaving(false);
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
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
                                Suscripción
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
                                                        value={testEmail}
                                                        onChange={(e) => setTestEmail(e.target.value)}
                                                        placeholder="tu@email.com"
                                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={async () => {
                                                        setIsTesting(true);
                                                        try {
                                                            const res = await fetch('/api/admin/email-config/test', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                // Send current form data to test without saving first
                                                                body: JSON.stringify({ ...formData, isDraft: true })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setMessage({ type: 'success', text: data.message || 'Conexión SMTP exitosa.' });
                                                            } else {
                                                                setMessage({ type: 'error', text: data.error || 'Error al conectar con SMTP.' });
                                                            }
                                                        } catch (e) {
                                                            setMessage({ type: 'error', text: 'Error de conexión.' });
                                                        } finally {
                                                            setIsTesting(false);
                                                        }
                                                    }}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium border border-slate-200 dark:border-slate-700"
                                                    disabled={isTesting}
                                                >
                                                    {isTesting ? <SpinnerGap className="animate-spin" /> : <Lightning />}
                                                    Probar Conexión
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!testEmail) {
                                                            setMessage({ type: 'error', text: 'Ingresa un email para la prueba.' });
                                                            return;
                                                        }
                                                        setIsTesting(true);
                                                        try {
                                                            const res = await fetch('/api/admin/email-config/test', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                // Use sendTestTo to trigger actual email send
                                                                body: JSON.stringify({ ...formData, sendTestTo: testEmail, isDraft: true })
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setMessage({ type: 'success', text: `Correo enviado a ${testEmail}` });
                                                            } else {
                                                                setMessage({ type: 'error', text: data.error || 'Error al enviar correo.' });
                                                            }
                                                        } catch (e) {
                                                            setMessage({ type: 'error', text: 'Error de conexión.' });
                                                        } finally {
                                                            setIsTesting(false);
                                                        }
                                                    }}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                                                    disabled={isTesting || !testEmail}
                                                >
                                                    {isTesting ? <SpinnerGap className="animate-spin" /> : <PaperPlaneRight />}
                                                    Enviar Prueba
                                                </button>
                                            </div>
                                        </div>
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
                                                type="number"
                                                name="passwordHistory"
                                                value={formData.passwordHistory}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                            <p className="text-xs text-slate-500">Número de contraseñas anteriores que no pueden ser reutilizadas.</p>
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
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">Plan de Suscripción</h3>
                                        <p className="text-sm text-slate-500 mb-4">Gestiona el plan actual y las características habilitadas.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {[
                                            { id: 'STARTER', name: 'Plan Starter', price: '$0/mes', features: ['Usuarios Limitados', 'Soporte Básico'] },
                                            { id: 'PRO', name: 'Plan Pro', price: '$49/mes', features: ['Usuarios Ilimitados', 'Soporte Prioritario', 'Analítica Avanzada'] },
                                            { id: 'ENTERPRISE', name: 'Plan Enterprise', price: 'Personalizado', features: ['Todo Ilimitado', 'Soporte 24/7', 'Auditoría Global', 'SSO'] },
                                            { id: 'CUSTOM', name: 'Personalizado', price: 'A Medida', features: ['Configuración Especial', 'Infraestructura Dedicada'] }
                                        ].map(plan => (
                                            <div
                                                key={plan.id}
                                                onClick={() => setFormData((prev: any) => ({ ...prev, plan: plan.id }))}
                                                className={`cursor-pointer rounded-xl border p-4 transition-all ${(formData.plan || 'ENTERPRISE') === plan.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                                                    {(formData.plan || 'ENTERPRISE') === plan.id && <CheckCircle className="text-blue-600 w-5 h-5" weight="fill" />}
                                                </div>
                                                <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{plan.price}</div>
                                                <ul className="space-y-2">
                                                    {plan.features.map((f, i) => (
                                                        <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Custom Plan Module Selection */}
                                    {formData.plan === 'CUSTOM' && (
                                        <div className="mt-6 p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <h4 className="text-md font-semibold mb-4 flex items-center gap-2">
                                                <Gear className="text-slate-500" />
                                                Configuración de Módulos (Plan Personalizado)
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS', 'SURVEYS'].map(module => (
                                                    <label key={module} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-blue-400 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.customModules?.includes(module)}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setFormData((prev: any) => ({
                                                                    ...prev,
                                                                    customModules: checked
                                                                        ? [...(prev.customModules || []), module]
                                                                        : (prev.customModules || []).filter((m: string) => m !== module)
                                                                }));
                                                            }}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <span className="text-sm font-medium capitalize">{module.toLowerCase()}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-4">
                                                Seleccione los módulos que estarán disponibles para esta organización bajo el plan personalizado.
                                            </p>
                                        </div>
                                    )}

                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                                        <WarningCircle className="w-5 h-5 flex-shrink-0" />
                                        <p>
                                            Cambiar el plan puede afectar la disponibilidad de módulos y límites de usuarios.
                                            Los cambios se aplicarán inmediatamente.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {showPreviewConfig && (
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
            )}

            {showEmailWizard && (
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
            )}
        </div>
    );
}
