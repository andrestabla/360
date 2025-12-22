import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAIN_DOMAIN = 'maturity.online';

function getSubdomain(hostname: string): string | null {
  if (hostname.includes('localhost') || hostname.includes('replit')) {
    const parts = hostname.split('.');
    return parts.length > 1 && parts[0] !== 'www' ? parts[0] : null;
  }

  if (hostname.endsWith(MAIN_DOMAIN)) {
    const withoutDomain = hostname.replace(`.${MAIN_DOMAIN}`, '').replace(MAIN_DOMAIN, '');
    return withoutDomain && withoutDomain !== 'www' ? withoutDomain : null;
  }

  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0] !== 'www' ? parts[0] : null;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/static') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  
  if (subdomain) {
    response.headers.set('x-tenant-slug', subdomain);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
