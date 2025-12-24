const databaseUrl = process.env.DATABASE_URL || '';
const nodeEnv = process.env.NODE_ENV || 'development';

const isProductionDb = databaseUrl.includes('neon.tech') || 
                       databaseUrl.includes('supabase.co') ||
                       databaseUrl.includes('planetscale') ||
                       databaseUrl.includes('cockroachlabs') ||
                       databaseUrl.includes('railway.app') ||
                       databaseUrl.includes('render.com') ||
                       databaseUrl.includes('heroku') ||
                       databaseUrl.includes('elephantsql') ||
                       databaseUrl.includes('digitalocean') ||
                       databaseUrl.includes('.postgres.database.azure.com') ||
                       databaseUrl.includes('.rds.amazonaws.com');

const isLocalhost = databaseUrl.includes('localhost') || 
                    databaseUrl.includes('127.0.0.1') ||
                    databaseUrl.includes('replit');

if (isProductionDb && nodeEnv !== 'production') {
  console.error('\n');
  console.error('╔══════════════════════════════════════════════════════════════════╗');
  console.error('║  ⛔ SECURITY BLOCK: Production database detected!                ║');
  console.error('║                                                                  ║');
  console.error('║  You are trying to run a development command against what       ║');
  console.error('║  appears to be a production database.                           ║');
  console.error('║                                                                  ║');
  console.error('║  To proceed, set NODE_ENV=production explicitly:                ║');
  console.error('║  $ NODE_ENV=production npm run <command>                        ║');
  console.error('║                                                                  ║');
  console.error('║  This safeguard prevents accidental data loss.                  ║');
  console.error('╚══════════════════════════════════════════════════════════════════╝');
  console.error('\n');
  process.exit(1);
}

if (nodeEnv === 'production' && isLocalhost) {
  console.error('\n');
  console.error('╔══════════════════════════════════════════════════════════════════╗');
  console.error('║  ⚠️  WARNING: Production mode with local database                ║');
  console.error('║                                                                  ║');
  console.error('║  NODE_ENV is set to production but DATABASE_URL points to       ║');
  console.error('║  a local database. This might not be intended.                  ║');
  console.error('╚══════════════════════════════════════════════════════════════════╝');
  console.error('\n');
}

console.log(`✓ Environment check passed (NODE_ENV=${nodeEnv})`);
