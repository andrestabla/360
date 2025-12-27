'use client';
import { useApp } from '@/context/AppContext';
import { Cube, Planet, Buildings, User, GoogleLogo, WindowsLogo, LockKey, Envelope, Eye, EyeSlash, SpinnerGap } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthScreen({ forceLoginMode = false }: { forceLoginMode?: boolean }) {
    const { login, platformSettings } = useApp();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Use login function from context directly which handles API call and state override
            const result = await login(email, password);

            if (!result.success) {
                setError(result.error || 'Error de autenticación');
                return;
            }

            // Login successful, redirect handled by context login function
        } catch (err) {
            setError('Error de conexión. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const branding = platformSettings?.branding || {};
    const primaryColor = branding.primaryColor || '#4f46e5';
    const bgColor = branding.loginBackgroundColor || '#f8fafc';
    const bgImage = branding.loginBackgroundImage ? `url(${branding.loginBackgroundImage})` : 'none';

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-500 bg-cover bg-center"
            style={{
                backgroundColor: bgColor,
                backgroundImage: bgImage
            }}
        >
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            <div className="absolute top-0 left-0 w-full h-1.5 z-50 transition-colors duration-500" style={{ backgroundColor: primaryColor }}></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden border border-slate-100 m-4 animate-scaleIn">
                <div className="p-10 pb-6 text-center">
                    <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-6 grid place-items-center text-white text-3xl shadow-xl transition-all duration-500 overflow-hidden bg-slate-100 relative"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {branding.logoUrl ? (
                            <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                            <Planet weight="fill" />
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {branding.appTitle || 'Maturity 360'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        {branding.portalDescription || 'Plataforma de Madurez Digital'}
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <form onSubmit={handleLogin} className="space-y-4 animate-slideLeft">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${email ? 'hidden' : ''}`}>
                                    <Envelope size={18} />
                                </div>
                                <input
                                    type="email"
                                    className={`w-full ${email ? 'pl-4' : 'pl-10'} pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm`}
                                    placeholder="usuario@empresa.com"
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

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
                            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}40` }}
                        >
                            {isLoading ? (
                                <>
                                    <SpinnerGap className="w-5 h-5 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="absolute bottom-6 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Maturity 360</span>
            </div>
        </div>
    );
}
