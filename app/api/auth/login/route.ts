import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/services/userService';
import { db } from '@/server/db';
import { platformAdmins } from '@/shared/schema';
import { eq } from 'drizzle-orm';
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
      const [admin] = await db.select().from(platformAdmins).where(eq(platformAdmins.email, email));
      
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

    const result = await authenticateUser(email, password, tenantId);

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
    console.error('Error during login:', error?.message || error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json({ 
      success: false, 
      error: 'Error en el servidor',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 });
  }
}
