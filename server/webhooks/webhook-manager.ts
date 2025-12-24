/**
 * Webhook Manager
 * 
 * Manages webhook registrations and delivery
 * - Signs payloads with HMAC-SHA256
 * - Implements retry logic with exponential backoff
 * - Logs all webhook deliveries
 */

import crypto from 'crypto';
import { db } from '../db';
import { webhooks, webhookLogs } from '@shared/schema';
import { eq, and, lt } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  error?: string;
  duration: number; // ms
  attemptNumber: number;
}

// ============================================================================
// SIGNATURE GENERATION
// ============================================================================

/**
 * Generate HMAC-SHA256 signature for webhook payload
 */
export function generateWebhookSignature(
  payload: string,
  secret: string
): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// ============================================================================
// WEBHOOK DELIVERY
// ============================================================================

/**
 * Deliver webhook to a single endpoint
 */
async function deliverWebhook(
  webhookId: string,
  url: string,
  payload: WebhookPayload,
  secret?: string,
  headers?: Record<string, string>,
  attemptNumber: number = 1
): Promise<WebhookDeliveryResult> {
  const startTime = Date.now();

  try {
    const payloadString = JSON.stringify(payload);

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Travi-CMS-Webhook/1.0',
      'X-Webhook-Event': payload.event,
      'X-Webhook-Timestamp': payload.timestamp,
      'X-Webhook-Attempt': attemptNumber.toString(),
      ...headers,
    };

    // Add signature if secret is provided
    if (secret) {
      requestHeaders['X-Webhook-Signature'] = generateWebhookSignature(
        payloadString,
        secret
      );
    }

    // Send webhook
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: payloadString,
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.text();

    const result: WebhookDeliveryResult = {
      success: response.ok,
      statusCode: response.status,
      responseBody: responseBody.substring(0, 1000), // Limit stored response
      duration,
      attemptNumber,
    };

    // Log delivery
    await logWebhookDelivery(webhookId, payload.event, payload, result);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    const result: WebhookDeliveryResult = {
      success: false,
      error: errorMessage,
      duration,
      attemptNumber,
    };

    // Log failed delivery
    await logWebhookDelivery(webhookId, payload.event, payload, result);

    return result;
  }
}

/**
 * Deliver webhook with retry logic (exponential backoff)
 */
export async function deliverWebhookWithRetry(
  webhookId: string,
  url: string,
  payload: WebhookPayload,
  secret?: string,
  headers?: Record<string, string>,
  maxRetries: number = 3
): Promise<WebhookDeliveryResult> {
  let lastResult: WebhookDeliveryResult | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Add delay for retries (exponential backoff)
    if (attempt > 1) {
      const delay = Math.pow(2, attempt - 1) * 1000; // 2s, 4s, 8s, ...
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    lastResult = await deliverWebhook(
      webhookId,
      url,
      payload,
      secret,
      headers,
      attempt
    );

    if (lastResult.success) {
      return lastResult;
    }

    console.log(
      `[Webhook] Delivery attempt ${attempt}/${maxRetries} failed for ${webhookId}`
    );
  }

  return lastResult!;
}

/**
 * Log webhook delivery to database
 */
async function logWebhookDelivery(
  webhookId: string,
  event: string,
  payload: WebhookPayload,
  result: WebhookDeliveryResult
): Promise<void> {
  try {
    await db.insert(webhookLogs).values({
      webhookId,
      event,
      payload,
      responseStatus: result.statusCode,
      responseBody: result.responseBody,
      error: result.error,
      duration: result.duration,
    });
  } catch (error) {
    console.error('[Webhook] Failed to log delivery:', error);
  }
}

// ============================================================================
// WEBHOOK TRIGGERING
// ============================================================================

/**
 * Trigger webhooks for an event
 */
export async function triggerWebhooks(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    // Get all active webhooks subscribed to this event
    const activeWebhooks = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.isActive, true));

    // Filter webhooks by event
    const subscribedWebhooks = activeWebhooks.filter((webhook) => {
      const events = webhook.events as string[];
      return events.includes(event) || events.includes('*');
    });

    if (subscribedWebhooks.length === 0) {
      console.log(`[Webhook] No webhooks subscribed to event: ${event}`);
      return;
    }

    console.log(
      `[Webhook] Triggering ${subscribedWebhooks.length} webhooks for event: ${event}`
    );

    // Prepare payload
    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    // Deliver webhooks in parallel
    const deliveries = subscribedWebhooks.map((webhook) =>
      deliverWebhookWithRetry(
        webhook.id,
        webhook.url,
        payload,
        webhook.secret || undefined,
        webhook.headers as Record<string, string> | undefined
      )
    );

    await Promise.allSettled(deliveries);
  } catch (error) {
    console.error('[Webhook] Error triggering webhooks:', error);
  }
}

/**
 * Test webhook delivery
 */
export async function testWebhook(webhookId: string): Promise<WebhookDeliveryResult> {
  try {
    const [webhook] = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.id, webhookId))
      .limit(1);

    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found',
        duration: 0,
        attemptNumber: 1,
      };
    }

    const payload: WebhookPayload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook delivery',
        webhookId: webhook.id,
        webhookName: webhook.name,
      },
    };

    return await deliverWebhook(
      webhook.id,
      webhook.url,
      payload,
      webhook.secret || undefined,
      webhook.headers as Record<string, string> | undefined,
      1
    );
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: 0,
      attemptNumber: 1,
    };
  }
}

// ============================================================================
// WEBHOOK MANAGEMENT
// ============================================================================

/**
 * Get webhook logs for a webhook
 */
export async function getWebhookLogs(
  webhookId: string,
  limit: number = 50
) {
  return await db
    .select()
    .from(webhookLogs)
    .where(eq(webhookLogs.webhookId, webhookId))
    .orderBy(webhookLogs.createdAt)
    .limit(limit);
}

/**
 * Get webhook statistics
 */
export async function getWebhookStats(webhookId: string) {
  const logs = await db
    .select()
    .from(webhookLogs)
    .where(eq(webhookLogs.webhookId, webhookId));

  const total = logs.length;
  const successful = logs.filter((log) => log.responseStatus && log.responseStatus >= 200 && log.responseStatus < 300).length;
  const failed = total - successful;
  const avgDuration = total > 0 ? logs.reduce((sum, log) => sum + (log.duration || 0), 0) / total : 0;

  return {
    total,
    successful,
    failed,
    successRate: total > 0 ? (successful / total) * 100 : 0,
    avgDuration: Math.round(avgDuration),
  };
}

/**
 * Clean up old webhook logs (older than 30 days)
 */
export async function cleanupOldLogs(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await db
      .delete(webhookLogs)
      .where(lt(webhookLogs.createdAt, thirtyDaysAgo));

    console.log('[Webhook] Cleaned up old webhook logs');
  } catch (error) {
    console.error('[Webhook] Error cleaning up logs:', error);
  }
}
