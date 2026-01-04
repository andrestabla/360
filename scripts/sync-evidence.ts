
import { db } from '@/server/db';
import { documents, projectActivities } from '@/shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Starting evidence sync...');

    // Fetch all activities with documents
    const activities = await db.select().from(projectActivities);
    console.log(`Found ${activities.length} activities.`);

    let fixedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const activity of activities) {
        const docs = activity.documents as any[];
        if (!docs || !Array.isArray(docs) || docs.length === 0) continue;

        for (const doc of docs) {
            if (!doc.id || !doc.url) continue;

            // Check if doc exists
            const existing = await db.select().from(documents).where(eq(documents.id, doc.id));

            if (existing.length === 0) {
                console.log(`Fixing missing doc: ${doc.id} (${doc.name})`);
                try {
                    // Insert missing document
                    // infer owner from activity or default to a system user or the first participant?
                    // For now, we'll try to use a valid user ID if we can find one, or just the creator of the activity/project if available.
                    // Since we don't have easy access to creator here without joins, and we just want to fix the FK, 
                    // we will try to set ownerId to the first participant or a generic admin if possible. 
                    // Actually, 'documents.ownerId' allows null? 
                    // Schema says: ownerId: varchar... references users.id { onDelete: 'cascade' }
                    // It doesn't say "notNull()". Let's check schema.ts line 223.
                    // ownerId: varchar... references... 
                    // It does NOT have .notNull(). So we can set it to null?
                    // Schema line 223: ownerId: varchar("owner_id", { length: 255 }).references(() => users.id, { onDelete: 'cascade' }),
                    // Default is nullable unless .notNull() is called.

                    await db.insert(documents).values({
                        id: doc.id,
                        title: doc.name || 'Untitled Evidence',
                        type: doc.mimeType || 'application/octet-stream',
                        url: doc.url,
                        status: 'APPROVED',
                        version: '1.0',
                        process: 'PROJECT_EVIDENCE_MIGRATED',
                        // ownerId: null // Let's try null. If it fails, we need a user.
                    });
                    fixedCount++;
                } catch (e) {
                    console.error(`Failed to insert ${doc.id}:`, e);
                    errorCount++;
                }
            } else {
                skippedCount++;
            }
        }
    }

    console.log(`Sync complete. Fixed: ${fixedCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
