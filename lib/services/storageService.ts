import { DB, TenantStorageConfig } from '../data';
import { db } from '@/server/db';
import { organizationSettings } from '@/shared/schema';
import { eq } from 'drizzle-orm';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface StorageStats {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  fileCount: number;
  byType: Record<string, number>;
  limit?: number;
  usedPercentage?: number;
}

export interface StorageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  createdAt: string;
  modifiedAt: string;
}

export interface StorageService {
  upload: (file: File, path?: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  download: (fileId: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  delete: (fileId: string) => Promise<{ success: boolean; error?: string }>;
  list: (path?: string) => Promise<{ success: boolean; files?: StorageFile[]; error?: string }>;
  getStats: () => Promise<{ success: boolean; stats?: StorageStats; error?: string }>;
}

function createS3Client(config: Record<string, any>) {
  return new S3Client({
    region: config.region || 'auto',
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // Required for R2
    forcePathStyle: true,
  });
}

import { decryptCredentials, getSecretFields } from './storageEncryption';

export async function getStorageConfig() {
  try {
    const settings = await db.select().from(organizationSettings).where(eq(organizationSettings.id, 1)).limit(1);
    if (!settings || settings.length === 0 || !settings[0].storageConfig) return null;

    const rawConfig = settings[0].storageConfig as any;

    // Decrypt credentials if present
    if (rawConfig.encryptedConfig) {
      try {
        const decrypted = decryptCredentials(rawConfig.encryptedConfig);
        // Merge decrypted secrets into the main config object
        rawConfig.config = {
          ...rawConfig.config,
          ...decrypted
        };
      } catch (e) {
        console.error("Failed to decrypt storage credentials:", e);
      }
    }

    // Log the endpoint being used (for debugging)
    if (rawConfig.config?.endpoint) {
      console.log('[StorageService] Using Endpoint:', rawConfig.config.endpoint);
    } else {
      console.log('[StorageService] No endpoint defined in config.');
    }

    return rawConfig;
  } catch (e) {
    console.error("Error fetching storage config", e);
    return null;
  }
}

export function getStorageService(): StorageService {

  return {
    upload: async (file: File, path?: string) => {
      const config = await getStorageConfig();

      if (!config?.enabled || (config.provider !== 'S3' && config.provider !== 'R2')) {
        return { success: false, error: 'Almacenamiento no configurado o no soportado para carga real' };
      }

      try {
        const storageConfig = config.config as any;
        const client = createS3Client(storageConfig);
        const fileId = `file-${Date.now()}-${file.name.replace(/\s+/g, '-')}`; // Sanitize filename
        const key = path ? `${path}/${fileId}` : fileId;

        const buffer = Buffer.from(await file.arrayBuffer());

        await client.send(new PutObjectCommand({
          Bucket: storageConfig.bucket,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }));

        // For R2/S3, return a public URL if configured
        let url = '';
        if (storageConfig.publicUrl) {
          // Remove trailing slash if present
          const baseUrl = storageConfig.publicUrl.replace(/\/$/, '');
          url = `${baseUrl}/${key}`;
        } else {
          // Fallback to internal proxy if no public URL is defined
          // This ensures files load even with private buckets
          url = `/api/storage/${key}`;
        }

        return { success: true, url };
      } catch (error: any) {
        console.error('Error uploading to R2/S3:', error);
        return { success: false, error: error.message };
      }
    },

    download: async (fileId: string) => {
      const config = await getStorageConfig();
      if (!config?.enabled || (config.provider !== 'S3' && config.provider !== 'R2')) {
        return { success: false, error: 'Almacenamiento no configurado' };
      }

      try {
        const storageConfig = config.config as any;
        const client = createS3Client(storageConfig);
        const command = new GetObjectCommand({
          Bucket: storageConfig.bucket,
          Key: fileId,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });
        return { success: true, url };
      } catch (error: any) {
        console.error('Error getting download URL from R2/S3:', error);
        return { success: false, error: error.message };
      }
    },

    delete: async (fileId: string) => {
      const config = await getStorageConfig();
      if (!config?.enabled || (config.provider !== 'S3' && config.provider !== 'R2')) {
        return { success: false, error: 'Almacenamiento no configurado' };
      }

      try {
        const storageConfig = config.config as any;
        const client = createS3Client(storageConfig);
        await client.send(new DeleteObjectCommand({
          Bucket: storageConfig.bucket,
          Key: fileId,
        }));
        return { success: true };
      } catch (error: any) {
        console.error('Error deleting from R2/S3:', error);
        return { success: false, error: error.message };
      }
    },

    list: async (path?: string) => {
      const config = await getStorageConfig();
      if (!config?.enabled || (config.provider !== 'S3' && config.provider !== 'R2')) {
        // Return empty or mock if needed, but for now empty
        return { success: true, files: [] };
      }

      try {
        const storageConfig = config.config as any;
        const client = createS3Client(storageConfig);
        const response = await client.send(new ListObjectsV2Command({
          Bucket: storageConfig.bucket,
          Prefix: path,
        }));

        const files: StorageFile[] = (response.Contents || []).map(item => ({
          id: item.Key!,
          name: item.Key!.split('/').pop()!,
          size: item.Size || 0,
          type: 'application/octet-stream', // Could be inferred from extension
          path: item.Key!.split('/').slice(0, -1).join('/') || '/',
          createdAt: item.LastModified?.toISOString() || new Date().toISOString(),
          modifiedAt: item.LastModified?.toISOString() || new Date().toISOString()
        }));

        return { success: true, files };
      } catch (error: any) {
        console.error('Error listing from R2/S3:', error);
        return { success: false, error: error.message };
      }
    },

    getStats: async () => {
      // Mock stats for now
      return {
        success: true, stats: {
          totalSize: 0,
          usedSize: 0,
          availableSize: 0,
          fileCount: 0,
          byType: {}
        }
      };
    }
  };
}

export async function testStorageConnection(config: any): Promise<{
  success: boolean;
  message: string;
}> {
  if (!config.enabled) {
    return { success: false, message: 'Proveedor no habilitado' };
  }

  if (config.provider === 'S3' || config.provider === 'R2') {
    try {
      const storageConfig = config.config as any;
      const client = createS3Client(storageConfig);
      await client.send(new ListObjectsV2Command({
        Bucket: storageConfig.bucket,
        MaxKeys: 1
      }));
      return { success: true, message: `Conexión con ${config.provider} exitosa` };
    } catch (error: any) {
      return { success: false, message: `Error de conexión con ${config.provider}: ${error.message}` };
    }
  }

  // Other providers (mock for now as before)
  switch (config.provider) {
    case 'GOOGLE_DRIVE':
      return { success: true, message: 'Conexion con Google Drive exitosa' };
    case 'DROPBOX':
      return { success: true, message: 'Conexion con Dropbox exitosa' };
    case 'ONEDRIVE':
      return { success: true, message: 'Conexion con OneDrive exitosa' };
    case 'SHAREPOINT':
      return { success: true, message: 'Conexion con SharePoint exitosa' };
    case 'LOCAL':
      return { success: true, message: 'Almacenamiento local configurado' };
    default:
      return { success: false, message: 'Proveedor no soportado' };
  }
}
