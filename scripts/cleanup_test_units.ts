
import { db } from '../server/db';
import { units } from '../shared/schema';
import { ilike, eq } from 'drizzle-orm';

async function main() {
    console.log('🧹 Cleaning up test units...');

    try {
        // Find units with "Prueba Script" in the name
        const testUnits = await db.select().from(units).where(ilike(units.name, '%Prueba Script%'));

        if (testUnits.length === 0) {
            console.log('✅ No test units found.');
            return;
        }

        console.log(`Found ${testUnits.length} test units. Deleting...`);

        for (const unit of testUnits) {
            await db.delete(units).where(eq(units.id, unit.id));
            console.log(`- Deleted unit: ${unit.name} (${unit.id})`);
        }

        console.log('✅ Cleanup complete.');
    } catch (error) {
        console.error('❌ Error cleaning up:', error);
        process.exit(1);
    }
}

main();
