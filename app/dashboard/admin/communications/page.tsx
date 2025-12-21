'use client';


import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DB, Post } from '@/lib/data';
import { Plus, PencilSimple, Trash, X, Image as ImageIcon, Video, SpeakerHigh, FileText, Globe, Users, CheckCircle, WarningCircle, Paperclip, EyeSlash, ChartBar } from '@phosphor-icons/react';
import AdminGuide from '@/components/AdminGuide';
import { communicationsGuide } from '@/lib/adminGuides';

export default function CommunicationsPage() {
    const { currentUser, currentTenantId, adminCreatePost, adminUpdatePost, adminDeletePost } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [analyticsPost, setAnalyticsPost] = useState<Post | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Post>>({
        title: '',
        excerpt: '',
        content: '',
        category: 'Institucional',
        mediaType: 'image',
        mediaUrl: '',
        image: '',
        status: 'PUBLISHED',
        audience: 'GLOBAL'
    });

    if (!currentUser || currentUser.level !== 1) {
        return <div className="p-8 text-center text-slate-500">Acceso restringido.</div>;
    }

    const posts = DB.posts.filter(p => p.tenantId === currentTenantId);
    const units = DB.units.filter(u => u.tenantId === currentTenantId);

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        setFormData({ ...post });
        setShowModal(true);
    };


    const handleCreate = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'Institucional',
            mediaType: 'image',
            mediaUrl: '',
            image: '',
            status: 'PUBLISHED',
            audience: 'GLOBAL'
        });
        setShowModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({
                ...formData,
                attach: {
                    name: file.name,
                    type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
                }
            });
        }
    };

    const removeAttachment = () => {
        setFormData({ ...formData, attach: undefined });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.content) return;

        if (editingPost) {
            adminUpdatePost(editingPost.id, formData);
        } else {
            adminCreatePost({
                ...formData as any,
                tenantId: currentTenantId!,
                author: currentUser.name,
                // attach: { name: 'Adjunto Demo', type: 'pdf' } // Removed default attachment
            });
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta publicación?')) {
            adminDeletePost(id);
        }
    };

    const handleHide = (post: Post) => {
        if (confirm('¿Deseas ocultar esta publicación? Pasará a estado Archivado.')) {
            adminUpdatePost(post.id, { status: 'ARCHIVED' });
        }
    };

    const handleAnalytics = (post: Post) => {
        setAnalyticsPost(post);
        setShowAnalyticsModal(true);
    };

    return (
        <div className="p-8 animate-fadeIn max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Comunicaciones</h1>
                    <p className="text-slate-500">Gestiona las noticias, comunicados y contenido institucional.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus weight="bold" /> Nueva Publicación
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Título</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Categoría</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Audiencia</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {posts.map(post => (
                            <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-semibold text-slate-800 line-clamp-1">{post.title}</div>
                                    <div className="text-xs text-slate-400">Por {post.author} • {post.date}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${getCategoryColor(post.category)}`}>
                                        {post.category}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">
                                    {getMediaIcon(post.mediaType)}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${post.status === 'PUBLISHED'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${post.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        {post.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {post.audience === 'GLOBAL' ? (
                                        <div className="flex items-center gap-1"><Globe size={14} /> Global</div>
                                    ) : (
                                        <div className="flex items-center gap-1" title={Array.isArray(post.audience) ? post.audience.join(', ') : ''}>
                                            <Users size={14} />
                                            {Array.isArray(post.audience) && post.audience.length > 0
                                                ? (units.find(u => u.id === post.audience[0])?.name || 'Unidad') + (post.audience.length > 1 ? '...' : '')
                                                : 'Personalizado'}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleAnalytics(post)} title="Ver Analítica" className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                                            <ChartBar size={18} />
                                        </button>
                                        <button onClick={() => handleHide(post)} title="Ocultar Publicación" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                            <EyeSlash size={18} />
                                        </button>
                                        <button onClick={() => handleEdit(post)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                            <PencilSimple size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && (
                    <div className="p-12 text-center text-slate-400">No hay publicaciones aún.</div>
                )}
            </div>

            {/* Modal de Edición */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative animate-scaleIn max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-slate-800 mb-6">{editingPost ? 'Editar Publicación' : 'Nueva Publicación'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Título <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Ej: Nuevo beneficio corporativo"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Extracto (Resumen)</label>
                                <input
                                    type="text"
                                    value={formData.excerpt}
                                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Breve descripción para el feed..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                    >
                                        <option value="Institucional">Institucional</option>
                                        <option value="Social">Social</option>
                                        <option value="Noticia">Noticia</option>
                                        <option value="Alerta">Alerta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Medio</label>
                                    <select
                                        value={formData.mediaType}
                                        onChange={e => setFormData({ ...formData, mediaType: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                    >
                                        <option value="image">Imagen</option>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="article">Artículo</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Contenido (HTML simple) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
                                    placeholder="<p>Escribe aquí el contenido...</p>"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">URL Media (Video/Audio)</label>
                                    <input
                                        type="text"
                                        value={formData.mediaUrl || ''}
                                        onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">URL Imagen (Portada)</label>
                                    <input
                                        type="text"
                                        value={formData.image || ''}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Archivo Adjunto */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Archivo Adjunto (Opcional)</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer bg-slate-50 border border-slate-300 text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                                        <Paperclip size={18} /> Seleccionar Archivo
                                        <input type="file" className="hidden" onChange={handleFileChange} />
                                    </label>

                                    {formData.attach && (
                                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm border border-blue-100 animate-fadeIn">
                                            <span className="font-semibold">{formData.attach.name}</span>
                                            <span className="text-xs opacity-75 uppercase">({formData.attach.type})</span>
                                            <button type="button" onClick={removeAttachment} className="ml-1 text-blue-400 hover:text-blue-800">
                                                <X size={14} weight="bold" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">PDF, Documentos o imágenes para descargar.</p>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                    >
                                        <option value="PUBLISHED">Publicado</option>
                                        <option value="DRAFT">Borrador</option>
                                        <option value="ARCHIVED">Archivado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Audiencia</label>
                                    <select
                                        value={Array.isArray(formData.audience) ? formData.audience[0] : formData.audience}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setFormData({
                                                ...formData,
                                                audience: val === 'GLOBAL' ? 'GLOBAL' : [val]
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                                    >
                                        <option value="GLOBAL">Global (Toda la organización)</option>
                                        <optgroup label="Unidades Específicas">
                                            {units.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-1">Selecciona quién puede ver esta publicación.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Analítica */}
            {showAnalyticsModal && analyticsPost && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-scaleIn">
                        <button onClick={() => setShowAnalyticsModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-slate-800 mb-2">Analítica de Publicación</h2>
                        <p className="text-sm text-slate-500 mb-6 line-clamp-1">{analyticsPost.title}</p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-xl text-center">
                                <div className="text-blue-600 mb-2 flex justify-center"><Globe size={24} /></div>
                                <div className="text-2xl font-bold text-slate-800">{analyticsPost.likes * 12 + analyticsPost.comments * 8 + 124}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase">Vistas</div>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-xl text-center">
                                <div className="text-pink-600 mb-2 flex justify-center"><Users size={24} /></div>
                                <div className="text-2xl font-bold text-slate-800">{analyticsPost.likes}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase">Me Gusta</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl text-center">
                                <div className="text-purple-600 mb-2 flex justify-center"><FileText size={24} /></div>
                                <div className="text-2xl font-bold text-slate-800">{analyticsPost.comments}</div>
                                <div className="text-xs text-slate-500 font-medium uppercase">Comentarios</div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Rendimiento</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Interacción</span>
                                        <span className="font-bold text-slate-800">High</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[85%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-600">Conversión</span>
                                        <span className="font-bold text-slate-800">Avg</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[60%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowAnalyticsModal(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Guide */}
            <AdminGuide {...communicationsGuide} />
        </div>
    );
}

function getCategoryColor(cat: string) {
    switch (cat) {
        case 'Institucional': return 'bg-blue-100 text-blue-700';
        case 'Alerta': return 'bg-red-100 text-red-700';
        case 'Social': return 'bg-pink-100 text-pink-700';
        default: return 'bg-slate-100 text-slate-600';
    }
}

function getMediaIcon(type: string) {
    switch (type) {
        case 'video': return <Video size={20} weight="fill" className="text-purple-500" />;
        case 'audio': return <SpeakerHigh size={20} weight="fill" className="text-indigo-500" />;
        case 'image': return <ImageIcon size={20} weight="fill" className="text-emerald-500" />;
        default: return <FileText size={20} weight="fill" className="text-slate-400" />;
    }
}
