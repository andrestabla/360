import pg from 'pg';
const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL || '';
const nodeEnv = process.env.NODE_ENV || 'development';

const productionIndicators = [
  'production', 'prod-', '-prod', '.prod.',
  'neon.tech', 'supabase.co', 'planetscale', 'cockroachlabs',
  'railway.app', 'render.com', 'heroku', 'elephantsql',
  'digitalocean', '.postgres.database.azure.com', '.rds.amazonaws.com'
];

const isProductionUrl = productionIndicators.some(indicator => 
  databaseUrl.toLowerCase().includes(indicator.toLowerCase())
);

const isLocalhost = databaseUrl.includes('localhost') || 
                    databaseUrl.includes('127.0.0.1') ||
                    databaseUrl.includes('replit');

async function checkDatabaseEnvironment(): Promise<void> {
  if (isProductionUrl && !isLocalhost && nodeEnv !== 'production') {
    console.error('\n');
    console.error('╔══════════════════════════════════════════════════════════════════╗');
    console.error('║  ⛔ SECURITY BLOCK: Production database URL detected!            ║');
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

  const client = new Client({ connectionString: databaseUrl });
  
  try {
    await client.connect();
    const result = await client.query('SELECT environment, fingerprint FROM system_environment WHERE id = 1');
    
    if (result.rows.length > 0) {
      const dbEnv = result.rows[0].environment;
      const dbFingerprint = result.rows[0].fingerprint;
      
      if (dbEnv === 'production' && nodeEnv !== 'production') {
        console.error('\n');
        console.error('╔══════════════════════════════════════════════════════════════════╗');
        console.error('║  ⛔ SECURITY BLOCK: Production database marker detected!         ║');
        console.error('║                                                                  ║');
        console.error(`║  NODE_ENV: ${nodeEnv.padEnd(52)}║`);
        console.error(`║  Database: ${dbEnv.padEnd(52)}║`);
        console.error(`║  Fingerprint: ${dbFingerprint.substring(0, 40).padEnd(49)}║`);
        console.error('║                                                                  ║');
        console.error('║  The database is marked as PRODUCTION but you are running      ║');
        console.error('║  in development mode. This is blocked for safety.              ║');
        console.error('║                                                                  ║');
        console.error('║  To proceed, set NODE_ENV=production explicitly.                ║');
        console.error('╚══════════════════════════════════════════════════════════════════╝');
        console.error('\n');
        process.exit(1);
      }
      
      console.log(`✓ Database environment verified: ${dbEnv} (fingerprint: ${dbFingerprint.substring(0, 12)}...)`);
    } else {
      console.log(`✓ Environment check passed (NODE_ENV=${nodeEnv}) - No database marker found`);
    }
  } catch (error) {
    console.log(`✓ Environment check passed (NODE_ENV=${nodeEnv}) - Could not verify database marker`);
  } finally {
    await client.end();
  }
}

checkDatabaseEnvironment();
