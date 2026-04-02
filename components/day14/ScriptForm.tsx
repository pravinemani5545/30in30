"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DURATION_OPTIONS,
  calcTargetWordCount,
  WPM,
} from "@/lib/day14/script/structure";

interface ScriptFormProps {
  onGenerate: (topic: string, targetDuration: number) => void;
  isStreaming: boolean;
}

export function ScriptForm({ onGenerate, isStreaming }: ScriptFormProps) {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(8);
  const targetWordCount = calcTargetWordCount(duration);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || isStreaming) return;
    onGenerate(topic.trim(), duration);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Topic input */}
      <div className="space-y-2">
        <label
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          Video Topic
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What's this video about? Be specific — bad input = bad script."
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-md border px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--text-tertiary,#555250)]"
          style={{
            background: "var(--surface-input, #0F0F0F)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        />
      </div>

      {/* Duration selector */}
      <div className="space-y-2">
        <label
          className="text-xs font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          Target Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
              style={{
                background:
                  d === duration
                    ? "var(--accent)"
                    : "var(--surface-raised, #1A1A1A)",
                color: d === duration ? "#0A0A0A" : "var(--text-secondary)",
                border: `1px solid ${d === duration ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {d} min
            </button>
          ))}
        </div>
        <p
          className="text-xs"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          {duration} min x {WPM} WPM = ~{targetWordCount.toLocaleString()} words
        </p>
      </div>

      {/* Generate button */}
      <Button
        type="submit"
        disabled={!topic.trim() || isStreaming}
        className="w-full rounded-md px-6 py-2.5 text-sm font-bold"
        style={{
          background: "var(--accent)",
          color: "#0A0A0A",
        }}
      >
        {isStreaming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Script
          </>
        )}
      </Button>

      <p
        className="text-center text-xs"
        style={{ color: "var(--text-tertiary, #555250)" }}
      >
        Script will stream word by word · Hook validated after generation
      </p>
    </form>
  );
}
