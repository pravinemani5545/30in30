-- Day 11: OutreachGrader — email_grades is the canonical outreach quality table for Day 29
-- ADDITIVE ONLY — do not modify tables from prior days

CREATE TABLE email_grades (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input
  original_email        TEXT NOT NULL,
  email_word_count      INTEGER NOT NULL,

  -- Total score
  overall_score         SMALLINT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  gate_passed           BOOLEAN NOT NULL,

  -- Dimension scores (each 0-25)
  personalization_score SMALLINT NOT NULL CHECK (personalization_score BETWEEN 0 AND 25),
  spam_score            SMALLINT NOT NULL CHECK (spam_score BETWEEN 0 AND 25),
  cta_score             SMALLINT NOT NULL CHECK (cta_score BETWEEN 0 AND 25),
  reading_score         SMALLINT NOT NULL CHECK (reading_score BETWEEN 0 AND 25),

  -- Findings per dimension
  personalization_finding TEXT NOT NULL,
  spam_finding            TEXT NOT NULL,
  cta_finding             TEXT NOT NULL,
  reading_finding         TEXT NOT NULL,

  -- Spam words found (for Day 29 content filtering)
  spam_words_found      TEXT[] NOT NULL DEFAULT '{}',

  -- Rewrite
  rewrite_email         TEXT,
  rewrite_projected_score SMALLINT,
  rewrite_explanation   TEXT,

  -- Performance
  grade_ms              INTEGER,
  rewrite_ms            INTEGER,
  ai_model_used         TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_grades_user
  ON email_grades(user_id, created_at DESC);
CREATE INDEX idx_email_grades_score
  ON email_grades(user_id, overall_score);

ALTER TABLE email_grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own grades"
  ON email_grades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own grades"
  ON email_grades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own grades"
  ON email_grades FOR DELETE USING (auth.uid() = user_id);

-- No UPDATE policy — grades are immutable once created.
-- Re-grade to get a new score. History is truth.
