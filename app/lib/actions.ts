'use server'

import { signIn, signOut, auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

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
