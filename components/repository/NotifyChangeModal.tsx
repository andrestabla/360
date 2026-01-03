import React, { useState } from 'react';
import { X, PaperPlaneRight, Bell } from '@phosphor-icons/react';
import { User } from '@/lib/data'; // Legacy type, maybe replace with schema type
import { sendDocumentNotificationAction } from '@/app/actions/notificationActions';

interface NotifyChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentId: string;
    teamMembers?: any[]; // Allow flexibility for now
}

import { getUsersAction } from '@/app/lib/repositoryActions';

export function NotifyChangeModal({ isOpen, onClose, documentId, teamMembers = [] }: NotifyChangeModalProps) {
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [fetchedMembers, setFetchedMembers] = useState<any[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    const effectiveMembers = teamMembers.length > 0 ? teamMembers : fetchedMembers;

    React.useEffect(() => {
        if (isOpen && teamMembers.length === 0 && fetchedMembers.length === 0) {
            setLoadingMembers(true);
            getUsersAction().then(res => {
                if (res.success && res.data) {
                    setFetchedMembers(res.data);
                }
                setLoadingMembers(false);
            });
        }
    }, [isOpen, teamMembers]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!selectedUser || !message.trim()) return;
        setSending(true);
        try {
            const res = await sendDocumentNotificationAction(documentId, [selectedUser], message);
            if (res.success) {
                alert("Notificación enviada correctamente");
                onClose();
            } else {
                alert(res.error || "Error al enviar notificación");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-purple-50/50">
                    <div className="flex items-center gap-2 text-purple-700">
                        <Bell size={20} weight="fill" />
                        <h3 className="font-bold text-lg">Notificar Novedad</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Destinatario (Equipo)</label>
                        <div className="relative">
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none appearance-none transition-all text-slate-700 font-medium"
                            >
                                <option value="" disabled>Seleccionar miembro...</option>
                                {loadingMembers ? (
                                    <option disabled>Cargando miembros...</option>
                                ) : effectiveMembers.length > 0 ? (
                                    effectiveMembers.map((u: any) => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role || 'Miembro'})</option>
                                    ))
                                ) : (
                                    <option value="demo" disabled>No se encontraron miembros</option>
                                )}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mensaje</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escribe la novedad sobre el flujo o documento..."
                            rows={4}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending || !selectedUser || !message}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-lg transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                    >
                        <PaperPlaneRight size={16} weight="bold" />
                        {sending ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
