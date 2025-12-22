/**
 * Monetization Module
 *
 * - Premium content (paid articles/itineraries)
 * - Business listings (restaurants/stores pay for exposure)
 * - Lead generation dashboard (hotels/tours see their leads)
 */

import { db } from "./db";
import { contents, users } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { cache } from "./cache";
import * as crypto from "crypto";

// ============================================================================
// TYPES
// ============================================================================

// Premium Content
export interface PremiumContent {
  contentId: string;
  isPremium: boolean;
  previewPercentage: number; // How much of content is free
  price: number; // In cents
  currency: string;
  accessType: "one-time" | "subscription";
  subscriptionTier?: string;
}

export interface ContentPurchase {
  id: string;
  userId: string;
  contentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentId?: string;
  status: "pending" | "completed" | "refunded";
  createdAt: Date;
  expiresAt?: Date;
}

// Business Listings
export interface BusinessListing {
  id: string;
  businessName: string;
  businessType: "restaurant" | "hotel" | "tour" | "shop" | "service";
  contactEmail: string;
  contactPhone?: string;
  website?: string;

  // Linked content
  contentIds: string[];

  // Subscription
  tier: "basic" | "premium" | "enterprise";
  status: "active" | "pending" | "expired" | "cancelled";
  features: string[];
  monthlyPrice: number;
  startDate: Date;
  endDate?: Date;

  // Stats
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;

  // Settings
  settings: {
    showPhone: boolean;
    showEmail: boolean;
    enableLeadForm: boolean;
    enableBookingWidget: boolean;
    featuredPlacement: boolean;
  };

  createdAt: Date;
}

// Lead Generation
export interface Lead {
  id: string;
  businessId: string;
  contentId: string;
  type: "inquiry" | "booking_request" | "quote_request" | "contact";

  // Contact info
  name: string;
  email: string;
  phone?: string;

  // Details
  message?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  budget?: string;

