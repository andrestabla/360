'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { createPortal } from 'react-dom';
import { X, CaretRight, CaretLeft, Check } from '@phosphor-icons/react';

interface TourStep {
    id: string;
    title: string;
    content: string;
    targetId?: string; // If undefined, show centered modal
    placement?: 'right' | 'left' | 'top' | 'bottom' | 'center';
}

export default function UserTour() {
    const { currentUser, isSuperAdmin, currentTenant } = useApp();
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Initial Check
    useEffect(() => {
        if (!currentUser) return;
        const tourKey = `tour_completed_${currentUser.id}_v3`; // v3 versioning
        const hasCompleted = localStorage.getItem(tourKey);

        if (!hasCompleted) {
            // Small delay to ensure UI renders
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentUser]);

    // Define Steps based on Role
    const steps: TourStep[] = useMemo(() => {
        const commonSteps: TourStep[] = [
            {
                id: 'welcome',
                title: `Bienvenido a ${currentTenant?.name || 'la Plataforma'}`,
                content: 'Te damos la bienvenida a tu nuevo espacio de trabajo. Acompáñanos en un breve recorrido para conocer las herramientas principales.',
                placement: 'center'
            }
        ];

        let roleSteps: TourStep[] = [];

        if (isSuperAdmin) {
            roleSteps = [
                {
                    id: 'nav-platform',
                    title: 'Gestión Global',
                    content: 'Aquí tienes acceso total a todos los Tenants, Usuarios y Configuraciones de la plataforma.',
                    targetId: 'nav-item--dashboard', // Points to Dashboard/Global
                    placement: 'right'
                },
                {
                    id: 'nav-tenants',
                    title: 'Tenants',
                    content: 'Administra las organizaciones y sus suscripciones desde aquí.',
                    targetId: 'nav-item--dashboard-tenants',
                    placement: 'right'
                },
                {
                    id: 'nav-users-global',
                    title: 'Usuarios y Permisos',
                    content: 'Control de acceso y roles a nivel global.',
                    targetId: 'nav-item--dashboard-admin-users',
                    placement: 'right'
                }
            ];
        } else {
            // --- Tenant User (Admin or Regular) ---

            // 1. Dashboard (Always available if enabled or default)
            if (currentTenant?.features?.includes('DASHBOARD')) {
                roleSteps.push({
                    id: 'nav-dashboard',
                    title: 'Tu Panel de Control',
                    content: 'Visualiza indicadores clave y el estado general de tu organización.',
                    targetId: 'nav-item--dashboard',
                    placement: 'right'
                });
            }

            // 2. Chat
            if (currentTenant?.features?.includes('CHAT')) {
                roleSteps.push({
                    id: 'nav-chat',
                    title: 'Mensajería y Colaboración',
                    content: 'Comunícate en tiempo real con tu equipo y crea grupos de trabajo.',
                    targetId: 'nav-item--dashboard-chat',
                    placement: 'right'
                });
            }

            // 3. Repository
            if (currentTenant?.features?.includes('REPOSITORY')) {
                roleSteps.push({
                    id: 'nav-repo',
                    title: 'Repositorio Documental',
                    content: 'Centraliza y gestiona todos los documentos importantes de tu organización.',
                    targetId: 'nav-item--dashboard-repository',
                    placement: 'right'
                });
            }

            // 4. Workflows / Projects
            if (currentTenant?.features?.includes('WORKFLOWS')) {
                roleSteps.push({
                    id: 'nav-workflows',
                    title: 'Proyectos y Flujos',
                    content: 'Organiza tus proyectos, tareas y entregables en un solo lugar.',
                    targetId: 'nav-item--dashboard-workflows',
                    placement: 'right'
                });
            }

            // 5. Analytics
            if (currentTenant?.features?.includes('ANALYTICS')) {
                roleSteps.push({
                    id: 'nav-analytics',
                    title: 'Analítica Avanzada',
                    content: 'Explora datos y reportes detallados para la toma de decisiones.',
                    targetId: 'nav-item--dashboard-analytics',
                    placement: 'right'
                });
            }

            // 6. Surveys
            if (currentTenant?.features?.includes('SURVEYS')) {
                roleSteps.push({
                    id: 'nav-surveys',
                    title: 'Encuestas y Evaluaciones',
                    content: 'Gestiona clima laboral, evaluaciones de madurez y formularios.',
                    targetId: 'nav-item--dashboard-surveys',
                    placement: 'right'
                });
            }

            // 7. Admin / Manager Steps
            if (currentUser?.level !== undefined && currentUser.level <= 2) {
                roleSteps.push({
                    id: 'nav-admin',
                    title: 'Administración',
                    content: 'Configura unidades, roles, usuarios y parámetros de tu Tenant.',
                    targetId: 'nav-item--dashboard-admin',
                    placement: 'right'
                });
            }

            // 8. Department Management (Manager+)
            if (currentUser?.level !== undefined && currentUser.level <= 2) {
                roleSteps.push({
                    id: 'nav-units',
                    title: 'Estructura Organizacional',
                    content: 'Define y gestiona las unidades y jerarquías de tu empresa.',
                    targetId: 'nav-item--dashboard-admin-units',
                    placement: 'right'
                });
            }
        }

        const finalSteps: TourStep[] = [
            ...commonSteps,
            ...roleSteps,
            {
                id: 'profile',
                title: 'Tu Perfil',
                content: 'Accede a tus preferencias personales, cambio de contraseña y cierre de sesión.',
                targetId: 'u-avatar', // Assuming avatar has this ID or class
                placement: 'top' // Usually at bottom sidebar
            },
            {
                id: 'finish',
                title: '¡Todo listo!',
                content: 'Ya estás preparado para comenzar. Si tienes dudas, busca el icono de ayuda.',
                placement: 'center' // Use explicit center placement
            }
        ];

        return finalSteps;
    }, [currentUser, isSuperAdmin, currentTenant]);

    // Update Rect on Step Change
    useEffect(() => {
        if (!isVisible) return;

        const step = steps[currentStep];
        if (!step) return;

        if (step.targetId) {
            const el = document.getElementById(step.targetId);
            if (el) {
                setTargetRect(el.getBoundingClientRect());
                // Scroll into view if needed
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Determine fallback behavior if element not found. 
                // For now, let's just default to null rect -> render centered as fallback?
                // Or try finding it again in a loop?
                // Actually, if we can't find it, maybe skip?
                console.warn(`Tour target ${step.targetId} not found, centering.`);
                setTargetRect(null);
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep, isVisible, steps]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const step = steps[currentStep];
            if (step?.targetId) {
                const el = document.getElementById(step.targetId);
                if (el) setTargetRect(el.getBoundingClientRect());
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleResize, true);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleResize, true);
        };
    }, [currentStep, steps]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            finishTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const finishTour = () => {
        if (currentUser) {
            localStorage.setItem(`tour_completed_${currentUser.id}_v3`, 'true');
        }
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const step = steps[currentStep];
    if (!step) return null;

    // Helper for Popover Position
    const getPopoverStyle = () => {
        if (!targetRect || step.placement === 'center' || !step.targetId) {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '450px',
                width: '90%'
            };
        }

        const gap = 16;
        const styles: React.CSSProperties = { position: 'absolute', maxWidth: '350px' };

        // Simple positioning logic
        if (step.placement === 'right') {
            styles.top = targetRect.top + (targetRect.height / 2) - 100; // Offset up slightly for balance
            styles.left = targetRect.right + gap;
        } else if (step.placement === 'bottom') {
            styles.top = targetRect.bottom + gap;
            styles.left = targetRect.left + (targetRect.width / 2) - 175;
        } else if (step.placement === 'top') { // Sidebar profile is at bottom
            styles.bottom = window.innerHeight - targetRect.top + gap;
            styles.left = targetRect.left;
        }

        // Boundary checks would be good here but keeping simple
        return styles;
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* 1. Backdrop with Hole (Box Shadow Method) */}
            {/* If target exists, we draw a huge shadow around a transparent div placed over the target */}
            {targetRect && step.placement !== 'center' ? (
                <div
                    className="absolute bg-transparent transition-all duration-500 ease-in-out box-content border-4 border-blue-500/50 rounded-lg"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width,
                        height: targetRect.height,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
                    }}
                >
                    {/* Optional Pulse Effect */}
                    <div className="absolute inset-0 rounded-lg animate-ping bg-blue-500/30"></div>
                </div>
            ) : (
                // Full Backdrop for Center Modal
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-500"></div>
            )}

            {/* 2. Popover Content */}
            <div
                className="absolute z-[10000] bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-out border border-white/20"
                style={getPopoverStyle() as any}
            >
                {/* Header Graphic for Welcome */}
                {step.placement === 'center' && currentStep === 0 && (
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="text-6xl text-white opacity-20 absolute -bottom-4 -right-4 rotate-12">👋</div>
                    </div>
                )}

                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-slate-800 leading-tight">
                            {currentStep + 1}. {step.title}
                        </h3>
                        <button onClick={finishTour} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                        {step.content}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                        <div className="flex gap-1">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'}`}></div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={handlePrev}
                                    className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                                >
                                    Atrás
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
                            >
                                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                                {currentStep === steps.length - 1 ? <Check weight="bold" /> : <CaretRight weight="bold" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
