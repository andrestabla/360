'use client';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { CheckCircle, Lightning, Lock, ChartBar, Users, FileText, ShareNetwork, Robot, Buildings, ClipboardText } from '@phosphor-icons/react';

export default function FeaturesPage() {
    const features = [
        {
            icon: Lightning,
            title: "Workflows Inteligentes",
            desc: "Motor BPMN 2.0 ligero para automatizar aprobaciones, solicitudes y procesos repetitivos sin código.",
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        },
        {
            icon: FileText,
            title: "Gestión Documental",
            desc: "Repositorio centralizado con control de versiones, integración con Office 365 y permisos granulares por unidad.",
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            icon: Users,
            title: "Directorio & Org Chart",
            desc: "Visualización dinámica de la estructura organizacional. Gestión de perfiles, roles y competencias.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10"
        },
        {
            icon: ChartBar,
            title: "Analítica en Tiempo Real",
            desc: "Dashboards ejecutivos con KPIs de rendimiento, uso de plataforma y cuellos de botella en procesos.",
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            icon: ShareNetwork,
            title: "Comunicación Interna",
            desc: "Muro social corporativo, chat en tiempo real y sistema de anuncios para mantener a todos alineados.",
            color: "text-pink-400",
            bg: "bg-pink-500/10"
        },
        {
            icon: Lock,
            title: "Seguridad Enterprise",
            desc: "SSO (Single Sign-On), auditoría completa de acciones, encriptación en tránsito y reposo.",
            color: "text-slate-200",
            bg: "bg-slate-500/10"
        },
        {
            icon: Buildings,
            title: "Multi-Tenant Nativo",
            desc: "Aislamiento total de datos. Cada cliente tiene su propio subdominio, branding y base de datos lógica.",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10"
        },
        {
            icon: Robot,
            title: "Asistente AI (Beta)",
            desc: "Análisis predictivo y recomendaciones automáticas para optimizar la carga de trabajo de los equipos.",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10"
        },
        {
            icon: ClipboardText,
            title: "Encuestas & Feedback",
            desc: "Crea encuestas de clima laboral, satisfacción y diagnósticos de madurez con análisis automático de resultados.",
            color: "text-rose-400",
            bg: "bg-rose-500/10"
        }
    ];

    return (
        <div className="h-screen overflow-y-auto bg-slate-950 font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            <main className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Todo lo que necesitas para <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Operar y Escalar</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Una suite completa de herramientas diseñadas para transformar la manera en que tu organización trabaja, colabora y crece.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-blue-900/10">
                                <div className={`w-14 h-14 rounded-2xl ${f.bg} grid place-items-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <f.icon size={32} weight="duotone" className={f.color} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Section Break */}
                    <div className="mt-32 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-3xl p-12 border border-blue-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 max-w-2xl">
                            <h2 className="text-3xl font-bold text-white mb-4">¿Listo para modernizar tu empresa?</h2>
                            <p className="text-slate-400">Solicita una demostración personalizada hoy mismo y descubre cómo Maturity360 puede ayudarte.</p>
                        </div>
                        <div className="relative z-10 mt-8 md:mt-0">
                            <button
                                onClick={() => window.open('https://api.whatsapp.com/send/?phone=573044544525', '_blank')}
                                className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-xl text-lg"
                            >
                                Ver Demo Interactiva
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            </div>

            <LandingFooter />
        </div>
    );
}
