
import { getUnitsAction, createUnitAction, getEligibleUsersAction, deleteUnitAction } from '../app/lib/unitActions';
import { db } from '../server/db';
import { units } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('--- Starting Units Module Verification ---');

    // 1. Fetch Existing Units
    console.log('\n1. Fetching Units...');
    const unitsResult = await getUnitsAction();
    if (unitsResult.success) {
        console.log(`✅ Success. Found ${Array.isArray(unitsResult.data) ? unitsResult.data.length : 0} units.`);
        if (Array.isArray(unitsResult.data) && unitsResult.data.length > 0) {
            console.log('Sample unit:', JSON.stringify(unitsResult.data[0], null, 2));
        }
    } else {
        console.error('❌ Failed to fetch units:', unitsResult.error);
    }

    // 2. Fetch Eligible Users
    console.log('\n2. Fetching Eligible Users...');
    const usersResult = await getEligibleUsersAction();
    if (usersResult.success) {
        console.log(`✅ Success. Found ${Array.isArray(usersResult.data) ? usersResult.data.length : 0} users.`);
        if (Array.isArray(usersResult.data) && usersResult.data.length > 0) {
            console.log('Sample user:', JSON.stringify(usersResult.data[0], null, 2));
        }
    } else {
        console.error('❌ Failed to fetch users:', usersResult.error);
    }

    // 3. Create Test Unit
    console.log('\n3. Creating Test Unit...');
    const testUnitCode = `TEST_${Date.now()}`;
    const createResult = await createUnitAction({
        name: 'Unit de Prueba Script',
        code: testUnitCode,
        type: 'UNIT',
        description: 'Creada por script de verificacion'
    });

    if (createResult.success && createResult.unit) {
        console.log('✅ Unit created successfully:', createResult.unit.id);

        // 4. Verify Persistence
        console.log('\n4. Verifying Persistence...');
        const verify = await db.query.units.findFirst({
            where: eq(units.id, createResult.unit.id)
        });
        if (verify) {
            console.log('✅ Unit found in DB.');
        } else {
            console.error('❌ Unit NOT found in DB after creation.');
        }

        // 5. Cleanup
        console.log('\n5. Cleaning up...');
        await deleteUnitAction(createResult.unit.id);
        console.log('✅ Test unit deleted.');

    } else {
        console.error('❌ Failed to create unit:', createResult.error);
    }

    console.log('\n--- Verification Complete ---');
    process.exit(0);
}

main().catch(console.error);
