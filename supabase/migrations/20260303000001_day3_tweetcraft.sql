-- ENUMS
CREATE TYPE tweet_type AS ENUM
  ('hook', 'story', 'stat', 'contrarian', 'listicle');

CREATE TYPE generation_status AS ENUM
  ('pending', 'parsing', 'generating', 'completed', 'failed');

CREATE TYPE content_quality AS ENUM
  ('full', 'limited', 'og_only');

-- ARTICLE_CACHE table (shared across users — keyed by URL)
CREATE TABLE article_cache (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url                 TEXT NOT NULL UNIQUE,
  normalized_url      TEXT NOT NULL,
  domain              TEXT NOT NULL,
  title               TEXT,
  description         TEXT,
  author              TEXT,
  published_at        TEXT,
  og_image_url        TEXT,
  main_content        TEXT,
  word_count          INTEGER,
  estimated_read_minutes INTEGER,
  content_quality     content_quality NOT NULL DEFAULT 'full',
  cached_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- GENERATIONS table (canonical content record — feeds distribution module)
CREATE TABLE generations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_url         TEXT NOT NULL,
  article_title       TEXT,
  article_domain      TEXT,
  article_favicon_url TEXT,
  content_quality     content_quality NOT NULL DEFAULT 'full',
  status              generation_status NOT NULL DEFAULT 'pending',
  tweet_variations    JSONB,
  article_summary     TEXT,
  key_insights        TEXT[],
  error_message       TEXT,
  generation_ms       INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TWEET_VARIATIONS table (individual tweets — queryable separately)
CREATE TABLE tweet_variations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id       UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  variation_number    SMALLINT NOT NULL CHECK (variation_number BETWEEN 1 AND 5),
  tweet_type          tweet_type NOT NULL,
  content             TEXT NOT NULL,
  character_count     INTEGER NOT NULL,
  hook_score          SMALLINT NOT NULL CHECK (hook_score BETWEEN 1 AND 10),
  hook_analysis       TEXT NOT NULL,
  retweet_potential   SMALLINT NOT NULL CHECK (retweet_potential BETWEEN 1 AND 10),
  reply_bait          SMALLINT NOT NULL CHECK (reply_bait BETWEEN 1 AND 10),
  saves_potential     SMALLINT NOT NULL CHECK (saves_potential BETWEEN 1 AND 10),
  why_this_works      TEXT NOT NULL DEFAULT '',
  potential_weakness  TEXT NOT NULL DEFAULT '',
  is_regenerated      BOOLEAN NOT NULL DEFAULT FALSE,
  copied_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_generations_user_id
  ON generations(user_id, created_at DESC);
CREATE INDEX idx_generations_url
  ON generations(user_id, article_url);
CREATE INDEX idx_tweet_variations_generation
  ON tweet_variations(generation_id);
CREATE INDEX idx_tweet_variations_user
  ON tweet_variations(user_id, created_at DESC);
CREATE INDEX idx_article_cache_url
  ON article_cache(normalized_url);
CREATE INDEX idx_article_cache_expires
  ON article_cache(expires_at);

-- AUTO-UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generations_updated_at
  BEFORE UPDATE ON generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweet_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_cache ENABLE ROW LEVEL SECURITY;

-- article_cache: readable by all authenticated users, writable only via service role
CREATE POLICY "Authenticated users can read article cache"
  ON article_cache FOR SELECT
  TO authenticated USING (true);

-- generations: user-scoped
CREATE POLICY "Users select own generations"
  ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own generations"
  ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own generations"
  ON generations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own generations"
  ON generations FOR DELETE USING (auth.uid() = user_id);

-- tweet_variations: user-scoped
CREATE POLICY "Users select own variations"
  ON tweet_variations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own variations"
  ON tweet_variations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own variations"
  ON tweet_variations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own variations"
  ON tweet_variations FOR DELETE USING (auth.uid() = user_id);
