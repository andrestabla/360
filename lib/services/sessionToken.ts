import crypto from 'crypto';

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.EMAIL_ENCRYPTION_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET or EMAIL_ENCRYPTION_KEY environment variable is required in production');
    }
    return crypto.randomBytes(32).toString('hex');
  }
  return secret;
}

const SESSION_SECRET = getSessionSecret();

export interface SessionPayload {
  email: string;
  isSuperAdmin: boolean;
  timestamp: number;
}

export function createSessionToken(payload: SessionPayload): string {
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('hex');
  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [payloadBase64, signature] = token.split('.');
    
    if (!payloadBase64 || !signature) {
      return null;
    }

    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return null;
    }

    const decoded = Buffer.from(payloadBase64, 'base64').toString('utf-8');
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
