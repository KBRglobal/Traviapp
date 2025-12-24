/**
 * Seed AI Writers
 * 
 * Populates the database with the 10 AI writers
 */

import { db } from "../server/db";
import { aiWriters } from "@shared/schema";
import { AI_WRITERS } from "../server/ai/writers/writer-registry";
import { eq } from "drizzle-orm";

async function seedWriters() {
  console.log("🌱 Seeding AI Writers...");

  try {
    for (const writer of AI_WRITERS) {
      // Check if writer already exists
      const existing = await db
        .select()
        .from(aiWriters)
        .where(eq(aiWriters.id, writer.id))
        .limit(1);

      if (existing.length > 0) {
        console.log(`  ⏭️  Skipping ${writer.name} (already exists)`);
        continue;
      }

      // Insert writer
      await db.insert(aiWriters).values({
        id: writer.id,
        name: writer.name,
        slug: writer.slug,
        avatar: writer.avatar,
        nationality: writer.nationality,
        age: writer.age,
        expertise: writer.expertise,
        personality: writer.personality,
        writingStyle: writer.writingStyle,
        voiceCharacteristics: writer.voiceCharacteristics,
        samplePhrases: writer.samplePhrases,
        bio: writer.bio,
        shortBio: writer.shortBio,
        socialMedia: writer.socialMedia || null,
        contentTypes: writer.contentTypes,
        languages: writer.languages,
        isActive: writer.isActive,
        articleCount: writer.articleCount,
      });

      console.log(`  ✅ Added ${writer.name}`);
    }

    console.log("\n✨ Seeding completed successfully!");
    console.log(`📊 Total writers: ${AI_WRITERS.length}`);
  } catch (error) {
    console.error("❌ Error seeding writers:", error);
    throw error;
  }
}

// Run the seed function
seedWriters()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed:", error);
    process.exit(1);
  });
