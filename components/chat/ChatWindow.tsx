'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Conversation, Message, Attachment } from '@/types/chat';
import { useApp } from '@/context/AppContext';
import {
    getMessagesAction,
    sendMessageAction,
    markAsReadAction,
    searchMessagesAction,
    isBlockedAction,
    getNotificationSettingsAction,
    editMessageAction,
    deleteMessageAction,
    toggleReactionAction,
    uploadFileAction,
    leaveGroupAction,
    muteConversationAction,
    updateNotificationSettingsAction,
    getGroupMembersAction,
    unblockUserAction,
    blockUserAction,
    reportContentAction,
    getConversationAction,
    checkNewMessagesAction
} from '@/app/lib/chatActions';

import { PaperPlaneRight, Paperclip, Smiley, Phone, VideoCamera, Info, Checks, CircleNotch, ArrowDown, DotsThreeVertical, Trash, PencilSimple, X, BellSlash, SignOut, ArrowUUpLeft, Heart, ThumbsUp, SmileyWink, File, Download, MagnifyingGlass } from '@phosphor-icons/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { sanitizeHTML, escapeHTML } from '@/lib/services/sanitize';

export default function ChatWindow() {
    const { currentUser, refreshUnreadCount } = useApp();
    const searchParams = useSearchParams();
    const activeId = searchParams.get('chatId');

    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true); // Default true on mount
    const [error, setError] = useState<string | null>(null); // New Error State
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    // Edit/Delete State
    const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState<{ level: string, mutedUntil?: string }>({ level: 'all' });
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockerId, setBlockerId] = useState<string | null>(null); // Who blocked whom? for now just generic blocked state


    // Attachments
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Search State
    const [showSearch, setShowSearch] = useState(false);
    const [msgSearchQuery, setMsgSearchQuery] = useState('');
    const [msgSearchResults, setMsgSearchResults] = useState<Message[]>([]);
    const [isSearchingMsgs, setIsSearchingMsgs] = useState(false);

    // Search Effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!msgSearchQuery.trim() || !activeId) {
                setMsgSearchResults([]);
                return;
            }
            setIsSearchingMsgs(true);
            try {
                const results = await searchMessagesAction(msgSearchQuery, activeId);
                setMsgSearchResults(results);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearchingMsgs(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [msgSearchQuery, activeId]);

    const handleJumpToMessage = (messageId: string) => {
        // 1. Check if message is currently in the loaded list
        const el = document.getElementById(messageId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight effect?
            el.classList.add('bg-blue-100');
            setTimeout(() => el.classList.remove('bg-blue-100'), 2000);

            // Close search on mobile maybe? kept open for now
        } else {
            // 2. If not loaded, we should ideally load the segment around it.
            // For MVP, we'll just alert. Deep linking to history requires a "Jump To Date" arch update.
            // Or we could trigger a "Load All until" loop (dangerous), or "Load Page X".
            // Simplest safe fallback:
            alert("El mensaje es muy antiguo y no está en la vista actual. (Deep linking pendiente)");
        }
    };

    // Router
    const router = useRouter();

    // Pagination Cursor (Oldest message ID loaded)
    const oldestCursorRef = useRef<string | undefined>(undefined);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const endRef = useRef<HTMLDivElement>(null);

    // Polling for New Messages (Simple & Robust)
    useEffect(() => {
        if (!activeId || !currentUser || loading || error) return;

        const pollInterval = setInterval(async () => {
            try {
                // Get last message date
                const lastMsg = messages[messages.length - 1];
                const since = lastMsg?.createdAt || new Date(0).toISOString();

                const res = await checkNewMessagesAction(currentUser.id, since);
                if (res.success && res.data && res.data.length > 0) {
                    const newMsgs = res.data as Message[];
                    // Filter for current conversation
                    const relevantMsgs = newMsgs.filter(m => m.conversationId === activeId);

                    if (relevantMsgs.length > 0) {
                        setMessages(prev => {
                            const existingIds = new Set(prev.map(m => m.id));
                            const trulyNew = relevantMsgs.filter(m => !existingIds.has(m.id));
                            if (trulyNew.length === 0) return prev;
                            return [...prev, ...trulyNew];
                        });
                    }
                }
            } catch (e) {
                // Silent fail
            }
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [activeId, currentUser, messages, loading, error]);

    // Initial Load
    useEffect(() => {
        if (!activeId || !currentUser) {
            setLoading(false);
            setConversation(null);
            setMessages([]);
            return;
        }

        const fetchInit = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch Conversation
                const convRes = await getConversationAction(activeId);
                // Even if conv info fails, we might still try to load messages, but safer to stop if critical
                if (!convRes.success) {
                    console.warn("Conversation metadata load warning:", convRes.error);
                    // Decide: Stop or Continue? simpler is stop & show error
                    // setError("No se pudo cargar la conversación.");
                    // return; 
                    // Let's try to proceed to messages anyway, maybe it's just metadata missing
                }

                if (convRes.data) {
                    const convDef = convRes.data;
                    const isB = convDef.isBlocked || false;
                    setIsBlocked(isB);
                    if (isB) setBlockerId(convDef.blockerId || null);
                    setConversation(convDef as unknown as Conversation);
                }

                // 2. Fetch Messages
                const msgRes = await getMessagesAction(activeId);
                if (!msgRes.success) {
                    throw new Error(msgRes.error || "Failed to load messages");
                }

                setMessages(msgRes.data.reverse());
                oldestCursorRef.current = msgRes.nextCursor;
                setHasMore(msgRes.hasMore);

                // 3. Mark Read & Settings (Non-blocking)
                markAsReadAction(activeId, currentUser.id).then(() => refreshUnreadCount()).catch(console.warn);
                getNotificationSettingsAction(activeId, currentUser.id).then(s => setNotificationSettings(s)).catch(console.warn);

                // Scroll
                setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'auto' }), 100);

            } catch (e: any) {
                console.error("Chat Init Error:", e);
                setError("Error cargando el chat. Por favor reintenta.");
            } finally {
                setLoading(false);
            }
        };

        // Safety timeout to ensure spinner doesn't get stuck
        const timer = setTimeout(() => {
            if (loading) setLoading(false);
        }, 8000);

        fetchInit().finally(() => clearTimeout(timer));
    }, [activeId, currentUser]);

    // Infinite Scroll Handler
    const handleScroll = async () => {
        if (!scrollContainerRef.current || loadingMore || !hasMore || !activeId) return;

        const { scrollTop } = scrollContainerRef.current;
        if (scrollTop === 0) {
            setLoadingMore(true);
            const previousHeight = scrollContainerRef.current.scrollHeight;

            try {
                const res = await getMessagesAction(activeId, oldestCursorRef.current);
                if (res.success && res.data.length > 0) {
                    setMessages(prev => [...res.data, ...prev]);
                    oldestCursorRef.current = res.nextCursor;
                    setHasMore(res.hasMore);

                    // Restore scroll
                    setTimeout(() => {
                        if (scrollContainerRef.current) {
                            const newHeight = scrollContainerRef.current.scrollHeight;
                            scrollContainerRef.current.scrollTop = newHeight - previousHeight;
                        }
                    }, 0);
                } else {
                    setHasMore(false);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && attachments.length === 0) || !currentUser || !activeId) return;

        // If editing
        if (editingMsgId) {
            try {
                await editMessageAction(editingMsgId, currentUser.id, input);
                setMessages(prev => prev.map(m => m.id === editingMsgId ? { ...m, body: input } : m));
                setEditingMsgId(null);
                setInput('');
            } catch (e) { console.error(e); }
            return;
        }

        const tempId = `TEMP-${Date.now()}`;
        const newMsg: Message = {
            id: tempId,
            conversationId: activeId,
            senderId: currentUser.id,
            body: input || (attachments.length ? 'Archivo adjunto' : ''),
            bodyType: attachments.length ? ((attachments[0].mimeType || attachments[0].type || '').startsWith('image/') ? 'image' : 'file') : 'text',
            createdAt: new Date().toISOString(),
            senderName: currentUser.name,
            replyToMessageId: replyingTo?.id || null,
            replyTo: replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName || 'User', body: replyingTo.body } : undefined,
            reactions: [],
            attachments: [...attachments],
            readBy: [currentUser.id]
        };

        // Optimistic UI
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setReplyingTo(null);
        setAttachments([]);
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

        try {
            const serverRes = await sendMessageAction(activeId, currentUser.id, newMsg.body, tempId, newMsg.replyToMessageId || undefined, newMsg.attachments);
            if (serverRes.success) {
                // Replace temp with server
                setMessages(prev => prev.map(m => m.id === tempId ? serverRes as Message : m));
            } else {
                // Mark as failed in UI? For now just log
                console.error("Failed to send (server error):", serverRes.error);
                alert("Error al enviar mensaje: " + serverRes.error);
                setMessages(prev => prev.filter(m => m.id !== tempId)); // Revert
            }
        } catch (e) {
            console.error("Failed to send", e);
            setMessages(prev => prev.filter(m => m.id !== tempId)); // Revert
        }
    };

    const handleDelete = async (msgId: string) => {
        if (!currentUser) return;
        setMenuOpenId(null);
        try {
            await deleteMessageAction(msgId, currentUser.id);
            // Local update (Soft Delete style)
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, deletedAt: new Date().toISOString(), body: '' } : m));
        } catch (e) { console.error(e); }
    };

    const startReply = (msg: Message) => {
        setMenuOpenId(null);
        setReplyingTo(msg);
        // Focus
    };

    const startEdit = (msg: Message) => {
        setMenuOpenId(null);
        setEditingMsgId(msg.id);
        setEditContent(msg.body);
        setInput(msg.body);
    };

    const cancelEdit = () => {
        setEditingMsgId(null);
        setInput('');
    };

    const handleReaction = async (msgId: string, emoji: string) => {
        if (!currentUser) return;
        setMenuOpenId(null);
        // Optimistic
        setMessages(prev => prev.map(m => {
            if (m.id !== msgId) return m;
            const current = m.reactions || [];
            const exists = current.find(r => r.userId === currentUser.id && r.emoji === emoji);
            let nextR = [...current];
            if (exists) {
                nextR = nextR.filter(r => !(r.userId === currentUser.id && r.emoji === emoji));
            } else {
                nextR.push({ messageId: msgId, userId: currentUser.id, emoji, createdAt: new Date().toISOString() });
            }
            return { ...m, reactions: nextR };
        }));

        try {
            await toggleReactionAction(msgId, currentUser.id, emoji);
        } catch (e) { console.error(e); }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const files = Array.from(e.target.files);
        setIsUploading(true);
        setUploadProgress(0);

        // Upload sequentially to show progress for each
        for (const file of files) {
            try {
                setUploadProgress(0);
                const formData = new FormData();
                formData.append('file', file);

                const attachment = await uploadFileAction(formData);
                setAttachments(prev => [...prev, attachment]);
            } catch (err: any) {
                console.error(err);
                alert(`Error al subir ${file.name}: ${err.message}`);
            }
        }

        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLeaveGroup = async () => {
        if (!activeId || !currentUser) return;
        if (!confirm('¿Estás seguro de que quieres salir del grupo?')) return;
        try {
            await leaveGroupAction(activeId, currentUser.id);
            // Redirect / Refresh
            router.push('/dashboard/chat');
            // Force reload context/list ideally, but nav change triggers it usually
        } catch (e) { console.error(e); }
    };

    const handleMute = async (hours: number | null) => {
        if (!activeId || !currentUser) return;
        const until = hours ? new Date(Date.now() + hours * 3600000).toISOString() : '2099-12-31T23:59:59Z'; // Forever
        try {
            await muteConversationAction(activeId, currentUser.id, until);
            setNotificationSettings(prev => ({ ...prev, mutedUntil: until })); // Local update
            setHeaderMenuOpen(false);
            alert(`Chat silenciado ${hours ? `por ${hours}h` : 'para siempre'}`);
        } catch (e) { console.error(e); }
    };

    const handleNotifyLevel = async (level: 'all' | 'mentions' | 'none') => {
        if (!activeId || !currentUser) return;
        try {
            await updateNotificationSettingsAction(activeId, currentUser.id, level);
            setNotificationSettings(prev => ({ ...prev, level }));
            setHeaderMenuOpen(false);
        } catch (e) { console.error(e); }
    };

    const handleBlockToggle = async () => {
        if (!conversation || conversation.type !== 'dm' || !currentUser) return;
        // Identify target user (hacky for now assumes 2 participants)
        // Ideally Conversation object has `otherUserId` helper or we find it
        // We need to fetch members
        try {
            const members = await getGroupMembersAction(conversation.id);
            const other = members.find((m: any) => m.id !== currentUser.id);
            if (!other) return;

            if (isBlocked) {
                await unblockUserAction(currentUser.id, other.id);
                setIsBlocked(false);
                alert("Usuario desbloqueado");
            } else {
                if (confirm("¿Estás seguro de bloquear a este usuario? No recibirás mensajes.")) {
                    await blockUserAction(currentUser.id, other.id);
                    setIsBlocked(true);
                }
            }
            setHeaderMenuOpen(false);
        } catch (e) { console.error(e); }
    };

    const handleReportMessage = async (msg: Message) => {
        if (!currentUser) return;
        const reason = prompt("Describe el motivo del reporte:");
        if (!reason) return;

        try {
            await reportContentAction(currentUser.id, {
                targetId: msg.id,
                type: 'message',
                reason: reason,
                detail: `Reported by ${currentUser.name}`
            });
            alert("Reporte enviado. Gracias por contribuir a la seguridad.");
            setMenuOpenId(null);
        } catch (e) { console.error(e); alert("Error al reportar"); }
    };

    if (!activeId) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-slate-50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <PaperPlaneRight size={48} weight="thin" className="text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">Comienza a charlar</h3>
                <p className="max-w-xs mt-2 text-sm text-gray-500">Selecciona una conversación de tu bandeja de entrada.</p>
            </div>
        );
    }

    if (loading && messages.length === 0) {
        return (
            <div className="h-full flex items-center justify-center bg-white">
                <CircleNotch size={32} className="animate-spin text-blue-500" />
            </div>
        );
    }

    if (!loading && messages.length === 0 && !error) {
        return (
            <div className="flex flex-col h-full bg-[#f0f2f5]">
                {/* Header (Duplicate or Componentize logic needed, but for now inline to keep file count low) */}
                <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden
                            ${conversation?.type === 'group' ? 'bg-indigo-500' : 'bg-pink-500'}`}>
                            {conversation?.avatar ? (
                                <img src={conversation.avatar} alt={conversation.title || ''} className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (conversation?.title?.[0] || '?')}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{conversation?.title}</h3>
                            <p className="text-xs text-gray-500">Nuevo Chat</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm animate-bounce-slow">
                        <PaperPlaneRight size={40} weight="fill" className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">No hay mensajes aún</h3>
                    <p className="max-w-xs mt-2 text-sm text-gray-500">Envía un mensaje para comenzar la conversación.</p>
                </div>

                {/* Input Area (Re-used) */}
                <div className="bg-white px-4 py-3 border-t border-gray-200">
                    <div className="flex items-end gap-2 max-w-4xl mx-auto">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 text-[15px] py-2.5 px-2 max-h-32 overflow-y-auto resize-none"
                            />
                            <button onClick={handleSend} disabled={!input.trim()} className="p-2 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mb-1">
                                <PaperPlaneRight size={18} weight="fill" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white gap-4">
                <div className="text-red-500 bg-red-50 p-4 rounded-full"><Info size={32} /></div>
                <p className="text-gray-600">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Recargar</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5]"> {/* WhatsApp/Telegram style background color */}
            {/* Header */}
            <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden
                        ${conversation?.type === 'group' ? 'bg-indigo-500' : 'bg-pink-500'}`}>
                        {conversation?.avatar ? (
                            <img
                                src={conversation.avatar}
                                alt={conversation.title || ''}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    if (target.src.includes('/avatars/') && !target.src.includes('/api/storage/')) {
                                        target.src = '/api/storage' + target.src.substring(target.src.indexOf('/avatars/'));
                                    } else {
                                        target.style.display = 'none';
                                    }
                                }}
                            />
                        ) : (
                            conversation?.title?.[0] || '?'
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{conversation?.title}</h3>
                        <p className="text-xs text-gray-500">
                            {conversation?.type === 'group' ? 'Grupo' : 'En línea'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-blue-600 relative">
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50'}`}
                        title="Buscar en el chat"
                    >
                        <MagnifyingGlass size={20} weight="bold" />
                    </button>
                    <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><Phone size={20} weight="fill" /></button>
                    <button className="p-2 hover:bg-blue-50 rounded-full transition-colors"><VideoCamera size={20} weight="fill" /></button>
                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                    <button
                        onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                        className="p-2 hover:bg-gray-100 text-gray-400 rounded-full transition-colors"
                    >
                        <DotsThreeVertical size={24} weight="bold" />
                    </button>

                    {/* Header Menu */}
                    {headerMenuOpen && (
                        <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl py-2 w-48 z-20 border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Opciones</div>

                            <button onClick={() => handleMute(1)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-3">
                                <BellSlash size={16} /> Silenciar 1h
                            </button>
                            <button onClick={() => handleMute(8)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-3">
                                <BellSlash size={16} /> Silenciar 8h
                            </button>

                            <div className="h-px bg-gray-100 my-1"></div>
                            <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preferencias</div>

                            <button onClick={() => handleNotifyLevel('all')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${(!notificationSettings?.level || notificationSettings.level === 'all') ? 'bg-green-500' : 'bg-gray-200'}`}></span> Todo
                            </button>
                            <button onClick={() => handleNotifyLevel('mentions')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${notificationSettings?.level === 'mentions' ? 'bg-yellow-500' : 'bg-gray-200'}`}></span> Solo menciones
                            </button>
                            <button onClick={() => handleNotifyLevel('none')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-3">
                                <span className={`w-2 h-2 rounded-full ${notificationSettings?.level === 'none' ? 'bg-red-500' : 'bg-gray-200'}`}></span> Nada
                            </button>

                            {conversation?.type === 'dm' && (
                                <>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button onClick={handleBlockToggle} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3">
                                        <BellSlash size={16} /> {isBlocked ? 'Desbloquear' : 'Bloquear Usuario'}
                                    </button>
                                </>
                            )}

                            {conversation?.type === 'group' && (
                                <>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button onClick={handleLeaveGroup} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3">
                                        <SignOut size={16} /> Salir del Grupo
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Search Overlay */}
            {showSearch && (
                <div className="bg-white border-b border-gray-200 p-4 animate-in slide-in-from-top-2 z-10 shadow-sm flex flex-col gap-2 max-h-[300px]">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Buscar en esta conversación..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={msgSearchQuery}
                            onChange={(e) => setMsgSearchQuery(e.target.value)}
                        />
                        {msgSearchQuery && (
                            <button onClick={() => setMsgSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Results List */}
                    <div className="overflow-y-auto custom-scrollbar flex-1">
                        {isSearchingMsgs ? (
                            <div className="py-4 flex justify-center text-blue-500"><CircleNotch size={20} className="animate-spin" /></div>
                        ) : msgSearchResults.length > 0 ? (
                            <div className="space-y-1 mt-1">
                                {msgSearchResults.map(res => (
                                    <button
                                        key={res.id}
                                        onClick={() => handleJumpToMessage(res.id)}
                                        className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex flex-col text-sm border-b border-gray-50 last:border-0"
                                    >
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="font-bold text-xs text-gray-700">{res.senderName}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(res.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-gray-600 truncate text-xs w-full" dangerouslySetInnerHTML={{
                                            __html: escapeHTML(res.body).replace(new RegExp(`(${escapeHTML(msgSearchQuery)})`, 'gi'), '<span class="bg-yellow-200 text-black rounded px-0.5">$1</span>')
                                        }} />
                                    </button>
                                ))}
                            </div>
                        ) : msgSearchQuery.trim() ? (
                            <div className="text-center py-4 text-xs text-gray-400">No se encontraron mensajes.</div>
                        ) : (
                            <div className="text-center py-4 text-xs text-gray-400">Escribe para buscar...</div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4"
                style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }} // Subtle pattern
            >
                {/* Loader for top */}
                {loadingMore && (
                    <div className="flex justify-center py-2">
                        <div className="bg-white/80 px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                            <CircleNotch size={14} className="animate-spin text-blue-600" />
                            <span className="text-xs font-medium text-gray-600">Cargando historial...</span>
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const prevMsg = messages[i - 1];
                    // Grouping Logic
                    const isSequence = prevMsg && prevMsg.senderId === msg.senderId && (new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 60000); // 1 min

                    return (
                        <div key={msg.id} id={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isSequence ? 'mt-1' : 'mt-4'}`}>
                            {/* Sender Name on Groups */}
                            {conversation?.type === 'group' && !isMe && !isSequence && (
                                <span className="text-[11px] font-bold text-gray-500 ml-1 mb-1">{msg.senderName}</span>
                            )}

                            <div className={`relative px-4 py-2 max-w-[85%] md:max-w-[65%] w-fit shadow-sm text-[15px] leading-relaxed break-words group/bubble
                                ${isMe
                                    ? 'bg-[#d9fdd3] text-gray-900 rounded-2xl rounded-tr-none' // WhatsApp Green-ish
                                    : 'bg-white text-gray-900 rounded-2xl rounded-tl-none'
                                }
                            `}>
                                {msg.deletedAt ? (
                                    <span className="italic text-gray-500 text-sm flex items-center gap-1"><Info size={14} /> Mensaje eliminado</span>
                                ) : (
                                    <>
                                        {/* Reply Quote UI */}
                                        {msg.replyTo && (
                                            <div className="mb-1 bg-black/5 rounded md-4 p-1 border-l-4 border-blue-500 text-xs text-gray-600 flex flex-col cursor-pointer" onClick={() => {
                                                document.getElementById(msg.replyTo!.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }}>
                                                <span className="font-bold text-blue-600 mb-0.5">{msg.replyTo.senderName}</span>
                                                <span className="truncate">{msg.replyTo.body}</span>
                                            </div>
                                        )}

                                        {/* Attachment Rendering */}
                                        {msg.attachments && msg.attachments.length > 0 && (
                                            <div className="mb-2 space-y-2">
                                                {msg.attachments.map(att => (
                                                    <div key={att.id}>
                                                        {(att.mimeType || att.type || '').startsWith('image/') ? (
                                                            <div className="rounded-lg overflow-hidden border border-black/10">
                                                                <img src={att.url || 'https://via.placeholder.com/300'} alt="Attachment" className="max-w-full max-h-[300px] object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-3 bg-black/5 p-3 rounded-lg border border-black/5">
                                                                <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm">
                                                                    <File size={24} weight="fill" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold truncate text-gray-800">{att.fileName}</p>
                                                                    <p className="text-xs text-gray-500">{(att.size / 1024).toFixed(1)} KB</p>
                                                                </div>
                                                                <a href={att.url} download target="_blank" className="p-2 hover:bg-black/10 rounded-full text-gray-500 transition-colors">
                                                                    <Download size={20} />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {msg.body}

                                        {/* Reactions UI */}
                                        {msg.reactions && msg.reactions.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1.5 -mb-2 z-20 relative">
                                                {Array.from(new Set(msg.reactions.map(r => r.emoji))).map(emoji => {
                                                    const count = msg.reactions?.filter(r => r.emoji === emoji).length;
                                                    const iReacted = msg.reactions?.find(r => r.emoji === emoji && r.userId === currentUser?.id);
                                                    return (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => handleReaction(msg.id, emoji)}
                                                            className={`text-[10px] px-1.5 py-0.5 rounded-full border shadow-sm flex items-center gap-0.5 transition-colors
                                                                ${iReacted ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'}
                                                            `}
                                                        >
                                                            <span>{emoji}</span>
                                                            <span className="font-bold">{count}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* Actions Menu Trigger (Hover) */}
                                        {!msg.deletedAt && (
                                            <div className={`absolute -top-2 ${isMe ? '-left-8' : '-right-8'} opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1`}>
                                                {/* Quick Reactions */}
                                                <div className="bg-white shadow-sm rounded-full px-1 py-0.5 border border-gray-100 hidden md:flex">
                                                    <button onClick={() => handleReaction(msg.id, '👍')} className="p-1 hover:scale-110 transition-transform">👍</button>
                                                    <button onClick={() => handleReaction(msg.id, '❤️')} className="p-1 hover:scale-110 transition-transform">❤️</button>
                                                    <button onClick={() => handleReaction(msg.id, '😂')} className="p-1 hover:scale-110 transition-transform">😂</button>
                                                </div>

                                                <button onClick={() => setMenuOpenId(menuOpenId === msg.id ? null : msg.id)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 shadow-sm">
                                                    <ArrowDown size={14} weight="bold" />
                                                </button>
                                                {/* Dropdown */}
                                                {menuOpenId === msg.id && (
                                                    <div className="absolute top-6 right-0 bg-white shadow-lg rounded-lg py-1 w-32 z-30 border border-gray-100 flex flex-col">
                                                        <button onClick={() => startReply(msg)} className="text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                                            <ArrowUUpLeft size={14} /> Responder
                                                        </button>
                                                        {isMe && (
                                                            <>
                                                                <button onClick={() => startEdit(msg)} className="text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                                                    <PencilSimple size={14} /> Editar
                                                                </button>
                                                                <button onClick={() => handleDelete(msg.id)} className="text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">
                                                                    <Trash size={14} /> Eliminar
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => handleReaction(msg.id, '👎')} className="text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2">
                                                            <ThumbsUp className="rotate-180" size={14} /> No me gusta
                                                        </button>
                                                        <button onClick={() => handleReportMessage(msg)} className="text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2">
                                                            <Info size={14} /> Reportar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 select-none ${isMe ? 'opacity-80' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {isMe && <Checks weight="bold" size={14} className="text-blue-500" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            {isBlocked ? (
                <div className="p-4 bg-gray-100 border-t border-gray-200 text-center text-gray-500 text-sm">
                    No puedes enviar mensajes a esta conversación porque has bloqueado al usuario o te han bloqueado.
                    <button onClick={handleBlockToggle} className="text-blue-500 font-bold ml-2 hover:underline">Gestionar bloqueo</button>
                </div>
            ) : (
                <div className="bg-white px-4 py-3 border-t border-gray-200">
                    {/* Reply Preview */}
                    {replyingTo && (
                        <div className="max-w-4xl mx-auto mb-2 bg-gray-50 rounded-lg p-2 border-l-4 border-blue-500 flex justify-between items-center animate-in slide-in-from-bottom-2 fade-in">
                            <div className="text-sm">
                                <div className="text-blue-600 font-bold text-xs">Respondiendo a {replyingTo.senderName}</div>
                                <div className="text-gray-500 truncate max-w-xs">{replyingTo.body}</div>
                            </div>
                            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500"><X size={16} /></button>
                        </div>
                    )}

                    {/* Upload Preview */}
                    {attachments.length > 0 && (
                        <div className="max-w-4xl mx-auto mb-2 flex gap-2 overflow-x-auto pb-1">
                            {attachments.map((att, i) => (
                                <div key={i} className="relative group shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                    {(att.mimeType || att.type || '').startsWith('image/') ? (
                                        <img src={att.url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-1">
                                            <File size={24} className="text-gray-400 mb-1" />
                                            <span className="text-[9px] text-gray-500 truncate w-full text-center">{att.fileName}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 p-0.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-end gap-2 max-w-4xl mx-auto">
                        <input
                            type="file"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`p-3 rounded-full transition-colors mb-0.5 relative group ${isUploading ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {isUploading ? (
                                <div className="flex items-center justify-center">
                                    <CircleNotch className="animate-spin" size={22} />
                                    <span className="absolute text-[8px] font-bold">{uploadProgress}</span>
                                </div>
                            ) : (
                                <Paperclip size={22} />
                            )}
                            {/* Tooltip for accepted types */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-50">
                                Imágenes, PDF, Word, Excel, TXT (Máx 10MB)
                            </div>
                        </button>
                        <div className="flex-1 bg-gray-100 rounded-3xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-blue-200">
                            {editingMsgId && (
                                <div className="mr-2 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-1 rounded">Editando</div>
                            )}
                            <textarea
                                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2 text-gray-800 placeholder-gray-500 custom-scrollbar leading-150"
                                placeholder="Escribe un mensaje..."
                                rows={1}
                                style={{ minHeight: '24px' }}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                    if (e.key === 'Escape') {
                                        if (editingMsgId) cancelEdit();
                                        if (replyingTo) setReplyingTo(null);
                                        if (attachments.length) setAttachments([]);
                                    }
                                }}
                            />
                            {editingMsgId && (
                                <button onClick={cancelEdit} className="text-gray-400 hover:text-red-500 mr-1 transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                            <button className="text-gray-400 hover:text-yellow-500 ml-2 transition-colors">
                                <Smiley size={24} />
                            </button>
                        </div>
                        <button
                            onClick={handleSend}
                            className={`p-3 rounded-full transition-all duration-200 shadow-sm flex items-center justify-center mb-0.5
                            ${input.trim()
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
                        `}
                        >
                            <PaperPlaneRight weight="fill" size={22} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
