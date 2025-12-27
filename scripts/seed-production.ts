import { db } from '../server/db';
import { users } from '../shared/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 12;

async function seedProduction() {
  console.log('Starting production database seed...');

  try {
    const existingUsers = await db.select().from(users);

    if (existingUsers.length > 0) {
      console.log(`${existingUsers.length} users already exist, skipping user creation...`);
    } else {
      const userPassword = await bcrypt.hash('Demo2024!', SALT_ROUNDS);
      const adminPassword = await bcrypt.hash('Admin2024!', SALT_ROUNDS);

      // Create Super Admin as a user
      console.log('Creating Super Admin user...');
      await db.insert(users).values({
        id: 'U1',
        name: 'Super Admin',
        email: 'superadmin@maturity.online',
        password: adminPassword,
        role: 'Admin Global',
        level: 1,
        status: 'ACTIVE'
      });

      const userData = [
        { id: 'U2', name: 'Admin Demo', email: 'admin@demo.com', role: 'Admin Global', level: 1 },
        { id: 'U3', name: 'Usuario Demo', email: 'user@demo.com', role: 'Usuario', level: 3 },
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
    console.log('  Demo Users: [email] / Demo2024!');

  } catch (error) {
    console.error('Error seeding production database:', error);
    throw error;
  }
}

seedProduction()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
