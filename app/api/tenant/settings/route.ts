import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tenants, users } from '@/shared/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/services/sessionToken';

async function validateTenantAdmin(request: NextRequest): Promise<{ valid: boolean; error?: string; user?: { id: string; email: string; tenantId: string; role: string } }> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('m360_session');
    
    if (!sessionCookie?.value) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return { valid: false, error: 'Authentication required' };
      }
      
      const token = authHeader.substring(7);
      const payload = verifySessionToken(token);
      
      if (!payload) {
        return { valid: false, error: 'Invalid or expired token' };
      }
      
      const [user] = await db.select().from(users).where(eq(users.email, payload.email.toLowerCase().trim()));
      
      if (!user) {
        return { valid: false, error: 'User not found' };
      }
      
      if (!user.tenantId) {
        return { valid: false, error: 'User has no tenant association' };
      }
      
      if (user.role !== 'Admin Global' && user.level !== 1) {
        return { valid: false, error: 'Admin access required' };
      }
      
      return { valid: true, user: { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role } };
    }
    
    const payload = verifySessionToken(sessionCookie.value);
    
    if (!payload) {
      return { valid: false, error: 'Invalid or expired session' };
    }
    
    const [user] = await db.select().from(users).where(eq(users.email, payload.email.toLowerCase().trim()));
    
    if (!user) {
      return { valid: false, error: 'User not found' };
    }
    
    if (!user.tenantId) {
      return { valid: false, error: 'User has no tenant association' };
    }
    
    if (user.role !== 'Admin Global' && user.level !== 1) {
      return { valid: false, error: 'Admin access required' };
    }
    
    return { valid: true, user: { id: user.id, email: user.email, tenantId: user.tenantId, role: user.role } };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { valid: false, error: 'Authentication failed' };
  }
}

export async function GET(request: NextRequest) {
  const auth = await validateTenantAdmin(request);
  if (!auth.valid || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, auth.user.tenantId));
    
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      tenant 
    });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenant settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateTenantAdmin(request);
  if (!auth.valid || !auth.user) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, branding, policies, ssoConfig, integrations } = body;

    const [existingTenant] = await db.select().from(tenants).where(eq(tenants.id, auth.user.tenantId));
    
    if (!existingTenant) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (branding !== undefined) {
      updateData.branding = { ...existingTenant.branding, ...branding, updated_at: new Date().toISOString() };
    }
    if (policies !== undefined) {
      updateData.policies = { ...existingTenant.policies, ...policies, updated_at: new Date().toISOString() };
    }
    if (ssoConfig !== undefined) {
      updateData.ssoConfig = ssoConfig;
    }
    if (integrations !== undefined) {
      updateData.integrations = integrations;
    }

    const [updatedTenant] = await db
      .update(tenants)
      .set(updateData)
      .where(eq(tenants.id, auth.user.tenantId))
      .returning();

    return NextResponse.json({ 
      success: true, 
      tenant: updatedTenant,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating tenant settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
