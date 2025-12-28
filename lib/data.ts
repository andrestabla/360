/**
 * @deprecated This file contains mock data for development/demo purposes only.
 * 
 * IMPORTANT: 
 * - The DB object should NOT be used in production.
 * - All data operations should use the PostgreSQL database via API endpoints.
 * - For type definitions, import from '@/lib/types' instead.
 * 
 * The mock data (DB object) will be removed in a future version.
 * Migrate all DB.* usages to real database API calls.
 */

// Re-export types from the centralized types file for backward compatibility
export * from './types';

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

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  read: boolean;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  level: number;
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
  preferences?: {
    theme: 'light' | 'dark' | 'system',
    notifications: boolean,
    sidebarCollapsed: boolean
  };
}

export interface Unit {
  id: string;
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

export interface PlatformAuditEvent {
  id: string;
  event_type: string;
  actor_id: string;
  actor_name: string;
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
  storage?: any;
  roleTemplates?: Record<number, string[]>;
  plan?: 'STARTER' | 'PRO' | 'ENTERPRISE' | 'CUSTOM';
  branding?: {
    appTitle?: string;
    portalDescription?: string;
    supportMessage?: string;
    primaryColor?: string;
    loginBackgroundColor?: string;
    loginBackgroundImage?: string;
    logoUrl?: string;
  };
}

export interface Attachment {
  id: string;
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
  contextChats: Record<string, { text: string; type: string }[]>;
  save: () => void;
  load: () => void;
}

const defaultPlatformSettings: PlatformSettings = {
  defaultModules: ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'],
  defaultLocale: 'es-CO',
  defaultTimezone: 'America/Bogota',
  plan: 'ENTERPRISE',
  branding: {
    appTitle: 'Algoritmo',
    portalDescription: 'Plataforma de gestión integral.',
    primaryColor: '#3b82f6',
    loginBackgroundColor: '#ffffff',
    loginBackgroundImage: '/images/auth/login-bg-3.jpg',
  },
  authPolicy: {
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 3600,
    enforceSSO: false,
    passwordMinLength: 8,
    mfaPolicy: 'optional'
  },
  storage: undefined
};

const sampleUsers: User[] = [
  {
    id: 'u1',
    name: 'Juan Admin',
    email: 'admin@demo.com',
    role: 'Admin Global',
    level: 1,
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
    name: 'Direccion General',
    depth: 0,
    type: 'UNIT',
    description: 'Unidad principal de la organizacion'
  },
  {
    id: 'U-T1-2',
    name: 'Operaciones',
    depth: 1,
    parentId: 'U-T1-1',
    type: 'DEPARTMENT',
    description: 'Departamento de operaciones'
  },
  {
    id: 'U-T1-3',
    name: 'TI',
    depth: 1,
    parentId: 'U-T1-1',
    type: 'DEPARTMENT',
    description: 'Tecnologia de la informacion'
  },
  {
    id: 'U-T1-4',
    name: 'Recursos Humanos',
    depth: 1,
    parentId: 'U-T1-1',
    type: 'DEPARTMENT',
    description: 'Gestion de talento humano'
  }
];

const samplePosts: Post[] = [
  {
    id: 'p1',
    author: 'Juan Admin',
    authorId: 'u1',
    title: 'Bienvenidos a Maturity 360',
    content: 'Estamos lanzando la nueva plataforma de proyectos.',
    category: 'Oficial',
    status: 'published',
    audience: 'all',
    date: 'Hace 2 horas',
    likes: 12,
    commentsCount: 3,
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7'
  },
  {
    id: 'p2',
    author: 'Maria Lopez',
    authorId: 'u2',
    title: 'Actualizacion de Politicas',
    content: 'Se han actualizado las politicas de seguridad.',
    category: 'RRHH',
    status: 'published',
    audience: 'all',
    date: 'Ayer',
    likes: 5,
    commentsCount: 0
  }
];

const sampleDocs: Doc[] = [
  {
    id: 'd1',
    title: 'Manual de Usuario',
    type: 'PDF',
    size: '2.4 MB',
    version: '1.0',
    status: 'active',
    authorId: 'u1',
    unit: 'Direccion General',
    visibility: 'public',
    tags: ['manual', 'guia'],
    likes: 8,
    commentsCount: 1,
    date: '2024-03-01'
  },
  {
    id: 'd2',
    title: 'Reporte Financiero Q1',
    type: 'XLSX',
    size: '1.1 MB',
    version: '1.2',
    status: 'active',
    authorId: 'u2',
    unit: 'TI',
    visibility: 'public',
    tags: ['finanzas', 'q1'],
    likes: 3,
    commentsCount: 0,
    date: '2024-03-15'
  }
];

const sampleProjects: Project[] = [
  {
    id: 'pj1',
    title: 'Implementacion ISO',
    description: 'Proyecto para certificacion ISO 9001',
    status: 'ACTIVE',
    creatorId: 'u1',
    createdAt: '2024-01-20',
    participants: ['u1', 'u2'],
    phases: [],
    color: '#3b82f6',
    unit: 'Calidad'
  }
];

const sampleConversations: Conversation[] = [
  {
    id: 'c1',
    type: 'dm',
    participants: ['u1', 'u2'],
    lastMessage: 'Hola, revisaste el documento?',
    lastMessageAt: '10:30 AM',
    unreadCount: 1,
    createdAt: '2024-03-01'
  },
  {
    id: 'conv-2',
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
    id: 'm1',
    conversation_id: 'c1',
    sender_id: 'u2',
    body: 'Hola, revisaste el documento?',
    body_type: 'text',
    created_at: '2024-03-20T10:30:00Z',
    senderName: 'Maria Lopez',
    status: 'sent'
  }
];

const sampleWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf1',
    title: 'Aprobacion de Gastos',
    description: 'Proceso para aprobar gastos superiores a $1000',
    ownerId: 'u1',
    active: true,
    schema: [],
    unit: 'Finanzas'
  }
];

const sampleWorkflowCases: WorkflowCase[] = [];

const sampleSurveys: Survey[] = [
  {
    id: 's1',
    title: 'Clima Laboral 2024',
    status: 'active',
    questions: [
      { id: 'q1', type: 'scale', title: 'Satisfaccion', required: true, scale: 5 }
    ],
    createdAt: '2024-03-01'
  }
];

export const DB: Database = {
  users: sampleUsers,
  units: sampleUnits,
  posts: samplePosts,
  docs: sampleDocs,
  projects: sampleProjects,
  projectFolders: [],
  repoFolders: [],
  workflowDefinitions: sampleWorkflows,
  workflowCases: [],
  platformAudit: [],
  platformAdmins: [],
  platformSettings: defaultPlatformSettings,
  conversations: sampleConversations,
  conversationMembers: [],
  messages: sampleMessages,
  workNotes: [],
  surveyResponses: [],
  surveys: sampleSurveys,
  publicComments: [],
  emailOutbox: [],
  contextChats: {},

  save: function () {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('m360_db', JSON.stringify({
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
          publicComments: this.publicComments
        }));
      } catch (e) {
        console.error('Failed to save DB:', e);
      }
    }
  },

  load: function () {
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
