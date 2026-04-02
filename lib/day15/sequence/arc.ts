import type { EmailType } from "@/types/day15";

export const EMAIL_TYPES = {
  pattern_interrupt: {
    label: "Pattern Interrupt",
    sendDay: 1,
    colour: "var(--email-interrupt)",
  },
  social_proof_reframe: {
    label: "Social Proof",
    sendDay: 3,
    colour: "var(--email-proof)",
  },
  pivot: {
    label: "The Pivot",
    sendDay: 7,
    colour: "var(--email-pivot)",
  },
  gracious_breakup: {
    label: "Break-Up",
    sendDay: 14,
    colour: "var(--email-breakup)",
  },
  long_tail_reengagement: {
    label: "Re-engagement",
    sendDay: 28,
    colour: "var(--email-reengagement)",
  },
} as const;

export const SEQUENCE_EMAIL_ORDER: EmailType[] = [
  "pattern_interrupt",
  "social_proof_reframe",
  "pivot",
  "gracious_breakup",
  "long_tail_reengagement",
];

export const FOLLOWUP_PATTERNS = [
  "following up",
  "just following",
  "bumping this",
  "bumping my",
  "circle back",
  "circling back",
  "just wanted to check",
  "haven't heard back",
  "previous email",
  "last email",
  "i've sent",
  "i've reached out",
  "i've emailed",
];
