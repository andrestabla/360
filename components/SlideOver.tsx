'use client';
import { useUI } from '@/context/UIContext';
import { useApp } from '@/context/AppContext';
import { DB, ChatMessage } from '@/lib/data';
import { X, PaperPlaneRight } from '@phosphor-icons/react';
import { useState, useEffect, KeyboardEvent } from 'react';

export default function SlideOver() {
    const { isSlideOpen, slideType, slideData, closeSlide, openViewer } = useUI();
    const { currentUser } = useApp();
    const [activeTab, setActiveTab] = useState<'detail' | 'chat'>('detail');
    const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [forceUpdate, setForceUpdate] = useState(0);

    // Reset tab when opening
    useEffect(() => {
        if (isSlideOpen) {
            setActiveTab('detail');
            if (slideData && slideData.id) {
                if (!DB.contextChats[slideData.id]) {
                    DB.contextChats[slideData.id] = [{ text: `Sistema: Contexto ${slideType} creado`, type: 'system' }];
                }
                setChatMsgs(DB.contextChats[slideData.id]);
            }
        }
    }, [isSlideOpen, slideData, slideType]);

    const sendContextMessage = () => {
        if (!chatInput.trim() || !slideData) return;

        const newMsg: ChatMessage = { text: chatInput, type: 'self' }; // In real app, user ID
        DB.contextChats[slideData.id].push(newMsg);
        setChatMsgs([...DB.contextChats[slideData.id]]);
        setChatInput('');
    };

    const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Enter') sendContextMessage();
    };

    const renderDetail = () => {
        if (!slideData) return null;
        const { id, title } = slideData;

        if (slideType === 'doc') {
            const comments = DB.publicComments[id] || [];
            return (
                <div>
                    <h2>{title}</h2>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', margin: '10px 0' }}
                        onClick={() => openViewer(title)}
                    >
                        Visualizar
                    </button>
                    <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid var(--border)' }} />
                    <h4>Comentarios</h4>
                    {comments.map((c, i) => (
                        <div key={i} className="comment-item" style={{ marginBottom: 10 }}>
                            <strong>{c.user}</strong>: {c.text}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div>
                <h2>{title}</h2>
                <p>Detalle del contenido...</p>
            </div>
        );
    };

    return (
        <>
            <div
                className="slide-overlay"
                style={{ display: isSlideOpen ? 'block' : 'none' }}
                onClick={closeSlide}
            ></div>

            <div className={`slide-over ${isSlideOpen ? 'open' : ''}`} id="slide-panel">
                <div className="card-head" style={{ background: 'white' }}>
                    <h3 id="slide-title" style={{ fontSize: 16 }}>
                        {slideType === 'doc' ? 'Documento' : 'Trámite'}
                    </h3>
                    <button className="btn btn-ghost" onClick={closeSlide}>
                        <X size={20} />
                    </button>
                </div>

                <div className="tabs">
                    <div
                        className={`tab ${activeTab === 'detail' ? 'active' : ''}`}
                        onClick={() => setActiveTab('detail')}
                    >
                        Info & Social
                    </div>
                    <div
                        className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        Chat Privado <span className="badge bg-danger" style={{ fontSize: 9 }}>Context</span>
                    </div>
                </div>

                <div className="slide-content" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                    <div className="tab-pane" style={{ display: activeTab === 'detail' ? 'block' : 'none', flex: 1, padding: 24, overflowY: 'auto' }}>
                        {renderDetail()}
                    </div>

                    <div className="chat-pane" style={{ display: activeTab === 'chat' ? 'flex' : 'none', flexDirection: 'column', height: '100%', padding: 0 }}>
                        <div className="messages-area" style={{ flex: 1, padding: 20 }}>
                            {chatMsgs.map((m, i) => (
                                <div key={i} className={`message ${m.type === 'system' ? 'msg-system' : 'msg-self'}`}>
                                    {m.text}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input" style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                onKeyPress={handleKey}
                            />
                            <button className="btn btn-primary btn-icon" onClick={sendContextMessage}>
                                <PaperPlaneRight />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
