import nodemailer from 'nodemailer';
import { db } from '@/server/db';
import { tenantEmailConfigs, tenants } from '@/shared/schema';
import { eq } from 'drizzle-orm';

const ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY || 'maturity360-default-key-change-in-production';

function encryptPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

function decryptPassword(encrypted: string): string {
  return Buffer.from(encrypted, 'base64').toString('utf-8');
}

export interface EmailConfig {
  id: string;
  tenantId: string | null;
  provider: string;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpSecure: boolean | null;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  isEnabled: boolean | null;
  lastTestedAt: Date | null;
  lastTestResult: boolean | null;
}

export async function getEmailConfig(tenantId: string | null): Promise<EmailConfig | null> {
  try {
    const configs = await db.select().from(tenantEmailConfigs).where(
      tenantId ? eq(tenantEmailConfigs.tenantId, tenantId) : eq(tenantEmailConfigs.tenantId, 'platform')
    );
    
    if (configs.length === 0) return null;
    
    const config = configs[0];
    return {
      id: config.id,
      tenantId: config.tenantId,
      provider: config.provider,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpUser: config.smtpUser,
      smtpSecure: config.smtpSecure,
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      replyToEmail: config.replyToEmail,
      isEnabled: config.isEnabled,
      lastTestedAt: config.lastTestedAt,
      lastTestResult: config.lastTestResult,
    };
  } catch (error) {
    console.error('Error getting email config:', error);
    return null;
  }
}

export async function saveEmailConfig(config: {
  tenantId: string | null;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  smtpSecure: boolean;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
  createdBy: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const tenantIdValue = config.tenantId || 'platform';
    const existingConfigs = await db.select().from(tenantEmailConfigs).where(
      eq(tenantEmailConfigs.tenantId, tenantIdValue)
    );
    
    const configData: any = {
      tenantId: tenantIdValue,
      provider: 'SMTP',
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpUser: config.smtpUser,
      smtpSecure: config.smtpSecure,
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      replyToEmail: config.replyToEmail || null,
      isEnabled: true,
      updatedAt: new Date(),
    };

    if (config.smtpPassword) {
      configData.smtpPasswordEncrypted = encryptPassword(config.smtpPassword);
    }

    if (existingConfigs.length > 0) {
      await db.update(tenantEmailConfigs)
        .set(configData)
        .where(eq(tenantEmailConfigs.id, existingConfigs[0].id));
    } else {
      configData.id = `email-config-${tenantIdValue}-${Date.now()}`;
      configData.createdBy = config.createdBy;
      configData.createdAt = new Date();
      await db.insert(tenantEmailConfigs).values(configData);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving email config:', error);
    return { success: false, error: error.message };
  }
}

export async function testEmailConfig(tenantId: string | null): Promise<{ success: boolean; error?: string }> {
  try {
    const tenantIdValue = tenantId || 'platform';
    const configs = await db.select().from(tenantEmailConfigs).where(
      eq(tenantEmailConfigs.tenantId, tenantIdValue)
    );

    if (configs.length === 0) {
      return { success: false, error: 'No hay configuración de correo para este tenant' };
    }

    const config = configs[0];
    
    if (!config.smtpHost || !config.smtpUser || !config.smtpPasswordEncrypted) {
      return { success: false, error: 'Configuración SMTP incompleta' };
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort || 587,
      secure: config.smtpSecure || false,
      auth: {
        user: config.smtpUser,
        pass: decryptPassword(config.smtpPasswordEncrypted),
      },
    });

    await transporter.verify();

    await db.update(tenantEmailConfigs)
      .set({
        lastTestedAt: new Date(),
        lastTestResult: true,
        lastTestError: null,
        updatedAt: new Date(),
      })
      .where(eq(tenantEmailConfigs.id, config.id));

    return { success: true };
  } catch (error: any) {
    console.error('Error testing email config:', error);
    
    const tenantIdValue = tenantId || 'platform';
    const configs = await db.select().from(tenantEmailConfigs).where(
      eq(tenantEmailConfigs.tenantId, tenantIdValue)
    );
    
    if (configs.length > 0) {
      await db.update(tenantEmailConfigs)
        .set({
          lastTestedAt: new Date(),
          lastTestResult: false,
          lastTestError: error.message,
          updatedAt: new Date(),
        })
        .where(eq(tenantEmailConfigs.id, configs[0].id));
    }

    return { success: false, error: error.message };
  }
}

