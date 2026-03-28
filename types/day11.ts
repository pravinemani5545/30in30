export interface DimensionGrade {
  score: number;
  finding: string;
}

export interface SpamDimensionGrade extends DimensionGrade {
  wordsFound: string[];
}

export interface ReadingDimensionGrade extends DimensionGrade {
  wordCount: number;
}

export interface GradeResult {
  overallScore: number;
  gatePassed: boolean;
  dimensions: {
    personalization: DimensionGrade;
    spam: SpamDimensionGrade;
    cta: DimensionGrade;
    reading: ReadingDimensionGrade;
  };
  overallFinding: string;
  rewriteNeeded: boolean;
}

export interface RewriteResult {
  rewrittenEmail: string;
  projectedScore: number;
  explanation: string;
}

export interface EmailGrade {
  id: string;
  user_id: string;
  original_email: string;
  email_word_count: number;
  overall_score: number;
  gate_passed: boolean;
  personalization_score: number;
  spam_score: number;
  cta_score: number;
  reading_score: number;
  personalization_finding: string;
  spam_finding: string;
  cta_finding: string;
  reading_finding: string;
  spam_words_found: string[];
  rewrite_email: string | null;
  rewrite_projected_score: number | null;
  rewrite_explanation: string | null;
  grade_ms: number | null;
  rewrite_ms: number | null;
  ai_model_used: string;
  created_at: string;
}

export type ScoreRange = "fail" | "marginal" | "good" | "strong";

export type DimensionKey = "personalization" | "spam" | "cta" | "reading";

export interface BandAnchor {
  range: string;
  description: string;
}
