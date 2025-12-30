'use client';

// @ts-ignore
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { changePassword } from '@/app/lib/actions';
import { LockKey, Key, SpinnerGap } from '@phosphor-icons/react';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="w-full text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110 disabled:opacity-70 bg-amber-600 shadow-amber-600/40"
            aria-disabled={pending}
            disabled={pending}
            type="submit"
        >
            {pending ? (
                <>
                    <SpinnerGap className="w-5 h-5 animate-spin" />
                    Actualizando...
                </>
            ) : (
                'Actualizar Contraseña'
            )}
        </button>
    );
}

export default function ChangePasswordPage() {
    // @ts-ignore
    const [errorMessage, dispatch] = useActionState(changePassword, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 pb-6 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 grid place-items-center text-amber-600 bg-amber-100">
                        <Key size={32} weight="fill" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Seguridad de la Cuenta</h1>
                    <p className="text-slate-500 text-sm mt-2">
                        Por motivos de seguridad, debes cambiar tu contraseña antes de continuar.
                    </p>
                </div>

                <div className="px-8 pb-8">
                    <form action={dispatch} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Nueva Contraseña</label>
                            <div className="relative group">
                                <input
                                    className="peer w-full pl-10 placeholder-shown:pl-10 focus:pl-4 not-placeholder-shown:pl-4 py-2.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-slate-800 text-sm"
                                    type="password"
                                    name="newPassword"
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    minLength={8}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                                    <LockKey size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Confirmar Contraseña</label>
                            <div className="relative group">
                                <input
                                    className="peer w-full pl-10 placeholder-shown:pl-10 focus:pl-4 not-placeholder-shown:pl-4 py-2.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all outline-none text-slate-800 text-sm"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Repite la contraseña"
                                    required
                                    minLength={8}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-200 peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                                    <LockKey size={18} />
                                </div>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}
