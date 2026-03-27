-- Day 9: MeetingPrep — research cache + briefings tables

DO $$ BEGIN
  CREATE TYPE briefing_status AS ENUM
    ('queued', 'searching', 'synthesising', 'complete', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE confidence_level AS ENUM ('verified', 'likely', 'uncertain');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- RESEARCH_CACHE: shared across users, keyed by SHA-256 hash
CREATE TABLE research_cache (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key     TEXT NOT NULL UNIQUE,
  person_name   TEXT NOT NULL,
  company_name  TEXT NOT NULL,
  raw_results   JSONB NOT NULL,
  query_count   INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE INDEX idx_cache_key ON research_cache(cache_key);
CREATE INDEX idx_cache_expires ON research_cache(expires_at);

-- BRIEFINGS: user-scoped pre-call intelligence
CREATE TABLE briefings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input
  person_name             TEXT NOT NULL,
  company_name            TEXT NOT NULL,
  meeting_context         TEXT NOT NULL,

  -- Cache metadata
  cache_key               TEXT NOT NULL,
  was_cached              BOOLEAN NOT NULL DEFAULT FALSE,
  cache_hit_at            TIMESTAMPTZ,

  -- Research output
  background              TEXT,
  background_confidence   confidence_level,
  company_context         TEXT,
  company_confidence      confidence_level,
  talking_points          JSONB,
  objections              JSONB,
  conversation_starters   JSONB,
  sources                 JSONB,

  -- Status (Realtime progress)
  status                  briefing_status NOT NULL DEFAULT 'queued',
  search_1_done           BOOLEAN DEFAULT FALSE,
  search_2_done           BOOLEAN DEFAULT FALSE,
  search_3_done           BOOLEAN DEFAULT FALSE,
  synthesis_done          BOOLEAN DEFAULT FALSE,
  error_message           TEXT,

  -- Performance + quality
  search_ms               INTEGER,
  synthesis_ms            INTEGER,
  data_quality            TEXT,
  data_quality_note       TEXT,

  -- Series connection (Day 29)
  booking_id              TEXT,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_briefings_user ON briefings(user_id, created_at DESC);
CREATE INDEX idx_briefings_subject ON briefings(user_id, person_name, company_name);

CREATE OR REPLACE FUNCTION update_briefings_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER briefings_updated_at
  BEFORE UPDATE ON briefings
  FOR EACH ROW EXECUTE FUNCTION update_briefings_updated_at();

-- RLS
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own briefings"
  ON briefings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own briefings"
  ON briefings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own briefings"
  ON briefings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own briefings"
  ON briefings FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users read cache"
  ON research_cache FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users write cache"
  ON research_cache FOR INSERT TO authenticated WITH CHECK (true);

-- Enable Realtime for briefings (status updates)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE briefings;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
