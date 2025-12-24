-- Search Engine Tables and Indexes
-- Phase 1: Foundation for TRAVI Search Engine

-- Enable PostgreSQL extensions for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search_index table
CREATE TABLE IF NOT EXISTS "search_index" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "content_id" VARCHAR NOT NULL REFERENCES "contents"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "title_vector" TEXT,
  "content" TEXT,
  "content_vector" TEXT,
  "meta_description" TEXT,
  "locations" TEXT[],
  "prices" TEXT[],
  "categories" TEXT[],
  "content_type" TEXT NOT NULL,
  "locale" VARCHAR(5) DEFAULT 'en',
  "popularity" INTEGER DEFAULT 0,
  "quality" INTEGER DEFAULT 50,
  "freshness" TIMESTAMP,
  "search_terms" TEXT[],
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Create search_suggestions table
CREATE TABLE IF NOT EXISTS "search_suggestions" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "term" TEXT NOT NULL UNIQUE,
  "display_text" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "target_url" TEXT,
  "target_id" VARCHAR,
  "icon" TEXT,
  "weight" INTEGER DEFAULT 0,
  "search_count" INTEGER DEFAULT 0,
  "locale" VARCHAR(5) DEFAULT 'en',
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create search_sessions table
CREATE TABLE IF NOT EXISTS "search_sessions" (
  "id" VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" VARCHAR,
  "user_id" VARCHAR,
  "query" TEXT NOT NULL,
  "normalized_query" TEXT,
  "locale" VARCHAR(5),
  "results_count" INTEGER DEFAULT 0,
  "clicked_results" TEXT[],
  "filters" JSONB,
  "response_time_ms" INTEGER,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Create GIN indexes for full-text search on search_index
-- Note: These indexes use the pre-computed tsvector columns for performance
-- The tsvector columns should be populated by the application during indexing
CREATE INDEX IF NOT EXISTS "IDX_search_index_title_vector" 
  ON "search_index" USING GIN (to_tsvector('english', "title"));

CREATE INDEX IF NOT EXISTS "IDX_search_index_content_vector" 
  ON "search_index" USING GIN (to_tsvector('english', COALESCE("content", '')));

-- Create trigram index for fuzzy matching on title
CREATE INDEX IF NOT EXISTS "IDX_search_index_title_trigram" 
  ON "search_index" USING GIN ("title" gin_trgm_ops);

-- Create standard indexes on search_index
CREATE INDEX IF NOT EXISTS "IDX_search_index_content_id" ON "search_index"("content_id");
CREATE INDEX IF NOT EXISTS "IDX_search_index_type" ON "search_index"("content_type");
CREATE INDEX IF NOT EXISTS "IDX_search_index_locale" ON "search_index"("locale");
CREATE INDEX IF NOT EXISTS "IDX_search_index_popularity" ON "search_index"("popularity");
CREATE INDEX IF NOT EXISTS "IDX_search_index_freshness" ON "search_index"("freshness");

-- Create trigram index for autocomplete on search_suggestions
CREATE INDEX IF NOT EXISTS "IDX_search_suggestions_term_trigram" 
  ON "search_suggestions" USING GIN ("term" gin_trgm_ops);

-- Create standard indexes on search_suggestions
CREATE INDEX IF NOT EXISTS "IDX_search_suggestions_term" ON "search_suggestions"("term");
CREATE INDEX IF NOT EXISTS "IDX_search_suggestions_type" ON "search_suggestions"("type");
CREATE INDEX IF NOT EXISTS "IDX_search_suggestions_locale" ON "search_suggestions"("locale");
CREATE INDEX IF NOT EXISTS "IDX_search_suggestions_weight" ON "search_suggestions"("weight");

-- Create indexes on search_sessions for analytics
CREATE INDEX IF NOT EXISTS "IDX_search_sessions_query" ON "search_sessions"("query");
CREATE INDEX IF NOT EXISTS "IDX_search_sessions_session_id" ON "search_sessions"("session_id");
CREATE INDEX IF NOT EXISTS "IDX_search_sessions_user_id" ON "search_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "IDX_search_sessions_created" ON "search_sessions"("created_at");
CREATE INDEX IF NOT EXISTS "IDX_search_sessions_locale" ON "search_sessions"("locale");
