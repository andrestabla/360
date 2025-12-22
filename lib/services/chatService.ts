import { DB, Conversation, ChatMessage, User, ConversationMember, Attachment } from '../data';

export interface ChatServiceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const ChatService = {
  getConversations: async (userId: string, tenantId: string): Promise<ChatServiceResponse<Conversation[]>> => {
    const conversations = DB.conversations.filter(
      c => c.tenant_id === tenantId && c.participants.includes(userId)
    );
    return { success: true, data: conversations };
  },

  getConversation: async (conversationId: string): Promise<ChatServiceResponse<Conversation | null>> => {
    const conversation = DB.conversations.find(c => c.id === conversationId) || null;
    return { success: true, data: conversation };
  },

  getMessages: async (conversationId: string, cursor?: string, limit: number = 50): Promise<ChatServiceResponse<ChatMessage[]> & { nextCursor?: string; hasMore: boolean }> => {
    let messages = DB.messages.filter(m => m.conversation_id === conversationId);
    messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const hasMore = messages.length > limit;
    if (hasMore) {
      messages = messages.slice(0, limit);
    }
    return { success: true, data: messages.reverse(), hasMore, nextCursor: hasMore ? messages[0]?.id : undefined };
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    body: string,
    tempId?: string,
    replyToMessageId?: string,
    attachments?: Attachment[]
  ): Promise<ChatMessage> => {
    const sender = DB.users.find(u => u.id === senderId);
    const conversation = DB.conversations.find(c => c.id === conversationId);
    
    const message: ChatMessage = {
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

    DB.messages.push(message);

    if (conversation) {
      conversation.lastMessage = body;
      conversation.lastMessageAt = message.created_at;
      conversation.last_message_at = message.created_at;
      conversation.lastMessagePreview = body.substring(0, 50);
    }

    DB.save();
    return message;
  },

  createConversation: async (
    tenantId: string,
    type: 'dm' | 'group',
    participants: string[],
    name?: string
  ): Promise<ChatServiceResponse<Conversation>> => {
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      tenant_id: tenantId,
      type,
      name,
      participants,
      createdAt: new Date().toISOString(),
      unreadCount: 0
    };

    DB.conversations.push(conversation);
    DB.save();
    return { success: true, data: conversation };
  },

