import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/services/userService';
import { db } from '@/server/db';
import { platformAdmins } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createSessionToken } from '@/lib/services/sessionToken';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/services/rateLimit';

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, 'login');
    
    if (!rateLimitResult.success) {
      const response = NextResponse.json({ 
        success: false, 
        error: `Demasiados intentos de login. Intente de nuevo en ${rateLimitResult.retryAfter} segundos.`
      }, { status: 429 });
      
      Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }
    
    const body = await request.json();
    const { email, password, tenantId, isSuperAdmin } = body;

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email y contraseña son requeridos' 
      }, { status: 400 });
    }

    if (isSuperAdmin) {
      try {
        const result = await db.execute(sql`SELECT COUNT(*) as count FROM platform_admins`);
        console.log('Platform admins count:', result);
      } catch (countErr) {
        console.error('Error checking platform_admins table:', countErr);
      }

      const [admin] = await db.select().from(platformAdmins).where(eq(platformAdmins.email, email.toLowerCase().trim()));
      
      if (!admin) {
        return NextResponse.json({ 
          success: false, 
          error: 'Credenciales inválidas' 
        }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return NextResponse.json({ 
          success: false, 
          error: 'Credenciales inválidas' 
        }, { status: 401 });
      }

      await db.update(platformAdmins).set({
        lastLogin: new Date(),
      }).where(eq(platformAdmins.id, admin.id));

      const sessionToken = createSessionToken({
        email: admin.email,
        isSuperAdmin: true,
        timestamp: Date.now(),
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isSuperAdmin: true,
        },
        sessionToken,
      });

      response.cookies.set('m360_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    const result = await authenticateUser(email.toLowerCase().trim(), password, tenantId);

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 401 });
    }

    const userSessionToken = createSessionToken({
      email: result.user?.email || email,
      isSuperAdmin: false,
      timestamp: Date.now(),
    });

    const response = NextResponse.json({
      success: true,
      user: result.user,
      sessionToken: userSessionToken,
    });

    response.cookies.set('m360_session', userSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error?.message || error);
    console.error('Stack:', error?.stack);
    
    if (error?.message?.includes('does not exist')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Base de datos no inicializada. Contacte al administrador.'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Error en el servidor'
    }, { status: 500 });
  }
}
