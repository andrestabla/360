
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Checking for user with ID: U1');
    const user = await db.query.users.findFirst({
        where: eq(users.id, 'U1')
    });

    if (user) {
        console.log('User U1 FOUND:', user.email);
    } else {
        console.log('User U1 NOT FOUND in database.');

        // List all users to see who is there
        const allUsers = await db.select({ id: users.id, email: users.email }).from(users);
        console.log('Existing users:', allUsers);
    }
    process.exit(0);
}

main().catch(console.error);
