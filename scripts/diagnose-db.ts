
import { db } from '../server/db';
import { users } from '../shared/schema';
import { sql } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// Manually load .env since dotenv might not be installed
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        });
    }
} catch (e) {
    console.warn('⚠️ Could not load .env file');
}

async function diagnose() {
    console.log('🔍 Starting Database Diagnosis...');

    try {
        // 1. Check Connection & User Count
        const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
        console.log(`✅ Connection Successful. Users count: ${userCount[0].count}`);

        // 2. Check for Duplicates
        const duplicates = await db.execute(sql`
      SELECT email, COUNT(*)
      FROM users
      GROUP BY email
      HAVING COUNT(*) > 1
    `);

        if (duplicates.rows.length > 0) {
            console.log('⚠️  Duplicate emails found:');
            duplicates.rows.forEach((row: any) => {
                console.log(`   - ${row.email}: ${row.count} instances`);
            });
            console.log('❌ This prevents applying the UNIQUE constraint on email.');
        } else {
            console.log('✅ No duplicate emails found.');
        }

        // 3. Check for other potential issues (optional)
        // ...

    } catch (error) {
        console.error('❌ Database Diagnosis Failed:', error);
    }
}

diagnose()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
