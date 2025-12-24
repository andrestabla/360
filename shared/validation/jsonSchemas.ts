import { z } from "zod";

export const TenantBrandingSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  customCss: z.string().optional(),
}).passthrough();

export const TenantPoliciesSchema = z.object({
  passwordMinLength: z.number().min(6).max(128).optional(),
  passwordRequireUppercase: z.boolean().optional(),
  passwordRequireNumbers: z.boolean().optional(),
  passwordRequireSpecial: z.boolean().optional(),
  sessionTimeoutMinutes: z.number().min(5).max(1440).optional(),
  mfaRequired: z.boolean().optional(),
}).passthrough();

export const SsoConfigSchema = z.object({
  provider: z.enum(["saml", "oidc", "oauth2"]).optional(),
  entityId: z.string().optional(),
  ssoUrl: z.string().url().optional(),
  certificate: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
}).passthrough().nullable();

export const StorageConfigSchema = z.object({
  provider: z.enum(["local", "s3", "gcs", "azure", "gdrive", "dropbox", "onedrive"]).optional(),
  bucket: z.string().optional(),
  region: z.string().optional(),
  endpoint: z.string().optional(),
  accessKeyId: z.string().optional(),
}).passthrough().nullable();

export const IntegrationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  enabled: z.boolean().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["task", "approval", "notification", "condition", "action"]).optional(),
  order: z.number().optional(),
  assigneeId: z.string().optional(),
  assigneeRole: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "skipped"]).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export const SurveyQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(["text", "textarea", "radio", "checkbox", "scale", "date", "number"]).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
}).passthrough();

export const SurveyResponseSchema = z.object({
  questionId: z.string(),
  userId: z.string().optional(),
  value: z.union([z.string(), z.number(), z.array(z.string())]),
  submittedAt: z.string().optional(),
}).passthrough();

export const MessageAttachmentSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string(),
  type: z.string().optional(),
  size: z.number().optional(),
  mime_type: z.string().nullable().optional(),
}).passthrough();

export const MessageReactionSchema = z.object({
  emoji: z.string(),
  userId: z.string(),
  createdAt: z.string().optional(),
}).passthrough();

export const AuditLogDetailsSchema = z.object({
  oldValue: z.unknown().optional(),
  newValue: z.unknown().optional(),
  changedFields: z.array(z.string()).optional(),
  reason: z.string().optional(),
}).passthrough().nullable();

export const DomainsSchema = z.array(z.string().min(1));
export const FeaturesSchema = z.array(z.string());
export const TagsSchema = z.array(z.string());
export const ParticipantsSchema = z.array(z.string());
export const ReadBySchema = z.array(z.string());
export const IntegrationsSchema = z.array(IntegrationSchema);
export const WorkflowStepsSchema = z.array(WorkflowStepSchema);
export const SurveyQuestionsSchema = z.array(SurveyQuestionSchema);
export const SurveyResponsesSchema = z.array(SurveyResponseSchema);
export const MessageAttachmentsSchema = z.array(MessageAttachmentSchema);
export const MessageReactionsSchema = z.array(MessageReactionSchema);

export function validateJson<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
}

export function assertValidJson<T>(schema: z.ZodSchema<T>, data: unknown, fieldName: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`Invalid ${fieldName}: ${errors}`);
  }
  return result.data;
}

export type TenantBranding = z.infer<typeof TenantBrandingSchema>;
export type TenantPolicies = z.infer<typeof TenantPoliciesSchema>;
export type SsoConfig = z.infer<typeof SsoConfigSchema>;
export type StorageConfig = z.infer<typeof StorageConfigSchema>;
export type Integration = z.infer<typeof IntegrationSchema>;
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;
export type MessageAttachment = z.infer<typeof MessageAttachmentSchema>;
export type MessageReaction = z.infer<typeof MessageReactionSchema>;
export type AuditLogDetails = z.infer<typeof AuditLogDetailsSchema>;
