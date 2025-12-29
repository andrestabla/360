
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq, ilike } from "drizzle-orm";

async function main() {
    // Find user by partial name or email from screenshot context
    // Screenshot shows user 'Andrés Tabla'

    console.log("Searching for user 'Andrés Tabla'...");

    const candidates = await db.select().from(users).where(ilike(users.name, "%Tabla%"));

    console.log(`Found ${candidates.length} candidates.`);

    candidates.forEach(u => {
        console.log(`ID: ${u.id}`);
        console.log(`Name: ${u.name}`);
        console.log(`Email: ${u.email}`);
        console.log(`Role: '${u.role}'`); // Quote to see whitespace/casing
        console.log('----------------');
    });

    process.exit(0);
}

main();
