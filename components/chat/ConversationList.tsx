'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Conversation } from '@/types/chat';
import { useApp } from '@/context/AppContext';
import { getConversationsAction, createDMAction, createGroupAction, searchConversationsAction } from '@/app/lib/chatActions';
import { MagnifyingGlass, User, Users, CircleNotch, Plus, UsersThree } from '@phosphor-icons/react';
import { useRouter, useSearchParams } from 'next/navigation';
import NewOneOnOneModal from './NewOneOnOneModal';
import NewGroupModal from './NewGroupModal';

export default function ConversationList() {
    const { currentUser, refreshUnreadCount } = useApp();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const [showNewGroup, setShowNewGroup] = useState(false);

    // For manual refresh triggering
    const [refreshKey, setRefreshKey] = useState(0);

    const router = useRouter();
    const searchParams = useSearchParams();
    const activeId = searchParams.get('chatId');

    const loadConversations = useCallback(async (isInitial = false) => {
        if (!currentUser) return;
        if (isInitial) setLoading(true);
        try {
            const res = await getConversationsAction(currentUser.id);
            if (res.success && res.data) {
                const enriched = res.data.map((c: any) => ({
                    ...c,
                    participants: c.participants || [],
                    title: c.title || null,
                    // If active, force unread to 0 locally. Server action will catch up eventually.
                    unreadCount: c.id === activeId ? 0 : c.unreadCount
                })) as Conversation[];
                setConversations(enriched);
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, [currentUser, activeId]); // ActiveId still needed for correct mapping, but we won't trigger if not needed.

    useEffect(() => {
        // Initial load
        loadConversations(true);

        // Safety timeout for spinner
        const safetyTimer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        const interval = setInterval(() => {
            loadConversations(false);
        }, 5000);
        return () => {
            clearInterval(interval);
            clearTimeout(safetyTimer);
        };

    }, [currentUser]); // Removed loadConversations/activeId from dependency to stop re-running on select
    // But wait, if activeId changes, we DO want to re-render to zero-out the count. 
    // We can do that purely in render or local state update without fetching.

    useEffect(() => {
        // When activeId changes, locally update unread count without fetching
        setConversations(prev => prev.map(c => c.id === activeId ? { ...c, unreadCount: 0 } : c));
        refreshUnreadCount();
    }, [activeId]);


    const handleSelect = (conv: Conversation) => {
        const params = new URLSearchParams(searchParams);
        params.set('chatId', conv.id);
        router.push(`/dashboard/chat?${params.toString()}`);

        // Optimistic update handled by the useEffect[activeId] above automatically 
        // or we can do it here for immediate feedback, but useEffect is safer for back/forward nav.
    };

    const handleCreateDM = async (targetUserId: string) => {
        if (!currentUser) return;
        setShowNewChat(false);
        try {
            const result = await createDMAction(currentUser.id, targetUserId);
            const chatId = result.data?.id;
            if (!chatId) throw new Error('Failed to create chat');

            await loadConversations();

            const params = new URLSearchParams(searchParams);
            params.set('chatId', chatId);
            router.push(`/dashboard/chat?${params.toString()}`);
        } catch (e) {
            console.error(e);
            alert('Error creating chat');
        }
    };

    const handleCreateGroup = async (title: string, memberIds: string[]) => {
        if (!currentUser) return;
        setShowNewGroup(false);
        try {
            const result = await createGroupAction(title, currentUser.id, memberIds);
            const chatId = result.data?.id;
            if (!chatId) throw new Error('Failed to create group');

            await loadConversations();

            const params = new URLSearchParams(searchParams);
            params.set('chatId', chatId);
            router.push(`/dashboard/chat?${params.toString()}`);
        } catch (e) { console.error(e); }
    };

    // Search State
    const [searchResults, setSearchResults] = useState<Conversation[] | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!search.trim()) {
                setSearchResults(null);
                return;
            }
            if (!currentUser) return;

            setIsSearching(true);
            try {
                const results = await searchConversationsAction(currentUser.id, search);
                const enrichedResults = results.map((c: any) => ({
                    ...c,
                    participants: c.participants || [],
                    title: c.title || null,
                    unreadCount: 0
                })) as Conversation[];
                setSearchResults(enrichedResults);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, currentUser]);

    // Handle Search Input Change
    // No change needed to JSX aside from binding

    // List to display
    const displayList = searchResults !== null ? searchResults : conversations;

    // Date formatter
    const formatTime = (val?: string | Date | null) => {
        if (!val) return '';
        const date = new Date(val);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (days === 1) return 'Ayer';
        if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Mensajes</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNewGroup(true)}
                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Nuevo Grupo"
                        >
                            <UsersThree weight="bold" size={18} />
                        </button>
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Nuevo Chat"
                        >
                            <Plus weight="bold" size={18} />
                        </button>
                        {loading || isSearching ? <CircleNotch className="animate-spin text-blue-500" size={20} /> : null}
                    </div>
                </div>
                <div className="relative group">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder-gray-400 font-medium"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {displayList.map(conv => (
                    <button
                        key={conv.id}
                        onClick={() => handleSelect(conv)}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group relative
                            ${activeId === conv.id
                                ? 'bg-blue-50/50 shadow-sm ring-1 ring-blue-100'
                                : 'hover:bg-gray-50'
                            }
                        `}
                    >
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-1 ring-black/5 overflow-hidden
                            ${conv.type === 'group' ? 'bg-indigo-100 text-indigo-600' : 'bg-gradient-to-br from-pink-100 to-rose-100 text-rose-600'}`}>
                            {conv.type === 'group' ? (
                                <Users weight="bold" size={20} />
                            ) : conv.avatar ? (
                                <img
                                    src={conv.avatar}
                                    alt={conv.title || ''}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src.includes('/avatars/') && !target.src.includes('/api/storage/')) {
                                            target.src = '/api/storage' + target.src.substring(target.src.indexOf('/avatars/'));
                                        } else {
                                            target.style.display = 'none';
                                            target.parentElement?.classList.add('fallback-avatar');
                                            // Fallback text logic handled by parent if img hidden? 
                                            // Easier: swap to text node but React reconciliation fits better if we use state.
                                            // MVP: Hide img and show fallback element underneath if absolute.
                                        }
                                    }}
                                />
                            ) : (
                                <span className="text-sm font-bold">{conv.title?.[0] || '?'}</span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 py-0.5">
                            <div className="flex justify-between items-center mb-0.5">
                                <h4 className={`text-sm font-bold truncate ${activeId === conv.id ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {conv.title}
                                </h4>
                                <span className={`text-[10px] font-medium ${conv.unreadCount && conv.unreadCount > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {formatTime(conv.lastMessageAt as string)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className={`text-xs truncate max-w-[85%] ${conv.unreadCount && conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {conv.type === 'dm' && activeId !== conv.id ? 'Tu: ' : ''}{/* Simple logic, needs improvement based on sender */}
                                    {conv.lastMessage}
                                </p>
                                {conv.unreadCount != undefined && conv.unreadCount > 0 && (
                                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm shadow-blue-200">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}

                {loading && (
                    <div className="space-y-4 p-2 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !isSearching && displayList.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <p className="text-sm text-gray-500">No se encontraron conversaciones</p>
                    </div>
                )}
            </div>

            <NewOneOnOneModal
                isOpen={showNewChat}
                onClose={() => setShowNewChat(false)}
                onUserSelect={handleCreateDM}
            />

            <NewGroupModal
                isOpen={showNewGroup}
                onClose={() => setShowNewGroup(false)}
                onGroupCreate={handleCreateGroup}
            />
        </div>
    );
}
