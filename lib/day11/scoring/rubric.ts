import type { BandAnchor, DimensionKey, ScoreRange } from "@/types/day11";

export const CAMPAIGN_LAUNCH_THRESHOLD = 60;
export const REWRITE_TARGET_SCORE = 75;
export const DIMENSION_MAX = 25;

export const SPAM_WORDS = [
  "guaranteed",
  "free",
  "act now",
  "limited time",
  "no obligation",
  "100% ROI",
  "synergy",
  "leverage",
  "disruptive",
  "innovative",
  "game-changer",
  "value-add",
  "circle back",
  "touch base",
  "hoping to connect",
  "reaching out",
  "pick your brain",
  "exciting opportunity",
  "would love to",
  "let's connect",
  "blockchain",
  "revolutionary",
] as const;

export function getScoreRange(score: number): ScoreRange {
  if (score < 60) return "fail";
  if (score < 70) return "marginal";
  if (score < 80) return "good";
  return "strong";
}

export const SCORE_RANGE_LABELS: Record<ScoreRange, string> = {
  fail: "BELOW THRESHOLD \u2014 campaign launch blocked",
  marginal: "MARGINAL \u2014 passes but expect low reply rates",
  good: "GOOD \u2014 solid email, send with confidence",
  strong: "STRONG \u2014 this will get replies",
};

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  personalization: "PERSONALIZATION DEPTH",
  spam: "SPAM SIGNALS",
  cta: "CTA CLARITY",
  reading: "READING LEVEL",
};

export const DIMENSION_COLORS: Record<DimensionKey, string> = {
  personalization: "#8B5CF6",
  spam: "#EF4444",
  cta: "#E8A020",
  reading: "#06B6D4",
};

export const BAND_ANCHORS: Record<DimensionKey, BandAnchor[]> = {
  personalization: [
    { range: "0\u20135", description: "Generic broadcast. No company/role reference." },
    { range: "6\u201312", description: "Company name or role mentioned once. No specific context." },
    { range: "13\u201318", description: "Role + company + one generic industry reference." },
    { range: "19\u201322", description: "One specific verifiable fact referenced." },
    { range: "23\u201325", description: "Specific challenge from recent public info. Genuine research." },
  ],
  spam: [
    { range: "0\u20135", description: "Multiple hard triggers: guaranteed, free, act now. ALL CAPS." },
    { range: "6\u201312", description: "2\u20133 soft signals: synergy, leverage, game-changer." },
    { range: "13\u201318", description: "1 soft signal. Mostly natural language." },
    { range: "19\u201322", description: "Clean language. Reads like a human wrote it." },
    { range: "23\u201325", description: "Reads like a peer. Zero signals." },
  ],
  cta: [
    { range: "0\u20135", description: "No clear ask. \u201CLet me know your thoughts.\u201D" },
    { range: "6\u201312", description: "Vague ask. No specifics, no friction reduction." },
    { range: "13\u201318", description: "Specific ask but no friction reduction." },
    { range: "19\u201322", description: "Specific ask with friction reduction (calendar link, yes/no)." },
    { range: "23\u201325", description: "Specific ask + friction reduction + appropriate ask size." },
  ],
  reading: [
    { range: "0\u20135", description: "300+ words. Long paragraphs. Complex vocabulary." },
    { range: "6\u201312", description: "200\u2013300 words. Main point buried." },
    { range: "13\u201318", description: "150\u2013200 words. Short paragraphs. Readable in 30s." },
    { range: "19\u201322", description: "100\u2013150 words. Main point in first 2 sentences." },
    { range: "23\u201325", description: "Under 100 words. No filler. 15-second read." },
  ],
};
