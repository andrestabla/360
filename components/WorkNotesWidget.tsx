'use client';

import { useState, useMemo } from 'react';
import {
    Calendar, List, Plus, Trash, Check, PencilSimple,
    CaretLeft, CaretRight, Bell, Star, DotsThreeVertical,
    X, CheckCircle, Clock
} from '@phosphor-icons/react';
import { WorkNote, DB, NoteReminder } from '@/lib/data';
import { useApp } from '@/context/AppContext';

const NOTE_COLORS = [
    { name: 'Azul', value: 'bg-blue-500', border: 'border-blue-100', text: 'text-blue-600', light: 'bg-blue-50' },
    { name: 'Esmeralda', value: 'bg-emerald-500', border: 'border-emerald-100', text: 'text-emerald-600', light: 'bg-emerald-50' },
    { name: 'Violeta', value: 'bg-violet-500', border: 'border-violet-100', text: 'text-violet-600', light: 'bg-violet-50' },
    { name: 'Ámbar', value: 'bg-amber-500', border: 'border-amber-100', text: 'text-amber-600', light: 'bg-amber-50' },
    { name: 'Rosa', value: 'bg-rose-500', border: 'border-rose-100', text: 'text-rose-600', light: 'bg-rose-50' },
    { name: 'Slate', value: 'bg-slate-500', border: 'border-slate-100', text: 'text-slate-600', light: 'bg-slate-50' },
];

