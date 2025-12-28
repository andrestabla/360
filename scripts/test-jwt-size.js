#!/usr/bin/env node

/**
 * Test script to verify JWT token size AFTER RESTORATION
 * Verifying that name+email doesn't bloat the header too much
 */

const testPayload = {
    sub: "user-id-12345678901234567890", // User ID
    role: "ADMIN", // Role
    email: "long.admin.email.address@enterprise-domain.com", // Restored field
    name: "Juan Perez de los Palotes y Gonzales", // Restored field
    picture: "https://lh3.googleusercontent.com/a/ACg8ocL...", // Restored URL (safe)
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
};

// Simulate JWT encoding (base64)
const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
const payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
const signature = "x".repeat(43);

const mockJWT = `${header}.${payload}.${signature}`;

console.log('=== JWT Token Size Analysis (Restored Fields) ===\n');
console.log('Payload contents:', JSON.stringify(testPayload, null, 2));
console.log('\nToken size:', mockJWT.length, 'bytes');
console.log('Cookie name: __Secure-m360-auth.session-token');
console.log('Total cookie size (approx):', mockJWT.length + '__Secure-m360-auth.session-token='.length, 'bytes');
console.log('\n=== Limits ===');
console.log('Individual header limit: 16,384 bytes (16 KB)');
console.log('Total headers limit: 32,768 bytes (32 KB)');
console.log('\n=== Status ===');

const totalSize = mockJWT.length + '__Secure-m360-auth.session-token='.length;
if (totalSize < 4096) {
    console.log('✅ EXCELLENT: Cookie size is < 4 KB (very safe)');
} else {
    console.log('⚠️ WARNING: Cookie size is getting large');
}

console.log('\n=== Strategy ===');
console.log('• Restored: name, email, picture (URL only)');
console.log('• Blocked: huge base64 images, random session updates');
console.log('• Cleaned: cookie rename bypasses old junk');
