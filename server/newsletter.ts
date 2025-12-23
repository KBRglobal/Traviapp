/**
 * Newsletter System
 *
 * - Subscriber management
 * - Email campaigns
 * - Automated sequences
 * - Analytics
 */

import { db } from "./db";
import { contents } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { cache } from "./cache";
import * as crypto from "crypto";

// ============================================================================
// TYPES
// ============================================================================

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  locale: string;
  status: "active" | "unsubscribed" | "bounced" | "pending";
  source: string; // where they signed up
  tags: string[];
  preferences: {
    frequency: "daily" | "weekly" | "monthly";
    categories: string[];
  };
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  createdAt: Date;
  lastEmailAt?: Date;
  emailsReceived: number;
  emailsOpened: number;
  emailsClicked: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  subjectHe: string;
  previewText: string;
  previewTextHe: string;
  contentHtml: string;
  contentHtmlHe: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
  targetTags?: string[];
  targetLocales?: string[];
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: Date;
}

export interface AutomatedSequence {
  id: string;
  name: string;
  trigger: "signup" | "tag_added" | "inactivity" | "custom";
  triggerValue?: string;
  emails: Array<{
    delayDays: number;
    subject: string;
    subjectHe: string;
    contentHtml: string;
    contentHtmlHe: string;
  }>;
  isActive: boolean;
}

// ============================================================================
// IN-MEMORY STORAGE (use database in production)
// ============================================================================

const subscriberStore: Map<string, Subscriber> = new Map();
const campaignStore: Map<string, EmailCampaign> = new Map();
const sequenceStore: Map<string, AutomatedSequence> = new Map();
// Store confirmation tokens mapped to subscriber IDs (token -> { subscriberId, expiresAt })
const confirmationTokenStore: Map<string, { subscriberId: string; expiresAt: Date }> = new Map();

// ============================================================================
// SUBSCRIBER MANAGEMENT
// ============================================================================

