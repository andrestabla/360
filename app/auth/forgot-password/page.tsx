'use client';

import { Envelope, ArrowLeft } from '@phosphor-icons/react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 pb-6 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center text-blue-600 bg-blue-100">
                        <Envelope size={32} weight="fill" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Recuperar Contraseña</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Ingresa tu email y te enviaremos instrucciones.
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <form className="space-y-4" action={async (formData) => {
                        // Implementation pending integration with email provider
                        alert('Funcionalidad de correo pendiente de configuración SMTP/Resend.');
                    }}>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Envelope size={18} />
                                </div>
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 text-sm"
                                    type="email"
                                    name="email"
                                    placeholder="usuario@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110 bg-blue-600 shadow-blue-600/40"
                            type="submit"
                        >
                            Enviar Link de Recuperación
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2">
                                <ArrowLeft /> Volver al Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
