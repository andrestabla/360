interface WelcomeEmailParams {
    userName: string;
    userEmail: string;
    temporaryPassword: string;
    loginUrl: string;
    companyName?: string;
    logoUrl?: string;
}

export function generateWelcomeEmail({
    userName,
    userEmail,
    temporaryPassword,
    loginUrl,
    companyName = 'Maturity 360',
    logoUrl = ''
}: WelcomeEmailParams): { subject: string; html: string; text: string } {
    const subject = `Bienvenido a ${companyName}`;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="max-width: 150px; height: auto; margin-bottom: 20px;">` : ''}
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">¡Bienvenido a ${companyName}!</h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Hola <strong>${userName}</strong>,
                            </p>
                            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Tu cuenta en ${companyName} ha sido creada exitosamente. A continuación encontrarás tus credenciales de acceso:
                            </p>
                            
                            <!-- Credentials Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Usuario
                                        </p>
                                        <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px; font-family: 'Courier New', monospace;">
                                            ${userEmail}
                                        </p>
                                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Contraseña Temporal
                                        </p>
                                        <p style="margin: 0; color: #111827; font-size: 16px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">
                                            ${temporaryPassword}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Por tu seguridad, te pediremos que cambies esta contraseña la primera vez que inicies sesión.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center">
                                        <a href="${loginUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                            Iniciar Sesión
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 20px;">
                                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a tu administrador.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 18px; text-align: center;">
                                Este es un mensaje automático. Por favor no respondas a este correo.
                            </p>
                            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px; line-height: 18px; text-align: center;">
                                © ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const text = `
Bienvenido a ${companyName}

Hola ${userName},

Tu cuenta en ${companyName} ha sido creada exitosamente.

CREDENCIALES DE ACCESO:
Usuario: ${userEmail}
Contraseña Temporal: ${temporaryPassword}

Por tu seguridad, te pediremos que cambies esta contraseña la primera vez que inicies sesión.

Inicia sesión aquí: ${loginUrl}

Si tienes alguna pregunta o necesitas ayuda, no dud es en contactar a tu administrador.

---
Este es un mensaje automático. Por favor no respondas a este correo.
© ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.
    `.trim();

    return { subject, html, text };
}
