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

    // Optional: Send Email Notification to Assignee

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
