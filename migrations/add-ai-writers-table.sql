-- Add AI Writers table for virtual newsroom system
CREATE TABLE IF NOT EXISTS ai_writers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  expertise VARCHAR NOT NULL,
  personality TEXT NOT NULL,
  writing_style TEXT NOT NULL,
  voice_prompt TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  total_articles INTEGER DEFAULT 0,
  avg_voice_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_writers_expertise ON ai_writers(expertise);
CREATE INDEX IF NOT EXISTS idx_ai_writers_active ON ai_writers(is_active);

-- Add comments
COMMENT ON TABLE ai_writers IS 'Virtual newsroom AI writers with distinct personalities and expertise areas';
COMMENT ON COLUMN ai_writers.expertise IS 'Writer specialty area (e.g., luxury_travel, budget_tips, adventure)';
COMMENT ON COLUMN ai_writers.voice_prompt IS 'System prompt that defines this writer''s unique voice and style';
COMMENT ON COLUMN ai_writers.avg_voice_score IS 'Average voice consistency score (0-100) across all articles';
