import { pgTable, text, varchar, integer, timestamp, boolean, json, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  domains: json("domains").$type<string[]>().default([]),
  status: varchar("status", { length: 50 }).notNull().default("ACTIVE"),
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
  users: integer("users").default(0),
  storage: varchar("storage", { length: 50 }).default("0 GB"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }),
  role: varchar("role", { length: 100 }).notNull(),
  level: integer("level").default(1),
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
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
  inviteSentAt: timestamp("invite_sent_at"),
  inviteExpiresAt: timestamp("invite_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const units = pgTable("units", {
  id: varchar("id", { length: 255 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
  name: text("name").notNull(),
  parentId: varchar("parent_id", { length: 255 }),
  managerId: varchar("manager_id", { length: 255 }),
  level: integer("level").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id", { length: 255 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
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
});

export const conversations = pgTable("conversations", {
  id: varchar("id", { length: 255 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
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
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
  conversationId: varchar("conversation_id", { length: 255 }).notNull().references(() => conversations.id),
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
});

export const workflows = pgTable("workflows", {
  id: varchar("id", { length: 255 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
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
  tenantId: varchar("tenant_id", { length: 255 }).notNull().references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("DRAFT"),
  questions: json("questions").$type<Record<string, unknown>[]>().default([]),
  responses: json("responses").$type<Record<string, unknown>[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tenantEmailConfigs = pgTable("tenant_email_configs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  tenantId: varchar("tenant_id", { length: 255 }).references(() => tenants.id),
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
  createdBy: varchar("created_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  action: varchar("action", { length: 255 }).notNull(),
  resource: varchar("resource", { length: 255 }),
  resourceId: varchar("resource_id", { length: 255 }),
  details: json("details").$type<Record<string, unknown>>(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const platformAdmins = pgTable("platform_admins", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("SUPER_ADMIN"),
  avatar: text("avatar"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  units: many(units),
  documents: many(documents),
  conversations: many(conversations),
  workflows: many(workflows),
  surveys: many(surveys),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
}));

export const unitsRelations = relations(units, ({ one }) => ({
  tenant: one(tenants, {
    fields: [units.tenantId],
    references: [tenants.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  tenant: one(tenants, {
    fields: [documents.tenantId],
    references: [tenants.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [conversations.tenantId],
    references: [tenants.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  tenant: one(tenants, {
    fields: [messages.tenantId],
    references: [tenants.id],
  }),
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;
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
export type PlatformAdmin = typeof platformAdmins.$inferSelect;
export type InsertPlatformAdmin = typeof platformAdmins.$inferInsert;
export type TenantEmailConfig = typeof tenantEmailConfigs.$inferSelect;
export type InsertTenantEmailConfig = typeof tenantEmailConfigs.$inferInsert;
