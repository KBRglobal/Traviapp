/**
 * Input Validation and Sanitization
 * 
 * Provides comprehensive input validation and sanitization to prevent
 * XSS, SQL injection, and other injection attacks.
 */

import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';
import { z } from 'zod';

/**
 * HTML Sanitization Configuration
 * Whitelist approach - only allow safe tags and attributes
 */
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'
];

/**
 * Sanitize HTML content using DOMPurify with whitelist approach
 * Removes dangerous tags, attributes, and scripts
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitize plain text by escaping HTML entities
 * Use for user input that should be displayed as-is
 */
export function sanitizeText(text: string): string {
  if (!text) return '';

  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
}

/**
 * Validate and sanitize URL
 * Returns null if URL is invalid or potentially dangerous
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  // Trim and validate
  const trimmed = url.trim();

  // Check if it's a valid URL
  if (!validator.isURL(trimmed, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: false,
  })) {
    return null;
  }

  try {
    // Parse the URL to check protocol directly
    const parsedUrl = new URL(trimmed);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // Check for dangerous patterns in the URL string
    const urlLower = trimmed.toLowerCase();
    if (
      urlLower.includes('javascript:') ||
      urlLower.includes('data:') ||
      urlLower.includes('vbscript:') ||
      urlLower.includes('file:')
    ) {
      return null;
    }

    return trimmed;
  } catch (error) {
    // URL parsing failed
    return null;
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  return validator.isEmail(email, {
    allow_utf8_local_part: false,
    require_tld: true,
  });
}

/**
 * SQL Injection Pattern Detection
 * Returns true if suspicious SQL patterns are detected
 */
export function detectSqlInjection(input: string): boolean {
  if (!input) return false;

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(\bOR\b\s+\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s+\d+\s*=\s*\d+)/gi,
    /(--|\#|\/\*|\*\/)/g,
    /(\bxp_\w+\b)/gi,
    /(\bsp_\w+\b)/gi,
    /('\s*OR\s*'?\d+'?\s*=\s*'?\d+'?)/gi,
    /('\s*;)/gi,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * XSS Pattern Detection
 * Returns true if suspicious XSS patterns are detected
 */
export function detectXss(input: string): boolean {
  if (!input) return false;

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick, onerror
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<img[^>]*on\w+/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Zod Schema for Content Validation
 * Validates content structure and applies sanitization
 */
export const contentValidationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeText),
  
  body: z.string()
    .min(1, 'Body is required')
    .max(50000, 'Content is too long')
    .transform(sanitizeHtml)
    .refine(
      (val) => !detectXss(val),
      { message: 'Content contains potentially dangerous scripts' }
    ),
  
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional()
    .transform((val) => val ? sanitizeText(val) : undefined),
  
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional()
    .transform((val) => val ? sanitizeText(val) : undefined),
});

/**
 * Zod Schema for URL Validation
 */
export const urlValidationSchema = z.string()
  .url('Invalid URL format')
  .refine(
    (url) => {
      const sanitized = sanitizeUrl(url);
      return sanitized !== null;
    },
    { message: 'URL contains potentially dangerous content' }
  );

/**
 * Zod Schema for User Input Validation
 */
export const userInputSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeText),
  
  email: z.string()
    .email('Invalid email address')
    .refine(validateEmail, { message: 'Invalid email format' }),
  
  bio: z.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .transform((val) => val ? sanitizeHtml(val) : undefined),
});

/**
 * Validate and sanitize file path
 * Prevents path traversal attacks
 */
export function sanitizeFilePath(filePath: string): string | null {
  if (!filePath) return null;

  // Remove any path traversal patterns
  const sanitized = filePath.replace(/\.\./g, '').replace(/\\/g, '/');

  // Check for null bytes
  if (sanitized.includes('\0')) {
    return null;
  }

  // Check for absolute paths (should be relative)
  if (sanitized.startsWith('/') || /^[a-zA-Z]:/.test(sanitized)) {
    return null;
  }

  return sanitized;
}

/**
 * Sanitize filename for safe storage
 * Removes special characters and limits length
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return 'unnamed';

  // Get extension
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot > 0 ? filename.substring(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.substring(lastDot) : '';

  // Sanitize name - only allow alphanumeric, dash, underscore
  const sanitizedName = name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);

  // Sanitize extension
  const sanitizedExt = ext
    .replace(/[^a-zA-Z0-9.]/g, '')
    .substring(0, 10);

  return sanitizedName + sanitizedExt || 'unnamed';
}

/**
 * Check if input contains only safe characters for database queries
 */
export function isSafeForQuery(input: string): boolean {
  if (!input) return false;

  // Only allow alphanumeric, spaces, and basic punctuation
  const safePattern = /^[a-zA-Z0-9\s\-_.,!?'"@]+$/;
  return safePattern.test(input) && !detectSqlInjection(input);
}

/**
 * Remove null bytes and control characters from string
 */
export function removeControlCharacters(str: string): string {
  if (!str) return '';

  return str
    .replace(/\0/g, '') // Null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Control chars (except newline and tab)
}
