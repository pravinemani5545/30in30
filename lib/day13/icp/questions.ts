import type { ICPQuestion } from "@/types/day13";

export const ICP_QUESTIONS: ICPQuestion[] = [
  {
    question: "What specific outcome does your best customer achieve in the first 90 days?",
    hint: "Not 'saves time' — a measurable result. E.g. 'closes 3 more deals per month' or 'reduces churn by 15%.'",
    key: "outcome",
  },
  {
    question: "Describe the type of company that has paid you the most without pushing back on price.",
    hint: "Industry, headcount, growth stage, revenue range. The more specific, the more useful.",
    key: "company_type",
  },
  {
    question: "Who signs the contract or approves the purchase?",
    hint: "Job title, not department. The person whose budget it comes from and who can say yes without asking someone else.",
    key: "buying_role",
  },
  {
    question: "Who uses your product day-to-day — and is that person different from the buyer?",
    hint: "If different, describe how the user influences the buying decision. If the same, say so.",
    key: "user_role",
  },
  {
    question: "How are your best customers solving this problem right now, before they find you?",
    hint: "Usually a spreadsheet, a manual process, a junior hire, or nothing. Name the exact tool or behaviour.",
    key: "current_workflow",
  },
  {
    question: "What has to happen in their business for this problem to become urgent enough to buy?",
    hint: "A specific event: a new hire, a lost deal, a board meeting, a failed audit, hitting a revenue milestone.",
    key: "trigger_event",
  },
  {
    question: "What is the most common reason a qualified prospect gives you for not buying right now?",
    hint: "The objection you've heard so many times you can predict it. The real one, not 'we don't have budget.'",
    key: "primary_objection",
  },
  {
    question: "What tells you in the first 15 minutes of a call that this deal will never close?",
    hint: "Company size, industry, role, mindset, or something they say. The filter you've learned to apply.",
    key: "bad_fit_signals",
  },
  {
    question: "What is the typical annual contract value for a deal that closes without negotiation?",
    hint: "A real number, not a range. If you always quote $X and it closes — that's your number.",
    key: "budget_range",
  },
  {
    question: "How did your three best customers — the ones who renewed and referred — first hear about you?",
    hint: "Not how you wish they found you. How they actually found you. Referral from who? Conference where? Content from when?",
    key: "discovery_channel",
  },
];

export const ANSWER_KEYS = ICP_QUESTIONS.map((q) => q.key);
