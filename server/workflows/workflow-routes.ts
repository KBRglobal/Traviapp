/**
 * Workflow Routes
 * 
 * CRUD endpoints for workflow automation management
 */

import type { Express, Request, Response } from 'express';
import { db } from '../db';
import { workflows, workflowExecutions, insertWorkflowSchema } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { manualTriggerWorkflow } from './workflow-engine';
import { z } from 'zod';

// ============================================================================
// WORKFLOW CRUD ROUTES
// ============================================================================

export function registerWorkflowRoutes(app: Express) {
  // Get all workflows
  app.get('/api/workflows', async (req: Request, res: Response) => {
    try {
      const allWorkflows = await db
        .select()
        .from(workflows)
        .orderBy(desc(workflows.createdAt));

      res.json(allWorkflows);
    } catch (error) {
      console.error('[Workflows] Error fetching workflows:', error);
      res.status(500).json({ error: 'Failed to fetch workflows' });
    }
  });

  // Get single workflow
  app.get('/api/workflows/:id', async (req: Request, res: Response) => {
    try {
      const [workflow] = await db
        .select()
        .from(workflows)
        .where(eq(workflows.id, req.params.id))
        .limit(1);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json(workflow);
    } catch (error) {
      console.error('[Workflows] Error fetching workflow:', error);
      res.status(500).json({ error: 'Failed to fetch workflow' });
    }
  });

  // Create workflow
  app.post('/api/workflows', async (req: Request, res: Response) => {
    try {
      const validated = insertWorkflowSchema.parse(req.body);

      const [workflow] = await db
        .insert(workflows)
        .values(validated)
        .returning();

      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('[Workflows] Error creating workflow:', error);
      res.status(500).json({ error: 'Failed to create workflow' });
    }
  });

  // Update workflow
  app.patch('/api/workflows/:id', async (req: Request, res: Response) => {
    try {
      const validated = insertWorkflowSchema.partial().parse(req.body);

      const [updated] = await db
        .update(workflows)
        .set({ ...validated, updatedAt: new Date() })
        .where(eq(workflows.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.errors });
      }
      console.error('[Workflows] Error updating workflow:', error);
      res.status(500).json({ error: 'Failed to update workflow' });
    }
  });

  // Delete workflow
  app.delete('/api/workflows/:id', async (req: Request, res: Response) => {
    try {
      const [deleted] = await db
        .delete(workflows)
        .where(eq(workflows.id, req.params.id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json({ success: true, message: 'Workflow deleted' });
    } catch (error) {
      console.error('[Workflows] Error deleting workflow:', error);
      res.status(500).json({ error: 'Failed to delete workflow' });
    }
  });

  // Manually trigger workflow
  app.post('/api/workflows/:id/trigger', async (req: Request, res: Response) => {
    try {
      const triggerData = req.body;
      const result = await manualTriggerWorkflow(req.params.id, triggerData);
      res.json(result);
    } catch (error) {
      console.error('[Workflows] Error triggering workflow:', error);
      res.status(500).json({ error: 'Failed to trigger workflow' });
    }
  });

  // Get workflow executions
  app.get('/api/workflows/:id/executions', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const executions = await db
        .select()
        .from(workflowExecutions)
        .where(eq(workflowExecutions.workflowId, req.params.id))
        .orderBy(desc(workflowExecutions.createdAt))
        .limit(limit);

      res.json(executions);
    } catch (error) {
      console.error('[Workflows] Error fetching executions:', error);
      res.status(500).json({ error: 'Failed to fetch executions' });
    }
  });

  // Get workflow execution details
  app.get('/api/workflows/:id/executions/:executionId', async (req: Request, res: Response) => {
    try {
      const [execution] = await db
        .select()
        .from(workflowExecutions)
        .where(eq(workflowExecutions.id, req.params.executionId))
        .limit(1);

      if (!execution) {
        return res.status(404).json({ error: 'Execution not found' });
      }

      res.json(execution);
    } catch (error) {
      console.error('[Workflows] Error fetching execution:', error);
      res.status(500).json({ error: 'Failed to fetch execution' });
    }
  });
}
