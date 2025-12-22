'use client';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import SlideOver from '@/components/SlideOver';
import DocViewer from '@/components/DocViewer';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Warning } from '@phosphor-icons/react';
import UserTour from '@/components/onboarding/UserTour';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { currentUser, originalSession, stopImpersonation, updateUser } = useApp();
    const router = useRouter();

    useEffect(() => {
        // Basic protection - if not logged in, go to home
        // In a real app we'd wait for loading state, but here currentUser is sync after login
        // However, on refresh, currentUser is wiped because it's in-memory.
        // For this prototype, we'll redirect if null.
        if (!currentUser) router.push('/');
    }, [currentUser, router]);

    if (!currentUser) return null;

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {originalSession && (
                <div className="bg-amber-400 text-amber-900 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm z-[100]">
                    <div className="flex items-center gap-2">
                        <Warning weight="fill" size={18} />
                        <span className="uppercase tracking-wide">Support Mode: Impersonating {currentUser.name}</span>
                    </div>
                    <button onClick={stopImpersonation} className="bg-white/20 hover:bg-white/40 px-3 py-1 rounded text-[10px] uppercase font-bold transition-colors flex items-center gap-1">
                        Exit Support
                    </button>
                </div>
            )}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden relative w-full lg:w-auto">
                    <Topbar />
                    <div className="content">
                        {children}
                    </div>
                </main>
                <SlideOver />
                <DocViewer />
            </div>
            <UserTour />

            {/* Force Password Change */}
            {currentUser.mustChangePassword && !originalSession && (
                <div className="fixed inset-0 bg-slate-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-8 text-center">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Warning size={32} weight="fill" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Security Update Required</h2>
                        <p className="text-slate-600 mb-6">For your security, you must update your password before proceeding.</p>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateUser({ mustChangePassword: false });
                            alert('Password updated successfully.');
                        }} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">New Password</label>
                                <input type="password" required className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Confirm Password</label>
                                <input type="password" required className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
                            </div>
                            <button className="btn btn-primary w-full justify-center">Update Password</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
