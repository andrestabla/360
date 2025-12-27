import { NextRequest, NextResponse } from 'next/server';
import { sendUserCredentialsEmail, resendCredentialsEmail } from '@/lib/services/tenantEmailService';
import { DB } from '@/lib/data';

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, customPassword } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId es requerido' }, { status: 400 });
    }

    const user = DB.users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (!user.email) {
      return NextResponse.json({ success: false, error: 'El usuario no tiene email configurado' }, { status: 400 });
    }

    // Global settings for Single Tenant - tenantName removed as unused

    const baseUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.NEXT_PUBLIC_APP_URL || 'https://maturity.online';

    // Global Login URL (no tenant slug)
    const loginUrl = `${baseUrl}/login`;

    const password = customPassword || generateTemporaryPassword();

    let result;
    // Updated calls without tenantId and tenantName
    if (type === 'resend') {
      result = await resendCredentialsEmail(
        user.email,
        user.name,
        password,
        loginUrl
      );
    } else {
      result = await sendUserCredentialsEmail(
        user.email,
        user.name,
        password,
        loginUrl
      );
    }

    if (result.success) {
      const userIdx = DB.users.findIndex(u => u.id === userId);
      if (userIdx >= 0) {
        DB.users[userIdx] = {
          ...DB.users[userIdx],
          password: password,
          mustChangePassword: true,
          inviteSentAt: new Date().toISOString(),
          inviteExpiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString()
        };
        DB.save();
      }

      return NextResponse.json({
        success: true,
        message: `Credenciales enviadas a ${user.email}`
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Error al enviar email'
      });
    }
  } catch (error: any) {
    console.error('Error sending credentials:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
