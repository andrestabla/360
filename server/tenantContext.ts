import { db } from './db';

// Simplified context for single-tenant mode
export interface TenantContext {
  // No tenant-specific fields needed anymore
}

export async function withTenantContext<T>(
  context: TenantContext,
  fn: () => Promise<T>
): Promise<T> {
  // Just run the function directly, no RLS setting needed
  return await fn();
}

export async function setTenantContext(tenantId: string | null, isSuperAdmin: boolean = false): Promise<void> {
  // No-op
  return;
}

export async function clearTenantContext(): Promise<void> {
  // No-op
  return;
}

