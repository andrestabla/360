import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/services/userService';
import { db } from '@/server/db';
import { platformAdmins } from '@/shared/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
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

      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isSuperAdmin: true,
        },
      });
    }

    const result = await authenticateUser(email.toLowerCase().trim(), password, tenantId);

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
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
