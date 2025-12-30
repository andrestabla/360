'use server';

import { ChatService } from '@/lib/services/chatService';
import { getStorageService } from '@/lib/services/storageService';
import { revalidatePath } from 'next/cache';
import { auth } from "@/lib/auth";

// Helper to serialize Dates to strings
function serialize<T>(obj: T): any {
    return JSON.parse(JSON.stringify(obj));
}

export async function getMessagesAction(conversationId: string, cursor?: string, limit: number = 50) {
    try {
        const res = await ChatService.getMessages(conversationId, cursor, limit);
        return serialize(res);
    } catch (error) {
        console.error("Error in getMessagesAction:", error);
        return { data: [], nextCursor: null };
    }
}

export async function getConversationAction(conversationId: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const res = await ChatService.getConversation(conversationId, userId);
        return serialize(res);
    } catch (error) {
        console.error("Error in getConversationAction:", error);
        // Return dummy/empty or null? ChatWindow expects data.
        // Returning null might cause client issues if not handled.
        // Assuming ChatService throws if not found.
        throw error;
    }
}

export async function sendMessageAction(
    conversationId: string,
    senderId: string,
    body: string,
    tempId?: string,
    replyToMessageId?: string,
    attachments?: any[]
) {
    // Verify auth for security
    const session = await auth();
    if (!session?.user?.id || session.user.id !== senderId) {
        throw new Error("Unauthorized");
    }

    const res = await ChatService.sendMessage(conversationId, senderId, body, tempId, replyToMessageId, attachments);
    return serialize(res);
}

export async function markAsReadAction(conversationId: string, userId: string) {
    await ChatService.markAsRead(conversationId, userId);
    revalidatePath('/dashboard/chat');
    return { success: true };
}

export async function editMessageAction(messageId: string, userId: string, newBody: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) throw new Error("Unauthorized");

    const res = await ChatService.editMessage(messageId, userId, newBody);
    return serialize(res);
}

export async function deleteMessageAction(messageId: string, userId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) throw new Error("Unauthorized");

    const res = await ChatService.deleteMessage(messageId, userId);
    return serialize(res);
}

export async function toggleReactionAction(messageId: string, userId: string, emoji: string) {
    const res = await ChatService.toggleReaction(messageId, userId, emoji);
    return serialize(res);
}

export async function searchMessagesAction(query: string, conversationId?: string) {
    const res = await ChatService.searchMessages(query, conversationId);
    return serialize(res);
}

export async function getNotificationSettingsAction(conversationId: string, userId: string) {
    const res = await ChatService.getNotificationSettings(conversationId, userId);
    return serialize(res);
}

export async function updateNotificationSettingsAction(conversationId: string, userId: string, level: string) {
    const res = await ChatService.updateNotificationSettings(conversationId, userId, level);
    return serialize(res);
}

export async function leaveGroupAction(conversationId: string, userId: string) {
    const res = await ChatService.leaveGroup(conversationId, userId);
    return serialize(res);
}

export async function muteConversationAction(conversationId: string, userId: string, until: string) {
    const res = await ChatService.muteConversation(conversationId, userId, until);
    return serialize(res);
}

export async function isBlockedAction(userId: string, targetUserId: string) {
    const res = await ChatService.isBlocked(userId, targetUserId);
    return res;
}

export async function blockUserAction(userId: string, targetUserId: string) {
    const res = await ChatService.blockUser(userId, targetUserId);
    return res;
}

export async function unblockUserAction(userId: string, targetUserId: string) {
    const res = await ChatService.unblockUser(userId, targetUserId);
    return res;
}

export async function getGroupMembersAction(conversationId: string) {
    const res = await ChatService.getGroupMembers(conversationId);
    return serialize(res);
}

export async function reportContentAction(userId: string, report: any) {
    const res = await ChatService.reportContent(userId, report);
    return serialize(res);
}

export async function uploadFileAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error("No file provided");

    const storage = getStorageService();
    const uploadRes = await storage.upload(file, 'chat-attachments');

    if (!uploadRes.success || !uploadRes.url) {
        throw new Error(uploadRes.error || "Upload failed");
    }

    // Create attachment object to return
    return {
        id: `att-${Date.now()}`,
        url: uploadRes.url,
        name: file.name,
        fileName: file.name,
        size: file.size,
        type: file.type,
        mimeType: file.type,
        createdAt: new Date().toISOString()
    };
}

export async function checkNewMessagesAction(userId: string, since: string) {
    const session = await auth();
    // Allow check if authorized as user
    if (!session?.user?.id || session.user.id !== userId) return [];

    // Validate since is a valid date string
    // if (!Date.parse(since)) return [];

    const res = await ChatService.checkNewMessages(userId, since);
    return serialize(res);
}

export async function getConversationsAction(userId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) return { success: false, data: [] };

    const res = await ChatService.getConversations(userId);
    return serialize(res);
}

export async function createDMAction(userId1: string, userId2: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId1) throw new Error("Unauthorized");

    const res = await ChatService.createDM(userId1, userId2);
    return serialize(res);
}

export async function createGroupAction(name: string, creatorId: string, memberIds: string[]) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== creatorId) throw new Error("Unauthorized");

    const res = await ChatService.createGroup(name, creatorId, memberIds);
    return serialize(res);
}

export async function searchConversationsAction(userId: string, query: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) return [];

    const res = await ChatService.searchConversations(userId, query);
    return serialize(res);
}

export async function searchUsersAction(query: string) {
    // Public/Authenticated action
    const session = await auth();
    if (!session?.user?.id) return [];

    const res = await ChatService.searchUsers(query);
    return serialize(res);
}

export async function getUnreadCountAction(userId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) return 0;

    const res = await ChatService.getConversations(userId);
    if (!res.success) return 0;

    const count = res.data.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    return count;
}
