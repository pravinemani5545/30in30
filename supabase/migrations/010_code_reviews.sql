-- Day 10: AICodeReviewer
-- Additive migration — does not touch existing tables

-- Severity and category enums (prefixed to avoid collision)
DO $$ BEGIN
  CREATE TYPE finding_severity AS ENUM ('critical','high','medium','low');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE finding_category AS ENUM ('bug','security','performance','style');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('pending','reviewing','complete','failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS code_reviews (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_snippet       TEXT NOT NULL,
  detected_language  TEXT NOT NULL,
  confirmed_language TEXT,
  status             review_status NOT NULL DEFAULT 'pending',
  critical_count     SMALLINT DEFAULT 0,
  high_count         SMALLINT DEFAULT 0,
  medium_count       SMALLINT DEFAULT 0,
  low_count          SMALLINT DEFAULT 0,
  total_lines        INTEGER,
  summary            TEXT,
  findings           JSONB NOT NULL DEFAULT '[]',
  ai_model_used      TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  review_ms          INTEGER,
  error_message      TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON code_reviews(user_id, created_at DESC);

ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;

-- RLS: users can only see/insert/delete their own reviews. No UPDATE policy.
DO $$ BEGIN
  CREATE POLICY "Users select own reviews" ON code_reviews
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users insert own reviews" ON code_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own reviews" ON code_reviews
    FOR DELETE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
