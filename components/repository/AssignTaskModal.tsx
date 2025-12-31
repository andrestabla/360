'use client';

import { useState, useEffect, useRef } from 'react';
import { User, CheckCircle, XCircle, SpinnerGap, CaretDown, CaretUp } from '@phosphor-icons/react';
import { createTaskAction } from '@/app/lib/taskActions';
import { getUsersAction } from '@/app/lib/userActions';

interface AssignTaskModalProps {
    documentId: string;
    documentTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

interface UserSummary {
    id: string;
    name: string;
    email: string;
}

export function AssignTaskModal({ documentId, documentTitle, isOpen, onClose }: AssignTaskModalProps) {
    const [type, setType] = useState('REVIEW');
    const [priority, setPriority] = useState('MEDIUM');
    const [dueDate, setDueDate] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    // User Autocomplete State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setLoadingUsers(true);
            getUsersAction().then(res => {
                if (res.success && res.data) {
                    setUsers(res.data.map((u: any) => ({ id: u.id, name: u.name, email: u.email })));
                } else {
                    console.error("Failed to load users for assignment");
                }
                setLoadingUsers(false);
            });
        } else {
            // Reset state on close
            setSearchTerm('');
            setSelectedUser(null);
            setType('REVIEW');
            setPriority('MEDIUM');
            setDueDate('');
            setInstructions('');
        }
    }, [isOpen]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const filteredUsers = users.filter((u) => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return u.name.toLowerCase().includes(lowerTerm) || u.email.toLowerCase().includes(lowerTerm);
    });

    const handleSelectUser = (user: UserSummary) => {
        setSelectedUser(user);
        setSearchTerm(user.name);
        setShowDropdown(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setSelectedUser(null); // Clear selection if typing
        setShowDropdown(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUser) {
            alert('Por favor selecciona un usuario de la lista');
            return;
        }

        setLoading(true);
        try {
            await createTaskAction({
                type,
                documentId,
                assigneeId: selectedUser.id,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                instructions
            });
            alert('Tarea asignada correctamente');
            onClose();
        } catch (e: any) {
            alert('Error al asignar tarea: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle className="text-blue-500" size={20} weight="fill" />
                        Asignar Tarea
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <XCircle size={24} weight="fill" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 text-sm text-blue-800 flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Documento</span>
                        <div className="font-semibold truncate">{documentTitle}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo de Acción</label>
                            <div className="relative">
                                <select
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none font-medium text-slate-700"
                                >
                                    <option value="REVIEW">Revisar</option>
                                    <option value="APPROVE">Aprobar</option>
                                    <option value="VERSION">Versionar</option>
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="bold" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Prioridad</label>
                            <div className="relative">
                                <select
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none font-medium text-slate-700"
                                >
                                    <option value="LOW">Baja</option>
                                    <option value="MEDIUM">Media</option>
                                    <option value="HIGH">Alta</option>
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="bold" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5 relative" ref={dropdownRef}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Asignar a Usuario</label>
                        <div className="relative group">
                            {/* Icon hidden when placeholder is not shown (i.e. text entered) */}
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-all duration-200 peer-focus:opacity-0 opacity-100 group-has-[:not(:placeholder-shown)]:opacity-0">
                                <User size={18} weight="bold" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o correo..."
                                className="peer w-full pl-10 placeholder-shown:pl-10 focus:pl-4 not-placeholder-shown:pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setShowDropdown(true)}
                                disabled={loadingUsers}
                            />
                            {loadingUsers && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <SpinnerGap className="animate-spin text-blue-500" size={18} />
                                </div>
                            )}
                        </div>

                        {/* Dropdown Results */}
                        {showDropdown && (users.length > 0) && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleSelectUser(user)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {user.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800 text-sm">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-400 text-center italic">
                                        No se encontraron usuarios
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Vencimiento</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Instrucciones</label>
                        <textarea
                            rows={3}
                            placeholder="Detalles adicionales para la tarea..."
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <SpinnerGap className="animate-spin" size={18} />
                                    <span>Asignando...</span>
                                </>
                            ) : (
                                'Asignar Tarea'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
