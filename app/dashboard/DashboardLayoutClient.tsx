'use client';

import { AppProvider, useApp } from '@/context/AppContext';
import { UIProvider } from '@/context/UIContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import SlideOver from '@/components/SlideOver';
import DocViewer from '@/components/DocViewer';
import { useEffect } from 'react';

// Componente interno para manejar la sincronización
function SessionSync({ user }: { user: any }) {
    const { setCurrentUser } = useApp();

    useEffect(() => {
        if (user) {
            // Aquí ocurre la magia: Actualizamos el estado global del cliente
            // con los datos que vinieron del servidor (Auth.js + Drizzle)
            setCurrentUser(user);
        }
    }, [user, setCurrentUser]);

    return null;
}

export default function DashboardLayoutClient({
    children,
    initialUser // Recibimos la prop del layout de servidor
}: {
    children: React.ReactNode;
    initialUser?: any;
}) {
    return (
        <AppProvider>
            <UIProvider>
                {/* Sincronizador de Sesión */}
                <SessionSync user={initialUser} />

                <div className="flex h-screen bg-slate-50 overflow-hidden">
                    <Sidebar />

                    <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-300">
                        <Topbar />

                        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth" id="main-content">
                            <div className="max-w-7xl mx-auto w-full animate-fadeIn">
                                {children}
                            </div>
                        </main>
                    </div>

                    <SlideOver />
                    <DocViewer />
                </div>
            </UIProvider>
        </AppProvider>
    );
}
