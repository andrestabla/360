
import React, { useState } from 'react';
import { X, Receipt, CreditCard, ArrowSquareOut, FloppyDisk } from '@phosphor-icons/react';

interface BillingPortalModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail?: string;
}

export default function BillingPortalModal({ isOpen, onClose, currentEmail = '' }: BillingPortalModalProps) {
    const [email, setEmail] = useState(currentEmail);
    const [taxId, setTaxId] = useState('');
    const [address, setAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        // Mock save
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        onClose();
    };

    const handleOpenPortal = () => {
        // Mock portal
        window.open('https://billing.stripe.com/p/login/test', '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                        <Receipt className="text-blue-600" />
                        Configuración de Facturación
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Invoice Details */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase text-slate-500">Datos de Facturación</h4>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Correo para Facturas</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="contabilidad@empresa.com"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">NIT / Tax ID</label>
                                <input
                                    type="text"
                                    value={taxId}
                                    onChange={(e) => setTaxId(e.target.value)}
                                    placeholder="900.123.456-7"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Código Postal</label>
                                <input
                                    type="text"
                                    placeholder="110111"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dirección Fiscal</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={2}
                                placeholder="Calle 123 # 45-67, Bogotá, Colombia"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Portal Link */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-semibold uppercase text-slate-500 mb-4">Método de Pago</h4>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm text-slate-600 dark:text-slate-300">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Visa terminada en 4242</p>
                                    <p className="text-xs text-slate-500">Expira 12/28</p>
                                </div>
                            </div>
                            <button
                                onClick={handleOpenPortal}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                            >
                                Gestionar en Stripe
                                <ArrowSquareOut />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Guardando...' : (
                            <>
                                <FloppyDisk className="w-4 h-4" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
