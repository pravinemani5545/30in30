CREATE TABLE IF NOT EXISTS day23_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS day23_campaign_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES day23_campaigns(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('sent', 'opened', 'clicked', 'replied', 'converted')),
  variant TEXT CHECK (variant IN ('A', 'B')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_day23_campaigns_user ON day23_campaigns(user_id, created_at DESC);
CREATE INDEX idx_day23_events_campaign ON day23_campaign_events(campaign_id);

ALTER TABLE day23_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE day23_campaign_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own campaigns" ON day23_campaigns FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own campaign events" ON day23_campaign_events FOR ALL USING (campaign_id IN (SELECT id FROM day23_campaigns WHERE user_id = auth.uid()));
