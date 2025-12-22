/**
 * Image Processing Service
 * Handles image downloading, conversion (WebP), optimization, and metadata extraction
 */

import { storageAdapter, StoredFile } from './storage-adapter';

export interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  format: string;
}

export interface ImageDownloadResult {
  success: boolean;
  file?: StoredFile & { width?: number; height?: number };
  error?: string;
}

/**
 * Download an image from URL and optionally convert to WebP
 */
export async function downloadImage(url: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[ImageProcessing] Failed to download: ${response.status}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    return { buffer, mimeType };
  } catch (error) {
    console.error('[ImageProcessing] Download error:', error);
    return null;
  }
}

/**
 * Process image: convert to WebP, get metadata
 */
export async function processImage(buffer: Buffer): Promise<ProcessedImage | null> {
  try {
    const sharp = (await import('sharp')).default;
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const webpBuffer = await image.webp({ quality: 85 }).toBuffer();

    return {
      buffer: webpBuffer,
      mimeType: 'image/webp',
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: 'webp',
    };
  } catch (error) {
    console.error('[ImageProcessing] Sharp processing failed:', error);
    return null;
  }
}

/**
 * Generate filename from options
 */
export function generateFilename(options: {
  prefix?: string;
  slug?: string;
  source?: string;
}): string {
  const timestamp = Date.now();
  const parts: string[] = [];

  if (options.source) {
    parts.push(options.source);
  }

  if (options.slug) {
    parts.push(options.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50));
  }

  parts.push(timestamp.toString(36));

  return `${parts.join('-')}.webp`;
}

/**
 * Download image from URL, process it, and save to storage
 */
export async function downloadAndSaveImage(
  imageUrl: string,
  options: {
    filename?: string;
    source?: 'freepik' | 'ai' | 'external' | 'upload';
    slug?: string;
  } = {}
): Promise<ImageDownloadResult> {
  try {
    // 1. Download the image
    const downloaded = await downloadImage(imageUrl);
    if (!downloaded) {
      return { success: false, error: 'Failed to download image' };
    }

    // 2. Process the image (convert to WebP)
    const processed = await processImage(downloaded.buffer);
    const finalBuffer = processed?.buffer || downloaded.buffer;
    const finalMimeType = processed?.mimeType || downloaded.mimeType;

    // 3. Generate filename
    const filename = options.filename || generateFilename({
      source: options.source || 'external',
      slug: options.slug,
    });

    // 4. Save to storage
    const stored = await storageAdapter.save(finalBuffer, filename, finalMimeType);

    return {
      success: true,
      file: {
        ...stored,
        width: processed?.width,
        height: processed?.height,
      },
    };
  } catch (error) {
    console.error('[ImageProcessing] Download and save error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Resize image to multiple sizes for srcset
 */
export async function generateResponsiveSizes(
  buffer: Buffer,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): Promise<Map<number, Buffer>> {
  const results = new Map<number, Buffer>();

  try {
    const sharp = (await import('sharp')).default;
    const metadata = await sharp(buffer).metadata();
    const originalWidth = metadata.width || 1920;

    for (const width of sizes) {
      if (width <= originalWidth) {
        const resized = await sharp(buffer)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();
        results.set(width, resized);
      }
    }
  } catch (error) {
    console.error('[ImageProcessing] Responsive sizes generation failed:', error);
  }

  return results;
}

/**
 * Get image dimensions without full processing
 */
export async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number } | null> {
  try {
    const sharp = (await import('sharp')).default;
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch {
    return null;
  }
}

export default {
  downloadImage,
  processImage,
  downloadAndSaveImage,
  generateResponsiveSizes,
  getImageDimensions,
  generateFilename,
};
