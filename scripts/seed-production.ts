import fs from 'fs';
import path from 'path';

// 1. Load Environment Variables BEFORE importing anything else
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
  console.warn('⚠️ Could not load .env file');
}

const SALT_ROUNDS = 12;

async function seedProduction() {
  console.log('Starting production database seed...');

  // 2. Dynamic Imports to ensure env vars are set
  const { db } = await import('../server/db');
  const { users } = await import('../shared/schema');
  const bcrypt = (await import('bcryptjs')).default;
  const { eq } = await import('drizzle-orm');

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

