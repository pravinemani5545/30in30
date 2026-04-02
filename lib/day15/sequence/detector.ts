import { FOLLOWUP_PATTERNS } from "./arc";

export function detectFollowupLanguage(body: string): boolean {
  const lower = body.toLowerCase();
  return FOLLOWUP_PATTERNS.some((pattern) => lower.includes(pattern));
}
