import { db } from '@/server/db';
import { conversations, messages, users, type Conversation, type Message, type User } from '@/shared/schema';
import { eq, and, or, desc, like, inArray, sql } from 'drizzle-orm';

// UI Types matching the schema types but perhaps with extra fields for display
export type ChatUser = User;
export type ChatConversation = Conversation & {
  lastMessage?: string | null;
  lastMessageAt?: Date | null;
  unreadCount?: number;
  avatar?: string | null; // Added avatar
};
export type ChatMessage = Message & {
  senderName?: string;
  senderAvatar?: string;
  status: 'sent' | 'delivered' | 'read';
  tempId?: string;
};

export interface ChatServiceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const ChatService = {
  getConversations: async (userId: string): Promise<ChatServiceResponse<ChatConversation[]>> => {
    try {
      const allConvs = await db.select().from(conversations).orderBy(desc(conversations.lastMessageAt));
      const userConvs = allConvs.filter(c => (c.participants as string[])?.includes(userId));

      // Collect all participant IDs to fetch names
      const allParticipantIds = new Set<string>();
      userConvs.forEach(c => {
        (c.participants as string[])?.forEach(p => allParticipantIds.add(p));
      });

      const usersList = await db.select().from(users).where(inArray(users.id, Array.from(allParticipantIds)));
      const userMap = new Map(usersList.map(u => [u.id, u]));

      // Map to ChatConversation type with resolved Titles/Avatars
      const mapped: ChatConversation[] = userConvs.map(c => {
        let title = c.name || c.title || 'Chat';
        let avatar = undefined;

        if (c.type === 'dm') {
          const parts = c.participants as string[];
          const otherId = parts.find(id => id !== userId) || parts[0]; // Fallback to self if chat with self
          const otherUser = userMap.get(otherId);
          if (otherUser) {
            title = otherUser.name;
            avatar = otherUser.avatar || otherUser.initials;
          }
        } else {
          // Group logic if needed, e.g. group avatar
        }

        return {
          ...c,
          title,
          // We use 'avatar' in the UI but it's not in the base Conversation type. 
          // We cast/extend the type in the map.
          // The return type is ChatConversation[] which we defined to allow extra props if we add them to the type definition.
          // But ChatConversation definition at top of file (Line 7) only adds lastMessage... 
          // I should update ChatConversation type definition at top of file too.
          lastMessage: c.lastMessage,
          lastMessageAt: c.lastMessageAt,
          unreadCount: 0
        } as ChatConversation & { avatar?: string };
      });

      return { success: true, data: mapped };
    } catch (e: any) {
      console.error('getConversations error:', e);
      return { success: false, data: [], error: e.message };
    }
  },

