export type Permission =
  | 'MANAGE_UNITS'
  | 'MANAGE_USERS'
  | 'VIEW_ALL_DOCS'
  | 'UPLOAD_DOCS'
  | 'DELETE_DOCS'
  | 'MANAGE_WORKFLOWS'
  | 'VIEW_ANALYTICS'
  | 'MANAGE_SETTINGS'
  | 'MANAGE_ROLES'
  | 'MANAGE_STORAGE'
  | 'VIEW_AUDIT'
  | 'MANAGE_POSTS'
  | 'MANAGE_SURVEYS'
  | 'IMPERSONATE_USERS';

export const PERMISSIONS: Permission[] = [
  'MANAGE_UNITS',
  'MANAGE_USERS',
  'VIEW_ALL_DOCS',
  'UPLOAD_DOCS',
  'DELETE_DOCS',
  'MANAGE_WORKFLOWS',
  'VIEW_ANALYTICS',
  'MANAGE_SETTINGS',
  'MANAGE_ROLES',
  'MANAGE_STORAGE',
  'VIEW_AUDIT',
  'MANAGE_POSTS',
  'MANAGE_SURVEYS',
  'IMPERSONATE_USERS'
];

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  level: number;
  tenantId: string;
  unit: string;
  initials: string;
  bio?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  language?: string;
  timezone?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'PENDING' | 'PENDING_INVITE';
  avatar?: string;
  password?: string;
  mustChangePassword?: boolean;
  inviteSentAt?: string;
  inviteExpiresAt?: string;
}

export interface TenantBranding {
  app_title?: string;
  primary_color?: string;
  accent_color?: string;
  login_bg_color?: string;
  login_bg_image?: string;
  login_description?: string;
  support_message?: string;
  logo_url?: string;
  updated_at?: string;
}

export interface TenantPolicy {
  session_duration_minutes?: number;
  max_failed_logins?: number;
  lock_minutes?: number;
  mfa_required?: boolean;
  ip_whitelist?: string[];
  sso_enabled?: boolean;
  sso_providers?: string[];
  file_max_size_bytes?: number;
  allowed_mime_types?: string[];
  audit_retention_days?: number;
  updated_at?: string;
}

export interface TenantSSOConfig {
  provider: string;
  clientId: string;
  clientSecret: string;
  domain?: string;
  authUrl?: string;
  tokenUrl?: string;
  enabled: boolean;
}

export interface TenantIntegration {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  active?: boolean;
  baseUrl?: string;
  apiKey?: string;
  description?: string;
  config?: Record<string, unknown>;
}

export type StorageProvider = 'GOOGLE_DRIVE' | 'DROPBOX' | 'ONEDRIVE' | 'SHAREPOINT' | 'S3' | 'LOCAL';

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  folderId?: string;
}

export interface DropboxConfig {
  accessToken: string;
  rootPath?: string;
}

export interface OneDriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  driveId?: string;
}

export interface SharePointConfig {
  siteUrl: string;
  clientId: string;
  clientSecret: string;
  libraryName?: string;
}

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region: string;
  endpoint?: string;
}

export interface TenantStorageConfig {
  provider: StorageProvider;
  enabled: boolean;
  config: GoogleDriveConfig | DropboxConfig | OneDriveConfig | SharePointConfig | S3Config | Record<string, any>;
  encryptedConfig?: string;
  lastTested?: string;
  testStatus?: 'success' | 'failed';
  testMessage?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domains?: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  timezone?: string;
  locale?: string;
  branding?: TenantBranding;
  policies?: TenantPolicy;
  ssoConfig?: TenantSSOConfig;
  storageConfig?: TenantStorageConfig;
  integrations?: TenantIntegration[];
  features?: string[];
  sector?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  users?: number;
  storage?: string;
  created_at?: string;
  updated_at?: string;
  roleTemplates?: Record<number, string[]>;
}

export interface Unit {
  id: string;
  tenantId: string;
  name: string;
  code?: string;
  parentId?: string;
  ownerId?: string;
  description?: string;
  members?: string[];
  type: 'UNIT' | 'DEPARTMENT' | 'TEAM' | 'PROCESS';
  depth: number;
  color?: string;
}

export interface PublicComment {
  id: string;
  postId?: string;
  docId?: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  userId?: string;
  userName?: string;
  reference?: string;
  position?: { page: number; x: number; y: number };
  date?: string;
  likes?: number;
  attachment?: string;
  resolved?: boolean;
}

export interface Post {
  id: string;
  tenantId: string;
  author: string;
  authorId?: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  mediaType?: 'image' | 'video' | 'audio' | 'none' | 'article';
  mediaUrl?: string;
  image?: string;
  attach?: { name: string; type: string };
  status: 'draft' | 'published' | 'archived';
  audience: 'all' | 'unit' | 'role';
  date: string;
  likes: number;
  commentsCount: number;
  comments?: PublicComment[];
}

export interface DocHistory {
  version: string;
  date: string;
  userId: string;
  userName: string;
  changes: string;
}

export interface Doc {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  size: string;
  version: string;
  status: 'active' | 'pending' | 'archived' | 'expired' | 'APPROVED' | 'PENDING' | 'ACTIVE' | 'ARCHIVED';
  authorId: string;
  unit: string;
  process?: string;
  visibility: 'public' | 'unit' | 'private';
  tags: string[];
  expiryDate?: string;
  folderId?: string;
  color?: string;
  likes: number;
  commentsCount: number;
  history?: DocHistory[];
  comments?: PublicComment[];
  resolved?: boolean;
  userName?: string;
  content?: string;
  attachment?: string;
  date?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  content?: string;
  url?: string;
  comments?: PublicComment[];
  versions?: { content: string; date: string; userId: string }[];
}

