#!/usr/bin/env node

/**
 * Test script to verify JWT token size AFTER SAFER FIX
 * This helps ensure we stay under the REQUEST_HEADER_TOO_LARGE limits
 */

const testPayload = {
    sub: "user-id-12345678901234567890", // Typical user ID
    role: "ADMIN", // User role
    email: "admin@example.com", // Keeping email now
    name: "Juan Perez de los Palotes", // Keeping name now
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
};

// Simulate JWT encoding (base64)
const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
const payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
const signature = "x".repeat(43); // Typical HMAC-SHA256 signature length

const mockJWT = `${header}.${payload}.${signature}`;

console.log('=== JWT Token Size Analysis (Safer Fix) ===\n');
console.log('Payload contents:', JSON.stringify(testPayload, null, 2));
console.log('\nToken size:', mockJWT.length, 'bytes');
console.log('Cookie name: __Secure-next-auth.session-token');
console.log('Total cookie size (approx):', mockJWT.length + '__Secure-next-auth.session-token='.length, 'bytes');
console.log('\n=== Status ===');

const totalSize = mockJWT.length + '__Secure-next-auth.session-token='.length;
if (totalSize < 4096) {
    console.log('✅ EXCELLENT: Cookie size is < 4 KB (very safe)');
} else if (totalSize < 8192) {
    console.log('✅ GOOD: Cookie size is < 8 KB (safe)');
} else {
    console.log('❌ ERROR: Cookie size exceeds safe limits!');
}
