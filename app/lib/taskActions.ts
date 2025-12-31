'use server';

import { db } from '@/server/db';
import { tasks, users, documents } from '@/shared/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

// --- Types ---
export type Task = typeof tasks.$inferSelect;

function serialize<T>(obj: T): any {
    return JSON.parse(JSON.stringify(obj));
}

// --- ACTIONS ---

import { sendNotificationEmail } from '@/lib/services/emailService';

export async function createTaskAction(data: {
    type: string;
    documentId: string;
    assigneeId: string;
    priority?: string;
    dueDate?: Date;
    instructions?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [newTask] = await db.insert(tasks).values({
        id: `task-${Date.now()}`,
        type: data.type,
        documentId: data.documentId,
        assigneeId: data.assigneeId,
        creatorId: session.user.id,
        status: 'PENDING',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate,
        instructions: data.instructions,
    }).returning();

    // Send Email Notification to Assignee
    try {
        // 1. Get Assignee Email
        const assignee = await db.query.users.findFirst({
            where: eq(users.id, data.assigneeId),
            columns: { email: true, name: true }
        });

        // 2. Get Document Title
        const document = await db.query.documents.findFirst({
            where: eq(documents.id, data.documentId),
            columns: { title: true }
        });

        if (assignee?.email && document) {
            const urgency = data.priority === 'HIGH' ? '🔴 Alta' : data.priority === 'LOW' ? '🟢 Baja' : '🟡 Media';
            const dueDateStr = data.dueDate ? new Date(data.dueDate).toLocaleDateString('es-ES') : 'Sin fecha';

            await sendNotificationEmail(
                assignee.email,
                `Nueva Tarea Asignada: ${data.type} - ${document.title}`,
                `
                Hola ${assignee.name},<br><br>
                Se te ha asignado una nueva tarea en el documento <strong>${document.title}</strong>.<br><br>
                <strong>Tipo:</strong> ${data.type}<br>
                <strong>Prioridad:</strong> ${urgency}<br>
                <strong>Vencimiento:</strong> ${dueDateStr}<br>
                <strong>Instrucciones:</strong> ${data.instructions || 'Sin instrucciones adicionales'}<br><br>
                Por favor ingresa a la plataforma para gestionar esta tarea.
                `
            );
        }
    } catch (emailError) {
        console.error("Error sending task notification email:", emailError);
        // We don't fail the action if email fails, just log it
    }

    revalidatePath('/dashboard/repository');
    return serialize(newTask);
}

export async function getTasksByDocumentAction(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const res = await db.select({
        task: tasks,
        assignee: {
            id: users.id,
            name: users.name,
            email: users.email,
        },
        creator: {
            id: users.id,
            name: users.name,
        }
    })
        .from(tasks)
        .leftJoin(users, eq(tasks.assigneeId, users.id))
        .where(eq(tasks.documentId, documentId))
        .orderBy(desc(tasks.createdAt));

    return serialize(res);
}

export async function getMyTasksAction() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const res = await db.select({
        task: tasks,
        document: {
            id: documents.id,
            title: documents.title,
        },
        creator: {
            name: users.name
        }
    })
        .from(tasks)
        .leftJoin(documents, eq(tasks.documentId, documents.id))
        .leftJoin(users, eq(tasks.creatorId, users.id))
        .where(eq(tasks.assigneeId, session.user.id))
        .orderBy(desc(tasks.createdAt));

    return serialize(res);
}
