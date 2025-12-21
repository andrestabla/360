'use client';
import AdminSidebar from '@/components/AdminSidebar';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isSuperAdmin, currentUser } = useApp();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Allow a tick for context to load
        const timer = setTimeout(() => {
            if (!isSuperAdmin) {
                router.push('/');
            } else {
                setReady(true);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isSuperAdmin, router]);

    if (!ready) return <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-slate-500">Cargando consola...</div>;

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
            <AdminSidebar />
            <main className="flex-1 overflow-auto relative">
                {children}
            </main>
        </div>
    )
}
