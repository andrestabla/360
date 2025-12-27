import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function main() {
    console.log("🌱 Seeding Super Admin...");

    const email = "proyectos@algoritmot.com";
    const rawPassword = "Proyectos2026*"; // Should ideally verify this from ENV or args, but explicit as per user request history

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existingUser) {
        console.log(`User ${email} already exists. Skipping.`);
        return;
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await db.insert(users).values({
        id: randomUUID(),
        name: "Super Admin",
        email: email,
        password: hashedPassword,
        role: "SUPER_ADMIN", // Adjust if role string is different in your logic
        level: 1,
        status: "ACTIVE",
        emailVerified: new Date(),
        mustChangePassword: true
    });

    console.log(`✅ Super Admin created: ${email}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
