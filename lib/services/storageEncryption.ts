import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.STORAGE_ENCRYPTION_KEY || process.env.EMAIL_ENCRYPTION_KEY;
  if (!key) {
    console.warn('Warning: No encryption key found. Using fallback key for development.');
    return crypto.scryptSync('maturity360-dev-fallback-key', 'salt', 32);
  }
  return crypto.scryptSync(key, 'maturity360-storage-salt', 32);
}

export function encryptCredentials(data: Record<string, any>): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const jsonData = JSON.stringify(data);
  let encrypted = cipher.update(jsonData, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decryptCredentials(encryptedData: string): Record<string, any> {
  try {
    const key = getEncryptionKey();
    const parts = encryptedData.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return {};
  }
}

export function maskCredential(value: string): string {
  if (!value || value.length < 8) return '••••••••';
  return value.substring(0, 4) + '••••' + value.substring(value.length - 4);
}

export function getSecretFields(provider: string): string[] {
  const secretFieldsByProvider: Record<string, string[]> = {
    'GOOGLE_DRIVE': ['clientSecret', 'refreshToken'],
    'DROPBOX': ['accessToken'],
    'ONEDRIVE': ['clientSecret', 'refreshToken'],
    'SHAREPOINT': ['clientSecret'],
    'S3': ['secretAccessKey'],
    'LOCAL': [],
  };
  return secretFieldsByProvider[provider] || [];
}
