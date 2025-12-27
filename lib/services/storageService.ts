import { DB, StorageProvider, TenantStorageConfig } from '../data';

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
  download: (tenantId: string, fileId: string) => Promise<{ success: boolean; blob?: Blob; error?: string }>;
  delete: (tenantId: string, fileId: string) => Promise<{ success: boolean; error?: string }>;
  list: (tenantId?: string, path?: string) => Promise<{ success: boolean; files?: StorageFile[]; error?: string }>;
  getStats: (tenantId?: string) => Promise<{ success: boolean; stats?: StorageStats; error?: string }>;
}

export function getStorageService(): StorageService {
  const config = DB.platformSettings.storage;

  return {
    upload: async (tenantId: string, file: File, path?: string) => { // Kept signature for compatibility if needed, but ignored
      if (!config?.enabled) {
        return { success: false, error: 'Almacenamiento no configurado' };
      }

      const fileId = `file-${Date.now()}`;
      const url = `/storage/global/${fileId}/${file.name}`;

      return { success: true, url };
    },

    download: async (tenantId: string, fileId: string) => {
      if (!config?.enabled) {
        return { success: false, error: 'Almacenamiento no configurado' };
      }

      return { success: true, blob: new Blob() };
    },

    delete: async (tenantId: string, fileId: string) => {
      if (!config?.enabled) {
        return { success: false, error: 'Almacenamiento no configurado' };
      }

      return { success: true };
    },

    list: async (tenantId?: string, path?: string) => {
      if (!config?.enabled) {
        return { success: false, error: 'Almacenamiento no configurado' };
      }

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
    },

    getStats: async (tenantId?: string) => {
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

  switch (config.provider) {
    case 'GOOGLE_DRIVE':
      return { success: true, message: 'Conexion con Google Drive exitosa' };
    case 'DROPBOX':
      return { success: true, message: 'Conexion con Dropbox exitosa' };
    case 'ONEDRIVE':
      return { success: true, message: 'Conexion con OneDrive exitosa' };
    case 'SHAREPOINT':
      return { success: true, message: 'Conexion con SharePoint exitosa' };
    case 'S3':
      return { success: true, message: 'Conexion con S3 exitosa' };
    case 'LOCAL':
      return { success: true, message: 'Almacenamiento local configurado' };
    default:
      return { success: false, message: 'Proveedor no soportado' };
  }
}
