export interface HNStory {
  id: number;
  title: string;
  url: string | null;
  hnUrl: string;
  domain: string;
  score: number;
  by: string;
  descendants: number;
  time: number;
}

export interface SummarizedStory extends HNStory {
  summary: string;
  relevanceScore: number;
  reason: string;
  parseError?: boolean;
}

export type RelevanceLevel = "high" | "mid" | "low";

export type DigestStatus = "pending" | "sending" | "sent" | "failed";

export interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DigestRun {
  id: string;
  user_id: string;
  status: DigestStatus;
  stories_json: SummarizedStory[] | null;
  sent_count: number;
  subscriber_count: number;
  error_message: string | null;
  scheduled_for: string;
  sent_at: string | null;
  generation_ms: number | null;
  created_at: string;
}

export interface DigestResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  storiesCount: number;
  sentCount: number;
  failedCount: number;
  generationMs: number;
  runId: string;
}

export function getRelevanceLevel(score: number): RelevanceLevel {
  if (score >= 8) return "high";
  if (score >= 5) return "mid";
  return "low";
}

export function getScoreLabel(level: RelevanceLevel): string {
  switch (level) {
    case "high":
      return "High";
    case "mid":
      return "Mid";
    case "low":
      return "Low";
  }
}
