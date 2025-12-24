/**
 * Workflow Automation Engine
 * 
 * Executes workflows based on triggers:
 * - Status changes
 * - Scheduled events
 * - Manual triggers
 * - Webhooks
 * 
 * Supports actions:
 * - Notify users
 * - Update content fields
 * - Publish/unpublish content
 * - Send emails
 * - Call webhooks
 */

import { db } from '../db';
import { workflows, workflowExecutions, contents, users, notifications } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { Resend } from 'resend';
import { triggerWebhooks } from '../webhooks/webhook-manager';

// ============================================================================
// TYPES
// ============================================================================

export interface WorkflowTriggerData {
  contentId?: string;
  userId?: string;
  oldStatus?: string;
  newStatus?: string;
  [key: string]: unknown;
}

export interface WorkflowExecutionResult {
  success: boolean;
  actionsExecuted: number;
  actionsFailed: number;
  errors: string[];
  result: Record<string, unknown>;
}

// ============================================================================
// WORKFLOW EXECUTION
// ============================================================================

/**
 * Execute a workflow
 */
export async function executeWorkflow(
  workflowId: string,
  triggerData: WorkflowTriggerData
): Promise<WorkflowExecutionResult> {
  const executionId = await createExecution(workflowId, triggerData);

  try {
    // Get workflow
    const [workflow] = await db
      .select()
      .from(workflows)
      .where(eq(workflows.id, workflowId))
      .limit(1);

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    if (!workflow.isActive) {
      throw new Error('Workflow is not active');
    }

    // Check conditions
    const conditionsMet = await checkConditions(workflow.conditions as Record<string, unknown>, triggerData);
    if (!conditionsMet) {
      await updateExecution(executionId, 'completed', { message: 'Conditions not met' });
      return {
        success: true,
        actionsExecuted: 0,
        actionsFailed: 0,
        errors: [],
        result: { message: 'Conditions not met, workflow skipped' },
      };
    }

    // Execute actions
    const actions = workflow.actions as Array<{ action: string; config: Record<string, unknown> }>;
    let actionsExecuted = 0;
    let actionsFailed = 0;
    const errors: string[] = [];
    const results: Record<string, unknown> = {};

    for (const action of actions) {
      try {
        const result = await executeAction(action.action, action.config, triggerData);
        results[action.action] = result;
        actionsExecuted++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${action.action}: ${errorMsg}`);
        actionsFailed++;
      }
    }

    const success = actionsFailed === 0;
    await updateExecution(
      executionId,
      success ? 'completed' : 'failed',
      { results, errors: errors.length > 0 ? errors : undefined }
    );

    return {
      success,
      actionsExecuted,
      actionsFailed,
      errors,
      result: results,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await updateExecution(executionId, 'failed', undefined, errorMsg);

    return {
      success: false,
      actionsExecuted: 0,
      actionsFailed: 0,
      errors: [errorMsg],
      result: {},
    };
  }
}

/**
 * Check if workflow conditions are met
 */
async function checkConditions(
  conditions: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<boolean> {
  if (!conditions || Object.keys(conditions).length === 0) {
    return true; // No conditions = always execute
  }

  // Simple condition checking
  for (const [key, value] of Object.entries(conditions)) {
    if (triggerData[key] !== value) {
      return false;
    }
  }

  return true;
}

/**
 * Execute a single action
 */
async function executeAction(
  action: string,
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<unknown> {
  console.log(`[Workflow] Executing action: ${action}`);

  switch (action) {
    case 'notify':
      return await executeNotifyAction(config, triggerData);
    case 'update_field':
      return await executeUpdateFieldAction(config, triggerData);
    case 'publish':
      return await executePublishAction(config, triggerData);
    case 'unpublish':
      return await executeUnpublishAction(config, triggerData);
    case 'send_email':
      return await executeSendEmailAction(config, triggerData);
    case 'call_webhook':
      return await executeCallWebhookAction(config, triggerData);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

// ============================================================================
// ACTION IMPLEMENTATIONS
// ============================================================================

/**
 * Notify action - send notification to users
 */
async function executeNotifyAction(
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<{ notified: number }> {
  const userId = config.userId as string || triggerData.userId;
  const title = config.title as string || 'Workflow Notification';
  const message = config.message as string;

  if (!userId) {
    throw new Error('userId required for notify action');
  }

  await db.insert(notifications).values({
    userId,
    type: 'workflow',
    title,
    message: message || 'A workflow action has been triggered',
    metadata: { triggerData },
  });

  return { notified: 1 };
}

/**
 * Update field action - update content fields
 */
async function executeUpdateFieldAction(
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<{ updated: boolean }> {
  const contentId = config.contentId as string || triggerData.contentId;
  const field = config.field as string;
  const value = config.value;

  if (!contentId || !field) {
    throw new Error('contentId and field required for update_field action');
  }

  // Build update object
  const updateData: Record<string, unknown> = {
    [field]: value,
    updatedAt: new Date(),
  };

  await db
    .update(contents)
    .set(updateData)
    .where(eq(contents.id, contentId));

  return { updated: true };
}

/**
 * Publish action - publish content
 */
async function executePublishAction(
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<{ published: boolean }> {
  const contentId = config.contentId as string || triggerData.contentId;

  if (!contentId) {
    throw new Error('contentId required for publish action');
  }

  await db
    .update(contents)
    .set({
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(contents.id, contentId));

  return { published: true };
}

/**
 * Unpublish action - unpublish content
 */
async function executeUnpublishAction(
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<{ unpublished: boolean }> {
  const contentId = config.contentId as string || triggerData.contentId;

  if (!contentId) {
    throw new Error('contentId required for unpublish action');
  }

  await db
    .update(contents)
    .set({
      status: 'draft',
      updatedAt: new Date(),
    })
    .where(eq(contents.id, contentId));

  return { unpublished: true };
}

/**
 * Send email action
 */
async function executeSendEmailAction(
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<{ sent: boolean }> {
  const to = config.to as string;
  const subject = config.subject as string;
  const body = config.body as string;

  if (!to || !subject || !body) {
    throw new Error('to, subject, and body required for send_email action');
  }

  const resend = getResendClient();
  if (!resend) {
    throw new Error('Resend not configured');
  }

  await resend.emails.send({
    from: 'Travi CMS <noreply@travi.world>',
    to,
    subject,
    html: body,
  });

  return { sent: true };
}

/**
 * Call webhook action
 */
async function executeCallWebhookAction(
  config: Record<string, unknown>,
  triggerData: WorkflowTriggerData
): Promise<{ called: boolean }> {
  const event = config.event as string || 'workflow.action';

  await triggerWebhooks(event, {
    ...triggerData,
    ...config,
  });

  return { called: true };
}

// ============================================================================
// WORKFLOW TRIGGERS
// ============================================================================

/**
 * Trigger workflows based on content status change
 */
export async function triggerStatusChangeWorkflows(
  contentId: string,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  try {
    const activeWorkflows = await db
      .select()
      .from(workflows)
      .where(and(
        eq(workflows.isActive, true),
        eq(workflows.trigger, 'status_change')
      ));

    for (const workflow of activeWorkflows) {
      const triggerConfig = workflow.triggerConfig as Record<string, unknown>;

      // Check if this workflow is triggered by this status change
      if (
        !triggerConfig.status ||
        triggerConfig.status === newStatus
      ) {
        await executeWorkflow(workflow.id, {
          contentId,
          oldStatus,
          newStatus,
        });
      }
    }
  } catch (error) {
    console.error('[Workflow] Error triggering status change workflows:', error);
  }
}

/**
 * Manually trigger a workflow
 */
export async function manualTriggerWorkflow(
  workflowId: string,
  triggerData: WorkflowTriggerData
): Promise<WorkflowExecutionResult> {
  return await executeWorkflow(workflowId, triggerData);
}

// ============================================================================
// EXECUTION TRACKING
// ============================================================================

/**
 * Create workflow execution record
 */
async function createExecution(
  workflowId: string,
  triggerData: WorkflowTriggerData
): Promise<string> {
  const [execution] = await db
    .insert(workflowExecutions)
    .values({
      workflowId,
      triggerData,
      status: 'running',
      executedAt: new Date(),
    })
    .returning();

  return execution.id;
}

/**
 * Update workflow execution
 */
async function updateExecution(
  executionId: string,
  status: string,
  result?: Record<string, unknown>,
  error?: string
): Promise<void> {
  await db
    .update(workflowExecutions)
    .set({
      status,
      result,
      error,
      completedAt: new Date(),
    })
    .where(eq(workflowExecutions.id, executionId));
}

// ============================================================================
// HELPERS
// ============================================================================

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Workflow] RESEND_API_KEY not configured');
    return null;
  }
  return new Resend(apiKey);
}
