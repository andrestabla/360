import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionTokenEdge } from '@/lib/services/sessionToken.edge';

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
  '/api/tenants/',
];

const AUTH_PATHS = ['/login', '/auth'];

const PROTECTED_PATH_PREFIXES = ['/dashboard', '/admin'];

const SUPER_ADMIN_PATHS = ['/admin'];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (PUBLIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true;
  if (pathname.match(/^\/(demo|alpha|beta|[a-z0-9-]+)$/)) return true;
  return false;
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some(path => pathname.includes(path));
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isSuperAdminPath(pathname: string): boolean {
  return SUPER_ADMIN_PATHS.some(prefix => pathname.startsWith(prefix));
}

function extractTenantSlug(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z0-9-]+)\//);
  if (match && !['dashboard', 'admin', 'api', '_next', 'static', 'features', 'pricing', 'login', 'auth'].includes(match[1])) {
    return match[1];
  }
  return null;
}

export async function middleware(request: NextRequest) {
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
  
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await verifySessionTokenEdge(token);
      
      if (payload) {
        response.headers.set('x-user-email', payload.email);
        response.headers.set('x-is-super-admin', payload.isSuperAdmin ? 'true' : 'false');
        if (payload.tenantId) {
          response.headers.set('x-tenant-id', payload.tenantId);
        }
      }
    }
    return response;
  }
  
  if (!isProtectedPath(pathname)) {
    return response;
  }
  
  const sessionCookie = request.cookies.get('m360_session');
  const token = sessionCookie?.value;
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  const payload = await verifySessionTokenEdge(token);
  
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('reason', 'session_expired');
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete('m360_session');
    return redirectResponse;
  }
  
  if (isSuperAdminPath(pathname) && !payload.isSuperAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  response.headers.set('x-user-email', payload.email);
  response.headers.set('x-is-super-admin', payload.isSuperAdmin ? 'true' : 'false');
  if (payload.tenantId) {
    response.headers.set('x-tenant-id', payload.tenantId);
  }
  if (payload.tenantSlug) {
    response.headers.set('x-tenant-slug', payload.tenantSlug);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
