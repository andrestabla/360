'use server'

import { signIn, signOut, auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { db } from '@/server/db';
import { users, organizationSettings, userNotes, workflowCases, userRecents, emailSettings } from '@/shared/schema';
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

import { getStorageService } from '@/lib/services/storageService';

// --- Actualizar Perfil de Usuario ---
export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const name = formData.get('name') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    const bio = formData.get('bio') as string;
    const language = formData.get('language') as string;
    const timezone = formData.get('timezone') as string;

    let avatarUrl = formData.get('avatar') as string | File;
    let finalAvatarUrl: string | undefined;

    // Handle File upload if present
    if (avatarUrl instanceof File) {
        if (avatarUrl.size > 5 * 1024 * 1024) {
            return { error: "La imagen no puede superar los 5MB" };
        }

        try {
            const storageService = getStorageService();
            // Refactored: No tenantId passed anymore
            const uploadResult = await storageService.upload(avatarUrl, 'avatars');

            if (uploadResult.success && uploadResult.url) {
                finalAvatarUrl = uploadResult.url;
            } else {
                console.error("Avatar upload failed:", uploadResult.error);
                return { error: "Error subiendo la imagen: " + uploadResult.error };
            }
        } catch (uploadError) {
            console.error("Avatar upload failed:", uploadError);
            return { error: "Error subiendo la imagen" };
        }
    } else if (typeof avatarUrl === 'string' && avatarUrl.startsWith('http')) {
        // If it's already a URL (existing avatar), keep it
        finalAvatarUrl = avatarUrl;
    }

    try {
        const updateData: any = {
            name,
            jobTitle,
            phone,
            location,
            bio,
            language,
            timezone,
            updatedAt: new Date()
        };

        if (finalAvatarUrl) {
            updateData.image = finalAvatarUrl;
            updateData.avatar = finalAvatarUrl;
        }

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard'); // Para que el sidebar/topbar se actualicen
        console.log('[updateProfile] Success. Final Avatar URL:', updateData.avatar);
        return { success: true, avatarUrl: finalAvatarUrl };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Error al guardar cambios" };
    }
}

// --- Actualizar Preferencias (HU I.3) ---
export async function updateUserPreferences(preferences: {
    theme?: 'light' | 'dark' | 'system',
    notifications?: boolean,
    sidebarCollapsed?: boolean
}) {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    try {
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
        if (!user) return { error: "Usuario no encontrado" };

        const currentPrefs = user.preferences as any || {};
        const updatedPrefs = { ...currentPrefs, ...preferences };

        await db.update(users)
            .set({
                preferences: updatedPrefs,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Error updating preferences:", error);
        return { error: "Error al guardar preferencias" };
    }
}

// --- Actualizar Contraseña (HU I.2) ---
export async function updatePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'No autorizado' };
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
        return { success: false, error: 'Las contraseñas no coinciden' };
    }

    // Validate password requirements (HU I.2)
    if (newPassword.length < 8) {
        return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }

    // Check for at least one number
    if (!/\d/.test(newPassword)) {
        return { success: false, error: 'La contraseña debe contener al menos un número' };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
        return { success: false, error: 'La contraseña debe contener al menos un carácter especial' };
    }

    try {
        // Get current user from database
        const [user] = await db.select().from(users).where(eq(users.id, session.user.id));

        if (!user || !user.password) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return { success: false, error: 'La contraseña actual es incorrecta' };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.update(users)
            .set({
                password: hashedPassword,
                mustChangePassword: false,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, error: 'Error al cambiar la contraseña' };
    }
}

// --- Actualizar Apariencia (Organization) ---
export async function updateOrganizationBranding(settings: any) {
    const session = await auth();
    // Simplified role check
    const role = (session?.user as any)?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'PLATFORM_ADMIN') {
        // return { error: "No tienes permisos" };
    }

    try {
        console.log("[updateOrganizationBranding] Starting update. Keys:", Object.keys(settings));

        // Use organizationSettings as defined in imports
        const current = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1)).limit(1);
        console.log("[updateOrganizationBranding] Row 1 match:", !!current[0]);

        if (current.length === 0) {
            // Insert if not exists
            console.log("[updateOrganizationBranding] Inserting new singleton row");
            await db.insert(organizationSettings).values({
                id: 1,
                branding: settings,
                name: settings.orgName || 'My Organization',
                plan: 'ENTERPRISE'
            });
        } else {
            // Update existing
            console.log("[updateOrganizationBranding] Updating existing row");
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
        }

        revalidatePath('/');
        console.log("[updateOrganizationBranding] Success");
        return { success: true };
    } catch (error: any) {
        console.error("[updateOrganizationBranding] CRITICAL ERROR:", error);
        // Serialize error safely
        const errorMsg = error.message || String(error);
        return { error: `DB Error: ${errorMsg}` };
    }
}

