'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ChatService } from '@/lib/services/chatService';
import { X, BellRinging } from '@phosphor-icons/react';
import { Message } from '@/types/chat';

export default function ChatLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
    const { currentUser, currentTenantId } = useApp();
    const [notifications, setNotifications] = useState<Message[]>([]);

    // Polling for Notifications
    useEffect(() => {
        if (!currentUser || !currentTenantId) return;

        let lastCheck = new Date().toISOString();

        const interval = setInterval(async () => {
            const now = new Date().toISOString();
            try {
                const newMsgs = await ChatService.checkNewMessages(currentUser.id, currentTenantId, lastCheck);
                if (newMsgs.length > 0) {
                    setNotifications(prev => [...prev, ...newMsgs]);
                    // Play Audio? 
                    // const audio = new Audio('/sounds/notification.mp3'); audio.play();
                }
                lastCheck = now;
            } catch (e) { console.error("Poll fail", e); }
        }, 8000); // 8 seconds poll

        return () => clearInterval(interval);
    }, [currentUser, currentTenantId]);

    const removeNotif = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 relative">
            <aside className="w-80 border-r border-gray-100 bg-gray-50/50 flex flex-col md:flex">
                {sidebar}
            </aside>
            <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                {children}
            </main>

            {/* Notification Toasts Container */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {notifications.map(n => (
                    <div key={n.id} className="pointer-events-auto w-80 bg-white rounded-lg shadow-xl border-l-4 border-blue-500 p-3 animate-in slide-in-from-right-5 fade-in duration-300 flex gap-3 items-start">
                        <div className="bg-blue-50 p-1.5 rounded-full text-blue-500 shrink-0 mt-0.5">
                            <BellRinging size={16} weight="fill" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-gray-800">{n.senderName || 'Nuevo mensaje'}</h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{n.body_type === 'text' ? n.body : `📎 Archivo adjunto`}</p>
                        </div>
                        <button onClick={() => removeNotif(n.id)} className="text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
