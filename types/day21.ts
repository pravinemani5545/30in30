// ─── Day 21: ReplyClassifier Types ──────────────────────────────────

export type ReplyCategory =
  | "interested"
  | "not_now"
  | "question"
  | "out_of_office"
  | "unsubscribe";

export interface ClassifiedReply {
  id: string;
  user_id: string;
  reply_text: string;
  sender: string | null;
  category: ReplyCategory;
  confidence: number;
  reasoning: string;
  created_at: string;
}

export interface ClassifyInput {
  replyText: string;
  sender?: string;
}

export interface ClassifyResult {
  category: ReplyCategory;
  confidence: number;
  reasoning: string;
}