export async function getOrganizationSettings() {
    try {
        const settings = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1)).limit(1);
        return settings[0] || null;
    } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
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

// --- EMAIL ACTIONS ---
import nodemailer from 'nodemailer';

export async function getEmailSettings() {
    try {
        const settings = await db.select().from(emailSettings).where(eq(emailSettings.id, 1)).limit(1);
        return settings[0] || null;
    } catch (error) {
        console.error("Error fetching email settings:", error);
        return null;
    }
}

export async function updateEmailSettings(settings: any) {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'PLATFORM_ADMIN') {
        return { error: "No tienes permisos" };
    }

    try {
        const current = await db.select().from(emailSettings).where(eq(emailSettings.id, 1)).limit(1);

        const dataToUpdate = {
            ...settings,
            updatedAt: new Date()
        };

        if (current.length === 0) {
            await db.insert(emailSettings).values({
                id: 1,
                ...dataToUpdate
            });
        } else {
            await db.update(emailSettings)
                .set(dataToUpdate)
                .where(eq(emailSettings.id, 1));
        }

        revalidatePath('/dashboard/admin/settings');
        return { success: true };
    } catch (error: any) {
        console.error("Error updating email settings:", error);
        return { error: error.message };
    }
}

export async function testSmtpConnection(settings: any, targetEmail: string) {
    const session = await auth();
    if (!session?.user) return { error: "No autorizado" };

    try {
        const port = parseInt(settings.smtpPort);

        // Logical default: Secure (SSL) only on 465, otherwise False (STARTTLS)
        // This fixes common confusing errors with AWS SES / Gmail on 587
        const isSecure = settings.smtpSecure !== undefined
            ? settings.smtpSecure
            : port === 465;

        const transportConfig = {
            host: settings.smtpHost,
            port: port,
            secure: isSecure,
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPassword || settings.smtpPasswordEncrypted,
            },
            tls: {
                // Do not fail on self-signed certs, common in corp intranets
                rejectUnauthorized: false
            }
        };

        const transporter = nodemailer.createTransport(transportConfig);

        // Verify connection config
        await transporter.verify();

        // Send test email
        await transporter.sendMail({
            from: `"${settings.fromName || 'System'}" <${settings.fromEmail || settings.smtpUser}>`,
            to: targetEmail,
            subject: `Test de Conexión - ${settings.orgName || 'Maturity 360'}`,
            text: `Este es un correo de prueba para verificar la configuración SMTP.\n\nConfiguración usada:\nHost: ${settings.smtpHost}\nPuerto: ${settings.smtpPort}\nUsuario: ${settings.smtpUser}\n\nSi recibes esto, la conexión es exitosa.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">Conexión Exitosa</h2>
                    <p>La configuración SMTP de <strong>${settings.orgName || 'Maturity 360'}</strong> funciona correctamente.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #666;">
                        <strong>Detalles Técnicos:</strong><br/>
                        Host: ${settings.smtpHost}<br/>
                        Puerto: ${settings.smtpPort}<br/>
                        Usuario: ${settings.smtpUser}
                    </p>
                </div>
            `
        });

        // Update DB with success status
        await db.update(emailSettings).set({
            lastTestedAt: new Date(),
            lastTestResult: true,
            lastTestError: null,
            isEnabled: true
        }).where(eq(emailSettings.id, 1));

        return { success: true };

    } catch (error: any) {
        console.error("SMTP Test Error:", error);

        // Update DB with failure
        await db.update(emailSettings).set({
            lastTestedAt: new Date(),
            lastTestResult: false,
            lastTestError: error.message,
            isEnabled: false
        }).where(eq(emailSettings.id, 1));

        return { error: error.message };
    }
}
