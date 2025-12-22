import { DB, Conversation, ChatMessage, User } from '../data';

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

  getMessages: async (conversationId: string): Promise<ChatServiceResponse<ChatMessage[]>> => {
    const messages = DB.messages.filter(m => m.conversation_id === conversationId);
    return { success: true, data: messages };
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    body: string,
    bodyType: 'text' | 'image' | 'file' | 'voice' = 'text'
  ): Promise<ChatServiceResponse<ChatMessage>> => {
    const sender = DB.users.find(u => u.id === senderId);
    const conversation = DB.conversations.find(c => c.id === conversationId);
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      tenant_id: conversation?.tenant_id || '',
      conversation_id: conversationId,
      sender_id: senderId,
      body,
      body_type: bodyType,
      created_at: new Date().toISOString(),
      senderName: sender?.name || 'Unknown'
    };

    DB.messages.push(message);

    if (conversation) {
      conversation.lastMessage = body;
      conversation.lastMessageAt = message.created_at;
    }

    DB.save();
    return { success: true, data: message };
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
  }
};
