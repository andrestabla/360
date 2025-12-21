'use client';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { Check, Star } from '@phosphor-icons/react';

export default function PricingPage() {
    return (
        <div className="h-screen overflow-y-auto bg-slate-950 font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            <main className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Planes Flexibles para <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Cualquier Escala</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Comienza pequeño y escala a medida que tu organización crece. Sin costos ocultos.
                        </p>
                    </div>

                    {/* Pricing Implementation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">

                        {/* Starter */}
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 relative group">
                            <h3 className="text-xl font-bold text-white mb-2">Startup</h3>
                            <div className="text-4xl font-black text-white mb-6">$49 <span className="text-sm font-medium text-slate-500">/mes</span></div>
                            <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
                                Para equipos pequeños que inician su transformación digital.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Hasta 10 Usuarios</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> 2GB Almacenamiento</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Workflows Básicos</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Chat de Equipo</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Encuestas Básicas</li>
                            </ul>
                            <button className="w-full py-3 rounded-xl border border-slate-700 font-bold text-white hover:bg-slate-800 transition-colors">
                                Comenzar Prueba
                            </button>
                        </div>

                        {/* Pro (Highlighted) */}
                        <div className="bg-slate-900 rounded-3xl p-8 border-2 border-blue-600 relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/20 z-10">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">Más Popular</div>
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Scale <Star weight="fill" className="text-amber-400" size={16} /></h3>
                            <div className="text-4xl font-black text-white mb-6">$199 <span className="text-sm font-medium text-slate-500">/mes</span></div>
                            <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
                                La suite completa para empresas en crecimiento y medianas organizaciones.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="text-blue-400" weight="bold" /> Hasta 50 Usuarios</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="text-blue-400" weight="bold" /> 50GB Almacenamiento</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="text-blue-400" weight="bold" /> Workflows Ilimitados</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="text-blue-400" weight="bold" /> Analítica Avanzada</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="text-blue-400" weight="bold" /> Encuestas Ilimitadas & NPS</li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium"><Check className="text-blue-400" weight="bold" /> Soporte Prioritario</li>
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-500 transition-colors shadow-lg hover:shadow-blue-500/25">
                                Empezar ahora
                            </button>
                        </div>

                        {/* Enterprise */}
                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 relative group">
                            <h3 className="text-xl font-bold text-white mb-2">Titan</h3>
                            <div className="text-4xl font-black text-white mb-6">Custom <span className="text-sm font-medium text-slate-500"></span></div>
                            <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
                                Control total, seguridad avanzada y soporte dedicado para grandes corporaciones.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Usuarios Ilimitados</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Almacenamiento Ilimitado</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> SSO & Auditoría Completa</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> SLA Garantizado</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Diagnósticos Personalizados</li>
                                <li className="flex items-center gap-3 text-sm text-slate-300"><Check className="text-blue-500" weight="bold" /> Private Cloud Option</li>
                            </ul>
                            <button
                                onClick={() => window.open('https://api.whatsapp.com/send/?phone=573044544525', '_blank')}
                                className="w-full py-3 rounded-xl border border-slate-700 font-bold text-white hover:bg-white hover:text-slate-900 transition-all"
                            >
                                Contactar Ventas
                            </button>
                        </div>
                    </div>


                    <div className="mt-32 text-center border-t border-slate-800 pt-16">
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">Empresas que confían en Maturity360</h3>
                        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
                            {/* Mock Logos */}
                            <div className="flex items-center gap-2 text-2xl font-black text-white"><div className="w-8 h-8 bg-white rounded-full"></div> ACME</div>
                            <div className="flex items-center gap-2 text-2xl font-black text-white"><div className="w-8 h-8 bg-white rounded-tr-xl"></div> GLOBEX</div>
                            <div className="flex items-center gap-2 text-2xl font-black text-white"><div className="w-8 h-8 rounded-full border-4 border-white"></div> SOYLUX</div>
                            <div className="flex items-center gap-2 text-2xl font-black text-white"><div className="w-8 h-8 bg-white skew-x-12"></div> UMBRELLA</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[40%] left-[50%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[150px] -translate-x-1/2"></div>
            </div>

            <LandingFooter />
        </div>
    );
}
