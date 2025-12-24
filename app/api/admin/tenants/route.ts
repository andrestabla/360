import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tenants, users, platformAdmins } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { verifySessionToken } from '@/lib/services/sessionToken';

const SALT_ROUNDS = 12;

async function validateSuperAdmin(request: NextRequest): Promise<{ valid: boolean; error?: string; admin?: { id: string; email: string } }> {
  const authHeader = request.headers.get('authorization');
  
  console.log('[Admin API] Auth header present:', !!authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[Admin API] No Bearer token in authorization header');
    return { valid: false, error: 'Authorization required' };
  }

  try {
    const token = authHeader.substring(7);
    console.log('[Admin API] Token received, length:', token.length);
    const payload = verifySessionToken(token);
    
    if (!payload) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    if (!payload.isSuperAdmin) {
      return { valid: false, error: 'Super Admin access required' };
    }

    const [admin] = await db.select().from(platformAdmins).where(eq(platformAdmins.email, payload.email.toLowerCase().trim()));
    
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return { valid: false, error: 'Unauthorized: Super Admin access required' };
    }

    return { valid: true, admin: { id: admin.id, email: admin.email } };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { valid: false, error: 'Invalid authorization token' };
  }
}

export async function GET(request: NextRequest) {
  const auth = await validateSuperAdmin(request);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const allTenants = await db.select().from(tenants).orderBy(tenants.createdAt);
    
    return NextResponse.json({ 
      success: true, 
      tenants: allTenants 
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

function validateSlug(slug: string): { valid: boolean; normalized?: string; error?: string } {
  if (!slug || typeof slug !== 'string') {
    return { valid: false, error: 'Slug is required' };
  }
  
  const normalized = slug.toLowerCase().trim();
  
  if (normalized.length < 2 || normalized.length > 63) {
    return { valid: false, error: 'Slug must be between 2 and 63 characters' };
  }
  
  const slugPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!slugPattern.test(normalized)) {
    return { valid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens. Cannot start or end with a hyphen.' };
  }
  
  return { valid: true, normalized };
}

export async function POST(request: NextRequest) {
  const auth = await validateSuperAdmin(request);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, slug, domains, timezone, locale, sector, contactName, contactEmail, contactPhone, features, branding, policies } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const slugValidation = validateSlug(slug);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { success: false, error: slugValidation.error },
        { status: 400 }
      );
    }
    const normalizedSlug = slugValidation.normalized!;

    const existingTenant = await db.select().from(tenants).where(eq(tenants.slug, normalizedSlug));
    if (existingTenant.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A tenant with this slug already exists' },
        { status: 400 }
      );
    }

    const tenantId = `T${Date.now()}`;
    const timestamp = new Date();

    const [newTenant] = await db.insert(tenants).values({
      id: tenantId,
      name,
      slug: normalizedSlug,
      domains: domains || [],
      status: 'ACTIVE',
      timezone: timezone || 'America/Bogota',
      locale: locale || 'es-CO',
      sector: sector || 'technology',
      contactName: contactName || '',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      features: features || ['DASHBOARD', 'WORKFLOWS', 'REPOSITORY', 'CHAT', 'ANALYTICS'],
      branding: branding || {},
      policies: policies || {},
      users: 1,
      storage: '0 GB',
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    if (contactEmail) {
      const adminPassword = await bcrypt.hash('TempPass123!', SALT_ROUNDS);
      const adminId = `user-${tenantId}-admin`;
      
      await db.insert(users).values({
        id: adminId,
        name: contactName || `Admin ${name}`,
        email: contactEmail,
        password: adminPassword,
        role: 'Admin Global',
        level: 1,
        tenantId: tenantId,
        unit: 'Dirección',
        initials: (contactName || name).substring(0, 2).toUpperCase(),
        status: 'ACTIVE',
        mustChangePassword: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    }

    return NextResponse.json({ 
      success: true, 
      tenant: newTenant,
      message: 'Tenant created successfully'
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateSuperAdmin(request);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const existingTenant = await db.select().from(tenants).where(eq(tenants.id, id));
    if (existingTenant.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      ...updates,
      updatedAt: new Date(),
    };

    const [updatedTenant] = await db
      .update(tenants)
      .set(updateData)
      .where(eq(tenants.id, id))
      .returning();

    return NextResponse.json({ 
      success: true, 
      tenant: updatedTenant,
      message: 'Tenant updated successfully'
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tenant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateSuperAdmin(request);
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    const existingTenant = await db.select().from(tenants).where(eq(tenants.id, id));
    if (existingTenant.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tenant not found' },
        { status: 404 }
      );
    }

    if (existingTenant[0].status !== 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Only suspended tenants can be deleted' },
        { status: 400 }
      );
    }

    await db.delete(users).where(eq(users.tenantId, id));
    await db.delete(tenants).where(eq(tenants.id, id));

    return NextResponse.json({ 
      success: true, 
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tenant' },
      { status: 500 }
    );
  }
}
