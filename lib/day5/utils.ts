export function scoreColor(score: number): string {
  if (score >= 90) return "var(--color-score-green)";
  if (score >= 70) return "var(--color-score-gold)";
  if (score >= 40) return "var(--color-score-amber)";
  return "var(--color-score-red)";
}

export function scoreColorClass(score: number): string {
  if (score >= 90) return "text-score-green";
  if (score >= 70) return "text-score-gold";
  if (score >= 40) return "text-score-amber";
  return "text-score-red";
}
