CREATE TYPE extraction_quality AS ENUM ('rich', 'partial', 'minimal');
CREATE TYPE render_method AS ENUM ('js_rendered', 'static_only');
DO $$ BEGIN CREATE TYPE confidence_level AS ENUM ('high', 'mid', 'low'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE TYPE weakness_severity AS ENUM ('high', 'medium', 'low');
CREATE TYPE analysis_status AS ENUM ('pending','scraping','analysing','complete','failed');

-- Shared URL cache (24h TTL, all users benefit from prior scrapes)
CREATE TABLE url_cache (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url                 TEXT NOT NULL UNIQUE,
  normalized_url      TEXT NOT NULL,
  domain              TEXT NOT NULL,
  og_title            TEXT,
  og_description      TEXT,
  cleaned_text        TEXT,
  word_count          INTEGER,
  extraction_quality  extraction_quality NOT NULL,
  render_method       render_method NOT NULL,
  cached_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Canonical prospect intelligence format (feeds Day 29 SDR Platform)
CREATE TABLE competitor_analyses (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url                 TEXT NOT NULL,
  domain              TEXT NOT NULL,
  favicon_url         TEXT,
  og_title            TEXT,
  extraction_quality  extraction_quality,
  render_method       render_method,
  word_count          INTEGER,
  -- Claude output: five keys
  value_proposition   TEXT,
  vp_confidence       confidence_level,
  vp_evidence         TEXT,
  target_icp          TEXT,
  icp_confidence      confidence_level,
  icp_signals         TEXT[],
  pricing_model       TEXT,
  pricing_confidence  confidence_level,
  pricing_signals     TEXT[],
  gtm_motion          TEXT,
  gtm_confidence      confidence_level,
  gtm_signals         TEXT[],
  weaknesses          JSONB NOT NULL DEFAULT '[]',
  analysis_notes      TEXT,
  status              analysis_status NOT NULL DEFAULT 'pending',
  error_message       TEXT,
  generation_ms       INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_competitor_analyses_user
  ON competitor_analyses(user_id, created_at DESC);
CREATE INDEX idx_competitor_analyses_domain
  ON competitor_analyses(user_id, domain);
CREATE INDEX idx_url_cache_url ON url_cache(normalized_url);
CREATE INDEX idx_url_cache_expires ON url_cache(expires_at);

ALTER TABLE competitor_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_cache ENABLE ROW LEVEL SECURITY;

-- url_cache: read by all authenticated, written only via service role
CREATE POLICY "Authenticated read url cache"
  ON url_cache FOR SELECT TO authenticated USING (true);

-- competitor_analyses: user-scoped
CREATE POLICY "Users select own analyses"
  ON competitor_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own analyses"
  ON competitor_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own analyses"
  ON competitor_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own analyses"
  ON competitor_analyses FOR DELETE USING (auth.uid() = user_id);
