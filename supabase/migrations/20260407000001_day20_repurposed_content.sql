-- Day 20: ContentRepurposingPipeline
-- Additive migration — shared Supabase project

CREATE TABLE IF NOT EXISTS repurposed_content (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input
  source_text       TEXT NOT NULL,
  word_count        INTEGER NOT NULL,
  had_voice_calibration BOOLEAN DEFAULT FALSE,

  -- Generated outputs (frozen field names — Day 30 reads x_thread + standalone_tweets)
  outputs           JSONB NOT NULL,

  -- Performance
  generation_ms     INTEGER,
  ai_model_used     TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repurposed_user
  ON repurposed_content(user_id, created_at DESC);

ALTER TABLE repurposed_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own content"
  ON repurposed_content FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own content"
  ON repurposed_content FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own content"
  ON repurposed_content FOR DELETE USING (auth.uid() = user_id);
