'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB, User, Tenant, TenantBranding, TenantPolicy, Unit, PERMISSIONS, Post, Doc, Project, ProjectFolder, RepoFolder, WorkflowDefinition, PlatformSettings } from '@/lib/data';
import { seedAttachments } from '@/seed_attachments'; // Import seeder
import { useRouter } from 'next/navigation';

interface AppContextType {
    currentUser: User | null;
    currentTenantId: string | null;
    currentTenant: Tenant | null;
    version: number;
    isSuperAdmin: boolean;
    isHydrated: boolean;
    originalSession: User | null; // For Impersonation
    impersonateUser: (userId: string, tenantId: string) => void;
    stopImpersonation: () => void;
    login: (role: string, tenantId?: string, email?: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    createTenant: (data: Omit<Partial<Tenant>, 'branding' | 'policies'> & { branding?: Partial<TenantBranding>, policies?: Partial<TenantPolicy> }) => void;
    updateTenant: (id: string, updates: Partial<Tenant>) => void;
    deleteTenant: (id: string) => void;
    createUnit: (data: Partial<Unit>) => void;
    updateUnit: (id: string, updates: Partial<Unit>) => void;
    deleteUnit: (id: string) => void;
    updateLevelPermissions: (level: number, permissions: string[]) => void;
    adminCheckEmailUnique: (email: string) => boolean;
    adminCreateUser: (userData: Partial<User>, options?: { sendNotification?: boolean, customPassword?: string }) => void;
    adminResendInvite: (userId: string) => void;
    adminUpdateUser: (userId: string, updates: Partial<User>) => void;
    adminDeleteUser: (userId: string) => void;
    // Post Management
    adminCreatePost: (post: Omit<Post, 'id' | 'date' | 'likes' | 'comments'>) => void;
    adminUpdatePost: (id: string, updates: Partial<Post>) => void;
    adminDeletePost: (id: string) => void;
    // Doc Management (Repository)
    uploadDoc: (doc: Omit<Doc, 'id' | 'date' | 'likes' | 'commentsCount'>) => void;
    updateDoc: (id: string, updates: Partial<Doc>) => void;
    deleteDoc: (id: string) => void;
    // Social
    toggleDocLike: (docId: string) => void;
    addDocComment: (docId: string, content: string) => void;
    // Projects
    createProject: (data: Partial<Project>) => void;
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    duplicateProject: (id: string) => void;
    createProjectFolder: (name: string, parentId?: string) => void;
    updateProjectFolder: (id: string, updates: Partial<ProjectFolder>) => void;
    deleteProjectFolder: (id: string) => void;
    // Repo Folders (Repository)
    createRepoFolder: (data: Partial<RepoFolder>) => void;
    updateRepoFolder: (id: string, updates: Partial<RepoFolder>) => void;
    deleteRepoFolder: (id: string) => void;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    unreadChatCount: number;
    refreshUnreadCount: () => Promise<void>;
    adminCreateWorkflow: (data: Partial<WorkflowDefinition>) => void;
    updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return { user: null, tenantId: null, superAdmin: false, originalSession: null, sidebarCollapsed: false };
    }
    try {
        const storedUser = localStorage.getItem('m360_user');
        const storedTenantId = localStorage.getItem('m360_tenant_id');
        const storedIsSuperAdmin = localStorage.getItem('m360_is_super_admin');
        const storedOriginalSession = localStorage.getItem('m360_original_session');
        const storedSidebar = localStorage.getItem('m360_sidebar_collapsed');
        return {
            user: storedUser ? JSON.parse(storedUser) : null,
            tenantId: storedTenantId || null,
            superAdmin: storedIsSuperAdmin === 'true',
            originalSession: storedOriginalSession ? JSON.parse(storedOriginalSession) : null,
            sidebarCollapsed: storedSidebar === 'true'
        };
    } catch {
        return { user: null, tenantId: null, superAdmin: false, originalSession: null, sidebarCollapsed: false };
    }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
    const initialState = getInitialState();
    const [currentUser, setCurrentUser] = useState<User | null>(initialState.user);
    const [originalSession, setOriginalSession] = useState<User | null>(initialState.originalSession);
    const [currentTenantId, setCurrentTenantId] = useState<string | null>(initialState.tenantId);
    const [isSuperAdmin, setIsSuperAdmin] = useState(initialState.superAdmin);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialState.sidebarCollapsed);
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const [isHydrated, setIsHydrated] = useState(typeof window !== 'undefined');
    const router = useRouter();

    const currentTenant = currentTenantId ? DB.tenants.find(t => t.id === currentTenantId) || null : null;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // 2. Persistence: Save to LocalStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
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
    }, [currentUser, currentTenantId, isSuperAdmin, originalSession, isSidebarCollapsed]);

    // 3. Unread Chat Count Logic
    const refreshUnreadCount = async () => {
        if (!currentUser || !currentTenantId) {
            setUnreadChatCount(0);
            return;
        }
        try {
            const { ChatService } = await import('@/lib/services/chatService');
            const res = await ChatService.getConversations(currentUser.id, currentTenantId);
            const total = res.data.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
            setUnreadChatCount(total);
        } catch (e) {
            console.error("Failed to refresh unread count", e);
        }
    };

    useEffect(() => {
        refreshUnreadCount();
        const interval = setInterval(refreshUnreadCount, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [currentUser, currentTenantId]);


    // 3. Security: Cross-Domain Validation
    useEffect(() => {
        // Load initial state (Mock: Get first tenant/user)
        // In real app, this comes from Auth provider / API

        // AUTO-SEED FOR VERIFICATION
        if (typeof window !== 'undefined' && !(window as any).hasSeeded) {
            console.log('Running Auto-Seeder...');
            seedAttachments();
            (window as any).hasSeeded = true;
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
    }, [currentUser, currentTenantId, isSuperAdmin]);

    // Apply Branding
    useEffect(() => {
        if (currentTenant && currentTenant.branding) {
            const root = document.documentElement;
            root.style.setProperty('--primary', currentTenant.branding.primary_color);
            root.style.setProperty('--primary-dark', currentTenant.branding.accent_color);
        } else {
            const root = document.documentElement;
            root.style.removeProperty('--primary');
            root.style.removeProperty('--primary-dark');
        }
    }, [currentTenant]);

    const login = (role: string, tenantId?: string, email?: string) => {
        if (role === 'superadmin') {
            setIsSuperAdmin(true);
            const adminUser: User = {
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
                metadata: { role: 'SUPER_ADMIN' },
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
                user = DB.users.find(u => u.tenantId === tenantId && u.email?.toLowerCase() === email.toLowerCase());
            }

            // 2. Fallback to Role-based simulation
            if (!user) {
                user = DB.users.find(u => u.tenantId === tenantId && (role === 'admin' ? u.level === 1 : u.level > 1));
            }

            if (user) {
                if (user.status === 'SUSPENDED') {
                    if (typeof window !== 'undefined') alert('Access Denied: Your account has been suspended.');

                    // Audit Log (Failed)
                    DB.platformAudit.unshift({
                        id: `audit-${Date.now()}`,
                        event_type: 'LOGIN_FAILED',
                        actor_id: user.id || 'unknown',
                        actor_name: user.name || 'Unknown',
                        target_tenant_id: tenantId,
                        metadata: { reason: 'Account Suspended' },
                        ip: '127.0.0.1',
                        created_at: new Date().toISOString()
                    });

                    return;
                }
                if (user.status === 'DELETED') {
                    if (typeof window !== 'undefined') alert('Access Denied: Account not found.');
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
                    metadata: { role: user.role, level: user.level },
                    ip: '127.0.0.1',
                    created_at: new Date().toISOString()
                });

                router.push('/dashboard');
            } else {
                console.error('User not found for login simulation');
            }
        }
    };

    const impersonateUser = (userId: string, tenantId: string) => {
        if (!isSuperAdmin || !currentUser) return;

        const targetUser = DB.users.find(u => u.id === userId && u.tenantId === tenantId);
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
                metadata: { reason: 'Support Action' },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
        }
    };

    const stopImpersonation = () => {
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

    const logout = () => {
        setCurrentUser(null);
        setOriginalSession(null);
        setCurrentTenantId(null);
        setIsSuperAdmin(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('m360_user');
            localStorage.removeItem('m360_tenant_id');
            localStorage.removeItem('m360_is_super_admin');
            localStorage.removeItem('m360_original_session');
        }
        router.push('/');
    };

    const updateUser = (updates: Partial<User>) => {
        if (currentUser) {
            const updated = { ...currentUser, ...updates };
            setCurrentUser(updated);
            // Also update in DB
            const dbIdx = DB.users.findIndex(u => u.id === currentUser.id);
            if (dbIdx >= 0) {
                DB.users[dbIdx] = updated;
                DB.save();
            }
        }
    };

    const createTenant = (data: Omit<Partial<Tenant>, 'branding' | 'policies'> & { branding?: Partial<TenantBranding>, policies?: Partial<TenantPolicy> }) => {
        const newId = `T${DB.tenants.length + 1}`;
        const timestamp = new Date().toISOString();
        const newTenant: Tenant = {
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
                allowed_mime_types: ['application/pdf'],
                audit_retention_days: 90,
                sso_enabled: false,
                updated_at: timestamp,
                ...data.policies
            },
            roleTemplates: {
                1: Object.values(PERMISSIONS),
                2: ['MANAGE_UNITS', 'VIEW_ALL_DOCS', 'UPLOAD_DOCS'],
                3: ['VIEW_ALL_DOCS', 'UPLOAD_DOCS'],
                4: ['VIEW_ALL_DOCS'],
                5: ['VIEW_ALL_DOCS'],
                6: []
            },
            users: 1, // Only admin initially
            storage: '0 GB',
            created_at: timestamp,
            features: data.features || ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'],
            sector: data.sector, // Add Sector
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
            body: `Hola ${data.contactName || 'Admin'},\n\nTu organización ${newTenant.name} ha sido registrada exitosamente.\n\nTus credenciales de acceso son:\nURL: https://maturity.online/login\nUsuario: ${adminEmail}\nContraseña Temporal: Temp123!`,
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
            metadata: { name: newTenant.name, slug: newTenant.slug, adminEmail },
            ip: '127.0.0.1',
            created_at: new Date().toISOString()
        });
        DB.save();

        console.log('Tenant Created:', newTenant);
        return newTenant;
    };

    const updateTenant = (id: string, updates: Omit<Partial<Tenant>, 'branding' | 'policies'> & { branding?: Partial<TenantBranding>, policies?: Partial<TenantPolicy> }) => {
        const idx = DB.tenants.findIndex(t => t.id === id);
        if (idx >= 0) {
            const current = DB.tenants[idx];

            // Audit Log
            const changes = Object.keys(updates).filter(k => k !== 'branding' && k !== 'policies');
            if (updates.branding) changes.push('branding');
            if (updates.policies) changes.push('policies');

            DB.platformAudit.unshift({
                id: `audit-${Date.now()}`,
                event_type: updates.status ? `TENANT_${updates.status}` : 'TENANT_UPDATED',
                actor_id: currentUser?.id || 'system',
                actor_name: currentUser?.name || 'System',
                target_tenant_id: id,
                metadata: { changes, updates },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });

            DB.tenants[idx] = {
                ...current,
                ...updates,
                branding: updates.branding ? { ...current.branding, ...updates.branding } : current.branding,
                policies: updates.policies ? { ...current.policies, ...updates.policies } : current.policies
            };

            if (currentTenantId === id) {
                // Force re-render if needed (though layout update helps)
            }
            DB.save();
        }
    };

    const deleteTenant = (id: string) => {
        const idx = DB.tenants.findIndex(t => t.id === id);
        if (idx < 0) return;

        const tenant = DB.tenants[idx];

        // Cascade Delete
        // 1. Users
        for (let i = DB.users.length - 1; i >= 0; i--) {
            if (DB.users[i].tenantId === id) DB.users.splice(i, 1);
        }
        // 2. Docs
        for (let i = DB.docs.length - 1; i >= 0; i--) {
            if (DB.docs[i].tenantId === id) DB.docs.splice(i, 1);
        }
        // 3. Projects
        for (let i = DB.projects.length - 1; i >= 0; i--) {
            if (DB.projects[i].tenantId === id) DB.projects.splice(i, 1);
        }
        // 4. Posts
        for (let i = DB.posts.length - 1; i >= 0; i--) {
            if (DB.posts[i].tenantId === id) DB.posts.splice(i, 1);
        }
        // 5. Workflows
        for (let i = DB.workflowCases.length - 1; i >= 0; i--) {
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
            metadata: { name: tenant.name, slug: tenant.slug },
            ip: '127.0.0.1',
            created_at: new Date().toISOString()
        });

        setForceUpdate(n => n + 1);
    };

    const createUnit = (data: Partial<Unit>) => {
        if (!currentTenantId) return;
        const newUnit: Unit = {
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

    const updateUnit = (id: string, updates: Partial<Unit>) => {
        const idx = DB.units.findIndex(u => u.id === id);
        if (idx >= 0) {
            DB.units[idx] = { ...DB.units[idx], ...updates };
            DB.save();
        }
    };

    const deleteUnit = (id: string) => {
        const idx = DB.units.findIndex(u => u.id === id);
        if (idx >= 0) {
            DB.units.splice(idx, 1);
        }
    };

    const updateLevelPermissions = (level: number, permissions: string[]) => {
        if (!currentTenant) return;

        // Update in DB (in memory reference)
        // Since currentTenant is a reference to DB object (if retrieved via find), modifying it updates DB?
        // Let's modify DB directly to be safe
        const idx = DB.tenants.findIndex(t => t.id === currentTenantId);
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

    const adminCheckEmailUnique = (email: string) => {
        return !DB.users.some(u => u.email?.toLowerCase() === email.toLowerCase());
    };

    const adminCreateUser = (userData: Partial<User>, options: { sendNotification?: boolean, customPassword?: string } = {}) => {
        // if (!currentTenantId) return; // Allow if explicit tenantId is passed
        const userId = `u-${Date.now()}`;
        const newUser: User = {
            id: userId,
            tenantId: userData.tenantId || currentTenantId || 'global',
            password: options.customPassword, // Explicitly set if manual
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
            metadata: { ...newUser, notificationSent: options.sendNotification },
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
                body: `Hola ${newUser.name},\n\nTu cuenta ha sido creada. Tu contraseña temporal es: Temp123!\nIngresa en: https://${newUser.tenantId}.maturity.online`,
                status: 'SENT',
                sentAt: new Date().toISOString()
            });
            console.log(`[MockEmail] Sent to ${newUser.email}`);
        }
    };

    const adminUpdateUser = (userId: string, updates: Partial<User>) => {
        const idx = DB.users.findIndex(u => u.id === userId);
        if (idx >= 0) {
            const oldUser = DB.users[idx];

            // Audit Check
            const auditChanges: string[] = [];
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
                    target_tenant_id: oldUser.tenantId, // Log under original context
                    metadata: { changes: auditChanges, updates },
                    ip: '127.0.0.1',
                    created_at: new Date().toISOString()
                });
            }

            DB.users[idx] = { ...oldUser, ...updates };
            DB.save();
        }
    };

    const adminDeleteUser = (userId: string) => {
        const idx = DB.users.findIndex(u => u.id === userId);
        if (idx >= 0) {
            const user = DB.users[idx];

            // Integrity Check: Prevent deleting last admin
            if (user.level === 1 && user.status !== 'DELETED') {
                const otherAdmins = DB.users.filter(u =>
                    u.tenantId === user.tenantId &&
                    u.level === 1 &&
                    u.id !== userId &&
                    u.status === 'ACTIVE'
                );
                if (otherAdmins.length === 0) {
                    if (typeof window !== 'undefined') alert('Integrity Error: Cannot delete the last active Admin for this tenant.');
                    return;
                }
            }

            // Soft Delete
            const oldStatus = user.status;
            DB.users[idx] = { ...user, status: 'DELETED' };

            // Audit
            DB.platformAudit.unshift({
                id: `audit-${Date.now()}`,
                event_type: 'USER_DELETED',
                actor_id: currentUser?.id || 'system',
                actor_name: currentUser?.name || 'System',
                target_user_id: userId,
                target_tenant_id: user.tenantId,
                metadata: { previous_status: oldStatus },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
        }
    };

    const adminResendInvite = (userId: string) => {
        const idx = DB.users.findIndex(u => u.id === userId);
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
                    body: `Hola ${user.name},\n\nAqui tienes tu enlace de acceso: https://${user.tenantId}.maturity.online\nCredenciales temporales: Temp123!`,
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
                metadata: { email: user.email },
                ip: '127.0.0.1',
                created_at: new Date().toISOString()
            });
            DB.save();
        }
    };

    const adminDeletePost = (id: string) => {
        const idx = DB.posts.findIndex(p => p.id === id);
        if (idx !== -1) {
            DB.posts.splice(idx, 1);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const adminCreatePost = (postData: Omit<Post, 'id' | 'date' | 'likes' | 'commentsCount'>) => {
        const newPost: Post = {
            ...postData,
            id: `P-${currentTenantId}-${Date.now()}`,
            date: 'Ahora',
            likes: 0,
            commentsCount: 0
        };
        DB.posts.unshift(newPost);
        DB.save();
        setForceUpdate(n => n + 1);
    };

    const adminUpdatePost = (id: string, updates: Partial<Post>) => {
        const post = DB.posts.find(p => p.id === id);
        if (post) {
            Object.assign(post, updates);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };


    const adminCreateWorkflow = (data: Partial<WorkflowDefinition>) => {
        if (!currentTenantId) return;
        const newWorkflow: WorkflowDefinition = {
            id: `WF-${Date.now()}`,
            tenantId: currentTenantId,
            title: data.title || 'Nuevo Proceso',
            description: data.description || '',
            unit: data.unit || '',
            ownerId: data.ownerId,
            icon: data.icon || 'FileText',
            schema: data.schema || { fields: [] },
            slaHours: data.slaHours || 24,
            active: true
        };
        DB.workflowDefinitions.unshift(newWorkflow);
        DB.save();
        setForceUpdate(n => n + 1);
    };

    const createProjectFolder = (name: string, parentId?: string) => {
        if (!currentTenantId) return;
        const newFolder: ProjectFolder = {
            id: `fld-${currentTenantId}-${Date.now()}`,
            tenantId: currentTenantId,
            name,
            createdAt: new Date().toISOString(),
            parentId
        };
        DB.projectFolders.push(newFolder);
        DB.save();
        setForceUpdate(n => n + 1);
    };

    const createRepoFolder = (data: Partial<RepoFolder>) => {
        if (!currentTenantId) return;
        const newFolder: RepoFolder = {
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
        DB.repoFolders.push(newFolder);
        DB.save();
        setForceUpdate(n => n + 1);
    };

    const updateRepoFolder = (id: string, updates: Partial<RepoFolder>) => {
        const idx = DB.repoFolders.findIndex(f => f.id === id);
        if (idx >= 0) {
            DB.repoFolders[idx] = { ...DB.repoFolders[idx], ...updates, updatedAt: new Date().toISOString() };
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const deleteRepoFolder = (id: string) => {
        const idx = DB.repoFolders.findIndex(f => f.id === id);
        if (idx >= 0) {
            DB.repoFolders.splice(idx, 1);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const uploadDoc = (docData: Omit<Doc, 'id' | 'date' | 'likes' | 'commentsCount'>) => {
        const newDoc: Doc = {
            id: `DOC-${currentTenantId}-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            commentsCount: 0,
            ...docData
        };
        DB.docs.unshift(newDoc);
        DB.save();
        setForceUpdate(n => n + 1);
    };

    const updateDoc = (id: string, updates: Partial<Doc>) => {
        const doc = DB.docs.find(d => d.id === id);
        if (doc) {
            Object.assign(doc, updates);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const deleteDoc = (id: string) => {
        const idx = DB.docs.findIndex(d => d.id === id);
        if (idx >= 0) {
            DB.docs.splice(idx, 1);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const toggleDocLike = (docId: string) => {
        const doc = DB.docs.find(d => d.id === docId);
        if (doc) {
            if (doc.likes > 0) {
                doc.likes--;
            } else {
                doc.likes++;
            }
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const addDocComment = (docId: string, content: string) => {
        const newComment = {
            id: `c-${Date.now()}`,
            docId: docId,
            authorId: currentUser?.id || 'anon',
            authorName: currentUser?.name || 'Anónimo',
            content: content,
            createdAt: new Date().toISOString()
        };
        DB.publicComments.push(newComment);

        const doc = DB.docs.find(d => d.id === docId);
        if (doc) doc.commentsCount = (doc.commentsCount || 0) + 1;

        DB.save();
        setForceUpdate(n => n + 1);
    };

    const createProject = (projectData: Partial<Project>) => {
        if (!currentTenantId) return;
        const newProject: Project = {
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
        setForceUpdate(n => n + 1);
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        const idx = DB.projects.findIndex(p => p.id === id);
        if (idx >= 0) {
            DB.projects[idx] = { ...DB.projects[idx], ...updates, updatedAt: new Date().toISOString() };
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const deleteProject = (id: string) => {
        const idx = DB.projects.findIndex(p => p.id === id);
        if (idx >= 0) {
            DB.projects.splice(idx, 1);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const duplicateProject = (id: string) => {
        const original = DB.projects.find(p => p.id === id);
        if (original && currentTenantId) {
            const timestamp = Date.now();
            const newProject: Project = {
                ...original,
                id: `PROJ-${timestamp}`,
                title: `${original.title} (Copia)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'PLANNING',
                phases: original.phases.map((ph, i) => ({
                    ...ph,
                    id: `ph-${timestamp}-${i}`,
                    status: 'NOT_STARTED',
                    activities: ph.activities.map((act, j) => ({
                        ...act,
                        id: `act-${timestamp}-${i}-${j}`,
                        status: 'NOT_STARTED',
                        documents: []
                    }))
                }))
            };
            DB.projects.unshift(newProject);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const updateProjectFolder = (id: string, updates: Partial<ProjectFolder>) => {
        const idx = DB.projectFolders.findIndex(f => f.id === id);
        if (idx >= 0) {
            DB.projectFolders[idx] = { ...DB.projectFolders[idx], ...updates };
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const deleteProjectFolder = (id: string) => {
        const idx = DB.projectFolders.findIndex(f => f.id === id);
        if (idx >= 0) {
            DB.projects.forEach(p => {
                if (p.folderId === id) delete p.folderId;
            });
            DB.projectFolders.splice(idx, 1);
            DB.save();
            setForceUpdate(n => n + 1);
        }
    };

    const toggleSidebar = () => setIsSidebarCollapsed(v => !v);

    const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
        Object.assign(DB.platformSettings, settings);
        DB.save();
        setForceUpdate(n => n + 1);
    };

    return (
        <AppContext.Provider value={{
            currentUser, currentTenantId, currentTenant, isSuperAdmin, isHydrated, version: forceUpdate,
            originalSession, impersonateUser, stopImpersonation,
            login, logout, updateUser, createTenant, updateTenant, deleteTenant,
            createUnit, updateUnit, deleteUnit, updateLevelPermissions,
            adminCheckEmailUnique, adminCreateUser, adminResendInvite, adminUpdateUser, adminDeleteUser,
            adminCreatePost, adminUpdatePost, adminDeletePost,
            adminCreateWorkflow,
            uploadDoc, updateDoc, deleteDoc,
            toggleDocLike, addDocComment,
            createProject, updateProject, deleteProject, duplicateProject, createProjectFolder,
            updateProjectFolder,
            deleteProjectFolder,
            isSidebarCollapsed, toggleSidebar,
            unreadChatCount, refreshUnreadCount,
            updatePlatformSettings,
            createRepoFolder,
            updateRepoFolder,
            deleteRepoFolder
        }}>{children}</AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
