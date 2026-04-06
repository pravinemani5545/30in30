-- Day 18: CompanyTracker — website change monitoring
-- Additive migration — shared Supabase project

CREATE TYPE change_type AS ENUM
  ('pricing','feature','hiring','messaging','other');

CREATE TABLE tracked_companies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url               TEXT NOT NULL,
  domain            TEXT NOT NULL,
  favicon_url       TEXT,
  current_hash      TEXT,
  last_checked_at   TIMESTAMPTZ,
  last_changed_at   TIMESTAMPTZ,
  is_active         BOOLEAN DEFAULT TRUE,
  fetch_error       TEXT,
  is_js_rendered    BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, url)
);

CREATE TABLE company_changes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        UUID NOT NULL REFERENCES tracked_companies(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url               TEXT NOT NULL,
  change_type       change_type NOT NULL,
  summary           TEXT NOT NULL,
  before_excerpt    TEXT,
  after_excerpt     TEXT,
  old_hash          TEXT NOT NULL,
  new_hash          TEXT NOT NULL,
  ai_sdr_notified   BOOLEAN DEFAULT FALSE,
  outreach_prompt   TEXT,
  ai_model_used     TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  detected_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cron_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at      TIMESTAMPTZ,
  urls_checked      INTEGER DEFAULT 0,
  changes_found     INTEGER DEFAULT 0,
  errors            INTEGER DEFAULT 0,
  digest_sent       BOOLEAN DEFAULT FALSE
);

-- Indexes
CREATE INDEX idx_tracked_companies_user ON tracked_companies(user_id);
CREATE INDEX idx_company_changes_user ON company_changes(user_id, detected_at DESC);
CREATE INDEX idx_company_changes_type ON company_changes(user_id, change_type);
CREATE INDEX idx_company_changes_sdr ON company_changes(user_id, ai_sdr_notified)
  WHERE ai_sdr_notified = FALSE;

-- RLS
ALTER TABLE tracked_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron_runs ENABLE ROW LEVEL SECURITY;

-- tracked_companies: full CRUD for user (UPDATE needed for hash + timestamps)
CREATE POLICY "Users select own companies"
  ON tracked_companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own companies"
  ON tracked_companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own companies"
  ON tracked_companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own companies"
  ON tracked_companies FOR DELETE USING (auth.uid() = user_id);

-- company_changes: immutable — INSERT + SELECT only
CREATE POLICY "Users select own changes"
  ON company_changes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own changes"
  ON company_changes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- cron_runs: service role manages these
CREATE POLICY "Service role manages cron runs"
  ON cron_runs FOR ALL USING (true);
