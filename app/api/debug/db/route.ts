
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const result = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1));
        return NextResponse.json({
            success: true,
            exists: result.length > 0,
            data: result[0] || null,
            env: {
                hasDbUrl: !!process.env.POSTGRES_URL || !!process.env.DATABASE_URL
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
