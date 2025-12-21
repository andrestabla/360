'use client';
import { Planet, TwitterLogo, LinkedinLogo, GithubLogo } from '@phosphor-icons/react';

export default function LandingFooter() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-950 py-12 px-6 relative z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2 font-bold text-lg text-white">
                        <Planet weight="fill" className="text-blue-500" />
                        Maturity360
                    </div>
                    <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
                        La plataforma integral para escalar la madurez operativa de tu organización.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-900 w-full">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Es una solución digital de</p>
                        <img
                            src="https://imageneseiconos.s3.us-east-1.amazonaws.com/iconos/Logo_white.png"
                            alt="Algoritmo T"
                            className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
                        />
                    </div>
                </div>

                <div className="flex gap-8 text-sm font-medium text-slate-400">
                    <a href="#" className="hover:text-blue-500 transition-colors">Producto</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Empresa</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Recursos</a>
                    <a href="#" className="hover:text-blue-500 transition-colors">Legal</a>
                </div>

                <div className="flex gap-4">
                    <button className="w-10 h-10 rounded-full bg-slate-900 grid place-items-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <TwitterLogo weight="fill" size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-900 grid place-items-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <LinkedinLogo weight="fill" size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-900 grid place-items-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <GithubLogo weight="fill" size={20} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
