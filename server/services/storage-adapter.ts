/**
 * Storage Adapter Service
 * Abstraction layer for file storage (local, object storage, CDN)
 */

import fs from 'fs/promises';
import path from 'path';

export interface StorageConfig {
  type: 'local' | 'object-storage' | 's3';
  basePath?: string;
  baseUrl?: string;
  objectStorageUrl?: string;
}

export interface StoredFile {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export class StorageAdapter {
  private config: StorageConfig;

  constructor(config?: Partial<StorageConfig>) {
    this.config = {
      type: process.env.OBJECT_STORAGE_URL ? 'object-storage' : 'local',
      basePath: process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads'),
      baseUrl: process.env.BASE_URL || '',
      objectStorageUrl: process.env.OBJECT_STORAGE_URL,
      ...config,
    };
  }

  async save(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile> {
    if (this.config.type === 'object-storage' && this.config.objectStorageUrl) {
      return this.saveToObjectStorage(buffer, filename, mimeType);
    }
    return this.saveLocally(buffer, filename, mimeType);
  }

  private async saveLocally(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile> {
    const uploadsDir = this.config.basePath!;
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    return {
      filename,
      url: `/api/media/public/${filename}`,
      size: buffer.length,
      mimeType,
    };
  }

  private async saveToObjectStorage(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile> {
    const response = await fetch(`${this.config.objectStorageUrl}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': mimeType },
      body: buffer,
    });

    if (!response.ok) {
      // Fallback to local storage
      console.warn('[Storage] Object storage upload failed, falling back to local');
      return this.saveLocally(buffer, filename, mimeType);
    }

    const result = await response.json();
    return {
      filename,
      url: result.url || `${this.config.objectStorageUrl}/${filename}`,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(filename: string): Promise<boolean> {
    if (this.config.type === 'local') {
      try {
        const filePath = path.join(this.config.basePath!, filename);
        await fs.unlink(filePath);
        return true;
      } catch {
        return false;
      }
    }
    // Object storage deletion would go here
    return false;
  }

  async exists(filename: string): Promise<boolean> {
    if (this.config.type === 'local') {
      try {
        const filePath = path.join(this.config.basePath!, filename);
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  getPublicUrl(filename: string): string {
    if (this.config.type === 'object-storage' && this.config.objectStorageUrl) {
      return `${this.config.objectStorageUrl}/${filename}`;
    }
    return `/api/media/public/${filename}`;
  }
}

// Singleton instance
export const storageAdapter = new StorageAdapter();

export default storageAdapter;
