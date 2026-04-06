"use client";

import { useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { CalendarInput, PlatformFrequency as PFType } from "@/types/day19";
import { PillarInput } from "./PillarInput";
import { PlatformFrequency } from "./PlatformFrequency";
import { UniquePerspectiveField } from "./UniquePerspectiveField";

interface Props {
  onGenerate: (input: CalendarInput) => Promise<void>;
  loading: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function getMonthLabel(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function CalendarForm({
  onGenerate,
  loading,
  collapsed,
  onToggleCollapse,
}: Props) {
  const [pillars, setPillars] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<PFType[]>([]);
  const [audiencePersona, setAudiencePersona] = useState("");
  const [uniquePerspective, setUniquePerspective] = useState("");
  const [styleExample, setStyleExample] = useState("");
  const [monthLabel, setMonthLabel] = useState(getMonthLabel());
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (pillars.length < 3) next.pillars = "Add at least 3 content pillars.";
    if (pillars.length > 5) next.pillars = "Maximum 5 pillars.";
    if (platforms.length === 0) next.platforms = "Select at least one platform.";
    if (audiencePersona.trim().length < 20)
      next.audiencePersona = "Describe your audience in at least 20 characters.";
    if (uniquePerspective.trim().length < 20)
      next.uniquePerspective =
        "Your unique angle needs to be more specific. e.g. 'I'm building two SaaS products simultaneously while documenting every mistake.'";
    if (uniquePerspective.length > 300)
      next.uniquePerspective = "Keep it under 300 characters.";
    if (!monthLabel.trim()) next.monthLabel = "Month label is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onGenerate({
      pillars,
      platforms,
      audiencePersona: audiencePersona.trim(),
      uniquePerspective: uniquePerspective.trim(),
      styleExample: styleExample.trim() || undefined,
      monthLabel: monthLabel.trim(),
    });
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapse}
        className="w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors hover:opacity-80"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Generate new calendar
        </span>
        <ChevronDown size={16} style={{ color: "var(--text-tertiary)" }} />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-serif)" }}
        >
          Generate Calendar
        </h2>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 cursor-pointer hover:opacity-70"
        >
          <ChevronUp size={16} style={{ color: "var(--text-tertiary)" }} />
        </button>
      </div>

      <PillarInput
        pillars={pillars}
        onChange={setPillars}
        error={errors.pillars}
      />

      <PlatformFrequency
        platforms={platforms}
        onChange={setPlatforms}
        error={errors.platforms}
      />

      <div>
        <label
          className="block text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          Audience Persona
        </label>
        <textarea
          value={audiencePersona}
          onChange={(e) => setAudiencePersona(e.target.value)}
          rows={2}
          placeholder="Who are you writing for? Be specific. e.g. 'Early-stage SaaS founders, technical background, building in public'"
          className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none placeholder:text-[var(--text-tertiary)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: errors.audiencePersona ? "var(--error)" : "var(--border)",
            color: "var(--foreground)",
          }}
        />
        {errors.audiencePersona && (
          <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
            {errors.audiencePersona}
          </p>
        )}
      </div>

      <UniquePerspectiveField
        value={uniquePerspective}
        onChange={setUniquePerspective}
        error={errors.uniquePerspective}
      />

      <div>
        <label
          className="block text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          High-Performing Post (for style calibration)
        </label>
        <textarea
          value={styleExample}
          onChange={(e) => setStyleExample(e.target.value)}
          rows={3}
          placeholder="Paste the post that got your best engagement. Exact wording."
          className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none placeholder:text-[var(--text-tertiary)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
      </div>

      <div>
        <label
          className="block text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          Month
        </label>
        <input
          type="text"
          value={monthLabel}
          onChange={(e) => setMonthLabel(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border text-sm outline-none placeholder:text-[var(--text-tertiary)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: errors.monthLabel ? "var(--error)" : "var(--border)",
            color: "var(--foreground)",
          }}
        />
        {errors.monthLabel && (
          <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
            {errors.monthLabel}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--accent)",
          color: "var(--background)",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating 30-day calendar...
          </>
        ) : (
          "Generate 30-Day Calendar"
        )}
      </button>

      <p
        className="text-center text-xs"
        style={{ color: "var(--text-tertiary)" }}
      >
        Generates all 30 posts · Enforces max 2 high-effort/week
      </p>
    </form>
  );
}
