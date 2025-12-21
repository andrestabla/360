'use client';

import { useState } from 'react';
import { Info, X, CheckCircle, Warning, Lightbulb } from '@phosphor-icons/react';

export interface GuideStep {
    title: string;
    description: string;
    type?: 'info' | 'warning' | 'tip';
}

export interface AdminGuideProps {
    title: string;
    description: string;
    steps: GuideStep[];
    tips?: string[];
}

export default function AdminGuide({ title, description, steps, tips }: AdminGuideProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (type?: string) => {
        switch (type) {
            case 'warning':
                return <Warning size={20} className="text-amber-600" weight="fill" />;
            case 'tip':
                return <Lightbulb size={20} className="text-yellow-600" weight="fill" />;
            default:
                return <CheckCircle size={20} className="text-blue-600" weight="fill" />;
        }
    };

    const getColor = (type?: string) => {
        switch (type) {
            case 'warning':
                return 'bg-amber-50 border-amber-200';
            case 'tip':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <>
            {/* Floating Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 z-40 flex items-center gap-2 group"
                title="Ver Guía de Ayuda"
            >
                <Info size={24} weight="fill" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
                    Guía de Ayuda
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Info size={32} weight="fill" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{title}</h2>
                                    <p className="text-blue-100 text-sm mt-1">{description}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={24} weight="bold" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Steps */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <CheckCircle size={24} className="text-green-600" weight="fill" />
                                    Pasos a Seguir
                                </h3>
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded-lg p-4 ${getColor(step.type)}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getIcon(step.type)}
                                                    <h4 className="font-bold text-slate-800">{step.title}</h4>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tips */}
                            {tips && tips.length > 0 && (
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2 mb-4">
                                        <Lightbulb size={24} className="text-purple-600" weight="fill" />
                                        Consejos Útiles
                                    </h3>
                                    <ul className="space-y-3">
                                        {tips.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <p className="text-sm text-purple-900 leading-relaxed">{tip}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Footer Note */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <p className="text-xs text-slate-600 text-center">
                                    💡 <strong>Nota:</strong> Si necesitas ayuda adicional, contacta al equipo de soporte técnico.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