async function createTransporter(tenantId: string | null) {
  const tenantIdValue = tenantId || 'platform';
  const configs = await db.select().from(tenantEmailConfigs).where(
    eq(tenantEmailConfigs.tenantId, tenantIdValue)
  );

  if (configs.length === 0 || !configs[0].isEnabled) {
    throw new Error('Email no configurado para este tenant');
  }

  const config = configs[0];

  if (!config.smtpHost || !config.smtpUser || !config.smtpPasswordEncrypted) {
    throw new Error('Configuración SMTP incompleta');
  }

  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort || 587,
    secure: config.smtpSecure || false,
    auth: {
      user: config.smtpUser,
      pass: decryptPassword(config.smtpPasswordEncrypted),
    },
  });
}

export interface SendTenantEmailParams {
  tenantId: string | null;
  to: string;
  subject: string;
  html: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendTenantEmail(params: SendTenantEmailParams): Promise<SendEmailResult> {
  try {
    const tenantIdValue = params.tenantId || 'platform';
    const configs = await db.select().from(tenantEmailConfigs).where(
      eq(tenantEmailConfigs.tenantId, tenantIdValue)
    );

    if (configs.length === 0 || !configs[0].isEnabled) {
      return { success: false, error: 'Email no configurado para este tenant' };
    }

    const config = configs[0];
    const transporter = await createTransporter(params.tenantId);

    const result = await transporter.sendMail({
      from: `"${config.fromName || 'Maturity 360'}" <${config.fromEmail}>`,
      replyTo: config.replyToEmail || config.fromEmail || undefined,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('Error sending tenant email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendUserCredentialsEmail(
  tenantId: string,
  userEmail: string,
  userName: string,
  temporaryPassword: string,
  tenantName: string,
  loginUrl: string
): Promise<SendEmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .credentials-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .credentials-box p { margin: 8px 0; }
        .credentials-box strong { color: #1f2937; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #6b7280; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 6px; margin-top: 20px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Bienvenido a ${tenantName}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu cuenta ha sido creada</p>
        </div>
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Se ha creado una cuenta para ti en la plataforma de ${tenantName}. A continuación encontrarás tus credenciales de acceso:</p>
          
          <div class="credentials-box">
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Contraseña temporal:</strong> ${temporaryPassword}</p>
          </div>

          <div class="warning">
            <strong>Importante:</strong> Por seguridad, te pediremos que cambies tu contraseña la primera vez que inicies sesión.
          </div>

          <center>
            <a href="${loginUrl}" class="button">Iniciar Sesión</a>
          </center>
        </div>
        <div class="footer">
          <p>Este correo fue enviado automáticamente por ${tenantName}</p>
          <p>Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendTenantEmail({
    tenantId,
    to: userEmail,
    subject: `Bienvenido a ${tenantName} - Credenciales de acceso`,
    html,
  });
}

export async function resendCredentialsEmail(
  tenantId: string,
  userEmail: string,
  userName: string,
  newPassword: string,
  tenantName: string,
  loginUrl: string
): Promise<SendEmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .credentials-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Credenciales Actualizadas</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">${tenantName}</p>
        </div>
        <div class="content">
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Se han restablecido tus credenciales de acceso. Aquí están tus nuevos datos:</p>
          
          <div class="credentials-box">
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Nueva contraseña:</strong> ${newPassword}</p>
          </div>

          <center>
            <a href="${loginUrl}" class="button">Iniciar Sesión</a>
          </center>
        </div>
        <div class="footer">
          <p>Este correo fue enviado automáticamente por ${tenantName}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendTenantEmail({
    tenantId,
    to: userEmail,
    subject: `${tenantName} - Nuevas credenciales de acceso`,
    html,
  });
}

export async function deleteEmailConfig(tenantId: string | null): Promise<{ success: boolean; error?: string }> {
  try {
    const tenantIdValue = tenantId || 'platform';
    await db.delete(tenantEmailConfigs).where(eq(tenantEmailConfigs.tenantId, tenantIdValue));
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting email config:', error);
    return { success: false, error: error.message };
  }
}
