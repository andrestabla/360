'use server'

import { signIn, signOut, auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { db } from '@/server/db';
import { users, organizationSettings, userNotes, workflowCases, userRecents } from '@/shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Helper seguro para detectar redirecciones sin depender de imports internos inestables
function isRedirectError(error: any) {
    return error?.message === 'NEXT_REDIRECT' ||
        (typeof error === 'object' && error !== null && 'digest' in error && (error as any).digest?.startsWith('NEXT_REDIRECT'));
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const data = Object.fromEntries(formData);
        console.log('[Action] Authenticating with:', { ...data, password: '***' });

        // Let signIn handle its own redirect internally - it will set the JWT properly
        await signIn('credentials', {
            ...data,
            redirectTo: '/dashboard',
        });

    } catch (error) {
        // Critical: Allow redirect errors to propagate
        if (isRedirectError(error)) {
            throw error;
        }

        console.error('Auth Action Error:', error);
        if (error instanceof AuthError) {
            console.error('AuthError Type:', error.type);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas.';
                case 'CallbackRouteError':
                    return 'Error en la configuración de autenticación (Callback).';
                default:
                    return `Algo salió mal. (${error.type})`;
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: '/login' });
}

export async function changePassword(
    prevState: string | undefined,
    formData: FormData,
) {
    const session = await auth();
    if (!session?.user?.id) {
        return 'No autorizado';
    }

    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
        return 'Las contraseñas no coinciden.';
    }

    if (newPassword.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users)
        .set({
            password: hashedPassword,
            mustChangePassword: false
        })
        .where(eq(users.id, session.user.id));

    // Sign out the user to invalidate the current session
    await signOut({ redirect: false });

    // Redirect to login page with a message
    redirect('/login?passwordChanged=true');
}

// --- Actualizar Perfil de Usuario ---
export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const name = formData.get('name') as string;
    const avatar = formData.get('avatar') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const bio = formData.get('bio') as string;
    const language = formData.get('language') as string;
    const timezone = formData.get('timezone') as string;

    try {
        await db.update(users)
            .set({
                name,
                image: avatar, // Auth.js standard
                avatar: avatar, // App specific
                jobTitle,
                phone,
                location,
                bio,
                language,
                timezone,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard'); // Para que el sidebar/topbar se actualicen
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Error al guardar cambios" };
    }
}

// --- Actualizar Apariencia (Tenant) ---
export async function updateTenantBranding(settings: any) {
    const session = await auth();
    // Verificación de rol simplificada para demo
    const role = (session?.user as any)?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'PLATFORM_ADMIN') {
        // return { error: "No tienes permisos" };
    }

    try {
        // En este esquema, la configuración visual vive en el campo JSON 'branding'
        // Primero obtenemos la configuración actual para hacer merge
        const current = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1)).limit(1);
        const currentBranding = (current[0]?.branding as Record<string, any>) || {};

        const newBranding = {
            ...currentBranding,
            ...settings
        };

        await db.update(organizationSettings)
            .set({
                branding: newBranding,
            })
            .where(eq(organizationSettings.id, 1));

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error updating branding:", error);
        return { error: "Error guardando configuración" };
    }
}

// --- PERSONAL WORKSPACE ACTIONS ---

export async function getUserNotes(userId: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) return []; // Security check

    const notes = await db.query.userNotes.findMany({
        where: eq(userNotes.userId, userId),
        orderBy: [desc(userNotes.createdAt)],
    });
    return notes;
}

export async function saveWorkNote(note: any) { // Using any to avoid strict type mismatch with frontend for now
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Ensure note belongs to user
    if (note.userId && note.userId !== session.user.id) return { success: false, error: "Unauthorized" };

    const noteData = {
        ...note,
        userId: session.user.id, // Enforce
        updatedAt: new Date(),
    };

    if (!noteData.date) noteData.date = new Date().toISOString().split('T')[0];

    try {
        const existing = await db.query.userNotes.findFirst({ where: eq(userNotes.id, note.id) });

        if (existing) {
            await db.update(userNotes).set(noteData).where(eq(userNotes.id, note.id));
        } else {
            if (!noteData.createdAt) noteData.createdAt = new Date();
            await db.insert(userNotes).values(noteData);
        }
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Error saving note:", error);
        return { success: false, error: "Failed to save" };
    }
}

export async function deleteWorkNote(noteId: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await db.delete(userNotes).where(and(eq(userNotes.id, noteId), eq(userNotes.userId, session.user.id)));
    revalidatePath('/dashboard');
    return { success: true };
}

export async function getPendingTasks(userId: string) {
    // Return pending workflow cases
    return await db.query.workflowCases.findMany({
        where: and(eq(workflowCases.assigneeId, userId), eq(workflowCases.status, 'PENDING')),
        orderBy: [desc(workflowCases.createdAt)],
        limit: 5
    });
}

export async function getUserRecents(userId: string) {
    return await db.query.userRecents.findMany({
        where: eq(userRecents.userId, userId),
        orderBy: [desc(userRecents.lastVisitedAt)],
        limit: 5
    });
}

export async function trackUserRecent(resourceId: string, resourceType: 'PROJECT' | 'DOC', title: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    try {
        const existing = await db.query.userRecents.findFirst({
            where: and(eq(userRecents.userId, session.user.id), eq(userRecents.resourceId, resourceId))
        });

        if (existing) {
            await db.update(userRecents).set({ lastVisitedAt: new Date(), title }).where(eq(userRecents.id, existing.id));
        } else {
            // Check count
            const all = await getUserRecents(session.user.id);
            if (all.length >= 10) {
                // Delete oldest (not implemented for speed, just allow grow slightly)
            }

            await db.insert(userRecents).values({
                userId: session.user.id,
                resourceId,
                resourceType,
                title,
                lastVisitedAt: new Date()
            });
        }
        revalidatePath('/dashboard');
    } catch (e) {
        console.error("Error tracking recent:", e);
    }
}
