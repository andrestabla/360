import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { sql } from 'drizzle-orm';

const DEFAULT_CONFIG = {
  sessionDurationHours: 24,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  requireStrongPassword: true,
  minPasswordLength: 8
};

export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT config FROM platform_settings WHERE key = 'security_config'
    `);
    
    if (result.rows.length > 0) {
      return NextResponse.json({
        success: true,
        config: result.rows[0].config
      });
    }
    
    return NextResponse.json({
      success: true,
      config: DEFAULT_CONFIG
    });
  } catch (error: any) {
    console.error('Error getting security config:', error);
    return NextResponse.json({
      success: true,
      config: DEFAULT_CONFIG
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    const validConfig = {
      sessionDurationHours: Math.min(Math.max(config.sessionDurationHours || 24, 1), 168),
      maxLoginAttempts: Math.min(Math.max(config.maxLoginAttempts || 5, 1), 20),
      lockoutDurationMinutes: Math.min(Math.max(config.lockoutDurationMinutes || 15, 1), 60),
      requireStrongPassword: config.requireStrongPassword !== false,
      minPasswordLength: Math.min(Math.max(config.minPasswordLength || 8, 6), 32)
    };

    await db.execute(sql`
      INSERT INTO platform_settings (key, config, updated_at)
      VALUES ('security_config', ${JSON.stringify(validConfig)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET 
        config = ${JSON.stringify(validConfig)}::jsonb,
        updated_at = NOW()
    `);

    return NextResponse.json({ success: true, config: validConfig });
  } catch (error: any) {
    console.error('Error saving security config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
