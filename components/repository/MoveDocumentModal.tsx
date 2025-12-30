'use client';

import React, { useState, useEffect } from 'react';
import { X, Folder, FolderMinus, ArrowRight, CaretRight, Check } from '@phosphor-icons/react';
import { getFoldersAction, moveDocumentAction, RepositoryFolder } from '@/app/lib/repositoryActions';

interface MoveDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    doc: { id: string, title: string };
    onMoveConfirm: () => void;
}

export function MoveDocumentModal({ isOpen, onClose, doc, onMoveConfirm }: MoveDocumentModalProps) {
    const [folders, setFolders] = useState<RepositoryFolder[]>([]);
    const [currentPath, setCurrentPath] = useState<{ id: string | null, name: string }[]>([{ id: null, name: 'Repositorio' }]);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadFolders(null);
            setCurrentPath([{ id: null, name: 'Repositorio' }]);
            setSelectedFolderId(null);
        }
    }, [isOpen]);

    const loadFolders = async (parentId: string | null) => {
        try {
            const res = await getFoldersAction(parentId);
            setFolders(res);
        } catch (e) { console.error(e); }
    };

    const handleNavigate = (folder: RepositoryFolder) => {
        setCurrentPath(prev => [...prev, { id: folder.id, name: folder.name }]);
        loadFolders(folder.id);
        setSelectedFolderId(folder.id);
    };

    const handleBreadcrumb = (index: number) => {
        const item = currentPath[index];
        setCurrentPath(prev => prev.slice(0, index + 1));
        loadFolders(item.id);
        setSelectedFolderId(item.id);
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await moveDocumentAction(doc.id, selectedFolderId);
            onMoveConfirm();
            onClose();
            alert('Documento movido correctamente');
        } catch (e: any) {
            alert('Error al mover: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <h3 className="font-bold text-slate-800">Mover Documento</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>

                <div className="p-4 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {currentPath.map((item, i) => (
                            <React.Fragment key={item.id || 'root'}>
                                {i > 0 && <CaretRight size={12} className="text-slate-300 flex-shrink-0" />}
                                <button
                                    onClick={() => handleBreadcrumb(i)}
                                    className={`flex items-center gap-1 text-xs font-bold whitespace-nowrap ${i === currentPath.length - 1 ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Folder size={14} weight={i === currentPath.length - 1 ? 'fill' : 'regular'} />
                                    {item.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Selecciona la carpeta destino para: <span className="text-slate-600 font-semibold">{doc.title}</span></p>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {folders.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p className="text-sm">Carpeta vacía</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {folders.map(folder => (
                                <div key={folder.id}
                                    onClick={() => handleNavigate(folder)}
                                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer group border border-transparent hover:border-slate-100 transition-all`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Folder size={24} className="text-yellow-400" weight="duotone" />
                                        <span className="text-sm font-medium text-slate-700">{folder.name}</span>
                                    </div>
                                    <CaretRight size={16} className="text-slate-300 group-hover:text-slate-400" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded-lg">Cancelar</button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm active:scale-95 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Moviendo...' : (<><Check size={16} weight="bold" /> Mover Aquí</>)}
                    </button>
                </div>
            </div>
        </div>
    );
}
