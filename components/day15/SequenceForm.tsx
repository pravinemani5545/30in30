"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import type { SequenceInput } from "@/types/day15";

interface SequenceFormProps {
  onSubmit: (input: SequenceInput) => void;
  loading: boolean;
  error: string | null;
}

export function SequenceForm({ onSubmit, loading, error }: SequenceFormProps) {
  const [persona, setPersona] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [socialProof, setSocialProof] = useState("");
  const [observation, setObservation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      persona: persona.trim(),
      valueProp: valueProp.trim(),
      socialProof: socialProof.trim(),
      observation: observation.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Persona */}
      <div className="space-y-1.5">
        <label
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Target Persona
        </label>
        <input
          type="text"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="e.g. VP of Sales at a Series B SaaS company (50-200 employees)"
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          required
          minLength={10}
          maxLength={300}
        />
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Be specific — vague personas produce vague emails.
        </p>
      </div>

      {/* Value Proposition */}
      <div className="space-y-1.5">
        <label
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Value Proposition
        </label>
        <textarea
          value={valueProp}
          onChange={(e) => setValueProp(e.target.value)}
          placeholder="What do you do and for whom? e.g. 'We help B2B SaaS sales teams book 3x more meetings by replacing manual prospecting with AI research.'"
          rows={3}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-colors"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          required
          minLength={20}
          maxLength={500}
        />
      </div>

      {/* Social Proof */}
      <div className="space-y-1.5">
        <label
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Social Proof
        </label>
        <input
          type="text"
          value={socialProof}
          onChange={(e) => setSocialProof(e.target.value)}
          placeholder="One specific proof point: e.g. 'We helped Acme Corp go from 6 to 19 meetings/month in 90 days without adding headcount.'"
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          required
          minLength={20}
          maxLength={300}
        />
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Include a specific result, company, and timeframe.
        </p>
      </div>

      {/* Observation (optional) */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Company Observation
          </label>
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
            }}
          >
            Optional
          </span>
        </div>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="Optional: something specific about a company you're targeting. e.g. 'I noticed they recently hired 3 SDRs but haven't changed their outreach tooling.'"
          rows={2}
          className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-colors"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          }}
          maxLength={300}
        />
        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Makes the sequence more specific if provided.
        </p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
        style={{
          background: "var(--accent)",
          color: "var(--background)",
        }}
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            Generate Sequence
            <ArrowRight size={14} />
          </>
        )}
      </button>

      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
        Generates all 5 emails in one call. Takes 20-30 seconds.
      </p>
    </form>
  );
}
