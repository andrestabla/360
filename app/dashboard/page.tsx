"use client";

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostViewerModal from '@/components/PostViewerModal';
import WorkNotesWidget from '@/components/WorkNotesWidget';
import { Post, DB } from '@/lib/data';
import {
    PushPin,
    Funnel,
    MagnifyingGlass,
    Calendar,
    UserCircle
} from "@phosphor-icons/react";

export default function DashboardPage() {
    const { currentUser, isLoading } = useApp();
    const router = useRouter();

    // State
    const [posts, setPosts] = useState<Post[]>([]);
    const [filter, setFilter] = useState<'all' | 'official' | 'social'>('all');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push('/login');
        }
    }, [currentUser, isLoading, router]);

    useEffect(() => {
        // Load posts (Global posts for now)
        setPosts(DB.posts || []);
    }, []);

    if (isLoading || !currentUser) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
    }

    const filteredPosts = posts.filter(post => {
        if (filter === 'all') return true;
        // Basic filtering logic
        if (filter === 'official') return post.category === 'Oficial' || post.category === 'RRHH';
        return true;
    });

    const pinnedPosts = filteredPosts.filter(p => p.status === 'published').slice(0, 2); // Mock pinned logic
    const feedPosts = filteredPosts.filter(p => !pinnedPosts.includes(p));

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8 animate-fadeIn">

            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Hola, {currentUser.name.split(' ')[0]} 👋</h1>
                    <p className="text-blue-100 max-w-xl text-lg">
                        Bienvenido a Maturity 360. Aquí tienes las últimas actualizaciones de la organización.
                    </p>
                </div>
            </div>

            {/* Content Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Filters */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Noticias y Actualizaciones</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFilter('official')}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'official' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                Oficiales
                            </button>
                        </div>
                    </div>

                    {/* Pinned Posts */}
                    {pinnedPosts.length > 0 && (
                        <div className="space-y-4">
                            {pinnedPosts.map(post => (
                                <div
                                    key={post.id}
                                    onClick={() => setSelectedPost(post)}
                                    className="bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            {post.category || 'Anuncio'}
                                        </span>
                                        <PushPin weight="fill" className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                                    <p className="text-slate-600 text-sm line-clamp-2">{post.content}</p>
                                    <div className="flex items-center gap-3 mt-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><UserCircle size={14} /> {post.author}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Regular Feed */}
                    <div className="space-y-4">
                        {feedPosts.map(post => (
                            <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:border-slate-300 transition-all hover:translate-y-[-2px]"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                            {post.author ? post.author.substring(0, 2).toUpperCase() : 'NA'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">{post.author}</div>
                                            <div className="text-xs text-slate-400">{post.date}</div>
                                        </div>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                        {post.category || 'General'}
                                    </span>
                                </div>

                                <h3 className="text-base font-bold text-slate-900 mb-2">{post.title}</h3>
                                <p className="text-slate-600 text-sm line-clamp-3 mb-3">{post.content}</p>

                                {post.mediaUrl && (
                                    <div className="w-full h-48 bg-slate-100 rounded-lg mb-3 bg-cover bg-center" style={{ backgroundImage: `url(${post.mediaUrl})` }}></div>
                                )}
                            </div>
                        ))}

                        {feedPosts.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500">No hay publicaciones recientes.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Quick Access or Widgets */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <h3 className="font-bold text-slate-800 mb-4">Accesos Rápidos</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => router.push('/dashboard/projects')} className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 text-sm font-medium text-center transition-colors">
                                Proyectos
                            </button>
                            <button onClick={() => router.push('/dashboard/repository')} className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 text-sm font-medium text-center transition-colors">
                                Documentos
                            </button>
                            <button onClick={() => router.push('/dashboard/directory')} className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 text-sm font-medium text-center transition-colors">
                                Directorio
                            </button>
                            <button onClick={() => router.push('/dashboard/surveys')} className="p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-amber-700 text-sm font-medium text-center transition-colors">
                                Encuestas
                            </button>
                        </div>
                    </div>

                    {/* Work Notes Widget */}
                    <WorkNotesWidget userId={currentUser.id} />
                </div>
            </div>

            {/* Modals */}
            {selectedPost && (
                <PostViewerModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
}
