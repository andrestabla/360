
import fs from 'fs';
import path from 'path';

// Load .env manually since we don't have dotenv
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value.trim();
        }
    });
}

import { pool } from "../server/db";

async function main() {
    const client = await pool.connect();
    try {
        console.log("Dropping conflicting tables...");
        // Cascade drop to remove relations
        await client.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS "account" CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS "session" CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS "verificationToken" CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS "authenticator" CASCADE;`);
        // Also drop document table if it was conflicting heavily, but let's stick to Auth mainly first or just do all
        await client.query(`DROP TABLE IF EXISTS "documents" CASCADE;`);
        console.log("Tables dropped successfully.");
    } catch (error) {
        console.error("Error dropping tables:", error);
    } finally {
        client.release();
        process.exit(0);
    }
}

main();
