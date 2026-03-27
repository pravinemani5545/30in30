import type { SearchResult } from "@/types/day9";

export const SYSTEM_PROMPT = `You are a senior intelligence analyst preparing pre-meeting briefings for sales professionals and founders. Your job is to synthesise web search results into actionable intelligence — not to be comprehensive, but to be useful.

QUALITY STANDARDS:
1. Every factual claim must be traceable to a specific search result. Do not add background knowledge not present in the results. If the results don't contain a piece of information: omit it, don't guess.
2. Recency matters. Prefer information from the current year over older results. If someone's title appears in results from 2 years ago, note the date. The user needs to know if information might be outdated.
3. The meeting context is the lens. Everything should be filtered through: "How is this relevant to {meeting_context}?" Talking points must be tailored to this specific meeting — not generic.
4. Conversation starters must reference a SPECIFIC fact from the research.
   Bad: "How long have you been working in this field?"
   Good: "I saw you spoke at GopherCon last year about distributed systems — how are you thinking about that problem at {company}?"
   If you cannot generate a specific conversation starter from the research: output "[INSUFFICIENT_DATA: could not generate specific starter]". Do not output generic starters.
5. Confidence levels:
   verified: directly stated in a recent (current year) reliable source
   likely: inferred from context with high plausibility
   uncertain: conflicting sources, old data, or very limited information

FAILURE HONESTY:
If the search results are insufficient for a section (e.g., almost no personal background found), populate that section with what you have AND include a note: "[NOTE: limited data — verify directly]". Do not fabricate to fill gaps.`;

export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return "No search results available.";
  }

  return results
    .map(
      (r, i) =>
        `[Result ${i + 1} - from: ${r.queryType} query]\nTitle: ${r.title}\nURL: ${r.url}\nDate: ${r.date || "unknown"}\nSummary: ${r.snippet}`
    )
    .join("\n\n");
}

export function buildSynthesisPrompt(
  person: string,
  company: string,
  meetingContext: string,
  results: SearchResult[],
  isCached: boolean
): string {
  const cacheNote = isCached
    ? "\nNote: These research results are from cache — they may be up to 24 hours old. Flag any time-sensitive information accordingly.\n"
    : "";

  return `Prepare a pre-meeting intelligence briefing for an upcoming meeting.

SUBJECT: ${person}
COMPANY: ${company}
MEETING CONTEXT: ${meetingContext}
${cacheNote}
SEARCH RESULTS:
${formatSearchResults(results)}

Generate a structured briefing with:
1. Background (3-4 sentences about who this person is: career arc, current role, notable history). Cite sources per sentence like [LinkedIn, 2024].
2. Company Context (3-4 sentences about the company: stage, product, recent news). Cite sources.
3. Three talking points tailored specifically to the meeting context "${meetingContext}". Each point: bold opener + 2-sentence explanation referencing the research.
4. Three likely objections this person might raise given their role/company, with suggested responses.
5. Two non-generic conversation starters seeded by specific facts from the research.
6. All sources used with URL, title, query type, and date.
7. Overall data quality assessment (rich/adequate/limited) with explanation if limited.`;
}
