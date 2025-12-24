/**
 * Enterprise Security Layer
 * 
 * Centralized security module providing:
 * - Rate limiting
 * - Helmet security headers
 * - Attack detection (SQL injection, XSS)
 * - Request validation
 * - Comprehensive security middleware setup
 */

import helmet from 'helmet';
import type { Express, Request, Response, NextFunction } from 'express';
import {
  loginRateLimiter,
  apiRateLimiter,
  aiRateLimiter,
  writeRateLimiter,
} from './rate-limiter';
import {
  detectSqlInjection,
  detectXss,
  sanitizeText,
} from './validators';
import {
  logSecurityEvent,
  logSecurityEventFromRequest,
  SecurityEventType,
  SecuritySeverity,
} from './audit-logger';

/**
 * Attack detection middleware
 * Detects and blocks SQL injection and XSS attempts
 */
export function attackDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const checkData = (data: any, path: string = ''): boolean => {
    if (typeof data === 'string') {
      // Check for SQL injection
      if (detectSqlInjection(data)) {
        logSecurityEventFromRequest(req, SecurityEventType.SQL_INJECTION_ATTEMPT, {
          success: false,
          resource: req.path,
          action: req.method,
          details: { field: path },
          errorMessage: 'SQL injection pattern detected',
        });
        return false;
      }

      // Check for XSS
      if (detectXss(data)) {
        logSecurityEventFromRequest(req, SecurityEventType.XSS_ATTEMPT, {
          success: false,
          resource: req.path,
          action: req.method,
          details: { field: path },
          errorMessage: 'XSS pattern detected',
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
  console.log('[Security] ✓ Rate limiters configured:');
  console.log('[Security]   - Login: 5 requests per 15 minutes');
  console.log('[Security]   - API: 100 requests per minute');
  console.log('[Security]   - AI: 50 requests per hour');
  console.log('[Security]   - Write operations: 30 per minute');
  console.log('[Security] Enterprise security layer initialized successfully');
}

/**
 * Get rate limiter by type
 */
export function getRateLimiter(type: 'login' | 'api' | 'ai' | 'write') {
  switch (type) {
    case 'login':
      return loginRateLimiter;
    case 'api':
      return apiRateLimiter;
    case 'ai':
      return aiRateLimiter;
    case 'write':
      return writeRateLimiter;
    default:
      return apiRateLimiter;
  }
}

// Export all security modules
export * from './rate-limiter';
export * from './validators';
export * from './password-policy';
export * from './file-upload';
export * from './audit-logger';
