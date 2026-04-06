-- Day 19 — ContentCalendar
-- 30-day AI content calendar with repurposing map

CREATE TABLE content_calendars (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Inputs (stored for history replay)
  pillars                 TEXT[] NOT NULL,
  platforms               JSONB NOT NULL,
  audience_persona        TEXT NOT NULL,
  unique_perspective      TEXT NOT NULL,
  style_example           TEXT,
  month_label             TEXT NOT NULL,

  -- Generated output — Month 6 SaaS scheduler reads this field
  posts                   JSONB NOT NULL,
  calendar_summary        TEXT,

  -- Quality flags (server-side post-generation)
  constraint_violations   INTEGER DEFAULT 0,
  generic_output_warning  BOOLEAN DEFAULT FALSE,

  -- Performance
  generation_ms           INTEGER,
  ai_model_used           TEXT NOT NULL DEFAULT 'gemini-2.5-flash',

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_calendars_user
  ON content_calendars(user_id, created_at DESC);

ALTER TABLE content_calendars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own calendars"
  ON content_calendars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own calendars"
  ON content_calendars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own calendars"
  ON content_calendars FOR DELETE USING (auth.uid() = user_id);

-- No UPDATE policy — calendars are immutable. Regenerate for a new calendar.
