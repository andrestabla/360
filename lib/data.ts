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
  app_title: string;
  primary_color: string;
  accent_color: string;
  login_bg_color?: string;
  login_bg_image?: string;
  login_description?: string;
  support_message?: string;
  logo_url?: string;
  updated_at: string;
}

export interface TenantPolicy {
  session_duration_minutes?: number;
  max_failed_logins: number;
  lock_minutes: number;
  mfa_required?: boolean;
  ip_whitelist?: string[];
  sso_enabled: boolean;
  sso_providers?: string[];
  file_max_size_bytes: number;
  allowed_mime_types: string[];
  audit_retention_days: number;
  updated_at: string;
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

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domains: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  timezone: string;
  locale: string;
  branding: TenantBranding;
  policies: TenantPolicy;
  ssoConfig?: TenantSSOConfig;
  storageConfig?: TenantStorageConfig;
  integrations?: TenantIntegration[];
  features: string[];
  sector?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  users: number;
  storage: string;
  created_at: string;
  updated_at?: string;
  roleTemplates: Record<number, string[]>;
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

export interface DocHistory {
  version: string;
  date: string;
  userId: string;
  userName: string;
  changes: string;
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
  config: GoogleDriveConfig | DropboxConfig | OneDriveConfig | SharePointConfig | S3Config;
  lastTested?: string;
  testStatus?: 'success' | 'failed';
  testMessage?: string;
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

interface Database {
  tenants: Tenant[];
  users: User[];
  units: Unit[];
  posts: Post[];
  docs: Doc[];
  projects: Project[];
  projectFolders: ProjectFolder[];
  repoFolders: RepoFolder[];
  workflowDefinitions: WorkflowDefinition[];
  workflowCases: WorkflowCase[];
  platformAudit: PlatformAuditEvent[];
  platformAdmins: PlatformAdmin[];
  platformSettings: PlatformSettings;
  conversations: Conversation[];
  conversationMembers: ConversationMember[];
  messages: ChatMessage[];
  workNotes: WorkNote[];
  surveyResponses: SurveyResponse[];
  surveys: Survey[];
  publicComments: PublicComment[];
  emailOutbox: EmailOutbox[];
  storageConfigs: Record<string, TenantStorageConfig>;
  contextChats: Record<string, { text: string; type: string }[]>;
  save: () => void;
  load: () => void;
}

const defaultPlatformSettings: PlatformSettings = {
  defaultModules: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'],
  defaultLocale: 'es-CO',
  defaultTimezone: 'America/Bogota',
  authPolicy: {
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 3600,
    enforceSSO: false,
    passwordMinLength: 8,
    mfaPolicy: 'optional'
  }
};

const sampleTenants: Tenant[] = [
  {
    id: 'T1',
    name: 'Empresa Demo',
    slug: 'demo',
    domains: ['demo.maturity.online'],
    status: 'ACTIVE',
    timezone: 'America/Bogota',
    locale: 'es-CO',
    branding: {
      app_title: 'Empresa Demo',
      primary_color: '#2563eb',
      accent_color: '#1d4ed8',
      updated_at: new Date().toISOString()
    },
    policies: {
      max_failed_logins: 3,
      lock_minutes: 15,
      file_max_size_bytes: 10 * 1024 * 1024,
      allowed_mime_types: ['application/pdf', 'image/png', 'image/jpeg'],
      audit_retention_days: 90,
      sso_enabled: false,
      updated_at: new Date().toISOString()
    },
    features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS', 'SURVEYS'],
    sector: 'technology',
    contactName: 'Juan Admin',
    contactEmail: 'admin@demo.com',
    contactPhone: '+57 300 123 4567',
    users: 5,
    storage: '2.5 GB',
    created_at: '2024-01-15T10:00:00Z',
    roleTemplates: {
      1: [...PERMISSIONS],
      2: ['MANAGE_UNITS', 'VIEW_ALL_DOCS', 'UPLOAD_DOCS', 'VIEW_ANALYTICS'],
      3: ['VIEW_ALL_DOCS', 'UPLOAD_DOCS'],
      4: ['VIEW_ALL_DOCS'],
      5: ['VIEW_ALL_DOCS'],
      6: []
    }
  },
  {
    id: 'T2',
    name: 'Corporacion Alpha',
    slug: 'alpha',
    domains: ['alpha.maturity.online'],
    status: 'ACTIVE',
    timezone: 'America/Bogota',
    locale: 'es-CO',
    branding: {
      app_title: 'Corporacion Alpha',
      primary_color: '#059669',
      accent_color: '#047857',
      updated_at: new Date().toISOString()
    },
    policies: {
      max_failed_logins: 5,
      lock_minutes: 30,
      file_max_size_bytes: 20 * 1024 * 1024,
      allowed_mime_types: ['application/pdf'],
      audit_retention_days: 180,
      sso_enabled: true,
      updated_at: new Date().toISOString()
    },
    features: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT'],
    sector: 'finance',
    contactName: 'Maria Gonzalez',
    contactEmail: 'admin@alpha.com',
    users: 12,
    storage: '8.2 GB',
    created_at: '2024-02-20T14:30:00Z',
    roleTemplates: {
      1: [...PERMISSIONS],
      2: ['MANAGE_UNITS', 'VIEW_ALL_DOCS', 'UPLOAD_DOCS'],
      3: ['VIEW_ALL_DOCS', 'UPLOAD_DOCS'],
      4: ['VIEW_ALL_DOCS'],
      5: [],
      6: []
    }
  }
];

const sampleUsers: User[] = [
  {
    id: 'u1',
    name: 'Juan Admin',
    email: 'admin@demo.com',
    role: 'Admin Global',
    level: 1,
    tenantId: 'T1',
    unit: 'Direccion General',
    initials: 'JA',
    bio: 'Administrador principal de la plataforma',
    phone: '+57 300 123 4567',
    location: 'Bogota, Colombia',
    jobTitle: 'Director General',
    language: 'es',
    timezone: 'America/Bogota',
    status: 'ACTIVE'
  },
  {
    id: 'u2',
    name: 'Maria Lopez',
    email: 'maria@demo.com',
    role: 'Gerente',
    level: 2,
    tenantId: 'T1',
    unit: 'Operaciones',
    initials: 'ML',
    bio: 'Gerente de Operaciones',
    phone: '+57 300 234 5678',
    location: 'Medellin, Colombia',
    jobTitle: 'Gerente de Operaciones',
    language: 'es',
    timezone: 'America/Bogota',
    status: 'ACTIVE'
  },
  {
    id: 'u3',
    name: 'Carlos Perez',
    email: 'carlos@demo.com',
    role: 'Analista',
    level: 3,
    tenantId: 'T1',
    unit: 'TI',
    initials: 'CP',
    bio: 'Analista de sistemas',
    jobTitle: 'Analista TI',
    language: 'es',
    timezone: 'America/Bogota',
    status: 'ACTIVE'
  },
  {
    id: 'u4',
    name: 'Ana Garcia',
    email: 'ana@demo.com',
    role: 'Usuario',
    level: 4,
    tenantId: 'T1',
    unit: 'Recursos Humanos',
    initials: 'AG',
    bio: 'Coordinadora de RRHH',
    jobTitle: 'Coordinadora RRHH',
    status: 'ACTIVE'
  },
  {
    id: 'u5',
    name: 'Pedro Martinez',
    email: 'pedro@alpha.com',
    role: 'Admin Global',
    level: 1,
    tenantId: 'T2',
    unit: 'Direccion',
    initials: 'PM',
    bio: 'Director Alpha',
    jobTitle: 'Director',
    status: 'ACTIVE'
  }
];

const sampleUnits: Unit[] = [
  {
    id: 'U-T1-1',
    tenantId: 'T1',
    name: 'Direccion General',
    depth: 0,
    type: 'UNIT',
    description: 'Unidad principal de la organizacion'
  },
  {
    id: 'U-T1-2',
    tenantId: 'T1',
    name: 'Operaciones',
    depth: 1,
    parentId: 'U-T1-1',
    type: 'DEPARTMENT',
    description: 'Departamento de operaciones'
  },
  {
    id: 'U-T1-3',
    tenantId: 'T1',
    name: 'TI',
    depth: 1,
    parentId: 'U-T1-1',
    type: 'DEPARTMENT',
    description: 'Tecnologia de la informacion'
  },
  {
    id: 'U-T1-4',
    tenantId: 'T1',
    name: 'Recursos Humanos',
    depth: 1,
    parentId: 'U-T1-1',
    type: 'DEPARTMENT',
    description: 'Gestion de talento humano'
  }
];

const samplePosts: Post[] = [
  {
    id: 'post-1',
    tenantId: 'T1',
    author: 'Juan Admin',
    authorId: 'u1',
    title: 'Bienvenidos a Maturity360',
    excerpt: 'Conoce nuestra nueva plataforma de gestion organizacional',
    content: 'Estamos emocionados de presentar Maturity360, una plataforma integral para la gestion de madurez organizacional. Esta herramienta les permitira mejorar sus procesos, colaborar de manera efectiva y alcanzar sus objetivos estrategicos.',
    category: 'Anuncios',
    status: 'published',
    audience: 'all',
    date: new Date().toISOString(),
    likes: 15,
    commentsCount: 3
  },
  {
    id: 'post-2',
    tenantId: 'T1',
    author: 'Maria Lopez',
    authorId: 'u2',
    title: 'Nuevos procedimientos operativos',
    excerpt: 'Actualizacion de los procedimientos del area de operaciones',
    content: 'Se han actualizado los procedimientos operativos para mejorar la eficiencia. Por favor revisen los documentos adjuntos en el repositorio.',
    category: 'Operaciones',
    status: 'published',
    audience: 'unit',
    date: new Date(Date.now() - 86400000).toISOString(),
    likes: 8,
    commentsCount: 1
  }
];

const sampleDocs: Doc[] = [
  {
    id: 'doc-1',
    tenantId: 'T1',
    title: 'Manual de Procesos v2.0',
    type: 'PDF',
    size: '2.5 MB',
    version: '2.0',
    status: 'active',
    authorId: 'u1',
    unit: 'Direccion General',
    visibility: 'public',
    tags: ['procesos', 'manual', 'calidad'],
    likes: 12,
    commentsCount: 4,
    date: new Date().toISOString()
  },
  {
    id: 'doc-2',
    tenantId: 'T1',
    title: 'Politica de Seguridad',
    type: 'PDF',
    size: '1.2 MB',
    version: '1.5',
    status: 'active',
    authorId: 'u3',
    unit: 'TI',
    visibility: 'public',
    tags: ['seguridad', 'TI', 'politicas'],
    likes: 8,
    commentsCount: 2,
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

const sampleProjects: Project[] = [
  {
    id: 'proj-1',
    tenantId: 'T1',
    title: 'Implementacion ISO 9001',
    description: 'Proyecto de certificacion en calidad ISO 9001:2015',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    creatorId: 'u1',
    createdAt: '2024-01-01T10:00:00Z',
    participants: ['u1', 'u2', 'u3'],
    phases: [
      {
        id: 'phase-1',
        name: 'Diagnostico',
        order: 1,
        status: 'completed',
        activities: [
          {
            id: 'act-1',
            name: 'Evaluacion inicial',
            status: 'completed',
            participants: ['u1', 'u2'],
            documents: []
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Implementacion',
        order: 2,
        status: 'in_progress',
        activities: [
          {
            id: 'act-2',
            name: 'Documentacion de procesos',
            status: 'in_progress',
            participants: ['u2', 'u3'],
            documents: []
          }
        ]
      }
    ],
    color: '#2563eb'
  }
];

const sampleConversations: Conversation[] = [
  {
    id: 'conv-1',
    tenant_id: 'T1',
    type: 'dm',
    participants: ['u1', 'u2'],
    lastMessage: 'Hola, necesito revisar el documento',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'conv-2',
    tenant_id: 'T1',
    type: 'group',
    name: 'Equipo de Proyecto ISO',
    participants: ['u1', 'u2', 'u3'],
    lastMessage: 'Reunion manana a las 10am',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  }
];

const sampleMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    tenant_id: 'T1',
    conversation_id: 'conv-1',
    sender_id: 'u2',
    body: 'Hola, necesito revisar el documento',
    body_type: 'text',
    created_at: new Date().toISOString(),
    senderName: 'Maria Lopez'
  },
  {
    id: 'msg-2',
    tenant_id: 'T1',
    conversation_id: 'conv-2',
    sender_id: 'u1',
    body: 'Reunion manana a las 10am',
    body_type: 'text',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    senderName: 'Juan Admin'
  }
];

const sampleWorkflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'wf-def-1',
    tenantId: 'T1',
    title: 'Solicitud de Vacaciones',
    description: 'Proceso para solicitar vacaciones',
    unit: 'Recursos Humanos',
    icon: 'calendar',
    schema: [
      { id: 'step-1', name: 'Solicitud', type: 'task' },
      { id: 'step-2', name: 'Aprobacion Jefe', type: 'approval', assigneeRole: 'Gerente' },
      { id: 'step-3', name: 'Notificacion RRHH', type: 'notification' }
    ],
    slaHours: 48,
    active: true
  }
];

const sampleWorkflowCases: WorkflowCase[] = [];

const sampleSurveys: Survey[] = [
  {
    id: 'survey-1',
    tenantId: 'T1',
    title: 'Diagnostico de Madurez Organizacional',
    description: 'Evaluacion inicial del nivel de madurez',
    status: 'active',
    questions: [
      {
        id: 'q1',
        text: 'Como calificaria el nivel de documentacion de procesos?',
        type: 'scale',
        required: true,
        dimension: 'Procesos'
      },
      {
        id: 'q2',
        text: 'La organizacion cuenta con indicadores de gestion definidos?',
        type: 'boolean',
        required: true,
        dimension: 'Medicion'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const DB: Database = {
  tenants: sampleTenants,
  users: sampleUsers,
  units: sampleUnits,
  posts: samplePosts,
  docs: sampleDocs,
  projects: sampleProjects,
  projectFolders: [],
  repoFolders: [],
  workflowDefinitions: sampleWorkflowDefinitions,
  workflowCases: sampleWorkflowCases,
  platformAudit: [],
  platformAdmins: [
    {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'superadmin@maturity.online',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      mfaEnabled: true,
      lastLogin: new Date().toISOString()
    }
  ],
  platformSettings: defaultPlatformSettings,
  conversations: sampleConversations,
  conversationMembers: [],
  messages: sampleMessages,
  workNotes: [],
  surveyResponses: [],
  surveys: sampleSurveys,
  publicComments: [],
  emailOutbox: [],
  storageConfigs: {},
  contextChats: {},

  save: function() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('m360_db', JSON.stringify({
          tenants: this.tenants,
          users: this.users,
          units: this.units,
          posts: this.posts,
          docs: this.docs,
          projects: this.projects,
          projectFolders: this.projectFolders,
          repoFolders: this.repoFolders,
          workflowDefinitions: this.workflowDefinitions,
          workflowCases: this.workflowCases,
          platformAudit: this.platformAudit,
          conversations: this.conversations,
          messages: this.messages,
          workNotes: this.workNotes,
          surveyResponses: this.surveyResponses,
          surveys: this.surveys,
          publicComments: this.publicComments,
          storageConfigs: this.storageConfigs
        }));
      } catch (e) {
        console.error('Failed to save DB:', e);
      }
    }
  },

  load: function() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('m360_db');
        if (stored) {
          const data = JSON.parse(stored);
          Object.assign(this, data);
        }
      } catch (e) {
        console.error('Failed to load DB:', e);
      }
    }
  }
};

if (typeof window !== 'undefined') {
  DB.load();
}
