/**
 * Advanced Security Module
 *
 * - Rate limiting by IP and action type
 * - 2FA for admins
 * - Audit logging
 * - CAPTCHA verification
 */

import { db } from "./db";
import { users, auditLogs } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { cache } from "./cache";
import * as crypto from "crypto";

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Maximum requests in window
  blockDurationMs: number; // How long to block after limit exceeded
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // Authentication
  "auth:login": { windowMs: 900000, maxRequests: 5, blockDurationMs: 900000 }, // 5 attempts per 15 min
  "auth:register": { windowMs: 3600000, maxRequests: 3, blockDurationMs: 3600000 }, // 3 per hour
  "auth:password-reset": { windowMs: 3600000, maxRequests: 3, blockDurationMs: 3600000 },
  "auth:2fa-verify": { windowMs: 300000, maxRequests: 5, blockDurationMs: 600000 }, // 5 per 5 min

  // API
  "api:general": { windowMs: 60000, maxRequests: 100, blockDurationMs: 60000 }, // 100/min
  "api:search": { windowMs: 60000, maxRequests: 30, blockDurationMs: 60000 }, // 30/min
  "api:translate": { windowMs: 60000, maxRequests: 10, blockDurationMs: 300000 }, // 10/min, block 5 min
  "api:ai-generate": { windowMs: 60000, maxRequests: 5, blockDurationMs: 300000 }, // 5/min

  // Forms
  "form:contact": { windowMs: 3600000, maxRequests: 5, blockDurationMs: 3600000 },
  "form:newsletter": { windowMs: 3600000, maxRequests: 3, blockDurationMs: 3600000 },
  "form:lead": { windowMs: 3600000, maxRequests: 10, blockDurationMs: 3600000 },

  // Content
  "content:create": { windowMs: 3600000, maxRequests: 50, blockDurationMs: 3600000 },
  "content:update": { windowMs: 60000, maxRequests: 30, blockDurationMs: 300000 },
  "content:delete": { windowMs: 3600000, maxRequests: 20, blockDurationMs: 3600000 },

  // Media
  "media:upload": { windowMs: 3600000, maxRequests: 100, blockDurationMs: 3600000 },
};

// In-memory rate limit store (use Redis in production)
const rateLimitStore: Map<string, { count: number; resetAt: number; blocked?: boolean; blockedUntil?: number }> = new Map();

export const rateLimiter = {
  /**
   * Check if request should be rate limited
   */
  async check(
    ip: string,
    action: string,
    userId?: string
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetIn: number;
    blockedFor?: number;
  }> {
    const config = rateLimitConfigs[action] || rateLimitConfigs["api:general"];
    const key = userId ? `${action}:user:${userId}` : `${action}:ip:${ip}`;

    const now = Date.now();
    let entry = rateLimitStore.get(key);

    // Check if blocked
    if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.ceil((entry.blockedUntil - now) / 1000),
        blockedFor: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    // Reset if window expired
    if (!entry || entry.resetAt <= now) {
      entry = {
        count: 0,
        resetAt: now + config.windowMs,
      };
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + config.blockDurationMs;
      rateLimitStore.set(key, entry);

      // Log security event
      await this.logRateLimitExceeded(ip, action, userId);

      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.ceil(config.blockDurationMs / 1000),
        blockedFor: Math.ceil(config.blockDurationMs / 1000),
      };
    }

    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetIn: Math.ceil((entry.resetAt - now) / 1000),
    };
  },

  /**
   * Log rate limit exceeded event
   */
  async logRateLimitExceeded(ip: string, action: string, userId?: string): Promise<void> {
    await auditLogger.log({
      action: "security:rate_limit_exceeded",
      userId: userId || null,
      ipAddress: ip,
      details: { action, reason: "Rate limit exceeded" },
      severity: "warning",
    });
  },

  /**
   * Clear rate limit for key
   */
  async clear(ip: string, action: string, userId?: string): Promise<void> {
    const key = userId ? `${action}:user:${userId}` : `${action}:ip:${ip}`;
    rateLimitStore.delete(key);
  },

  /**
   * Get Express middleware
   */
  middleware(action: string) {
    return async (req: any, res: any, next: any) => {
      const ip = req.ip || req.connection.remoteAddress;
      const userId = req.user?.id;

      const result = await this.check(ip, action, userId);

      // Set rate limit headers
      res.set("X-RateLimit-Remaining", result.remaining.toString());
      res.set("X-RateLimit-Reset", result.resetIn.toString());

      if (!result.allowed) {
        res.set("Retry-After", result.blockedFor?.toString() || "60");
        return res.status(429).json({
          error: "Too many requests",
          retryAfter: result.blockedFor,
        });
      }

      next();
    };
  },
};

