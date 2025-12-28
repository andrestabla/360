import { DB, StorageProvider, TenantStorageConfig } from '../data';
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
  upload: (tenantId: string, file: File, path?: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  download: (tenantId: string, fileId: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  delete: (tenantId: string, fileId: string) => Promise<{ success: boolean; error?: string }>;
  list: (tenantId?: string, path?: string) => Promise<{ success: boolean; files?: StorageFile[]; error?: string }>;
  getStats: (tenantId?: string) => Promise<{ success: boolean; stats?: StorageStats; error?: string }>;
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

export function getStorageService(): StorageService {
  const config = DB.platformSettings.storage;

  return {
    upload: async (tenantId: string, file: File, path?: string) => {
      if (!config?.enabled || (config.provider !== 'S3' && config.provider !== 'R2')) {
        return { success: false, error: 'Almacenamiento no configurado o no soportado para carga real' };
      }

      try {
        const storageConfig = config.config as any;
        const client = createS3Client(storageConfig);
        const fileId = `file-${Date.now()}-${file.name}`;
        const key = path ? `${path}/${fileId}` : fileId;

        const buffer = Buffer.from(await file.arrayBuffer());

        await client.send(new PutObjectCommand({
          Bucket: storageConfig.bucket,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }));

        // For R2/S3, we might return a presigned URL or a public URL if configured
        const url = `${storageConfig.endpoint}/${storageConfig.bucket}/${key}`;

        return { success: true, url };
      } catch (error: any) {
        console.error('Error uploading to R2/S3:', error);
        return { success: false, error: error.message };
      }
    },

    download: async (tenantId: string, fileId: string) => {
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

    delete: async (tenantId: string, fileId: string) => {
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

    list: async (tenantId?: string, path?: string) => {
      if (!config?.enabled || (config.provider !== 'S3' && config.provider !== 'R2')) {
        // Fallback to legacy mock behavior if not S3/R2
        const files: StorageFile[] = DB.docs
          .map(d => ({
            id: d.id,
            name: d.title,
            size: parseFloat(d.size) * 1024 * 1024,
            type: d.type,
            path: d.folderId || '/',
            createdAt: d.date || new Date().toISOString(),
            modifiedAt: d.date || new Date().toISOString()
          }));
        return { success: true, files };
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

    getStats: async (tenantId?: string) => {
      // For now, keep mock stats logic or sum from list if needed
      const docs = DB.docs;
      let totalUsed = 0;
      const byType: Record<string, number> = {};

      docs.forEach(doc => {
        const sizeMatch = doc.size.match(/(\d+\.?\d*)/);
        const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
        const multiplier = doc.size.includes('GB') ? 1024 : doc.size.includes('KB') ? 1 / 1024 : 1;
        const sizeInMB = size * multiplier;
        totalUsed += sizeInMB;
        const type = doc.type.toLowerCase();
        byType[type] = (byType[type] || 0) + sizeInMB;
      });

      const stats: StorageStats = {
        totalSize: 10 * 1024,
        usedSize: totalUsed,
        availableSize: 10 * 1024 - totalUsed,
        fileCount: docs.length,
        byType
      };

      return { success: true, stats };
    }
  };
}

export async function testStorageConnection(config: TenantStorageConfig): Promise<{
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