  getConversation: async (conversationId: string, userId?: string): Promise<ChatServiceResponse<ChatConversation | null>> => {
    try {
      const conv = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId)
      });
      if (!conv) return { success: true, data: null };

      let title = conv.title || conv.name || 'Chat';
      let avatar = undefined;

      if (conv.type === 'dm' && userId) {
        const parts = conv.participants as string[];
        const otherId = parts.find(id => id !== userId) || parts[0];
        const otherUser = await db.query.users.findFirst({ where: eq(users.id, otherId) });
        if (otherUser) {
          title = otherUser.name;
          avatar = otherUser.avatar || otherUser.initials;
        }
      }

      const extendedConv = {
        ...conv,
        title,
        avatar,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: 0
      } as ChatConversation;

      return { success: true, data: extendedConv };
    } catch (e: any) {
      return { success: false, data: null, error: e.message };
    }
  },

  getMessages: async (conversationId: string, cursor?: string, limit: number = 50): Promise<ChatServiceResponse<ChatMessage[]> & { nextCursor?: string; hasMore: boolean }> => {
    try {
      const msgs = await db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        orderBy: desc(messages.createdAt),
        limit: limit + 1, // Fetch one more to check hasMore
        with: {
          // We need sender details. Since we have strict FK, we can join.
          // But currently relations definition in schema might be minimal.
          // Let's manual fetch or rely on relation if it exists.
          // Schema has `messagesRelations` defined? Yes.
        }
      });

      // Manually fetch sender names if 'with' relation fails or isn't fully typed for this
      // Actually schema has `senderId`.
      // Let's populate senderName.

      const senderIds = [...new Set(msgs.map(m => m.senderId))];
      const senders = await db.select().from(users).where(inArray(users.id, senderIds));
      const senderMap = new Map(senders.map(u => [u.id, u]));

      const mappedMsgs: ChatMessage[] = msgs.slice(0, limit).map(m => {
        const sender = senderMap.get(m.senderId);
        return {
          ...m,
          senderName: sender?.name || 'Unknown',
          senderAvatar: sender?.avatar || undefined,
          status: 'read', // TODO: track read status
          bodyType: m.bodyType as 'text' | 'image' | 'video' | 'file' | 'audio'
        };
      });

      const hasMore = msgs.length > limit;
      const nextCursor = hasMore ? mappedMsgs[mappedMsgs.length - 1].id : undefined;

      return { success: true, data: mappedMsgs.reverse(), hasMore, nextCursor };
    } catch (e: any) {
      console.error('getMessages error', e);
      return { success: false, data: [], hasMore: false, error: e.message };
    }
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    body: string,
    tempId?: string,
    replyToMessageId?: string,
    attachments?: any[]
  ): Promise<ChatMessage> => {
    try {
      const sender = await db.query.users.findFirst({ where: eq(users.id, senderId) });
      const newMsgId = `msg-${Date.now()}`;

      // Insert message
      const [inserted] = await db.insert(messages).values({
        id: newMsgId,
        conversationId,
        senderId,
        body,
        bodyType: 'text',
        attachments: attachments || [],
        replyToMessageId: replyToMessageId || null,
        createdAt: new Date(), // Strict Date
      }).returning();

      // Update conversation last message
      await db.update(conversations)
        .set({
          lastMessage: body,
          lastMessageAt: new Date()
        })
        .where(eq(conversations.id, conversationId));

      return {
        ...inserted,
        senderName: sender?.name || 'Unknown',
        senderAvatar: sender?.avatar || undefined,
        status: 'sent',
        tempId,
        bodyType: inserted.bodyType as 'text' | 'image' | 'file'
      };
    } catch (e: any) {
      console.error('sendMessage error:', e);
      throw e;
    }
  },

  createConversation: async (
    type: 'dm' | 'group',
    participants: string[],
    name?: string
  ): Promise<ChatServiceResponse<ChatConversation>> => {
    try {
      const newId = `conv-${Date.now()}`;
      const [inserted] = await db.insert(conversations).values({
        id: newId,
        type,
        name,
        participants, // JSON column
        createdAt: new Date(),
        lastMessageAt: new Date(),
      }).returning();

      return { success: true, data: inserted as ChatConversation };
    } catch (e: any) {
      return { success: false, data: {} as any, error: e.message };
    }
  },

  markAsRead: async (conversationId: string, userId: string): Promise<ChatServiceResponse<boolean>> => {
    // Basic implementation: We don't have a "read_receipts" table in schema yet (except readBy array in messages?),
    // Schema has `readBy: json("read_by")` in messages table.
    // Real implementation would update all unread messages in this conversation to include userId in readBy.
    // For now, just return success to avoid blocking UI.
    return { success: true, data: true };
  },

  getUsers: async (): Promise<ChatServiceResponse<User[]>> => {
    try {
      const activeUsers = await db.select().from(users).where(eq(users.status, 'ACTIVE'));
      return { success: true, data: activeUsers };
    } catch (e: any) {
      return { success: false, data: [], error: e.message };
    }
  },

  checkNewMessages: async (userId: string, since: string): Promise<ChatMessage[]> => {
    try {
      const sinceDate = new Date(since);
      const myConvs = await ChatService.getConversations(userId); // Re-use logic
      const convIds = myConvs.data.map(c => c.id);

      if (convIds.length === 0) return [];

      const newMsgs = await db.query.messages.findMany({
        where: and(
          inArray(messages.conversationId, convIds),
          // gt(messages.createdAt, sinceDate) // gt needs import
          sql`${messages.createdAt} > ${sinceDate}`
        )
      });

      return newMsgs as unknown as ChatMessage[];
    } catch (e) {
      return [];
    }
  },

  searchMessages: async (query: string, conversationId?: string): Promise<ChatMessage[]> => {
    // Use ILIKE for search
    try {
      const whereClause = conversationId
        ? and(eq(messages.conversationId, conversationId), like(messages.body, `%${query}%`))
        : like(messages.body, `%${query}%`);

      const results = await db.select().from(messages).where(whereClause);
      return results as unknown as ChatMessage[];
    } catch (e) {
      return [];
    }
  },

  searchConversations: async (userId: string, query: string): Promise<Conversation[]> => {
    // In memory filter for simplicity due to JSON participants
    const all = await ChatService.getConversations(userId);
    const lower = query.toLowerCase();
    return all.data.filter(c =>
      c.name?.toLowerCase().includes(lower) || c.title?.toLowerCase().includes(lower)
    );
  },

  searchUsers: async (query: string): Promise<User[]> => {
    try {
      const res = await db.select().from(users).where(
        and(
          eq(users.status, 'ACTIVE'),
          or(like(users.name, `%${query}%`), like(users.email, `%${query}%`))
        )
      );
      return res;
    } catch (e) {
      return [];
    }
  },

  createDM: async (userId1: string, userId2: string): Promise<ChatServiceResponse<ChatConversation>> => {
    // Check existing DMs
    // This is expensive with JSON participants. 
    // Ideal: Separate table for participants.
    // Mitigation: Fetch user's DMs and check in memory.

    const allConvs = await db.select().from(conversations).where(eq(conversations.type, 'dm'));
    const existing = allConvs.find(c => {
      const p = c.participants as string[];
      return p.includes(userId1) && p.includes(userId2);
    });

    if (existing) return { success: true, data: existing as ChatConversation };

    const user2 = await db.query.users.findFirst({ where: eq(users.id, userId2) });

    return ChatService.createConversation('dm', [userId1, userId2], user2?.name || 'DM');
  },

  createGroup: async (name: string, creatorId: string, memberIds: string[]): Promise<ChatServiceResponse<ChatConversation>> => {
    return ChatService.createConversation('group', [creatorId, ...memberIds], name);
  },

  // Stubs for blocking, etc.
  isBlocked: async (userId: string, targetUserId: string): Promise<boolean> => { return false; },
  blockUser: async (userId: string, targetUserId: string): Promise<boolean> => { return true; },
  unblockUser: async (userId: string, targetUserId: string): Promise<boolean> => { return true; },

  editMessage: async (messageId: string, userId: string, newBody: string): Promise<ChatServiceResponse<ChatMessage | null>> => {
    try {
      const [updated] = await db.update(messages)
        .set({ body: newBody, editedAt: new Date() })
        .where(and(eq(messages.id, messageId), eq(messages.senderId, userId)))
        .returning();

      return { success: true, data: updated as unknown as ChatMessage };
    } catch (e: any) {
      return { success: false, data: null, error: e.message };
    }
  },

  deleteMessage: async (messageId: string, userId: string): Promise<ChatServiceResponse<boolean>> => {
    try {
      // Soft delete? Schema has deletedAt
      await db.update(messages)
        .set({ deletedAt: new Date() })
        .where(and(eq(messages.id, messageId), eq(messages.senderId, userId)));

      return { success: true, data: true };
    } catch (e: any) {
      return { success: false, data: false, error: e.message };
    }
  },

  toggleReaction: async (messageId: string, userId: string, reaction: string): Promise<ChatServiceResponse<boolean>> => {
    // Complex with JSON array. 
    // Fetch, update json, save.
    const msg = await db.query.messages.findFirst({ where: eq(messages.id, messageId) });
    if (!msg) return { success: false, data: false };

    // Logic would go here to update the JSON structure of reactions
    return { success: true, data: true };
  },

  uploadFile: async (file: File, onProgress?: (percent: number) => void): Promise<any> => {
    // This should ideally use storageService
    if (onProgress) onProgress(100);
    return {
      id: `att-${Date.now()}`,
      url: '', // TODO: integrate with StorageService
      name: file.name,
      file_name: file.name,
      size: file.size,
      type: file.type,
      mime_type: file.type,
      created_at: new Date().toISOString()
    };
  },

  // Group mgmt stubs
  leaveGroup: async (conversationId: string, userId: string) => ({ success: true, data: true }),
  muteConversation: async (conversationId: string, userId: string, until: string) => ({ success: true, data: true }),
  getNotificationSettings: async (conversationId: string, userId: string) => ({ level: 'all' }),
  updateNotificationSettings: async (conversationId: string, userId: string, level: string) => true,
  getGroupMembers: async (conversationId: string): Promise<User[]> => {
    const conv = await db.query.conversations.findFirst({ where: eq(conversations.id, conversationId) });
    if (!conv) return [];
    const p = conv.participants as string[];
    return db.select().from(users).where(inArray(users.id, p));
  },
  reportContent: async (userId: string, report: any) => ({ success: true, data: true })
};

