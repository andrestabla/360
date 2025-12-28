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

    const refreshUnreadCount = useCallback(async () => {
        if (!currentUser) return;
        try {
            const { ChatService } = await import('@/lib/services/chatService');
            const convs = await ChatService.getConversations(currentUser.id);
            if (convs.success) {
                const count = convs.data.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
                setUnreadChatCount(count);
            }
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

    useEffect(() => {
        refreshUnreadCount();
        loadUnits();
    }, [refreshUnreadCount, loadUnits]);

    // Initialize
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Restore Platform Settings (Branding)
                const storedSettings = localStorage.getItem('m360_platform_settings');
                if (storedSettings) {
                    try {
                        const parsed = JSON.parse(storedSettings);
                        // Merge with default DB settings to ensure new fields (like branding) exist if local storage is old
                        setPlatformSettings(prev => ({
                            ...prev,
                            ...parsed,
                            branding: { ...prev.branding, ...(parsed.branding || {}) }
                        }));
                    } catch (e) {
                        console.error('Error parsing stored settings:', e);
                    }
                }

                // 2. Verify Session
                const response = await fetch('/api/auth/verify');
                const data = await response.json();

                if (data.success && data.user) {
                    setCurrentUser(data.user);
                    setIsSuperAdmin(!!data.user.isSuperAdmin);
                    // Also update localStorage user backup
                    localStorage.setItem('m360_user', JSON.stringify(data.user));

                    // 3. Update Platform Settings from Server (Branding)
                    if (data.platformSettings) {
                        const mergedSettings = {
                            ...platformSettings,
                            ...data.platformSettings,
                            branding: { ...(platformSettings.branding || {}), ...(data.platformSettings.branding || {}) }
                        };
                        setPlatformSettings(mergedSettings);

                        // Persist to local storage
                        localStorage.setItem('m360_platform_settings', JSON.stringify(mergedSettings));

                        // Inject Global Branding CSS
                        if (mergedSettings.branding?.primaryColor) {
                            document.documentElement.style.setProperty('--primary', mergedSettings.branding.primaryColor);
                        }
                    }
                } else {
                    // Session invalid or expired
                    // Only clear if we really want to force logout, or just leave as null
                    // If we want to strictly enforce session validity:
                    // setCurrentUser(null);
                    // setIsSuperAdmin(false);
                    // localStorage.removeItem('m360_user');
                    // But maybe we want to allow the "localStorage user" to work offline/mock?
                    // For now, let's trust the verify route. If it fails, we are logged out.
                    // However, to prevent "flicker" if offline, we might want to keep the local user
                    // BUT the user request is specifically about "unlogging on update", which suggests the cookie persists but state is lost.
                    // This verify call RECOVERS the state from the cookie.
                }

            } catch (error) {
                console.error('Error initializing app:', error);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Login
    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!data.success) {
                return { success: false, error: data.error };
            }

            const user = data.user;
            setCurrentUser(user);
            setIsSuperAdmin(!!data.user.isSuperAdmin);

            localStorage.setItem('m360_user', JSON.stringify(user));

            // Redirect logic
            if (data.user.isSuperAdmin) {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard');
            }

            return { success: true };
        } catch (error: any) {
            console.error('Login error:', error);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setIsLoading(false);
        }
    };


    const logout = async () => {
        setIsLoading(true);
        try {
            // Clear local storage first (synchronous, safe operation)
            localStorage.removeItem('m360_user');

            // Call server action which handles signOut with redirect
            // This will trigger NEXT_REDIRECT, so we don't manually update React state
            await logoutAction();

        } catch (error) {
            console.error('Logout error:', error);
            // Only reset loading if redirect fails
            setIsLoading(false);
        }
        // No finally block - redirect will unmount component naturally
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

        const index = DB.users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            DB.users[index] = updated;
            DB.save();
        }
    };

    const stopImpersonation = () => {
        // Implementation for stopping impersonation
    };

    const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...n,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const refreshData = useCallback(() => {
        setDataVersion(v => v + 1);
    }, []);

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
        // In a real app, this would update DB.platformSettings.roleTemplates
        // But roleTemplates might be on tenant or platform. 
        // Assuming platform settings for now based on context.
        if (!DB.platformSettings.roleTemplates) {
            DB.platformSettings.roleTemplates = {};
        }
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
        refreshData();
    };

    const createProject = (project: Partial<import("@/lib/data").Project>) => {
        const newProject: import("@/lib/data").Project = {
            id: Date.now().toString(),
            title: 'Nuevo Proyecto',
            description: '',
            status: 'PLANNED',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            managerId: currentUser?.id || '',
            members: [],
            budget: 0,
            spent: 0,
            phases: [],
            ...project
        } as import("@/lib/data").Project;
        DB.projects.push(newProject);
        refreshData();
    };

    const updateProject = (id: string, updates: Partial<import("@/lib/data").Project>) => {
        const index = DB.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            DB.projects[index] = { ...DB.projects[index], ...updates };
            refreshData();
        }
    };

    // Assuming this deletes a project, renamed/mapped to deleteProjectFolder as per usage
    const deleteProjectFolder = (id: string) => {
        const index = DB.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            DB.projects.splice(index, 1);
            refreshData();
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
