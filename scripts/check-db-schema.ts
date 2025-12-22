import { db } from "../server/db";
import { sql } from "drizzle-orm";

async function checkSchema() {
  const tables = [
    'ai_generated_images',
    'topic_clusters',
    'topic_cluster_items',
    'telegram_user_profiles',
    'telegram_conversations'
  ];

  for (const table of tables) {
    console.log(`\n=== ${table} ===`);
    try {
      const result = await db.execute(sql.raw(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = '${table}'
        ORDER BY ordinal_position
      `));
      console.log(JSON.stringify(result.rows, null, 2));
    } catch (e: any) {
      console.log(`Table doesn't exist or error: ${e.message}`);
    }
  }
  process.exit(0);
}

checkSchema();
