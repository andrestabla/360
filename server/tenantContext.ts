import { db } from './db';
import { sql } from 'drizzle-orm';

export interface TenantContext {
  tenantId: string | null;
  isSuperAdmin: boolean;
}

export async function withTenantContext<T>(
  context: TenantContext,
  fn: () => Promise<T>
): Promise<T> {
  const tenantValue = context.tenantId || '';
  const superAdminValue = context.isSuperAdmin ? 'true' : 'false';
  
  return await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.current_tenant', ${tenantValue}, true)`);
    await tx.execute(sql`SELECT set_config('app.is_super_admin', ${superAdminValue}, true)`);
    
    const originalDb = (global as Record<string, unknown>).__txDb;
    (global as Record<string, unknown>).__txDb = tx;
    
    try {
      return await fn();
    } finally {
      (global as Record<string, unknown>).__txDb = originalDb;
    }
  });
}

export async function setTenantContext(tenantId: string | null, isSuperAdmin: boolean = false): Promise<void> {
  const tenantValue = tenantId || '';
  const superAdminValue = isSuperAdmin ? 'true' : 'false';
  
  await db.execute(sql`SELECT set_config('app.current_tenant', ${tenantValue}, true)`);
  await db.execute(sql`SELECT set_config('app.is_super_admin', ${superAdminValue}, true)`);
}

export async function clearTenantContext(): Promise<void> {
  await db.execute(sql`SELECT set_config('app.current_tenant', '', true)`);
  await db.execute(sql`SELECT set_config('app.is_super_admin', 'false', true)`);
}
