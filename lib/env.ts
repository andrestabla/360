type Environment = 'development' | 'production' | 'test';

interface EnvConfig {
  NODE_ENV: Environment;
  DATABASE_URL: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
}

function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'production' || env === 'development' || env === 'test') {
    return env;
  }
  return 'development';
}

function validateDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is required.\n' +
      'For development: Set in Replit Secrets or .env file\n' +
      'For production: Set in Deploy → Environment Variables'
    );
  }
  return url;
}

function validateProductionSecrets(): void {
  const required = ['DATABASE_URL'];
  const recommended = ['EMAIL_ENCRYPTION_KEY', 'STORAGE_ENCRYPTION_KEY', 'SESSION_SECRET'];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  const missingRecommended = recommended.filter(key => !process.env[key]);
  if (missingRecommended.length > 0 && getEnvironment() === 'production') {
    console.warn(`Warning: Missing recommended production secrets: ${missingRecommended.join(', ')}`);
  }
}

export function getEnvConfig(): EnvConfig {
  const env = getEnvironment();
  
  return {
    NODE_ENV: env,
    DATABASE_URL: validateDatabaseUrl(),
    isProduction: env === 'production',
    isDevelopment: env === 'development',
    isTest: env === 'test',
  };
}

export function validateEnvironment(): void {
  const env = getEnvironment();
  
  validateDatabaseUrl();
  
  if (env === 'production') {
    validateProductionSecrets();
  }
  
  console.log(`Environment validated: ${env}`);
}

export async function validateDatabaseEnvironment(db: { execute: (sql: unknown) => Promise<{ rows: Array<{ environment: string; fingerprint: string }> }> }, sql: (strings: TemplateStringsArray, ...values: unknown[]) => unknown): Promise<void> {
  const nodeEnv = getEnvironment();
  
  try {
    const result = await db.execute(sql`SELECT environment, fingerprint FROM system_environment WHERE id = 1`);
    
    if (!result.rows || result.rows.length === 0) {
      console.warn('Warning: No environment marker found in database. Run db:seed to initialize.');
      return;
    }
    
    const dbEnv = result.rows[0].environment;
    const dbFingerprint = result.rows[0].fingerprint;
    
    if (dbEnv === 'production' && nodeEnv !== 'production') {
      throw new Error(
        `\n╔══════════════════════════════════════════════════════════════════╗\n` +
        `║  ⛔ SECURITY BLOCK: Production database detected!                ║\n` +
        `║                                                                  ║\n` +
        `║  NODE_ENV: ${nodeEnv.padEnd(52)}║\n` +
        `║  Database: ${dbEnv.padEnd(52)}║\n` +
        `║  Fingerprint: ${dbFingerprint.substring(0, 20)}...${' '.repeat(29)}║\n` +
        `║                                                                  ║\n` +
        `║  To proceed, set NODE_ENV=production explicitly.                ║\n` +
        `║  This safeguard prevents accidental production access.          ║\n` +
        `╚══════════════════════════════════════════════════════════════════╝\n`
      );
    }
    
    if (dbEnv !== nodeEnv && process.env.ALLOW_CROSS_ENV !== '1') {
      console.warn(`Warning: Environment mismatch - NODE_ENV=${nodeEnv}, Database=${dbEnv}`);
    }
    
    console.log(`✓ Database environment verified: ${dbEnv} (fingerprint: ${dbFingerprint.substring(0, 12)}...)`);
    
  } catch (error) {
    if ((error as Error).message?.includes('SECURITY BLOCK')) {
      throw error;
    }
    console.warn('Warning: Could not verify database environment marker. Table may not exist yet.');
  }
}

export function preventProductionDataLeak(): void {
  const env = getEnvironment();
  const dbUrl = process.env.DATABASE_URL || '';
  
  const productionIndicators = [
    'production',
    'prod-',
    '-prod',
    '.prod.',
    'neon.tech',
    'supabase.co',
    'planetscale',
    'cockroachlabs',
    'railway.app',
    'render.com',
    'heroku',
    'elephantsql',
    'digitalocean',
    '.postgres.database.azure.com',
    '.rds.amazonaws.com',
  ];
  
  const looksLikeProduction = productionIndicators.some(indicator => 
    dbUrl.toLowerCase().includes(indicator.toLowerCase())
  );
  
  const isLocalhost = dbUrl.includes('localhost') || 
                      dbUrl.includes('127.0.0.1') ||
                      dbUrl.includes('replit');
  
  if (env === 'development' && looksLikeProduction && !isLocalhost) {
    throw new Error(
      `\n╔══════════════════════════════════════════════════════════════════╗\n` +
      `║  ⛔ SECURITY BLOCK: Production database URL detected!            ║\n` +
      `║                                                                  ║\n` +
      `║  NODE_ENV is set to 'development' but DATABASE_URL appears      ║\n` +
      `║  to point to a production database.                             ║\n` +
      `║                                                                  ║\n` +
      `║  Options:                                                        ║\n` +
      `║  1. Use a development database instead                          ║\n` +
      `║  2. Set NODE_ENV=production if this is intentional              ║\n` +
      `╚══════════════════════════════════════════════════════════════════╝\n`
    );
  }
}

export { getEnvironment, type Environment };
