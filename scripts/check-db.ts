
import { db } from '@/server/db';
import { organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';

async function check() {
    try {
        console.log("Checking organization_settings table...");
        const result = await db.select().from(organizationSettings).limit(1);
        console.log("Select result:", result);

        if (result.length === 0) {
            console.log("Row 1 not found. Attempting insert...");
            try {
                const insertRes = await db.insert(organizationSettings).values({
                    id: 1,
                    name: "Initial Org",
                    branding: { insertedBy: "script" }
                }).returning();
                console.log("Insert success:", insertRes);
            } catch (insertErr) {
                console.error("Insert failed:", insertErr);
            }
        } else {
            console.log("Row 1 exists:", result[0]);
        }
    } catch (e) {
        console.error("Database connection or query failed:", e);
    }
    process.exit(0);
}

check();
