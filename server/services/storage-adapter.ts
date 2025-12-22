/**
 * Storage Adapter - Unified storage abstraction layer
 * Provides consistent interface for Object Storage and Local Filesystem
 */

import { Client } from "@replit/object-storage";
import * as fs from "fs";
import * as path from "path";

export interface StorageAdapter {
  upload(key: string, buffer: Buffer): Promise<string>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  getUrl(key: string): string;
  getName(): string;
}

/**
 * Replit Object Storage Adapter
 */
export class ObjectStorageAdapter implements StorageAdapter {
  private client: Client;

  constructor() {
    this.client = new Client();
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    await this.client.uploadFromBytes(key, buffer);
    return this.getUrl(key);
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.delete(key);
    } catch (error) {
      console.warn(`[ObjectStorage] Failed to delete ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.downloadAsBytes(key);
      return result !== null;
    } catch {
      return false;
    }
  }

  getUrl(key: string): string {
    // Object storage files are served via API route
    if (key.startsWith("public/ai-generated/")) {
      const filename = key.replace("public/ai-generated/", "");
      return `/api/ai-images/${filename}`;
    }
    return `/object-storage/${key}`;
  }

  getName(): string {
    return "object-storage";
  }
}

/**
 * Sanitize path to prevent directory traversal attacks
 */
function sanitizePath(key: string): string {
  // Remove any path traversal attempts
  return key
    .replace(/\.\./g, "")
    .replace(/^\/+/, "")
    .replace(/[<>:"|?*]/g, "")
    .replace(/\\/g, "/");
}

/**
 * Local Filesystem Storage Adapter
 */
export class LocalStorageAdapter implements StorageAdapter {
  private baseDir: string;
  private urlPrefix: string;

  constructor(baseDir?: string, urlPrefix?: string) {
    this.baseDir = baseDir || path.join(process.cwd(), "uploads");
    this.urlPrefix = urlPrefix || "/uploads";

    // Ensure base directory exists
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const sanitizedKey = sanitizePath(key);
    const filePath = this.getFilePath(sanitizedKey);

    // Security: Verify path is within base directory
    const resolvedPath = path.resolve(filePath);
    const resolvedBase = path.resolve(this.baseDir);
    if (!resolvedPath.startsWith(resolvedBase)) {
      throw new Error("Invalid file path: path traversal detected");
    }

    const dir = path.dirname(filePath);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(filePath, buffer);
    return this.getUrl(sanitizedKey);
  }

  async delete(key: string): Promise<void> {
    const sanitizedKey = sanitizePath(key);
    const filePath = this.getFilePath(sanitizedKey);

    // Security: Verify path is within base directory
    const resolvedPath = path.resolve(filePath);
    const resolvedBase = path.resolve(this.baseDir);
    if (!resolvedPath.startsWith(resolvedBase)) {
      console.warn(`[LocalStorage] Path traversal attempt blocked: ${key}`);
      return;
    }

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.warn(`[LocalStorage] Failed to delete ${key}:`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    const sanitizedKey = sanitizePath(key);
    const filePath = this.getFilePath(sanitizedKey);

    // Security: Verify path is within base directory
    const resolvedPath = path.resolve(filePath);
    const resolvedBase = path.resolve(this.baseDir);
    if (!resolvedPath.startsWith(resolvedBase)) {
      return false;
    }

    return fs.existsSync(filePath);
  }

  getUrl(key: string): string {
    // Normalize key to URL path
    const normalizedKey = key.replace(/^public\//, "");
    return `${this.urlPrefix}/${normalizedKey}`;
  }

  getName(): string {
    return "local-filesystem";
  }

  private getFilePath(key: string): string {
    // Remove "public/" prefix if present for local storage
    const normalizedKey = key.replace(/^public\//, "");
    return path.join(this.baseDir, normalizedKey);
  }
}

/**
 * Storage Manager - Handles adapter selection and fallback logic
 */
export class StorageManager {
  private primaryAdapter: StorageAdapter | null = null;
  private fallbackAdapter: StorageAdapter;
  private initError: Error | null = null;

  constructor() {
    // Always have local storage as fallback
    this.fallbackAdapter = new LocalStorageAdapter();

    // Try to initialize Object Storage if configured
    if (process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID) {
      try {
        this.primaryAdapter = new ObjectStorageAdapter();
        console.log("[StorageManager] Object Storage initialized as primary");
      } catch (error) {
        this.initError = error as Error;
        console.warn("[StorageManager] Object Storage init failed, using local storage:", error);
      }
    } else {
      console.log("[StorageManager] No Object Storage configured, using local storage");
    }
  }

  /**
   * Upload with automatic fallback
   */
  async upload(key: string, buffer: Buffer): Promise<{ url: string; storage: string }> {
    // Try primary adapter first
    if (this.primaryAdapter) {
      try {
        const url = await this.primaryAdapter.upload(key, buffer);
        console.log(`[StorageManager] Uploaded to ${this.primaryAdapter.getName()}: ${key}`);
        return { url, storage: this.primaryAdapter.getName() };
      } catch (error) {
        console.warn(`[StorageManager] Primary storage failed, falling back:`, error);
      }
    }

    // Fallback to local storage
    const url = await this.fallbackAdapter.upload(key, buffer);
    console.log(`[StorageManager] Uploaded to ${this.fallbackAdapter.getName()}: ${key}`);
    return { url, storage: this.fallbackAdapter.getName() };
  }

  /**
   * Delete from storage (tries both adapters)
   */
  async delete(key: string): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.primaryAdapter) {
      promises.push(this.primaryAdapter.delete(key));
    }
    promises.push(this.fallbackAdapter.delete(key));

    await Promise.allSettled(promises);
  }

  /**
   * Check if file exists in any storage
   */
  async exists(key: string): Promise<boolean> {
    if (this.primaryAdapter) {
      const existsInPrimary = await this.primaryAdapter.exists(key);
      if (existsInPrimary) return true;
    }
    return this.fallbackAdapter.exists(key);
  }

  /**
   * Get the active storage name
   */
  getActiveStorage(): string {
    return this.primaryAdapter?.getName() || this.fallbackAdapter.getName();
  }

  /**
   * Get initialization status
   */
  getStatus(): { primary: string | null; fallback: string; error: string | null } {
    return {
      primary: this.primaryAdapter?.getName() || null,
      fallback: this.fallbackAdapter.getName(),
      error: this.initError?.message || null,
    };
  }
}

// Singleton instance
let storageManagerInstance: StorageManager | null = null;

export function getStorageManager(): StorageManager {
  if (!storageManagerInstance) {
    storageManagerInstance = new StorageManager();
  }
  return storageManagerInstance;
}

// Reset storage manager (useful for testing)
export function resetStorageManager(): void {
  storageManagerInstance = null;
}