  // Tracking
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  notes?: string;

  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// IN-MEMORY STORAGE
// ============================================================================

const premiumContentStore: Map<string, PremiumContent> = new Map();
const purchaseStore: Map<string, ContentPurchase> = new Map();
const businessStore: Map<string, BusinessListing> = new Map();
const leadStore: Map<string, Lead> = new Map();

// ============================================================================
// PREMIUM CONTENT
// ============================================================================

export const premiumContent = {
  /**
   * Mark content as premium
   */
  async setPremium(
    contentId: string,
    options: Omit<PremiumContent, "contentId">
  ): Promise<PremiumContent> {
    const premium: PremiumContent = {
      contentId,
      ...options,
    };
    premiumContentStore.set(contentId, premium);
    return premium;
  },

  /**
   * Check if content is premium
   */
  async isPremium(contentId: string): Promise<PremiumContent | null> {
    return premiumContentStore.get(contentId) || null;
  },

  /**
   * Check if user has access to premium content
   */
  async hasAccess(userId: string, contentId: string): Promise<boolean> {
    const premium = premiumContentStore.get(contentId);
    if (!premium || !premium.isPremium) return true;

    // Check for purchase
    const purchases = [...purchaseStore.values()].filter(
      p => p.userId === userId &&
           p.contentId === contentId &&
           p.status === "completed" &&
           (!p.expiresAt || p.expiresAt > new Date())
    );

    if (purchases.length > 0) return true;

    // Check for subscription (if applicable)
    // In production, check user's subscription status

    return false;
  },

  /**
   * Purchase content
   */
  async purchase(
    userId: string,
    contentId: string,
    paymentDetails: {
      paymentMethod: string;
      paymentId?: string;
    }
  ): Promise<ContentPurchase> {
    const premium = premiumContentStore.get(contentId);
    if (!premium) throw new Error("Content not found");

    const purchase: ContentPurchase = {
      id: `pur_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      userId,
      contentId,
      amount: premium.price,
      currency: premium.currency,
      paymentMethod: paymentDetails.paymentMethod,
      paymentId: paymentDetails.paymentId,
      status: "completed",
      createdAt: new Date(),
      expiresAt: premium.accessType === "subscription"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : undefined,
    };

    purchaseStore.set(purchase.id, purchase);
    return purchase;
  },

  /**
   * Get user's purchases
   */
  async getUserPurchases(userId: string): Promise<ContentPurchase[]> {
    return [...purchaseStore.values()]
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Get premium content preview
   */
  async getPreview(contentId: string): Promise<{
    content: any | null;
    isPremium: boolean;
    previewPercentage: number;
    price: number;
    currency: string;
  }> {
    const [content] = await db.select().from(contents).where(eq(contents.id, contentId));
    if (!content) return { content: null, isPremium: false, previewPercentage: 100, price: 0, currency: "USD" };

    const premium = premiumContentStore.get(contentId);

    if (!premium || !premium.isPremium) {
      return {
        content,
        isPremium: false,
        previewPercentage: 100,
        price: 0,
        currency: "USD",
      };
    }

    // Limit content blocks for preview
    const blocks = (content.blocks as any[]) || [];
    const previewBlocks = Math.ceil(blocks.length * (premium.previewPercentage / 100));

    return {
      content: {
        ...content,
        blocks: blocks.slice(0, previewBlocks),
        isPreview: true,
        totalBlocks: blocks.length,
        previewBlocks,
      },
      isPremium: true,
      previewPercentage: premium.previewPercentage,
      price: premium.price,
      currency: premium.currency,
    };
  },

  /**
   * Get premium content stats
   */
  async getStats(): Promise<{
    totalPremiumContent: number;
    totalRevenue: number;
    totalPurchases: number;
    topContent: Array<{ contentId: string; title: string; purchases: number; revenue: number }>;
  }> {
    const allPurchases = [...purchaseStore.values()].filter(p => p.status === "completed");
    const totalRevenue = allPurchases.reduce((sum, p) => sum + p.amount, 0);

    // Group by content
    const byContent: Record<string, { purchases: number; revenue: number }> = {};
    for (const p of allPurchases) {
      if (!byContent[p.contentId]) {
        byContent[p.contentId] = { purchases: 0, revenue: 0 };
      }
      byContent[p.contentId].purchases++;
      byContent[p.contentId].revenue += p.amount;
    }

    const topContent = await Promise.all(
      Object.entries(byContent)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .slice(0, 10)
        .map(async ([contentId, stats]) => {
          const [content] = await db.select({ title: contents.title })
            .from(contents)
            .where(eq(contents.id, contentId));
          return {
            contentId,
            title: content?.title || "Unknown",
            ...stats,
          };
        })
    );

    return {
      totalPremiumContent: premiumContentStore.size,
      totalRevenue,
      totalPurchases: allPurchases.length,
      topContent,
    };
  },
};

// ============================================================================
// BUSINESS LISTINGS
// ============================================================================

const businessTiers = {
  basic: {
    name: "Basic",
    monthlyPrice: 4900, // $49
    features: [
      "Business profile page",
      "Link to website",
      "Basic analytics",
    ],
  },
  premium: {
    name: "Premium",
    monthlyPrice: 14900, // $149
    features: [
      "Everything in Basic",
      "Featured placement in listings",
      "Lead capture form",
      "Contact info visibility",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    monthlyPrice: 49900, // $499
    features: [
      "Everything in Premium",
      "Booking widget integration",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "Monthly reports",
    ],
  },
};

export const businessListings = {
  /**
   * Create business listing
   */
  async create(
    data: Omit<BusinessListing, "id" | "impressions" | "clicks" | "leads" | "conversions" | "createdAt">
  ): Promise<BusinessListing> {
    const id = `biz_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const listing: BusinessListing = {
      ...data,
      id,
      impressions: 0,
      clicks: 0,
      leads: 0,
      conversions: 0,
      createdAt: new Date(),
    };

    businessStore.set(id, listing);
    return listing;
  },

  /**
   * Update listing
   */
  async update(id: string, updates: Partial<BusinessListing>): Promise<BusinessListing | null> {
    const listing = businessStore.get(id);
    if (!listing) return null;

    Object.assign(listing, updates);
    businessStore.set(id, listing);
    return listing;
  },

  /**
   * Get listing by ID
   */
  async get(id: string): Promise<BusinessListing | null> {
    return businessStore.get(id) || null;
  },

  /**
   * Get listings by content
   */
  async getByContent(contentId: string): Promise<BusinessListing[]> {
    return [...businessStore.values()].filter(
      l => l.contentIds.includes(contentId) && l.status === "active"
    );
  },

  /**
   * Track impression
   */
  async trackImpression(listingId: string): Promise<void> {
    const listing = businessStore.get(listingId);
    if (listing) {
      listing.impressions++;
      businessStore.set(listingId, listing);
    }
  },

  /**
   * Track click
   */
  async trackClick(listingId: string): Promise<void> {
    const listing = businessStore.get(listingId);
    if (listing) {
      listing.clicks++;
      businessStore.set(listingId, listing);
    }
  },

  /**
   * Get pricing tiers
   */
  getTiers(): typeof businessTiers {
    return businessTiers;
  },

  /**
   * Get listing analytics
   */
  async getAnalytics(listingId: string): Promise<{
    listing: BusinessListing | null;
    ctr: number;
    leadConversionRate: number;
    leads: Lead[];
    impressionsByDay: Array<{ date: string; count: number }>;
  } | null> {
    const listing = businessStore.get(listingId);
    if (!listing) return null;

    const leads = [...leadStore.values()]
      .filter(l => l.businessId === listingId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      listing,
      ctr: listing.impressions > 0 ? Math.round((listing.clicks / listing.impressions) * 100) : 0,
      leadConversionRate: listing.leads > 0 ? Math.round((listing.conversions / listing.leads) * 100) : 0,
      leads,
      impressionsByDay: [], // Would aggregate from event tracking
    };
  },

  /**
   * Get all active listings
   */
  async getActive(filters?: {
    businessType?: string;
    tier?: string;
  }): Promise<BusinessListing[]> {
    let result = [...businessStore.values()].filter(l => l.status === "active");

    if (filters?.businessType) {
      result = result.filter(l => l.businessType === filters.businessType);
    }
    if (filters?.tier) {
      result = result.filter(l => l.tier === filters.tier);
    }

    return result;
  },
};

// ============================================================================
// LEAD GENERATION
// ============================================================================

export const leadGeneration = {
  /**
   * Submit lead
   */
  async submit(
    data: Omit<Lead, "id" | "status" | "createdAt">
  ): Promise<Lead> {
    const id = `lead_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const lead: Lead = {
      ...data,
      id,
      status: "new",
      createdAt: new Date(),
    };

    leadStore.set(id, lead);

    // Update business lead count
    const listing = businessStore.get(data.businessId);
    if (listing) {
      listing.leads++;
      businessStore.set(data.businessId, listing);
    }

    // In production, send notification to business
    // await this.notifyBusiness(lead);

    return lead;
  },

  /**
   * Get leads for business
   */
  async getForBusiness(
    businessId: string,
    filters?: {
      status?: Lead["status"];
      type?: Lead["type"];
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Lead[]> {
    let result = [...leadStore.values()].filter(l => l.businessId === businessId);

    if (filters?.status) {
      result = result.filter(l => l.status === filters.status);
    }
    if (filters?.type) {
      result = result.filter(l => l.type === filters.type);
    }
    if (filters?.startDate) {
      result = result.filter(l => l.createdAt >= filters.startDate!);
    }
    if (filters?.endDate) {
      result = result.filter(l => l.createdAt <= filters.endDate!);
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Update lead status
   */
  async updateStatus(
    leadId: string,
    status: Lead["status"],
    notes?: string
  ): Promise<Lead | null> {
    const lead = leadStore.get(leadId);
    if (!lead) return null;

    const wasNew = lead.status === "new";
    lead.status = status;
    lead.notes = notes;
    lead.updatedAt = new Date();
    leadStore.set(leadId, lead);

    // Track conversion
    if (status === "converted" && wasNew) {
      const listing = businessStore.get(lead.businessId);
      if (listing) {
        listing.conversions++;
        businessStore.set(lead.businessId, listing);
      }
    }

    return lead;
  },

  /**
   * Get lead dashboard for business
   */
  async getDashboard(businessId: string): Promise<{
    summary: {
      total: number;
      new: number;
      contacted: number;
      qualified: number;
      converted: number;
      lost: number;
      conversionRate: number;
    };
    recentLeads: Lead[];
    byType: Record<string, number>;
    bySource: Record<string, number>;
    trend: Array<{ date: string; leads: number }>;
  }> {
    const leads = await this.getForBusiness(businessId);

    const byType: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const statusCounts: Record<string, number> = {
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
    };

    for (const lead of leads) {
      byType[lead.type] = (byType[lead.type] || 0) + 1;
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;
      statusCounts[lead.status]++;
    }

    const total = leads.length;
    const conversionRate = total > 0
      ? Math.round((statusCounts.converted / total) * 100)
      : 0;

    return {
      summary: {
        total,
        new: statusCounts.new,
        contacted: statusCounts.contacted,
        qualified: statusCounts.qualified,
        converted: statusCounts.converted,
        lost: statusCounts.lost,
        conversionRate,
      },
      recentLeads: leads.slice(0, 10),
      byType,
      bySource,
      trend: [], // Would aggregate by date
    };
  },

  /**
   * Export leads as CSV
   */
  async exportCsv(businessId: string): Promise<string> {
    const leads = await this.getForBusiness(businessId);

    const headers = ["Date", "Type", "Name", "Email", "Phone", "Message", "Status"];
    const rows = leads.map(l => [
      l.createdAt.toISOString(),
      l.type,
      l.name,
      l.email,
      l.phone || "",
      (l.message || "").replace(/"/g, '""'),
      l.status,
    ]);

    return [
      headers.join(","),
      ...rows.map(r => r.map(c => `"${c}"`).join(",")),
    ].join("\n");
  },
};

// ============================================================================
// REVENUE DASHBOARD
// ============================================================================

export const revenueDashboard = {
  /**
   * Get overall revenue stats
   */
  async getStats(): Promise<{
    totalRevenue: number;
    premiumContentRevenue: number;
    businessListingRevenue: number;
    affiliateRevenue: number;
    byMonth: Array<{ month: string; revenue: number }>;
    topSources: Array<{ source: string; revenue: number; percentage: number }>;
  }> {
    // Premium content revenue
    const purchases = [...purchaseStore.values()].filter(p => p.status === "completed");
    const premiumRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

    // Business listing revenue (monthly * active months)
    const listings = [...businessStore.values()].filter(l => l.status === "active");
    const listingRevenue = listings.reduce((sum, l) => sum + l.monthlyPrice, 0);

    // Affiliate revenue would come from affiliate tracking system
    const affiliateRevenue = 0;

    const totalRevenue = premiumRevenue + listingRevenue + affiliateRevenue;

    return {
      totalRevenue,
      premiumContentRevenue: premiumRevenue,
      businessListingRevenue: listingRevenue,
      affiliateRevenue,
      byMonth: [], // Would aggregate by month
      topSources: [
        { source: "Premium Content", revenue: premiumRevenue, percentage: totalRevenue > 0 ? Math.round((premiumRevenue / totalRevenue) * 100) : 0 },
        { source: "Business Listings", revenue: listingRevenue, percentage: totalRevenue > 0 ? Math.round((listingRevenue / totalRevenue) * 100) : 0 },
        { source: "Affiliates", revenue: affiliateRevenue, percentage: totalRevenue > 0 ? Math.round((affiliateRevenue / totalRevenue) * 100) : 0 },
      ],
    };
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const monetization = {
  premium: premiumContent,
  listings: businessListings,
  leads: leadGeneration,
  revenue: revenueDashboard,
};

export default monetization;