// ============================================================================
// TWO-FACTOR AUTHENTICATION
// ============================================================================

interface TwoFactorSecret {
  secret: string;
  backupCodes: string[];
  verified: boolean;
  createdAt: Date;
}

// In-memory 2FA store (use database in production)
const twoFactorStore: Map<string, TwoFactorSecret> = new Map();

export const twoFactorAuth = {
  /**
   * Generate TOTP secret for user
   */
  async generateSecret(userId: string): Promise<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  }> {
    // Generate random secret (would use speakeasy or otplib in production)
    const secret = crypto.randomBytes(20).toString("hex").substring(0, 16).toUpperCase();

    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString("hex").toUpperCase()
    );

    // Store secret (not verified yet)
    twoFactorStore.set(userId, {
      secret,
      backupCodes,
      verified: false,
      createdAt: new Date(),
    });

    // Generate QR code URL (for apps like Google Authenticator)
    const qrCodeUrl = `otpauth://totp/Travi:${userId}?secret=${secret}&issuer=Travi`;

    return { secret, qrCodeUrl, backupCodes };
  },

  /**
   * Verify TOTP code and enable 2FA
   */
  async verifyAndEnable(userId: string, code: string): Promise<boolean> {
    const stored = twoFactorStore.get(userId);
    if (!stored) return false;

    // Verify code (simplified - use speakeasy.totp.verify in production)
    const isValid = this.verifyCode(stored.secret, code);

    if (isValid) {
      stored.verified = true;
      twoFactorStore.set(userId, stored);

      // Log 2FA enabled
      await auditLogger.log({
        action: "security:2fa_enabled",
        userId,
        details: { method: "totp" },
        severity: "info",
      });
    }

    return isValid;
  },

  /**
   * Verify TOTP code
   */
  verifyCode(secret: string, code: string): boolean {
    // Simplified TOTP verification
    // In production, use: speakeasy.totp.verify({ secret, encoding: 'base32', token: code })
    const timeStep = Math.floor(Date.now() / 30000);
    const expectedCode = this.generateCode(secret, timeStep);
    const previousCode = this.generateCode(secret, timeStep - 1);

    return code === expectedCode || code === previousCode;
  },

  /**
   * Generate TOTP code (simplified)
   */
  generateCode(secret: string, counter: number): string {
    // Simplified - use proper HOTP/TOTP library in production
    const hash = crypto.createHmac("sha1", secret)
      .update(counter.toString())
      .digest("hex");
    return (parseInt(hash.substring(0, 8), 16) % 1000000).toString().padStart(6, "0");
  },

  /**
   * Check if user has 2FA enabled
   */
  async isEnabled(userId: string): Promise<boolean> {
    const stored = twoFactorStore.get(userId);
    return stored?.verified === true;
  },

  /**
   * Verify login with 2FA
   */
  async verifyLogin(userId: string, code: string): Promise<{
    success: boolean;
    usedBackupCode?: boolean;
  }> {
    const stored = twoFactorStore.get(userId);
    if (!stored || !stored.verified) {
      return { success: false };
    }

    // Try TOTP code
    if (this.verifyCode(stored.secret, code)) {
      return { success: true };
    }

    // Try backup code
    const backupIndex = stored.backupCodes.indexOf(code.toUpperCase());
    if (backupIndex !== -1) {
      // Remove used backup code
      stored.backupCodes.splice(backupIndex, 1);
      twoFactorStore.set(userId, stored);

      await auditLogger.log({
        action: "security:2fa_backup_code_used",
        userId,
        details: { remainingBackupCodes: stored.backupCodes.length },
        severity: "warning",
      });

      return { success: true, usedBackupCode: true };
    }

    return { success: false };
  },

  /**
   * Disable 2FA for user
   */
  async disable(userId: string, adminId?: string): Promise<boolean> {
    const existed = twoFactorStore.has(userId);
    twoFactorStore.delete(userId);

    if (existed) {
      await auditLogger.log({
        action: "security:2fa_disabled",
        userId,
        details: { disabledBy: adminId || userId },
        severity: adminId ? "warning" : "info",
      });
    }

    return existed;
  },

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string): Promise<string[] | null> {
    const stored = twoFactorStore.get(userId);
    if (!stored || !stored.verified) return null;

    const newCodes = Array.from({ length: 10 }, () =>
      crypto.randomBytes(4).toString("hex").toUpperCase()
    );

    stored.backupCodes = newCodes;
    twoFactorStore.set(userId, stored);

    await auditLogger.log({
      action: "security:2fa_backup_codes_regenerated",
      userId,
      severity: "info",
    });

    return newCodes;
  },
};

