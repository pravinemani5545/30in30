"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BriefingFormProps {
  onSubmit: (
    personName: string,
    companyName: string,
    meetingContext: string
  ) => void;
  isGenerating: boolean;
}

export function BriefingForm({ onSubmit, isGenerating }: BriefingFormProps) {
  const [personName, setPersonName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [meetingContext, setMeetingContext] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!personName.trim() || !companyName.trim() || !meetingContext.trim())
      return;
    onSubmit(personName.trim(), companyName.trim(), meetingContext.trim());
  }

  const isValid =
    personName.trim().length >= 2 &&
    companyName.trim().length >= 2 &&
    meetingContext.trim().length >= 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="person-name"
          className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-1.5"
        >
          Person
        </label>
        <input
          id="person-name"
          type="text"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          placeholder="Full name..."
          disabled={isGenerating}
          className="w-full px-3 py-2.5 rounded border border-[var(--border)] bg-[#0F0F0F] text-[var(--foreground)] text-base placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E8A020] transition-colors"
          maxLength={100}
        />
      </div>

      <div>
        <label
          htmlFor="company-name"
          className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-1.5"
        >
          Company
        </label>
        <input
          id="company-name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Company name..."
          disabled={isGenerating}
          className="w-full px-3 py-2.5 rounded border border-[var(--border)] bg-[#0F0F0F] text-[var(--foreground)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E8A020] transition-colors"
          maxLength={100}
        />
      </div>

      <div>
        <label
          htmlFor="meeting-context"
          className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-1.5"
        >
          Meeting Context
        </label>
        <textarea
          id="meeting-context"
          value={meetingContext}
          onChange={(e) => setMeetingContext(e.target.value)}
          placeholder="One sentence: what's this meeting about? E.g. 'Pitching our API to their CTO'"
          disabled={isGenerating}
          rows={2}
          className="w-full px-3 py-2.5 rounded border border-[var(--border)] bg-[#0F0F0F] text-[var(--foreground)] text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[#E8A020] transition-colors resize-none"
          maxLength={300}
        />
      </div>

      <Button
        type="submit"
        disabled={!isValid || isGenerating}
        className="w-full sm:w-auto sm:float-right bg-[#E8A020] hover:bg-[#D4911A] text-[#0A0A0A] font-medium py-2.5 px-6"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            Generate Brief
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>

      <p className="text-[11px] text-[var(--text-tertiary)] pt-1 clear-both">
        Takes 8-15 seconds on first run. Cached for 24h.
      </p>
    </form>
  );
}
