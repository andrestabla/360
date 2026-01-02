'use server';

import { auth } from '@/lib/auth';
import { db } from '@/server/db';
import { documents, users } from '@/shared/schema';
import { ilike, or, and, eq, desc, inArray } from 'drizzle-orm';

export async function searchDocumentsAction(query: string = '') {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        const searchTerm = `%${query}%`;

        // Search for APPROVED or ACTIVE documents matching the query
        const results = await db.query.documents.findMany({
            where: and(
                or(
                    eq(documents.status, 'APPROVED'),
                    eq(documents.status, 'ACTIVE')
                ),
                or(
                    ilike(documents.title, searchTerm),
                    // ilike(documents.content, searchTerm) // Content might be null or large, focusing on title for now
                )
            ),
            limit: 20,
            orderBy: [desc(documents.createdAt)],
            with: {
                owner: true // Fetch creator/owner details if needed
            }
        });

        // Map to the Doc interface expected by the frontend if needed, 
        // or return as is and adjust frontend to match DB schema.
        // The DB schema is very similar to the Doc interface.

        return { success: true, data: results };

    } catch (e: any) {
        console.error('Search Documents Error:', e);
        return { success: false, error: e.message };
    }
}
