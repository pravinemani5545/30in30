-- Day 14: ScriptEngine — YouTube video script generator
-- Two tables: scripts (immutable) + hook_validations (async quality gate)

DO $$ BEGIN
  CREATE TYPE hook_quality AS ENUM ('strong', 'weak', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE script_status AS ENUM ('complete', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS scripts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic             TEXT NOT NULL,
  target_duration   SMALLINT NOT NULL,
  target_word_count INTEGER NOT NULL,
  actual_word_count INTEGER,
  script_content    TEXT NOT NULL,
  sections          JSONB,
  status            script_status NOT NULL DEFAULT 'complete',
  generation_ms     INTEGER,
  ai_model_used     TEXT NOT NULL DEFAULT 'gemini-2.5-flash',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hook_validations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id     UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quality       hook_quality NOT NULL DEFAULT 'pending',
  reasoning     TEXT,
  hook_text     TEXT,
  validated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scripts_user ON scripts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hook_validations_script ON hook_validations(script_id);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_validations ENABLE ROW LEVEL SECURITY;

-- Scripts: SELECT / INSERT / DELETE only (no UPDATE — immutable)
CREATE POLICY "Users select own scripts"
  ON scripts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own scripts"
  ON scripts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own scripts"
  ON scripts FOR DELETE USING (auth.uid() = user_id);

-- Hook validations: SELECT / INSERT only (no UPDATE)
CREATE POLICY "Users select own validations"
  ON hook_validations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own validations"
  ON hook_validations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Realtime on hook_validations for client badge updates
ALTER PUBLICATION supabase_realtime ADD TABLE hook_validations;
