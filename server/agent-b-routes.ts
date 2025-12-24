/**
 * Agent B Routes
 * Newsletter, Analytics, Automation & Integrations Routes
 */

import type { Express } from "express";
import { requireAuth, requirePermission, rateLimiters } from "../security";
import { z } from "zod";

// Newsletter Template imports
import * as templateBuilder from "../newsletter/templates/template-builder";
import * as templateRenderer from "../newsletter/templates/template-renderer";

// Newsletter Features imports
import * as segmentation from "../newsletter/segmentation";
import * as abTesting from "../newsletter/ab-testing";
import * as dripCampaigns from "../newsletter/drip-campaigns";

// Newsletter Integrations
import * as mailchimp from "../newsletter/integrations/mailchimp";
import * as klaviyo from "../newsletter/integrations/klaviyo";

// Analytics imports
import * as analyticsPro from "../analytics/analytics-pro";
import * as realtimeDashboard from "../analytics/realtime/realtime-dashboard";
import * as analyticsIntegrations from "../analytics/integrations";

// Automation imports
import * as automationSystem from "../automation/automation-system";

// ============================================================================
// NEWSLETTER TEMPLATE ROUTES
// ============================================================================

export function registerNewsletterTemplateRoutes(app: Express): void {
  // List templates
  app.get("/api/newsletter/templates", requireAuth, async (req, res) => {
    try {
      const templates = await templateBuilder.getTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get template with blocks
  app.get("/api/newsletter/templates/:id", requireAuth, async (req, res) => {
    try {
      const template = await templateBuilder.getTemplateWithBlocks(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create template
  app.post("/api/newsletter/templates", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const template = await templateBuilder.createTemplate({ ...req.body, createdBy: userId });
      res.status(201).json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create from pre-built
  app.post("/api/newsletter/templates/prebuilt/:key", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const template = await templateBuilder.createFromPrebuilt(req.params.key as any, userId);
      res.status(201).json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update template
  app.patch("/api/newsletter/templates/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const template = await templateBuilder.updateTemplate(req.params.id, req.body);
      if (!template) return res.status(404).json({ error: "Template not found" });
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete template
  app.delete("/api/newsletter/templates/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      const success = await templateBuilder.deleteTemplate(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Add block to template
  app.post("/api/newsletter/templates/:id/blocks", requirePermission("canEdit"), async (req, res) => {
    try {
      const block = await templateBuilder.addBlock(req.params.id, req.body);
      res.status(201).json(block);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Render template
  app.post("/api/newsletter/templates/:id/render", requireAuth, async (req, res) => {
    try {
      const template = await templateBuilder.getTemplateWithBlocks(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      
      const html = templateRenderer.renderTemplate(template.blocks, req.body.variables || {});
      const plainText = templateRenderer.renderPlainText(template.blocks, req.body.variables || {});
      
      res.json({ html, plainText });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// NEWSLETTER SEGMENTATION ROUTES
// ============================================================================

export function registerSegmentationRoutes(app: Express): void {
  app.get("/api/newsletter/segments", requireAuth, async (req, res) => {
    try {
      const segments = await segmentation.getSegments();
      res.json(segments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/newsletter/segments/:id", requireAuth, async (req, res) => {
    try {
      const segment = await segmentation.getSegmentWithConditions(req.params.id);
      if (!segment) return res.status(404).json({ error: "Segment not found" });
      res.json(segment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/segments", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const segment = await segmentation.createSegment({ ...req.body, createdBy: userId });
      res.status(201).json(segment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/segments/templates/:key", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const segment = await segmentation.createFromTemplate(req.params.key as any, userId);
      res.status(201).json(segment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/newsletter/segments/:id/subscribers", requireAuth, async (req, res) => {
    try {
      const subscribers = await segmentation.getSegmentSubscribers(req.params.id);
      res.json(subscribers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/segments/:id/refresh", requireAuth, async (req, res) => {
    try {
      const count = await segmentation.updateSegmentCount(req.params.id);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// A/B TESTING ROUTES
// ============================================================================

export function registerAbTestingRoutes(app: Express): void {
  app.get("/api/newsletter/ab-tests", requireAuth, async (req, res) => {
    try {
      const tests = await abTesting.getAbTests();
      res.json(tests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/ab-tests", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const test = await abTesting.createAbTest({ ...req.body, createdBy: userId });
      res.status(201).json(test);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/newsletter/ab-tests/:id/results", requireAuth, async (req, res) => {
    try {
      const results = await abTesting.getTestResults(req.params.id);
      if (!results) return res.status(404).json({ error: "Test not found" });
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/ab-tests/:id/select-winner", requirePermission("canEdit"), async (req, res) => {
    try {
      const success = await abTesting.autoSelectWinner(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// DRIP CAMPAIGNS ROUTES
// ============================================================================

export function registerDripCampaignRoutes(app: Express): void {
  app.get("/api/newsletter/drip-campaigns", requireAuth, async (req, res) => {
    try {
      const campaigns = await dripCampaigns.getDripCampaigns();
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/drip-campaigns", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const campaign = await dripCampaigns.createDripCampaign({ ...req.body, createdBy: userId });
      res.status(201).json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/drip-campaigns/:id/enroll", requirePermission("canEdit"), async (req, res) => {
    try {
      const { subscriberId } = req.body;
      const enrollment = await dripCampaigns.enrollSubscriber(req.params.id, subscriberId);
      res.status(201).json(enrollment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// BEHAVIORAL TRIGGERS ROUTES
// ============================================================================

export function registerBehavioralTriggerRoutes(app: Express): void {
  app.get("/api/newsletter/triggers", requireAuth, async (req, res) => {
    try {
      const triggers = await dripCampaigns.getBehavioralTriggers();
      res.json(triggers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/triggers", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const trigger = await dripCampaigns.createBehavioralTrigger({ ...req.body, createdBy: userId });
      res.status(201).json(trigger);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// INTEGRATION ROUTES
// ============================================================================

export function registerIntegrationRoutes(app: Express): void {
  // Mailchimp
  app.post("/api/newsletter/integrations/mailchimp/sync-subscribers", requirePermission("canEdit"), async (req, res) => {
    try {
      const { connectionId } = req.body;
      const result = await mailchimp.syncAllSubscribersToMailchimp(connectionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/integrations/mailchimp/import-subscribers", requirePermission("canEdit"), async (req, res) => {
    try {
      const { connectionId } = req.body;
      const result = await mailchimp.importSubscribersFromMailchimp(connectionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Klaviyo
  app.post("/api/newsletter/integrations/klaviyo/sync-subscribers", requirePermission("canEdit"), async (req, res) => {
    try {
      const { connectionId } = req.body;
      const result = await klaviyo.syncAllSubscribersToKlaviyo(connectionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/newsletter/integrations/klaviyo/import-subscribers", requirePermission("canEdit"), async (req, res) => {
    try {
      const { connectionId } = req.body;
      const result = await klaviyo.importSubscribersFromKlaviyo(connectionId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// ANALYTICS ROUTES
// ============================================================================

export function registerAnalyticsProRoutes(app: Express): void {
  // Realtime
  app.get("/api/analytics/realtime/metrics", requireAuth, async (req, res) => {
    try {
      const metrics = await realtimeDashboard.getRealtimeMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Journeys
  app.get("/api/analytics/journeys/:id", requireAuth, async (req, res) => {
    try {
      const journey = await analyticsPro.getJourney(req.params.id);
      if (!journey) return res.status(404).json({ error: "Journey not found" });
      res.json(journey);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Funnels
  app.get("/api/analytics/funnels", requireAuth, async (req, res) => {
    try {
      const funnels = await analyticsPro.getFunnels();
      res.json(funnels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/analytics/funnels", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const funnel = await analyticsPro.createFunnel({ ...req.body, createdBy: userId });
      res.status(201).json(funnel);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Cohorts
  app.get("/api/analytics/cohorts", requireAuth, async (req, res) => {
    try {
      const cohorts = await analyticsPro.getCohorts();
      res.json(cohorts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get("/api/analytics/cohorts/:id/retention", requireAuth, async (req, res) => {
    try {
      const retention = await analyticsPro.analyzeCohortRetention(req.params.id);
      res.json(retention);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Custom Reports
  app.get("/api/analytics/custom-reports", requireAuth, async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const reports = await analyticsPro.getCustomReports(userId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/analytics/custom-reports/:id/execute", requireAuth, async (req, res) => {
    try {
      const result = await analyticsPro.executeCustomReport(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Data Exports
  app.get("/api/analytics/exports", requireAuth, async (req, res) => {
    try {
      const exports = await analyticsIntegrations.getDataExports();
      res.json(exports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/analytics/exports/:id/execute", requirePermission("canEdit"), async (req, res) => {
    try {
      const result = await analyticsIntegrations.executeDataExport(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// AUTOMATION ROUTES
// ============================================================================

export function registerAutomationSystemRoutes(app: Express): void {
  // Scheduled Reports
  app.get("/api/reports/scheduled", requireAuth, async (req, res) => {
    try {
      const reports = await automationSystem.getScheduledReports();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/reports/scheduled", requirePermission("canCreate"), async (req, res) => {
    try {
      const userId = (req as any).user?.claims?.sub;
      const report = await automationSystem.createScheduledReport({ ...req.body, createdBy: userId });
      res.status(201).json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Content Calendar
  app.get("/api/content-calendar", requireAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const items = await automationSystem.getCalendarItems(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/content-calendar/ai-suggest", requireAuth, async (req, res) => {
    try {
      const { days = 30 } = req.body;
      const suggestions = await automationSystem.generateAISuggestions(days);
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Zapier
  app.get("/api/integrations/zapier/triggers", requireAuth, (req, res) => {
    const triggers = automationSystem.getZapierTriggers();
    res.json(triggers);
  });
  
  app.get("/api/integrations/zapier/actions", requireAuth, (req, res) => {
    const actions = automationSystem.getZapierActions();
    res.json(actions);
  });
  
  app.post("/api/integrations/zapier/action", async (req, res) => {
    try {
      const { action, data } = req.body;
      const result = await automationSystem.handleZapierAction(action, data);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}

// ============================================================================
// REGISTER ALL ROUTES
// ============================================================================

export function registerAgentBRoutes(app: Express): void {
  registerNewsletterTemplateRoutes(app);
  registerSegmentationRoutes(app);
  registerAbTestingRoutes(app);
  registerDripCampaignRoutes(app);
  registerBehavioralTriggerRoutes(app);
  registerIntegrationRoutes(app);
  registerAnalyticsProRoutes(app);
  registerAutomationSystemRoutes(app);
}
