import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tenants, users } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function GET() {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, domains, timezone, locale, sector, contactName, contactEmail, contactPhone, features, branding, policies } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const existingTenant = await db.select().from(tenants).where(eq(tenants.slug, slug));
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
      slug,
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
