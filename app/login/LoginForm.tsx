'use client';

// @ts-ignore
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { authenticate } from '@/app/lib/actions';
import { Envelope, LockKey, SpinnerGap, Eye, EyeSlash, Planet, CheckCircle } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

function LoginButton({ primaryColor }: { primaryColor?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110 disabled:opacity-70"
            style={{
                backgroundColor: primaryColor || '#2563eb',
                boxShadow: `0 10px 15px -3px ${primaryColor || '#2563eb'}40`
            }}
            aria-disabled={pending}
            disabled={pending}
            type="submit"
        >
            {pending ? (
                <>
                    <SpinnerGap className="w-5 h-5 animate-spin" />
                    Verificando...
                </>
            ) : (
                'Iniciar Sesión'
            )}
        </button>
    );
}

export default function LoginForm({ branding }: { branding?: any }) {
    // @ts-ignore
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const searchParams = useSearchParams();
    const passwordChanged = searchParams.get('passwordChanged') === 'true';

    // Defaults
    const appTitle = branding?.appTitle || "Algoritmo";
    const portalDescription = branding?.portalDescription || "Portal de colaboradores";
    const primaryColor = branding?.primaryColor || "#2563eb";
    const logoUrl = branding?.logoUrl;
    const loginBg = branding?.loginBackgroundImage || "/images/auth/login-bg-3.jpg";
    const loginColor = branding?.loginBackgroundColor || "#ffffff";

    // Inject CSS for primary color on mount
    useEffect(() => {
        if (primaryColor) {
            document.documentElement.style.setProperty('--primary', primaryColor);
        }
    }, [primaryColor]);

    // Handle background style
    const bgStyle = loginBg
        ? { backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { backgroundColor: loginColor };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Dynamic Background Overlay */}
            <div className={`absolute inset-0 z-0 ${loginBg ? 'opacity-40' : 'opacity-100'}`} style={bgStyle}>
                {/* Only apply pattern if NO image is set, or adds overly if image IS set? 
                    Let's follow the design: if image, shows image. If color, shows color. 
                    The previous design had a radial gradient. Let's keep a subtle overlay.
                 */}
                {!loginBg && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>}
            </div>
            {/* Dark overlay if image is present to ensure contrast */}
            {loginBg && <div className="absolute inset-0 z-0 bg-black/30 backdrop-blur-[2px]"></div>}

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden border border-slate-100 m-4 animate-scaleIn">
                <div className="p-10 pb-6 text-center">
                    <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-6 grid place-items-center text-white text-3xl shadow-xl"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain brightness-0 invert" />
                        ) : (
                            <Planet weight="fill" />
                        )}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{appTitle}</h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{portalDescription}</p>
                </div>

                <div className="px-8 pb-8">
                    <form action={dispatch} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
                            <div className="relative group">
                                <input
                                    className="peer w-full pl-10 placeholder-shown:pl-10 focus:pl-4 not-placeholder-shown:pl-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm"
                                    style={{ borderColor: 'var(--slate-200)' }} /* Tailwind arbitrary val won't pick up var easily without class, standard style ok */
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="usuario@empresa.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                                    <Envelope size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase">Contraseña</label>
                            </div>
                            <div className="relative group">
                                <input
                                    className="peer w-full pl-10 placeholder-shown:pl-10 focus:pl-4 not-placeholder-shown:pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm"
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                                    <LockKey size={18} />
                                </div>
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {passwordChanged && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                                <CheckCircle size={18} weight="fill" />
                                <p>Contraseña actualizada. Inicia sesión con tu nueva contraseña.</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <LoginButton primaryColor={primaryColor} />
                    </form>
                </div>
            </div>

            <div className="mt-8 text-center animate-fadeIn z-10">
                <p className="text-xs text-slate-500 font-medium mb-3">Es una solución digital de Algoritmo</p>
                <img
                    src="https://www.algoritmot.com/wp-content/uploads/2022/08/Recurso-8-1536x245.png"
                    alt="Algoritmo" // This footer logo can remain static or configurable if requested. Stick to static for now as per image.
                    className="h-8 mx-auto opacity-80 hover:opacity-100 transition-opacity"
                />
            </div>
        </div>
    );
}
