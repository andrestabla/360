import { NextRequest, NextResponse } from 'next/server';
import { DB, TenantStorageConfig, StorageProvider } from '@/lib/data';
import { encryptCredentials, decryptCredentials, getSecretFields, maskCredential } from '@/lib/services/storageEncryption';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
  }

  const tenant = DB.tenants.find(t => t.id === tenantId);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  if (!tenant.storageConfig) {
    return NextResponse.json({ success: true, config: null });
  }

  const config = { ...tenant.storageConfig };
  const secretFields = getSecretFields(config.provider);
  
  if (config.encryptedConfig) {
    const decrypted = decryptCredentials(config.encryptedConfig);
    config.config = { ...config.config };
    secretFields.forEach(field => {
      if (decrypted[field]) {
        config.config[field] = maskCredential(decrypted[field]);
      }
    });
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
    const { tenantId, provider, config, enabled } = body;

    if (!tenantId || !provider) {
      return NextResponse.json({ error: 'Tenant ID and provider are required' }, { status: 400 });
    }

    const tenant = DB.tenants.find(t => t.id === tenantId);
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
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

    const storageConfig: TenantStorageConfig = {
      provider: provider as StorageProvider,
      enabled: enabled ?? true,
      config: publicData,
      encryptedConfig,
      lastTested: new Date().toISOString(),
      testStatus: 'success',
      testMessage: 'Configuración guardada correctamente',
    };

    tenant.storageConfig = storageConfig;
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
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');

  if (!tenantId) {
    return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
  }

  const tenant = DB.tenants.find(t => t.id === tenantId);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }

  tenant.storageConfig = undefined;
  DB.save();

  return NextResponse.json({
    success: true,
    message: 'Configuración de almacenamiento eliminada',
  });
}
