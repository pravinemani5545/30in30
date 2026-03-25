CREATE TYPE post_status AS ENUM
  ('recording','transcribing','editing','generating','complete','failed');

CREATE TYPE generation_quality AS ENUM ('good','degraded','failed');

CREATE TABLE voice_posts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Audio metadata
  audio_storage_path    TEXT,
  audio_duration_s      INTEGER,
  audio_size_bytes      INTEGER,

  -- Transcription
  transcript_raw        TEXT,
  transcript_edited     TEXT,
  transcript_word_count INTEGER,

  -- Generated blog post (structured)
  post_headline         TEXT,
  post_intro            TEXT,
  post_section_1        TEXT,
  post_section_2        TEXT,
  post_section_3        TEXT,
  post_conclusion       TEXT,
  post_pullquote_1      TEXT,
  post_pullquote_2      TEXT,
  post_pullquote_3      TEXT,
  post_word_count       INTEGER,

  -- Full generated text (for download/copy)
  post_full_text        TEXT,

  -- Status + quality
  status                post_status NOT NULL DEFAULT 'recording',
  generation_quality    generation_quality,

  -- Performance
  transcription_ms      INTEGER,
  generation_ms         INTEGER,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_voice_posts_user
  ON voice_posts(user_id, created_at DESC);
CREATE INDEX idx_voice_posts_status
  ON voice_posts(user_id, status);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voice_posts_updated_at
  BEFORE UPDATE ON voice_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE voice_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own posts"
  ON voice_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own posts"
  ON voice_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts"
  ON voice_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts"
  ON voice_posts FOR DELETE USING (auth.uid() = user_id);

-- Supabase Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-audio', 'voice-audio', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'voice-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'voice-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'voice-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
