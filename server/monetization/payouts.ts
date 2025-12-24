/**
 * Payout Management
 * 
 * Track and manage partner payouts
 */

import { db } from '../db';
import { payouts, partners, insertPayoutSchema } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

export async function createPayout(data: any) {
  const validated = insertPayoutSchema.parse(data);
  const [payout] = await db.insert(payouts).values(validated).returning();
  
  // Update partner pending payout
  const [partner] = await db.select().from(partners).where(eq(partners.id, data.partnerId)).limit(1);
  if (partner) {
    await db
      .update(partners)
      .set({
        pendingPayout: Math.max(0, (partner.pendingPayout || 0) - data.amount),
        lastPayoutAt: new Date(),
      })
      .where(eq(partners.id, data.partnerId));
  }
  
  return payout;
}

export async function getPayouts(partnerId?: string) {
  if (partnerId) {
    return await db.select().from(payouts).where(eq(payouts.partnerId, partnerId));
  }
  return await db.select().from(payouts);
}
