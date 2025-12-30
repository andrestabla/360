import { db } from "../server/db";
import { users, conversations, messages, messageReadReceipts } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

async function main() {
    console.log("🔍 Diagnosing Chat Module Data Access...");

    try {
        // 1. Check Users (Basic Connectivity)
        console.log("1. Checking Users table endpoint...");
        const userCount = await db.select().from(users).limit(1);
        console.log(`   ✅ Users accessible. Found: ${userCount.length} (sample)`);

        // 2. Check Conversations
        console.log("2. Checking Conversations table...");
        const convs = await db.select().from(conversations).limit(5);
        console.log(`   ✅ Conversations accessible. Found: ${convs.length}`);
        if (convs.length > 0) {
            console.log(`   Sample Conversation ID: ${convs[0].id}`);
        }

        // 3. Check Messages
        console.log("3. Checking Messages table...");
        const msgs = await db.select().from(messages).limit(5).orderBy(desc(messages.createdAt));
        console.log(`   ✅ Messages accessible. Found: ${msgs.length}`);

        // 4. Simulated Get Messages for a Conversation (if exists)
        if (convs.length > 0) {
            console.log(`4. simulating getMessages for conversation ${convs[0].id}...`);
            const chatMsgs = await db.select().from(messages)
                .where(eq(messages.conversationId, convs[0].id))
                .limit(10);
            console.log(`   ✅ Fetched ${chatMsgs.length} messages for sample conversation.`);
        } else {
            console.log("   ⚠️ No conversations found to test message retrieval.");
        }

        console.log("✅ DIAGNOSIS COMPLETE: Database appears fully accessible.");

    } catch (e: any) {
        console.error("❌ DIAGNOSIS FAILED");
        console.error("Error:", e.message);
        if (e.message.includes("quota")) {
            console.error("🔴 QUOTA EXCEEDED detectado.");
        }
        process.exit(1);
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
