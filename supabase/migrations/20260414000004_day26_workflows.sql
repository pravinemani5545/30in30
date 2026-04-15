CREATE TABLE IF NOT EXISTS day26_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  definition JSONB NOT NULL,
  last_result JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_day26_workflows_user ON day26_workflows(user_id, created_at DESC);
ALTER TABLE day26_workflows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workflows" ON day26_workflows FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
