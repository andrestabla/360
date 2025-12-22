(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/services/chatService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatService",
    ()=>ChatService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript)");
;
const ChatService = {
    getConversations: async (userId, tenantId)=>{
        const conversations = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.filter((c)=>c.tenant_id === tenantId && c.participants.includes(userId));
        return {
            success: true,
            data: conversations
        };
    },
    getConversation: async (conversationId)=>{
        const conversation = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.id === conversationId) || null;
        return {
            success: true,
            data: conversation
        };
    },
    getMessages: async (conversationId, cursor, limit = 50)=>{
        let messages = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.filter((m)=>m.conversation_id === conversationId);
        messages.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const hasMore = messages.length > limit;
        if (hasMore) {
            messages = messages.slice(0, limit);
        }
        return {
            success: true,
            data: messages.reverse(),
            hasMore,
            nextCursor: hasMore ? messages[0]?.id : undefined
        };
    },
    sendMessage: async (conversationId, senderId, body, tempId, replyToMessageId, attachments)=>{
        const sender = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.find((u)=>u.id === senderId);
        const conversation = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.id === conversationId);
        const message = {
            id: `msg-${Date.now()}`,
            tenant_id: conversation?.tenant_id || '',
            conversation_id: conversationId,
            sender_id: senderId,
            body,
            body_type: 'text',
            created_at: new Date().toISOString(),
            senderName: sender?.name || 'Unknown',
            reply_to_message_id: replyToMessageId,
            attachments: attachments,
            tempId,
            status: 'sent'
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.push(message);
        if (conversation) {
            conversation.lastMessage = body;
            conversation.lastMessageAt = message.created_at;
            conversation.last_message_at = message.created_at;
            conversation.lastMessagePreview = body.substring(0, 50);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
        return message;
    },
    createConversation: async (tenantId, type, participants, name)=>{
        const conversation = {
            id: `conv-${Date.now()}`,
            tenant_id: tenantId,
            type,
            name,
            participants,
            createdAt: new Date().toISOString(),
            unreadCount: 0
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.push(conversation);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
        return {
            success: true,
            data: conversation
        };
    },
    markAsRead: async (conversationId, userId)=>{
        const conversation = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.id === conversationId);
        if (conversation) {
            conversation.unreadCount = 0;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
        return {
            success: true,
            data: true
        };
    },
    getUsers: async (tenantId)=>{
        const users = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.filter((u)=>u.tenantId === tenantId && u.status === 'ACTIVE');
        return {
            success: true,
            data: users
        };
    },
    checkNewMessages: async (userId, tenantId, since)=>{
        const userConversations = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.filter((c)=>c.tenant_id === tenantId && c.participants.includes(userId));
        const conversationIds = userConversations.map((c)=>c.id);
        const newMessages = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.filter((m)=>conversationIds.includes(m.conversation_id) && m.sender_id !== userId && new Date(m.created_at) > new Date(since));
        return newMessages;
    },
    searchMessages: async (tenantId, query, conversationId)=>{
        const lowerQuery = query.toLowerCase();
        let messages = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.filter((m)=>m.tenant_id === tenantId);
        if (conversationId) {
            messages = messages.filter((m)=>m.conversation_id === conversationId);
        }
        return messages.filter((m)=>m.body.toLowerCase().includes(lowerQuery));
    },
    searchConversations: async (tenantId, userId, query)=>{
        const lowerQuery = query.toLowerCase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.filter((c)=>c.tenant_id === tenantId && c.participants.includes(userId) && (c.name?.toLowerCase().includes(lowerQuery) || c.title?.toLowerCase().includes(lowerQuery)));
    },
    searchUsers: async (tenantId, query)=>{
        const lowerQuery = query.toLowerCase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.filter((u)=>u.tenantId === tenantId && u.status === 'ACTIVE' && (u.name.toLowerCase().includes(lowerQuery) || u.email?.toLowerCase().includes(lowerQuery)));
    },
    createDM: async (tenantId, userId1, userId2)=>{
        const existing = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.tenant_id === tenantId && c.type === 'dm' && c.participants.includes(userId1) && c.participants.includes(userId2));
        if (existing) return {
            success: true,
            data: existing
        };
        const user2 = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.find((u)=>u.id === userId2);
        const user1 = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.find((u)=>u.id === userId1);
        const conversation = {
            id: `conv-${Date.now()}`,
            tenant_id: tenantId,
            type: 'dm',
            participants: [
                userId1,
                userId2
            ],
            title: user2?.name || 'Usuario',
            avatar: user2?.initials || 'U',
            createdAt: new Date().toISOString()
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.push(conversation);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversationMembers.push({
            id: `cm-${Date.now()}-1`,
            conversation_id: conversation.id,
            user_id: userId1,
            joinedAt: conversation.createdAt
        }, {
            id: `cm-${Date.now()}-2`,
            conversation_id: conversation.id,
            user_id: userId2,
            joinedAt: conversation.createdAt
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
        return {
            success: true,
            data: conversation
        };
    },
    createGroup: async (tenantId, name, creatorId, memberIds)=>{
        const conversation = {
            id: `conv-${Date.now()}`,
            tenant_id: tenantId,
            type: 'group',
            name,
            title: name,
            participants: [
                creatorId,
                ...memberIds
            ],
            createdAt: new Date().toISOString()
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.push(conversation);
        const allMembers = [
            creatorId,
            ...memberIds
        ];
        allMembers.forEach((userId, idx)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversationMembers.push({
                id: `cm-${Date.now()}-${idx}`,
                conversation_id: conversation.id,
                user_id: userId,
                joinedAt: conversation.createdAt
            });
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
        return {
            success: true,
            data: conversation
        };
    },
    isBlocked: async (userId, targetUserId)=>{
        return false;
    },
    blockUser: async (userId, targetUserId)=>{
        return true;
    },
    unblockUser: async (userId, targetUserId)=>{
        return true;
    },
    editMessage: async (messageId, userId, newBody)=>{
        const message = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.find((m)=>m.id === messageId && m.sender_id === userId);
        if (message) {
            message.body = newBody;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
            return {
                success: true,
                data: message
            };
        }
        return {
            success: false,
            data: null,
            error: 'Message not found'
        };
    },
    deleteMessage: async (messageId, userId)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.findIndex((m)=>m.id === messageId && m.sender_id === userId);
        if (idx > -1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.splice(idx, 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
            return {
                success: true,
                data: true
            };
        }
        return {
            success: false,
            data: false,
            error: 'Message not found'
        };
    },
    toggleReaction: async (messageId, userId, reaction)=>{
        return {
            success: true,
            data: true
        };
    },
    uploadFile: async (file, tenantId, onProgress)=>{
        if (onProgress) onProgress(100);
        return {
            id: `att-${Date.now()}`,
            url: URL.createObjectURL(file),
            name: file.name,
            file_name: file.name,
            size: file.size,
            type: file.type,
            mime_type: file.type,
            tenant_id: tenantId,
            created_at: new Date().toISOString()
        };
    },
    leaveGroup: async (conversationId, userId)=>{
        const conv = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.id === conversationId);
        if (conv) {
            conv.participants = conv.participants.filter((p)=>p !== userId);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
            return {
                success: true,
                data: true
            };
        }
        return {
            success: false,
            data: false
        };
    },
    muteConversation: async (conversationId, userId, until)=>{
        return {
            success: true,
            data: true
        };
    },
    getNotificationSettings: async (conversationId, userId)=>{
        return {
            level: 'all'
        };
    },
    updateNotificationSettings: async (conversationId, userId, level)=>{
        return true;
    },
    getGroupMembers: async (conversationId)=>{
        const conv = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.id === conversationId);
        if (!conv) return [];
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.filter((u)=>conv.participants.includes(u.id));
    },
    reportContent: async (userId, tenantId, report)=>{
        return {
            success: true,
            data: true
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_services_chatService_ts_0de38f02._.js.map