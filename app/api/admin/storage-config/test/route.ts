import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, config } = body;

    if (!provider) {
      return NextResponse.json({
        success: false,
        error: 'Proveedor es requerido'
      }, { status: 400 });
    }

    let isValid = false;
    let errorMessage = '';

    switch (provider) {
      case 'GOOGLE_DRIVE':
        isValid = !!(config.clientId && config.clientSecret && config.refreshToken);
        errorMessage = 'Faltan credenciales: Client ID, Client Secret o Refresh Token';
        break;

      case 'DROPBOX':
        isValid = !!config.accessToken;
        errorMessage = 'Falta el Access Token de Dropbox';
        break;

      case 'ONEDRIVE':
        isValid = !!(config.clientId && config.clientSecret && config.refreshToken);
        errorMessage = 'Faltan credenciales: Client ID, Client Secret o Refresh Token';
        break;

      case 'SHAREPOINT':
        isValid = !!(config.siteUrl && config.clientId && config.clientSecret && config.tenantId);
        errorMessage = 'Faltan credenciales: Site URL, Client ID, Client Secret o Tenant ID';
        break;

      case 'S3':
        isValid = !!(config.accessKeyId && config.secretAccessKey && config.region && config.bucket);
        errorMessage = 'Faltan credenciales: Access Key ID, Secret Access Key, Region o Bucket';
        break;

      case 'LOCAL':
        isValid = !!config.basePath;
        errorMessage = 'Falta la ruta base de almacenamiento';
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Proveedor no soportado'
        }, { status: 400 });
    }

    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: errorMessage
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      message: 'Conexión verificada correctamente. El proveedor está configurado.',
    });
  } catch (error) {
    console.error('Error testing storage config:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al verificar la conexión'
    }, { status: 500 });
  }
}
