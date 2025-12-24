/**
 * Password Security Policy
 * 
 * Implements comprehensive password security including:
 * - Strength requirements
 * - zxcvbn-based strength scoring
 * - Password history tracking
 * - Account lockout mechanism
 */

import zxcvbn from 'zxcvbn';
import bcrypt from 'bcrypt';
import { storage } from '../storage';

/**
 * Password Policy Configuration
 */
export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minStrengthScore: 3, // zxcvbn score (0-4)
  historyCount: 12, // Number of previous passwords to check
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
};

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength?: {
    score: number;
    feedback: string[];
    warning?: string;
  };
}

/**
 * Validate password against security policy
 */
export function validatePasswordStrength(password: string, userInputs?: string[]): PasswordValidationResult {
  const errors: string[] = [];

  // Length check
  if (!password || password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }

  // Uppercase check
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (PASSWORD_POLICY.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Special character check
  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common patterns
  if (/^(.)\1+$/.test(password)) {
    errors.push('Password cannot be all the same character');
  }

  if (/^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i.test(password)) {
    errors.push('Password cannot be a simple sequence');
  }

  // Use zxcvbn for comprehensive strength analysis
  const strengthResult = zxcvbn(password, userInputs || []);
  
  const strength = {
    score: strengthResult.score,
    feedback: [] as string[],
    warning: strengthResult.feedback.warning,
  };

  // Add zxcvbn suggestions
  if (strengthResult.feedback.suggestions.length > 0) {
    strength.feedback = strengthResult.feedback.suggestions;
  }

  // Check minimum strength score
  if (strengthResult.score < PASSWORD_POLICY.minStrengthScore) {
    errors.push(`Password is too weak (strength score: ${strengthResult.score}/4, minimum required: ${PASSWORD_POLICY.minStrengthScore})`);
    if (strengthResult.feedback.warning) {
      errors.push(strengthResult.feedback.warning);
    }
    if (strengthResult.feedback.suggestions.length > 0) {
      errors.push(...strengthResult.feedback.suggestions);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: strength.score >= PASSWORD_POLICY.minStrengthScore ? strength : undefined,
  };
}

/**
 * Check if password was used recently (password history)
 * Note: This requires password_history table in the database.
 * For now, returns allowed=true to maintain backward compatibility.
 */
export async function checkPasswordHistory(
  userId: string,
  newPassword: string
): Promise<{ allowed: boolean; message?: string }> {
  try {
    // Check if storage has password history methods
    const storageAny = storage as any;
    if (typeof storageAny.getPasswordHistory !== 'function') {
      // Password history not yet implemented in storage, allow the change
      return { allowed: true };
    }

    // Get user's password history from storage
    const history = await storageAny.getPasswordHistory(userId, PASSWORD_POLICY.historyCount);

    // Check if new password matches any recent password
    for (const historyEntry of history) {
      const matches = await bcrypt.compare(newPassword, historyEntry.passwordHash);
      if (matches) {
        return {
          allowed: false,
          message: `You cannot reuse any of your last ${PASSWORD_POLICY.historyCount} passwords`,
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking password history:', error);
    // On error, allow the password change (fail open for better UX)
    return { allowed: true };
  }
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // High security
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Account lockout tracking
 */
interface LockoutEntry {
  failedAttempts: number;
  lockedUntil?: number;
  lastFailedAttempt?: number;
}

// In-memory store for lockout tracking (use Redis for production)
const lockoutStore = new Map<string, LockoutEntry>();

// Store timer reference for cleanup
let cleanupTimerId: NodeJS.Timeout | null = null;

// Clean up expired entries every 5 minutes
function startCleanupTimer() {
  if (cleanupTimerId) return; // Already started
  
  cleanupTimerId = setInterval(() => {
    const now = Date.now();
    lockoutStore.forEach((entry, key) => {
      if (entry.lockedUntil && entry.lockedUntil < now) {
        lockoutStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);

  // Allow Node.js to exit even if timer is running
  cleanupTimerId.unref();
}

// Start the cleanup timer
startCleanupTimer();

/**
 * Cleanup function for graceful shutdown
 */
export function cleanupLockoutTimer(): void {
  if (cleanupTimerId) {
    clearInterval(cleanupTimerId);
    cleanupTimerId = null;
  }
}

/**
 * Record a failed login attempt
 */
export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const entry = lockoutStore.get(identifier) || {
    failedAttempts: 0,
  };

  entry.failedAttempts++;
  entry.lastFailedAttempt = now;

  // Lock account if threshold exceeded
  if (entry.failedAttempts >= PASSWORD_POLICY.maxFailedAttempts) {
    entry.lockedUntil = now + PASSWORD_POLICY.lockoutDuration;
  }

  lockoutStore.set(identifier, entry);
}

/**
 * Check if account is locked
 */
export function isAccountLocked(identifier: string): {
  locked: boolean;
  remainingTime?: number;
  attempts?: number;
} {
  const entry = lockoutStore.get(identifier);
  
  if (!entry) {
    return { locked: false };
  }

  const now = Date.now();

  // Check if lockout period has expired
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      locked: true,
      remainingTime: Math.ceil((entry.lockedUntil - now) / 1000 / 60), // minutes
      attempts: entry.failedAttempts,
    };
  }

  // Lockout expired, clean up
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    lockoutStore.delete(identifier);
    return { locked: false };
  }

  return {
    locked: false,
    attempts: entry.failedAttempts,
  };
}

/**
 * Clear failed login attempts (on successful login)
 */
export function clearFailedLogins(identifier: string): void {
  lockoutStore.delete(identifier);
}

/**
 * Get lockout status for admin/debugging
 */
export function getLockoutStats(): Array<{
  identifier: string;
  failedAttempts: number;
  lockedUntil?: Date;
}> {
  const stats: Array<{
    identifier: string;
    failedAttempts: number;
    lockedUntil?: Date;
  }> = [];

  lockoutStore.forEach((entry, identifier) => {
    stats.push({
      identifier,
      failedAttempts: entry.failedAttempts,
      lockedUntil: entry.lockedUntil ? new Date(entry.lockedUntil) : undefined,
    });
  });

  return stats;
}

/**
 * Store password in history after successful change
 * Note: This requires password_history table in the database.
 * For now, this is a no-op to maintain backward compatibility.
 */
export async function addToPasswordHistory(
  userId: string,
  passwordHash: string
): Promise<void> {
  try {
    // Check if storage has password history methods
    const storageAny = storage as any;
    if (typeof storageAny.addPasswordHistory === 'function') {
      await storageAny.addPasswordHistory(userId, passwordHash);
    }
    // If method doesn't exist, silently skip (backward compatibility)
  } catch (error) {
    console.error('Error adding password to history:', error);
    // Don't fail the password change if history tracking fails
  }
}

/**
 * Comprehensive password change validation
 */
export async function validatePasswordChange(
  userId: string,
  newPassword: string,
  userInputs?: string[]
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Validate password strength
  const strengthResult = validatePasswordStrength(newPassword, userInputs);
  if (!strengthResult.valid) {
    errors.push(...strengthResult.errors);
  }

  // Check password history
  const historyResult = await checkPasswordHistory(userId, newPassword);
  if (!historyResult.allowed && historyResult.message) {
    errors.push(historyResult.message);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
