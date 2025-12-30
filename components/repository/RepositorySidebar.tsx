'use client';

import React, { useState, useEffect } from 'react';
import { X, DownloadSimple, PencilSimple, ChatCircle, Eye, FloppyDisk, Check } from '@phosphor-icons/react';
import { RepositoryFile, updateDocumentMetadataAction } from '@/app/lib/repositoryActions';
import { Unit } from '@/shared/schema';
import { FilePdf, FileDoc, FileXls, FilePpt, Image, Link as LinkIcon, Code, FileText, Folder } from '@phosphor-icons/react';

// Helper reuse
const getFileIcon = (type: string, size: number) => {
    const t = (type || '').toLowerCase();
    if (t.includes('pdf')) return <FilePdf size={size} weight="duotone" className="text-red-500" />;
    if (t.includes('doc') || t.includes('word')) return <FileDoc size={size} weight="duotone" className="text-blue-500" />;
    if (t.includes('xls') || t.includes('sheet') || t.includes('csv')) return <FileXls size={size} weight="duotone" className="text-green-500" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <FilePpt size={size} weight="duotone" className="text-orange-500" />;
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <Image size={size} weight="duotone" className="text-purple-500" />;
    if (t === 'carpeta') return <Folder size={size} weight="duotone" className="text-yellow-400" />;
    if (t === 'link') return <LinkIcon size={size} weight="duotone" className="text-blue-400" />;
    if (t === 'embed') return <Code size={size} weight="duotone" className="text-slate-600" />;
    return <FileText size={size} weight="duotone" className="text-slate-400" />;
};

interface RepositorySidebarProps {
    doc: RepositoryFile;
    units: Unit[];
    onClose: () => void;
    onDownload: (doc: RepositoryFile) => void;
    onUpdate: () => void; // Trigger refresh
}

export function RepositorySidebar({ doc, units, onClose, onDownload, onUpdate }: RepositorySidebarProps) {
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'comments'>('view');

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                    <X size={20} />
                </button>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    <TabButton active={activeTab === 'view'} onClick={() => setActiveTab('view')} label="Ver" />
                    <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} label="Editar" />
                    <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} label="Comentarios" />
                </div>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
                {activeTab === 'view' && <ViewTab doc={doc} onDownload={() => onDownload(doc)} />}
                {activeTab === 'edit' && <EditTab doc={doc} units={units} onUpdate={onUpdate} />}
                {activeTab === 'comments' && <CommentsTab />}
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
        >
            {label}
        </button>
    );
}

// --- TABS ---

function ViewTab({ doc, onDownload }: { doc: RepositoryFile, onDownload: () => void }) {
    return (
        <div className="p-6">
            <div className="flex items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl mb-8 shadow-sm">
                {getFileIcon(doc.type || '', 80)}
            </div>

            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{doc.title}</h2>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded tracking-wide">
                        {doc.type}
                    </span>
                </div>
                {/* <button className="p-2 text-slate-400 hover:text-yellow-400 transition-colors"><Star size={20} weight="duotone" /></button> */}
            </div>

            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100">
                <InfoRow label="Tamaño" value={doc.size || '3.2 MB'} />
                <InfoRow label="Unidad" value={doc.unitId || 'General'} />
                <InfoRow label="Subido por" value="Andrés Tabla" />
                <InfoRow label="Fecha" value={new Date(doc.createdAt || Date.now()).toLocaleDateString()} />
            </div>

            <button
                onClick={onDownload}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <DownloadSimple size={20} weight="bold" />
                Descargar Archivo
            </button>
        </div>
    );
}

function InfoRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center py-1">
            <span className="text-xs font-medium text-slate-500 uppercase">{label}</span>
            <span className="text-sm font-semibold text-slate-700">{value}</span>
        </div>
    )
}

function EditTab({ doc, units, onUpdate }: { doc: RepositoryFile, units: Unit[], onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: doc.title || '',
        description: doc.content || '', // Mapping content to description
        unitId: doc.unitId || '',
        process: doc.process || '',
        keywords: Array.isArray(doc.tags) ? doc.tags.join(', ') : '',
        expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString().split('T')[0] : '',
        color: '#3b82f6' // Default logic or stored
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateDocumentMetadataAction(doc.id, {
                title: formData.title,
                unitId: formData.unitId || undefined,
                process: formData.process,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
                tags: formData.keywords.split(',').map(s => s.trim()).filter(Boolean),
                description: formData.description
            });
            onUpdate();
            alert('Metadatos actualizados');
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2 mb-4">
                <PencilSimple size={16} /> Editar Metadatos
            </h3>

            <div className="space-y-4">
                <InputGroup label="Nombre del Documento">
                    <input
                        value={formData.title}
                        onChange={e => handleChange('title', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                </InputGroup>

                <InputGroup label="Descripción">
                    <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => handleChange('description', e.target.value)}
                        placeholder="Añade una descripción..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                    />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Unidad / Subárea">
                        <select
                            value={formData.unitId}
                            onChange={e => handleChange('unitId', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                            <option value="">General</option>
                            {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Proceso">
                        <input
                            value={formData.process}
                            onChange={e => handleChange('process', e.target.value)}
                            placeholder="Ej: Auditoría"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </InputGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Palabras Clave (Separadas por coma)">
                        <input
                            value={formData.keywords}
                            onChange={e => handleChange('keywords', e.target.value)}
                            placeholder="Ej: Auditoría, 2024"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </InputGroup>
                    <InputGroup label="Fecha de Expiración">
                        <input
                            type="date"
                            value={formData.expiresAt}
                            onChange={e => handleChange('expiresAt', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                    </InputGroup>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 text-center">Etiqueta de Color</label>
                    <div className="flex justify-center gap-3">
                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'].map(c => (
                            <button
                                key={c}
                                onClick={() => handleChange('color', c)}
                                className={`w-8 h-8 rounded-full transition-all ${formData.color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-300' : 'hover:scale-110'}`}
                                style={{ backgroundColor: c }}
                            >
                                {formData.color === c && <Check size={14} className="text-white mx-auto" weight="bold" />}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            <div className="pt-8 flex justify-end gap-3">
                <button className="px-5 py-2.5 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}

function InputGroup({ label, children }: any) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
            {children}
        </div>
    )
}


function CommentsTab() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <ChatCircle size={48} className="mb-4 text-slate-200" weight="duotone" />
                <p className="font-medium text-slate-600">Sin comentarios</p>
                <p className="text-xs">Sé el primero en opinar.</p>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <input
                    placeholder="Escribe un comentario..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
            </div>
        </div>
    )
}