export const subscribers = {
  /**
   * Add new subscriber
   */
  async add(
    email: string,
    options: {
      name?: string;
      locale?: string;
      source?: string;
      tags?: string[];
      preferences?: Subscriber["preferences"];
    } = {}
  ): Promise<{
    subscriber: Subscriber;
    isNew: boolean;
    confirmationToken?: string;
  }> {
    const existingId = [...subscriberStore.values()].find(s => s.email.toLowerCase() === email.toLowerCase())?.id;

    if (existingId) {
      const existing = subscriberStore.get(existingId)!;
      // Reactivate if unsubscribed
      if (existing.status === "unsubscribed") {
        existing.status = "pending";
        existing.unsubscribedAt = undefined;
        subscriberStore.set(existingId, existing);
      }
      return { subscriber: existing, isNew: false };
    }

    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const subscriber: Subscriber = {
      id,
      email: email.toLowerCase(),
      name: options.name,
      locale: options.locale || "en",
      status: "pending",
      source: options.source || "website",
      tags: options.tags || [],
      preferences: options.preferences || {
        frequency: "weekly",
        categories: [],
      },
      createdAt: new Date(),
      emailsReceived: 0,
      emailsOpened: 0,
      emailsClicked: 0,
    };

    subscriberStore.set(id, subscriber);

    // Store the confirmation token with 24-hour expiry
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    confirmationTokenStore.set(confirmationToken, {
      subscriberId: id,
      expiresAt: tokenExpiry,
    });

    // In production, send confirmation email here
    // await this.sendConfirmationEmail(subscriber, confirmationToken);

    return { subscriber, isNew: true, confirmationToken };
  },

  /**
   * Confirm subscription - validates token before activating
   */
  async confirm(token: string): Promise<Subscriber | null> {
    // Validate the confirmation token
    const tokenData = confirmationTokenStore.get(token);

    if (!tokenData) {
      console.log("[Newsletter] Invalid confirmation token");
      return null;
    }

    // Check if token has expired
    if (new Date() > tokenData.expiresAt) {
      console.log("[Newsletter] Confirmation token expired");
      confirmationTokenStore.delete(token);
      return null;
    }

    // Get the subscriber
    const subscriber = subscriberStore.get(tokenData.subscriberId);

    if (!subscriber) {
      console.log("[Newsletter] Subscriber not found for token");
      confirmationTokenStore.delete(token);
      return null;
    }

    if (subscriber.status !== "pending") {
      console.log("[Newsletter] Subscriber already confirmed or unsubscribed");
      confirmationTokenStore.delete(token);
      return subscriber;
    }

    // Activate the subscriber
    subscriber.status = "active";
    subscriber.confirmedAt = new Date();
    subscriberStore.set(subscriber.id, subscriber);

    // Remove the used token
    confirmationTokenStore.delete(token);

    // Trigger welcome sequence
    await automatedSequences.triggerForSubscriber(subscriber.id, "signup");

    console.log(`[Newsletter] Subscriber confirmed: ${subscriber.email}`);
    return subscriber;
  },

  /**
   * Unsubscribe
   */
  async unsubscribe(email: string, reason?: string): Promise<boolean> {
    const subscriber = [...subscriberStore.values()].find(
      s => s.email.toLowerCase() === email.toLowerCase()
    );

    if (!subscriber) return false;

    subscriber.status = "unsubscribed";
    subscriber.unsubscribedAt = new Date();
    subscriberStore.set(subscriber.id, subscriber);

    return true;
  },

  /**
   * Update preferences
   */
  async updatePreferences(
    subscriberId: string,
    preferences: Partial<Subscriber["preferences"]>
  ): Promise<Subscriber | null> {
    const subscriber = subscriberStore.get(subscriberId);
    if (!subscriber) return null;

    subscriber.preferences = { ...subscriber.preferences, ...preferences };
    subscriberStore.set(subscriberId, subscriber);

    return subscriber;
  },

  /**
   * Add tags to subscriber
   */
  async addTags(subscriberId: string, tags: string[]): Promise<Subscriber | null> {
    const subscriber = subscriberStore.get(subscriberId);
    if (!subscriber) return null;

    subscriber.tags = [...new Set([...subscriber.tags, ...tags])];
    subscriberStore.set(subscriberId, subscriber);

    // Trigger tag-based sequences
    for (const tag of tags) {
      await automatedSequences.triggerForSubscriber(subscriberId, "tag_added", tag);
    }

    return subscriber;
  },

  /**
   * Get all active subscribers
   */
  async getActive(filters?: {
    locale?: string;
    tags?: string[];
    frequency?: string;
  }): Promise<Subscriber[]> {
    let result = [...subscriberStore.values()].filter(s => s.status === "active");

    if (filters?.locale) {
      result = result.filter(s => s.locale === filters.locale);
    }
    if (filters?.tags && filters.tags.length > 0) {
      result = result.filter(s => filters.tags!.some(t => s.tags.includes(t)));
    }
    if (filters?.frequency) {
      result = result.filter(s => s.preferences.frequency === filters.frequency);
    }

    return result;
  },

  /**
   * Get subscriber stats
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    pending: number;
    unsubscribed: number;
    bounced: number;
    bySource: Record<string, number>;
    byLocale: Record<string, number>;
    growth: Array<{ date: string; subscribers: number }>;
  }> {
    const all = [...subscriberStore.values()];

    const bySource: Record<string, number> = {};
    const byLocale: Record<string, number> = {};

    for (const sub of all) {
      bySource[sub.source] = (bySource[sub.source] || 0) + 1;
      byLocale[sub.locale] = (byLocale[sub.locale] || 0) + 1;
    }

    return {
      total: all.length,
      active: all.filter(s => s.status === "active").length,
      pending: all.filter(s => s.status === "pending").length,
      unsubscribed: all.filter(s => s.status === "unsubscribed").length,
      bounced: all.filter(s => s.status === "bounced").length,
      bySource,
      byLocale,
      growth: [], // Would calculate from database
    };
  },
};

// ============================================================================
// EMAIL CAMPAIGNS
// ============================================================================

export const campaigns = {
  /**
   * Create campaign
   */
  async create(data: Omit<EmailCampaign, "id" | "status" | "stats" | "createdAt">): Promise<EmailCampaign> {
    const id = `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const campaign: EmailCampaign = {
      ...data,
      id,
      status: "draft",
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
      },
      createdAt: new Date(),
    };

    campaignStore.set(id, campaign);
    return campaign;
  },

  /**
   * Schedule campaign
   */
  async schedule(campaignId: string, scheduledAt: Date): Promise<EmailCampaign | null> {
    const campaign = campaignStore.get(campaignId);
    if (!campaign || campaign.status !== "draft") return null;

    campaign.status = "scheduled";
    campaign.scheduledAt = scheduledAt;
    campaignStore.set(campaignId, campaign);

    return campaign;
  },

  /**
   * Send campaign immediately
   */
  async sendNow(campaignId: string): Promise<{
    success: boolean;
    recipientCount: number;
  }> {
    const campaign = campaignStore.get(campaignId);
    if (!campaign || !["draft", "scheduled"].includes(campaign.status)) {
      return { success: false, recipientCount: 0 };
    }

    campaign.status = "sending";
    campaignStore.set(campaignId, campaign);

    // Get target subscribers
    const targetSubscribers = await subscribers.getActive({
      tags: campaign.targetTags,
      locale: campaign.targetLocales?.[0],
    });

    // In production, queue emails for sending
    for (const subscriber of targetSubscribers) {
      // await emailService.send(subscriber.email, campaign);
      campaign.stats.sent++;
    }

    campaign.status = "sent";
    campaign.sentAt = new Date();
    campaignStore.set(campaignId, campaign);

    return {
      success: true,
      recipientCount: targetSubscribers.length,
    };
  },

  /**
   * Track email open
   */
  async trackOpen(campaignId: string, subscriberId: string): Promise<void> {
    const campaign = campaignStore.get(campaignId);
    const subscriber = subscriberStore.get(subscriberId);

    if (campaign) {
      campaign.stats.opened++;
      campaignStore.set(campaignId, campaign);
    }

    if (subscriber) {
      subscriber.emailsOpened++;
      subscriberStore.set(subscriberId, subscriber);
    }
  },

  /**
   * Track link click
   */
  async trackClick(campaignId: string, subscriberId: string, url: string): Promise<void> {
    const campaign = campaignStore.get(campaignId);
    const subscriber = subscriberStore.get(subscriberId);

    if (campaign) {
      campaign.stats.clicked++;
      campaignStore.set(campaignId, campaign);
    }

    if (subscriber) {
      subscriber.emailsClicked++;
      subscriberStore.set(subscriberId, subscriber);
    }
  },

  /**
   * Get campaign analytics
   */
  async getAnalytics(campaignId: string): Promise<{
    campaign: EmailCampaign | null;
    openRate: number;
    clickRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  } | null> {
    const campaign = campaignStore.get(campaignId);
    if (!campaign) return null;

    const sent = campaign.stats.sent || 1;

    return {
      campaign,
      openRate: Math.round((campaign.stats.opened / sent) * 100),
      clickRate: Math.round((campaign.stats.clicked / sent) * 100),
      bounceRate: Math.round((campaign.stats.bounced / sent) * 100),
      unsubscribeRate: Math.round((campaign.stats.unsubscribed / sent) * 100),
    };
  },

  /**
   * Generate newsletter from recent content
   */
  async generateFromContent(options: {
    days: number;
    contentTypes?: string[];
    limit?: number;
  }): Promise<{
    subject: string;
    subjectHe: string;
    contentHtml: string;
    contentHtmlHe: string;
    contentCount: number;
  }> {
    const cutoff = new Date(Date.now() - options.days * 24 * 60 * 60 * 1000);

    let query = db.select()
      .from(contents)
      .where(and(
        eq(contents.status, "published"),
        gte(contents.publishedAt as any, cutoff)
      ))
      .orderBy(desc(contents.publishedAt))
      .limit(options.limit || 5);

    const recentContent = await query;

    // Generate HTML
    const contentHtml = `
      <h1>This Week's Best from Dubai</h1>
      ${recentContent.map(c => `
        <div style="margin-bottom: 20px;">
          <h2><a href="/${c.type}/${c.slug}">${c.title}</a></h2>
          <p>${c.metaDescription || ''}</p>
        </div>
      `).join('')}
    `;

    const contentHtmlHe = `
      <h1>הטוב ביותר מדובאי השבוע</h1>
      ${recentContent.map(c => `
        <div style="margin-bottom: 20px; direction: rtl;">
          <h2><a href="/he/${c.type}/${c.slug}">${c.title}</a></h2>
          <p>${c.metaDescription || ''}</p>
        </div>
      `).join('')}
    `;

    return {
      subject: `${recentContent.length} New Dubai Discoveries This Week`,
      subjectHe: `${recentContent.length} תגליות חדשות מדובאי השבוע`,
      contentHtml,
      contentHtmlHe,
      contentCount: recentContent.length,
    };
  },
};

// ============================================================================
// AUTOMATED SEQUENCES
// ============================================================================

const defaultSequences: AutomatedSequence[] = [
  {
    id: "welcome",
    name: "Welcome Sequence",
    trigger: "signup",
    emails: [
      {
        delayDays: 0,
        subject: "Welcome to Travi - Your Dubai Guide!",
        subjectHe: "ברוכים הבאים לטראווי - המדריך שלך לדובאי!",
        contentHtml: `<h1>Welcome!</h1><p>Thank you for joining...</p>`,
        contentHtmlHe: `<h1>ברוכים הבאים!</h1><p>תודה שהצטרפת...</p>`,
      },
      {
        delayDays: 3,
        subject: "Top 10 Dubai Must-Sees",
        subjectHe: "10 האטרקציות שחובה לראות בדובאי",
        contentHtml: `<h1>Don't Miss These!</h1>...`,
        contentHtmlHe: `<h1>אל תפספסו!</h1>...`,
      },
      {
        delayDays: 7,
        subject: "Insider Tips: Save Money in Dubai",
        subjectHe: "טיפים פנימיים: חסוך כסף בדובאי",
        contentHtml: `<h1>Budget Travel Tips</h1>...`,
        contentHtmlHe: `<h1>טיפים לטיול בתקציב</h1>...`,
      },
    ],
    isActive: true,
  },
  {
    id: "hotel-interest",
    name: "Hotel Interest Sequence",
    trigger: "tag_added",
    triggerValue: "interested_hotels",
    emails: [
      {
        delayDays: 1,
        subject: "Best Hotels for Your Dubai Trip",
        subjectHe: "המלונות הטובים ביותר לטיול שלך לדובאי",
        contentHtml: `<h1>Hotel Recommendations</h1>...`,
        contentHtmlHe: `<h1>המלצות מלונות</h1>...`,
      },
    ],
    isActive: true,
  },
];

