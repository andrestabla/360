'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <h2 className="text-3xl font-bold mb-4">404 - Página no encontrada</h2>
            <p className="mb-6 text-slate-400">La página que buscas no existe.</p>
            <Link
                href="/"
                className="px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}
