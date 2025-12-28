import { db } from '@/server/db';
import { users, organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  role: string;
  unit?: string;
  jobTitle?: string;
  phone?: string;
  status?: 'ACTIVE' | 'PENDING_INVITE' | 'SUSPENDED';
  sendInvite?: boolean;
}

export interface UserOutput {
  id: string;
  name: string;
  email: string | null;
  role: string;
  unit: string | null;
  jobTitle: string | null;
  phone: string | null;
  status: string;
  createdAt: Date | null;
}

function generateId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(input: CreateUserInput): Promise<{ success: boolean; user?: UserOutput; tempPassword?: string; error?: string }> {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, input.email));
    if (existingUser.length > 0) {
      return { success: false, error: 'Ya existe un usuario con este correo electrónico' };
    }

    // --- ENFORCE PLAN LIMITS (HU 7.4) ---
    const [settings] = await db.select().from(organizationSettings).limit(1);
    const plan = settings?.plan || 'ENTERPRISE';
    const subStatus = settings?.subscriptionStatus || 'active';

    if (subStatus !== 'active' && subStatus !== 'trial') {
      return { success: false, error: 'La suscripción de la organización no está activa.' };
    }

    const PLAN_LIMITS: Record<string, number> = {
      'STARTER': 5,
      'PRO': 20,
      'ENTERPRISE': 1000,
      'CUSTOM': 1000
    };
    const limit = PLAN_LIMITS[plan] || 5;

    // Efficient count
    const allUsers = await db.select({ id: users.id }).from(users);
    if (allUsers.length >= limit) {
      return { success: false, error: `Se ha alcanzado el límite de usuarios (${limit}) del plan ${plan}. Actualice su suscripción.` };
    }
    // ------------------------------------

    const tempPassword = input.password || generateTempPassword();
    const hashedPassword = await hashPassword(tempPassword);

    const userId = generateId();
    const initials = input.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    await db.insert(users).values({
      id: userId,
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      unit: input.unit || null,
      jobTitle: input.jobTitle || null,
      phone: input.phone || null,
      initials,
      status: input.status || 'PENDING_INVITE',
      mustChangePassword: !input.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [newUser] = await db.select().from(users).where(eq(users.id, userId));

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        unit: newUser.unit,
        jobTitle: newUser.jobTitle,
        phone: newUser.phone,
        status: newUser.status,
        createdAt: newUser.createdAt,
      },
      tempPassword: !input.password ? tempPassword : undefined,
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Error al crear usuario' };
  }
}

export async function getAllUsers(): Promise<UserOutput[]> {
  try {
    const result = await db.select().from(users);
    return result.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      unit: u.unit,
      jobTitle: u.jobTitle,
      phone: u.phone,
      status: u.status,
      createdAt: u.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(userId: string): Promise<UserOutput | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      unit: user.unit,
      jobTitle: user.jobTitle,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: UserOutput; error?: string }> {
  try {
    const query = await db.select().from(users).where(eq(users.email, email));

    if (query.length === 0) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const user = query[0];

    if (user.status === 'SUSPENDED') {
      return { success: false, error: 'Tu cuenta ha sido suspendida' };
    }

    if (!user.password) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        unit: user.unit,
        jobTitle: user.jobTitle,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
      },
    };
  } catch (error: any) {
    console.error('Error authenticating user:', error);
    return { success: false, error: 'Error de autenticación' };
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const hashedPassword = await hashPassword(newPassword);
    await db.update(users).set({
      password: hashedPassword,
      mustChangePassword: false,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));
    return { success: true };
  } catch (error: any) {
    console.error('Error updating password:', error);
    return { success: false, error: 'Error al actualizar contraseña' };
  }
}

export async function updateUser(userId: string, updates: Partial<{
  name: string;
  email: string;
  role: string;
  unit: string;
  jobTitle: string;
  phone: string;
  status: string;
}>): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(users).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(users.id, userId));
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Error al actualizar usuario' };
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(users).where(eq(users.id, userId));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Error al eliminar usuario' };
  }
}

