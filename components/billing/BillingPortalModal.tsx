
import React, { useState, useEffect } from 'react';
import { X, CreditCard, ArrowSquareOut, FloppyDisk, Key } from '@phosphor-icons/react';
import { updateStripeConfig, getOrganizationSettings } from '@/app/lib/actions';

interface BillingPortalModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail?: string;
}

export default function BillingPortalModal({ isOpen, onClose }: BillingPortalModalProps) {
    const [config, setConfig] = useState({
        secretKey: '',
        webhookSecret: '',
        priceIdPro: '',
        priceIdEnterprise: '',
        nextAuthUrl: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Load initial config
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getOrganizationSettings().then((settings) => {
                if (settings?.stripeConfig) {
                    setConfig(settings.stripeConfig as any);
                } else {
                    // Default URL if empty
                    setConfig(prev => ({ ...prev, nextAuthUrl: window.location.origin }));
                }
                setIsLoading(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateStripeConfig(config);
        if (result.success) {
            // Maybe show toast? For now close/simple
            onClose();
        } else {
            alert("Error al guardar: " + result.error);
        }
        setIsSaving(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                        <Key className="text-violet-600" />
                        Configuración de Stripe (Test Mode)
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Stripe Secret Key (Test)</label>
                                    <input
                                        type="password"
                                        name="secretKey"
                                        value={config.secretKey}
                                        onChange={handleChange}
                                        placeholder="sk_test_..."
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Webhook Secret</label>
                                    <input
                                        type="password"
                                        name="webhookSecret"
                                        value={config.webhookSecret}
                                        onChange={handleChange}
                                        placeholder="whsec_..."
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Price ID (Pro Plan)</label>
                                    <input
                                        type="text"
                                        name="priceIdPro"
                                        value={config.priceIdPro}
                                        onChange={handleChange}
                                        placeholder="price_..."
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500">Price ID (Enterprise Plan)</label>
                                    <input
                                        type="text"
                                        name="priceIdEnterprise"
                                        value={config.priceIdEnterprise}
                                        onChange={handleChange}
                                        placeholder="price_..."
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-500">App URL (NEXTAUTH_URL)</label>
                                    <input
                                        type="text"
                                        name="nextAuthUrl"
                                        value={config.nextAuthUrl}
                                        onChange={handleChange}
                                        placeholder="http://localhost:3000"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </>
                    )}

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
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Guardando...' : (
                            <>
                                <FloppyDisk className="w-4 h-4" />
                                Guardar Keys
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
