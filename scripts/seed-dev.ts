import { db } from '../server/db';
import { tenants, users, platformAdmins, units, documents, workflows, surveys } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;
const ENV = process.env.NODE_ENV || 'development';

if (ENV === 'production') {
  console.error('ERROR: Cannot run development seeder in production environment!');
  console.error('Use npm run db:seed:prod for production seeding.');
  process.exit(1);
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function clearDevelopmentData() {
  console.log('Clearing existing development data...');
  
  await db.delete(surveys);
  await db.delete(workflows);
  await db.delete(documents);
  await db.delete(units);
  await db.delete(users);
  await db.delete(platformAdmins);
  await db.delete(tenants);
  
  console.log('Development data cleared.');
}

async function seedTenants() {
  console.log('Seeding tenants...');
  
  const tenantsData = [
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
      branding: {
        primaryColor: '#3B82F6',
        logo: null,
      },
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
      branding: {
        primaryColor: '#10B981',
        logo: null,
      },
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
      branding: {
        primaryColor: '#8B5CF6',
        logo: null,
      },
    },
  ];

  await db.insert(tenants).values(tenantsData);
  console.log(`Seeded ${tenantsData.length} tenants.`);
}

async function seedPlatformAdmin() {
  console.log('Seeding platform admin...');
  
  const adminPassword = await hashPassword('Admin2024!');
  
  await db.insert(platformAdmins).values({
    id: 'superadmin-1',
    name: 'Super Admin',
    email: 'superadmin@maturity.online',
    password: adminPassword,
    role: 'SUPER_ADMIN',
  });
  
  console.log('Platform admin seeded.');
}

async function seedUsers() {
  console.log('Seeding users...');
  
  const userPassword = await hashPassword('Demo2024!');
  
  const usersData = [
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
      jobTitle: 'Director General',
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
      jobTitle: 'Analista de Procesos',
    },
    {
      id: 'user-t1-user',
      name: 'Carlos Usuario',
      email: 'carlos@demo.com',
      password: userPassword,
      role: 'Usuario',
      level: 3,
      tenantId: 'T1',
      unit: 'Ventas',
      initials: 'CU',
      status: 'ACTIVE',
      jobTitle: 'Ejecutivo Comercial',
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
      jobTitle: 'CEO',
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
      jobTitle: 'Director de Proyectos',
    },
  ];

  await db.insert(users).values(usersData);
  console.log(`Seeded ${usersData.length} users.`);
}

async function seedUnits() {
  console.log('Seeding organizational units...');
  
  const unitsData = [
    { id: 'unit-t1-dir', tenantId: 'T1', name: 'Dirección', level: 0 },
    { id: 'unit-t1-ops', tenantId: 'T1', name: 'Operaciones', parentId: 'unit-t1-dir', level: 1 },
    { id: 'unit-t1-sales', tenantId: 'T1', name: 'Ventas', parentId: 'unit-t1-dir', level: 1 },
    { id: 'unit-t1-tech', tenantId: 'T1', name: 'Tecnología', parentId: 'unit-t1-dir', level: 1 },
    { id: 'unit-t2-dir', tenantId: 'T2', name: 'Dirección', level: 0 },
    { id: 'unit-t2-finance', tenantId: 'T2', name: 'Finanzas', parentId: 'unit-t2-dir', level: 1 },
    { id: 'unit-t3-dir', tenantId: 'T3', name: 'Dirección', level: 0 },
    { id: 'unit-t3-dev', tenantId: 'T3', name: 'Desarrollo', parentId: 'unit-t3-dir', level: 1 },
  ];

  await db.insert(units).values(unitsData);
  console.log(`Seeded ${unitsData.length} organizational units.`);
}

