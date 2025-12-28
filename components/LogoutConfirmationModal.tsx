'use client';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SignOut } from '@phosphor-icons/react';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LogoutConfirmationModal({ isOpen, onClose }: LogoutConfirmationModalProps) {
    const { logout } = useApp();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!isOpen) return null;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        // Add a small delay for UX so user sees "Saliendo..."
        await new Promise(resolve => setTimeout(resolve, 500));
        await logout();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100 animate-scaleIn" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SignOut size={32} weight="bold" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">¿Cerrar Sesión?</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Estás a punto de salir de tu espacio de trabajo.<br />¿Deseas continuar?
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                            disabled={isLoggingOut}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saliendo...
                                </>
                            ) : (
                                'Cerrar Sesión'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
