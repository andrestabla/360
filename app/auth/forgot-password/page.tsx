'use client';
import { ArrowLeft, Envelope } from '@phosphor-icons/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl z-10 overflow-hidden border border-slate-100 m-4 relative">
                <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>

                <div className="p-8 pb-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Recuperar Contraseña</h1>
                    <p className="text-slate-500 text-sm mt-1">Te enviaremos un enlace de recuperación</p>
                </div>

                <div className="px-8 pb-8">
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Email Corporativo</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Envelope size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm"
                                        placeholder="usuario@empresa.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-600/20 mt-2">
                                Enviar Enlace
                            </button>
                        </form>
                    ) : (
                        <div className="text-center animate-fadeIn">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 grid place-items-center text-3xl">
                                <Envelope weight="duotone" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">¡Correo Enviado!</h3>
                            <p className="text-slate-600 text-sm mt-2 mb-6">Hemos enviado las instrucciones a tu correo electrónico. Por favor verifica tu bandeja de entrada.</p>
                            <button onClick={() => router.push('/')} className="text-blue-600 font-medium hover:underline text-sm">
                                Volver al Inicio
                            </button>
                        </div>
                    )}

                    {!sent && (
                        <div className="mt-6 text-center">
                            <p className="text-xs text-slate-500">
                                ¿Recordaste tu clave? <Link href="/" className="text-blue-600 font-medium hover:underline">Inicia Sesión</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
