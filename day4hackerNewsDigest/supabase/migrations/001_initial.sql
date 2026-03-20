CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE digest_status AS ENUM ('pending', 'sending', 'sent', 'failed');

-- SUBSCRIBERS table
CREATE TABLE subscribers (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT NOT NULL,
  name                TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  unsubscribe_token   UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at     TIMESTAMPTZ,
  UNIQUE(user_id, email)
);

-- DIGEST_RUNS table (one row per cron execution)
CREATE TABLE digest_runs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status            digest_status NOT NULL DEFAULT 'pending',
  stories_json      JSONB,
  sent_count        INTEGER DEFAULT 0,
  subscriber_count  INTEGER DEFAULT 0,
  error_message     TEXT,
  scheduled_for     TIMESTAMPTZ NOT NULL,
  sent_at           TIMESTAMPTZ,
  generation_ms     INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_subscribers_user ON subscribers(user_id, created_at DESC);
CREATE INDEX idx_subscribers_active ON subscribers(user_id, is_active);
CREATE INDEX idx_subscribers_token ON subscribers(unsubscribe_token);
CREATE INDEX idx_digest_runs_user ON digest_runs(user_id, created_at DESC);
CREATE INDEX idx_digest_runs_scheduled ON digest_runs(user_id, scheduled_for DESC);

-- RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_runs ENABLE ROW LEVEL SECURITY;

-- Subscribers: user-scoped
CREATE POLICY "Users select own subscribers"
  ON subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own subscribers"
  ON subscribers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own subscribers"
  ON subscribers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own subscribers"
  ON subscribers FOR DELETE USING (auth.uid() = user_id);

-- Digest runs: user-scoped
CREATE POLICY "Users select own digest runs"
  ON digest_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own digest runs"
  ON digest_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own digest runs"
  ON digest_runs FOR UPDATE USING (auth.uid() = user_id);