// Initialize sequences
defaultSequences.forEach(s => sequenceStore.set(s.id, s));

export const automatedSequences = {
  /**
   * Trigger sequence for subscriber
   */
  async triggerForSubscriber(
    subscriberId: string,
    trigger: AutomatedSequence["trigger"],
    triggerValue?: string
  ): Promise<void> {
    const subscriber = subscriberStore.get(subscriberId);
    if (!subscriber || subscriber.status !== "active") return;

    const matchingSequences = [...sequenceStore.values()].filter(seq => {
      if (!seq.isActive) return false;
      if (seq.trigger !== trigger) return false;
      if (seq.triggerValue && seq.triggerValue !== triggerValue) return false;
      return true;
    });

    for (const sequence of matchingSequences) {
      // In production, queue sequence emails with delays
      console.log(`[Newsletter] Triggering sequence "${sequence.name}" for subscriber ${subscriberId}`);
    }
  },

  /**
   * Get all sequences
   */
  async getAll(): Promise<AutomatedSequence[]> {
    return [...sequenceStore.values()];
  },

  /**
   * Update sequence
   */
  async update(id: string, updates: Partial<AutomatedSequence>): Promise<AutomatedSequence | null> {
    const sequence = sequenceStore.get(id);
    if (!sequence) return null;

    Object.assign(sequence, updates);
    sequenceStore.set(id, sequence);

    return sequence;
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const newsletter = {
  subscribers,
  campaigns,
  sequences: automatedSequences,
};

export default newsletter;
