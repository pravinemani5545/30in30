import type { SearchQuery } from "@/types/day9";

export function buildSearchQueries(
  person: string,
  company: string
): SearchQuery[] {
  return [
    {
      query: `${person} ${company}`,
      type: "general",
      label: "Recent activity",
    },
    {
      query: `${person} LinkedIn`,
      type: "linkedin",
      label: "Professional background",
    },
    {
      query: `${company} news ${new Date().getFullYear()}`,
      type: "news",
      label: "Company news",
    },
  ];
}
