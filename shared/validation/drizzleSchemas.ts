import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
  users,
  units,
  documents,
  conversations,
  messages,
  workflows,
  surveys,
  emailSettings,
  auditLogs,
} from '@shared/schema';

// Tenants removed in single-organization architecture

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.min(2).max(255),
  email: (schema) => schema.email().optional(),
  password: (schema) => schema.min(8).optional(),
});
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = createUpdateSchema(users);

export const insertUnitSchema = createInsertSchema(units, {
  name: (schema) => schema.min(1).max(255),
});
export const selectUnitSchema = createSelectSchema(units);
export const updateUnitSchema = createUpdateSchema(units);

export const insertDocumentSchema = createInsertSchema(documents, {
  title: (schema) => schema.min(1).max(500),
});
export const selectDocumentSchema = createSelectSchema(documents);
export const updateDocumentSchema = createUpdateSchema(documents);

export const insertConversationSchema = createInsertSchema(conversations);
export const selectConversationSchema = createSelectSchema(conversations);
export const updateConversationSchema = createUpdateSchema(conversations);

export const insertMessageSchema = createInsertSchema(messages, {
  body: (schema) => schema.min(1),
});
export const selectMessageSchema = createSelectSchema(messages);
export const updateMessageSchema = createUpdateSchema(messages);

export const insertWorkflowSchema = createInsertSchema(workflows, {
  title: (schema) => schema.min(1).max(255),
});
export const selectWorkflowSchema = createSelectSchema(workflows);
export const updateWorkflowSchema = createUpdateSchema(workflows);

export const insertSurveySchema = createInsertSchema(surveys, {
  title: (schema) => schema.min(1).max(255),
});
export const selectSurveySchema = createSelectSchema(surveys);
export const updateSurveySchema = createUpdateSchema(surveys);

export const insertEmailConfigSchema = createInsertSchema(emailSettings, {
  fromEmail: (schema) => schema.email().optional(),
  smtpHost: (schema) => schema.min(1).optional(),
});
export const selectEmailConfigSchema = createSelectSchema(emailSettings);
export const updateEmailConfigSchema = createUpdateSchema(emailSettings);

export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const selectAuditLogSchema = createSelectSchema(auditLogs);

// Platform Admins merged into users
// export const insertPlatformAdminSchema ...



export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type SelectUnit = z.infer<typeof selectUnitSchema>;
export type UpdateUnit = z.infer<typeof updateUnitSchema>;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type SelectDocument = z.infer<typeof selectDocumentSchema>;
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type SelectConversation = z.infer<typeof selectConversationSchema>;
export type UpdateConversation = z.infer<typeof updateConversationSchema>;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type SelectMessage = z.infer<typeof selectMessageSchema>;
export type UpdateMessage = z.infer<typeof updateMessageSchema>;

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type SelectWorkflow = z.infer<typeof selectWorkflowSchema>;
export type UpdateWorkflow = z.infer<typeof updateWorkflowSchema>;

export type InsertSurvey = z.infer<typeof insertSurveySchema>;
export type SelectSurvey = z.infer<typeof selectSurveySchema>;
export type UpdateSurvey = z.infer<typeof updateSurveySchema>;

export type InsertEmailConfig = z.infer<typeof insertEmailConfigSchema>;
export type SelectEmailConfig = z.infer<typeof selectEmailConfigSchema>;
export type UpdateEmailConfig = z.infer<typeof updateEmailConfigSchema>;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type SelectAuditLog = z.infer<typeof selectAuditLogSchema>;


