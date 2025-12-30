'use server';

import { db } from '@/server/db';
import { users, auditLogs, units } from '@/shared/schema';
import { eq, desc, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hashPassword, generateSecurePassword } from '@/lib/utils/passwordUtils';
import { generateWelcomeEmail } from '@/lib/email/templates/welcomeEmail';
import { sendEmail } from '@/lib/services/tenantEmailService';

export async function getUsersAction() {
    try {
        const result = await db.select().from(users);
        // Serialize Dates to strings safely - handle both Date objects and strings from DB driver
        const serializedData = result.map(user => ({
            ...user,
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
            updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
            inviteSentAt: user.inviteSentAt ? new Date(user.inviteSentAt).toISOString() : null,
            inviteExpiresAt: user.inviteExpiresAt ? new Date(user.inviteExpiresAt).toISOString() : null,
        }));
        return { success: true, data: serializedData };
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

        revalidatePath('/dashboard/admin/users');
        return { success: true, error: undefined }; // Explicit strict return shape
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: 'Error al enviar email de bienvenida' };
    }
}

export async function getUserActivityAction(userId: string) {
    try {
        const logs = await db.select()
            .from(auditLogs)
            .where(eq(auditLogs.userId, userId))
            .orderBy(desc(auditLogs.createdAt))
            .limit(50);

        return {
            success: true,
            data: logs.map(log => ({
                ...log,
                createdAt: log.createdAt ? new Date(log.createdAt).toISOString() : null,
                details: log.details as Record<string, any>
            }))
        };
    } catch (error) {
        console.error('Error fetching user activity:', error);
        return { success: false, error: 'Error al obtener actividad' };
    }
}

export async function getAuditLogsAction() {
    try {
        const logs = await db.select({
            id: auditLogs.id,
            createdAt: auditLogs.createdAt,
            action: auditLogs.action,
            actorId: auditLogs.userId,
            actorName: users.name, // Join to get name
            resource: auditLogs.resource,
            resourceId: auditLogs.resourceId,
            details: auditLogs.details,
            ipAddress: auditLogs.ipAddress
        })
            .from(auditLogs)
            .leftJoin(users, eq(auditLogs.userId, users.id))
            .orderBy(desc(auditLogs.createdAt))
            .limit(200);

        return {
            success: true,
            data: logs.map(log => ({
                id: log.id,
                created_at: log.createdAt ? new Date(log.createdAt).toISOString() : new Date().toISOString(),
                event_type: log.action,
                actor_id: log.actorId,
                actor_name: log.actorName || 'Sistema / Desconocido',
                target_user_id: log.resource === 'USER' ? log.resourceId : null,
                ip: log.ipAddress || '-',
                metadata: log.details as Record<string, any>
            }))
        };
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return { success: false, error: 'Error al obtener registros de auditoría' };
    }
}

export async function getAdminStatsAction() {
    try {
        const usersCount = await db.select({ count: count() }).from(users);
        const unitsCount = await db.select({ count: count() }).from(units);
        const auditCount = await db.select({ count: count() }).from(auditLogs);

        return {
            success: true,
            data: {
                users: usersCount[0]?.count || 0,
                units: unitsCount[0]?.count || 0,
                audits: auditCount[0]?.count || 0,
                securityScore: 'N/A'
            }
        };
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return { success: false, error: 'Error al calcular estadísticas' };
    }
}
