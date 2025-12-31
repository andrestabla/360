'use server';

import { sendNotificationEmail } from '@/lib/services/tenantEmailService';
import { db } from '@/server/db';
import { workflowCases, users } from '@/shared/schema';
import { eq, or } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth'; // Check path
import { revalidatePath } from 'next/cache';

interface ActivityAssignmentDetails {
    projectId: string; // Added field
    projectName: string;
    phaseName: string;
    activityName: string;
    startDate?: string;
    endDate?: string;
    assigneeEmail: string;
    assigneeName: string;
}

export async function sendAssignmentNotification(details: ActivityAssignmentDetails) {
    try {
        const title = `Nueva asignación: ${details.activityName}`;

        const message = `
            Hola ${details.assigneeName},
            
            Se te ha asignado una nueva actividad en el proyecto <strong>${details.projectName}</strong>.
            
            <br/><br/>
            <strong>Detalles de la actividad:</strong><br/>
            <ul>
                <li><strong>Fase:</strong> ${details.phaseName}</li>
                <li><strong>Actividad:</strong> ${details.activityName}</li>
                <li><strong>Fecha Inicio:</strong> ${details.startDate || 'No definida'}</li>
                <li><strong>Fecha Fin:</strong> ${details.endDate || 'No definida'}</li>
            </ul>
            
            <br/>
            Por favor, revisa la plataforma para más detalles.
        `;

        const result = await sendNotificationEmail(
            details.assigneeEmail,
            title,
            message
        );

        // --- INBOX INTEGRATION ---
        try {
            // 1. Ensure user exists (sync/check)
            // In a real scenario, the user should already exist. We'll proceed to create the case for the email.
            // We use the email to find the user ID effectively or assume the frontend passed a valid one if we had it.
            // But details only has email/name. Ideally we pass userId.
            const [user] = await db.select().from(users).where(eq(users.email, details.assigneeEmail)).limit(1);

            if (user) {
                await db.insert(workflowCases).values({
                    id: `case-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    workflowId: 'manual-assignment', // Virtual ID
                    title: `Asignación: ${details.activityName} (${details.projectName})`,
                    status: 'PENDING',
                    creatorId: 'system', // or current user if available
                    assigneeId: user.id,
                    priority: 'MEDIUM',
                    dueDate: details.endDate ? new Date(details.endDate) : undefined,
                    data: {
                        type: 'PROJECT_ASSIGNMENT',
                        projectId: details.projectId,
                        projectName: details.projectName,
                        phaseName: details.phaseName,
                        activityName: details.activityName
                    },
                    createdAt: new Date()
                });
            } else {
                console.warn(`User with email ${details.assigneeEmail} not found in DB for inbox task creation.`);
            }

        } catch (dbError) {
            console.error('Error creating inbox task:', dbError);
            // Don't fail the whole action just because inbox task failed, email was sent.
        }

        return result;
    } catch (error: any) {
        console.error('Error in sendAssignmentNotification:', error);
        return { success: false, error: error.message };
    }
}

// --- INBOX INTEGRATION ---
export async function getWorkflowCasesAction() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const cases = await db.select().from(workflowCases)
            .where(or(
                eq(workflowCases.creatorId, session.user.id),
                eq(workflowCases.assigneeId, session.user.id)
            ));

        return { success: true, data: cases };
    } catch (error: any) {
        console.error("Error fetching workflow cases:", error);
        return { success: false, error: error.message };
    }
}

export async function createWorkflowCaseAction(data: any) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const newCase = {
            id: `case-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            workflowId: data.workflowId || 'custom-request',
            title: data.title,
            description: data.description,
            status: 'PENDING',
            creatorId: session.user.id,
            assigneeId: data.assigneeId || session.user.id, // Auto-assign or specific
            priority: data.priority || 'MEDIUM',
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            data: data.data || {},
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.insert(workflowCases).values(newCase);
        revalidatePath('/dashboard/workflows');
        return { success: true, data: newCase };
    } catch (error: any) {
        console.error("Error creating workflow case:", error);
        return { success: false, error: error.message };
    }
}