export default function WorkNotesWidget({ userId }: { userId: string }) {
    const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingNote, setEditingNote] = useState<WorkNote | null>(null);
    const [notes, setNotes] = useState<WorkNote[]>(() =>
        DB.workNotes.filter(n => n.userId === userId)
    );
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ACTIVE');

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const filteredNotes = useMemo(() => {
        return notes.filter(n => {
            if (filter === 'ALL') return true;
            return n.status === filter;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [notes, filter]);

    const handleAddNote = (note: Partial<WorkNote>) => {
        const newNote: WorkNote = {
            id: `note-${Date.now()}`,
            userId,
            title: note.title || '',
            content: note.content || '',
            date: note.date || new Date().toISOString().split('T')[0],
            isImportant: note.isImportant || false,
            status: 'ACTIVE',
            pinned: note.pinned || false,
            reminder: note.reminder,
            color: note.color || 'bg-blue-500',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedNotes = [newNote, ...notes];
        setNotes(updatedNotes);
        DB.workNotes.unshift(newNote); // Keep mock DB in sync
        setShowAddModal(false);
    };

    const handleUpdateNote = (id: string, updates: Partial<WorkNote>) => {
        const updatedNotes = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n);
        setNotes(updatedNotes);
        // Update Mock DB
        const dbIdx = DB.workNotes.findIndex(n => n.id === id);
        if (dbIdx > -1) DB.workNotes[dbIdx] = { ...DB.workNotes[dbIdx], ...updates, updatedAt: new Date().toISOString() };
        setEditingNote(null);
    };

    const handleDeleteNote = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta nota?')) {
            const updatedNotes = notes.filter(n => n.id !== id);
            setNotes(updatedNotes);
            DB.workNotes = DB.workNotes.filter(n => n.id !== id);
        }
    };

    const toggleComplete = (note: WorkNote) => {
        handleUpdateNote(note.id, { status: note.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE' });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                        <Star weight="fill" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Notas de Trabajo</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                            <button
                                onClick={() => setFilter('ACTIVE')}
                                className={`text-[10px] font-bold uppercase tracking-wider ${filter === 'ACTIVE' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Activas
                            </button>
                            <button
                                onClick={() => setFilter('COMPLETED')}
                                className={`text-[10px] font-bold uppercase tracking-wider ${filter === 'COMPLETED' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Completadas
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'LIST' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Vista Lista"
                        >
                            <List size={18} weight="bold" />
                        </button>
                        <button
                            onClick={() => setViewMode('CALENDAR')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'CALENDAR' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Vista Calendario"
                        >
                            <Calendar size={18} weight="bold" />
                        </button>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        title="Nueva Nota"
                    >
                        <Plus size={20} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {viewMode === 'LIST' ? (
                    <ListView notes={filteredNotes} onToggleComplete={toggleComplete} onEdit={setEditingNote} onDelete={handleDeleteNote} />
                ) : (
                    <CalendarView
                        notes={notes}
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        onEdit={setEditingNote}
                    />
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <NoteModal
                    onClose={() => setShowAddModal(false)}
                    onSave={(note: Partial<WorkNote>) => handleAddNote(note)}
                    title="Nueva Nota de Trabajo"
                />
            )}
            {editingNote && (
                <NoteModal
                    note={editingNote}
                    onClose={() => setEditingNote(null)}
                    onSave={(updates: Partial<WorkNote>) => handleUpdateNote(editingNote.id, updates)}
                    title="Editar Nota"
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENTS ---

interface ListViewProps {
    notes: WorkNote[];
    onToggleComplete: (note: WorkNote) => void;
    onEdit: (note: WorkNote) => void;
    onDelete: (id: string) => void;
}

function ListView({ notes, onToggleComplete, onEdit, onDelete }: ListViewProps) {
    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 py-10">
                <Clock size={48} weight="thin" />
                <p className="text-sm">No hay notas que mostrar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {notes.map((note: WorkNote) => (
                <div
                    key={note.id}
                    className={`p-3 rounded-xl border transition-all group ${(() => {
                        const colorObj = NOTE_COLORS.find(c => c.value === note.color) || NOTE_COLORS[0];
                        return note.isImportant ? 'bg-amber-50 border-amber-200 shadow-md ring-2 ring-amber-200' : `${colorObj.light} ${colorObj.border} hover:shadow-md`;
                    })()}`}
                >
                    <div className="flex gap-3">
                        <button
                            onClick={() => onToggleComplete(note)}
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${note.status === 'COMPLETED'
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 text-transparent hover:border-emerald-500'
                                }`}
                        >
                            <Check size={12} weight="bold" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    {new Date(note.date || note.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEdit(note)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                                        <PencilSimple size={14} />
                                    </button>
                                    <button onClick={() => onDelete(note.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className={`text-sm text-slate-700 leading-relaxed ${note.status === 'COMPLETED' ? 'line-through opacity-50' : ''}`}>
                                {note.content}
                            </p>
                            {note.reminder && (
                                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                                    <Bell size={12} weight="fill" />
                                    {new Date(note.reminder.date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface CalendarViewProps {
    notes: WorkNote[];
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    onEdit: (note: WorkNote) => void;
}

function CalendarView({ notes, currentMonth, setCurrentMonth, onEdit }: CalendarViewProps) {
    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const days = [];
    const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());

    // Padding for first day
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`pad-${i}`} className="h-14 border-b border-r border-slate-50 bg-slate-50/20" />);
    }

    for (let d = 1; d <= totalDays; d++) {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayNotes = notes.filter((n: WorkNote) => n.date === dateStr);
        const isToday = new Date().toISOString().split('T')[0] === dateStr;

        days.push(
            <div key={d} className={`h-14 border-b border-r border-slate-100 p-1 relative hover:bg-slate-50 transition-colors group ${isToday ? 'bg-blue-50/30' : ''}`}>
                <span className={`text-[10px] font-bold ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{d}</span>
                <div className="flex flex-wrap gap-0.5 mt-0.5 overflow-hidden">
                    {dayNotes.map((n: WorkNote) => (
                        <button
                            key={n.id}
                            onClick={() => onEdit(n)}
                            className={`w-full h-1.5 rounded-full transition-all ${n.color || (n.isImportant ? 'bg-amber-400' : 'bg-blue-400')
                                } ${n.status === 'COMPLETED' ? 'opacity-30' : 'hover:scale-y-150'}`}
                            title={n.content}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">{monthName}</h4>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 hover:bg-slate-100 rounded">
                        <CaretLeft size={16} />
                    </button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 hover:bg-slate-100 rounded">
                        <CaretRight size={16} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 border-t border-l border-slate-100 flex-1">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                    <div key={day} className="py-2 text-center text-[10px] font-bold text-slate-400 border-b border-r border-slate-100 bg-slate-50">
                        {day}
                    </div>
                ))}
                {days}
            </div>
        </div>
    );
}

interface NoteModalProps {
    note?: WorkNote;
    onClose: () => void;
    onSave: (note: Partial<WorkNote>) => void;
    title: string;
}

function NoteModal({ note, onClose, onSave, title }: NoteModalProps) {
    const [content, setContent] = useState(note?.content || '');
    const [date, setDate] = useState(note?.date || new Date().toISOString().split('T')[0]);
    const [isImportant, setIsImportant] = useState(note?.isImportant || false);
    const [hasReminder, setHasReminder] = useState(!!note?.reminder);
    const [reminderTime, setReminderTime] = useState(() => {
        if (note?.reminder) {
            return new Date(note.reminder.date).toISOString().slice(0, 16);
        }
        return new Date().toISOString().slice(0, 16);
    });
    const [reminderChannel, setReminderChannel] = useState<'internal' | 'email' | 'both'>(note?.reminder?.channel || 'internal');
    const [color, setColor] = useState(note?.color || NOTE_COLORS[0].value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const reminder: NoteReminder | undefined = hasReminder ? {
            date: new Date(reminderTime).toISOString(),
            channel: reminderChannel,
            sent: false
        } : undefined;

        onSave({ content, date, isImportant, reminder, color });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contenido de la Nota</label>
                        <textarea
                            autoFocus
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            rows={4}
                            maxLength={500}
                            placeholder="¿Qué tienes pendiente?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-1">
                            <span className={`text-[10px] font-medium ${content.length > 450 ? 'text-amber-600' : 'text-slate-400'}`}>
                                {content.length}/500
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 text-center">Color Categoría</label>
                        <div className="flex justify-center gap-3">
                            {NOTE_COLORS.map(c => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${c.value} ${color === c.value ? 'ring-4 ring-offset-2 ring-slate-300 scale-110' : 'hover:scale-110'}`}
                                >
                                    {color === c.value && <Check size={14} className="text-white" weight="bold" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha</label>
                            <input
                                type="date"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isImportant}
                                    onChange={(e) => setIsImportant(e.target.checked)}
                                />
                                <div className={`w-10 h-6 rounded-full relative transition-colors ${isImportant ? 'bg-amber-400' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isImportant ? 'left-5 shadow-sm' : 'left-1'}`} />
                                </div>
                                <span className="text-xs font-bold text-slate-600 uppercase">Importante</span>
                            </label>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={hasReminder}
                                onChange={(e) => setHasReminder(e.target.checked)}
                            />
                            <div className={`w-9 h-5 rounded-full relative transition-colors ${hasReminder ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${hasReminder ? 'left-4.5 shadow-sm' : 'left-0.5'}`} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                                <Bell weight={hasReminder ? 'fill' : 'bold'} /> Recordatorio
                            </span>
                        </label>

                        {hasReminder && (
                            <div className="space-y-3 pl-1 animate-fadeIn">
                                <div>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-2 bg-white border border-blue-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {(['internal', 'email', 'both'] as const).map(ch => (
                                        <button
                                            key={ch}
                                            type="button"
                                            onClick={() => setReminderChannel(ch)}
                                            className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-all ${reminderChannel === ch
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                                                }`}
                                        >
                                            {ch === 'both' ? 'Ambos' : ch === 'internal' ? 'Interno' : 'Email'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="flex-1 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                        >
                            Guardar Nota
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
