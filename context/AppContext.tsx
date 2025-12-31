"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    User,
    DB,
    PlatformSettings,
    Notification
} from '@/lib/data';
import { logout as logoutAction } from '@/app/lib/actions';
import {
    getUnitsAction,
    createUnitAction,
    updateUnitAction,
    deleteUnitAction
} from '@/app/lib/unitActions';
// Theme handled via CSS/Tailwind directly


interface AppContextType {
    // User & Auth
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    isSuperAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;

    // Impersonation (Stubbed for now)
    originalSession: any;
    stopImpersonation: () => void;

    // Platform & UI
    platformSettings: PlatformSettings;
    updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
    isLoading: boolean;

    // UI Layout
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    isMobileMenuOpen: boolean;
    openMobileMenu: () => void;
    closeMobileMenu: () => void;

    // Chat
    unreadChatCount: number;
    refreshUnreadCount: () => void;

    // Notifications
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markNotificationAsRead: (id: string) => void;
    clearNotifications: () => void;

    // Global Refresh
    refreshData: () => void;
    version: number;

    // Admin Posts
    adminCreatePost: (post: Omit<import("@/lib/data").Post, "id" | "date" | "likes" | "commentsCount">) => void;
    adminUpdatePost: (id: string, updates: Partial<import("@/lib/data").Post>) => void;
    adminDeletePost: (id: string) => void;

    // Permissions
    updateLevelPermissions: (level: number, permissions: string[]) => void;

    // Admin Units
    createUnit: (unit: Partial<import("@/lib/data").Unit>) => void;
    updateUnit: (id: string, updates: Partial<import("@/lib/data").Unit>) => void;
    deleteUnit: (id: string) => void;

    // Workflows
    adminCreateWorkflow: (workflow: Partial<import("@/lib/data").WorkflowDefinition>) => void;
    createWorkflowCase: (data: any) => Promise<void>;


    // Projects (for Workflows page)
    createProject: (project: Partial<import("@/lib/data").Project>) => void;
    updateProject: (id: string, updates: Partial<import("@/lib/data").Project>) => void;
    deleteProjectFolder: (id: string) => void;

    // Repository
    uploadDoc: (doc: Partial<import("@/lib/data").Doc>) => void;
    updateDoc: (id: string, updates: Partial<import("@/lib/data").Doc>) => void;
    deleteDoc: (id: string) => void;
    toggleDocLike: (id: string) => void;
    addDocComment: (docId: string, comment: import("@/lib/data").PublicComment) => void;

    createRepoFolder: (folder: Partial<import("@/lib/data").RepoFolder>) => void;
    updateRepoFolder: (id: string, updates: Partial<import("@/lib/data").RepoFolder>) => void;
    deleteRepoFolder: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    // Theme support removed or handled globally/class-based


    // State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DB.platformSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dataVersion, setDataVersion] = useState(0);
    const [unitsData, setUnitsData] = useState<import("@/lib/data").Unit[]>([]);

    // UI State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Helpers (Hoisted for use in other functions)
    const refreshData = useCallback(() => {
        setDataVersion(v => v + 1);
    }, []);

    const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...n,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const refreshUnreadCount = useCallback(async () => {
        if (!currentUser) return;
        try {
            const { getUnreadCountAction } = await import('@/app/lib/chatActions');
            const count = await getUnreadCountAction(currentUser.id);
            setUnreadChatCount(count);
        } catch (e) {
            console.error('Error fetching unread count', e);
        }
    }, [currentUser]);

    const loadUnits = useCallback(async () => {
        const res = await getUnitsAction();
        if (res.success && res.data) {
            const mapped: import("@/lib/data").Unit[] = res.data.map((u: any) => ({
                id: u.id,
                name: u.name,
                code: u.code,
                parentId: u.parentId || undefined,
                ownerId: u.managerId || undefined,
                description: u.description || undefined,
                type: (u.type || 'UNIT') as any,
                depth: u.level || 0,
                color: u.color || undefined,
                members: (u.members as string[]) || []
            }));
            setUnitsData(mapped);
            // Keep DB object in sync for legacy compatibility
            DB.units = mapped as any;
        }
    }, []);

    const loadProjects = useCallback(async () => {
        const { getProjectsAction } = await import('@/app/actions/projectActions');
        const res = await getProjectsAction();
        if (res.success && res.data) {
            DB.projects = res.data as any;
            refreshData();
        }
    }, [refreshData]);

