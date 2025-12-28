'use client';

// @ts-ignore
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { authenticate } from '@/app/lib/actions';
import { Envelope, LockKey, SpinnerGap, Eye, EyeSlash, Planet, CheckCircle } from '@phosphor-icons/react';
import { useState, Suspense } from 'react';

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110 disabled:opacity-70 bg-blue-600 shadow-blue-600/40"
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

function LoginForm() {
    // @ts-ignore
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const searchParams = useSearchParams();
    const passwordChanged = searchParams.get('passwordChanged') === 'true';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl z-10 overflow-hidden border border-slate-100 m-4 animate-scaleIn">
                <div className="p-10 pb-6 text-center">
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-6 grid place-items-center text-white text-3xl shadow-xl bg-blue-600">
                        <Planet weight="fill" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maturity 360</h1>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">Portal de colaboradores</p>
                </div>

                <div className="px-8 pb-8">
                    <form action={dispatch} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                {!email && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <Envelope size={18} />
                                    </div>
                                )}
                                <input
                                    className={`w-full ${email ? 'pl-4' : 'pl-10'} pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm`}
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder={!email ? "usuario@empresa.com" : ""}
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase">Contraseña</label>
                            </div>
                            <div className="relative">
                                {!password && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <LockKey size={18} />
                                    </div>
                                )}
                                <input
                                    className={`w-full ${password ? 'pl-4' : 'pl-10'} pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm`}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder={!password ? "••••••••" : ""}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <LoginButton />
                    </form>
                </div>
            </div>

            <div className="mt-8 text-center animate-fadeIn z-10">
                <p className="text-xs text-slate-500 font-medium mb-3">Es una solución digital de Algoritmo</p>
                <img
                    src="https://www.algoritmot.com/wp-content/uploads/2022/08/Recurso-8-1536x245.png"
                    alt="Algoritmo"
                    className="h-8 mx-auto opacity-80 hover:opacity-100 transition-opacity"
                />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
