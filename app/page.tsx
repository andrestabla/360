'use client';
import { useState, useEffect } from 'react';
import AuthScreen from '@/components/AuthScreen';
import { useRouter } from 'next/navigation';
import { Planet, ArrowRight, CheckCircle, Buildings, SpinnerGap } from '@phosphor-icons/react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [tenantSlug, setTenantSlug] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTenantSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantSlug.trim()) {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/tenants/${tenantSlug.toLowerCase().trim()}`);
        const data = await res.json();
        if (data.found && data.tenant) {
          router.push(`/${data.tenant.slug}`);
        } else {
          alert('Espacio de trabajo no encontrado. Verifica el nombre de tu empresa.');
        }
      } catch {
        alert('Error de conexión. Intenta de nuevo.');
      } finally {
        setIsSearching(false);
      }
    }
  };

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
          Nueva Versión Titan v18 Disponible
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-tl from-white via-slate-200 to-slate-400 animate-scaleIn">
          El Sistema Operativo <br /> de tu Empresa.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-fadeIn delay-100">
          Maturity 360 centraliza proyectos, documentos, flujos de trabajo y comunicación en una sola plataforma segura y escalable.
        </p>

        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto animate-fadeIn delay-200">
          <form onSubmit={handleTenantSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Buildings size={20} />
              </div>
              <input
                type="text"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                placeholder="tu-empresa"
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>
            <button type="submit" disabled={isSearching} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/70 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 whitespace-nowrap disabled:cursor-not-allowed">
              {isSearching ? <><SpinnerGap className="w-5 h-5 animate-spin" /> Buscando...</> : <>Ir a mi Empresa <ArrowRight weight="bold" /></>}
            </button>
          </form>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.push('/login')} className="px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
              <Planet size={18} className="text-blue-400" /> Soy Super Admin
            </button>
            <button onClick={() => window.open('https://api.whatsapp.com/send/?phone=573044544525', '_blank')} className="px-6 py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
              Agendar Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-left">
          {[
            { title: 'Multi-Tenant', desc: 'Cada empresa tiene su propio espacio aislado con subdominio personalizado.' },
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
