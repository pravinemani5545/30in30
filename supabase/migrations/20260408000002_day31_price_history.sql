-- Day 31: PriceTracker — price history
-- Additive migration — shared Supabase project

CREATE TYPE day31_check_result AS ENUM ('success', 'extraction_failed', 'fetch_failed');

CREATE TABLE IF NOT EXISTS day31_price_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES day31_tracked_products(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Extraction result
  price           DECIMAL(10,2),
  availability    day31_availability_status,
  result          day31_check_result NOT NULL DEFAULT 'success',
  confidence      TEXT,

  -- Alert sent for this check?
  alert_sent      BOOLEAN DEFAULT FALSE,
  alert_type      TEXT,

  checked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_day31_history_product
  ON day31_price_history(product_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_day31_history_user
  ON day31_price_history(user_id, checked_at DESC);

ALTER TABLE day31_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own day31 history"
  ON day31_price_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own day31 history"
  ON day31_price_history FOR INSERT WITH CHECK (auth.uid() = user_id);
