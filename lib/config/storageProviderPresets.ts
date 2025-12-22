export interface StorageProviderPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  instructions: {
    title: string;
    steps: string[];
    warning?: string;
    links: { label: string; url: string }[];
  };
  fields: {
    id: string;
    label: string;
    type: 'text' | 'password' | 'number' | 'select';
    placeholder?: string;
    hint?: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[];
  regions?: { id: string; label: string; endpoint?: string }[];
}

export const storageProviderPresets: StorageProviderPreset[] = [
  {
    id: 'GOOGLE_DRIVE',
    label: 'Google Drive',
    icon: 'GoogleDriveLogo',
    description: 'Almacenamiento en la nube de Google',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    instructions: {
      title: 'Configurar Google Drive API',
      steps: [
        'Ve a Google Cloud Console (console.cloud.google.com)',
        'Crea un nuevo proyecto o selecciona uno existente',
        'Habilita la API de Google Drive',
        'Ve a "Credenciales" y crea credenciales OAuth 2.0',
        'Configura la pantalla de consentimiento OAuth',
        'Descarga el archivo JSON de credenciales',
        'Genera un Refresh Token usando OAuth Playground',
      ],
      warning: 'Asegúrate de que la cuenta de servicio tenga permisos de escritura en la carpeta de Drive.',
      links: [
        { label: 'Google Cloud Console', url: 'https://console.cloud.google.com/' },
        { label: 'OAuth Playground', url: 'https://developers.google.com/oauthplayground/' },
        { label: 'Documentación API', url: 'https://developers.google.com/drive/api/v3/about-sdk' },
      ],
    },
    fields: [
      { id: 'clientId', label: 'Client ID', type: 'text', placeholder: '123456789-abcdefg.apps.googleusercontent.com', required: true },
      { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'GOCSPX-xxxxxxxxxxxxxxxxxxxxx', required: true },
      { id: 'refreshToken', label: 'Refresh Token', type: 'password', placeholder: '1//xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', required: true },
      { id: 'folderId', label: 'Folder ID (Opcional)', type: 'text', placeholder: '1AbCdEfGhIjKlMnOpQrStUvWxYz', hint: 'ID de la carpeta raíz donde se almacenarán todos los documentos', required: false },
    ],
  },
  {
    id: 'DROPBOX',
    label: 'Dropbox',
    icon: 'DropboxLogo',
    description: 'Almacenamiento en la nube de Dropbox',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    instructions: {
      title: 'Configurar Dropbox API',
      steps: [
        'Ve a Dropbox App Console (www.dropbox.com/developers/apps)',
        'Crea una nueva aplicación',
        'Selecciona "Scoped access" y "Full Dropbox"',
        'En Permissions, habilita files.content.write y files.content.read',
        'Genera un Access Token con permisos de larga duración',
      ],
      warning: 'Los tokens de acceso expiran. Considera usar OAuth con refresh tokens para producción.',
      links: [
        { label: 'Dropbox App Console', url: 'https://www.dropbox.com/developers/apps' },
        { label: 'Documentación API', url: 'https://www.dropbox.com/developers/documentation/http/documentation' },
      ],
    },
    fields: [
      { id: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'sl.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', required: true },
      { id: 'rootPath', label: 'Root Path (Opcional)', type: 'text', placeholder: '/Maturity360', hint: 'Ruta raíz donde se almacenarán todos los documentos', required: false },
    ],
  },
  {
    id: 'ONEDRIVE',
    label: 'OneDrive',
    icon: 'MicrosoftOutlookLogo',
    description: 'Almacenamiento en la nube de Microsoft',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    instructions: {
      title: 'Configurar Microsoft Graph API',
      steps: [
        'Ve a Azure Portal (portal.azure.com)',
        'Registra una nueva aplicación en Azure Active Directory',
        'En "API permissions", añade Files.ReadWrite.All de Microsoft Graph',
        'Crea un Client Secret en "Certificates & secrets"',
        'Configura las URLs de redirección para OAuth',
        'Genera un Refresh Token usando el flujo OAuth',
      ],
      warning: 'Los Client Secrets expiran. Configura una fecha de expiración larga o usa certificados.',
      links: [
        { label: 'Azure Portal', url: 'https://portal.azure.com/' },
        { label: 'Graph Explorer', url: 'https://developer.microsoft.com/en-us/graph/graph-explorer' },
        { label: 'Documentación OneDrive API', url: 'https://docs.microsoft.com/en-us/onedrive/developer/' },
      ],
    },
    fields: [
      { id: 'clientId', label: 'Client ID (Application ID)', type: 'text', placeholder: '12345678-1234-1234-1234-123456789abc', required: true },
      { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', required: true },
      { id: 'refreshToken', label: 'Refresh Token', type: 'password', placeholder: 'M.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', required: true },
      { id: 'driveId', label: 'Drive ID (Opcional)', type: 'text', placeholder: 'b!xxxxxxxx', hint: 'ID del drive específico. Si está vacío, se usa el drive principal.', required: false },
    ],
  },
  {
    id: 'SHAREPOINT',
    label: 'SharePoint',
    icon: 'MicrosoftOutlookLogo',
    description: 'Bibliotecas de documentos de SharePoint',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    instructions: {
      title: 'Configurar SharePoint API',
      steps: [
        'Ve a Azure Portal y registra una aplicación',
        'Añade permisos de SharePoint: Sites.ReadWrite.All',
        'Crea un Client Secret',
        'Obtén el Tenant ID de tu organización',
        'Copia la URL del sitio de SharePoint donde quieres almacenar documentos',
      ],
      warning: 'Asegúrate de tener permisos de administrador en el sitio de SharePoint.',
      links: [
        { label: 'Azure Portal', url: 'https://portal.azure.com/' },
        { label: 'SharePoint Admin Center', url: 'https://admin.microsoft.com/sharepoint' },
        { label: 'Documentación SharePoint API', url: 'https://docs.microsoft.com/en-us/sharepoint/dev/' },
      ],
    },
    fields: [
      { id: 'siteUrl', label: 'Site URL', type: 'text', placeholder: 'https://yourcompany.sharepoint.com/sites/yoursite', required: true },
      { id: 'clientId', label: 'Client ID', type: 'text', placeholder: '12345678-1234-1234-1234-123456789abc', required: true },
      { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', required: true },
      { id: 'tenantId', label: 'Tenant ID', type: 'text', placeholder: '12345678-1234-1234-1234-123456789abc', required: true },
      { id: 'libraryName', label: 'Library Name (Opcional)', type: 'text', placeholder: 'Documents', hint: 'Nombre de la biblioteca de documentos. Por defecto: Documents', required: false },
    ],
  },
  {
    id: 'S3',
    label: 'Amazon S3',
    icon: 'AmazonLogo',
    description: 'Almacenamiento de objetos de AWS',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    instructions: {
      title: 'Configurar Amazon S3',
      steps: [
        'Inicia sesión en AWS Console',
        'Crea un bucket en S3 o usa uno existente',
        'En IAM, crea un usuario con acceso programático',
        'Asigna una política con permisos S3 (s3:PutObject, s3:GetObject, s3:DeleteObject)',
        'Guarda las Access Keys generadas',
        'Configura CORS en el bucket si necesitas acceso desde el navegador',
      ],
      warning: 'Nunca expongas tus Access Keys. Usa roles IAM en producción cuando sea posible.',
      links: [
        { label: 'AWS Console', url: 'https://console.aws.amazon.com/s3/' },
        { label: 'IAM Console', url: 'https://console.aws.amazon.com/iam/' },
        { label: 'Documentación S3', url: 'https://docs.aws.amazon.com/s3/' },
      ],
    },
    fields: [
      { id: 'accessKeyId', label: 'Access Key ID', type: 'text', placeholder: 'AKIAIOSFODNN7EXAMPLE', required: true },
      { id: 'secretAccessKey', label: 'Secret Access Key', type: 'password', placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', required: true },
      { id: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'my-maturity360-bucket', required: true },
      { id: 'region', label: 'Region', type: 'select', required: true, options: [
        { value: 'us-east-1', label: 'US East (N. Virginia)' },
        { value: 'us-east-2', label: 'US East (Ohio)' },
        { value: 'us-west-1', label: 'US West (N. California)' },
        { value: 'us-west-2', label: 'US West (Oregon)' },
        { value: 'eu-west-1', label: 'EU (Ireland)' },
        { value: 'eu-west-2', label: 'EU (London)' },
        { value: 'eu-west-3', label: 'EU (Paris)' },
        { value: 'eu-central-1', label: 'EU (Frankfurt)' },
        { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
        { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
        { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
        { value: 'sa-east-1', label: 'South America (São Paulo)' },
      ]},
      { id: 'prefix', label: 'Prefix (Opcional)', type: 'text', placeholder: 'maturity360/', hint: 'Prefijo para organizar archivos dentro del bucket', required: false },
    ],
    regions: [
      { id: 'us-east-1', label: 'US East (N. Virginia)', endpoint: 's3.us-east-1.amazonaws.com' },
      { id: 'eu-west-1', label: 'EU (Ireland)', endpoint: 's3.eu-west-1.amazonaws.com' },
      { id: 'sa-east-1', label: 'South America (São Paulo)', endpoint: 's3.sa-east-1.amazonaws.com' },
    ],
  },
  {
    id: 'LOCAL',
    label: 'Almacenamiento Local',
    icon: 'HardDrives',
    description: 'Almacenamiento en el servidor local',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    instructions: {
      title: 'Configurar Almacenamiento Local',
      steps: [
        'Define la ruta base donde se guardarán los archivos',
        'Asegúrate de que el directorio exista y tenga permisos de escritura',
        'Configura un límite de almacenamiento si es necesario',
        'Considera configurar backups periódicos del directorio',
      ],
      warning: 'El almacenamiento local no es recomendado para producción. Considera usar un proveedor en la nube.',
      links: [],
    },
    fields: [
      { id: 'basePath', label: 'Ruta Base', type: 'text', placeholder: '/var/www/maturity360/storage', hint: 'Ruta absoluta en el servidor donde se almacenarán los archivos', required: true },
      { id: 'maxSizeGB', label: 'Límite de Almacenamiento (GB)', type: 'number', placeholder: '100', hint: 'Límite máximo de espacio en disco', required: false },
    ],
  },
];

export function getStorageProviderPreset(providerId: string): StorageProviderPreset | undefined {
  return storageProviderPresets.find(p => p.id === providerId);
}
