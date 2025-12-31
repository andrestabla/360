import nodemailer from 'nodemailer';
import { db } from '@/server/db';
import { emailSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const keyString = process.env.EMAIL_ENCRYPTION_KEY;
  if (!keyString) {
    // Fallback for dev only
    return crypto.scryptSync('dev-only-key-not-for-production-use', 'salt', 32);
  }
  return crypto.scryptSync(keyString, 'maturity360-salt', 32);
}

export function encryptPassword(password: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `v2:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return Buffer.from(password).toString('base64');
  }
}

function decryptPassword(encrypted: string): string {
  try {
    if (encrypted.startsWith('v2:')) {
      const parts = encrypted.split(':');
      if (parts.length !== 4) throw new Error('Invalid encrypted format');

      const [, ivHex, authTagHex, encryptedHex] = parts;
      const key = getEncryptionKey();
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
    return Buffer.from(encrypted, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt SMTP password');
  }
}

export interface EmailConfig {
  id: number;
  provider: string;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpSecure: boolean | null;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  isEnabled: boolean | null;
}

export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    const configs = await db.select().from(emailSettings).limit(1);

    if (configs.length === 0) return null;

    const config = configs[0];
    return {
      id: config.id,
      provider: config.provider,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpUser: config.smtpUser,
      smtpSecure: config.smtpSecure,
      fromName: config.fromName,
      fromEmail: config.fromEmail,
      replyToEmail: config.replyToEmail,
      isEnabled: config.isEnabled,
    };
  } catch (error) {
    console.error('Error getting email config:', error);
    return null;
  }
}

export async function saveEmailConfig(config: {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  smtpSecure: boolean;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const existingConfigs = await db.select().from(emailSettings).limit(1);

    const configData: any = {
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
      await db.update(emailSettings)
        .set(configData)
        .where(eq(emailSettings.id, existingConfigs[0].id));
    } else {
      await db.insert(emailSettings).values(configData);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error saving email config:', error);
    return { success: false, error: error.message };
  }
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const configs = await db.select().from(emailSettings).limit(1);

    if (configs.length === 0 || !configs[0].isEnabled) {
      return { success: false, error: 'Email no configurado' };
    }

    const config = configs[0];

    console.log(`[EmailService] Attempting to send email to ${params.to} using ${config.smtpHost}:${config.smtpPort}`);

    if (!config.smtpHost || !config.smtpUser || !config.smtpPasswordEncrypted) {
      console.error('[EmailService] SMTP configuration is incomplete');
      return { success: false, error: 'Configuración SMTP incompleta' };
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost || undefined,
      port: config.smtpPort || undefined,
      secure: config.smtpPort === 465, // true for 465, false for other ports
      requireTLS: config.smtpPort === 587, // STARTTLS for port 587 (Amazon SES)
      auth: {
        user: config.smtpUser,
        pass: decryptPassword(config.smtpPasswordEncrypted),
      },
      tls: {
        // Required for some SMTP servers like Amazon SES
        ciphers: 'SSLv3',
        rejectUnauthorized: true
      },
      connectionTimeout: 10000, // 10 seconds to connect
      socketTimeout: 10000, // 10 seconds for socket inactivity
      logger: true, // Enable logging
      debug: process.env.NODE_ENV !== 'production', // Debug in development
    });

    console.log('[EmailService] Transporter created, sending mail...');

    const info = await transporter.sendMail({
      from: `"${config.fromName || 'Maturity 360'}" <${config.fromEmail}>`,
      replyTo: config.replyToEmail || config.fromEmail || undefined,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    console.log('[EmailService] Email sent successfully:', info.messageId);

    return { success: true };
  } catch (error: any) {
    console.error('[EmailService] Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendUserCredentialsEmail(
  userEmail: string,
  userName: string,
  temporaryPassword: string,
  loginUrl: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <html>
      <body>
        <h1>Bienvenido a Maturity 360</h1>
        <p>Hola ${userName},</p>
        <p>Tu cuenta ha sido creada. Aquí tienes tus credenciales:</p>
        <p>Usuario: ${userEmail}</p>
        <p>Contraseña: ${temporaryPassword}</p>
        <p><a href="${loginUrl}">Iniciar Sesión</a></p>
      </body>
    </html>
  `;
  return sendEmail({ to: userEmail, subject: 'Tus credenciales de acceso', html });
}

// Same as above but for resend
export async function resendCredentialsEmail(
  userEmail: string,
  userName: string,
  temporaryPassword: string,
  loginUrl: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <html>
      <body>
        <h1>Maturity 360 - Recordatorio de Credenciales</h1>
        <p>Hola ${userName},</p>
        <p>Aquí tienes nuevamente tus credenciales de acceso:</p>
        <p>Usuario: ${userEmail}</p>
        <p>Contraseña: ${temporaryPassword}</p>
        <p><a href="${loginUrl}">Iniciar Sesión</a></p>
      </body>
    </html>
  `;
  return sendEmail({ to: userEmail, subject: 'Tus credenciales de acceso', html });
}

export async function deleteEmailConfig(): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(emailSettings);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting email config:', error);
    return { success: false, error: error.message };
  }
}

export async function testEmailConfig(): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getEmailConfig();
    // Also fetch raw to get password
    const configs = await db.select().from(emailSettings).limit(1);

    if (configs.length === 0 || !configs[0].isEnabled) {
      return { success: false, error: 'Configuración no encontrada o deshabilitada' };
    }

    const dbConfig = configs[0];

    if (!dbConfig.smtpHost || !dbConfig.smtpUser) {
      return { success: false, error: 'Configuración incompleta' };
    }

    if (!dbConfig.smtpPasswordEncrypted) return { success: false, error: 'Contraseña no configurada' };

    const transporter = nodemailer.createTransport({
      host: dbConfig.smtpHost || undefined,
      port: dbConfig.smtpPort || undefined,
      secure: dbConfig.smtpPort === 465,
      requireTLS: dbConfig.smtpPort === 587,
      auth: {
        user: dbConfig.smtpUser,
        pass: decryptPassword(dbConfig.smtpPasswordEncrypted),
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: true
      },
    });

    await transporter.verify();
    return { success: true };
  } catch (error: any) {
    console.error('Error testing email config:', error);
    return { success: false, error: error.message };
  }
}

export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  tenantName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subject = tenantName ? `[${tenantName}] ${title}` : `[Maturity 360] ${title}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">${title}</h2>
          </div>
          <div class="content">
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>Este correo fue enviado automáticamente por Maturity 360</p>
            <p>${tenantName || 'maturity.online'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail({ to, subject, html });
  } catch (error: any) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
}
