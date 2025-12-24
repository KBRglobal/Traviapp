/**
 * Partner Dashboard
 * 
 * Partner registration, management, and performance metrics
 */

import { db } from '../db';
import { partners, affiliateLinks, insertPartnerSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function createPartner(data: any) {
  const validated = insertPartnerSchema.parse(data);
  const [partner] = await db.insert(partners).values(validated).returning();
  return partner;
}

export async function getPartner(partnerId: string) {
  const [partner] = await db.select().from(partners).where(eq(partners.id, partnerId)).limit(1);
  return partner;
}

export async function getPartnerPerformance(partnerId: string) {
  const links = await db.select().from(affiliateLinks).where(eq(affiliateLinks.partnerId, partnerId));
  
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  const totalConversions = links.reduce((sum, link) => sum + (link.conversionCount || 0), 0);
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  return {
    totalLinks: links.length,
    totalClicks,
    totalConversions,
    conversionRate: Math.round(conversionRate * 100) / 100,
    topLinks: links.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0)).slice(0, 5),
  };
}
