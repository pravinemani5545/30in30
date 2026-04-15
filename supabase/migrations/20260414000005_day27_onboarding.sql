CREATE TABLE IF NOT EXISTS day27_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE day27_onboarding_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own onboarding" ON day27_onboarding_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
