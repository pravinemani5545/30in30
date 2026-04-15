CREATE TABLE IF NOT EXISTS day21_classified_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  sender TEXT,
  category TEXT NOT NULL CHECK (category IN ('interested', 'not_now', 'question', 'out_of_office', 'unsubscribe')),
  confidence NUMERIC(3,2) NOT NULL,
  reasoning TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_day21_replies_user ON day21_classified_replies(user_id, created_at DESC);
ALTER TABLE day21_classified_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own replies" ON day21_classified_replies FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
