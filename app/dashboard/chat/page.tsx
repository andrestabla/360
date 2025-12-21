'use client';
import ChatLayout from '@/components/chat/ChatLayout';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
    return (
        <ChatLayout sidebar={<ConversationList />}>
            <ChatWindow />
        </ChatLayout>
    );
}
