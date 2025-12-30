'use client';

import { useState, useEffect } from 'react';
import { PencilSimple, XCircle, FloppyDisk } from '@phosphor-icons/react';
import { updateDocumentMetadataAction, RepositoryFile } from '@/app/lib/repositoryActions';
import { Unit } from '@/shared/schema';

interface EditMetadataModalProps {
    document: RepositoryFile;
    units: Unit[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditMetadataModal({ document, units, isOpen, onClose, onSuccess }: EditMetadataModalProps) {
    const [title, setTitle] = useState(document.title);
    const [unitId, setUnitId] = useState(document.unitId || '');
    const [process, setProcess] = useState(document.process || '');
    const [expiresAt, setExpiresAt] = useState(document.expiresAt ? new Date(document.expiresAt).toISOString().split('T')[0] : '');
    const [keywords, setKeywords] = useState(Array.isArray(document.tags) ? document.tags.join(', ') : '');
    const [description, setDescription] = useState(document.content || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle(document.title);
            setUnitId(document.unitId || '');
            setProcess(document.process || '');
            setExpiresAt(document.expiresAt ? new Date(document.expiresAt).toISOString().split('T')[0] : '');
            setKeywords(Array.isArray(document.tags) ? document.tags.join(', ') : '');
            setDescription(document.content || '');
        }
    }, [isOpen, document]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDocumentMetadataAction(document.id, {
                title,
                unitId: unitId || undefined,
                process,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                tags: keywords.split(',').map(s => s.trim()).filter(Boolean),
                description
            });
            onSuccess();
            onClose();
        } catch (e: any) {
            alert('Error al actualizar: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm">
            <div className="h-full w-full max-w-md bg-white shadow-2xl skew-x-0 animate-slide-in-right flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <PencilSimple className="text-blue-500" size={20} weight="fill" />
                        Editar Metadatos
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <XCircle size={24} weight="fill" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre del Documento</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Añade una descripción..."
                        />
                    </div>

                    <hr className="border-slate-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unidad / Subárea</label>
                            <select
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                value={unitId}
                                onChange={e => setUnitId(e.target.value)}
                            >
                                <option value="">General</option>
                                {units.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proceso</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                value={process}
                                onChange={e => setProcess(e.target.value)}
                                placeholder="Ej: Auditoría"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Palabras Clave (Separadas por coma)</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                value={keywords}
                                onChange={e => setKeywords(e.target.value)}
                                placeholder="Ej: Reporte, 2024"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha de Expiración</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                value={expiresAt}
                                onChange={e => setExpiresAt(e.target.value)}
                            />
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-slate-600 font-bold bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <FloppyDisk weight="bold" size={18} />}
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
