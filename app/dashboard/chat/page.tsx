'use client';
import ChatLayout from '@/components/chat/ChatLayout';
import { Suspense } from 'react';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
    return (
        <ChatLayout sidebar={<ConversationList />}>
            <Suspense fallback={<div className="h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}>
                <ChatWindow />
            </Suspense>
        </ChatLayout>
    );
}
