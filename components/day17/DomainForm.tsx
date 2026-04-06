"use client";

import { useState, type FormEvent } from "react";
import { Search, Loader2 } from "lucide-react";

interface DomainFormProps {
  onSubmit: (domain: string) => void;
  loading: boolean;
}

export function DomainForm({ onSubmit, loading }: DomainFormProps) {
  const [domain, setDomain] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-[520px]">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter a domain (e.g. example.com)"
          disabled={loading}
          className="w-full rounded-md border pl-9 pr-3 py-2.5 text-[15px] outline-none transition-colors disabled:opacity-50"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !domain.trim()}
        className="rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
        style={{
          background: "var(--accent)",
          color: "var(--background)",
        }}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "Check"
        )}
      </button>
    </form>
  );
}
