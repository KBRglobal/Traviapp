/**
 * Webhook Routes
 * 
 * CRUD endpoints for webhook management
 */

import type { Express, Request, Response } from 'express';
import { db } from '../db';
import { webhooks, insertWebhookSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import {
  triggerWebhooks,
  testWebhook,
  getWebhookLogs,
  getWebhookStats,
} from './webhook-manager';
import { z } from 'zod';

// ============================================================================
// WEBHOOK CRUD ROUTES
// ============================================================================

export function registerWebhookRoutes(app: Express) {
  // Get all webhooks
  app.get('/api/webhooks', async (req: Request, res: Response) => {
    try {
      const allWebhooks = await db.select().from(webhooks);
      res.json(allWebhooks);
    } catch (error) {
      console.error('[Webhooks] Error fetching webhooks:', error);
      res.status(500).json({ error: 'Failed to fetch webhooks' });
    }
  });

  // Get single webhook
  app.get('/api/webhooks/:id', async (req: Request, res: Response) => {
    try {
      const [webhook] = await db
        .select()
        .from(webhooks)
        .where(eq(webhooks.id, req.params.id))
        .limit(1);

      if (!webhook) {
        return res.status(404).json({ error: 'Webhook not found' });
      }

      res.json(webhook);
    } catch (error) {
      console.error('[Webhooks] Error fetching webhook:', error);
      res.status(500).json({ error: 'Failed to fetch webhook' });
    }
  });

  // Create webhook
  app.post('/api/webhooks', async (req: Request, res: Response) => {
    try {
      const validated = insertWebhookSchema.parse(req.body);

      const [webhook] = await db
        .insert(webhooks)
        .values(validated)
        .returning();

      res.status(201).json(webhook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('[Webhooks] Error creating webhook:', error);
      res.status(500).json({ error: 'Failed to create webhook' });
    }
  });

  // Update webhook
  app.patch('/api/webhooks/:id', async (req: Request, res: Response) => {
    try {
      const validated = insertWebhookSchema.partial().parse(req.body);

      const [updated] = await db
        .update(webhooks)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(webhooks.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Webhook not found' });
      }

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('[Webhooks] Error updating webhook:', error);
      res.status(500).json({ error: 'Failed to update webhook' });
    }
  });

  // Delete webhook
  app.delete('/api/webhooks/:id', async (req: Request, res: Response) => {
    try {
      const [deleted] = await db
        .delete(webhooks)
        .where(eq(webhooks.id, req.params.id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: 'Webhook not found' });
      }

      res.json({ success: true, message: 'Webhook deleted' });
    } catch (error) {
      console.error('[Webhooks] Error deleting webhook:', error);
      res.status(500).json({ error: 'Failed to delete webhook' });
    }
  });

  // Test webhook
  app.post('/api/webhooks/:id/test', async (req: Request, res: Response) => {
    try {
      const result = await testWebhook(req.params.id);
      res.json(result);
    } catch (error) {
      console.error('[Webhooks] Error testing webhook:', error);
      res.status(500).json({ error: 'Failed to test webhook' });
    }
  });

  // Get webhook logs
  app.get('/api/webhooks/:id/logs', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await getWebhookLogs(req.params.id, limit);
      res.json(logs);
    } catch (error) {
      console.error('[Webhooks] Error fetching logs:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  // Get webhook stats
  app.get('/api/webhooks/:id/stats', async (req: Request, res: Response) => {
    try {
      const stats = await getWebhookStats(req.params.id);
      res.json(stats);
    } catch (error) {
      console.error('[Webhooks] Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
}