  markAsRead: async (conversationId: string, userId: string): Promise<ChatServiceResponse<boolean>> => {
    const conversation = DB.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }
    DB.save();
    return { success: true, data: true };
  },

  getUsers: async (tenantId: string): Promise<ChatServiceResponse<User[]>> => {
    const users = DB.users.filter(u => u.tenantId === tenantId && u.status === 'ACTIVE');
    return { success: true, data: users };
  },

  checkNewMessages: async (userId: string, tenantId: string, since: string): Promise<ChatMessage[]> => {
    const userConversations = DB.conversations.filter(
      c => c.tenant_id === tenantId && c.participants.includes(userId)
    );
    const conversationIds = userConversations.map(c => c.id);
    const newMessages = DB.messages.filter(
      m => conversationIds.includes(m.conversation_id) && 
           m.sender_id !== userId &&
           new Date(m.created_at) > new Date(since)
    );
    return newMessages;
  },

  searchMessages: async (tenantId: string, query: string, conversationId?: string): Promise<ChatMessage[]> => {
    const lowerQuery = query.toLowerCase();
    let messages = DB.messages.filter(m => m.tenant_id === tenantId);
    if (conversationId) {
      messages = messages.filter(m => m.conversation_id === conversationId);
    }
    return messages.filter(m => m.body.toLowerCase().includes(lowerQuery));
  },

  searchConversations: async (tenantId: string, userId: string, query: string): Promise<Conversation[]> => {
    const lowerQuery = query.toLowerCase();
    return DB.conversations.filter(
      c => c.tenant_id === tenantId && 
           c.participants.includes(userId) &&
           (c.name?.toLowerCase().includes(lowerQuery) || c.title?.toLowerCase().includes(lowerQuery))
    );
  },

  searchUsers: async (tenantId: string, query: string): Promise<User[]> => {
    const lowerQuery = query.toLowerCase();
    return DB.users.filter(
      u => u.tenantId === tenantId && 
           u.status === 'ACTIVE' &&
           (u.name.toLowerCase().includes(lowerQuery) || u.email?.toLowerCase().includes(lowerQuery))
    );
  },

  createDM: async (tenantId: string, userId1: string, userId2: string): Promise<ChatServiceResponse<Conversation>> => {
    const existing = DB.conversations.find(
      c => c.tenant_id === tenantId && c.type === 'dm' && 
           c.participants.includes(userId1) && c.participants.includes(userId2)
    );
    if (existing) return { success: true, data: existing };

    const user2 = DB.users.find(u => u.id === userId2);
    const user1 = DB.users.find(u => u.id === userId1);

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      tenant_id: tenantId,
      type: 'dm',
      participants: [userId1, userId2],
      title: user2?.name || 'Usuario',
      avatar: user2?.initials || 'U',
      createdAt: new Date().toISOString()
    };
    DB.conversations.push(conversation);

    DB.conversationMembers.push(
      { id: `cm-${Date.now()}-1`, conversation_id: conversation.id, user_id: userId1, joinedAt: conversation.createdAt },
      { id: `cm-${Date.now()}-2`, conversation_id: conversation.id, user_id: userId2, joinedAt: conversation.createdAt }
    );

    DB.save();
    return { success: true, data: conversation };
  },

  createGroup: async (tenantId: string, name: string, creatorId: string, memberIds: string[]): Promise<ChatServiceResponse<Conversation>> => {
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      tenant_id: tenantId,
      type: 'group',
      name,
      title: name,
      participants: [creatorId, ...memberIds],
      createdAt: new Date().toISOString()
    };
    DB.conversations.push(conversation);

    const allMembers = [creatorId, ...memberIds];
    allMembers.forEach((userId, idx) => {
      DB.conversationMembers.push({
        id: `cm-${Date.now()}-${idx}`,
        conversation_id: conversation.id,
        user_id: userId,
        joinedAt: conversation.createdAt
      });
    });

    DB.save();
    return { success: true, data: conversation };
  },

  isBlocked: async (userId: string, targetUserId: string): Promise<boolean> => {
    return false;
  },

  blockUser: async (userId: string, targetUserId: string): Promise<boolean> => {
    return true;
  },

  unblockUser: async (userId: string, targetUserId: string): Promise<boolean> => {
    return true;
  },

  editMessage: async (messageId: string, userId: string, newBody: string): Promise<ChatServiceResponse<ChatMessage | null>> => {
    const message = DB.messages.find(m => m.id === messageId && m.sender_id === userId);
    if (message) {
      message.body = newBody;
      DB.save();
      return { success: true, data: message };
    }
    return { success: false, data: null, error: 'Message not found' };
  },

  deleteMessage: async (messageId: string, userId: string): Promise<ChatServiceResponse<boolean>> => {
    const idx = DB.messages.findIndex(m => m.id === messageId && m.sender_id === userId);
    if (idx > -1) {
      DB.messages.splice(idx, 1);
      DB.save();
      return { success: true, data: true };
    }
    return { success: false, data: false, error: 'Message not found' };
  },

  toggleReaction: async (messageId: string, userId: string, reaction: string): Promise<ChatServiceResponse<boolean>> => {
    return { success: true, data: true };
  },

  uploadFile: async (file: File, tenantId: string, onProgress?: (percent: number) => void): Promise<Attachment> => {
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

  leaveGroup: async (conversationId: string, userId: string): Promise<ChatServiceResponse<boolean>> => {
    const conv = DB.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.participants = conv.participants.filter(p => p !== userId);
      DB.save();
      return { success: true, data: true };
    }
    return { success: false, data: false };
  },

  muteConversation: async (conversationId: string, userId: string, until: string): Promise<ChatServiceResponse<boolean>> => {
    return { success: true, data: true };
  },

  getNotificationSettings: async (conversationId: string, userId: string): Promise<{ level: string; mutedUntil?: string }> => {
    return { level: 'all' };
  },

  updateNotificationSettings: async (conversationId: string, userId: string, level: string): Promise<boolean> => {
    return true;
  },

  getGroupMembers: async (conversationId: string): Promise<User[]> => {
    const conv = DB.conversations.find(c => c.id === conversationId);
    if (!conv) return [];
    return DB.users.filter(u => conv.participants.includes(u.id));
  },

  reportContent: async (userId: string, tenantId: string, report: { targetId: string; type: string; reason: string; detail: string }): Promise<ChatServiceResponse<boolean>> => {
    return { success: true, data: true };
  }
};
