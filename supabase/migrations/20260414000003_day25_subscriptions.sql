CREATE TABLE IF NOT EXISTS day25_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  cancelled_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_day25_sub_user ON day25_subscriptions(user_id);
ALTER TABLE day25_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own subscription" ON day25_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
