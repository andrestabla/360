
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';

// 1. Load Environment Variables BEFORE importing DB
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
        console.log('✅ Loaded .env file');
    } else {
        console.warn('⚠️ .env file not found at ' + envPath);
    }
} catch (e) {
    console.error('❌ Failed to load .env', e);
}

// 2. Dynamic Import of DB (now that env is set)
async function wipe() {
    console.log('🚀 Starting User Table Cleanup...');
    try {
        const { db } = await import('../server/db');
        const { users } = await import('../shared/schema');

        console.log('🗑️  Truncating users table...');
        await db.execute(sql`TRUNCATE TABLE users CASCADE`);
        console.log('✅ Users table truncated successfully.');

    } catch (error) {
        console.error('❌ Cleanup Failed:', error);
        process.exit(1);
    }
}

wipe()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