    const loadWorkflowCases = useCallback(async () => {
        const { getWorkflowCasesAction } = await import('@/app/actions/workflow');
        const res = await getWorkflowCasesAction();
        if (res.success && res.data) {
            DB.workflowCases = res.data as any;
            refreshData();
        }
    }, [refreshData]);

    useEffect(() => {
        refreshUnreadCount();
        loadUnits();
        loadProjects(); // Load projects on mount
        loadWorkflowCases();
    }, [refreshUnreadCount, loadUnits, loadProjects, loadWorkflowCases]);

    // Initialize
    useEffect(() => {
        const init = async () => {
            // 0. Import Server Action dynamically or assume imported
            const { getOrganizationSettings } = await import('@/app/lib/actions');

            // 1. Restore Platform Settings (Branding)
            const storedSettings = localStorage.getItem('m360_platform_settings');
            if (storedSettings) {
                try {
                    const parsed = JSON.parse(storedSettings);
                    setPlatformSettings(prev => ({
                        ...prev,
                        ...parsed,
                        branding: { ...prev.branding, ...(parsed.branding || {}) }
                    }));
                } catch (e) { console.error(e); }
            }

            // 1.1 Fetch fresh settings from Server
            try {
                const serverSettings = await getOrganizationSettings();
                if (serverSettings && serverSettings.branding) {
                    setPlatformSettings(prev => {
                        const newSettings = {
                            ...prev,
                            // Map select fields or deep merge
                            plan: (serverSettings.plan as any) || prev.plan,
                            branding: {
                                ...prev.branding,
                                ...(serverSettings.branding as any)
                            }
                        };
                        localStorage.setItem('m360_platform_settings', JSON.stringify(newSettings));
                        return newSettings;
                    });
                }
            } catch (e) { console.error("Failed to fetch server settings", e); }

            // 2. Verify Session
            try {
                const response = await fetch('/api/auth/verify');
                const data = await response.json();
                if (data.success && data.user) {
                    setCurrentUser(data.user);
                    setIsSuperAdmin(!!data.user.isSuperAdmin);
                    localStorage.setItem('m360_user', JSON.stringify(data.user));
                }
            } catch (e) { console.error(e); }
            setIsLoading(false);
        };
        init();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!data.success) return { success: false, error: data.error };

            setCurrentUser(data.user);
            setIsSuperAdmin(!!data.user.isSuperAdmin);
            localStorage.setItem('m360_user', JSON.stringify(data.user));

            if (data.user.isSuperAdmin) router.push('/dashboard/admin');
            else router.push('/dashboard');
            return { success: true };
        } catch (error: any) {
            return { success: false, error: 'Error de conexión' };
        } finally { setIsLoading(false); }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            localStorage.removeItem('m360_user');
            await logoutAction();
        } catch (error) { setIsLoading(false); }
    };

    const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
        setPlatformSettings(prev => {
            const newSettings = { ...prev, ...settings };
            DB.platformSettings = newSettings;
            DB.save();
            localStorage.setItem('m360_platform_settings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const updateUser = (updates: Partial<User>) => {
        if (!currentUser) return;
        const updated = { ...currentUser, ...updates };
        setCurrentUser(updated);
        // Sync local mock
        const index = DB.users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            DB.users[index] = updated;
            DB.save();
        }
    };

    const stopImpersonation = () => { };

    const adminCreatePost = (post: any) => {
        const newPost: import("@/lib/data").Post = {
            ...post,
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            likes: 0,
            commentsCount: 0
        };
        DB.posts.push(newPost);
        refreshData();
    };

    const adminUpdatePost = (id: string, updates: any) => {
        const index = DB.posts.findIndex(p => p.id === id);
        if (index !== -1) {
            DB.posts[index] = { ...DB.posts[index], ...updates };
            refreshData();
        }
    };

    const adminDeletePost = (id: string) => {
        const index = DB.posts.findIndex(p => p.id === id);
        if (index !== -1) {
            DB.posts.splice(index, 1);
            refreshData();
        }
    };

    const updateLevelPermissions = (level: number, permissions: string[]) => {
        if (!DB.platformSettings.roleTemplates) DB.platformSettings.roleTemplates = {};
        DB.platformSettings.roleTemplates[level] = permissions;
        refreshData();
    };

    const createUnit = async (unit: Partial<import("@/lib/data").Unit>) => {
        const dbData = {
            id: unit.id,
            name: unit.name,
            code: unit.code,
            parentId: unit.parentId,
            managerId: unit.ownerId,
            description: unit.description,
            type: unit.type,
            level: unit.depth,
            color: unit.color,
            members: unit.members
        };
        const res = await createUnitAction(dbData);
        if (res.success) {
            await loadUnits();
            refreshData();
        } else {
            console.error("Failed to create unit", res.error);
            addNotification({ title: 'Error', message: res.error || 'No se pudo crear la unidad', type: 'error' });
        }
    };

    const updateUnit = async (id: string, updates: Partial<import("@/lib/data").Unit>) => {
        const dbUpdates: any = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.code !== undefined) dbUpdates.code = updates.code;
        if (updates.parentId !== undefined) dbUpdates.parentId = updates.parentId;
        if (updates.ownerId !== undefined) dbUpdates.managerId = updates.ownerId;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.type !== undefined) dbUpdates.type = updates.type;
        if (updates.depth !== undefined) dbUpdates.level = updates.depth;
        if (updates.color !== undefined) dbUpdates.color = updates.color;
        if (updates.members !== undefined) dbUpdates.members = updates.members;

        const res = await updateUnitAction(id, dbUpdates);
        if (res.success) {
            await loadUnits();
            refreshData();
        } else {
            addNotification({ title: 'Error', message: res.error || 'No se pudo actualizar la unidad', type: 'error' });
        }
    };

    const deleteUnit = async (id: string) => {
        const res = await deleteUnitAction(id);
        if (res.success) {
            await loadUnits();
            refreshData();
        } else {
            addNotification({ title: 'Error', message: res.error || 'No se pudo eliminar la unidad', type: 'error' });
        }
    };

    const createWorkflowCase = async (data: any) => {
        const { createWorkflowCaseAction } = await import('@/app/actions/workflow');
        const res = await createWorkflowCaseAction(data);
        if (res.success && res.data) {
            // Optimistic / Sync
            const newCaseWithDefaults = {
                ...res.data,
                history: [],
                comments: []
            } as unknown as import("@/lib/data").WorkflowCase; // Force cast to bypass Date vs String mismatch
            DB.workflowCases.unshift(newCaseWithDefaults); // Add to local DB mock for immediate UI update
            refreshData(); // Trigger re-render
        } else {
            console.error("Failed to create workflow case", res.error);
            alert("Error al crear la solicitud: " + res.error);
        }
    };

    const adminCreateWorkflow = (workflow: Partial<import("@/lib/data").WorkflowDefinition>) => {
        const newWorkflow: import("@/lib/data").WorkflowDefinition = {
            id: Date.now().toString(),
            title: 'Nuevo Proceso',
            description: '',
            active: true,
            icon: 'FileText',
            slaHours: 24,
            unit: '',
            schema: {},
            ownerId: currentUser?.id || '',
            ...workflow
        } as import("@/lib/data").WorkflowDefinition;
        DB.workflowDefinitions.push(newWorkflow);
        refreshData();
    };


    const createProject = async (project: Partial<import("@/lib/data").Project>) => {
        const { createProjectAction } = await import('@/app/actions/projectActions');

        // Ensure we have a valid user ID. 
        // If currentUser is not yet loaded or null, we shouldn't allow creation or it will fail on server.
        // But the UI usually protects this. We'll default to 'unknown' or empty if missing which will fail gracefully on server.
        const uid = currentUser?.id;

        const newProject = {
            id: `p-${Date.now()}`, // Ensure ID format is robust
            title: 'Nuevo Proyecto',
            description: '',
            status: 'PLANNED',
            startDate: new Date(),
            creatorId: uid,
            managerId: uid,
            ...project
        };

        // Optimistic Update
        DB.projects.push(newProject as any);
        refreshData();

        // Pass only data schema expects, filtering any undefineds to avoid serialization issues
        const { id, title, description, status, startDate, creatorId, managerId, participants, phases } = newProject;
        const payload = {
            id,
            title,
            description,
            status,
            startDate: startDate instanceof Date ? startDate : new Date(startDate || Date.now()),
            creatorId,
            managerId,
            participants,
            phases // Phases might be relevant if duplicating
        };

        const res = await createProjectAction(payload);
        if (res.success) {
            loadProjects();
        } else {
            console.error("Failed to create project", res.error);
            const idx = DB.projects.findIndex(p => p.id === newProject.id);
            if (idx !== -1) {
                DB.projects.splice(idx, 1);
                refreshData();
            }
            addNotification({ title: 'Error', message: `No se pudo guardar: ${res.error}`, type: 'error' });
        }
    };

    const updateProject = async (id: string, updates: Partial<import("@/lib/data").Project>) => {
        const { updateProjectAction } = await import('@/app/actions/projectActions');

        // Optimistic Update
        const index = DB.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            DB.projects[index] = { ...DB.projects[index], ...updates };
            refreshData();
        }

        const res = await updateProjectAction(id, updates);
        if (!res.success) {
            console.error("Failed to update project", res.error);
            addNotification({ title: 'Error', message: 'No se pudo guardar los cambios', type: 'error' });
        }
    };

    const deleteProjectFolder = async (id: string) => {
        // This function name is misleading in the original code, it was used for deleting projects
        const { deleteProjectAction } = await import('@/app/actions/projectActions');

        // Optimistic
        const index = DB.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            DB.projects.splice(index, 1);
            refreshData();
        }

        const res = await deleteProjectAction(id);
        if (!res.success) {
            addNotification({ title: 'Error', message: 'No se pudo eliminar el proyecto', type: 'error' });
            loadProjects(); // Revert
        }
    };

    const uploadDoc = (doc: Partial<import("@/lib/data").Doc>) => {
        const newDoc: import("@/lib/data").Doc = {
            id: Date.now().toString(),
            title: 'Nuevo Documento',
            type: 'PDF',
            size: '0 MB',
            version: '1.0',
            status: 'active',
            authorId: currentUser?.id || '',
            unit: '',
            visibility: 'public',
            tags: [],
            likes: 0,
            commentsCount: 0,
            date: new Date().toISOString().split('T')[0],
            ...doc
        } as import("@/lib/data").Doc;
        DB.docs.push(newDoc);
        refreshData();
    };

    const updateDoc = (id: string, updates: Partial<import("@/lib/data").Doc>) => {
        const index = DB.docs.findIndex(d => d.id === id);
        if (index !== -1) {
            DB.docs[index] = { ...DB.docs[index], ...updates };
            refreshData();
        }
    };

    const deleteDoc = (id: string) => {
        const index = DB.docs.findIndex(d => d.id === id);
        if (index !== -1) {
            DB.docs.splice(index, 1);
            refreshData();
        }
    };

    const toggleDocLike = (id: string) => {
        const doc = DB.docs.find(d => d.id === id);
        if (doc) {
            doc.likes = (doc.likes || 0) + 1; // Simplified toggle logic for prototype
            refreshData();
        }
    };

    const addDocComment = (docId: string, comment: import("@/lib/data").PublicComment) => {
        const doc = DB.docs.find(d => d.id === docId);
        if (doc) {
            if (!doc.comments) doc.comments = [];
            doc.comments.push(comment);
            doc.commentsCount = (doc.commentsCount || 0) + 1;
            refreshData();
        }
    };

    const createRepoFolder = (folder: Partial<import("@/lib/data").RepoFolder>) => {
        const newFolder: import("@/lib/data").RepoFolder = {
            id: Date.now().toString(),
            name: 'Nueva Carpeta',
            createdAt: new Date().toISOString(),
            ...folder
        } as import("@/lib/data").RepoFolder;
        DB.repoFolders.push(newFolder);
        refreshData();
    };

    const updateRepoFolder = (id: string, updates: Partial<import("@/lib/data").RepoFolder>) => {
        const index = DB.repoFolders.findIndex(f => f.id === id);
        if (index !== -1) {
            DB.repoFolders[index] = { ...DB.repoFolders[index], ...updates };
            refreshData();
        }
    };

    const deleteRepoFolder = (id: string) => {
        const index = DB.repoFolders.findIndex(f => f.id === id);
        if (index !== -1) {
            DB.repoFolders.splice(index, 1);
            refreshData();
        }
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            setCurrentUser,
            isSuperAdmin,
            login,
            logout,
            platformSettings,
            updatePlatformSettings,
            isLoading,
            notifications,
            addNotification,
            markNotificationAsRead,
            clearNotifications,
            refreshData,
            version: dataVersion,
            adminCreatePost,
            adminUpdatePost,
            adminDeletePost,
            updateLevelPermissions,
            createUnit,
            updateUnit,
            deleteUnit,
            adminCreateWorkflow,
            createWorkflowCase,
            updateUser,
            originalSession: null,
            stopImpersonation,
            createProject,
            updateProject,
            deleteProjectFolder,
            uploadDoc,
            updateDoc,
            deleteDoc,
            toggleDocLike,
            addDocComment,
            createRepoFolder,
            updateRepoFolder,
            deleteRepoFolder,
            isSidebarCollapsed,
            toggleSidebar,
            isMobileMenuOpen,
            openMobileMenu,
            closeMobileMenu,
            unreadChatCount,
            refreshUnreadCount
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
