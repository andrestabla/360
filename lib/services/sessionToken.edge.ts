export interface SessionPayload {
  email: string;
  isSuperAdmin: boolean;
  tenantId?: string;
  tenantSlug?: string;
  timestamp: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.EMAIL_ENCRYPTION_KEY;
  if (!secret) {
    return 'dev-secret-key-do-not-use-in-production';
  }
  return secret;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifySessionTokenEdge(token: string): Promise<SessionPayload | null> {
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
    const payload = JSON.parse(decoded) as SessionPayload;
    
    const sessionAge = Date.now() - payload.timestamp;
    const MAX_SESSION_AGE = 24 * 60 * 60 * 1000;
    if (sessionAge > MAX_SESSION_AGE) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
