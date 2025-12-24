-- Add writer reference to contents table
ALTER TABLE contents ADD COLUMN IF NOT EXISTS writer_id VARCHAR REFERENCES ai_writers(id);
ALTER TABLE contents ADD COLUMN IF NOT EXISTS generated_by_ai BOOLEAN DEFAULT false;
ALTER TABLE contents ADD COLUMN IF NOT EXISTS writer_voice_score INTEGER;

-- Create index for faster queries by writer
CREATE INDEX IF NOT EXISTS idx_contents_writer_id ON contents(writer_id);

-- Comment explaining the change
COMMENT ON COLUMN contents.writer_id IS 'Reference to AI writer who created this content. Part of new AI Writers system.';
COMMENT ON COLUMN contents.generated_by_ai IS 'Flag indicating if content was AI-generated using the new AI Writers system';
COMMENT ON COLUMN contents.writer_voice_score IS 'Voice consistency score (0-100) for AI-generated content';
