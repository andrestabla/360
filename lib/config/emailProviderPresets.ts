export interface ProviderPreset {
  id: string;
  label: string;
  icon?: string;
  defaults: {
    host: string;
    port: number;
    secure: boolean;
  };
  userHint: string;
  instructions: {
    title: string;
    steps: string[];
    links: { label: string; url: string }[];
    warning?: string;
  };
  regions?: { id: string; label: string; host: string }[];
}

export const emailProviderPresets: ProviderPreset[] = [
  {
    id: 'gmail',
    label: 'Gmail / Google Workspace',
    defaults: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
    },
    userHint: 'tu-email@gmail.com',
    instructions: {
      title: 'Configurar Gmail',
      steps: [
        'Activa la verificación en dos pasos en tu cuenta de Google',
        'Ve a la configuración de seguridad de tu cuenta',
        'Genera una "Contraseña de aplicación" para correo',
        'Usa tu email completo como usuario y la contraseña de aplicación generada'
      ],
      links: [
        { label: 'Configuración de seguridad de Google', url: 'https://myaccount.google.com/security' },
        { label: 'Crear contraseña de aplicación', url: 'https://myaccount.google.com/apppasswords' }
      ],
      warning: 'No uses tu contraseña normal de Gmail. Debes generar una "Contraseña de aplicación" específica.'
    }
  },
  {
    id: 'outlook',
    label: 'Microsoft 365 / Outlook',
    defaults: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
    },
    userHint: 'tu-email@outlook.com',
    instructions: {
      title: 'Configurar Microsoft 365',
      steps: [
        'Inicia sesión en tu cuenta de Microsoft',
        'Habilita la autenticación SMTP en tu cuenta',
        'Si usas autenticación de dos factores, genera una contraseña de aplicación',
        'Usa tu email completo como usuario'
      ],
      links: [
        { label: 'Configuración de cuenta Microsoft', url: 'https://account.microsoft.com/security' },
        { label: 'Habilitar SMTP AUTH', url: 'https://learn.microsoft.com/es-es/exchange/clients-and-mobile-in-exchange-online/authenticated-client-smtp-submission' }
      ]
    }
  },
  {
    id: 'sendgrid',
    label: 'SendGrid',
    defaults: {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
    },
    userHint: 'apikey',
    instructions: {
      title: 'Configurar SendGrid',
      steps: [
        'Inicia sesión en tu cuenta de SendGrid',
        'Ve a Settings → API Keys',
        'Crea una nueva API Key con permisos de "Mail Send"',
        'Usa "apikey" (literalmente) como usuario y tu API Key como contraseña'
      ],
      links: [
        { label: 'Crear API Key en SendGrid', url: 'https://app.sendgrid.com/settings/api_keys' },
        { label: 'Documentación SMTP', url: 'https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp' }
      ],
      warning: 'El usuario siempre debe ser "apikey" (literalmente, no tu email)'
    }
  },
  {
    id: 'mailgun',
    label: 'Mailgun',
    defaults: {
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
    },
    userHint: 'postmaster@tu-dominio.mailgun.org',
    instructions: {
      title: 'Configurar Mailgun',
      steps: [
        'Inicia sesión en tu cuenta de Mailgun',
        'Verifica tu dominio o usa el sandbox de pruebas',
        'Ve a Sending → Domain Settings → SMTP credentials',
        'Crea un usuario SMTP o usa las credenciales por defecto'
      ],
      links: [
        { label: 'Dashboard de Mailgun', url: 'https://app.mailgun.com/mg/sending/domains' },
        { label: 'Documentación SMTP', url: 'https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-via-smtp' }
      ]
    },
    regions: [
      { id: 'us', label: 'Estados Unidos', host: 'smtp.mailgun.org' },
      { id: 'eu', label: 'Europa', host: 'smtp.eu.mailgun.org' }
    ]
  },
  {
    id: 'ses',
    label: 'Amazon SES',
    defaults: {
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 587,
      secure: false,
    },
    userHint: 'AKIAIOSFODNN7EXAMPLE',
    instructions: {
      title: 'Configurar Amazon SES',
      steps: [
        'Inicia sesión en la consola de AWS',
        'Ve al servicio SES (Simple Email Service)',
        'Verifica tu dominio o dirección de email',
        'Crea credenciales SMTP en "SMTP Settings"',
        'Usa las credenciales generadas (Access Key ID y Secret)'
      ],
      links: [
        { label: 'Consola de Amazon SES', url: 'https://console.aws.amazon.com/ses/' },
        { label: 'Crear credenciales SMTP', url: 'https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html' }
      ],
      warning: 'Las credenciales SMTP son diferentes a tus Access Keys de AWS'
    },
    regions: [
      { id: 'us-east-1', label: 'US East (N. Virginia)', host: 'email-smtp.us-east-1.amazonaws.com' },
      { id: 'us-east-2', label: 'US East (Ohio)', host: 'email-smtp.us-east-2.amazonaws.com' },
      { id: 'us-west-2', label: 'US West (Oregon)', host: 'email-smtp.us-west-2.amazonaws.com' },
      { id: 'eu-west-1', label: 'Europe (Ireland)', host: 'email-smtp.eu-west-1.amazonaws.com' },
      { id: 'eu-central-1', label: 'Europe (Frankfurt)', host: 'email-smtp.eu-central-1.amazonaws.com' },
      { id: 'sa-east-1', label: 'South America (São Paulo)', host: 'email-smtp.sa-east-1.amazonaws.com' }
    ]
  },
  {
    id: 'custom',
    label: 'Servidor SMTP personalizado',
    defaults: {
      host: '',
      port: 587,
      secure: false,
    },
    userHint: 'usuario@tu-servidor.com',
    instructions: {
      title: 'Configurar servidor SMTP personalizado',
      steps: [
        'Obtén los datos de configuración de tu proveedor de hosting',
        'Generalmente necesitarás: servidor SMTP, puerto, usuario y contraseña',
        'Los puertos comunes son 587 (TLS), 465 (SSL) o 25 (sin cifrado)',
        'Asegúrate de que el firewall permita conexiones salientes al puerto seleccionado'
      ],
      links: []
    }
  }
];

export function getProviderPreset(id: string): ProviderPreset | undefined {
  return emailProviderPresets.find(p => p.id === id);
}
