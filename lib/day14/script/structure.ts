export const WPM = 130;

export function calcTargetWordCount(durationMinutes: number): number {
  return durationMinutes * WPM;
}

export const SCRIPT_MARKERS = [
  "[HOOK]",
  "[PROOF_POINT]",
  "[SECTION:1]",
  "[RETENTION:1]",
  "[SECTION:2]",
  "[RETENTION:2]",
  "[SECTION:3]",
  "[RETENTION:3]",
  "[CTA]",
] as const;

export const SECTION_LABELS: Record<string, string> = {
  "[HOOK]": "Hook",
  "[PROOF_POINT]": "Proof Point",
  "[SECTION:1]": "Section 1",
  "[RETENTION:1]": "Retention Hook",
  "[SECTION:2]": "Section 2",
  "[RETENTION:2]": "Retention Hook",
  "[SECTION:3]": "Section 3",
  "[RETENTION:3]": "Retention Hook",
  "[CTA]": "Call to Action",
};

export const SECTION_COLORS: Record<string, string> = {
  "[HOOK]": "#E8A020",
  "[PROOF_POINT]": "#8B5CF6",
  "[SECTION:1]": "#06B6D4",
  "[RETENTION:1]": "#F97316",
  "[SECTION:2]": "#06B6D4",
  "[RETENTION:2]": "#F97316",
  "[SECTION:3]": "#06B6D4",
  "[RETENTION:3]": "#F97316",
  "[CTA]": "#22C55E",
};

export const DURATION_OPTIONS = [3, 5, 8, 10, 15] as const;
