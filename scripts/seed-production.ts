import { db } from '../server/db';
import { platformAdmins, tenants, users } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 12;

async function seedProduction() {
  console.log('Starting production database seed...');

  try {
    const existingAdmin = await db.select().from(platformAdmins).where(eq(platformAdmins.email, 'superadmin@maturity.online'));
    
    if (existingAdmin.length > 0) {
      console.log('Super Admin already exists, skipping...');
    } else {
      const hashedPassword = await bcrypt.hash('Admin2024!', SALT_ROUNDS);
      
      await db.insert(platformAdmins).values({
        id: 'admin-1',
        name: 'Super Admin',
        email: 'superadmin@maturity.online',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      });
      console.log('Created Super Admin: superadmin@maturity.online');
    }

    const existingTenants = await db.select().from(tenants);
    
    if (existingTenants.length > 0) {
      console.log(`${existingTenants.length} tenants already exist, skipping tenant creation...`);
    } else {
      const tenantData = [
        { id: 'T1', name: 'Demo Company', slug: 'demo', status: 'active' as const },
        { id: 'T2', name: 'Alpha Corp', slug: 'alpha', status: 'active' as const },
        { id: 'T3', name: 'Beta Industries', slug: 'beta', status: 'active' as const },
      ];

      for (const tenant of tenantData) {
        await db.insert(tenants).values(tenant);
        console.log(`Created tenant: ${tenant.name} (${tenant.slug})`);
      }
    }

    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length > 0) {
      console.log(`${existingUsers.length} users already exist, skipping user creation...`);
    } else {
      const userPassword = await bcrypt.hash('Demo2024!', SALT_ROUNDS);
      
      const userData = [
        { id: 'U1', name: 'Admin Demo', email: 'admin@demo.com', tenantId: 'T1', role: 'Admin Global', level: 1 },
        { id: 'U2', name: 'Usuario Demo', email: 'user@demo.com', tenantId: 'T1', role: 'Usuario', level: 3 },
        { id: 'U3', name: 'Admin Alpha', email: 'admin@alpha.com', tenantId: 'T2', role: 'Admin Global', level: 1 },
        { id: 'U4', name: 'Usuario Alpha', email: 'user@alpha.com', tenantId: 'T2', role: 'Usuario', level: 3 },
        { id: 'U5', name: 'Admin Beta', email: 'admin@beta.com', tenantId: 'T3', role: 'Admin Global', level: 1 },
      ];

      for (const user of userData) {
        await db.insert(users).values({
          ...user,
          password: userPassword,
          status: 'ACTIVE',
        });
        console.log(`Created user: ${user.name} (${user.email})`);
      }
    }

    console.log('\nProduction database seeded successfully!');
    console.log('\nCredentials:');
    console.log('  Super Admin: superadmin@maturity.online / Admin2024!');
    console.log('  Demo Users: [email]@[tenant].com / Demo2024!');
    
  } catch (error) {
    console.error('Error seeding production database:', error);
    throw error;
  }
}

seedProduction()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
