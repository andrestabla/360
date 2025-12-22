import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function createEmailMessage(to: string, subject: string, body: string): string {
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ];
  
  const email = emailLines.join('\r\n');
  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const gmail = await getGmailClient();
    const raw = createEmailMessage(params.to, params.subject, params.body);
    
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: raw
      }
    });

    return {
      success: true,
      messageId: response.data.id || undefined
    };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

export async function sendNotificationEmail(
  to: string,
  title: string,
  message: string,
  tenantName?: string
): Promise<SendEmailResult> {
  const subject = tenantName ? `[${tenantName}] ${title}` : `[Maturity 360] ${title}`;
  
  const body = `
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

  return sendEmail({ to, subject, body });
}

export async function sendWorkflowNotification(
  to: string,
  workflowTitle: string,
  stepName: string,
  action: 'pending' | 'approved' | 'rejected' | 'completed',
  tenantName?: string
): Promise<SendEmailResult> {
  const actionTexts = {
    pending: 'requiere tu atención',
    approved: 'ha sido aprobado',
    rejected: 'ha sido rechazado',
    completed: 'ha sido completado'
  };

  const title = `Flujo de trabajo: ${workflowTitle}`;
  const message = `El paso "${stepName}" del flujo "${workflowTitle}" ${actionTexts[action]}.`;

  return sendNotificationEmail(to, title, message, tenantName);
}
