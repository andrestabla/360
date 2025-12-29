'use server';

import { db } from '@/server/db';
import { users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hashPassword, generateSecurePassword } from '@/lib/utils/passwordUtils';
import { generateWelcomeEmail } from '@/lib/email/templates/welcomeEmail';
import { sendEmail } from '@/lib/services/tenantEmailService';

export async function getUsersAction() {
    try {
        const result = await db.select().from(users);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, error: 'Error al obtener usuarios' };
    }
}

export async function createUserAction(userData: any, sendInvitation: boolean = false) {
    try {
        // Check email uniqueness
        const existing = await db.query.users.findFirst({
            where: eq(users.email, userData.email)
        });

        if (existing) {
            return { success: false, error: 'El email ya está registrado' };
        }

        // Generate password if not provided
        const temporaryPassword = userData.password || generateSecurePassword();
        const hashedPassword = await hashPassword(temporaryPassword);

        const newUser = {
            id: userData.id || `user-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'Usuario',
            level: userData.level || 3,
            unit: userData.unit || null,
            jobTitle: userData.jobTitle || null,
            phone: userData.phone || null,
            location: userData.location || null,
            status: userData.status || 'ACTIVE',
            initials: userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
            mustChangePassword: true,
            inviteSentAt: sendInvitation ? new Date() : null,
            inviteExpiresAt: sendInvitation ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null, // 7 days
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.insert(users).values(newUser);

        // Send welcome email if requested
        let emailResult: { success: boolean; error?: string } | undefined;
        if (sendInvitation) {
            try {
                const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
                const emailContent = generateWelcomeEmail({
                    userName: newUser.name,
                    userEmail: newUser.email,
                    temporaryPassword,
                    loginUrl,
                });

                emailResult = await sendEmail({
                    to: newUser.email,
                    subject: emailContent.subject,
                    html: emailContent.html,
                });

                if (!emailResult.success) {
                    console.error('Email failed to send during user creation:', emailResult.error);
                }
            } catch (emailError) {
                console.error('Error sending welcome email:', emailError);
                emailResult = { success: false, error: String(emailError) };
            }
        }

        revalidatePath('/dashboard/admin/users');

        // Return result with email status
        // Return result with email status - SANITIZED for Client Component
        // We avoid returning the full user object to prevent Date serialization issues
        const result = {
            success: true,
            userId: newUser.id,
            temporaryPassword: sendInvitation ? undefined : temporaryPassword,
            emailSent: sendInvitation ? (emailResult?.success || false) : undefined,
            emailError: (sendInvitation && emailResult && !emailResult.success) ? emailResult.error : undefined
        };

        return result;
    } catch (error: any) {
        console.error('Error creating user:', error);
        return { success: false, error: 'Error al crear usuario' };
    }
}

export async function updateUserAction(userId: string, updates: any) {
    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!existingUser) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        // If email is being updated, check uniqueness
        if (updates.email && updates.email !== existingUser.email) {
            const emailTaken = await db.query.users.findFirst({
                where: eq(users.email, updates.email)
            });
            if (emailTaken) {
                return { success: false, error: 'El email ya está registrado' };
            }
        }

        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }

        await db.update(users)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(users.id, userId));

        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating user:', error);
        return { success: false, error: 'Error al actualizar usuario' };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        await db.delete(users).where(eq(users.id, userId));
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: 'Error al eliminar usuario' };
    }
}

export async function sendWelcomeEmailAction(userId: string, temporaryPassword: string) {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (!user) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
        const emailContent = generateWelcomeEmail({
            userName: user.name,
            userEmail: user.email || '',
            temporaryPassword,
            loginUrl,
        });

        const emailResult = await sendEmail({
            to: user.email || '',
            subject: emailContent.subject,
            html: emailContent.html,
        });

        if (!emailResult.success) {
            return { success: false, error: `Error enviando email: ${emailResult.error}` };
        }

        // Update invite timestamps
        await db.update(users)
            .set({
                inviteSentAt: new Date(),
                inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .where(eq(users.id, userId));

        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: 'Error al enviar email de bienvenida' };
    }
}
