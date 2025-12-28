'use client';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/lib/i18n';
import {
    SquaresFour, Planet, Buildings, ShieldCheck, ChatCircleDots, Files,
    GitPullRequest, Gear, UsersThree, TreeStructure, Megaphone, Kanban, ChartPieSlice,
    ClipboardText, CaretLeft, CaretRight, Globe, CloudArrowUp, X
} from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
    // Removed currentTenant
    const { currentUser, isSuperAdmin, isSidebarCollapsed, toggleSidebar, unreadChatCount, isMobileMenuOpen, closeMobileMenu } = useApp();
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    if (!currentUser) return null;

    const handleNavigation = (path: string) => {
        router.push(path);
        closeMobileMenu();
    };

    const NavItem = ({ icon: Icon, label, path, badge }: { icon: any, label: string, path: string, badge?: number | string | boolean }) => {
        const isActive = pathname === path;
        return (
            <button
                id={`nav-item-${path.replace(/\//g, '-')}`}
                className={`nav-item ${isActive ? 'active' : ''} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                onClick={() => handleNavigation(path)}
                title={isSidebarCollapsed ? label : ''}
            >
                <Icon size={isSidebarCollapsed ? 22 : 18} weight={isActive ? 'bold' : 'regular'} />
                {!isSidebarCollapsed && label}
                {!isSidebarCollapsed && badge && badge !== 0 && <span className="nav-badge mx-2">{badge}</span>}
            </button>
        );
    };

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}
            <aside
                id="sidebar"
                className={`
                    ${isSuperAdmin ? 'super-mode' : ''} 
                    ${isSidebarCollapsed ? 'collapsed w-[80px]' : 'w-[260px]'} 
                    transition-all duration-300
                    fixed lg:relative
                    h-full
                    z-50
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className={`brand flex items-center ${isSidebarCollapsed ? 'justify-center p-4' : 'justify-between p-5'}`}>
                    <div className="flex items-center gap-3">
                        <div className="brand-logo flex-shrink-0"><SquaresFour weight="bold" /></div>
                        {!isSidebarCollapsed && (
                            <div className="animate-fadeIn">
                                <div style={{ fontWeight: 700, color: 'white', fontSize: '15px', letterSpacing: '-0.02em' }}>
                                    Maturity360
                                </div>
                                <div style={{ fontSize: 10, opacity: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }} id="tenant-label">
                                    {isSuperAdmin ? 'Platform Admin' : 'Organization View'}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={closeMobileMenu}
                            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 lg:hidden"
                            title="Cerrar Menú"
                        >
                            <X size={18} weight="bold" />
                        </button>
                        <button
                            onClick={toggleSidebar}
                            className={`text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 hidden lg:block ${isSidebarCollapsed ? 'hidden' : ''}`}
                            title="Contraer Menú"
                        >
                            <CaretLeft size={16} weight="bold" />
                        </button>
                    </div>
                </div>

                {isSidebarCollapsed && (
                    <div className="hidden lg:flex justify-center p-2 border-b border-white/5">
                        <button
                            onClick={toggleSidebar}
                            className="text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                            title="Expandir Menú"
                        >
                            <CaretRight size={20} weight="bold" />
                        </button>
                    </div>
                )}

                <nav className={`nav ${isSidebarCollapsed ? 'scrollbar-hide' : ''}`} id="nav-menu">
                    {/* Simplified Navigation for Single Tenant */}

                    <div className={`nav-header ${isSidebarCollapsed ? 'text-center opacity-30 text-[9px]' : ''}`}>
                        {isSidebarCollapsed ? '•••' : 'Menú Principal'}
                    </div>

                    <NavItem icon={SquaresFour} label={t('nav_dashboard')} path="/dashboard" />
                    <NavItem icon={ChatCircleDots} label={t('nav_chat')} path="/dashboard/chat" badge={unreadChatCount} />
                    <NavItem icon={Files} label={t('nav_repository')} path="/dashboard/repository" />
                    <NavItem icon={Kanban} label={t('nav_workflows')} path="/dashboard/workflows" />
                    <NavItem icon={ChartPieSlice} label={t('nav_analytics')} path="/dashboard/analytics" />
                    <NavItem icon={ClipboardText} label={t('nav_surveys')} path="/dashboard/surveys" />

                    {/* Admin Access */}
                    {(currentUser.role.toLowerCase().includes('admin') || isSuperAdmin || currentUser.level === 1) && (
                        <>
                            <div className={`nav-header ${isSidebarCollapsed ? 'text-center' : ''}`}>
                                {isSidebarCollapsed ? 'Adm.' : 'ADMINISTRACIÓN'}
                            </div>
                            <NavItem icon={Gear} label="Panel Admin" path="/dashboard/admin" />
                            <NavItem icon={UsersThree} label="Usuarios Globales" path="/dashboard/admin/users" />
                            <NavItem icon={TreeStructure} label="Unidades" path="/dashboard/admin/units" />
                            <NavItem icon={GitPullRequest} label="Configuración" path="/dashboard/admin/settings" />
                        </>
                    )}
                </nav>

                <div className={`user-profile ${isSidebarCollapsed ? 'justify-center p-3' : ''}`} onClick={() => handleNavigation('/dashboard/profile')}>
                    <div className="avatar relative flex items-center justify-center overflow-hidden" id="u-avatar">
                        {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                        ) : (
                            currentUser.initials
                        )}
                    </div>
                    {!isSidebarCollapsed && (
                        <div style={{ flex: 1, overflow: 'hidden' }} className="animate-fadeIn">
                            <div id="u-name" style={{ fontWeight: 600, color: 'white' }}>{currentUser.name}</div>
                            <div id="u-role" style={{ fontSize: 11, opacity: 0.6 }}>{currentUser.role}</div>
                        </div>
                    )}
                    {!isSidebarCollapsed && (
                        <button className="btn btn-ghost" style={{ color: 'white', padding: 4 }}>
                            <Gear size={16} />
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}
