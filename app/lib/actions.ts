'use server'

import { signIn, signOut, auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { db } from '@/server/db';
import { users, organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';
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
