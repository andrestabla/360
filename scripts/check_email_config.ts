
import { db } from "../server/db";
import { emailSettings } from "../shared/schema";
import { desc } from "drizzle-orm";
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey(): Buffer {
    const keyString = process.env.EMAIL_ENCRYPTION_KEY;
    console.log("Key String details:", keyString ? `Length: ${keyString.length}` : "Not set");
    if (!keyString) {
        console.log("Using fallback development key");
        return crypto.scryptSync('dev-only-key-not-for-production-use', 'salt', 32);
    }
    return crypto.scryptSync(keyString, 'maturity360-salt', 32);
}

function decryptPassword(encrypted: string): string {
    try {
        if (encrypted.startsWith('v2:')) {
            const parts = encrypted.split(':');
            if (parts.length !== 4) throw new Error('Invalid encrypted format');

            const [, ivHex, authTagHex, encryptedHex] = parts;
            const key = getEncryptionKey();
            const iv = Buffer.from(ivHex, 'hex');
            const authTag = Buffer.from(authTagHex, 'hex');

            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        return Buffer.from(encrypted, 'base64').toString('utf-8');
    } catch (error) {
        console.error('Decryption error:', error);
        return 'Failed to decrypt';
    }
}

async function main() {
    console.log("Fetching email settings...");
    try {
        const configs = await db.select().from(emailSettings);
        console.log(`Found ${configs.length} configs.`);

        for (const config of configs) {
            console.log("--- Config ID:", config.id, "---");
            console.log("Provider:", config.provider);
            console.log("Host:", config.smtpHost);
            console.log("User:", config.smtpUser);
            console.log("From:", config.fromEmail);
            console.log("Encrypted Pass length:", config.smtpPasswordEncrypted?.length);

            if (config.smtpPasswordEncrypted) {
                const decrypted = decryptPassword(config.smtpPasswordEncrypted);
                console.log("Decrypted Password (masked):", decrypted === 'Failed to decrypt' ? 'FAILED' : decrypted.substring(0, 3) + '...');
            }
        }
    } catch (err) {
        console.error("Db error:", err);
    }
    process.exit(0);
}

main();
