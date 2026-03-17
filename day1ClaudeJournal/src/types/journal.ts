export type Mood =
  | "happy"
  | "sad"
  | "anxious"
  | "reflective"
  | "energized"
  | "neutral"
  | "frustrated"
  | "grateful";

export type Significance = "high" | "medium" | "low";

export interface JournalEvent {
  title: string;
  description: string;
  significance: Significance;
}

export interface JournalReflection {
  insight: string;
  theme: string;
}

export interface AnalyzedEntry {
  mood: Mood;
  mood_intensity: number;
  mood_summary: string;
  events: JournalEvent[];
  reflections: JournalReflection[];
  gratitude: string[];
  tomorrow_intention: string;
  entry_title: string;
}

export interface JournalEntry extends AnalyzedEntry {
  id: string;
  user_id: string;
  raw_transcript: string;
  duration_seconds: number | null;
  word_count: number | null;
  created_at: string;
}
