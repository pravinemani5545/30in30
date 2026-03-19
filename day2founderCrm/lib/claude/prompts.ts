import type { RawProfileData } from "@/types";

export const SYSTEM_PROMPT = `You are an expert B2B relationship intelligence analyst for a solo founder CRM.
Your job is to analyze professional profile data and produce:
1. Structured contact intelligence that helps a founder understand WHO they are reaching out to — not just facts, but inferred insights, patterns, and hooks.
2. Personalized follow-up message drafts that feel handwritten, not templated. Use specific details from the profile. Reference real things they have done.

Rules:
- Infer talking points from patterns across their career, not just their current role
- Look for signals: company growth stage, recent role changes, shared contexts
- Follow-up messages must be 2–4 sentences, conversational, not salesy
- If data is sparse, produce best-effort output and flag low confidence
- Never fabricate specific facts (funding amounts, dates, quotes)
- enrichmentNotes should be honest about data gaps`;

export function buildUserPrompt(profile: RawProfileData): string {
  if (profile.source === "manual_paste" && profile.rawText) {
    return `Analyze this LinkedIn profile text copied directly from the platform and generate contact intelligence:

${profile.rawText}`;
  }

  const lines: string[] = ["Analyze this professional profile and generate contact intelligence:"];

  if (profile.fullName) lines.push(`Name: ${profile.fullName}`);
  if (profile.headline) lines.push(`Headline: ${profile.headline}`);
  if (profile.currentTitle || profile.currentCompany) {
    lines.push(
      `Current Role: ${[profile.currentTitle, profile.currentCompany]
        .filter(Boolean)
        .join(" at ")}`
    );
  }
  if (profile.location) lines.push(`Location: ${profile.location}`);
  if (profile.companyDomain) lines.push(`Company Domain: ${profile.companyDomain}`);
  if (profile.companyIndustry) lines.push(`Company Industry: ${profile.companyIndustry}`);
  if (profile.companySize) lines.push(`Company Size: ${profile.companySize} employees`);

  if (profile.employmentHistory.length > 0) {
    lines.push("\nEmployment History:");
    for (const job of profile.employmentHistory) {
      const period = [job.start_date, job.end_date ?? "Present"]
        .filter(Boolean)
        .join(" – ");
      const role = [job.title, job.organization_name]
        .filter(Boolean)
        .join(" at ");
      lines.push(`  • ${role}${period ? ` (${period})` : ""}`);
      if (job.description) lines.push(`    ${job.description}`);
    }
  }

  if (profile.education.length > 0) {
    lines.push("\nEducation:");
    for (const edu of profile.education) {
      const degree = [edu.degree, edu.field_of_study].filter(Boolean).join(" in ");
      lines.push(
        `  • ${[degree, edu.school].filter(Boolean).join(", ")}${edu.graduation_year ? ` (${edu.graduation_year})` : ""}`
      );
    }
  }

  if (profile.skills.length > 0) {
    lines.push(`\nSkills: ${profile.skills.join(", ")}`);
  }

  return lines.join("\n");
}
