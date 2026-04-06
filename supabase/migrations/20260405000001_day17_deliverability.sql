-- Day 17: ColdEmailDeliverabilityTester
-- DNS-based deliverability grade with Gemini explanations

CREATE TABLE deliverability_checks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input
  domain            TEXT NOT NULL,

  -- Results (frozen field names — Day 29 SDR Platform reads these)
  overall_grade     TEXT NOT NULL,
  overall_score     SMALLINT NOT NULL,
  all_checks_passed BOOLEAN NOT NULL,

  -- Individual check results as JSONB
  spf_result        JSONB NOT NULL,
  dkim_result       JSONB NOT NULL,
  dmarc_result      JSONB NOT NULL,
  mx_result         JSONB NOT NULL,
  domain_age_result JSONB NOT NULL,

  -- DKIM details
  dkim_selector_found TEXT,

  -- Gemini explanations
  explanations      JSONB NOT NULL,

  -- Performance
  lookup_ms         INTEGER,
  ai_ms             INTEGER,
  ai_model_used     TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliverability_user
  ON deliverability_checks(user_id, created_at DESC);
CREATE INDEX idx_deliverability_domain
  ON deliverability_checks(domain, created_at DESC);

ALTER TABLE deliverability_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own checks"
  ON deliverability_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own checks"
  ON deliverability_checks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own checks"
  ON deliverability_checks FOR DELETE USING (auth.uid() = user_id);

-- No UPDATE policy — checks are immutable. Re-check for fresh results.
