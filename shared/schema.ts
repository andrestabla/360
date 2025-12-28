import { pgTable, text, varchar, integer, timestamp, boolean, json, jsonb, serial, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

export const organizationSettings = pgTable("organization_settings", {
  id: integer("id").primaryKey().default(1), // Singleton row
  name: text("name").notNull().default("My Organization"),
  domains: json("domains").$type<string[]>().default([]),
  timezone: varchar("timezone", { length: 100 }).default("UTC"),
  locale: varchar("locale", { length: 20 }).default("es"),
  branding: json("branding").$type<Record<string, unknown>>().default({}),
  policies: json("policies").$type<Record<string, unknown>>().default({}),
  ssoConfig: json("sso_config").$type<Record<string, unknown>>(),
  storageConfig: json("storage_config").$type<Record<string, unknown>>(),
  integrations: json("integrations").$type<Record<string, unknown>[]>().default([]),
  features: json("features").$type<string[]>().default([]),
  sector: varchar("sector", { length: 255 }),
  contactName: varchar("contact_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 100 }),
  storage: varchar("storage", { length: 50 }).default("0 GB"),
  plan: varchar("plan", { length: 50 }).notNull().default("ENTERPRISE"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("active"),
  billingPeriod: varchar("billing_period", { length: 20 }).default("monthly"),

  currentPeriodEnd: timestamp("current_period_end"),
  stripeConfig: json("stripe_config").$type<{
    secretKey?: string;
    webhookSecret?: string;
    priceIdPro?: string;
    priceIdEnterprise?: string;
    nextAuthUrl?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emailSettings = pgTable("email_settings", {
  id: integer("id").primaryKey().default(1), // Singleton row
  provider: varchar("provider", { length: 50 }).notNull().default("SMTP"),
  smtpHost: varchar("smtp_host", { length: 255 }),
  smtpPort: integer("smtp_port").default(587),
  smtpUser: varchar("smtp_user", { length: 255 }),
  smtpPasswordEncrypted: text("smtp_password_encrypted"),
  smtpSecure: boolean("smtp_secure").default(false),
  fromName: varchar("from_name", { length: 255 }),
  fromEmail: varchar("from_email", { length: 255 }),
  replyToEmail: varchar("reply_to_email", { length: 255 }),
  isEnabled: boolean("is_enabled").default(false),
  lastTestedAt: timestamp("last_tested_at"),
  lastTestResult: boolean("last_test_result"),
  lastTestError: text("last_test_error"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: varchar("role", { length: 100 }).notNull(),
  level: integer("level").default(1),
  unit: varchar("unit", { length: 255 }),
  initials: varchar("initials", { length: 10 }),
  bio: text("bio"),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  language: varchar("language", { length: 20 }).default("es"),
  timezone: varchar("timezone", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("ACTIVE"),
  avatar: text("avatar"),
  password: text("password"),
  mustChangePassword: boolean("must_change_password").default(false),
  lastPasswordChange: timestamp("last_password_change"),
  lastLogin: timestamp("last_login"),
  inviteSentAt: timestamp("invite_sent_at"),
  inviteExpiresAt: timestamp("invite_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  preferences: jsonb("preferences").$type<{
    theme: 'light' | 'dark' | 'system',
    notifications: boolean,
    sidebarCollapsed: boolean
  }>().default({
    theme: 'system',
    notifications: true,
    sidebarCollapsed: false
  }),
}, (table) => [
  index("idx_users_email").on(table.email),
  index("idx_users_status").on(table.status),
]);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ]
)

export const units = pgTable("units", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  path: text("path"),
  parentId: varchar("parent_id", { length: 255 }),
  managerId: varchar("manager_id", { length: 255 }),
  description: text("description"),
  type: varchar("type", { length: 50 }).default("UNIT"),
  level: integer("level").default(0),
  color: varchar("color", { length: 50 }),
  members: json("members").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  category: varchar("category", { length: 255 }),
  unitId: varchar("unit_id", { length: 255 }),
  ownerId: varchar("owner_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("DRAFT"),
  version: integer("version").default(1),
  tags: json("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_documents_status").on(table.status),
]);

export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 20 }).notNull().default("dm"),
  name: text("name"),
  title: text("title"),
  participants: json("participants").$type<string[]>().default([]),
  lastMessage: text("last_message"),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id", { length: 255 }).primaryKey(),
  conversationId: varchar("conversation_id", { length: 255 }).notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  body: text("body").notNull(),
  bodyType: varchar("body_type", { length: 50 }).default("text"),
  attachments: json("attachments").$type<Record<string, unknown>[]>().default([]),
  readBy: json("read_by").$type<string[]>().default([]),
  replyToMessageId: varchar("reply_to_message_id", { length: 255 }),
  reactions: json("reactions").$type<Record<string, unknown>[]>().default([]),
  deletedAt: timestamp("deleted_at"),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_messages_conversation").on(table.conversationId),
  index("idx_messages_conversation_created").on(table.conversationId, table.createdAt),
]);

export const workflows = pgTable("workflows", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("DRAFT"),
  ownerId: varchar("owner_id", { length: 255 }),
  steps: json("steps").$type<Record<string, unknown>[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const surveys = pgTable("surveys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("DRAFT"),
  questions: json("questions").$type<Record<string, unknown>[]>().default([]),
  responses: json("responses").$type<Record<string, unknown>[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }),
  action: varchar("action", { length: 255 }).notNull(),
  resource: varchar("resource", { length: 255 }),
  resourceId: varchar("resource_id", { length: 255 }),
  details: json("details").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_audit_logs_created").on(table.createdAt),
]);

export const workflowCases = pgTable("workflow_cases", {
  id: varchar("id", { length: 255 }).primaryKey(),
  workflowId: varchar("workflow_id", { length: 255 }), // Removed constraints for flexibility
  title: text("title").notNull(),
  status: varchar("status", { length: 50 }).default("PENDING"),
  creatorId: varchar("creator_id", { length: 255 }),
  assigneeId: varchar("assignee_id", { length: 255 }),
  priority: varchar("priority", { length: 20 }).default("MEDIUM"),
  dueDate: timestamp("due_date"),
  data: json("data").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_workflow_cases_assignee").on(table.assigneeId),
  index("idx_workflow_cases_status").on(table.status),
]);

export const userRecents = pgTable("user_recents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(), // PROJECT, DOC
  title: text("title"),
  lastVisitedAt: timestamp("last_visited_at").defaultNow(),
}, (table) => [
  index("idx_user_recents_user").on(table.userId),
  index("idx_user_recents_visited").on(table.lastVisitedAt),
]);

// =========================================================================
// 2. TABLAS DE PRODUCTIVIDAD PERSONAL
// =========================================================================

export const userNotes = pgTable("user_notes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  date: varchar("date", { length: 20 }), // YYYY-MM-DD format
  isImportant: boolean("is_important").default(false),
  status: varchar("status", { length: 20 }).notNull().default("ACTIVE"), // ACTIVE or COMPLETED
  pinned: boolean("pinned").default(false),
  color: varchar("color", { length: 50 }).default("bg-blue-500"),
  reminder: json("reminder").$type<{
    date: string;
    channel: 'internal' | 'email' | 'both';
    sent: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_user_notes_user").on(table.userId),
  index("idx_user_notes_date").on(table.date),
  index("idx_user_notes_status").on(table.status),
]);

// Removed platformAdmins table. Admins will be users with specific role in the main users table.

// Relations can be simplified as we removed tenant nesting.
// Most tables were related to tenants. Now they stand alone or related to Users/Units.

export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const systemEnvironment = pgTable("system_environment", {
  id: integer("id").primaryKey().default(1),
  environment: varchar("environment", { length: 50 }).notNull(),
  fingerprint: varchar("fingerprint", { length: 64 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type InsertUnit = typeof units.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;
export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = typeof surveys.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type UserNote = typeof userNotes.$inferSelect;
export type InsertUserNote = typeof userNotes.$inferInsert;
export type OrganizationSettings = typeof organizationSettings.$inferSelect;
export type InsertOrganizationSettings = typeof organizationSettings.$inferInsert;
export type EmailSettings = typeof emailSettings.$inferSelect;
export type InsertEmailSettings = typeof emailSettings.$inferInsert;
export type SystemEnvironment = typeof systemEnvironment.$inferSelect;
export type InsertSystemEnvironment = typeof systemEnvironment.$inferInsert;
export type WorkflowCase = typeof workflowCases.$inferSelect;
export type InsertWorkflowCase = typeof workflowCases.$inferInsert;
export type UserRecent = typeof userRecents.$inferSelect;
export type InsertUserRecent = typeof userRecents.$inferInsert;
