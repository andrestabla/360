import { db } from '../server/db';
import { tenants, users, platformAdmins } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function seedDatabase() {
  console.log('Starting database seed...');

  const existingTenants = await db.select().from(tenants);
  if (existingTenants.length === 0) {
    console.log('Seeding tenants...');
    await db.insert(tenants).values([
      {
        id: 'T1',
        name: 'Empresa Demo',
        slug: 'demo',
        domains: ['demo.maturity.online'],
        status: 'ACTIVE',
        timezone: 'America/Bogota',
        locale: 'es-CO',
        sector: 'technology',
        contactName: 'Juan Admin',
        contactEmail: 'admin@demo.com',
        contactPhone: '+57 300 123 4567',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'T2',
        name: 'Alpha Corp',
        slug: 'alpha',
        domains: ['alpha.maturity.online'],
        status: 'ACTIVE',
        timezone: 'America/Bogota',
        locale: 'es-CO',
        sector: 'finance',
        contactName: 'María García',
        contactEmail: 'admin@alpha.com',
        contactPhone: '+57 300 987 6543',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'T3',
        name: 'Algoritmo T',
        slug: 'algoritmot',
        domains: ['algoritmot.maturity.online'],
        status: 'ACTIVE',
        timezone: 'America/Bogota',
        locale: 'es-CO',
        sector: 'technology',
        contactName: 'Andrés Tabla',
        contactEmail: 'proyectos@algoritmot.com',
        contactPhone: '+57 300 555 1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('Tenants seeded.');
  } else {
    console.log('Tenants already exist, skipping...');
  }

  const existingAdmins = await db.select().from(platformAdmins);
  if (existingAdmins.length === 0) {
    console.log('Seeding platform admin...');
    const adminPassword = await hashPassword('Admin2024!');
    await db.insert(platformAdmins).values({
      id: 'superadmin-1',
      name: 'Super Admin',
      email: 'superadmin@maturity.online',
      password: adminPassword,
      role: 'SUPER_ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Platform admin seeded.');
  } else {
    console.log('Platform admin already exists, skipping...');
  }

  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    console.log('Seeding tenant users...');
    const userPassword = await hashPassword('Demo2024!');
    
    await db.insert(users).values([
      {
        id: 'user-t1-admin',
        name: 'Juan Admin Demo',
        email: 'admin@demo.com',
        password: userPassword,
        role: 'Admin Global',
        level: 1,
        tenantId: 'T1',
        unit: 'Dirección',
        initials: 'JA',
        status: 'ACTIVE',
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-t1-analyst',
        name: 'María Analista',
        email: 'maria@demo.com',
        password: userPassword,
        role: 'Analista',
        level: 2,
        tenantId: 'T1',
        unit: 'Operaciones',
        initials: 'MA',
        status: 'ACTIVE',
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-t2-admin',
        name: 'María García Alpha',
        email: 'admin@alpha.com',
        password: userPassword,
        role: 'Admin Global',
        level: 1,
        tenantId: 'T2',
        unit: 'Dirección',
        initials: 'MG',
        status: 'ACTIVE',
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-t3-admin',
        name: 'Andrés Tabla',
        email: 'proyectos@algoritmot.com',
        password: userPassword,
        role: 'Admin Global',
        level: 1,
        tenantId: 'T3',
        unit: 'Dirección',
        initials: 'AT',
        status: 'ACTIVE',
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('Users seeded.');
  } else {
    console.log('Users already exist, skipping...');
  }

  console.log('');
  console.log('Database seed complete!');
  console.log('');
  console.log('Credentials:');
  console.log('  Super Admin: superadmin@maturity.online / Admin2024!');
  console.log('  Demo Admin: admin@demo.com / Demo2024!');
  console.log('  Alpha Admin: admin@alpha.com / Demo2024!');
  console.log('  Algoritmo T Admin: proyectos@algoritmot.com / Demo2024!');
}

seedDatabase().catch(console.error).finally(() => process.exit(0));
