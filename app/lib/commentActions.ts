'use server';

import { db } from '@/server/db';
import { comments, documents, users } from '@/shared/schema';
import { auth } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createCommentAction(documentId: string, content: string, rest: { x?: number, y?: number, page?: number, version?: string } = {}) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Validate user exists in DB to prevent FK errors (stale sessions)
    const userExists = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    if (!userExists) {
        throw new Error('USER_NOT_FOUND'); // Specific error code for frontend to handle
    }

    try {
        const id = `comment-${Date.now()}`;

        await db.transaction(async (tx) => {
            // Create comment
            await tx.insert(comments).values({
                id,
                documentId,
                userId: session.user!.id,
                content,
                // Optional fields for contextual comments
                x: (rest as any).x,
                y: (rest as any).y,
                page: (rest as any).page,
                version: (rest as any).version,
            });

            // Increment comment count on doc
            const doc = await tx.query.documents.findFirst({
                where: eq(documents.id, documentId)
            });

            if (doc) {
                await tx.update(documents)
                    .set({ commentsCount: (doc.commentsCount || 0) + 1 })
                    .where(eq(documents.id, documentId));
            }
        });

        revalidatePath('/dashboard/repository');
        return { success: true, id };
    } catch (error: any) {
        console.error('Error creating comment:', error);
        return { success: false, error: error.message };
    }
}

export async function getCommentsAction(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const results = await db
            .select({
                id: comments.id,
                content: comments.content,
                createdAt: comments.createdAt,
                x: comments.x,
                y: comments.y,
                page: comments.page,
                user: {
                    id: users.id,
                    name: users.name,
                    image: users.image,
                    initials: users.initials
                }
            })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(eq(comments.documentId, documentId))
            .orderBy(desc(comments.createdAt));

        return { success: true, data: results };
    } catch (error: any) {
        console.error('Error fetching comments:', error);
        return { success: false, error: error.message };
    }
}
