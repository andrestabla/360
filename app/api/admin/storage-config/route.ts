import { NextRequest, NextResponse } from 'next/server';
import { DB, TenantStorageConfig, StorageProvider } from '@/lib/data';
import { encryptCredentials, decryptCredentials, getSecretFields, maskCredential } from '@/lib/services/storageEncryption';

export async function GET(request: NextRequest) {
  // Global storage config
  const configWrapper = DB.platformSettings.storage;

  if (!configWrapper) {
    return NextResponse.json({ success: true, config: null });
  }

  const config = { ...configWrapper };
  const secretFields = getSecretFields(config.provider);

  if (config.encryptedConfig) {
    const decrypted = decryptCredentials(config.encryptedConfig);
    const configData = { ...config.config } as Record<string, any>;
    secretFields.forEach(field => {
      if (decrypted[field]) {
        configData[field] = maskCredential(decrypted[field]);
      }
    });
    config.config = configData;
  }

  return NextResponse.json({
    success: true,
    config: {
      provider: config.provider,
      enabled: config.enabled,
      config: config.config,
      lastTested: config.lastTested,
      testStatus: config.testStatus,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, config, enabled } = body;

    // Remove tenantId requirement
    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const secretFields = getSecretFields(provider);
    const secretData: Record<string, any> = {};
    const publicData: Record<string, any> = {};

    Object.entries(config || {}).forEach(([key, value]) => {
      if (secretFields.includes(key)) {
        secretData[key] = value;
      } else {
        publicData[key] = value;
      }
    });

    const encryptedConfig = Object.keys(secretData).length > 0
      ? encryptCredentials(secretData)
      : undefined;

    // Use any or cast if TenantStorageConfig is not perfectly exported/matching
    const storageConfig: any = {
      provider: provider as StorageProvider,
      enabled: enabled ?? true,
      config: publicData,
      encryptedConfig,
      lastTested: new Date().toISOString(),
      testStatus: 'success',
      testMessage: 'Configuración guardada correctamente',
    };

    DB.platformSettings.storage = storageConfig;
    DB.save();

    return NextResponse.json({
      success: true,
      message: 'Configuración de almacenamiento guardada correctamente',
    });
  } catch (error) {
    console.error('Error saving storage config:', error);
    return NextResponse.json({ error: 'Error saving configuration' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  // Remove tenantId logic
  if (DB.platformSettings.storage) {
    DB.platformSettings.storage = undefined;
    DB.save();
  }

  return NextResponse.json({
    success: true,
    message: 'Configuración de almacenamiento eliminada',
  });
}
