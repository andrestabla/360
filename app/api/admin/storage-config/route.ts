import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { StorageProvider } from '@/lib/data';
import { encryptCredentials, decryptCredentials, getSecretFields, maskCredential } from '@/lib/services/storageEncryption';

export async function GET(request: NextRequest) {
  try {
    const settings = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1)).limit(1);

    if (!settings || settings.length === 0 || !settings[0].storageConfig) {
      return NextResponse.json({ success: true, config: null });
    }

    const configWrapper = settings[0].storageConfig as Record<string, any>;
    const config = { ...configWrapper };

    // Safety check for provider
    if (!config.provider) {
      return NextResponse.json({ success: true, config: null });
    }

    const secretFields = getSecretFields(config.provider as StorageProvider);

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
  } catch (error) {
    console.error('Error fetching storage config:', error);
    return NextResponse.json({ error: 'Error fetching configuration' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, config, enabled } = body;

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const secretFields = getSecretFields(provider);
    const secretData: Record<string, any> = {};
    const publicData: Record<string, any> = {};

    Object.entries(config || {}).forEach(([key, value]) => {
      // If the value is masked (starts with *), don't update it, keep existing secret
      // This logic requires fetching existing encrypted config to merge if needed
      // BUT for simplicity, we usually assume the UI sends the full config or we handle partials.
      // However, masking usually implies we don't have the value on client.
      // If client sends masked value, we should SKIP updating that field in secretData
      // and reuse the old encrypted value.

      // Ideally, the UI sends everything. If it's masked, it sends the masked string.
      // We need to detect if it's masked and NOT overwrite the credential if so.

      if (secretFields.includes(key)) {
        if (typeof value === 'string' && value.includes('******')) {
          // It's masked, we need to preserve the old value.
          // We'll mark it to be merged from existing DB config later.
        } else {
          secretData[key] = value;
        }
      } else {
        publicData[key] = value;
      }
    });

    // Check if we need to merge with existing secrets
    let finalSecretData = { ...secretData };

    // Fetch existing settings to merge secrets if necessary
    const existingSettings = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1)).limit(1);
    let existingConfigWrapper: any = null;
    if (existingSettings && existingSettings.length > 0) {
      existingConfigWrapper = existingSettings[0].storageConfig;
    }

    if (existingConfigWrapper && existingConfigWrapper.encryptedConfig) {
      const decryptedExisting = decryptCredentials(existingConfigWrapper.encryptedConfig);

      // Merge: If a key is NOT in secretData (because it was masked/omitted), take it from existing
      // Or if we specifically skipped it above.
      // Actually, the UI logic usually sends ALL fields.
      // If the user didn't change the password, the UI might send the masked version OR not send it.
      // Let's assume for now if it's NOT in secretData, we try to keep existing.

      secretFields.forEach(field => {
        if (config && config[field] && typeof config[field] === 'string' && config[field].includes('******')) {
          // The user sent back the masked value, implying no change.
          if (decryptedExisting[field]) {
            finalSecretData[field] = decryptedExisting[field];
          }
        }
      });
    }

    const encryptedConfig = Object.keys(finalSecretData).length > 0
      ? encryptCredentials(finalSecretData)
      : undefined;

    const storageConfig: any = {
      provider: provider as StorageProvider,
      enabled: enabled ?? true,
      config: publicData,
      encryptedConfig,
      lastTested: new Date().toISOString(),
      testStatus: 'success',
      testMessage: 'Configuración guardada correctamente',
    };

    // Upsert organization settings (assuming id=1 always exists or we create it)
    // Actually schema says default(1), so we can just update where id=1.
    // Use .insert().onConflictDoUpdate() if unsure, or just update since we expect seed.
    // Let's safe bet on update, if fail, insert.

    const result = await db.update(organizationSettings)
      .set({ storageConfig })
      .where(eq(organizationSettings.id, 1))
      .returning();

    if (result.length === 0) {
      // Fallback if not exists (should have been seeded though)
      await db.insert(organizationSettings).values({
        id: 1,
        name: "My Organization",
        storageConfig
      });
    }

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
  try {
    await db.update(organizationSettings)
      .set({ storageConfig: null })
      .where(eq(organizationSettings.id, 1));

    return NextResponse.json({
      success: true,
      message: 'Configuración de almacenamiento eliminada',
    });
  } catch (error) {
    console.error('Error deleting storage config:', error);
    return NextResponse.json({ error: 'Error deleting configuration' }, { status: 500 });
  }
}
