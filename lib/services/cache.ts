import { unstable_cache } from 'next/cache';
import { db } from '@/server/db';
import { tenants, units, users } from '@/shared/schema';
import { eq, and } from 'drizzle-orm';

const CACHE_TTL = 300;

export const getCachedTenantBySlug = unstable_cache(
  async (slug: string) => {
    const [tenant] = await db.select({
      id: tenants.id,
      name: tenants.name,
      slug: tenants.slug,
      status: tenants.status,
      branding: tenants.branding,
      timezone: tenants.timezone,
      locale: tenants.locale,
      features: tenants.features,
    }).from(tenants).where(eq(tenants.slug, slug.toLowerCase()));
    
    return tenant || null;
  },
  ['tenant-by-slug'],
  { revalidate: CACHE_TTL, tags: ['tenants'] }
);

export const getCachedTenantById = unstable_cache(
  async (id: string) => {
    const [tenant] = await db.select({
      id: tenants.id,
      name: tenants.name,
      slug: tenants.slug,
      status: tenants.status,
      branding: tenants.branding,
      timezone: tenants.timezone,
      locale: tenants.locale,
      features: tenants.features,
    }).from(tenants).where(eq(tenants.id, id));
    
    return tenant || null;
  },
  ['tenant-by-id'],
  { revalidate: CACHE_TTL, tags: ['tenants'] }
);

export const getCachedTenantUnits = unstable_cache(
  async (tenantId: string) => {
    const result = await db.select({
      id: units.id,
      name: units.name,
      parentId: units.parentId,
      managerId: units.managerId,
      level: units.level,
    }).from(units).where(eq(units.tenantId, tenantId));
    
    return result;
  },
  ['tenant-units'],
  { revalidate: CACHE_TTL, tags: ['units'] }
);

export const getCachedUserCount = unstable_cache(
  async (tenantId: string) => {
    const result = await db.select({
      id: users.id,
    }).from(users).where(
      and(
        eq(users.tenantId, tenantId),
        eq(users.status, 'ACTIVE')
      )
    );
    
    return result.length;
  },
  ['tenant-user-count'],
  { revalidate: 60, tags: ['users'] }
);

export async function invalidateTenantCache(tenantId?: string): Promise<void> {
  console.log(`Cache invalidation requested for tenant: ${tenantId || 'all'}`);
}

export async function invalidateUnitsCache(tenantId?: string): Promise<void> {
  console.log(`Units cache invalidation requested for tenant: ${tenantId || 'all'}`);
}

export async function invalidateUsersCache(tenantId?: string): Promise<void> {
  console.log(`Users cache invalidation requested for tenant: ${tenantId || 'all'}`);
}
