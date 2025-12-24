import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/services/rateLimit';
import { getCachedTenantBySlug } from '@/lib/services/cache';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, 'tenantLookup');
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json({ 
        found: false,
        error: 'Too many requests. Please try again later.'
      }, { status: 429 });
      
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }
    
    const { slug } = await params;
    
    const tenant = await getCachedTenantBySlug(slug);

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
