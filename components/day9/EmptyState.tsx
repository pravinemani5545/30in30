"use client";

import { Briefcase } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center mb-4">
        <Briefcase className="w-6 h-6 text-[#E8A020]" />
      </div>
      <h2 className="font-serif text-xl text-[var(--foreground)] mb-2">
        Meeting Prep
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm">
        Enter a person&apos;s name, company, and meeting context to generate an
        AI-powered intelligence briefing.
      </p>
      <p className="text-[11px] text-[var(--text-tertiary)] mt-4 max-w-xs">
        Show up to every meeting like you&apos;ve done the homework.
      </p>
    </div>
  );
}
