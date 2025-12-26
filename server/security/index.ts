/**
 * Enterprise Security Layer
 *
 * Centralized security module providing:
 * - Rate limiting (advanced-security.ts - better implementation)
 * - Helmet security headers
 * - Attack detection (SQL injection, XSS)
 * - Request validation
 * - 2FA / TOTP (advanced-security.ts)
 * - Audit logging (advanced-security.ts - better implementation)
 * - CAPTCHA (advanced-security.ts)
 * - Device fingerprinting (enterprise-security.ts)
 * - Contextual auth (enterprise-security.ts)
 * - ABAC policies (enterprise-security.ts)
 * - Password security (enterprise-security.ts)
 * - RBAC (security.ts)
 * - CORS, CSRF, SSRF protection (security.ts)
 *
 * This file re-exports the BEST implementation of each feature
 * from the three security modules.
 */

import helmet from 'helmet';
import type { Express, Request, Response, NextFunction } from 'express';

// Re-export the best implementation from each module
// From security.ts (core middleware)
export {
  requireAuth,
  requirePermission,
  requireOwnContentOrPermission,
  checkReadOnlyMode,
  safeMode,
  getUserId,
  // Keep for backward compatibility - will be deprecated
  rateLimiters,
  checkAiUsageLimit,
  // Core security
  securityHeaders,
  corsMiddleware,
  sanitizeInput,
  validateMediaUpload,
  validateUrlForSSRF,
  validateAnalyticsRequest,
  recordFailedAttempt,
  sessionConfig,
} from '../security';

// From advanced-security.ts (better rate limiting, 2FA, audit)
export {
  rateLimiter,      // Better rate limiting with action-specific configs
  twoFactorAuth,    // Full 2FA implementation
  auditLogger,      // Better audit logging with severity levels
  captcha,          // CAPTCHA verification
} from '../advanced-security';

// From enterprise-security.ts (enterprise features)
export {
  deviceFingerprint,    // Device tracking and trust
  contextualAuth,       // Risk-based authentication
  abac,                 // Attribute-based access control
  passwordSecurity,     // Password hashing and validation
  sessionSecurity,      // Session management
  exponentialBackoff,   // Backoff for failed attempts
  threatIntelligence,   // Threat detection
} from '../enterprise-security';

// ============================================================================
// INPUT VALIDATION - Inlined from validators.ts
// ============================================================================

/**
 * SQL Injection Pattern Detection
 * Returns true if suspicious SQL patterns are detected
 */
function detectSqlInjection(input: string): boolean {
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
function detectXss(input: string): boolean {
  if (!input) return false;

  const xssPatterns = [
    // Match script tags with any whitespace before closing >
    /<script\b[^<]*(?:(?!<\/script[\s>])<[^<]*)*<\/script[\s>]/gi,
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
 * Log security event (simplified - just console log)
 */
function logSecurityEvent(type: string, details: any) {
  console.log(`[SECURITY] ${type}:`, details);
}

/**
 * Attack detection middleware
 * Detects and blocks SQL injection and XSS attempts
 */
export function attackDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const checkData = (data: any, path: string = ''): boolean => {
    if (typeof data === 'string') {
      // Check for SQL injection
      if (detectSqlInjection(data)) {
        logSecurityEvent('SQL_INJECTION_ATTEMPT', {
          path: req.path,
          method: req.method,
          field: path,
          ip: req.ip,
        });
        return false;
      }

      // Check for XSS
      if (detectXss(data)) {
        logSecurityEvent('XSS_ATTEMPT', {
          path: req.path,
          method: req.method,
          field: path,
          ip: req.ip,
        });
        return false;
      }
    } else if (typeof data === 'object' && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (!checkData(value, path ? `${path}.${key}` : key)) {
          return false;
        }
      }
    }
    return true;
  };

  // Check body
  if (req.body && !checkData(req.body, 'body')) {
    return res.status(400).json({
      error: 'Request contains potentially malicious content',
      code: 'ATTACK_DETECTED',
    });
  }

  // Check query parameters
  if (req.query && !checkData(req.query, 'query')) {
    return res.status(400).json({
      error: 'Request contains potentially malicious content',
      code: 'ATTACK_DETECTED',
    });
  }

  // Check URL parameters
  if (req.params && !checkData(req.params, 'params')) {
    return res.status(400).json({
      error: 'Request contains potentially malicious content',
      code: 'ATTACK_DETECTED',
    });
  }

  next();
}

/**
 * Setup security middleware on Express app
 */
export function setupSecurityMiddleware(app: Express): void {
  console.log('[Security] Initializing enterprise security layer...');

  // Helmet - Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://replit.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://fonts.cdnfonts.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://fonts.cdnfonts.com",
          "data:",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "http:",
        ],
        connectSrc: [
          "'self'",
          "https://*.replit.dev",
          "https://*.replit.app",
          "https://api.deepl.com",
          "https://api.openai.com",
          "https://generativelanguage.googleapis.com",
          "https://openrouter.ai",
          "https://images.unsplash.com",
          "https://www.google-analytics.com",
          "wss:",
        ],
        frameAncestors: ["'self'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for some third-party services
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  }));

  // Additional security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Attack detection - Apply to all routes
  app.use(attackDetectionMiddleware);

  console.log('[Security] ✓ Helmet security headers configured');
  console.log('[Security] ✓ Attack detection middleware enabled');
  console.log('[Security] Enterprise security layer initialized successfully');
}
