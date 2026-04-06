"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";

interface PillarInputProps {
  pillars: string[];
  onChange: (pillars: string[]) => void;
  error?: string;
}

export function PillarInput({ pillars, onChange, error }: PillarInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  function addPillar() {
    const trimmed = value.trim();
    if (!trimmed || pillars.length >= 5 || pillars.includes(trimmed)) return;
    onChange([...pillars, trimmed]);
    setValue("");
  }

  function removePillar(index: number) {
    onChange(pillars.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
      >
        Content Pillars ({pillars.length}/5)
      </label>
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg border min-h-[48px]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: error ? "var(--error)" : "var(--border)",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {pillars.map((p, i) => (
          <span
            key={p}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
            style={{
              backgroundColor: "var(--accent-subtle)",
              color: "var(--accent)",
              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
            }}
          >
            {p}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removePillar(i);
              }}
              className="hover:opacity-70 cursor-pointer"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {pillars.length < 5 && (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPillar();
              }
            }}
            placeholder={
              pillars.length === 0
                ? "Type a pillar and press Enter..."
                : "Add another..."
            }
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--foreground)" }}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
