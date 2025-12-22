import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tenants } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const [tenant] = await db.select({
      id: tenants.id,
      name: tenants.name,
      slug: tenants.slug,
      status: tenants.status,
      branding: tenants.branding,
    }).from(tenants).where(eq(tenants.slug, slug.toLowerCase()));

    if (!tenant) {
      return NextResponse.json({ 
        found: false,
        error: 'Tenant not found' 
      }, { status: 404 });
    }

    if (tenant.status?.toUpperCase() !== 'ACTIVE') {
      return NextResponse.json({ 
        found: false,
        error: 'Tenant is not active' 
      }, { status: 403 });
    }

    return NextResponse.json({
      found: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        branding: tenant.branding,
      }
    });
  } catch (error: any) {
    console.error('Error fetching tenant:', error);
    return NextResponse.json({ 
      found: false,
      error: 'Server error' 
    }, { status: 500 });
  }
}
