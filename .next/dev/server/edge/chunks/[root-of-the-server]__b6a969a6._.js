(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__b6a969a6._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/lib/services/sessionToken.edge.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifySessionTokenEdge",
    ()=>verifySessionTokenEdge
]);
function getSessionSecret() {
    const secret = process.env.SESSION_SECRET || process.env.EMAIL_ENCRYPTION_KEY;
    if (!secret) {
        return 'dev-secret-key-do-not-use-in-production';
    }
    return secret;
}
async function hmacSign(data, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {
        name: 'HMAC',
        hash: 'SHA-256'
    }, false, [
        'sign'
    ]);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    return Array.from(new Uint8Array(signature)).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
async function verifySessionTokenEdge(token) {
    try {
        const [payloadBase64, signature] = token.split('.');
        if (!payloadBase64 || !signature) {
            return null;
        }
        const secret = getSessionSecret();
        const expectedSignature = await hmacSign(payloadBase64, secret);
        if (signature !== expectedSignature) {
            return null;
        }
        const decoded = atob(payloadBase64);
        const payload = JSON.parse(decoded);
        const sessionAge = Date.now() - payload.timestamp;
        const MAX_SESSION_AGE = 24 * 60 * 60 * 1000;
        if (sessionAge > MAX_SESSION_AGE) {
            return null;
        }
        return payload;
    } catch  {
        return null;
    }
}
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$sessionToken$2e$edge$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/sessionToken.edge.ts [middleware-edge] (ecmascript)");
;
;
const PUBLIC_PATHS = [
    '/',
    '/features',
    '/pricing',
    '/login',
    '/api/tenants',
    '/api/auth',
    '/api/health'
];
const PUBLIC_PATH_PREFIXES = [
    '/_next',
    '/static',
    '/favicon',
    '/api/tenants/'
];
const AUTH_PATHS = [
    '/login',
    '/auth'
];
const PROTECTED_PATH_PREFIXES = [
    '/dashboard',
    '/admin'
];
const SUPER_ADMIN_PATHS = [
    '/admin'
];
function isPublicPath(pathname) {
    if (PUBLIC_PATHS.includes(pathname)) return true;
    if (PUBLIC_PATH_PREFIXES.some((prefix)=>pathname.startsWith(prefix))) return true;
    if (pathname.match(/^\/(demo|alpha|beta|[a-z0-9-]+)$/)) return true;
    return false;
}
function isAuthPath(pathname) {
    return AUTH_PATHS.some((path)=>pathname.includes(path));
}
function isProtectedPath(pathname) {
    return PROTECTED_PATH_PREFIXES.some((prefix)=>pathname.startsWith(prefix));
}
function isSuperAdminPath(pathname) {
    return SUPER_ADMIN_PATHS.some((prefix)=>pathname.startsWith(prefix));
}
function extractTenantSlug(pathname) {
    const match = pathname.match(/^\/([a-z0-9-]+)\//);
    if (match && ![
        'dashboard',
        'admin',
        'api',
        '_next',
        'static',
        'features',
        'pricing',
        'login',
        'auth'
    ].includes(match[1])) {
        return match[1];
    }
    return null;
}
async function middleware(request) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host') || '';
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
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
            const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$sessionToken$2e$edge$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifySessionTokenEdge"])(token);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$sessionToken$2e$edge$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifySessionTokenEdge"])(token);
    if (!payload) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('reason', 'session_expired');
        const redirectResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        redirectResponse.cookies.delete('m360_session');
        return redirectResponse;
    }
    if (isSuperAdminPath(pathname) && !payload.isSuperAdmin) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/dashboard', request.url));
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
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__b6a969a6._.js.map