// ============================================================================
// AUDIT LOGGING
// ============================================================================

interface AuditLogEntry {
  action: string;
  userId: string | null;
  ipAddress?: string;
  userAgent?: string;
  targetId?: string;
  targetType?: string;
  details?: Record<string, any>;
  severity: "info" | "warning" | "error" | "critical";
}

// In-memory audit log (use database in production)
const auditLogStore: Array<AuditLogEntry & { id: string; timestamp: Date }> = [];

export const auditLogger = {
  /**
   * Log an audit event
   */
  async log(entry: AuditLogEntry): Promise<string> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullEntry = {
      ...entry,
      id,
      timestamp: new Date(),
    };

    auditLogStore.push(fullEntry);

    // Keep only last 50000 entries
    if (auditLogStore.length > 50000) {
      auditLogStore.splice(0, auditLogStore.length - 50000);
    }

    // In production, also write to database:
    // await db.insert(auditLogs).values(fullEntry);

    // For critical events, send alert
    if (entry.severity === "critical") {
      await this.alertCriticalEvent(fullEntry);
    }

    return id;
  },

  /**
   * Get audit logs with filters
   */
  async getLogs(filters: {
    userId?: string;
    action?: string;
    severity?: AuditLogEntry["severity"];
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: Array<AuditLogEntry & { id: string; timestamp: Date }>;
    total: number;
  }> {
    let filtered = [...auditLogStore];

    if (filters.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }
    if (filters.action) {
      filtered = filtered.filter(l => l.action.includes(filters.action!));
    }
    if (filters.severity) {
      filtered = filtered.filter(l => l.severity === filters.severity);
    }
    if (filters.startDate) {
      filtered = filtered.filter(l => l.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(l => l.timestamp <= filters.endDate!);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = filtered.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 50;

    return {
      logs: filtered.slice(offset, offset + limit),
      total,
    };
  },

  /**
   * Get user activity summary
   */
  async getUserActivity(userId: string, days: number = 30): Promise<{
    totalActions: number;
    byAction: Record<string, number>;
    bySeverity: Record<string, number>;
    recentActivity: Array<{ action: string; timestamp: Date }>;
  }> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const userLogs = auditLogStore.filter(
      l => l.userId === userId && l.timestamp >= cutoff
    );

    const byAction: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    for (const log of userLogs) {
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
    }

    return {
      totalActions: userLogs.length,
      byAction,
      bySeverity,
      recentActivity: userLogs.slice(0, 10).map(l => ({
        action: l.action,
        timestamp: l.timestamp,
      })),
    };
  },

  /**
   * Get security summary
   */
  async getSecuritySummary(hours: number = 24): Promise<{
    totalEvents: number;
    warnings: number;
    errors: number;
    critical: number;
    topActions: Array<{ action: string; count: number }>;
    suspiciousIps: Array<{ ip: string; events: number }>;
  }> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = auditLogStore.filter(l => l.timestamp >= cutoff);

    const actionCounts: Record<string, number> = {};
    const ipCounts: Record<string, number> = {};
    let warnings = 0, errors = 0, critical = 0;

    for (const log of recentLogs) {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;

      if (log.ipAddress) {
        ipCounts[log.ipAddress] = (ipCounts[log.ipAddress] || 0) + 1;
      }

      if (log.severity === "warning") warnings++;
      else if (log.severity === "error") errors++;
      else if (log.severity === "critical") critical++;
    }

    // Find suspicious IPs (many events or mostly warnings/errors)
    const suspiciousIps = Object.entries(ipCounts)
      .filter(([, count]) => count > 50)
      .map(([ip, events]) => ({ ip, events }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 10);

    return {
      totalEvents: recentLogs.length,
      warnings,
      errors,
      critical,
      topActions: Object.entries(actionCounts)
        .map(([action, count]) => ({ action, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      suspiciousIps,
    };
  },

  /**
   * Alert on critical events
   */
  async alertCriticalEvent(entry: AuditLogEntry & { id: string; timestamp: Date }): Promise<void> {
    // In production, send email/SMS/Slack alert
    console.error(`[CRITICAL SECURITY EVENT] ${entry.action}:`, entry);
  },
};

// ============================================================================
// CAPTCHA VERIFICATION
// ============================================================================

interface CaptchaConfig {
  provider: "recaptcha" | "hcaptcha" | "turnstile";
  siteKey: string;
  secretKey: string;
  minScore?: number; // For reCAPTCHA v3
}

export const captcha = {
  config: {
    provider: "recaptcha" as "recaptcha" | "hcaptcha" | "turnstile",
    siteKey: process.env.RECAPTCHA_SITE_KEY || "",
    secretKey: process.env.RECAPTCHA_SECRET_KEY || "",
    minScore: 0.5,
  },

  /**
   * Verify reCAPTCHA token
   */
  async verifyRecaptcha(token: string, ip?: string): Promise<{
    success: boolean;
    score?: number;
    action?: string;
    errorCodes?: string[];
  }> {
    if (!this.config.secretKey) {
      // CAPTCHA not configured - allow in development
      return { success: true };
    }

    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: this.config.secretKey,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      });

      const data = await response.json();

      // For reCAPTCHA v3, check score
      if (data.score !== undefined && data.score < this.config.minScore!) {
        return {
          success: false,
          score: data.score,
          errorCodes: ["score-too-low"],
        };
      }

      return {
        success: data.success,
        score: data.score,
        action: data.action,
        errorCodes: data["error-codes"],
      };
    } catch (error) {
      console.error("[CAPTCHA] Verification error:", error);
      return { success: false, errorCodes: ["verification-failed"] };
    }
  },

  /**
   * Verify hCaptcha token
   */
  async verifyHcaptcha(token: string, ip?: string): Promise<{
    success: boolean;
    errorCodes?: string[];
  }> {
    const secretKey = process.env.HCAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return { success: true };
    }

    try {
      const response = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      });

      const data = await response.json();
      return {
        success: data.success,
        errorCodes: data["error-codes"],
      };
    } catch (error) {
      console.error("[CAPTCHA] hCaptcha verification error:", error);
      return { success: false, errorCodes: ["verification-failed"] };
    }
  },

  /**
   * Verify Cloudflare Turnstile token
   */
  async verifyTurnstile(token: string, ip?: string): Promise<{
    success: boolean;
    errorCodes?: string[];
  }> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      return { success: true };
    }

    try {
      const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          ...(ip ? { remoteip: ip } : {}),
        }),
      });

      const data = await response.json();
      return {
        success: data.success,
        errorCodes: data["error-codes"],
      };
    } catch (error) {
      console.error("[CAPTCHA] Turnstile verification error:", error);
      return { success: false, errorCodes: ["verification-failed"] };
    }
  },

  /**
   * Verify token using configured provider
   */
  async verify(token: string, ip?: string): Promise<{
    success: boolean;
    score?: number;
    errorCodes?: string[];
  }> {
    switch (this.config.provider) {
      case "recaptcha":
        return this.verifyRecaptcha(token, ip);
      case "hcaptcha":
        return this.verifyHcaptcha(token, ip);
      case "turnstile":
        return this.verifyTurnstile(token, ip);
      default:
        return { success: true };
    }
  },

  /**
   * Express middleware for CAPTCHA verification
   */
  middleware(options?: { action?: string; scoreThreshold?: number }) {
    return async (req: any, res: any, next: any) => {
      const token = req.body.captchaToken || req.headers["x-captcha-token"];

      if (!token) {
        return res.status(400).json({ error: "CAPTCHA token required" });
      }

      const ip = req.ip || req.connection.remoteAddress;
      const result = await this.verify(token, ip);

      if (!result.success) {
        await auditLogger.log({
          action: "security:captcha_failed",
          userId: req.user?.id || null,
          ipAddress: ip,
          details: { errorCodes: result.errorCodes, action: options?.action },
          severity: "warning",
        });

        return res.status(403).json({
          error: "CAPTCHA verification failed",
          codes: result.errorCodes,
        });
      }

      next();
    };
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const advancedSecurity = {
  rateLimiter,
  twoFactorAuth,
  auditLogger,
  captcha,
};

export default advancedSecurity;
