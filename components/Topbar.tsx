'use client';
import { useApp } from '@/context/AppContext';
import { ChatCircleDots, Moon, SignOut } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';

export default function Topbar() {
    const { currentUser, isSuperAdmin, logout } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    // Determine title based on path
    const getTitle = () => {
        if (pathname === '/dashboard') return isSuperAdmin ? 'GLOBAL DASHBOARD' : 'DASHBOARD';
        if (pathname.includes('/analytics')) return 'ANALÍTICA';
        if (pathname.includes('/repository')) return 'REPOSITORIO';
        if (pathname.includes('/chat')) return 'MENSAJES';
        if (pathname.includes('/cases')) return 'TRÁMITES';
        if (pathname.includes('/workflows')) return 'FLUJOS';
        if (pathname.includes('/surveys')) return 'ENCUESTAS';
        if (pathname.includes('/admin')) return 'ADMINISTRACIÓN';
        if (pathname.includes('/profile')) return 'MI PERFIL';
        return 'DASHBOARD';
    };

    const toggleDark = () => {
        document.body.classList.toggle('dark');
    };

    return (
        <header className="topbar">
            <h2 id="page-title" style={{ fontSize: 18, fontWeight: 600 }}>{getTitle()}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {isSuperAdmin && <span className="badge bg-super">SUPER ADMIN</span>}
                {!isSuperAdmin && currentUser?.level === 1 && <span className="badge bg-warning">ADMIN</span>}

                <button className="btn btn-ghost" style={{ padding: 8, position: 'relative' }} onClick={() => router.push('/dashboard/chat')}>
                    <ChatCircleDots size={20} />
                    <span className="nav-badge" style={{ top: 8, right: 6, width: 8, height: 8, padding: 0, display: 'block' }}></span>
                </button>

                <button className="btn btn-ghost" style={{ padding: 8 }} onClick={toggleDark}>
                    <Moon size={20} />
                </button>

                <button className="btn btn-ghost" onClick={logout} title="Salir">
                    <SignOut size={20} />
                </button>
            </div>
        </header>
    );
}
