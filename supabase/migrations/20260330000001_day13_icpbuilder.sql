-- Day 13: ICPBuilder — ICP profiles from ten-question interview
CREATE TABLE icp_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User-provided
  company_name          TEXT NOT NULL,

  -- Interview answers (10 questions — stored as JSONB for SDR Platform access)
  interview_answers     JSONB NOT NULL,

  -- Synthesis output (canonical data contract for SDR Platform)
  firmographic_profile  JSONB NOT NULL,
  pain_point_hierarchy  JSONB NOT NULL,
  objection_map         JSONB NOT NULL,
  recommended_channels  JSONB NOT NULL,
  reality_check_text    TEXT NOT NULL,

  -- Performance
  synthesis_ms          INTEGER,
  reality_check_ms      INTEGER,
  ai_model_used         TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_icp_profiles_user
  ON icp_profiles(user_id, created_at DESC);

ALTER TABLE icp_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own profiles"
  ON icp_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profiles"
  ON icp_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own profiles"
  ON icp_profiles FOR DELETE USING (auth.uid() = user_id);

-- No UPDATE policy — profiles are immutable. Re-run interview for fresh profile.
