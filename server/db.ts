import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

declare global {
  var _dbPool: pg.Pool | undefined;
}

function getPool(): pg.Pool {
  if (process.env.NODE_ENV === "production") {
    return new Pool({ connectionString: process.env.DATABASE_URL });
  }
  
  if (!global._dbPool) {
    global._dbPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return global._dbPool;
}

export const pool = getPool();
export const db = drizzle(pool, { schema });
