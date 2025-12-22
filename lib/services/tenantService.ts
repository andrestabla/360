import { db } from '@/server/db';
import { tenants } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export interface TenantInput {
  id: string;
  name: string;
  slug: string;
  domains?: string[];
  status?: string;
  timezone?: string;
  locale?: string;
  sector?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface TenantOutput {
  id: string;
  name: string;
  slug: string;
  domains: string[] | null;
  status: string;
  timezone: string | null;
  locale: string | null;
  createdAt: Date | null;
}

export async function getTenantBySlug(slug: string): Promise<TenantOutput | null> {
  try {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug));
    if (!tenant) return null;
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domains: tenant.domains,
      status: tenant.status,
      timezone: tenant.timezone,
      locale: tenant.locale,
      createdAt: tenant.createdAt,
    };
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }
}

export async function getTenantById(id: string): Promise<TenantOutput | null> {
  try {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    if (!tenant) return null;
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domains: tenant.domains,
      status: tenant.status,
      timezone: tenant.timezone,
      locale: tenant.locale,
      createdAt: tenant.createdAt,
    };
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }
}

export async function getAllTenants(): Promise<TenantOutput[]> {
  try {
    const result = await db.select().from(tenants);
    return result.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      domains: t.domains,
      status: t.status,
      timezone: t.timezone,
      locale: t.locale,
      createdAt: t.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }
}

export async function createTenant(input: TenantInput): Promise<{ success: boolean; tenant?: TenantOutput; error?: string }> {
  try {
    const existing = await db.select().from(tenants).where(eq(tenants.slug, input.slug));
    if (existing.length > 0) {
      return { success: false, error: 'Ya existe un tenant con este slug' };
    }

    await db.insert(tenants).values({
      id: input.id,
      name: input.name,
      slug: input.slug,
      domains: input.domains || [],
      status: input.status || 'ACTIVE',
      timezone: input.timezone || 'America/Bogota',
      locale: input.locale || 'es-CO',
      sector: input.sector,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const [newTenant] = await db.select().from(tenants).where(eq(tenants.id, input.id));
    return {
      success: true,
      tenant: {
        id: newTenant.id,
        name: newTenant.name,
        slug: newTenant.slug,
        domains: newTenant.domains,
        status: newTenant.status,
        timezone: newTenant.timezone,
        locale: newTenant.locale,
        createdAt: newTenant.createdAt,
      },
    };
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    return { success: false, error: error.message };
  }
}
