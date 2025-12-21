'use client';
import { Planet, List, X } from '@phosphor-icons/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LandingNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full z-50 relative">
            <div
                className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer relative z-50"
                onClick={() => router.push('/')}
            >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg grid place-items-center shadow-lg shadow-blue-900/50">
                    <Planet weight="fill" className="text-white" />
                </div>
                <span className="text-white">Maturity<span className="text-blue-500">360</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
                <Link href="/features" className={`text-sm font-medium transition-colors ${isActive('/features') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                    Características
                </Link>
                <Link href="/pricing" className={`text-sm font-medium transition-colors ${isActive('/pricing') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                    Precios
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/login')}
                    className="hidden md:block bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:border-slate-500 hover:shadow-lg hover:shadow-blue-500/10"
                >
                    Iniciar Sesión
                </button>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2 relative z-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <List size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center animate-fadeIn md:hidden">
                    <nav className="flex flex-col items-center gap-8 mb-8">
                        <Link href="/" onClick={() => setIsOpen(false)} className={`text-2xl font-bold transition-colors ${isActive('/') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                            Inicio
                        </Link>
                        <Link href="/features" onClick={() => setIsOpen(false)} className={`text-2xl font-bold transition-colors ${isActive('/features') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                            Características
                        </Link>
                        <Link href="/pricing" onClick={() => setIsOpen(false)} className={`text-2xl font-bold transition-colors ${isActive('/pricing') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                            Precios
                        </Link>
                    </nav>
                    <button
                        onClick={() => { router.push('/login'); setIsOpen(false); }}
                        className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-lg font-bold text-white transition-colors shadow-xl shadow-blue-600/20"
                    >
                        Iniciar Sesión
                    </button>
                    <div className="absolute bottom-10 text-xs text-slate-600 uppercase tracking-widest">
                        Maturity 360 Mobile
                    </div>
                </div>
            )}
        </header>
    );
}
