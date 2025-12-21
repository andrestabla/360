'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { DB } from '@/lib/data';
import {
    Globe, ShieldCheck, SquaresFour, FloppyDisk, Warning, CheckCircle
} from '@phosphor-icons/react';

export default function PlatformSettingsPage() {
    const { isSuperAdmin, updatePlatformSettings } = useApp();
    const [settings, setSettings] = useState(DB.platformSettings);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Sync with DB on mount in case it changes externally or re-renders
        setSettings({ ...DB.platformSettings });
    }, []);

    if (!isSuperAdmin) {
        return <div className="p-10 text-center text-slate-500">Acceso Restringido: Solo Super Admins.</div>;
    }

    const handleSave = () => {
        updatePlatformSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const toggleModule = (module: string) => {
        const currentModules = settings.defaultModules;
        if (currentModules.includes(module)) {
            setSettings({
                ...settings,
                defaultModules: currentModules.filter(m => m !== module)
            });
        } else {
            setSettings({
                ...settings,
                defaultModules: [...currentModules, module]
            });
        }
    };

    const allModules = ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS', 'SURVEYS', 'ADMIN', 'AUDIT'];

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <SquaresFour className="text-blue-600" weight="duotone" />
                        Parámetros Globales
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Configura los valores por defecto para todos los nuevos tenants de la plataforma.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className={`btn flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-700 text-white' : 'btn-primary'}`}
                >
                    {saved ? <CheckCircle weight="bold" /> : <FloppyDisk weight="bold" />}
                    {saved ? 'Guardado' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="space-y-6">

                {/* 1. Regional Settings */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Globe className="text-blue-500" /> Configuración Regional
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Idioma Predeterminado</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                value={settings.defaultLocale}
                                onChange={e => setSettings({ ...settings, defaultLocale: e.target.value })}
                            >
                                <option value="es-CO">Español (Colombia)</option>
                                <option value="es-mx">Español (México)</option>
                                <option value="en-US">English (US)</option>
                                <option value="pt-BR">Português (Brasil)</option>
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1">Idioma de la interfaz para nuevos usuarios.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Zona Horaria</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 ring-blue-500/20 outline-none transition-all"
                                value={settings.defaultTimezone}
                                onChange={e => setSettings({ ...settings, defaultTimezone: e.target.value })}
                            >
                                <option value="America/Bogota">Bogotá / Lima (GMT-5)</option>
                                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                                <option value="America/New_York">New York (EDT/EST)</option>
                                <option value="America/Santiago">Santiago (GMT-4)</option>
                                <option value="Europe/Madrid">Madrid (CET)</option>
                            </select>
                            <p className="text-[10px] text-slate-400 mt-1">Referencia para logs y fechas del sistema.</p>
                        </div>
                    </div>
                </div>

                {/* 2. Security Policy */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" /> Políticas de Seguridad
                    </h3>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex-1">
                            <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                    checked={settings.authPolicy.enforceSSO}
                                    onChange={e => setSettings({
                                        ...settings,
                                        authPolicy: { ...settings.authPolicy, enforceSSO: e.target.checked }
                                    })}
                                />
                                Forzar Single Sign-On (SSO) por defecto
                            </label>
                            <p className="text-sm text-slate-500 mt-1 ml-7">
                                Si se activa, los nuevos tenants se crearán configurados para requerir autenticación federada (SAML/OIDC) obligatoriamente.
                            </p>
                        </div>
                        {settings.authPolicy.enforceSSO && (
                            <div className="bg-amber-50 text-amber-800 text-xs px-3 py-2 rounded border border-amber-200 flex items-center gap-2 max-w-[200px]">
                                <Warning weight="fill" size={16} />
                                Requiere configuración IdP previa en cada tenant.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Module Templates */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <SquaresFour className="text-indigo-500" /> Plantilla de Módulos (Default)
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                        Selecciona qué módulos se habilitarán automáticamente al crear una nueva organización.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {allModules.map(module => (
                            <label key={module} className={`
                                flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none
                                ${settings.defaultModules.includes(module)
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                            `}>
                                <div className={`
                                    w-5 h-5 rounded flex items-center justify-center border transition-colors
                                    ${settings.defaultModules.includes(module) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'}
                                `}>
                                    {settings.defaultModules.includes(module) && <CheckCircle size={14} weight="bold" />}
                                </div>
                                <span className="font-medium text-xs">
                                    {{
                                        'DASHBOARD': 'Dashboard',
                                        'WORKFLOWS': 'Flujos de Trabajo',
                                        'REPOSITORY': 'Gestión Documental',
                                        'CHAT': 'Comunicación',
                                        'ANALYTICS': 'Métricas & KPIs',
                                        'SURVEYS': 'Clima & Encuestas',
                                        'ADMIN': 'Administración',
                                        'AUDIT': 'Auditoría'
                                    }[module] || module}
                                </span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={settings.defaultModules.includes(module)}
                                    onChange={() => toggleModule(module)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
