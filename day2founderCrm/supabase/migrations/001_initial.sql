-- FounderCRM — Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE contact_status AS ENUM ('new', 'contacted', 'replied', 'closed');
CREATE TYPE follow_up_tone AS ENUM ('warm', 'direct', 'casual');
CREATE TYPE enrichment_source AS ENUM ('apollo', 'manual_paste', 'mock');
CREATE TYPE enrichment_confidence AS ENUM ('high', 'medium', 'low');
CREATE TYPE enrichment_job_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- ─── Contacts ─────────────────────────────────────────────────────────────────
CREATE TABLE contacts (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_url          TEXT NOT NULL,
  linkedin_username     TEXT NOT NULL,
  full_name             TEXT,
  headline              TEXT,
  current_title         TEXT,
  location              TEXT,
  avatar_url            TEXT,
  company_name          TEXT,
  company_domain        TEXT,
  company_industry      TEXT,
  company_size          TEXT,
  company_description   TEXT,
  key_talking_points    TEXT[],
  recent_signals        TEXT[],
  enrichment_source     enrichment_source,
  enrichment_confidence enrichment_confidence,
  enrichment_notes      TEXT,
  enriched_at           TIMESTAMPTZ,
  raw_provider_data     JSONB,
  status                contact_status NOT NULL DEFAULT 'new',
  notes                 TEXT,
  last_contacted_at     TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, linkedin_url)
);

-- ─── Follow-up suggestions ────────────────────────────────────────────────────
CREATE TABLE follow_up_suggestions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id    UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text  TEXT NOT NULL,
  tone          follow_up_tone NOT NULL,
  is_used       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Enrichment jobs (audit trail) ───────────────────────────────────────────
CREATE TABLE enrichment_jobs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id    UUID REFERENCES contacts(id) ON DELETE SET NULL,
  linkedin_url  TEXT NOT NULL,
  status        enrichment_job_status NOT NULL DEFAULT 'pending',
  source        enrichment_source,
  error_message TEXT,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Enrichment usage (credit tracking) ──────────────────────────────────────
CREATE TABLE enrichment_usage (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_used    INTEGER NOT NULL DEFAULT 0,
  month_year      TEXT NOT NULL,
  last_reset_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_status ON contacts(user_id, status);
CREATE INDEX idx_contacts_created_at ON contacts(user_id, created_at DESC);
CREATE INDEX idx_follow_ups_contact_id ON follow_up_suggestions(contact_id);
CREATE INDEX idx_enrichment_jobs_user_id ON enrichment_jobs(user_id, created_at DESC);
CREATE INDEX idx_enrichment_usage_user_month ON enrichment_usage(user_id, month_year);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER enrichment_usage_updated_at
  BEFORE UPDATE ON enrichment_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrichment_usage ENABLE ROW LEVEL SECURITY;

-- contacts policies
CREATE POLICY "Users can select own contacts"
  ON contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contacts"
  ON contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE USING (auth.uid() = user_id);

-- follow_up_suggestions policies
CREATE POLICY "Users can select own follow_ups"
  ON follow_up_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own follow_ups"
  ON follow_up_suggestions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own follow_ups"
  ON follow_up_suggestions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own follow_ups"
  ON follow_up_suggestions FOR DELETE USING (auth.uid() = user_id);

-- enrichment_jobs policies
CREATE POLICY "Users can select own enrichment_jobs"
  ON enrichment_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrichment_jobs"
  ON enrichment_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- enrichment_usage policies
CREATE POLICY "Users can select own usage"
  ON enrichment_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own usage"
  ON enrichment_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own usage"
  ON enrichment_usage FOR UPDATE USING (auth.uid() = user_id);
