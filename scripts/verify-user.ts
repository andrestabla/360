import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🔍 Verifying Super Admin...");
    const email = "proyectos@algoritmot.com";
    const password = "Testing2026*";

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error("❌ User NOT found in database.");
        return;
    }

    console.log(`✅ User found: ${user.email} (ID: ${user.id})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Has Password? ${!!user.password}`);

    if (user.password) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            console.log("✅ Password comparison PASSED.");
        } else {
            console.error("❌ Password comparison FAILED.");
            // Re-hash to see what it should be
            const newHash = await bcrypt.hash(password, 10);
            console.log("   New hash would be:", newHash);
            console.log("   Stored hash is:   ", user.password);
        }
    } else {
        console.error("❌ No password stored for user.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
