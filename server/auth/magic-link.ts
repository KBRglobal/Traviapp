/**
 * Magic Link Authentication
 * 
 * Provides passwordless email-based authentication using secure tokens
 * Tokens expire after 15 minutes and can only be used once
 */

import crypto from 'crypto';
import { db } from '../db';
import { magicLinkTokens, users } from '@shared/schema';
import { eq, and, gt } from 'drizzle-orm';
import { Resend } from 'resend';

// ============================================================================
// TYPES
// ============================================================================

export interface MagicLinkResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface VerifyMagicLinkResult {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
}

// ============================================================================
// TOKEN GENERATION
// ============================================================================

/**
 * Generate a secure random token for magic link
 */
export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a magic link token for email authentication
 */
export async function createMagicLinkToken(email: string): Promise<MagicLinkResult> {
  try {
    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        success: true,
        message: 'If an account exists with this email, you will receive a magic link shortly.',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'This account has been deactivated.',
      };
    }

    // Generate token
    const token = generateMagicLinkToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token in database
    await db.insert(magicLinkTokens).values({
      email,
      token,
      expiresAt,
      used: false,
    });

    return {
      success: true,
      message: 'Magic link sent successfully.',
      token,
    };
  } catch (error) {
    console.error('[Magic Link] Error creating token:', error);
    return {
      success: false,
      message: 'Failed to create magic link. Please try again.',
    };
  }
}

/**
 * Verify a magic link token and mark it as used
 */
export async function verifyMagicLinkToken(token: string): Promise<VerifyMagicLinkResult> {
  try {
    // Find token in database
    const [tokenRecord] = await db
      .select()
      .from(magicLinkTokens)
      .where(
        and(
          eq(magicLinkTokens.token, token),
          eq(magicLinkTokens.used, false),
          gt(magicLinkTokens.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!tokenRecord) {
      return {
        success: false,
        message: 'Invalid or expired magic link.',
      };
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, tokenRecord.email))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        message: 'This account has been deactivated.',
      };
    }

    // Mark token as used
    await db
      .update(magicLinkTokens)
      .set({
        used: true,
        usedAt: new Date(),
      })
      .where(eq(magicLinkTokens.id, tokenRecord.id));

    return {
      success: true,
      message: 'Authentication successful.',
      userId: user.id,
      email: user.email || undefined,
    };
  } catch (error) {
    console.error('[Magic Link] Error verifying token:', error);
    return {
      success: false,
      message: 'Failed to verify magic link. Please try again.',
    };
  }
}

// ============================================================================
// EMAIL SENDING
// ============================================================================

/**
 * Get Resend client for sending emails
 */
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Magic Link] RESEND_API_KEY not configured');
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Send magic link email to user
 */
export async function sendMagicLinkEmail(
  email: string,
  token: string,
  userName?: string
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.log('[Magic Link] Resend not configured, skipping email for:', email);
    return false;
  }

  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : process.env.APP_URL || 'http://localhost:5000';

  const magicLink = `${baseUrl}/api/auth/magic-link/verify/${token}`;
  const greeting = userName ? `Hi ${userName},` : 'Hi there,';

  try {
    await resend.emails.send({
      from: 'Travi CMS <noreply@travi.world>',
      to: email,
      subject: 'Your Magic Link to Sign In',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin-bottom: 10px;">Travi CMS</h1>
          </div>
          
          <p style="font-size: 16px;">${greeting}</p>
          
          <p style="font-size: 16px;">Click the button below to sign in to your Travi CMS account:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${magicLink}" style="background-color: #0066cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Sign In to Travi CMS
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">${magicLink}</p>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            This link will expire in <strong>15 minutes</strong> and can only be used once.
          </p>
          
          <p style="font-size: 14px; color: #666;">
            If you didn't request this link, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Travi CMS - Content Management System
          </p>
        </body>
        </html>
      `,
    });

    console.log('[Magic Link] Email sent to:', email);
    return true;
  } catch (error) {
    console.error('[Magic Link] Failed to send email:', error);
    return false;
  }
}

/**
 * Request a magic link for email authentication
 */
export async function requestMagicLink(email: string): Promise<MagicLinkResult> {
  // Create token
  const result = await createMagicLinkToken(email);

  if (result.success && result.token) {
    // Get user name for personalized email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Send email
    await sendMagicLinkEmail(email, result.token, user?.name || undefined);
  }

  return result;
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Clean up expired magic link tokens
 * Should be run periodically (e.g., daily cron job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await db
      .delete(magicLinkTokens)
      .where(
        and(
          eq(magicLinkTokens.used, true),
          // Delete tokens older than 24 hours
          gt(magicLinkTokens.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
        )
      );

    console.log('[Magic Link] Cleaned up expired tokens');
    return 0; // Drizzle doesn't return affected count
  } catch (error) {
    console.error('[Magic Link] Error cleaning up tokens:', error);
    return 0;
  }
}
