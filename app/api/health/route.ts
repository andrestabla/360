import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const platformAdminsResult = await db.execute(sql`SELECT COUNT(*) as count FROM platform_admins`);
    const tenantsResult = await db.execute(sql`SELECT COUNT(*) as count FROM tenants`);
    const usersResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`);

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      counts: {
        platformAdmins: platformAdminsResult.rows[0]?.count || 0,
        tenants: tenantsResult.rows[0]?.count || 0,
        users: usersResult.rows[0]?.count || 0,
      },
      env: process.env.NODE_ENV,
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error?.message?.includes('does not exist') 
        ? 'Tables not found - database not initialized' 
        : 'Database connection error',
      env: process.env.NODE_ENV,
    }, { status: 500 });
  }
}
