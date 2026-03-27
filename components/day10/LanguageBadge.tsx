"use client";

export function LanguageBadge({
  language,
  confidence,
}: {
  language: string;
  confidence: "high" | "low";
}) {
  if (language === "Unknown") return null;

  return (
    <span
      className="absolute top-3 right-3 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider"
      style={{
        background: "var(--accent)",
        color: "var(--background)",
        borderRadius: 4,
        opacity: confidence === "high" ? 1 : 0.6,
      }}
    >
      {language}
    </span>
  );
}
