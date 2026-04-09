-- Day 31: PriceTracker — tracked products
-- Additive migration — shared Supabase project

CREATE TYPE day31_availability_status AS ENUM ('in_stock', 'out_of_stock', 'unknown');
CREATE TYPE day31_check_frequency AS ENUM ('1x', '2x', '4x', '6x');

CREATE TABLE IF NOT EXISTS day31_tracked_products (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User-provided
  url                  TEXT NOT NULL,
  product_name         TEXT,
  target_price         DECIMAL(10,2) NOT NULL,
  frequency            day31_check_frequency NOT NULL DEFAULT '2x',
  notify_price_drop    BOOLEAN DEFAULT TRUE,
  notify_back_in_stock BOOLEAN DEFAULT TRUE,
  is_active            BOOLEAN DEFAULT TRUE,

  -- Current state (updated on each check)
  current_price        DECIMAL(10,2),
  currency             TEXT DEFAULT 'USD',
  availability         day31_availability_status DEFAULT 'unknown',
  previous_price       DECIMAL(10,2),
  is_below_target      BOOLEAN GENERATED ALWAYS AS
                         (current_price IS NOT NULL AND current_price <= target_price)
                         STORED,

  -- Tracking metadata
  last_check_at        TIMESTAMPTZ,
  next_check_at        TIMESTAMPTZ,
  last_alert_price     DECIMAL(10,2),
  consecutive_failures INTEGER DEFAULT 0,

  -- JS rendering detection
  is_js_rendered       BOOLEAN DEFAULT FALSE,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, url)
);

CREATE INDEX IF NOT EXISTS idx_day31_products_user
  ON day31_tracked_products(user_id);
CREATE INDEX IF NOT EXISTS idx_day31_products_due
  ON day31_tracked_products(next_check_at)
  WHERE is_active = true;

CREATE OR REPLACE FUNCTION day31_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER day31_products_updated_at
  BEFORE UPDATE ON day31_tracked_products
  FOR EACH ROW EXECUTE FUNCTION day31_update_updated_at();

ALTER TABLE day31_tracked_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own day31 products"
  ON day31_tracked_products FOR ALL USING (auth.uid() = user_id);
