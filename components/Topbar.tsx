'use client';
import { useApp } from '@/context/AppContext';
import { ChatCircleDots, Moon, SignOut, List } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import { logout as serverLogout } from '@/app/lib/actions';
import { useState } from 'react';
import LogoutConfirmationModal from './LogoutConfirmationModal';

export default function Topbar() {
    const { currentUser, isSuperAdmin, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useApp();
    const router = useRouter();
    const pathname = usePathname();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = async () => {
        await serverLogout();
    };

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
            <div className="flex items-center gap-3">
                <button
                    className="btn btn-ghost lg:hidden p-2"
                    onClick={() => isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()}
                    aria-label="Abrir menú"
                >
                    <List size={24} weight="bold" />
                </button>
                <h2 id="page-title" className="text-base sm:text-lg font-semibold truncate">{getTitle()}</h2>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                {isSuperAdmin && <span className="badge bg-super hidden sm:inline-flex">SUPER ADMIN</span>}
                {!isSuperAdmin && currentUser?.level === 1 && <span className="badge bg-warning hidden sm:inline-flex">ADMIN</span>}

                <button className="btn btn-ghost p-2 relative" onClick={() => router.push('/dashboard/chat')}>
                    <ChatCircleDots size={20} />
                    {useApp().unreadChatCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white"></span>
                    )}
                </button>

                <button className="btn btn-ghost p-2 hidden sm:flex" onClick={toggleDark}>
                    <Moon size={20} />
                </button>

                <button className="btn btn-ghost p-2" onClick={() => setShowLogoutModal(true)} title="Salir">
                    <SignOut size={20} />
                </button>
            </div>
            <LogoutConfirmationModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
        </header>
    );
}
