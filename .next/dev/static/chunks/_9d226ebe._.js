(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PERMISSIONS",
    ()=>PERMISSIONS
]);
const PERMISSIONS = [
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/data.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

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
 */ // Re-export types from the centralized types file for backward compatibility
__turbopack_context__.s([
    "DB",
    ()=>DB,
    "PERMISSIONS",
    ()=>PERMISSIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [app-client] (ecmascript)");
;
const PERMISSIONS = [
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
const defaultPlatformSettings = {
    defaultModules: [
        'DASHBOARD',
        'WORKFLOWS',
        'REPOSITORY',
        'CHAT',
        'ANALYTICS'
    ],
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
const sampleTenants = [
    {
        id: 'T1',
        name: 'Empresa Demo',
        slug: 'demo',
        domains: [
            'demo.maturity.online'
        ],
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
            allowed_mime_types: [
                'application/pdf',
                'image/png',
                'image/jpeg'
            ],
            audit_retention_days: 90,
            sso_enabled: false,
            updated_at: new Date().toISOString()
        },
        features: [
            'DASHBOARD',
            'WORKFLOWS',
            'REPOSITORY',
            'CHAT',
            'ANALYTICS',
            'SURVEYS'
        ],
        sector: 'technology',
        contactName: 'Juan Admin',
        contactEmail: 'admin@demo.com',
        contactPhone: '+57 300 123 4567',
        users: 5,
        storage: '2.5 GB',
        created_at: '2024-01-15T10:00:00Z',
        roleTemplates: {
            1: [
                ...PERMISSIONS
            ],
            2: [
                'MANAGE_UNITS',
                'VIEW_ALL_DOCS',
                'UPLOAD_DOCS',
                'VIEW_ANALYTICS'
            ],
            3: [
                'VIEW_ALL_DOCS',
                'UPLOAD_DOCS'
            ],
            4: [
                'VIEW_ALL_DOCS'
            ],
            5: [
                'VIEW_ALL_DOCS'
            ],
            6: []
        }
    },
    {
        id: 'T2',
        name: 'Corporacion Alpha',
        slug: 'alpha',
        domains: [
            'alpha.maturity.online'
        ],
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
            allowed_mime_types: [
                'application/pdf'
            ],
            audit_retention_days: 180,
            sso_enabled: true,
            updated_at: new Date().toISOString()
        },
        features: [
            'DASHBOARD',
            'WORKFLOWS',
            'REPOSITORY',
            'CHAT'
        ],
        sector: 'finance',
        contactName: 'Maria Gonzalez',
        contactEmail: 'admin@alpha.com',
        users: 12,
        storage: '8.2 GB',
        created_at: '2024-02-20T14:30:00Z',
        roleTemplates: {
            1: [
                ...PERMISSIONS
            ],
            2: [
                'MANAGE_UNITS',
                'VIEW_ALL_DOCS',
                'UPLOAD_DOCS'
            ],
            3: [
                'VIEW_ALL_DOCS',
                'UPLOAD_DOCS'
            ],
            4: [
                'VIEW_ALL_DOCS'
            ],
            5: [],
            6: []
        }
    }
];
const sampleUsers = [
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
const sampleUnits = [
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
const samplePosts = [
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
const sampleDocs = [
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
        tags: [
            'procesos',
            'manual',
            'calidad'
        ],
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
        tags: [
            'seguridad',
            'TI',
            'politicas'
        ],
        likes: 8,
        commentsCount: 2,
        date: new Date(Date.now() - 172800000).toISOString()
    }
];
const sampleProjects = [
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
        participants: [
            'u1',
            'u2',
            'u3'
        ],
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
                        participants: [
                            'u1',
                            'u2'
                        ],
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
                        participants: [
                            'u2',
                            'u3'
                        ],
                        documents: []
                    }
                ]
            }
        ],
        color: '#2563eb'
    }
];
const sampleConversations = [
    {
        id: 'conv-1',
        tenant_id: 'T1',
        type: 'dm',
        participants: [
            'u1',
            'u2'
        ],
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
        participants: [
            'u1',
            'u2',
            'u3'
        ],
        lastMessage: 'Reunion manana a las 10am',
        lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 2,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
    }
];
const sampleMessages = [
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
const sampleWorkflowDefinitions = [
    {
        id: 'wf-def-1',
        tenantId: 'T1',
        title: 'Solicitud de Vacaciones',
        description: 'Proceso para solicitar vacaciones',
        unit: 'Recursos Humanos',
        icon: 'calendar',
        schema: [
            {
                id: 'step-1',
                name: 'Solicitud',
                type: 'task'
            },
            {
                id: 'step-2',
                name: 'Aprobacion Jefe',
                type: 'approval',
                assigneeRole: 'Gerente'
            },
            {
                id: 'step-3',
                name: 'Notificacion RRHH',
                type: 'notification'
            }
        ],
        slaHours: 48,
        active: true
    }
];
const sampleWorkflowCases = [];
const sampleSurveys = [
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
const DB = {
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
        if ("TURBOPACK compile-time truthy", 1) {
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
        if ("TURBOPACK compile-time truthy", 1) {
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
if ("TURBOPACK compile-time truthy", 1) {
    DB.load();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/seed_attachments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "seedAttachments",
    ()=>seedAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript) <locals>");
;
const seedAttachments = ()=>{
    const convo = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].conversations.find((c)=>c.type === 'dm');
    if (!convo) return console.log('No DM found to seed');
    console.log('Seeding attachments to conversation:', convo.id);
    // 1. Image Message
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].messages.push({
        id: 'MSG-IMG-TEST',
        tenant_id: 'T1',
        conversation_id: convo.id,
        sender_id: convo.participants?.[0] || 'system',
        body: 'Mira esta imagen',
        body_type: 'image',
        created_at: new Date().toISOString(),
        senderName: 'Test Bot',
        attachments: [
            {
                id: 'ATT-1',
                tenant_id: 'T1',
                message_id: 'MSG-IMG-TEST',
                file_name: 'demo-image.jpg',
                mime_type: 'image/jpeg',
                size: 1024 * 500,
                storage_key: 'mock',
                url: 'https://picsum.photos/400/300',
                created_at: new Date().toISOString()
            }
        ]
    });
    // 2. File Message
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].messages.push({
        id: 'MSG-FILE-TEST',
        tenant_id: 'T1',
        conversation_id: convo.id,
        sender_id: convo.participants?.[0] || 'system',
        body: 'Aquí tienes el reporte',
        body_type: 'file',
        created_at: new Date().toISOString(),
        senderName: 'Test Bot',
        attachments: [
            {
                id: 'ATT-2',
                tenant_id: 'T1',
                message_id: 'MSG-FILE-TEST',
                file_name: 'reporte-anual.pdf',
                mime_type: 'application/pdf',
                size: 1024 * 1024 * 2.5,
                storage_key: 'mock',
                url: '#',
                created_at: new Date().toISOString()
            }
        ]
    });
    console.log('Seeded 2 messages with attachments.');
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/AppContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/data.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$seed_attachments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/seed_attachments.ts [app-client] (ecmascript)"); // Import seeder
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const getInitialState = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const storedUser = localStorage.getItem('m360_user');
        const storedTenantId = localStorage.getItem('m360_tenant_id');
        const storedIsSuperAdmin = localStorage.getItem('m360_is_super_admin');
        const storedOriginalSession = localStorage.getItem('m360_original_session');
        const storedSidebar = localStorage.getItem('m360_sidebar_collapsed');
        const storedSessionToken = localStorage.getItem('m360_session_token');
        return {
            user: storedUser ? JSON.parse(storedUser) : null,
            tenantId: storedTenantId || null,
            superAdmin: storedIsSuperAdmin === 'true',
            originalSession: storedOriginalSession ? JSON.parse(storedOriginalSession) : null,
            sidebarCollapsed: storedSidebar === 'true',
            sessionToken: storedSessionToken || null
        };
    } catch  {
        return {
            user: null,
            tenantId: null,
            superAdmin: false,
            originalSession: null,
            sidebarCollapsed: false,
            sessionToken: null
        };
    }
};
function AppProvider({ children }) {
    _s();
    const initialState = getInitialState();
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState.user);
    const [originalSession, setOriginalSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState.originalSession);
    const [currentTenantId, setCurrentTenantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState.tenantId);
    const [isSuperAdmin, setIsSuperAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState.superAdmin);
    const [sessionToken, setSessionToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState.sessionToken);
    const [forceUpdate, setForceUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialState.sidebarCollapsed);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [unreadChatCount, setUnreadChatCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isHydrated, setIsHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(("TURBOPACK compile-time value", "object") !== 'undefined');
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const currentTenant = currentTenantId ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].tenants.find((t)=>t.id === currentTenantId) || null : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            setIsHydrated(true);
        }
    }["AppProvider.useEffect"], []);
    // 2. Persistence: Save to LocalStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                if (currentUser) localStorage.setItem('m360_user', JSON.stringify(currentUser));
                else localStorage.removeItem('m360_user');
                if (currentTenantId) localStorage.setItem('m360_tenant_id', currentTenantId);
                else localStorage.removeItem('m360_tenant_id');
                if (isSuperAdmin) localStorage.setItem('m360_is_super_admin', 'true');
                else localStorage.removeItem('m360_is_super_admin');
                if (originalSession) localStorage.setItem('m360_original_session', JSON.stringify(originalSession));
                else localStorage.removeItem('m360_original_session');
                if (sessionToken) localStorage.setItem('m360_session_token', sessionToken);
                else localStorage.removeItem('m360_session_token');
                localStorage.setItem('m360_sidebar_collapsed', isSidebarCollapsed.toString());
            }
        }
    }["AppProvider.useEffect"], [
        currentUser,
        currentTenantId,
        isSuperAdmin,
        originalSession,
        sessionToken,
        isSidebarCollapsed
    ]);
    // 3. Unread Chat Count Logic
    const refreshUnreadCount = async ()=>{
        if (!currentUser || !currentTenantId) {
            setUnreadChatCount(0);
            return;
        }
        try {
            const { ChatService } = await __turbopack_context__.A("[project]/lib/services/chatService.ts [app-client] (ecmascript, async loader)");
            const res = await ChatService.getConversations(currentUser.id, currentTenantId);
            const total = res.data.reduce((sum, conv)=>sum + (conv.unreadCount || 0), 0);
            setUnreadChatCount(total);
        } catch (e) {
            console.error("Failed to refresh unread count", e);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            refreshUnreadCount();
            const interval = setInterval(refreshUnreadCount, 10000); // Poll every 10s
            return ({
                "AppProvider.useEffect": ()=>clearInterval(interval)
            })["AppProvider.useEffect"];
        }
    }["AppProvider.useEffect"], [
        currentUser,
        currentTenantId
    ]);
    // 3. Security: Cross-Domain Validation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            // Load initial state (Mock: Get first tenant/user)
            // In real app, this comes from Auth provider / API
            // AUTO-SEED FOR VERIFICATION
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && !window.hasSeeded) {
                console.log('Running Auto-Seeder...');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$seed_attachments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedAttachments"])();
                window.hasSeeded = true;
            }
            const host = window.location.hostname;
            const parts = host.split('.');
            let subdomain = '';
            if (parts.length > (host.includes('localhost') ? 1 : 2)) {
                subdomain = parts[0];
            }
            // Case A: Tenant User on Main Domain -> Invalid
            // RELAXED FOR PROTOTYPE/DEMO: Allow simulated tenant login on main domain if DNS/Hosts not setup
            // if (!subdomain && currentTenantId) {
            //    console.warn('Security: Tenant User detected on Main Domain. Logging out.');
            //    logout();
            // }
            // Case B: Tenant User on Wrong Tenant Domain -> Invalid
            // This is still valid to enforce separation if subdomains ARE used.
            if (subdomain && currentTenantId && subdomain.toLowerCase() !== currentTenantId.toLowerCase()) {
                console.warn(`Security: User for ${currentTenantId} detected on ${subdomain}. Logging out.`);
                logout();
            }
        // Case C: Super Admin on Tenant Domain (without Impersonation) -> Allowed for flexibility
        // Super admins can access any domain for administration purposes
        // No action needed - this is valid behavior
        }
    }["AppProvider.useEffect"], [
        currentUser,
        currentTenantId,
        isSuperAdmin
    ]);
    // Apply Branding
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if (currentTenant && currentTenant.branding) {
                const root = document.documentElement;
                root.style.setProperty('--primary', currentTenant.branding.primary_color);
                root.style.setProperty('--primary-dark', currentTenant.branding.accent_color);
            } else {
                const root = document.documentElement;
                root.style.removeProperty('--primary');
                root.style.removeProperty('--primary-dark');
            }
        }
    }["AppProvider.useEffect"], [
        currentTenant
    ]);
    const login = (role, tenantId, email)=>{
        if (role === 'superadmin') {
            setIsSuperAdmin(true);
            const adminUser = {
                name: 'Super Admin',
                role: 'Platform Owner',
                initials: 'SA',
                id: 'superadmin',
                level: 0,
                tenantId: 'global',
                unit: 'Global',
                bio: 'Super Admin',
                email: email || 'proyectos@algoritmot.com',
                phone: '',
                location: '',
                jobTitle: 'Admin',
                language: 'Es',
                timezone: 'GMT-5',
                status: 'ACTIVE'
            };
            setCurrentUser(adminUser);
            setCurrentTenantId(null);
            // Audit Log
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                id: `audit-${Date.now()}`,
                event_type: 'LOGIN_SUCCESS',
                actor_id: 'superadmin',
                actor_name: 'Super Admin',
                metadata: {
                    role: 'SUPER_ADMIN'
                },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
            router.push('/dashboard/tenants');
        } else if (tenantId) {
            setIsSuperAdmin(false);
            setCurrentTenantId(tenantId);
            let user;
            // 1. Try finding by Email (Exact Match)
            if (email) {
                user = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.find((u)=>u.tenantId === tenantId && u.email?.toLowerCase() === email.toLowerCase());
            }
            // 2. Fallback to Role-based simulation
            if (!user) {
                user = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.find((u)=>u.tenantId === tenantId && (role === 'admin' ? u.level === 1 : u.level > 1));
            }
            if (user) {
                if (user.status === 'SUSPENDED') {
                    if ("TURBOPACK compile-time truthy", 1) alert('Access Denied: Your account has been suspended.');
                    // Audit Log (Failed)
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                        id: `audit-${Date.now()}`,
                        event_type: 'LOGIN_FAILED',
                        actor_id: user.id || 'unknown',
                        actor_name: user.name || 'Unknown',
                        target_tenant_id: tenantId,
                        metadata: {
                            reason: 'Account Suspended'
                        },
                        ip: '127.0.0.1',
                        created_at: new Date().toISOString()
                    });
                    return;
                }
                if (user.status === 'DELETED') {
                    if ("TURBOPACK compile-time truthy", 1) alert('Access Denied: Account not found.');
                    // console.error('Attempt to login to deleted account');
                    return;
                }
                setCurrentUser(user);
                // Audit Log (Success)
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                    id: `audit-${Date.now()}`,
                    event_type: 'LOGIN_SUCCESS',
                    actor_id: user.id,
                    actor_name: user.name,
                    target_tenant_id: tenantId,
                    metadata: {
                        role: user.role,
                        level: user.level
                    },
                    ip: '127.0.0.1',
                    created_at: new Date().toISOString()
                });
                router.push('/dashboard');
            } else {
                console.error('User not found for login simulation');
            }
        }
    };
    const impersonateUser = (userId, tenantId)=>{
        if (!isSuperAdmin || !currentUser) return;
        const targetUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.find((u)=>u.id === userId && u.tenantId === tenantId);
        if (targetUser) {
            console.log(`Starting impersonation of ${targetUser.email} by ${currentUser.email}`);
            setOriginalSession(currentUser);
            setCurrentUser(targetUser);
            setCurrentTenantId(tenantId);
            setIsSuperAdmin(false); // Temporarily act as regular user
            router.push('/dashboard');
            // Audit Log
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                id: `evt-${Date.now()}`,
                event_type: 'IMPERSONATION_STARTED',
                actor_id: currentUser.id,
                actor_name: currentUser.name,
                target_tenant_id: tenantId,
                target_user_id: userId,
                metadata: {
                    reason: 'Support Action'
                },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
        }
    };
    const stopImpersonation = ()=>{
        if (originalSession) {
            console.log('Stopping impersonation, returning to Superadmin');
            setCurrentUser(originalSession);
            setIsSuperAdmin(true);
            setCurrentTenantId(null);
            setOriginalSession(null);
            router.push('/dashboard/tenants');
            // Audit Log
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                id: `evt-${Date.now()}`,
                event_type: 'IMPERSONATION_ENDED',
                actor_id: originalSession.id,
                actor_name: originalSession.name,
                metadata: {},
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
        }
    };
    const logout = ()=>{
        setCurrentUser(null);
        setOriginalSession(null);
        setCurrentTenantId(null);
        setIsSuperAdmin(false);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('m360_user');
            localStorage.removeItem('m360_tenant_id');
            localStorage.removeItem('m360_is_super_admin');
            localStorage.removeItem('m360_original_session');
        }
        router.push('/');
    };
    const updateUser = (updates)=>{
        if (currentUser) {
            const updated = {
                ...currentUser,
                ...updates
            };
            setCurrentUser(updated);
            // Also update in DB
            const dbIdx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.findIndex((u)=>u.id === currentUser.id);
            if (dbIdx >= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[dbIdx] = updated;
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            }
        }
    };
    const getAuthHeaders = ()=>{
        if (!currentUser || !isSuperAdmin) {
            return {
                'Content-Type': 'application/json'
            };
        }
        const sessionData = {
            email: currentUser.email,
            isSuperAdmin: true,
            timestamp: Date.now()
        };
        const token = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(JSON.stringify(sessionData)).toString('base64');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };
    const createTenant = async (data)=>{
        try {
            const response = await fetch('/api/admin/tenants', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: data.name || 'New Tenant',
                    slug: data.slug || `tenant-${Date.now()}`,
                    domains: data.domains || [],
                    timezone: data.timezone || 'America/Bogota',
                    locale: data.locale || 'es-CO',
                    sector: data.sector || 'technology',
                    contactName: data.contactName,
                    contactEmail: data.contactEmail,
                    contactPhone: data.contactPhone,
                    features: data.features || [
                        'DASHBOARD',
                        'WORKFLOWS',
                        'REPOSITORY',
                        'CHAT',
                        'ANALYTICS'
                    ],
                    branding: data.branding || {},
                    policies: data.policies || {}
                })
            });
            const result = await response.json();
            if (!result.success) {
                console.error('Failed to create tenant:', result.error);
                alert(`Error: ${result.error}`);
                return null;
            }
            console.log('Tenant Created:', result.tenant);
            setForceUpdate((prev)=>prev + 1);
            return result.tenant;
        } catch (error) {
            console.error('Error creating tenant:', error);
            alert('Error al crear el tenant. Intente nuevamente.');
            return null;
        }
    };
    const updateTenant = async (id, updates)=>{
        try {
            const response = await fetch('/api/admin/tenants', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    ...updates
                })
            });
            const result = await response.json();
            if (!result.success) {
                console.error('Failed to update tenant:', result.error);
                alert(`Error: ${result.error}`);
                return;
            }
            console.log('Tenant Updated:', result.tenant);
            setForceUpdate((prev)=>prev + 1);
        } catch (error) {
            console.error('Error updating tenant:', error);
            alert('Error al actualizar el tenant. Intente nuevamente.');
        }
    };
    const deleteTenant = async (id)=>{
        try {
            const response = await fetch(`/api/admin/tenants?id=${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!result.success) {
                console.error('Failed to delete tenant:', result.error);
                alert(`Error: ${result.error}`);
                return;
            }
            console.log('Tenant Deleted:', id);
            setForceUpdate((n)=>n + 1);
        } catch (error) {
            console.error('Error deleting tenant:', error);
            alert('Error al eliminar el tenant. Intente nuevamente.');
        }
    };
    const createUnit = (data)=>{
        if (!currentTenantId) return;
        const newUnit = {
            id: `U-${currentTenantId}-${Math.floor(Math.random() * 10000)}`,
            tenantId: currentTenantId,
            name: data.name || 'New Unit',
            depth: data.depth || 0,
            code: data.code,
            parentId: data.parentId,
            ownerId: data.ownerId,
            description: data.description,
            members: data.members || [],
            type: data.type || 'UNIT'
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].units.push(newUnit);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
    };
    const updateUnit = (id, updates)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].units.findIndex((u)=>u.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].units[idx] = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].units[idx],
                ...updates
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        }
    };
    const deleteUnit = (id)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].units.findIndex((u)=>u.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].units.splice(idx, 1);
        }
    };
    const updateLevelPermissions = (level, permissions)=>{
        if (!currentTenant) return;
        // Update in DB (in memory reference)
        // Since currentTenant is a reference to DB object (if retrieved via find), modifying it updates DB?
        // Let's modify DB directly to be safe
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].tenants.findIndex((t)=>t.id === currentTenantId);
        if (idx >= 0) {
            const tenant = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].tenants[idx];
            tenant.roleTemplates = {
                ...tenant.roleTemplates,
                [level]: permissions
            };
        // Force re-render not needed immediately as we don't display permissions in sidebar yet,
        // but page will use it.
        }
    };
    const adminCheckEmailUnique = (email)=>{
        return !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.some((u)=>u.email?.toLowerCase() === email.toLowerCase());
    };
    const adminCreateUser = (userData, options = {})=>{
        // if (!currentTenantId) return; // Allow if explicit tenantId is passed
        const userId = `u-${Date.now()}`;
        const newUser = {
            id: userId,
            tenantId: userData.tenantId || currentTenantId || 'global',
            password: options.customPassword,
            name: userData.name || 'Usuario Nuevo',
            email: userData.email,
            role: userData.role || 'Analista',
            level: userData.level || 6,
            unit: userData.unit || '',
            initials: (userData.name || 'U').substring(0, 2).toUpperCase(),
            bio: userData.bio || '',
            phone: userData.phone || '',
            location: userData.location || '',
            jobTitle: userData.jobTitle || 'Empleado',
            language: 'Es',
            timezone: 'GMT-5',
            status: userData.status || 'ACTIVE',
            mustChangePassword: true,
            inviteSentAt: options.sendNotification ? new Date().toISOString() : undefined,
            inviteExpiresAt: options.sendNotification ? new Date(Date.now() + 72 * 3600 * 1000).toISOString() : undefined
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.push(newUser);
        // Audit Log
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
            id: `audit-${Date.now()}`,
            event_type: 'USER_CREATED',
            actor_id: currentUser?.id || 'system',
            actor_name: currentUser?.name || 'System',
            target_user_id: userId,
            target_tenant_id: newUser.tenantId,
            metadata: {
                ...newUser,
                notificationSent: options.sendNotification
            },
            ip: '127.0.0.1',
            created_at: new Date().toISOString()
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        // Email Notification
        if (options.sendNotification && newUser.email) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].emailOutbox.unshift({
                id: `email-${Date.now()}`,
                to: newUser.email,
                subject: `Bienvenido a Maturity360 - ${newUser.tenantId !== 'global' ? 'Tenant Invitation' : 'Platform Access'}`,
                body: `Hola ${newUser.name},\n\nTu cuenta ha sido creada. Tu contraseña temporal es: Temp123!\nIngresa en: https://${newUser.tenantId}.maturity.online`,
                status: 'SENT',
                sentAt: new Date().toISOString()
            });
            console.log(`[MockEmail] Sent to ${newUser.email}`);
        }
    };
    const adminUpdateUser = (userId, updates)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.findIndex((u)=>u.id === userId);
        if (idx >= 0) {
            const oldUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[idx];
            // Audit Check
            const auditChanges = [];
            if (updates.role && updates.role !== oldUser.role) auditChanges.push(`Role change: ${oldUser.role} -> ${updates.role}`);
            if (updates.tenantId && updates.tenantId !== oldUser.tenantId) auditChanges.push(`Tenant transfer: ${oldUser.tenantId} -> ${updates.tenantId}`);
            if (updates.status && updates.status !== oldUser.status) auditChanges.push(`Status change: ${oldUser.status} -> ${updates.status}`);
            if (updates.email && updates.email !== oldUser.email) auditChanges.push(`Email update: ${oldUser.email} -> ${updates.email}`);
            if (updates.password) auditChanges.push('Password manually updated');
            if (updates.mustChangePassword !== undefined && updates.mustChangePassword !== oldUser.mustChangePassword) {
                auditChanges.push(`Force Password Change: ${updates.mustChangePassword ? 'Enabled' : 'Disabled'}`);
            }
            if (auditChanges.length > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                    id: `audit-${Date.now()}`,
                    event_type: 'USER_UPDATED',
                    actor_id: currentUser?.id || 'system',
                    actor_name: currentUser?.name || 'System',
                    target_user_id: userId,
                    target_tenant_id: oldUser.tenantId,
                    metadata: {
                        changes: auditChanges,
                        updates
                    },
                    ip: '127.0.0.1',
                    created_at: new Date().toISOString()
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[idx] = {
                ...oldUser,
                ...updates
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        }
    };
    const adminDeleteUser = (userId)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.findIndex((u)=>u.id === userId);
        if (idx >= 0) {
            const user = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[idx];
            // Integrity Check: Prevent deleting last admin
            if (user.level === 1 && user.status !== 'DELETED') {
                const otherAdmins = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.filter((u)=>u.tenantId === user.tenantId && u.level === 1 && u.id !== userId && u.status === 'ACTIVE');
                if (otherAdmins.length === 0) {
                    if ("TURBOPACK compile-time truthy", 1) alert('Integrity Error: Cannot delete the last active Admin for this tenant.');
                    return;
                }
            }
            // Soft Delete
            const oldStatus = user.status;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[idx] = {
                ...user,
                status: 'DELETED'
            };
            // Audit
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                id: `audit-${Date.now()}`,
                event_type: 'USER_DELETED',
                actor_id: currentUser?.id || 'system',
                actor_name: currentUser?.name || 'System',
                target_user_id: userId,
                target_tenant_id: user.tenantId,
                metadata: {
                    previous_status: oldStatus
                },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
        }
    };
    const adminResendInvite = (userId)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users.findIndex((u)=>u.id === userId);
        if (idx >= 0) {
            const user = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[idx];
            // Update invite data
            const updated = {
                ...user,
                inviteSentAt: new Date().toISOString(),
                inviteExpiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString()
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].users[idx] = updated;
            // Email Log
            if (user.email) {
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].emailOutbox.unshift({
                    id: `email-${Date.now()}`,
                    to: user.email,
                    subject: `Resend: Bienvenido a Maturity360`,
                    body: `Hola ${user.name},\n\nAqui tienes tu enlace de acceso: https://${user.tenantId}.maturity.online\nCredenciales temporales: Temp123!`,
                    status: 'SENT',
                    sentAt: new Date().toISOString()
                });
            }
            // Audit
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformAudit.unshift({
                id: `audit-${Date.now()}`,
                event_type: 'USER_INVITE_RESENT',
                actor_id: currentUser?.id || 'system',
                actor_name: currentUser?.name || 'System',
                target_user_id: user.id,
                target_tenant_id: user.tenantId,
                metadata: {
                    email: user.email
                },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        }
    };
    const adminDeletePost = (id)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].posts.findIndex((p)=>p.id === id);
        if (idx !== -1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].posts.splice(idx, 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const adminCreatePost = (postData)=>{
        const newPost = {
            ...postData,
            id: `P-${currentTenantId}-${Date.now()}`,
            date: 'Ahora',
            likes: 0,
            commentsCount: 0
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].posts.unshift(newPost);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const adminUpdatePost = (id, updates)=>{
        const post = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].posts.find((p)=>p.id === id);
        if (post) {
            Object.assign(post, updates);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const adminCreateWorkflow = (data)=>{
        if (!currentTenantId) return;
        const newWorkflow = {
            id: `WF-${Date.now()}`,
            tenantId: currentTenantId,
            title: data.title || 'Nuevo Proceso',
            description: data.description || '',
            unit: data.unit || '',
            ownerId: data.ownerId,
            icon: data.icon || 'FileText',
            schema: data.schema || {
                fields: []
            },
            slaHours: data.slaHours || 24,
            active: true
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].workflowDefinitions.unshift(newWorkflow);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const createProjectFolder = (name, parentId)=>{
        if (!currentTenantId) return;
        const newFolder = {
            id: `fld-${currentTenantId}-${Date.now()}`,
            tenantId: currentTenantId,
            name,
            createdAt: new Date().toISOString(),
            parentId
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projectFolders.push(newFolder);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const createRepoFolder = (data)=>{
        if (!currentTenantId) return;
        const newFolder = {
            id: `RF-${currentTenantId}-${Date.now()}`,
            tenantId: currentTenantId,
            name: data.name || 'Nueva Carpeta',
            description: data.description,
            parentId: data.parentId || undefined,
            level: data.level || 1,
            unit: data.unit || 'General',
            process: data.process,
            color: data.color || '#3b82f6',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].repoFolders.push(newFolder);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const updateRepoFolder = (id, updates)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].repoFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].repoFolders[idx] = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].repoFolders[idx],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteRepoFolder = (id)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].repoFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].repoFolders.splice(idx, 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const uploadDoc = (docData)=>{
        const newDoc = {
            id: `DOC-${currentTenantId}-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            commentsCount: 0,
            ...docData
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].docs.unshift(newDoc);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const updateDoc = (id, updates)=>{
        const doc = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].docs.find((d)=>d.id === id);
        if (doc) {
            Object.assign(doc, updates);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteDoc = (id)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].docs.findIndex((d)=>d.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].docs.splice(idx, 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const toggleDocLike = (docId)=>{
        const doc = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].docs.find((d)=>d.id === docId);
        if (doc) {
            if (doc.likes > 0) {
                doc.likes--;
            } else {
                doc.likes++;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const addDocComment = (docId, content)=>{
        const newComment = {
            id: `c-${Date.now()}`,
            docId: docId,
            authorId: currentUser?.id || 'anon',
            authorName: currentUser?.name || 'Anónimo',
            content: content,
            createdAt: new Date().toISOString()
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].publicComments.push(newComment);
        const doc = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].docs.find((d)=>d.id === docId);
        if (doc) doc.commentsCount = (doc.commentsCount || 0) + 1;
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const createProject = (projectData)=>{
        if (!currentTenantId) return;
        const newProject = {
            id: `PROJ-${Date.now()}`,
            tenantId: currentTenantId,
            title: projectData.title || 'Nuevo Proyecto',
            description: projectData.description || '',
            startDate: projectData.startDate || new Date().toISOString(),
            endDate: projectData.endDate || new Date().toISOString(),
            status: 'PLANNING',
            creatorId: currentUser?.id || 'sys',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            participants: projectData.participants || [],
            phases: projectData.phases || [],
            folderId: projectData.folderId,
            color: projectData.color
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.unshift(newProject);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    const updateProject = (id, updates)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.findIndex((p)=>p.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects[idx] = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects[idx],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteProject = (id)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.findIndex((p)=>p.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.splice(idx, 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const duplicateProject = (id)=>{
        const original = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.find((p)=>p.id === id);
        if (original && currentTenantId) {
            const timestamp = Date.now();
            const newProject = {
                ...original,
                id: `PROJ-${timestamp}`,
                title: `${original.title} (Copia)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'PLANNING',
                phases: original.phases.map((ph, i)=>({
                        ...ph,
                        id: `ph-${timestamp}-${i}`,
                        status: 'NOT_STARTED',
                        activities: ph.activities.map((act, j)=>({
                                ...act,
                                id: `act-${timestamp}-${i}-${j}`,
                                status: 'NOT_STARTED',
                                documents: []
                            }))
                    }))
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.unshift(newProject);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const updateProjectFolder = (id, updates)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projectFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projectFolders[idx] = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projectFolders[idx],
                ...updates
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteProjectFolder = (id)=>{
        const idx = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projectFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projects.forEach((p)=>{
                if (p.folderId === id) delete p.folderId;
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].projectFolders.splice(idx, 1);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const toggleSidebar = ()=>setIsSidebarCollapsed((v)=>!v);
    const toggleMobileMenu = ()=>setIsMobileMenuOpen((v)=>!v);
    const closeMobileMenu = ()=>setIsMobileMenuOpen(false);
    const updatePlatformSettings = (settings)=>{
        Object.assign(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].platformSettings, settings);
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DB"].save();
        setForceUpdate((n)=>n + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            currentUser,
            currentTenantId,
            currentTenant,
            isSuperAdmin,
            isHydrated,
            version: forceUpdate,
            originalSession,
            impersonateUser,
            stopImpersonation,
            login,
            logout,
            updateUser,
            createTenant,
            updateTenant,
            deleteTenant,
            createUnit,
            updateUnit,
            deleteUnit,
            updateLevelPermissions,
            adminCheckEmailUnique,
            adminCreateUser,
            adminResendInvite,
            adminUpdateUser,
            adminDeleteUser,
            adminCreatePost,
            adminUpdatePost,
            adminDeletePost,
            adminCreateWorkflow,
            uploadDoc,
            updateDoc,
            deleteDoc,
            toggleDocLike,
            addDocComment,
            createProject,
            updateProject,
            deleteProject,
            duplicateProject,
            createProjectFolder,
            updateProjectFolder,
            deleteProjectFolder,
            isSidebarCollapsed,
            toggleSidebar,
            isMobileMenuOpen,
            toggleMobileMenu,
            closeMobileMenu,
            unreadChatCount,
            refreshUnreadCount,
            updatePlatformSettings,
            createRepoFolder,
            updateRepoFolder,
            deleteRepoFolder
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/AppContext.tsx",
        lineNumber: 966,
        columnNumber: 9
    }, this);
}
_s(AppProvider, "Tb/sSOgUgazuSzcXRuwkCHt53sE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppProvider;
function useApp() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
_s1(useApp, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/UIContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UIProvider",
    ()=>UIProvider,
    "useUI",
    ()=>useUI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const UIContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function UIProvider({ children }) {
    _s();
    const [isSlideOpen, setSlideOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [slideType, setSlideType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [slideData, setSlideData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isViewerOpen, setViewerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewerTitle, setViewerTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openSlide = (type, id, title)=>{
        setSlideType(type);
        setSlideData({
            id,
            title
        });
        setSlideOpen(true);
    };
    const closeSlide = ()=>{
        setSlideOpen(false);
        setTimeout(()=>{
            setSlideType(null);
            setSlideData(null);
        }, 300);
    };
    const openViewer = (title)=>{
        setViewerTitle(title);
        setViewerOpen(true);
    };
    const closeViewer = ()=>{
        setViewerOpen(false);
        setViewerTitle(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UIContext.Provider, {
        value: {
            isSlideOpen,
            slideType,
            slideData,
            openSlide,
            closeSlide,
            isViewerOpen,
            viewerTitle,
            openViewer,
            closeViewer
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/UIContext.tsx",
        lineNumber: 53,
        columnNumber: 9
    }, this);
}
_s(UIProvider, "IVfu1Pxvh68ME7BOH6vFjp7wvzU=");
_c = UIProvider;
function useUI() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
_s1(useUI, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "UIProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UIContext.tsx [app-client] (ecmascript)");
'use client';
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UIContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UIProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 8,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 7,
        columnNumber: 9
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

(function() {
    var e = {
        675: function(e, r) {
            "use strict";
            r.byteLength = byteLength;
            r.toByteArray = toByteArray;
            r.fromByteArray = fromByteArray;
            var t = [];
            var f = [];
            var n = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(var o = 0, u = i.length; o < u; ++o){
                t[o] = i[o];
                f[i.charCodeAt(o)] = o;
            }
            f["-".charCodeAt(0)] = 62;
            f["_".charCodeAt(0)] = 63;
            function getLens(e) {
                var r = e.length;
                if (r % 4 > 0) {
                    throw new Error("Invalid string. Length must be a multiple of 4");
                }
                var t = e.indexOf("=");
                if (t === -1) t = r;
                var f = t === r ? 0 : 4 - t % 4;
                return [
                    t,
                    f
                ];
            }
            function byteLength(e) {
                var r = getLens(e);
                var t = r[0];
                var f = r[1];
                return (t + f) * 3 / 4 - f;
            }
            function _byteLength(e, r, t) {
                return (r + t) * 3 / 4 - t;
            }
            function toByteArray(e) {
                var r;
                var t = getLens(e);
                var i = t[0];
                var o = t[1];
                var u = new n(_byteLength(e, i, o));
                var a = 0;
                var s = o > 0 ? i - 4 : i;
                var h;
                for(h = 0; h < s; h += 4){
                    r = f[e.charCodeAt(h)] << 18 | f[e.charCodeAt(h + 1)] << 12 | f[e.charCodeAt(h + 2)] << 6 | f[e.charCodeAt(h + 3)];
                    u[a++] = r >> 16 & 255;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                if (o === 2) {
                    r = f[e.charCodeAt(h)] << 2 | f[e.charCodeAt(h + 1)] >> 4;
                    u[a++] = r & 255;
                }
                if (o === 1) {
                    r = f[e.charCodeAt(h)] << 10 | f[e.charCodeAt(h + 1)] << 4 | f[e.charCodeAt(h + 2)] >> 2;
                    u[a++] = r >> 8 & 255;
                    u[a++] = r & 255;
                }
                return u;
            }
            function tripletToBase64(e) {
                return t[e >> 18 & 63] + t[e >> 12 & 63] + t[e >> 6 & 63] + t[e & 63];
            }
            function encodeChunk(e, r, t) {
                var f;
                var n = [];
                for(var i = r; i < t; i += 3){
                    f = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (e[i + 2] & 255);
                    n.push(tripletToBase64(f));
                }
                return n.join("");
            }
            function fromByteArray(e) {
                var r;
                var f = e.length;
                var n = f % 3;
                var i = [];
                var o = 16383;
                for(var u = 0, a = f - n; u < a; u += o){
                    i.push(encodeChunk(e, u, u + o > a ? a : u + o));
                }
                if (n === 1) {
                    r = e[f - 1];
                    i.push(t[r >> 2] + t[r << 4 & 63] + "==");
                } else if (n === 2) {
                    r = (e[f - 2] << 8) + e[f - 1];
                    i.push(t[r >> 10] + t[r >> 4 & 63] + t[r << 2 & 63] + "=");
                }
                return i.join("");
            }
        },
        72: function(e, r, t) {
            "use strict";
            /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ var f = t(675);
            var n = t(783);
            var i = typeof Symbol === "function" && typeof Symbol.for === "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
            r.Buffer = Buffer;
            r.SlowBuffer = SlowBuffer;
            r.INSPECT_MAX_BYTES = 50;
            var o = 2147483647;
            r.kMaxLength = o;
            Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
            if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
                console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
            }
            function typedArraySupport() {
                try {
                    var e = new Uint8Array(1);
                    var r = {
                        foo: function() {
                            return 42;
                        }
                    };
                    Object.setPrototypeOf(r, Uint8Array.prototype);
                    Object.setPrototypeOf(e, r);
                    return e.foo() === 42;
                } catch (e) {
                    return false;
                }
            }
            Object.defineProperty(Buffer.prototype, "parent", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.buffer;
                }
            });
            Object.defineProperty(Buffer.prototype, "offset", {
                enumerable: true,
                get: function() {
                    if (!Buffer.isBuffer(this)) return undefined;
                    return this.byteOffset;
                }
            });
            function createBuffer(e) {
                if (e > o) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
                var r = new Uint8Array(e);
                Object.setPrototypeOf(r, Buffer.prototype);
                return r;
            }
            function Buffer(e, r, t) {
                if (typeof e === "number") {
                    if (typeof r === "string") {
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    }
                    return allocUnsafe(e);
                }
                return from(e, r, t);
            }
            Buffer.poolSize = 8192;
            function from(e, r, t) {
                if (typeof e === "string") {
                    return fromString(e, r);
                }
                if (ArrayBuffer.isView(e)) {
                    return fromArrayLike(e);
                }
                if (e == null) {
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
                }
                if (isInstance(e, ArrayBuffer) || e && isInstance(e.buffer, ArrayBuffer)) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof SharedArrayBuffer !== "undefined" && (isInstance(e, SharedArrayBuffer) || e && isInstance(e.buffer, SharedArrayBuffer))) {
                    return fromArrayBuffer(e, r, t);
                }
                if (typeof e === "number") {
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                }
                var f = e.valueOf && e.valueOf();
                if (f != null && f !== e) {
                    return Buffer.from(f, r, t);
                }
                var n = fromObject(e);
                if (n) return n;
                if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof e[Symbol.toPrimitive] === "function") {
                    return Buffer.from(e[Symbol.toPrimitive]("string"), r, t);
                }
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof e);
            }
            Buffer.from = function(e, r, t) {
                return from(e, r, t);
            };
            Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
            Object.setPrototypeOf(Buffer, Uint8Array);
            function assertSize(e) {
                if (typeof e !== "number") {
                    throw new TypeError('"size" argument must be of type number');
                } else if (e < 0) {
                    throw new RangeError('The value "' + e + '" is invalid for option "size"');
                }
            }
            function alloc(e, r, t) {
                assertSize(e);
                if (e <= 0) {
                    return createBuffer(e);
                }
                if (r !== undefined) {
                    return typeof t === "string" ? createBuffer(e).fill(r, t) : createBuffer(e).fill(r);
                }
                return createBuffer(e);
            }
            Buffer.alloc = function(e, r, t) {
                return alloc(e, r, t);
            };
            function allocUnsafe(e) {
                assertSize(e);
                return createBuffer(e < 0 ? 0 : checked(e) | 0);
            }
            Buffer.allocUnsafe = function(e) {
                return allocUnsafe(e);
            };
            Buffer.allocUnsafeSlow = function(e) {
                return allocUnsafe(e);
            };
            function fromString(e, r) {
                if (typeof r !== "string" || r === "") {
                    r = "utf8";
                }
                if (!Buffer.isEncoding(r)) {
                    throw new TypeError("Unknown encoding: " + r);
                }
                var t = byteLength(e, r) | 0;
                var f = createBuffer(t);
                var n = f.write(e, r);
                if (n !== t) {
                    f = f.slice(0, n);
                }
                return f;
            }
            function fromArrayLike(e) {
                var r = e.length < 0 ? 0 : checked(e.length) | 0;
                var t = createBuffer(r);
                for(var f = 0; f < r; f += 1){
                    t[f] = e[f] & 255;
                }
                return t;
            }
            function fromArrayBuffer(e, r, t) {
                if (r < 0 || e.byteLength < r) {
                    throw new RangeError('"offset" is outside of buffer bounds');
                }
                if (e.byteLength < r + (t || 0)) {
                    throw new RangeError('"length" is outside of buffer bounds');
                }
                var f;
                if (r === undefined && t === undefined) {
                    f = new Uint8Array(e);
                } else if (t === undefined) {
                    f = new Uint8Array(e, r);
                } else {
                    f = new Uint8Array(e, r, t);
                }
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            }
            function fromObject(e) {
                if (Buffer.isBuffer(e)) {
                    var r = checked(e.length) | 0;
                    var t = createBuffer(r);
                    if (t.length === 0) {
                        return t;
                    }
                    e.copy(t, 0, 0, r);
                    return t;
                }
                if (e.length !== undefined) {
                    if (typeof e.length !== "number" || numberIsNaN(e.length)) {
                        return createBuffer(0);
                    }
                    return fromArrayLike(e);
                }
                if (e.type === "Buffer" && Array.isArray(e.data)) {
                    return fromArrayLike(e.data);
                }
            }
            function checked(e) {
                if (e >= o) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + o.toString(16) + " bytes");
                }
                return e | 0;
            }
            function SlowBuffer(e) {
                if (+e != e) {
                    e = 0;
                }
                return Buffer.alloc(+e);
            }
            Buffer.isBuffer = function isBuffer(e) {
                return e != null && e._isBuffer === true && e !== Buffer.prototype;
            };
            Buffer.compare = function compare(e, r) {
                if (isInstance(e, Uint8Array)) e = Buffer.from(e, e.offset, e.byteLength);
                if (isInstance(r, Uint8Array)) r = Buffer.from(r, r.offset, r.byteLength);
                if (!Buffer.isBuffer(e) || !Buffer.isBuffer(r)) {
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                }
                if (e === r) return 0;
                var t = e.length;
                var f = r.length;
                for(var n = 0, i = Math.min(t, f); n < i; ++n){
                    if (e[n] !== r[n]) {
                        t = e[n];
                        f = r[n];
                        break;
                    }
                }
                if (t < f) return -1;
                if (f < t) return 1;
                return 0;
            };
            Buffer.isEncoding = function isEncoding(e) {
                switch(String(e).toLowerCase()){
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false;
                }
            };
            Buffer.concat = function concat(e, r) {
                if (!Array.isArray(e)) {
                    throw new TypeError('"list" argument must be an Array of Buffers');
                }
                if (e.length === 0) {
                    return Buffer.alloc(0);
                }
                var t;
                if (r === undefined) {
                    r = 0;
                    for(t = 0; t < e.length; ++t){
                        r += e[t].length;
                    }
                }
                var f = Buffer.allocUnsafe(r);
                var n = 0;
                for(t = 0; t < e.length; ++t){
                    var i = e[t];
                    if (isInstance(i, Uint8Array)) {
                        i = Buffer.from(i);
                    }
                    if (!Buffer.isBuffer(i)) {
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    }
                    i.copy(f, n);
                    n += i.length;
                }
                return f;
            };
            function byteLength(e, r) {
                if (Buffer.isBuffer(e)) {
                    return e.length;
                }
                if (ArrayBuffer.isView(e) || isInstance(e, ArrayBuffer)) {
                    return e.byteLength;
                }
                if (typeof e !== "string") {
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof e);
                }
                var t = e.length;
                var f = arguments.length > 2 && arguments[2] === true;
                if (!f && t === 0) return 0;
                var n = false;
                for(;;){
                    switch(r){
                        case "ascii":
                        case "latin1":
                        case "binary":
                            return t;
                        case "utf8":
                        case "utf-8":
                            return utf8ToBytes(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return t * 2;
                        case "hex":
                            return t >>> 1;
                        case "base64":
                            return base64ToBytes(e).length;
                        default:
                            if (n) {
                                return f ? -1 : utf8ToBytes(e).length;
                            }
                            r = ("" + r).toLowerCase();
                            n = true;
                    }
                }
            }
            Buffer.byteLength = byteLength;
            function slowToString(e, r, t) {
                var f = false;
                if (r === undefined || r < 0) {
                    r = 0;
                }
                if (r > this.length) {
                    return "";
                }
                if (t === undefined || t > this.length) {
                    t = this.length;
                }
                if (t <= 0) {
                    return "";
                }
                t >>>= 0;
                r >>>= 0;
                if (t <= r) {
                    return "";
                }
                if (!e) e = "utf8";
                while(true){
                    switch(e){
                        case "hex":
                            return hexSlice(this, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Slice(this, r, t);
                        case "ascii":
                            return asciiSlice(this, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Slice(this, r, t);
                        case "base64":
                            return base64Slice(this, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return utf16leSlice(this, r, t);
                        default:
                            if (f) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            f = true;
                    }
                }
            }
            Buffer.prototype._isBuffer = true;
            function swap(e, r, t) {
                var f = e[r];
                e[r] = e[t];
                e[t] = f;
            }
            Buffer.prototype.swap16 = function swap16() {
                var e = this.length;
                if (e % 2 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                }
                for(var r = 0; r < e; r += 2){
                    swap(this, r, r + 1);
                }
                return this;
            };
            Buffer.prototype.swap32 = function swap32() {
                var e = this.length;
                if (e % 4 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                }
                for(var r = 0; r < e; r += 4){
                    swap(this, r, r + 3);
                    swap(this, r + 1, r + 2);
                }
                return this;
            };
            Buffer.prototype.swap64 = function swap64() {
                var e = this.length;
                if (e % 8 !== 0) {
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                }
                for(var r = 0; r < e; r += 8){
                    swap(this, r, r + 7);
                    swap(this, r + 1, r + 6);
                    swap(this, r + 2, r + 5);
                    swap(this, r + 3, r + 4);
                }
                return this;
            };
            Buffer.prototype.toString = function toString() {
                var e = this.length;
                if (e === 0) return "";
                if (arguments.length === 0) return utf8Slice(this, 0, e);
                return slowToString.apply(this, arguments);
            };
            Buffer.prototype.toLocaleString = Buffer.prototype.toString;
            Buffer.prototype.equals = function equals(e) {
                if (!Buffer.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return true;
                return Buffer.compare(this, e) === 0;
            };
            Buffer.prototype.inspect = function inspect() {
                var e = "";
                var t = r.INSPECT_MAX_BYTES;
                e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
                if (this.length > t) e += " ... ";
                return "<Buffer " + e + ">";
            };
            if (i) {
                Buffer.prototype[i] = Buffer.prototype.inspect;
            }
            Buffer.prototype.compare = function compare(e, r, t, f, n) {
                if (isInstance(e, Uint8Array)) {
                    e = Buffer.from(e, e.offset, e.byteLength);
                }
                if (!Buffer.isBuffer(e)) {
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof e);
                }
                if (r === undefined) {
                    r = 0;
                }
                if (t === undefined) {
                    t = e ? e.length : 0;
                }
                if (f === undefined) {
                    f = 0;
                }
                if (n === undefined) {
                    n = this.length;
                }
                if (r < 0 || t > e.length || f < 0 || n > this.length) {
                    throw new RangeError("out of range index");
                }
                if (f >= n && r >= t) {
                    return 0;
                }
                if (f >= n) {
                    return -1;
                }
                if (r >= t) {
                    return 1;
                }
                r >>>= 0;
                t >>>= 0;
                f >>>= 0;
                n >>>= 0;
                if (this === e) return 0;
                var i = n - f;
                var o = t - r;
                var u = Math.min(i, o);
                var a = this.slice(f, n);
                var s = e.slice(r, t);
                for(var h = 0; h < u; ++h){
                    if (a[h] !== s[h]) {
                        i = a[h];
                        o = s[h];
                        break;
                    }
                }
                if (i < o) return -1;
                if (o < i) return 1;
                return 0;
            };
            function bidirectionalIndexOf(e, r, t, f, n) {
                if (e.length === 0) return -1;
                if (typeof t === "string") {
                    f = t;
                    t = 0;
                } else if (t > 2147483647) {
                    t = 2147483647;
                } else if (t < -2147483648) {
                    t = -2147483648;
                }
                t = +t;
                if (numberIsNaN(t)) {
                    t = n ? 0 : e.length - 1;
                }
                if (t < 0) t = e.length + t;
                if (t >= e.length) {
                    if (n) return -1;
                    else t = e.length - 1;
                } else if (t < 0) {
                    if (n) t = 0;
                    else return -1;
                }
                if (typeof r === "string") {
                    r = Buffer.from(r, f);
                }
                if (Buffer.isBuffer(r)) {
                    if (r.length === 0) {
                        return -1;
                    }
                    return arrayIndexOf(e, r, t, f, n);
                } else if (typeof r === "number") {
                    r = r & 255;
                    if (typeof Uint8Array.prototype.indexOf === "function") {
                        if (n) {
                            return Uint8Array.prototype.indexOf.call(e, r, t);
                        } else {
                            return Uint8Array.prototype.lastIndexOf.call(e, r, t);
                        }
                    }
                    return arrayIndexOf(e, [
                        r
                    ], t, f, n);
                }
                throw new TypeError("val must be string, number or Buffer");
            }
            function arrayIndexOf(e, r, t, f, n) {
                var i = 1;
                var o = e.length;
                var u = r.length;
                if (f !== undefined) {
                    f = String(f).toLowerCase();
                    if (f === "ucs2" || f === "ucs-2" || f === "utf16le" || f === "utf-16le") {
                        if (e.length < 2 || r.length < 2) {
                            return -1;
                        }
                        i = 2;
                        o /= 2;
                        u /= 2;
                        t /= 2;
                    }
                }
                function read(e, r) {
                    if (i === 1) {
                        return e[r];
                    } else {
                        return e.readUInt16BE(r * i);
                    }
                }
                var a;
                if (n) {
                    var s = -1;
                    for(a = t; a < o; a++){
                        if (read(e, a) === read(r, s === -1 ? 0 : a - s)) {
                            if (s === -1) s = a;
                            if (a - s + 1 === u) return s * i;
                        } else {
                            if (s !== -1) a -= a - s;
                            s = -1;
                        }
                    }
                } else {
                    if (t + u > o) t = o - u;
                    for(a = t; a >= 0; a--){
                        var h = true;
                        for(var c = 0; c < u; c++){
                            if (read(e, a + c) !== read(r, c)) {
                                h = false;
                                break;
                            }
                        }
                        if (h) return a;
                    }
                }
                return -1;
            }
            Buffer.prototype.includes = function includes(e, r, t) {
                return this.indexOf(e, r, t) !== -1;
            };
            Buffer.prototype.indexOf = function indexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, true);
            };
            Buffer.prototype.lastIndexOf = function lastIndexOf(e, r, t) {
                return bidirectionalIndexOf(this, e, r, t, false);
            };
            function hexWrite(e, r, t, f) {
                t = Number(t) || 0;
                var n = e.length - t;
                if (!f) {
                    f = n;
                } else {
                    f = Number(f);
                    if (f > n) {
                        f = n;
                    }
                }
                var i = r.length;
                if (f > i / 2) {
                    f = i / 2;
                }
                for(var o = 0; o < f; ++o){
                    var u = parseInt(r.substr(o * 2, 2), 16);
                    if (numberIsNaN(u)) return o;
                    e[t + o] = u;
                }
                return o;
            }
            function utf8Write(e, r, t, f) {
                return blitBuffer(utf8ToBytes(r, e.length - t), e, t, f);
            }
            function asciiWrite(e, r, t, f) {
                return blitBuffer(asciiToBytes(r), e, t, f);
            }
            function latin1Write(e, r, t, f) {
                return asciiWrite(e, r, t, f);
            }
            function base64Write(e, r, t, f) {
                return blitBuffer(base64ToBytes(r), e, t, f);
            }
            function ucs2Write(e, r, t, f) {
                return blitBuffer(utf16leToBytes(r, e.length - t), e, t, f);
            }
            Buffer.prototype.write = function write(e, r, t, f) {
                if (r === undefined) {
                    f = "utf8";
                    t = this.length;
                    r = 0;
                } else if (t === undefined && typeof r === "string") {
                    f = r;
                    t = this.length;
                    r = 0;
                } else if (isFinite(r)) {
                    r = r >>> 0;
                    if (isFinite(t)) {
                        t = t >>> 0;
                        if (f === undefined) f = "utf8";
                    } else {
                        f = t;
                        t = undefined;
                    }
                } else {
                    throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                }
                var n = this.length - r;
                if (t === undefined || t > n) t = n;
                if (e.length > 0 && (t < 0 || r < 0) || r > this.length) {
                    throw new RangeError("Attempt to write outside buffer bounds");
                }
                if (!f) f = "utf8";
                var i = false;
                for(;;){
                    switch(f){
                        case "hex":
                            return hexWrite(this, e, r, t);
                        case "utf8":
                        case "utf-8":
                            return utf8Write(this, e, r, t);
                        case "ascii":
                            return asciiWrite(this, e, r, t);
                        case "latin1":
                        case "binary":
                            return latin1Write(this, e, r, t);
                        case "base64":
                            return base64Write(this, e, r, t);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return ucs2Write(this, e, r, t);
                        default:
                            if (i) throw new TypeError("Unknown encoding: " + f);
                            f = ("" + f).toLowerCase();
                            i = true;
                    }
                }
            };
            Buffer.prototype.toJSON = function toJSON() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function base64Slice(e, r, t) {
                if (r === 0 && t === e.length) {
                    return f.fromByteArray(e);
                } else {
                    return f.fromByteArray(e.slice(r, t));
                }
            }
            function utf8Slice(e, r, t) {
                t = Math.min(e.length, t);
                var f = [];
                var n = r;
                while(n < t){
                    var i = e[n];
                    var o = null;
                    var u = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
                    if (n + u <= t) {
                        var a, s, h, c;
                        switch(u){
                            case 1:
                                if (i < 128) {
                                    o = i;
                                }
                                break;
                            case 2:
                                a = e[n + 1];
                                if ((a & 192) === 128) {
                                    c = (i & 31) << 6 | a & 63;
                                    if (c > 127) {
                                        o = c;
                                    }
                                }
                                break;
                            case 3:
                                a = e[n + 1];
                                s = e[n + 2];
                                if ((a & 192) === 128 && (s & 192) === 128) {
                                    c = (i & 15) << 12 | (a & 63) << 6 | s & 63;
                                    if (c > 2047 && (c < 55296 || c > 57343)) {
                                        o = c;
                                    }
                                }
                                break;
                            case 4:
                                a = e[n + 1];
                                s = e[n + 2];
                                h = e[n + 3];
                                if ((a & 192) === 128 && (s & 192) === 128 && (h & 192) === 128) {
                                    c = (i & 15) << 18 | (a & 63) << 12 | (s & 63) << 6 | h & 63;
                                    if (c > 65535 && c < 1114112) {
                                        o = c;
                                    }
                                }
                        }
                    }
                    if (o === null) {
                        o = 65533;
                        u = 1;
                    } else if (o > 65535) {
                        o -= 65536;
                        f.push(o >>> 10 & 1023 | 55296);
                        o = 56320 | o & 1023;
                    }
                    f.push(o);
                    n += u;
                }
                return decodeCodePointsArray(f);
            }
            var u = 4096;
            function decodeCodePointsArray(e) {
                var r = e.length;
                if (r <= u) {
                    return String.fromCharCode.apply(String, e);
                }
                var t = "";
                var f = 0;
                while(f < r){
                    t += String.fromCharCode.apply(String, e.slice(f, f += u));
                }
                return t;
            }
            function asciiSlice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n] & 127);
                }
                return f;
            }
            function latin1Slice(e, r, t) {
                var f = "";
                t = Math.min(e.length, t);
                for(var n = r; n < t; ++n){
                    f += String.fromCharCode(e[n]);
                }
                return f;
            }
            function hexSlice(e, r, t) {
                var f = e.length;
                if (!r || r < 0) r = 0;
                if (!t || t < 0 || t > f) t = f;
                var n = "";
                for(var i = r; i < t; ++i){
                    n += s[e[i]];
                }
                return n;
            }
            function utf16leSlice(e, r, t) {
                var f = e.slice(r, t);
                var n = "";
                for(var i = 0; i < f.length; i += 2){
                    n += String.fromCharCode(f[i] + f[i + 1] * 256);
                }
                return n;
            }
            Buffer.prototype.slice = function slice(e, r) {
                var t = this.length;
                e = ~~e;
                r = r === undefined ? t : ~~r;
                if (e < 0) {
                    e += t;
                    if (e < 0) e = 0;
                } else if (e > t) {
                    e = t;
                }
                if (r < 0) {
                    r += t;
                    if (r < 0) r = 0;
                } else if (r > t) {
                    r = t;
                }
                if (r < e) r = e;
                var f = this.subarray(e, r);
                Object.setPrototypeOf(f, Buffer.prototype);
                return f;
            };
            function checkOffset(e, r, t) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + r > t) throw new RangeError("Trying to access beyond buffer length");
            }
            Buffer.prototype.readUIntLE = function readUIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                return f;
            };
            Buffer.prototype.readUIntBE = function readUIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) {
                    checkOffset(e, r, this.length);
                }
                var f = this[e + --r];
                var n = 1;
                while(r > 0 && (n *= 256)){
                    f += this[e + --r] * n;
                }
                return f;
            };
            Buffer.prototype.readUInt8 = function readUInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                return this[e];
            };
            Buffer.prototype.readUInt16LE = function readUInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] | this[e + 1] << 8;
            };
            Buffer.prototype.readUInt16BE = function readUInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                return this[e] << 8 | this[e + 1];
            };
            Buffer.prototype.readUInt32LE = function readUInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
            };
            Buffer.prototype.readUInt32BE = function readUInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
            };
            Buffer.prototype.readIntLE = function readIntLE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = this[e];
                var n = 1;
                var i = 0;
                while(++i < r && (n *= 256)){
                    f += this[e + i] * n;
                }
                n *= 128;
                if (f >= n) f -= Math.pow(2, 8 * r);
                return f;
            };
            Buffer.prototype.readIntBE = function readIntBE(e, r, t) {
                e = e >>> 0;
                r = r >>> 0;
                if (!t) checkOffset(e, r, this.length);
                var f = r;
                var n = 1;
                var i = this[e + --f];
                while(f > 0 && (n *= 256)){
                    i += this[e + --f] * n;
                }
                n *= 128;
                if (i >= n) i -= Math.pow(2, 8 * r);
                return i;
            };
            Buffer.prototype.readInt8 = function readInt8(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 1, this.length);
                if (!(this[e] & 128)) return this[e];
                return (255 - this[e] + 1) * -1;
            };
            Buffer.prototype.readInt16LE = function readInt16LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e] | this[e + 1] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt16BE = function readInt16BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 2, this.length);
                var t = this[e + 1] | this[e] << 8;
                return t & 32768 ? t | 4294901760 : t;
            };
            Buffer.prototype.readInt32LE = function readInt32LE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
            };
            Buffer.prototype.readInt32BE = function readInt32BE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
            };
            Buffer.prototype.readFloatLE = function readFloatLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, true, 23, 4);
            };
            Buffer.prototype.readFloatBE = function readFloatBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 4, this.length);
                return n.read(this, e, false, 23, 4);
            };
            Buffer.prototype.readDoubleLE = function readDoubleLE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, true, 52, 8);
            };
            Buffer.prototype.readDoubleBE = function readDoubleBE(e, r) {
                e = e >>> 0;
                if (!r) checkOffset(e, 8, this.length);
                return n.read(this, e, false, 52, 8);
            };
            function checkInt(e, r, t, f, n, i) {
                if (!Buffer.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (r > n || r < i) throw new RangeError('"value" argument is out of bounds');
                if (t + f > e.length) throw new RangeError("Index out of range");
            }
            Buffer.prototype.writeUIntLE = function writeUIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = 1;
                var o = 0;
                this[r] = e & 255;
                while(++o < t && (i *= 256)){
                    this[r + o] = e / i & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUIntBE = function writeUIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                t = t >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t) - 1;
                    checkInt(this, e, r, t, n, 0);
                }
                var i = t - 1;
                var o = 1;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    this[r + i] = e / o & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeUInt8 = function writeUInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 255, 0);
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeUInt16LE = function writeUInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeUInt16BE = function writeUInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 65535, 0);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeUInt32LE = function writeUInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r + 3] = e >>> 24;
                this[r + 2] = e >>> 16;
                this[r + 1] = e >>> 8;
                this[r] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeUInt32BE = function writeUInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 4294967295, 0);
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            Buffer.prototype.writeIntLE = function writeIntLE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = 0;
                var o = 1;
                var u = 0;
                this[r] = e & 255;
                while(++i < t && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i - 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeIntBE = function writeIntBE(e, r, t, f) {
                e = +e;
                r = r >>> 0;
                if (!f) {
                    var n = Math.pow(2, 8 * t - 1);
                    checkInt(this, e, r, t, n - 1, -n);
                }
                var i = t - 1;
                var o = 1;
                var u = 0;
                this[r + i] = e & 255;
                while(--i >= 0 && (o *= 256)){
                    if (e < 0 && u === 0 && this[r + i + 1] !== 0) {
                        u = 1;
                    }
                    this[r + i] = (e / o >> 0) - u & 255;
                }
                return r + t;
            };
            Buffer.prototype.writeInt8 = function writeInt8(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 1, 127, -128);
                if (e < 0) e = 255 + e + 1;
                this[r] = e & 255;
                return r + 1;
            };
            Buffer.prototype.writeInt16LE = function writeInt16LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                return r + 2;
            };
            Buffer.prototype.writeInt16BE = function writeInt16BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 2, 32767, -32768);
                this[r] = e >>> 8;
                this[r + 1] = e & 255;
                return r + 2;
            };
            Buffer.prototype.writeInt32LE = function writeInt32LE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                this[r] = e & 255;
                this[r + 1] = e >>> 8;
                this[r + 2] = e >>> 16;
                this[r + 3] = e >>> 24;
                return r + 4;
            };
            Buffer.prototype.writeInt32BE = function writeInt32BE(e, r, t) {
                e = +e;
                r = r >>> 0;
                if (!t) checkInt(this, e, r, 4, 2147483647, -2147483648);
                if (e < 0) e = 4294967295 + e + 1;
                this[r] = e >>> 24;
                this[r + 1] = e >>> 16;
                this[r + 2] = e >>> 8;
                this[r + 3] = e & 255;
                return r + 4;
            };
            function checkIEEE754(e, r, t, f, n, i) {
                if (t + f > e.length) throw new RangeError("Index out of range");
                if (t < 0) throw new RangeError("Index out of range");
            }
            function writeFloat(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 4, 34028234663852886e22, -34028234663852886e22);
                }
                n.write(e, r, t, f, 23, 4);
                return t + 4;
            }
            Buffer.prototype.writeFloatLE = function writeFloatLE(e, r, t) {
                return writeFloat(this, e, r, true, t);
            };
            Buffer.prototype.writeFloatBE = function writeFloatBE(e, r, t) {
                return writeFloat(this, e, r, false, t);
            };
            function writeDouble(e, r, t, f, i) {
                r = +r;
                t = t >>> 0;
                if (!i) {
                    checkIEEE754(e, r, t, 8, 17976931348623157e292, -17976931348623157e292);
                }
                n.write(e, r, t, f, 52, 8);
                return t + 8;
            }
            Buffer.prototype.writeDoubleLE = function writeDoubleLE(e, r, t) {
                return writeDouble(this, e, r, true, t);
            };
            Buffer.prototype.writeDoubleBE = function writeDoubleBE(e, r, t) {
                return writeDouble(this, e, r, false, t);
            };
            Buffer.prototype.copy = function copy(e, r, t, f) {
                if (!Buffer.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (!t) t = 0;
                if (!f && f !== 0) f = this.length;
                if (r >= e.length) r = e.length;
                if (!r) r = 0;
                if (f > 0 && f < t) f = t;
                if (f === t) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (r < 0) {
                    throw new RangeError("targetStart out of bounds");
                }
                if (t < 0 || t >= this.length) throw new RangeError("Index out of range");
                if (f < 0) throw new RangeError("sourceEnd out of bounds");
                if (f > this.length) f = this.length;
                if (e.length - r < f - t) {
                    f = e.length - r + t;
                }
                var n = f - t;
                if (this === e && typeof Uint8Array.prototype.copyWithin === "function") {
                    this.copyWithin(r, t, f);
                } else if (this === e && t < r && r < f) {
                    for(var i = n - 1; i >= 0; --i){
                        e[i + r] = this[i + t];
                    }
                } else {
                    Uint8Array.prototype.set.call(e, this.subarray(t, f), r);
                }
                return n;
            };
            Buffer.prototype.fill = function fill(e, r, t, f) {
                if (typeof e === "string") {
                    if (typeof r === "string") {
                        f = r;
                        r = 0;
                        t = this.length;
                    } else if (typeof t === "string") {
                        f = t;
                        t = this.length;
                    }
                    if (f !== undefined && typeof f !== "string") {
                        throw new TypeError("encoding must be a string");
                    }
                    if (typeof f === "string" && !Buffer.isEncoding(f)) {
                        throw new TypeError("Unknown encoding: " + f);
                    }
                    if (e.length === 1) {
                        var n = e.charCodeAt(0);
                        if (f === "utf8" && n < 128 || f === "latin1") {
                            e = n;
                        }
                    }
                } else if (typeof e === "number") {
                    e = e & 255;
                } else if (typeof e === "boolean") {
                    e = Number(e);
                }
                if (r < 0 || this.length < r || this.length < t) {
                    throw new RangeError("Out of range index");
                }
                if (t <= r) {
                    return this;
                }
                r = r >>> 0;
                t = t === undefined ? this.length : t >>> 0;
                if (!e) e = 0;
                var i;
                if (typeof e === "number") {
                    for(i = r; i < t; ++i){
                        this[i] = e;
                    }
                } else {
                    var o = Buffer.isBuffer(e) ? e : Buffer.from(e, f);
                    var u = o.length;
                    if (u === 0) {
                        throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    }
                    for(i = 0; i < t - r; ++i){
                        this[i + r] = o[i % u];
                    }
                }
                return this;
            };
            var a = /[^+/0-9A-Za-z-_]/g;
            function base64clean(e) {
                e = e.split("=")[0];
                e = e.trim().replace(a, "");
                if (e.length < 2) return "";
                while(e.length % 4 !== 0){
                    e = e + "=";
                }
                return e;
            }
            function utf8ToBytes(e, r) {
                r = r || Infinity;
                var t;
                var f = e.length;
                var n = null;
                var i = [];
                for(var o = 0; o < f; ++o){
                    t = e.charCodeAt(o);
                    if (t > 55295 && t < 57344) {
                        if (!n) {
                            if (t > 56319) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            } else if (o + 1 === f) {
                                if ((r -= 3) > -1) i.push(239, 191, 189);
                                continue;
                            }
                            n = t;
                            continue;
                        }
                        if (t < 56320) {
                            if ((r -= 3) > -1) i.push(239, 191, 189);
                            n = t;
                            continue;
                        }
                        t = (n - 55296 << 10 | t - 56320) + 65536;
                    } else if (n) {
                        if ((r -= 3) > -1) i.push(239, 191, 189);
                    }
                    n = null;
                    if (t < 128) {
                        if ((r -= 1) < 0) break;
                        i.push(t);
                    } else if (t < 2048) {
                        if ((r -= 2) < 0) break;
                        i.push(t >> 6 | 192, t & 63 | 128);
                    } else if (t < 65536) {
                        if ((r -= 3) < 0) break;
                        i.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
                    } else if (t < 1114112) {
                        if ((r -= 4) < 0) break;
                        i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
                    } else {
                        throw new Error("Invalid code point");
                    }
                }
                return i;
            }
            function asciiToBytes(e) {
                var r = [];
                for(var t = 0; t < e.length; ++t){
                    r.push(e.charCodeAt(t) & 255);
                }
                return r;
            }
            function utf16leToBytes(e, r) {
                var t, f, n;
                var i = [];
                for(var o = 0; o < e.length; ++o){
                    if ((r -= 2) < 0) break;
                    t = e.charCodeAt(o);
                    f = t >> 8;
                    n = t % 256;
                    i.push(n);
                    i.push(f);
                }
                return i;
            }
            function base64ToBytes(e) {
                return f.toByteArray(base64clean(e));
            }
            function blitBuffer(e, r, t, f) {
                for(var n = 0; n < f; ++n){
                    if (n + t >= r.length || n >= e.length) break;
                    r[n + t] = e[n];
                }
                return n;
            }
            function isInstance(e, r) {
                return e instanceof r || e != null && e.constructor != null && e.constructor.name != null && e.constructor.name === r.name;
            }
            function numberIsNaN(e) {
                return e !== e;
            }
            var s = function() {
                var e = "0123456789abcdef";
                var r = new Array(256);
                for(var t = 0; t < 16; ++t){
                    var f = t * 16;
                    for(var n = 0; n < 16; ++n){
                        r[f + n] = e[t] + e[n];
                    }
                }
                return r;
            }();
        },
        783: function(e, r) {
            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ r.read = function(e, r, t, f, n) {
                var i, o;
                var u = n * 8 - f - 1;
                var a = (1 << u) - 1;
                var s = a >> 1;
                var h = -7;
                var c = t ? n - 1 : 0;
                var l = t ? -1 : 1;
                var p = e[r + c];
                c += l;
                i = p & (1 << -h) - 1;
                p >>= -h;
                h += u;
                for(; h > 0; i = i * 256 + e[r + c], c += l, h -= 8){}
                o = i & (1 << -h) - 1;
                i >>= -h;
                h += f;
                for(; h > 0; o = o * 256 + e[r + c], c += l, h -= 8){}
                if (i === 0) {
                    i = 1 - s;
                } else if (i === a) {
                    return o ? NaN : (p ? -1 : 1) * Infinity;
                } else {
                    o = o + Math.pow(2, f);
                    i = i - s;
                }
                return (p ? -1 : 1) * o * Math.pow(2, i - f);
            };
            r.write = function(e, r, t, f, n, i) {
                var o, u, a;
                var s = i * 8 - n - 1;
                var h = (1 << s) - 1;
                var c = h >> 1;
                var l = n === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var p = f ? 0 : i - 1;
                var y = f ? 1 : -1;
                var g = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
                r = Math.abs(r);
                if (isNaN(r) || r === Infinity) {
                    u = isNaN(r) ? 1 : 0;
                    o = h;
                } else {
                    o = Math.floor(Math.log(r) / Math.LN2);
                    if (r * (a = Math.pow(2, -o)) < 1) {
                        o--;
                        a *= 2;
                    }
                    if (o + c >= 1) {
                        r += l / a;
                    } else {
                        r += l * Math.pow(2, 1 - c);
                    }
                    if (r * a >= 2) {
                        o++;
                        a /= 2;
                    }
                    if (o + c >= h) {
                        u = 0;
                        o = h;
                    } else if (o + c >= 1) {
                        u = (r * a - 1) * Math.pow(2, n);
                        o = o + c;
                    } else {
                        u = r * Math.pow(2, c - 1) * Math.pow(2, n);
                        o = 0;
                    }
                }
                for(; n >= 8; e[t + p] = u & 255, p += y, u /= 256, n -= 8){}
                o = o << n | u;
                s += n;
                for(; s > 0; e[t + p] = o & 255, p += y, o /= 256, s -= 8){}
                e[t + p - y] |= g * 128;
            };
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var f = r[t];
        if (f !== undefined) {
            return f.exports;
        }
        var n = r[t] = {
            exports: {}
        };
        var i = true;
        try {
            e[t](n, n.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete r[t];
        }
        return n.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/node_modules/next/dist/compiled/buffer") + "/";
    var t = __nccwpck_require__(72);
    module.exports = t;
})();
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_9d226ebe._.js.map