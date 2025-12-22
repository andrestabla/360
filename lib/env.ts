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
  const recommended = ['EMAIL_ENCRYPTION_KEY', 'STORAGE_ENCRYPTION_KEY'];
  
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

export function preventProductionDataLeak(): void {
  const env = getEnvironment();
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (env === 'development' && dbUrl.includes('production')) {
    throw new Error(
      'SECURITY: Development environment is connected to a production database.\n' +
      'This is strictly prohibited. Use a separate development database.'
    );
  }
}

export { getEnvironment, type Environment };
