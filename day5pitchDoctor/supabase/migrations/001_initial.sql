-- Pitch analyses table (persisted for authenticated users)
CREATE TABLE pitch_analyses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_pitch        TEXT NOT NULL CHECK (char_length(original_pitch) >= 10
                          AND char_length(original_pitch) <= 500),
  score                 INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  verdict               TEXT NOT NULL,
  critique              TEXT NOT NULL,
  dimension_scores      JSONB NOT NULL,
  improvements          JSONB NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user history queries
CREATE INDEX pitch_analyses_user_created_idx
  ON pitch_analyses (user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- Rate limit tracking for anonymous users (by IP hash)
CREATE TABLE rate_limit_anonymous (
  ip_hash     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX rate_limit_anonymous_ip_created_idx
  ON rate_limit_anonymous (ip_hash, created_at);

-- Rate limit tracking for authenticated users
CREATE TABLE rate_limit_users (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX rate_limit_users_user_created_idx
  ON rate_limit_users (user_id, created_at);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE pitch_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_anonymous ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_users ENABLE ROW LEVEL SECURITY;

-- Authenticated users: own analyses only
CREATE POLICY "analyses_select_own" ON pitch_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "analyses_insert_own" ON pitch_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "analyses_delete_own" ON pitch_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Rate limit tables: service role only (no user-facing RLS policies)
-- These tables are read/written via SUPABASE_SERVICE_ROLE_KEY in the route handler.
