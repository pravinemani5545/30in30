-- Day 16: VoiceoverStudio — ElevenLabs voiceover generator
CREATE TABLE voiceovers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input
  text_content      TEXT NOT NULL,
  character_count   INTEGER NOT NULL,
  voice_id          TEXT NOT NULL,
  voice_name        TEXT,
  speed             DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  stability         DECIMAL(3,2) NOT NULL DEFAULT 0.75,

  -- Output
  storage_path      TEXT,
  file_size_bytes   INTEGER,
  duration_seconds  DECIMAL(6,2),
  estimated_cost    DECIMAL(8,4),

  -- Series connection (YouTube AI SaaS)
  script_id         UUID REFERENCES scripts(id) ON DELETE SET NULL,

  -- Performance
  generation_ms     INTEGER,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_voiceovers_user ON voiceovers(user_id, created_at DESC);
CREATE INDEX idx_voiceovers_script ON voiceovers(script_id)
  WHERE script_id IS NOT NULL;

ALTER TABLE voiceovers ENABLE ROW LEVEL SECURITY;

-- SELECT, INSERT, DELETE only — NO UPDATE (voiceovers are immutable)
CREATE POLICY "Users select own voiceovers"
  ON voiceovers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own voiceovers"
  ON voiceovers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own voiceovers"
  ON voiceovers FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket RLS (bucket 'voiceovers' must be created in Dashboard first)
CREATE POLICY "Users upload own voiceovers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'voiceovers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users read own voiceovers"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'voiceovers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own voiceovers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'voiceovers'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
