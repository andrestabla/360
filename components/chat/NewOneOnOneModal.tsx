'use client';
import { useState, useEffect } from 'react';
import { X, MagnifyingGlass, UserPlus, CircleNotch } from '@phosphor-icons/react';
import { ChatService } from '@/lib/services/chatService';
import { User } from '@/lib/data';
import { useApp } from '@/context/AppContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUserSelect: (userId: string) => void;
}

export default function NewOneOnOneModal({ isOpen, onClose, onUserSelect }: Props) {
    const { currentTenantId, currentUser } = useApp();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults([]);
        } else {
            // Initial load of some suggestions?
            search('');
        }
    }, [isOpen]);

    const search = async (q: string) => {
        if (!currentTenantId) return;
        setLoading(true);
        try {
            const users = await ChatService.searchUsers(currentTenantId, q);
            // Filter out self
            setResults(users.filter((u: User) => u.id !== currentUser?.id));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        // Debounce could go here, but for mock, direct call is fine
        search(val);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">Nueva Conversación</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium"
                            placeholder="Buscar personas..."
                            value={query}
                            onChange={handleSearch}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {loading && (
                        <div className="flex justify-center py-8">
                            <CircleNotch size={24} className="animate-spin text-blue-500" />
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-sm">No se encontraron usuarios</p>
                        </div>
                    )}

                    {!loading && results.map(user => (
                        <button
                            key={user.id}
                            onClick={() => onUserSelect(user.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-white shadow-sm">
                                {user.initials}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{user.name}</h4>
                                <p className="text-xs text-gray-500">{user.role} • {user.unit}</p>
                            </div>
                            <UserPlus size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
