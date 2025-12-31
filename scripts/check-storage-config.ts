import { db } from '../server/db';
import { organizationSettings } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function checkConfig() {
    console.log('Checking storage configuration...');
    const settings = await db.select().from(organizationSettings).limit(1);

    if (settings.length === 0) {
        console.log('No organization settings found.');
    } else {
        const config = settings[0].storageConfig;
        console.log('Storage Config:', JSON.stringify(config, null, 2));

        if (!config) {
            console.log('❌ No storage configuration present (null).');
        } else {
            console.log('✅ Configuration found.');
        }
    }
}

checkConfig().catch(console.error).finally(() => process.exit(0));
