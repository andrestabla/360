import { Message as SchemaMessage, Conversation as SchemaConversation, User } from '@/shared/schema';

// Unified to camelCase to match Schema/Drizzle conventions
export type Attachment = {
    id: string;
    url: string;
    name: string;
    fileName: string;
    size: number;
    type: string;
    mimeType: string;
    createdAt: string;
};

export type Conversation = Omit<SchemaConversation, 'participants' | 'title' | 'lastMessageAt'> & {
    participants: string[];
    title: string | null; // Nullable to match Drizzle text()
    avatar?: string;
    unreadCount?: number;
    lastMessageAt?: string | Date | null; // Handle serialization
};

export type Message = Omit<SchemaMessage, 'createdAt' | 'editedAt' | 'deletedAt' | 'attachments' | 'reactions'> & {
    createdAt: string;
    editedAt?: string | null;
    deletedAt?: string | null;

    senderName?: string;
    senderAvatar?: string;

    // Use Schema definitions for IDs (camelCase)
    // conversationId, senderId, bodyType, replyToMessageId

    replyTo?: {
        id: string;
        senderName: string;
        body: string;
    };

    attachments?: Attachment[];

    reactions?: {
        messageId: string;
        userId: string;
        emoji: string;
        createdAt: string;
    }[];
};
