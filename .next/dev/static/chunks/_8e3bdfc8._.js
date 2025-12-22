(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/seed_attachments.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "seedAttachments",
    ()=>seedAttachments
]);
(()=>{
    const e = new Error("Cannot find module './lib/data'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const seedAttachments = ()=>{
    const convo = DB.conversations.find((c)=>c.type === 'dm');
    if (!convo) return console.log('No DM found to seed');
    console.log('Seeding attachments to conversation:', convo.id);
    // 1. Image Message
    DB.messages.push({
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
    DB.messages.push({
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/data'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
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
function AppProvider({ children }) {
    _s();
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [originalSession, setOriginalSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // Superadmin backup
    const [currentTenantId, setCurrentTenantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSuperAdmin, setIsSuperAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [forceUpdate, setForceUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [unreadChatCount, setUnreadChatCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const currentTenant = currentTenantId ? DB.tenants.find((t)=>t.id === currentTenantId) || null : null;
    // 1. Persistence: Load from LocalStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const storedUser = localStorage.getItem('m360_user');
                const storedTenantId = localStorage.getItem('m360_tenant_id');
                const storedIsSuperAdmin = localStorage.getItem('m360_is_super_admin');
                const storedOriginalSession = localStorage.getItem('m360_original_session');
                if (storedUser) setCurrentUser(JSON.parse(storedUser));
                if (storedTenantId) setCurrentTenantId(storedTenantId);
                if (storedIsSuperAdmin) setIsSuperAdmin(storedIsSuperAdmin === 'true');
                if (storedOriginalSession) setOriginalSession(JSON.parse(storedOriginalSession));
                const storedSidebar = localStorage.getItem('m360_sidebar_collapsed');
                if (storedSidebar) setIsSidebarCollapsed(storedSidebar === 'true');
            }
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
                localStorage.setItem('m360_sidebar_collapsed', isSidebarCollapsed.toString());
            }
        }
    }["AppProvider.useEffect"], [
        currentUser,
        currentTenantId,
        isSuperAdmin,
        originalSession,
        isSidebarCollapsed
    ]);
    // 3. Unread Chat Count Logic
    const refreshUnreadCount = async ()=>{
        if (!currentUser || !currentTenantId) {
            setUnreadChatCount(0);
            return;
        }
        try {
            const { ChatService } = await (()=>{
                const e = new Error("Cannot find module '@/lib/services/chatService'");
                e.code = 'MODULE_NOT_FOUND';
                throw e;
            })();
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
            // Case C: Super Admin on Tenant Domain (without Impersonation) -> Invalid
            if (subdomain && isSuperAdmin && !currentTenantId) {
                // If I am strictly Super Admin (no tenant context) but on a subdomain, 
                // ideally I should be redirected to main, or allowed to login as tenant admin.
                // For now, warn but maybe don't kill session to prevent loops during dev.
                console.warn('Security: Super Admin detected on Tenant Domain.');
            // logout(); // Disabled for smoother dev experience
            }
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
            DB.platformAudit.unshift({
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
                user = DB.users.find((u)=>u.tenantId === tenantId && u.email?.toLowerCase() === email.toLowerCase());
            }
            // 2. Fallback to Role-based simulation
            if (!user) {
                user = DB.users.find((u)=>u.tenantId === tenantId && (role === 'admin' ? u.level === 1 : u.level > 1));
            }
            if (user) {
                if (user.status === 'SUSPENDED') {
                    if ("TURBOPACK compile-time truthy", 1) alert('Access Denied: Your account has been suspended.');
                    // Audit Log (Failed)
                    DB.platformAudit.unshift({
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
                DB.platformAudit.unshift({
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
        const targetUser = DB.users.find((u)=>u.id === userId && u.tenantId === tenantId);
        if (targetUser) {
            console.log(`Starting impersonation of ${targetUser.email} by ${currentUser.email}`);
            setOriginalSession(currentUser);
            setCurrentUser(targetUser);
            setCurrentTenantId(tenantId);
            setIsSuperAdmin(false); // Temporarily act as regular user
            router.push('/dashboard');
            // Audit Log
            DB.platformAudit.unshift({
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
            DB.platformAudit.unshift({
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
            const dbIdx = DB.users.findIndex((u)=>u.id === currentUser.id);
            if (dbIdx >= 0) {
                DB.users[dbIdx] = updated;
                DB.save();
            }
        }
    };
    const createTenant = (data)=>{
        const newId = `T${DB.tenants.length + 1}`;
        const timestamp = new Date().toISOString();
        const newTenant = {
            id: newId,
            name: data.name || 'New Tenant',
            slug: data.slug || `tenant-${newId}`,
            domains: data.domains || [],
            status: 'ACTIVE',
            timezone: data.timezone || 'America/Bogota',
            locale: data.locale || 'es-CO',
            branding: {
                app_title: data.name || 'New Tenant',
                primary_color: '#2563eb',
                accent_color: '#1d4ed8',
                updated_at: timestamp,
                ...data.branding
            },
            policies: {
                max_failed_logins: 3,
                lock_minutes: 15,
                file_max_size_bytes: 10 * 1024 * 1024,
                allowed_mime_types: [
                    'application/pdf'
                ],
                audit_retention_days: 90,
                sso_enabled: false,
                updated_at: timestamp,
                ...data.policies
            },
            roleTemplates: {
                1: Object.values(PERMISSIONS),
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
                5: [
                    'VIEW_ALL_DOCS'
                ],
                6: []
            },
            users: 1,
            storage: '0 GB',
            created_at: timestamp,
            features: data.features || [
                'DASHBOARD',
                'WORKFLOWS',
                'REPOSITORY',
                'CHAT',
                'ANALYTICS'
            ],
            sector: data.sector,
            contactName: data.contactName,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone
        };
        DB.tenants.push(newTenant);
        // Generate Initial Admin
        const adminId = `u-adm-${newId}`;
        const adminEmail = data.contactEmail || `admin@${newTenant.slug}.com`; // Default if not provided
        DB.users.push({
            id: adminId,
            name: data.contactName || `Admin ${newTenant.name}`,
            email: adminEmail,
            role: 'Admin Global',
            level: 1,
            tenantId: newId,
            unit: 'Root',
            initials: 'AD',
            bio: 'Initial Admin',
            phone: data.contactPhone || '',
            location: 'Main',
            jobTitle: 'Administrator',
            language: newTenant.locale,
            timezone: newTenant.timezone,
            status: 'ACTIVE'
        });
        // Email Notification to Admin
        DB.emailOutbox.unshift({
            id: `email-${Date.now()}`,
            to: adminEmail,
            subject: 'Bienvenido a Maturity360 - Credenciales de Acceso',
            body: `Hola ${data.contactName || 'Admin'},\n\nTu organización ${newTenant.name} ha sido registrada exitosamente.\n\nTus credenciales de acceso son:\nURL: https://maturity360.com/login\nUsuario: ${adminEmail}\nContraseña Temporal: Temp123!`,
            status: 'SENT',
            sentAt: timestamp
        });
        // Audit Log
        DB.platformAudit.unshift({
            id: `audit-${Date.now()}`,
            event_type: 'TENANT_CREATED',
            actor_id: currentUser?.id || 'system',
            actor_name: currentUser?.name || 'System',
            target_tenant_id: newId,
            metadata: {
                name: newTenant.name,
                slug: newTenant.slug,
                adminEmail
            },
            ip: '127.0.0.1',
            created_at: new Date().toISOString()
        });
        DB.save();
        console.log('Tenant Created:', newTenant);
        return newTenant;
    };
    const updateTenant = (id, updates)=>{
        const idx = DB.tenants.findIndex((t)=>t.id === id);
        if (idx >= 0) {
            const current = DB.tenants[idx];
            // Audit Log
            const changes = Object.keys(updates).filter((k)=>k !== 'branding' && k !== 'policies');
            if (updates.branding) changes.push('branding');
            if (updates.policies) changes.push('policies');
            DB.platformAudit.unshift({
                id: `audit-${Date.now()}`,
                event_type: updates.status ? `TENANT_${updates.status}` : 'TENANT_UPDATED',
                actor_id: currentUser?.id || 'system',
                actor_name: currentUser?.name || 'System',
                target_tenant_id: id,
                metadata: {
                    changes,
                    updates
                },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
            DB.tenants[idx] = {
                ...current,
                ...updates,
                branding: updates.branding ? {
                    ...current.branding,
                    ...updates.branding
                } : current.branding,
                policies: updates.policies ? {
                    ...current.policies,
                    ...updates.policies
                } : current.policies
            };
            if (currentTenantId === id) {
            // Force re-render if needed (though layout update helps)
            }
            DB.save();
        }
    };
    const deleteTenant = (id)=>{
        const idx = DB.tenants.findIndex((t)=>t.id === id);
        if (idx < 0) return;
        const tenant = DB.tenants[idx];
        // Cascade Delete
        // 1. Users
        for(let i = DB.users.length - 1; i >= 0; i--){
            if (DB.users[i].tenantId === id) DB.users.splice(i, 1);
        }
        // 2. Docs
        for(let i = DB.docs.length - 1; i >= 0; i--){
            if (DB.docs[i].tenantId === id) DB.docs.splice(i, 1);
        }
        // 3. Projects
        for(let i = DB.projects.length - 1; i >= 0; i--){
            if (DB.projects[i].tenantId === id) DB.projects.splice(i, 1);
        }
        // 4. Posts
        for(let i = DB.posts.length - 1; i >= 0; i--){
            if (DB.posts[i].tenantId === id) DB.posts.splice(i, 1);
        }
        // 5. Workflows
        for(let i = DB.workflowCases.length - 1; i >= 0; i--){
            if (DB.workflowCases[i].tenantId === id) DB.workflowCases.splice(i, 1);
        }
        // Delete Tenant
        DB.tenants.splice(idx, 1);
        // Audit Log
        DB.platformAudit.unshift({
            id: `audit-${Date.now()}`,
            event_type: 'TENANT_DELETED',
            actor_id: currentUser?.id || 'system',
            actor_name: currentUser?.name || 'System',
            target_tenant_id: id,
            metadata: {
                name: tenant.name,
                slug: tenant.slug
            },
            ip: '127.0.0.1',
            created_at: new Date().toISOString()
        });
        setForceUpdate((n)=>n + 1);
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
        DB.units.push(newUnit);
        DB.save();
    };
    const updateUnit = (id, updates)=>{
        const idx = DB.units.findIndex((u)=>u.id === id);
        if (idx >= 0) {
            DB.units[idx] = {
                ...DB.units[idx],
                ...updates
            };
            DB.save();
        }
    };
    const deleteUnit = (id)=>{
        const idx = DB.units.findIndex((u)=>u.id === id);
        if (idx >= 0) {
            DB.units.splice(idx, 1);
        }
    };
    const updateLevelPermissions = (level, permissions)=>{
        if (!currentTenant) return;
        // Update in DB (in memory reference)
        // Since currentTenant is a reference to DB object (if retrieved via find), modifying it updates DB?
        // Let's modify DB directly to be safe
        const idx = DB.tenants.findIndex((t)=>t.id === currentTenantId);
        if (idx >= 0) {
            const tenant = DB.tenants[idx];
            tenant.roleTemplates = {
                ...tenant.roleTemplates,
                [level]: permissions
            };
        // Force re-render not needed immediately as we don't display permissions in sidebar yet,
        // but page will use it.
        }
    };
    const adminCheckEmailUnique = (email)=>{
        return !DB.users.some((u)=>u.email?.toLowerCase() === email.toLowerCase());
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
        DB.users.push(newUser);
        // Audit Log
        DB.platformAudit.unshift({
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
        DB.save();
        // Email Notification
        if (options.sendNotification && newUser.email) {
            DB.emailOutbox.unshift({
                id: `email-${Date.now()}`,
                to: newUser.email,
                subject: `Bienvenido a Maturity360 - ${newUser.tenantId !== 'global' ? 'Tenant Invitation' : 'Platform Access'}`,
                body: `Hola ${newUser.name},\n\nTu cuenta ha sido creada. Tu contraseña temporal es: Temp123!\nIngresa en: https://${newUser.tenantId}.maturity360.com`,
                status: 'SENT',
                sentAt: new Date().toISOString()
            });
            console.log(`[MockEmail] Sent to ${newUser.email}`);
        }
    };
    const adminUpdateUser = (userId, updates)=>{
        const idx = DB.users.findIndex((u)=>u.id === userId);
        if (idx >= 0) {
            const oldUser = DB.users[idx];
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
                DB.platformAudit.unshift({
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
            DB.users[idx] = {
                ...oldUser,
                ...updates
            };
            DB.save();
        }
    };
    const adminDeleteUser = (userId)=>{
        const idx = DB.users.findIndex((u)=>u.id === userId);
        if (idx >= 0) {
            const user = DB.users[idx];
            // Integrity Check: Prevent deleting last admin
            if (user.level === 1 && user.status !== 'DELETED') {
                const otherAdmins = DB.users.filter((u)=>u.tenantId === user.tenantId && u.level === 1 && u.id !== userId && u.status === 'ACTIVE');
                if (otherAdmins.length === 0) {
                    if ("TURBOPACK compile-time truthy", 1) alert('Integrity Error: Cannot delete the last active Admin for this tenant.');
                    return;
                }
            }
            // Soft Delete
            const oldStatus = user.status;
            DB.users[idx] = {
                ...user,
                status: 'DELETED'
            };
            // Audit
            DB.platformAudit.unshift({
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
        const idx = DB.users.findIndex((u)=>u.id === userId);
        if (idx >= 0) {
            const user = DB.users[idx];
            // Update invite data
            const updated = {
                ...user,
                inviteSentAt: new Date().toISOString(),
                inviteExpiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString()
            };
            DB.users[idx] = updated;
            // Email Log
            if (user.email) {
                DB.emailOutbox.unshift({
                    id: `email-${Date.now()}`,
                    to: user.email,
                    subject: `Resend: Bienvenido a Maturity360`,
                    body: `Hola ${user.name},\n\nAqui tienes tu enlace de acceso: https://${user.tenantId}.maturity360.com\nCredenciales temporales: Temp123!`,
                    status: 'SENT',
                    sentAt: new Date().toISOString()
                });
            }
            // Audit
            DB.platformAudit.unshift({
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
            DB.save();
        }
    };
    const adminDeletePost = (id)=>{
        const idx = DB.posts.findIndex((p)=>p.id === id);
        if (idx !== -1) {
            DB.posts.splice(idx, 1);
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const adminCreatePost = (postData)=>{
        const newPost = {
            id: `P-${currentTenantId}-${Date.now()}`,
            date: 'Ahora',
            likes: 0,
            comments: 0,
            ...postData
        };
        DB.posts.unshift(newPost);
        DB.save();
        setForceUpdate((n)=>n + 1);
    };
    const adminUpdatePost = (id, updates)=>{
        const post = DB.posts.find((p)=>p.id === id);
        if (post) {
            Object.assign(post, updates);
            DB.save();
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
        DB.workflowDefinitions.unshift(newWorkflow);
        DB.save();
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
        DB.projectFolders.push(newFolder);
        DB.save();
        setForceUpdate((n)=>n + 1);
    };
    const createRepoFolder = (data)=>{
        if (!currentTenantId) return;
        const newFolder = {
            id: `RF-${currentTenantId}-${Date.now()}`,
            tenantId: currentTenantId,
            name: data.name || 'Nueva Carpeta',
            description: data.description,
            parentId: data.parentId || null,
            level: data.level || 1,
            unit: data.unit || 'General',
            process: data.process,
            color: data.color || '#3b82f6',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        DB.repoFolders.push(newFolder);
        DB.save();
        setForceUpdate((n)=>n + 1);
    };
    const updateRepoFolder = (id, updates)=>{
        const idx = DB.repoFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            DB.repoFolders[idx] = {
                ...DB.repoFolders[idx],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteRepoFolder = (id)=>{
        const idx = DB.repoFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            DB.repoFolders.splice(idx, 1);
            DB.save();
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
        DB.docs.unshift(newDoc);
        DB.save();
        setForceUpdate((n)=>n + 1);
    };
    const updateDoc = (id, updates)=>{
        const doc = DB.docs.find((d)=>d.id === id);
        if (doc) {
            Object.assign(doc, updates);
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteDoc = (id)=>{
        const idx = DB.docs.findIndex((d)=>d.id === id);
        if (idx >= 0) {
            DB.docs.splice(idx, 1);
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const toggleDocLike = (docId)=>{
        const doc = DB.docs.find((d)=>d.id === docId);
        if (doc) {
            if (doc.likes > 0) {
                doc.likes--;
            } else {
                doc.likes++;
            }
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const addDocComment = (docId, content)=>{
        if (!DB.publicComments[docId]) DB.publicComments[docId] = [];
        DB.publicComments[docId].unshift({
            id: `c-${Date.now()}`,
            userId: currentUser?.id || 'anon',
            userName: currentUser?.name || 'Anónimo',
            content: content,
            date: 'Ahora',
            likes: 0
        });
        const doc = DB.docs.find((d)=>d.id === docId);
        if (doc) doc.commentsCount = (doc.commentsCount || 0) + 1;
        DB.save();
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
        DB.projects.unshift(newProject);
        DB.save();
        setForceUpdate((n)=>n + 1);
    };
    const updateProject = (id, updates)=>{
        const idx = DB.projects.findIndex((p)=>p.id === id);
        if (idx >= 0) {
            DB.projects[idx] = {
                ...DB.projects[idx],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteProject = (id)=>{
        const idx = DB.projects.findIndex((p)=>p.id === id);
        if (idx >= 0) {
            DB.projects.splice(idx, 1);
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const duplicateProject = (id)=>{
        const original = DB.projects.find((p)=>p.id === id);
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
            DB.projects.unshift(newProject);
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const updateProjectFolder = (id, updates)=>{
        const idx = DB.projectFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            DB.projectFolders[idx] = {
                ...DB.projectFolders[idx],
                ...updates
            };
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const deleteProjectFolder = (id)=>{
        const idx = DB.projectFolders.findIndex((f)=>f.id === id);
        if (idx >= 0) {
            DB.projects.forEach((p)=>{
                if (p.folderId === id) delete p.folderId;
            });
            DB.projectFolders.splice(idx, 1);
            DB.save();
            setForceUpdate((n)=>n + 1);
        }
    };
    const toggleSidebar = ()=>setIsSidebarCollapsed((v)=>!v);
    const updatePlatformSettings = (settings)=>{
        Object.assign(DB.platformSettings, settings);
        DB.save();
        setForceUpdate((n)=>n + 1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
            currentUser,
            currentTenantId,
            currentTenant,
            isSuperAdmin,
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
        lineNumber: 1028,
        columnNumber: 9
    }, this);
}
_s(AppProvider, "TtPwDLVH6zbx7EFVNOgSPlBx6Xc=", false, function() {
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
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_8e3bdfc8._.js.map