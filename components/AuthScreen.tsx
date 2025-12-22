'use client';
import { useApp } from '@/context/AppContext';
import { Cube, Planet, Buildings, User, GoogleLogo, WindowsLogo, LockKey, Envelope, Eye, EyeSlash } from '@phosphor-icons/react';
import { DB } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { TenantBranding } from '@/lib/data';

interface AuthScreenProps {
    forceLoginMode?: boolean;
    previewBranding?: Partial<TenantBranding>;
    tenantSlug?: string;
}

export default function AuthScreen({ forceLoginMode = false, previewBranding, tenantSlug }: AuthScreenProps) {
    const { login } = useApp();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    // Multi-tenant Logic - Default to LOGIN for main domain (superadmin)
    const [mode, setMode] = useState<'FIND' | 'LOGIN'>('LOGIN');
    const [detectedTenant, setDetectedTenant] = useState<any>(null);
    const [workspaceDomain, setWorkspaceDomain] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // If tenantSlug is provided via props (from /tenant/[slug] route), use it directly
        if (tenantSlug) {
            const t = DB.tenants.find(ten => ten.slug?.toLowerCase() === tenantSlug.toLowerCase());
            if (t) {
                setDetectedTenant(t);
                setMode('LOGIN');
            }
            return;
        }
        
        // Main domain: always show superadmin login directly
        setMode('LOGIN');
    }, [forceLoginMode, tenantSlug]);

    const handleFindWorkspace = (e: React.FormEvent) => {
        e.preventDefault();
        const t = DB.tenants.find(ten => ten.slug?.toLowerCase() === workspaceDomain.toLowerCase());
        if (t) {
            // Redirect to path-based tenant URL
            router.push(`/${t.slug}`);
        } else {
            alert('Espacio de trabajo no encontrado. Verifica el nombre de tu empresa.');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Tenant Login
        if (detectedTenant) {
            // Find user in DB if exists to determine exact role
            const user = DB.users.find(u => u.tenantId === detectedTenant.id && u.email?.toLowerCase() === email.toLowerCase());
            const role = user ? (user.level === 1 ? 'admin' : 'user') : (email.toLowerCase().includes('admin') ? 'admin' : 'user');

            login(role, detectedTenant.id, email);
        } else {
            // 2. Main Domain -> Super Admin Login
            // Check in platform admins OR fallback to string check
            const isPlatformAdmin = DB.platformAdmins.some(a => a.email.toLowerCase() === email.toLowerCase());

            if (isPlatformAdmin || email.toLowerCase().includes('admin')) {
                login('superadmin', undefined, email);
            } else {
                alert('En el dominio principal solo pueden ingresar Super Admins. Para ingresar a una empresa, usa su subdominio.');
            }
        }
    };

    const effectiveBranding = previewBranding || detectedTenant?.branding;
    const primaryColor = effectiveBranding?.primary_color || (detectedTenant ? '#4f46e5' : '#0f172a');
    const bgColor = effectiveBranding?.login_bg_color || '#f8fafc';
    const bgImage = effectiveBranding?.login_bg_image;

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-cover bg-center"
            style={{
                backgroundColor: bgColor,
                backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bgImage})` : undefined
            }}
        >
            {/* Background decoration - only show if no image */}
            {!bgImage && <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>}
            <div className="absolute top-0 left-0 w-full h-1.5 z-50 transition-colors duration-500" style={{ backgroundColor: primaryColor }}></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden border border-slate-100 m-4 animate-scaleIn">
                <div className="p-10 pb-6 text-center">
                    {/* Dynamic Logo */}
                    <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-6 grid place-items-center text-white text-3xl shadow-xl transition-all duration-500 overflow-hidden bg-slate-100"
                        style={{ backgroundColor: !effectiveBranding?.logo_url ? primaryColor : 'white' }}
                    >
                        {effectiveBranding?.logo_url ? (
                            <img src={effectiveBranding.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                            detectedTenant ? <Buildings weight="fill" /> : <Planet weight="fill" />
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {effectiveBranding?.app_title || (detectedTenant ? detectedTenant.name : 'Platform Admin')}
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        {effectiveBranding?.login_description || (detectedTenant ? 'Portal de Colaboradores' : 'Acceso Super Administrador')}
                    </p>
                </div>

                <div className="px-8 pb-8">
                        <form onSubmit={handleLogin} className="space-y-4 animate-slideLeft">
                            {detectedTenant && tenantSlug && (
                                <button type="button" onClick={() => router.push('/')} className="text-xs text-blue-600 hover:underline mb-2 block mx-auto">
                                    ← Volver al inicio
                                </button>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Email {detectedTenant ? 'Corporativo' : 'Administrador'}</label>
                                <div className="relative">
                                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${email ? 'hidden' : ''}`}>
                                        <Envelope size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        className={`w-full ${email ? 'pl-4' : 'pl-10'} pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm`}
                                        placeholder={detectedTenant ? `usuario@${detectedTenant.slug}.com` : 'admin@plataforma.com'}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5 ml-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase">Contraseña</label>
                                    <button type="button" onClick={() => router.push('/auth/forgot-password')} className="text-xs font-medium text-blue-600 hover:text-blue-700">¿Olvidaste tu contraseña?</button>
                                </div>
                                <div className="relative">
                                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${password ? 'hidden' : ''}`}>
                                        <LockKey size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full ${password ? 'pl-4' : 'pl-10'} pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm`}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110"
                                style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` }}
                            >
                                {detectedTenant ? 'Iniciar Sesión' : 'Acceder al Panel'}
                            </button>

                            {effectiveBranding?.support_message && (
                                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p
                                        className="text-center text-xs text-slate-500 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: effectiveBranding.support_message.replace(/(IT@empresa\.com)/g, '<a href="mailto:$1" class="text-blue-600 font-bold hover:underline">$1</a>') }}
                                    ></p>
                                </div>
                            )}
                        </form>

                    {/* Social Login (Only if SSO enabled for Tenant) */}
                    {detectedTenant && mode === 'LOGIN' && (detectedTenant.policies?.sso_enabled ?? true) && (
                        <div className="mt-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">O continúa con</span></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {(!detectedTenant.policies?.sso_providers || detectedTenant.policies.sso_providers.includes('google')) && (
                                    <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium"><GoogleLogo size={18} className="text-red-500" /> Google</button>
                                )}
                                {(!detectedTenant.policies?.sso_providers || detectedTenant.policies.sso_providers.includes('microsoft')) && (
                                    <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-sm font-medium"><WindowsLogo size={18} className="text-blue-500" /> Entra ID</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>


            </div>

            {/* Simulation Info */}
            {mounted && (
                <div className="absolute top-4 right-4 bg-yellow-50 text-yellow-800 text-[10px] px-2 py-1 rounded border border-yellow-200 opacity-70 hover:opacity-100 transition-opacity">
                    Host: {window.location.hostname} <br />
                    Context: {detectedTenant ? `Tenant (${detectedTenant.id})` : 'Main Domain'}
                </div>
            )}

            <div className="absolute bottom-6 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Es una solución digital de</span>
                {/* Logo is white, so we invert it for the light background */}
                <img
                    src="https://imageneseiconos.s3.us-east-1.amazonaws.com/iconos/Logo_white.png"
                    alt="Algoritmo T"
                    className="h-5 w-auto invert"
                />
            </div>
        </div>
    );
}
