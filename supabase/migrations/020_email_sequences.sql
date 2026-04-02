-- Day 15: EmailSequenceWriter
CREATE TABLE IF NOT EXISTS email_sequences (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Inputs
  persona              TEXT NOT NULL,
  value_proposition    TEXT NOT NULL,
  social_proof         TEXT NOT NULL,
  observation          TEXT,

  -- Generated sequence (array of 5 email objects — frozen schema for Day 29)
  emails               JSONB NOT NULL,

  -- Metadata
  sequence_summary     TEXT,
  pivot_angle          TEXT,

  -- SDR Platform integration
  used_in_campaign     BOOLEAN DEFAULT FALSE,
  campaign_id          UUID,

  -- Quality flags
  has_followup_warning BOOLEAN DEFAULT FALSE,

  -- Performance
  generation_ms        INTEGER,
  ai_model_used        TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_sequences_user
  ON email_sequences(user_id, created_at DESC);

ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own sequences"
  ON email_sequences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sequences"
  ON email_sequences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own sequences"
  ON email_sequences FOR DELETE USING (auth.uid() = user_id);
