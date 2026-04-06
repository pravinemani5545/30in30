import type { CompanyChange, ChangeType } from "@/types/day18";

interface DigestSummaryProps {
  changes: CompanyChange[];
}

export function DigestSummary({ changes }: DigestSummaryProps) {
  const sites = new Set(changes.map((c) => c.domain ?? c.url)).size;
  const typeCounts = changes.reduce(
    (acc, c) => {
      acc[c.change_type] = (acc[c.change_type] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<ChangeType, number>>,
  );

  const parts: string[] = [];
  if (typeCounts.pricing) parts.push(`${typeCounts.pricing} pricing`);
  if (typeCounts.hiring) parts.push(`${typeCounts.hiring} hiring`);
  if (typeCounts.feature) parts.push(`${typeCounts.feature} feature`);
  if (typeCounts.messaging) parts.push(`${typeCounts.messaging} messaging`);

  return (
    <div
      className="rounded-md px-3 py-2 mb-3 text-sm"
      style={{
        background: "var(--accent-subtle)",
        color: "var(--text-secondary)",
      }}
    >
      <span style={{ color: "var(--accent)" }} className="font-medium">
        {changes.length} change{changes.length > 1 ? "s" : ""}
      </span>{" "}
      across {sites} site{sites > 1 ? "s" : ""}.
      {parts.length > 0 && ` ${parts.join(", ")}.`}
    </div>
  );
}
