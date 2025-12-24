import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/features',
  '/pricing',
  '/login',
  '/api/tenants',
  '/api/auth',
  '/api/health',
];

const PUBLIC_PATH_PREFIXES = [
  '/_next',
  '/static',
  '/favicon',
  '/api/',
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (PUBLIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true;
  if (pathname.match(/^\/(demo|alpha|beta|[a-z0-9-]+)$/)) return true;
  return false;
}

function extractTenantSlug(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z0-9-]+)\//);
  if (match && !['dashboard', 'admin', 'api', '_next', 'static', 'features', 'pricing', 'login', 'auth'].includes(match[1])) {
    return match[1];
  }
  return null;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  
  const response = NextResponse.next();
  
  const tenantSlug = extractTenantSlug(pathname);
  if (tenantSlug) {
    response.headers.set('x-tenant-slug', tenantSlug);
  }
  
  const isMainDomain = host.includes('maturity.online') || host.includes('localhost') || host.includes('replit');
  response.headers.set('x-is-main-domain', isMainDomain ? 'true' : 'false');
  
  if (isPublicPath(pathname)) {
    return response;
  }
  
  const sessionCookie = request.cookies.get('m360_session');
  if (!sessionCookie?.value) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
