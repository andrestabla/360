import { db } from '../server/db';
import { organizationSettings, users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seedDatabase() {
  console.log('Starting Single-Tenant database seed...');

  // 1. Seed Organization Settings
  const existingSettings = await db.select().from(organizationSettings);
  if (existingSettings.length === 0) {
    console.log('Seeding organization settings...');
    await db.insert(organizationSettings).values({
      name: 'Maturity 360 Corp',
      timezone: 'America/Bogota',
      locale: 'es-CO',
      sector: 'technology',
      contactName: 'Super Admin',
      contactEmail: 'admin@maturity360.com',
      features: ['WORKFLOWS', 'SURVEYS', 'CHAT', 'DOCUMENTS'],
    });
    console.log('Organization settings seeded.');
  } else {
    console.log('Organization settings already exist, skipping...');
  }

  // 2. Seed Users
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    console.log('Seeding users...');
    const adminPassword = await hashPassword('Admin2025!');
    const userPassword = await hashPassword('User2025!');

    await db.insert(users).values([
      {
        id: 'user-admin',
        name: 'Andrés Tabla',
        email: 'proyectos@algoritmot.com', // Manteniendo el usuario principal del requerimiento
        password: adminPassword,
        role: 'SUPER_ADMIN', // Rol principal
        level: 1,
        unit: 'Dirección',
        initials: 'AT',
        status: 'ACTIVE',
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-demo',
        name: 'Usuario Demo',
        email: 'demo@maturity360.com',
        password: userPassword,
        role: 'USER',
        level: 2,
        unit: 'Operaciones',
        initials: 'UD',
        status: 'ACTIVE',
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    console.log('Users seeded.');
  } else {
    console.log('Users already exist, skipping...');
  }

  console.log('');
  console.log('Database seed complete!');
  console.log('');
  console.log('Credentials:');
  console.log('  Admin: proyectos@algoritmot.com / Admin2025!');
  console.log('  User:  demo@maturity360.com / User2025!');
}

seedDatabase().catch(console.error).finally(() => process.exit(0));