export interface ProjectActivity {
  id: string;
  name: string;
  status: string;
  participants: (string | { userId: string; role?: string })[];
  documents: ProjectDocument[];
  startDate?: string;
  endDate?: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  order: number;
  status: string;
  activities: ProjectActivity[];
  startDate?: string;
  endDate?: string;
}

export interface Project {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: string;
  creatorId: string;
  createdAt: string;
  updatedAt?: string;
  participants: (string | { userId: string; role?: string })[];
  phases: ProjectPhase[];
  folderId?: string;
  color?: string;
  unit?: string;
  process?: string;
}

export type ProjectParticipant = string | { userId: string; role?: string };

export interface ProjectFolder {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  parentId?: string;
  level?: number;
  unit?: string;
  process?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RepoFolder {
  id: string;
  tenantId: string;
  name: string;
  parentId?: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
  level?: number;
  unit?: string;
  process?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'task' | 'notification' | 'condition';
  assigneeRole?: string;
  assigneeId?: string;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  unit?: string;
  ownerId?: string;
  icon?: string;
  schema: WorkflowStep[] | Record<string, unknown>;
  slaHours?: number;
  active: boolean;
}

export interface WorkflowHistoryEntry {
  date: string;
  action?: string;
  userId?: string;
  userName?: string;
  comment?: string;
  status?: string;
  by?: string;
}

export interface WorkflowComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface WorkflowCase {
  id: string;
  workflowId: string;
  tenantId: string;
  title: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'RECEIVED' | 'PENDING' | 'REJECTED' | 'APPROVED' | 'CLOSED';
  creatorId: string;
  assigneeId?: string;
  unit?: string;
  createdAt: string;
  updatedAt?: string;
  data: Record<string, unknown>;
  history: WorkflowHistoryEntry[];
  comments: WorkflowComment[];
}

export interface PlatformAuditEvent {
  id: string;
  event_type: string;
  actor_id: string;
  actor_name: string;
  target_tenant_id?: string;
  target_user_id?: string;
  metadata: Record<string, unknown>;
  ip: string;
  created_at: string;
}

export interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SUPPORT' | 'BILLING';
  status: 'ACTIVE' | 'SUSPENDED';
  mfaEnabled: boolean;
  lastLogin?: string;
}

export interface PlatformSettings {
  defaultModules: string[];
  defaultLocale: string;
  defaultTimezone: string;
  authPolicy: {
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    sessionTimeout: number;
    enforceSSO?: boolean;
    passwordMinLength?: number;
    mfaPolicy?: 'none' | 'optional' | 'required';
  };
  storage?: TenantStorageConfig;
  roleTemplates?: Record<number, string[]>;
}

export interface Attachment {
  id: string;
  tenant_id?: string;
  message_id?: string;
  file_name?: string;
  mime_type?: string;
  size: number;
  storage_key?: string;
  url: string;
  created_at: string;
  name?: string;
  type?: string;
}

export interface MessageReaction {
  emoji: string;
  users?: string[];
  user_id?: string;
  message_id?: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  tenant_id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  body_type: 'text' | 'image' | 'file' | 'voice';
  created_at: string;
  senderName?: string;
  attachments?: Attachment[];
  read_by?: string[];
  reply_to_message_id?: string;
  replyTo?: { id: string; senderName: string; body: string };
  reactions?: MessageReaction[];
  status?: 'sending' | 'sent' | 'failed';
  tempId?: string;
  deleted_at?: string;
  edited_at?: string;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role?: 'admin' | 'member';
  joinedAt: string;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  type: 'dm' | 'group';
  name?: string;
  title?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  last_message_at?: string;
  lastMessagePreview?: string;
  unreadCount?: number;
  createdAt: string;
  avatar?: string;
}

export interface WorkNote {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  status?: string;
  date?: string;
  isImportant?: boolean;
  reminder?: NoteReminder;
  createdAt: string;
  updatedAt: string;
}

export interface NoteReminder {
  date: string;
  time?: string;
  channel?: 'internal' | 'email' | 'both';
  notified?: boolean;
  sent?: boolean;
}

export type QuestionType = 'text' | 'number' | 'select' | 'multiselect' | 'scale' | 'boolean' | 'LIKERT' | 'NPS' | 'TEXT' | 'RATING' | 'CHOICE' | 'MULTI_CHOICE' | 'MATRIX' | 'MULTI' | 'CHECKBOX' | 'DROPDOWN' | 'YESNO' | 'DATE' | 'RANKING' | 'FILE';

export interface SurveyQuestion {
  id: string;
  text?: string;
  title?: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  dimension?: string;
  section?: string;
  scale?: number;
}

export interface Survey {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'closed' | 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'OPEN' | 'SCHEDULED' | 'ARCHIVED';
  questions: SurveyQuestion[];
  createdAt: string;
  closedAt?: string;
  targetAudience?: string;
  isAnonymous?: boolean;
  audience?: string;
  unit?: string;
  process?: string;
  responses?: number;
  completionRate?: number;
  ownerId?: string;
  deadline?: string;
  responsesCount?: number;
  targetUserId?: string | string[];
  targetUnitId?: string | string[];
  targetRoleId?: string | string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  tenantId: string;
  userId: string;
  respondentId?: string;
  answers: Record<string, unknown>;
  submittedAt: string;
}

export interface EmailOutbox {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
}
