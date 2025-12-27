import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
    console.log("📋 Listing all users in database...\n");

    const allUsers = await db.select()
        .from(users);

    for (const user of allUsers) {
        console.log("─────────────────────────────────────");
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Must Change Password: ${user.mustChangePassword}`);
        console.log(`Has Password: ${!!user.password}`);
        console.log(`Password Hash: ${user.password?.substring(0, 30)}...`);
        console.log(`Created: ${user.createdAt}`);
        console.log(`Last Login: ${user.lastLogin}`);
    }

    console.log("─────────────────────────────────────");
    console.log(`\nTotal users: ${allUsers.length}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
