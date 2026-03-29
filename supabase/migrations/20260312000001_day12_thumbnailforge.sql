-- Day 12: ThumbnailForge — thumbnail concept generation via Galloway's framework

CREATE TYPE thumbnail_tone AS ENUM
  ('inspiring','shocking','educational','entertaining','controversial','authentic');

CREATE TYPE thumbnail_driver AS ENUM
  ('curiosity_gap','pattern_interrupt','emotion_signal');

CREATE TABLE thumbnail_concepts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input (what the user provided)
  video_title         TEXT NOT NULL,
  niche               TEXT NOT NULL,
  tone                thumbnail_tone NOT NULL,

  -- Framework output
  predicted_winner    thumbnail_driver NOT NULL,
  ab_hypothesis       TEXT NOT NULL,

  -- Three concepts stored as JSONB array (canonical format for Month 4 SaaS)
  concepts            JSONB NOT NULL,

  -- Performance
  generation_ms       INTEGER,
  ai_model_used       TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_thumbnail_concepts_user
  ON thumbnail_concepts(user_id, created_at DESC);

ALTER TABLE thumbnail_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own concepts"
  ON thumbnail_concepts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own concepts"
  ON thumbnail_concepts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own concepts"
  ON thumbnail_concepts FOR DELETE USING (auth.uid() = user_id);

-- No UPDATE policy — concepts are immutable once generated.
