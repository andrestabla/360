import { useState } from 'react';
import { X, MagnifyingGlass, FileText, UploadSimple, Link as LinkIcon, Code } from '@phosphor-icons/react';
import { DB, Doc } from '@/lib/data';
import { uploadProjectEvidenceAction } from '@/app/actions/uploadActions';
import toast from 'react-hot-toast';

interface AddEvidenceModalProps {
    isOpen: boolean;
    projectId: string; // Added prop
    onClose: () => void;
    onAdd: (evidence: any) => void;
}

export function AddEvidenceModal({ isOpen, projectId, onClose, onAdd }: AddEvidenceModalProps) {
    const [activeTab, setActiveTab] = useState<'repo' | 'link' | 'upload' | 'embed'>('repo');
    const [search, setSearch] = useState('');

    // Link State
    const [linkUrl, setLinkUrl] = useState('');
    const [linkTitle, setLinkTitle] = useState('');

    // Embed State
    const [embedCode, setEmbedCode] = useState('');
    const [embedTitle, setEmbedTitle] = useState('');

    // Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen) return null;

    const handleAddRepo = (doc: Doc) => {
        onAdd({
            type: 'repository',
            id: doc.id,
            name: doc.title,
            url: doc.url || `/dashboard/repository?docId=${doc.id}`,
            mimeType: doc.type
        });
        onClose();
    };

    const handleAddLink = () => {
        if (!linkUrl || !linkTitle) return;
        onAdd({
            type: 'link',
            id: `lnk-${Date.now()}`,
            name: linkTitle,
            url: linkUrl
        });
        onClose();
    };

    const handleAddEmbed = () => {
        if (!embedCode || !embedTitle) return;
        onAdd({
            type: 'embed',
            id: `emb-${Date.now()}`,
            name: embedTitle,
            content: embedCode
        });
        onClose();
    };

    const handleAddFile = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const toastId = toast.loading('Subiendo archivo...');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const res = await uploadProjectEvidenceAction(projectId, formData);

            if (res.success && res.url) {
                toast.success('Archivo subido correctamente', { id: toastId });
                onAdd({
                    type: 'file',
                    id: `file-${Date.now()}`,
                    name: selectedFile.name,
                    file: selectedFile,
                    url: res.url // Real URL from R2
                });
                onClose();
            } else {
                toast.error('Error al subir: ' + (res.error || 'Desconocido'), { id: toastId });
            }
        } catch (e) {
            console.error(e);
            toast.error('Error de conexión', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                {/* Header with Tabs */}
                <div className="border-b border-slate-200">
                    <div className="p-4 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Agregar Evidencia / Documento</h3>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
                    </div>

                    <div className="flex px-4 gap-6 overflow-x-auto">
                        <button onClick={() => setActiveTab('repo')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'repo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            Repositorio
                        </button>
                        <button onClick={() => setActiveTab('link')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'link' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            Enlace Externo
                        </button>
                        <button onClick={() => setActiveTab('upload')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            Cargar Archivo
                        </button>
                        <button onClick={() => setActiveTab('embed')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-2 ${activeTab === 'embed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            Embed / Iframe
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto min-h-[300px]">
                    {activeTab === 'repo' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <MagnifyingGlass className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    placeholder="Buscar documento aprobado..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {DB.docs.filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase())).map(doc => (
                                    <div key={doc.id} onClick={() => handleAddRepo(doc)} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer group transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-white group-hover:text-blue-600">
                                                <FileText size={20} weight="duotone" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{doc.title}</p>
                                                <p className="text-xs text-slate-400">{doc.type} • {new Date(doc.date || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 text-blue-600 font-bold text-xs bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-100">
                                            Seleccionar
                                        </div>
                                    </div>
                                ))}
                                {DB.docs.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400">No se encontraron documentos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'link' && (
                        <div className="space-y-4 max-w-md mx-auto pt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título del Enlace</label>
                                <input
                                    value={linkTitle}
                                    onChange={e => setLinkTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Ej: Documentación de API"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL / Link</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        value={linkUrl}
                                        onChange={e => setLinkUrl(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <button onClick={handleAddLink} disabled={!linkUrl || !linkTitle} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-4 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20">
                                Agregar Enlace
                            </button>
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer relative group">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all">
                                <UploadSimple size={32} weight="duotone" />
                            </div>
                            <p className="font-bold text-slate-700 mb-1">
                                {selectedFile ? selectedFile.name : 'Haz clic para cargar un archivo'}
                            </p>
                            <p className="text-xs text-slate-400">PDF, Imágenes, Word, Excel (Max 10MB)</p>

                            {selectedFile && (
                                <button onClick={(e) => { e.stopPropagation(); handleAddFile(); }} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 z-20 relative animate-in fade-in zoom-in-95">
                                    Subir Archivo
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'embed' && (
                        <div className="space-y-4 pt-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                <input
                                    value={embedTitle}
                                    onChange={e => setEmbedTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Ej: Tablero de Miro"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código Embed (Iframe)</label>
                                <div className="relative">
                                    <Code className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <textarea
                                        value={embedCode}
                                        onChange={e => setEmbedCode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-mono text-slate-600"
                                        placeholder="<iframe src='...' ...></iframe>"
                                        rows={5}
                                    />
                                </div>
                            </div>
                            <button onClick={handleAddEmbed} disabled={!embedCode || !embedTitle} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20">
                                Agregar Embed
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
