"use client";

import { useState, useCallback } from "react";

interface Props {
  onStart: (name: string) => void;
}

export function CompanyNameInput({ onStart }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (name.trim().length >= 2) {
        onStart(name.trim());
      }
    },
    [name, onStart],
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div>
          <h1
            className="text-2xl mb-2"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--foreground)",
            }}
          >
            Build Your ICP
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Ten questions. One at a time. Be specific — vague answers produce
            vague profiles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="text-[11px] font-bold uppercase tracking-[0.1em] block mb-2 text-left"
              style={{ color: "var(--text-tertiary)" }}
            >
              Company Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme SaaS"
              className="w-full px-3 py-2.5 rounded-md border text-sm outline-none transition-colors"
              style={{
                backgroundColor: "#0F0F0F",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full py-2.5 rounded-md text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--background)",
            }}
          >
            Start Interview →
          </button>
        </form>
      </div>
    </div>
  );
}
