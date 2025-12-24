/**
 * Commission Calculator
 * 
 * Calculates commissions based on clicks and conversions
 * Supports percentage and fixed commission types
 * Handles tiered commission rates
 */

import { db } from '../db';
import { partners, affiliateLinks } from '@shared/schema';
import { eq, gte, lte, and } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface CommissionCalculation {
  partnerId: string;
  totalClicks: number;
  totalConversions: number;
  baseCommission: number; // in cents
  bonusCommission: number; // in cents
  totalCommission: number; // in cents
  commissionRate: number;
  tier?: string;
}

export interface CommissionSummary {
  period: string;
  partners: CommissionCalculation[];
  totalCommission: number;
}

// ============================================================================
// COMMISSION CALCULATION
// ============================================================================

/**
 * Calculate commission for a partner
 */
export async function calculatePartnerCommission(
  partnerId: string,
  startDate: Date,
  endDate: Date
): Promise<CommissionCalculation | null> {
  try {
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1);

    if (!partner) return null;

    // Get clicks and conversions for the period
    const links = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.partnerId, partnerId));

    const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
    const totalConversions = links.reduce((sum, link) => sum + (link.conversionCount || 0), 0);

    // Calculate commission based on type
    let baseCommission = 0;
    let commissionRate = partner.commissionRate;

    if (partner.commissionType === 'percentage') {
      // Percentage of total value (assuming $10 per conversion as default)
      const averageValue = 1000; // $10 in cents
      baseCommission = Math.round((totalConversions * averageValue * partner.commissionRate) / 10000);
    } else {
      // Fixed amount per conversion
      baseCommission = totalConversions * partner.commissionRate;
    }

    // Check for tiered rates
    let bonusCommission = 0;
    let tier = 'base';

    if (partner.tieredRates && Array.isArray(partner.tieredRates)) {
      const tieredRates = partner.tieredRates as Array<{ minClicks: number; rate: number }>;
      
      for (const tierRate of tieredRates.sort((a, b) => b.minClicks - a.minClicks)) {
        if (totalClicks >= tierRate.minClicks) {
          commissionRate = tierRate.rate;
          tier = `${tierRate.minClicks}+ clicks`;
          
          // Calculate bonus for reaching tier
          const tierBonus = Math.round(baseCommission * 0.1); // 10% bonus
          bonusCommission = tierBonus;
          break;
        }
      }
    }

    const totalCommission = baseCommission + bonusCommission;

    return {
      partnerId,
      totalClicks,
      totalConversions,
      baseCommission,
      bonusCommission,
      totalCommission,
      commissionRate,
      tier,
    };
  } catch (error) {
    console.error('[Commission Calculator] Error:', error);
    return null;
  }
}

/**
 * Calculate commissions for all partners
 */
export async function calculateAllCommissions(
  startDate: Date,
  endDate: Date
): Promise<CommissionSummary> {
  try {
    const allPartners = await db
      .select()
      .from(partners)
      .where(eq(partners.status, 'active'));

    const calculations: CommissionCalculation[] = [];

    for (const partner of allPartners) {
      const calculation = await calculatePartnerCommission(partner.id, startDate, endDate);
      if (calculation) {
        calculations.push(calculation);
      }
    }

    const totalCommission = calculations.reduce(
      (sum, calc) => sum + calc.totalCommission,
      0
    );

    return {
      period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
      partners: calculations,
      totalCommission,
    };
  } catch (error) {
    console.error('[Commission Calculator] Error:', error);
    return {
      period: '',
      partners: [],
      totalCommission: 0,
    };
  }
}

/**
 * Update partner totals
 */
export async function updatePartnerTotals(partnerId: string): Promise<void> {
  try {
    const links = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.partnerId, partnerId));

    const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
    const totalConversions = links.reduce((sum, link) => sum + (link.conversionCount || 0), 0);

    // Calculate earnings
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.id, partnerId))
      .limit(1);

    if (!partner) return;

    let totalEarnings = 0;
    if (partner.commissionType === 'percentage') {
      const averageValue = 1000; // $10 in cents
      totalEarnings = Math.round((totalConversions * averageValue * partner.commissionRate) / 10000);
    } else {
      totalEarnings = totalConversions * partner.commissionRate;
    }

    await db
      .update(partners)
      .set({
        totalClicks,
        totalConversions,
        totalEarnings,
        pendingPayout: totalEarnings, // Simplified - actual implementation would subtract paid amounts
        updatedAt: new Date(),
      })
      .where(eq(partners.id, partnerId));
  } catch (error) {
    console.error('[Commission Calculator] Error updating totals:', error);
  }
}
