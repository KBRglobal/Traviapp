/**
 * A/B Testing for CTAs
 * 
 * Create and manage A/B tests for call-to-action buttons
 */

import { db } from '../db';
import { abTests, abTestVariants, abTestEvents, insertAbTestSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function createABTest(data: any) {
  const validated = insertAbTestSchema.parse(data);
  const [test] = await db.insert(abTests).values(validated).returning();
  return test;
}

export async function createVariant(testId: string, variantData: any) {
  const [variant] = await db.insert(abTestVariants).values({ testId, ...variantData }).returning();
  return variant;
}

export async function recordEvent(testId: string, variantId: string, eventType: string, metadata?: any) {
  await db.insert(abTestEvents).values({ testId, variantId, eventType, metadata });
  
  // Update variant stats
  const [variant] = await db.select().from(abTestVariants).where(eq(abTestVariants.id, variantId)).limit(1);
  if (variant) {
    const updates: any = {};
    if (eventType === 'impression') updates.impressions = (variant.impressions || 0) + 1;
    if (eventType === 'click') updates.clicks = (variant.clicks || 0) + 1;
    if (eventType === 'conversion') updates.conversions = (variant.conversions || 0) + 1;
    
    await db.update(abTestVariants).set(updates).where(eq(abTestVariants.id, variantId));
  }
}

export async function getTestResults(testId: string) {
  const variants = await db.select().from(abTestVariants).where(eq(abTestVariants.testId, testId));
  
  const results = variants.map(v => ({
    id: v.id,
    name: v.name,
    impressions: v.impressions || 0,
    clicks: v.clicks || 0,
    conversions: v.conversions || 0,
    ctr: v.impressions ? ((v.clicks || 0) / v.impressions) * 100 : 0,
    conversionRate: v.clicks ? ((v.conversions || 0) / v.clicks) * 100 : 0,
  }));
  
  // Determine winner
  const winner = results.sort((a, b) => b.conversionRate - a.conversionRate)[0];
  
  return { variants: results, winner };
}
