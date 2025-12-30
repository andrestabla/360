
import { db } from '@/server/db';
import { tasks, documents, users } from '@/shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Verifying Task Schema...');

    // 1. Get a user and a document to link
    const user = await db.query.users.findFirst();
    const doc = await db.query.documents.findFirst();

    if (!user || !doc) {
        console.log('No user or document found to test task creation.');
        return;
    }

    console.log(`Using User: ${user.id}, Doc: ${doc.id}`);

    // 2. Create a Task
    try {
        const [newTask] = await db.insert(tasks).values({
            id: `test-task-${Date.now()}`,
            type: 'REVIEW',
            documentId: doc.id,
            assigneeId: user.id,
            creatorId: user.id,
            status: 'PENDING',
            instructions: 'Verify this works'
        }).returning();
        console.log('✅ Task created successfully:', newTask.id);

        // 3. Verify Update of Doc Metadata (simulated)
        await db.update(documents).set({ process: 'Verification_Process_' + Date.now() }).where(eq(documents.id, doc.id));
        const updatedDoc = await db.query.documents.findFirst({ where: eq(documents.id, doc.id) });
        console.log('✅ Document process updated:', updatedDoc?.process);

        // Clean up task
        await db.delete(tasks).where(eq(tasks.id, newTask.id));
        console.log('✅ Test task deleted.');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
}

main().catch(console.error).finally(() => process.exit(0));
