import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { testEmailConfig, sendEmail } from '@/lib/services/tenantEmailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sendTestTo,
      isDraft,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      smtpSecure,
      fromEmail,
      fromName,
    } = body;

    if (isDraft && smtpHost && smtpUser && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort) || 587,
        secure: smtpSecure === true || smtpSecure === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      try {
        await transporter.verify();
        return NextResponse.json({
          success: true,
          message: 'Conexión SMTP verificada correctamente',
        });
      } catch (smtpError: any) {
        return NextResponse.json({
          success: false,
          error: smtpError.message || 'Error de conexión SMTP',
        });
      }
    }

    // Global test config
    const verifyResult = await testEmailConfig();

    if (!verifyResult.success) {
      return NextResponse.json(verifyResult);
    }

    if (sendTestTo) {
      const sendResult = await sendEmail({
        to: sendTestTo,
        subject: 'Prueba de configuración de correo - Maturity 360',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .success-box { background: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; }
              .success-icon { font-size: 48px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-box">
                <div class="success-icon">✅</div>
                <h2 style="color: #065f46; margin: 10px 0;">Configuración Exitosa</h2>
                <p style="color: #047857;">Tu servidor de correo está configurado correctamente.</p>
                <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
                  Este es un correo de prueba enviado desde Maturity 360.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (!sendResult.success) {
        return NextResponse.json({
          success: false,
          error: `Conexión verificada pero error al enviar: ${sendResult.error}`,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Correo de prueba enviado a ${sendTestTo}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Conexión SMTP verificada correctamente',
    });
  } catch (error: any) {
    console.error('Error testing email config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
