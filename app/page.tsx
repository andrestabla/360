'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Planet, ArrowRight, CheckCircle } from '@phosphor-icons/react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading...</div>;
  }

  // MAIN DOMAIN: Render Landing Page
  return (
    <div className="h-screen overflow-y-auto bg-slate-950 text-white flex flex-col font-sans selection:bg-blue-500/30">
      <LandingNavbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 animate-fadeIn">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Nueva Versión Single-Tenant v2.0 Disponible
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-tl from-white via-slate-200 to-slate-400 animate-scaleIn">
          El Sistema Operativo <br /> de tu Empresa.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-fadeIn delay-100">
          Maturity 360 centraliza proyectos, documentos, flujos de trabajo y comunicación en una sola plataforma segura y escalable.
        </p>

        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto animate-fadeIn delay-200">

          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 whitespace-nowrap"
          >
            Acceder a la Plataforma <ArrowRight weight="bold" />
          </button>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => window.open('https://api.whatsapp.com/send/?phone=573044544525', '_blank')} className="px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
              Agendar Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-left">
          {[
            { title: 'Centralizado', desc: 'Toda la información y procesos de tu empresa en un solo lugar.' },
            { title: 'Workflows', desc: 'Automatiza procesos de aprobación y tareas repetitivas.' },
            { title: 'Seguridad', desc: 'Control de acceso basado en roles y trazabilidad de auditoría completa.' }
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm">
              <CheckCircle size={24} className="text-blue-500 mb-3" weight="fill" />
              <h3 className="font-bold text-lg text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

