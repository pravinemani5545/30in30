-- ClaudeJournal: Initial Schema
-- Run this in the Supabase SQL editor

-- ============================================================
-- Profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  streak_days integer DEFAULT 0 NOT NULL,
  total_entries integer DEFAULT 0 NOT NULL
);

-- ============================================================
-- Journal entries table
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  raw_transcript text NOT NULL,
  entry_title text,
  mood text CHECK (
    mood IN (
      'happy', 'sad', 'anxious', 'reflective',
      'energized', 'neutral', 'frustrated', 'grateful'
    )
  ),
  mood_intensity integer CHECK (mood_intensity BETWEEN 1 AND 10),
  mood_summary text,
  events jsonb DEFAULT '[]'::jsonb,
  reflections jsonb DEFAULT '[]'::jsonb,
  gratitude jsonb DEFAULT '[]'::jsonb,
  tomorrow_intention text,
  duration_seconds integer,
  word_count integer,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id
  ON journal_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at
  ON journal_entries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_entries_mood
  ON journal_entries(mood);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read and update their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Journal entries: users can only CRUD their own entries
CREATE POLICY "entries_select_own"
  ON journal_entries FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "entries_insert_own"
  ON journal_entries FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "entries_update_own"
  ON journal_entries FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "entries_delete_own"
  ON journal_entries FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
