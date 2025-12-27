'use client';
import { useState, useEffect } from 'react';
import { X, MagnifyingGlass, UserPlus, Check, CircleNotch } from '@phosphor-icons/react';
import { ChatService } from '@/lib/services/chatService';
import { User } from '@/lib/data';
import { useApp } from '@/context/AppContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onGroupCreate: (title: string, memberIds: string[]) => void;
}

export default function NewGroupModal({ isOpen, onClose, onGroupCreate }: Props) {
    const { currentUser } = useApp();
    const [title, setTitle] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [selected, setSelected] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setResults([]);
            setSelected([]);
            setTitle('');
        } else {
            // Initial load of some suggestions?
            search('');
        }
    }, [isOpen]);

    const search = async (q: string) => {
        setLoading(true);
        try {
            const users = await ChatService.searchUsers(q);
            // Filter out self and already selected
            setResults(users.filter((u: User) => u.id !== currentUser?.id));
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        search(val);
    };

    const toggleUser = (user: User) => {
        if (selected.find(u => u.id === user.id)) {
            setSelected(prev => prev.filter(u => u.id !== user.id));
        } else {
            setSelected(prev => [...prev, user]);
        }
    };

    const handleSubmit = () => {
        if (!title.trim() || selected.length === 0) return;
        const ids = selected.map(u => u.id);
        onGroupCreate(title, ids);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">Nuevo Grupo</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Title Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Grupo</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
                            placeholder="Ej. Proyecto Alpha"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none text-sm"
                            placeholder="Buscar integrantes..."
                            value={query}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Selected Chips */}
                    {selected.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selected.map(user => (
                                <div key={user.id} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-indigo-100">
                                    {user.name}
                                    <button onClick={() => toggleUser(user)} className="hover:text-indigo-900"><X size={12} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2 border-t border-gray-100 space-y-1 custom-scrollbar">
                    {loading && (
                        <div className="flex justify-center py-4">
                            <CircleNotch size={24} className="animate-spin text-indigo-500" />
                        </div>
                    )}

                    {!loading && results.map(user => {
                        const isSelected = !!selected.find(u => u.id === user.id);
                        return (
                            <button
                                key={user.id}
                                onClick={() => toggleUser(user)}
                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors group text-left
                                    ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}
                                `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors
                                    ${isSelected ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}
                                `}>
                                    {isSelected ? <Check size={14} weight="bold" /> : user.initials}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{user.name}</h4>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button
                        disabled={!title.trim() || selected.length === 0}
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm
                            ${(!title.trim() || selected.length === 0)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md active:scale-95'
                            }
                        `}
                    >
                        Crear Grupo ({selected.length})
                    </button>
                </div>
            </div>
        </div>
    );
}
