'use client';

import { X, CheckCircle, Copy, Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';

interface UserCreatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    temporaryPassword?: string;
    emailSent: boolean;
}

export default function UserCreatedModal({
    isOpen,
    onClose,
    userEmail,
    temporaryPassword,
    emailSent
}: UserCreatedModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-full">
                                <CheckCircle size={32} weight="fill" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">¡Usuario Creado!</h2>
                                <p className="text-green-100 text-sm mt-1">
                                    {emailSent ? 'Email de bienvenida enviado' : 'Credenciales generadas'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {emailSent ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-900 text-sm">
                                Se ha enviado un correo de bienvenida a <strong>{userEmail}</strong> con sus credenciales de acceso.
                            </p>
                        </div>
                    ) : temporaryPassword ? (
                        <>
                            <p className="text-slate-700">
                                Credenciales generadas para <strong>{userEmail}</strong>. Asegúrate de compartir la contraseña temporal de forma segura.
                            </p>

                            {/* Credentials Box */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                                        Usuario (Email)
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={userEmail}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm"
                                        />
                                        <button
                                            onClick={() => handleCopy(userEmail, 'email')}
                                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                            title="Copiar email"
                                        >
                                            {copiedField === 'email' ? (
                                                <CheckCircle size={20} weight="fill" className="text-green-600" />
                                            ) : (
                                                <Copy size={20} className="text-slate-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">
                                        Contraseña Temporal
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={temporaryPassword}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-sm"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                            title={showPassword ? 'Ocultar' : 'Mostrar'}
                                        >
                                            {showPassword ? (
                                                <EyeSlash size={20} className="text-slate-600" />
                                            ) : (
                                                <Eye size={20} className="text-slate-600" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(temporaryPassword, 'password')}
                                            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                            title="Copiar contraseña"
                                        >
                                            {copiedField === 'password' ? (
                                                <CheckCircle size={20} weight="fill" className="text-green-600" />
                                            ) : (
                                                <Copy size={20} className="text-slate-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-amber-900 text-sm">
                                    <strong>Nota de seguridad:</strong> El usuario deberá cambiar esta contraseña en su primer inicio de sesión.
                                </p>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-4 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}
