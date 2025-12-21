'use client';

import { Post, PublicComment, DB } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import { X, Heart, ChatCircle, Paperclip, PlayCircle, SpeakerHigh, Image as ImageIcon, PaperPlaneRight, UserCircle } from '@phosphor-icons/react';
import { useState, useEffect, useRef } from 'react';

interface PostViewerModalProps {
    post: Post | null;
    onClose: () => void;
}

export default function PostViewerModal({ post, onClose }: PostViewerModalProps) {
    const { currentUser } = useApp();
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<PublicComment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (post) {
            setLikes(post.likes);
            setIsLiked(false); // Reset/Mock state
            setComments(DB.publicComments[post.id] || []);
            setShowComments(false);
        }
    }, [post]);

    // Scroll to bottom when comments open/update
    useEffect(() => {
        if (showComments && commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments, showComments]);


    if (!post) return null;

    const handleLike = () => {
        if (isLiked) {
            setLikes(p => p - 1);
            setIsLiked(false);
        } else {
            setLikes(p => p + 1);
            setIsLiked(true);
        }
        // Update mock DB (optional, keeps consistency if revisited)
        const postInDb = DB.posts.find(p => p.id === post.id);
        if (postInDb) postInDb.likes = isLiked ? likes - 1 : likes + 1;
    };

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        const comment: PublicComment = {
            id: `c-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            content: newComment,
            date: 'Ahora',
            likes: 0
        };

        // Update local state
        const updatedComments = [...comments, comment];
        setComments(updatedComments);
        setNewComment('');

        // Update Mock DB
        DB.publicComments[post.id] = updatedComments;
        const postInDb = DB.posts.find(p => p.id === post.id);
        if (postInDb) postInDb.comments = updatedComments.length;
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-slideUp">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                    <X weight="bold" />
                </button>

                {/* Main Content Area (Scrollable) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                    {/* Media Section */}
                    {post.mediaType !== 'article' && (
                        <div className="bg-slate-900 w-full flex-shrink-0 relative group">
                            {renderMedia(post)}
                        </div>
                    )}

                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                                    {post.category}
                                </span>
                                <span className="text-slate-400 text-sm font-medium">{post.date}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-2">{post.title}</h2>
                            <p className="text-sm text-slate-500 font-medium">Por {post.author}</p>
                        </div>

                        {/* Article Image if 'article' type */}
                        {post.mediaType === 'article' && post.image && (
                            <img src={post.image} alt="" className="w-full h-64 object-cover rounded-xl mb-6 shadow-sm" />
                        )}

                        {/* Rich Text Body */}
                        <div
                            className="prose prose-slate max-w-none mb-8 text-slate-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Attachments */}
                        {post.attach && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg mb-8">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                                    <Paperclip size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-slate-700">{post.attach.name}</div>
                                    <div className="text-xs text-slate-400 uppercase">{post.attach.type} • 2.4 MB</div>
                                </div>
                                <button className="text-xs font-bold text-blue-600 px-3 hover:underline">Descargar</button>
                            </div>
                        )}

                        {/* Comments Section */}
                        {showComments && (
                            <div className="border-t border-slate-100 pt-6 animate-fadeIn">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    Comentarios <span className="text-slate-400 font-normal">({comments.length})</span>
                                </h3>

                                <div className="space-y-4 mb-6">
                                    {comments.length > 0 ? comments.map(comment => (
                                        <div key={comment.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <UserCircle size={24} weight="fill" />
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-sm">
                                                <div className="flex justify-between items-baseline mb-1 gap-2">
                                                    <span className="font-bold text-slate-900">{comment.userName}</span>
                                                    <span className="text-[10px] text-slate-400">{comment.date}</span>
                                                </div>
                                                <p className="text-slate-600">{comment.content}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6 text-slate-400 text-sm">Sé el primero en comentar.</div>
                                    )}
                                    <div ref={commentsEndRef} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions & Input */}
                <div className="p-4 border-t border-slate-100 bg-white z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    {showComments ? (
                        <form onSubmit={handleSendComment} className="flex gap-2 items-centeranimate-slideUp">
                            <input
                                autoFocus
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 ring-blue-500/20"
                            />
                            <button
                                type="button" // Toggle back to actions
                                onClick={() => setShowComments(false)}
                                className="p-2 text-slate-400 hover:text-slate-600"
                            >
                                <X />
                            </button>
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <PaperPlaneRight weight="fill" />
                            </button>
                        </form>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-red-500' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    <Heart size={24} weight={isLiked ? "fill" : "regular"} className={`transition-transform ${isLiked ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-sm font-bold">{likes}</span>
                                </button>
                                <button
                                    onClick={() => setShowComments(true)}
                                    className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
                                >
                                    <ChatCircle size={24} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-bold">{comments.length}</span>
                                </button>
                            </div>
                            <button className="text-sm text-slate-500 hover:text-slate-800 font-medium">Compartir</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function renderMedia(post: Post) {
    switch (post.mediaType) {
        case 'video':
            const youtubeEmbed = getYouTubeEmbedUrl(post.mediaUrl || '');
            return (
                <div className="aspect-video bg-black flex items-center justify-center relative w-full">
                    {youtubeEmbed ? (
                        <iframe
                            src={youtubeEmbed}
                            title={post.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        /* Fallback to image if video fails or just poster */
                        <video
                            src={post.mediaUrl}
                            poster={post.image}
                            controls
                            className="w-full h-full object-contain"
                        />
                    )}
                    {!post.mediaUrl && !youtubeEmbed && <div className="text-white">Video no disponible</div>}
                </div>
            );
        case 'audio':
            return (
                <div className="w-full bg-slate-800 p-8 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg animate-pulse">
                        <SpeakerHigh size={32} weight="fill" />
                    </div>
                    <audio src={post.mediaUrl} controls className="w-full max-w-md" />
                </div>
            );
        case 'image':
            return (
                <div className="max-h-[50vh] w-full bg-black flex items-center justify-center">
                    {(post.mediaUrl || post.image) ? (
                        <img src={post.mediaUrl || post.image} alt={post.title} className="max-h-[50vh] w-auto max-w-full object-contain" />
                    ) : (
                        <div className="flex flex-col items-center text-slate-500 gap-2">
                            <ImageIcon size={48} />
                            <span className="text-sm">Imagen no disponible</span>
                        </div>
                    )}
                </div>
            );
        default: // article
            if (!post.image) return null;
            return (
                <div className="h-64 w-full relative">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
            );
    }
}

function getCategoryColor(cat: string) {
    switch (cat) {
        case 'Institucional': return 'bg-blue-100 text-blue-700';
        case 'Alerta': return 'bg-red-100 text-red-700';
        case 'Social': return 'bg-pink-100 text-pink-700';
        default: return 'bg-slate-100 text-slate-600';
    }
}

function getYouTubeEmbedUrl(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
}
