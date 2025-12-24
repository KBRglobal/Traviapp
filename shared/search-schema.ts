import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { contents } from "./schema";

/**
 * Search Index Table
 * 
 * Stores denormalized content data optimized for fast full-text search.
 * Uses PostgreSQL tsvector for full-text search capabilities.
 */
export const searchIndex = pgTable("search_index", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").notNull().references(() => contents.id, { onDelete: "cascade" }),
  
  // Searchable fields (denormalized for speed)
  title: text("title").notNull(),
  titleVector: text("title_vector"), // tsvector stored as text for Drizzle compatibility
  
  content: text("content"), // Plain text extracted from blocks
  contentVector: text("content_vector"), // tsvector stored as text
  
  metaDescription: text("meta_description"),
  
  // Extracted entities for filtering
  locations: text("locations").array(), // ["Dubai Marina", "Palm Jumeirah"]
  prices: text("prices").array(), // ["AED 150", "AED 500"]
  categories: text("categories").array(), // ["luxury", "family-friendly"]
  
  // Ranking signals
  contentType: text("content_type").notNull(), // hotel, attraction, article, etc.
  locale: varchar("locale", { length: 5 }).default("en"),
  popularity: integer("popularity").default(0), // view count
  quality: integer("quality").default(50), // 0-100 score based on completeness
  freshness: timestamp("freshness"), // last updated timestamp for relevancy
  
  // Autocomplete terms (pre-generated)
  searchTerms: text("search_terms").array(), // ["burj khalifa", "khalifa tower", "tallest building"]
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_search_index_content_id").on(table.contentId),
  index("IDX_search_index_type").on(table.contentType),
  index("IDX_search_index_locale").on(table.locale),
  index("IDX_search_index_popularity").on(table.popularity),
  index("IDX_search_index_freshness").on(table.freshness),
]);

export const insertSearchIndexSchema = createInsertSchema(searchIndex).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SearchIndex = typeof searchIndex.$inferSelect;
export type InsertSearchIndex = z.infer<typeof insertSearchIndexSchema>;

/**
 * Search Suggestions Table
 * 
 * Pre-computed autocomplete suggestions for ultra-fast responses.
 * Optimized with trigram indexes for prefix matching.
 */
export const searchSuggestions = pgTable("search_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  term: text("term").notNull().unique(), // searchable term (lowercase)
  displayText: text("display_text").notNull(), // how to display the term
  type: text("type").notNull(), // "content" | "category" | "location" | "trending"
  targetUrl: text("target_url"), // where to navigate on selection
  targetId: varchar("target_id"), // content ID if applicable
  icon: text("icon"), // emoji or icon name for display
  weight: integer("weight").default(0), // for ranking suggestions
  searchCount: integer("search_count").default(0), // popularity metric
  locale: varchar("locale", { length: 5 }).default("en"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_search_suggestions_term").on(table.term),
  index("IDX_search_suggestions_type").on(table.type),
  index("IDX_search_suggestions_locale").on(table.locale),
  index("IDX_search_suggestions_weight").on(table.weight),
]);

export const insertSearchSuggestionSchema = createInsertSchema(searchSuggestions).omit({
  id: true,
  createdAt: true,
});

export type SearchSuggestion = typeof searchSuggestions.$inferSelect;
export type InsertSearchSuggestion = z.infer<typeof insertSearchSuggestionSchema>;

/**
 * Search Sessions Table
 * 
 * Tracks search queries and user interactions for analytics and personalization.
 * Extends the existing searchQueries concept with more detailed tracking.
 */
export const searchSessions = pgTable("search_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id"), // browser session ID
  userId: varchar("user_id"), // authenticated user ID if available
  query: text("query").notNull(), // original query string
  normalizedQuery: text("normalized_query"), // processed/normalized query
  locale: varchar("locale", { length: 5 }),
  resultsCount: integer("results_count").default(0),
  clickedResults: text("clicked_results").array(), // content IDs that were clicked
  filters: jsonb("filters").$type<{
    type?: string[];
    location?: string;
    priceRange?: { min?: number; max?: number };
  }>(),
  responseTimeMs: integer("response_time_ms"), // performance tracking
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_search_sessions_query").on(table.query),
  index("IDX_search_sessions_session_id").on(table.sessionId),
  index("IDX_search_sessions_user_id").on(table.userId),
  index("IDX_search_sessions_created").on(table.createdAt),
  index("IDX_search_sessions_locale").on(table.locale),
]);

export const insertSearchSessionSchema = createInsertSchema(searchSessions).omit({
  id: true,
  createdAt: true,
});

export type SearchSession = typeof searchSessions.$inferSelect;
export type InsertSearchSession = z.infer<typeof insertSearchSessionSchema>;
