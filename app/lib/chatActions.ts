'use server';

import { ChatService, ChatServiceResponse, ChatMessage, ChatConversation } from '@/lib/services/chatService';
import { StorageService, getStorageService } from '@/lib/services/storageService';
import { revalidatePath } from 'next/cache';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// Helper to serialize Dates to strings
function serialize<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export async function getMessagesAction(conversationId: string, cursor?: string, limit: number = 50) {
    const res = await ChatService.getMessages(conversationId, cursor, limit);
    return serialize(res);
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
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== senderId) {
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
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== userId) throw new Error("Unauthorized");

    const res = await ChatService.editMessage(messageId, userId, newBody);
    return serialize(res);
}

export async function deleteMessageAction(messageId: string, userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== userId) throw new Error("Unauthorized");

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
        file_name: file.name,
        size: file.size,
        type: file.type,
        mime_type: file.type,
        created_at: new Date().toISOString()
    };
}
