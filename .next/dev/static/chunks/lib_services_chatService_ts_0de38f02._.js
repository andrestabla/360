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
    getMessages: async (conversationId)=>{
        const messages = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.filter((m)=>m.conversation_id === conversationId);
        return {
            success: true,
            data: messages
        };
    },
    sendMessage: async (conversationId, senderId, body, bodyType = 'text')=>{
        const sender = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].users.find((u)=>u.id === senderId);
        const conversation = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].conversations.find((c)=>c.id === conversationId);
        const message = {
            id: `msg-${Date.now()}`,
            tenant_id: conversation?.tenant_id || '',
            conversation_id: conversationId,
            sender_id: senderId,
            body,
            body_type: bodyType,
            created_at: new Date().toISOString(),
            senderName: sender?.name || 'Unknown'
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].messages.push(message);
        if (conversation) {
            conversation.lastMessage = body;
            conversation.lastMessageAt = message.created_at;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DB"].save();
        return {
            success: true,
            data: message
        };
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
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_services_chatService_ts_0de38f02._.js.map