async function seedDocuments() {
  console.log('Seeding sample documents...');
  
  const docsData = [
    {
      id: 'doc-t1-1',
      tenantId: 'T1',
      title: 'Manual de Procesos',
      content: 'Este es un documento de ejemplo para procesos operativos.',
      category: 'Procesos',
      status: 'PUBLISHED',
      ownerId: 'user-t1-admin',
      version: 1,
      tags: ['procesos', 'operaciones'],
    },
    {
      id: 'doc-t1-2',
      tenantId: 'T1',
      title: 'Política de Seguridad',
      content: 'Políticas de seguridad de la información.',
      category: 'Políticas',
      status: 'DRAFT',
      ownerId: 'user-t1-admin',
      version: 1,
      tags: ['seguridad', 'políticas'],
    },
    {
      id: 'doc-t2-1',
      tenantId: 'T2',
      title: 'Procedimiento Financiero',
      content: 'Procedimientos para gestión financiera.',
      category: 'Finanzas',
      status: 'PUBLISHED',
      ownerId: 'user-t2-admin',
      version: 1,
      tags: ['finanzas', 'procedimientos'],
    },
  ];

  await db.insert(documents).values(docsData);
  console.log(`Seeded ${docsData.length} documents.`);
}

async function seedWorkflows() {
  console.log('Seeding sample workflows...');
  
  const workflowsData = [
    {
      id: 'wf-t1-1',
      tenantId: 'T1',
      title: 'Aprobación de Documentos',
      description: 'Flujo para aprobación de documentos internos.',
      status: 'ACTIVE',
      ownerId: 'user-t1-admin',
      steps: [
        { id: 1, name: 'Creación', type: 'start' },
        { id: 2, name: 'Revisión', type: 'approval' },
        { id: 3, name: 'Publicación', type: 'end' },
      ],
    },
    {
      id: 'wf-t1-2',
      tenantId: 'T1',
      title: 'Onboarding de Empleados',
      description: 'Proceso de incorporación de nuevos empleados.',
      status: 'DRAFT',
      ownerId: 'user-t1-admin',
      steps: [
        { id: 1, name: 'Registro', type: 'start' },
        { id: 2, name: 'Documentación', type: 'task' },
        { id: 3, name: 'Capacitación', type: 'task' },
        { id: 4, name: 'Finalizado', type: 'end' },
      ],
    },
  ];

  await db.insert(workflows).values(workflowsData);
  console.log(`Seeded ${workflowsData.length} workflows.`);
}

async function seedSurveys() {
  console.log('Seeding sample surveys...');
  
  const surveysData = [
    {
      id: 'survey-t1-1',
      tenantId: 'T1',
      title: 'Diagnóstico de Madurez Inicial',
      description: 'Evaluación inicial del nivel de madurez organizacional.',
      status: 'ACTIVE',
      questions: [
        { id: 1, text: '¿La organización tiene procesos documentados?', type: 'scale' },
        { id: 2, text: '¿Existen indicadores de gestión definidos?', type: 'scale' },
        { id: 3, text: '¿Se realizan auditorías internas periódicas?', type: 'yesno' },
      ],
      responses: [],
    },
  ];

  await db.insert(surveys).values(surveysData);
  console.log(`Seeded ${surveysData.length} surveys.`);
}

async function seedDevelopment() {
  console.log('='.repeat(60));
  console.log('DEVELOPMENT DATABASE SEEDER');
  console.log('Environment:', ENV);
  console.log('='.repeat(60));
  console.log('');
  console.log('WARNING: This will clear and recreate all development data.');
  console.log('');

  try {
    await clearDevelopmentData();
    await seedTenants();
    await seedPlatformAdmin();
    await seedUsers();
    await seedUnits();
    await seedDocuments();
    await seedWorkflows();
    await seedSurveys();

    console.log('');
    console.log('='.repeat(60));
    console.log('DEVELOPMENT SEED COMPLETE');
    console.log('='.repeat(60));
    console.log('');
    console.log('Credentials:');
    console.log('  Super Admin: superadmin@maturity.online / Admin2024!');
    console.log('  Demo Admin: admin@demo.com / Demo2024!');
    console.log('  Alpha Admin: admin@alpha.com / Demo2024!');
    console.log('  Algoritmo T: proyectos@algoritmot.com / Demo2024!');
    console.log('');
    console.log('Tenants:');
    console.log('  demo -> /demo');
    console.log('  alpha -> /alpha');
    console.log('  algoritmot -> /algoritmot');
    console.log('');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  }
}

seedDevelopment()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
