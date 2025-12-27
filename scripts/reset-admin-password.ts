import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🔄 Resetting Super Admin password...");
    const email = "proyectos@algoritmot.com";
    const newPassword = "Proyectos2026*";

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        console.error("❌ User NOT found in database.");
        return;
    }

    console.log(`✅ User found: ${user.email} (ID: ${user.id})`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users)
        .set({
            password: hashedPassword,
            mustChangePassword: true  // Force password change on first login
        })
        .where(eq(users.id, user.id));

    console.log("✅ Password reset successfully!");
    console.log("   New password:", newPassword);
    console.log("   Must change password:", true);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
