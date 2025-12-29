import { Message as SchemaMessage, Conversation as SchemaConversation, User } from '@/shared/schema';

export type Attachment = {
    id: string;
    url: string;
    name: string;
    file_name: string; // The schema has 'name', but UI uses file_name. We should probably map or use one. Let's keep strict to UI usage for now but mapped.
    size: number;
    type: string;
    mime_type: string;
    created_at: string; // UI uses string
};

export type Conversation = Omit<SchemaConversation, 'participants'> & {
    participants: string[]; // Schema has them as JSON string[], assume parsed
    title?: string;
    avatar?: string;
    unreadCount?: number;
    // Map snake_case to camelCase where schema differs or keep schema?
    // Schema: createdAt, lastMessageAt.
    // UI used: created_at.
    // We will switch UI to camelCase to match Schema.
};

export type Message = Omit<SchemaMessage, 'createdAt' | 'editedAt' | 'deletedAt'> & {
    createdAt: string; // Serialized
    editedAt?: string | null;
    deletedAt?: string | null;

    senderName?: string;
    senderAvatar?: string;
    // Schema: conversationId, senderId, bodyType, replyToMessageId
    // UI used: conversation_id, sender_id

    // We will use Schema keys (camelCase) in UI.

    replyTo?: {
        id: string;
        senderName: string;
        body: string;
    };

    // Attachments in schema is json. In UI it's Attachment[].
    attachments?: Attachment[];

    // Reactions in schema is json.
    reactions?: {
        message_id: string;
        user_id: string;
        emoji: string;
        created_at: string;
    }[];
};

