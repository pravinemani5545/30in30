"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToneSelect } from "./ToneSelect";
import { Sparkles, Loader2 } from "lucide-react";

interface ConceptFormProps {
  onSubmit: (data: {
    videoTitle: string;
    niche: string;
    tone: string;
  }) => void;
  loading: boolean;
  error: string | null;
}

export function ConceptForm({ onSubmit, loading, error }: ConceptFormProps) {
  const [videoTitle, setVideoTitle] = useState("");
  const [niche, setNiche] = useState("");
  const [tone, setTone] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ videoTitle, niche, tone });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label
          className="text-[13px] font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Video Title
        </label>
        <Input
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="What's your video about? (e.g. 'I quit my job to trade crypto for 30 days')"
          className="h-10 text-[13px]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <label
          className="text-[13px] font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Niche
        </label>
        <Input
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g. Personal Finance, Fitness, Gaming, Tech Reviews"
          className="h-10 text-[13px]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
          disabled={loading}
        />
      </div>

      <ToneSelect value={tone} onChange={setTone} />

      <Button
        type="submit"
        disabled={loading || !videoTitle.trim() || !niche.trim() || !tone}
        className="w-full h-10 text-sm font-medium rounded-md transition-colors"
        style={{
          backgroundColor: loading ? "var(--surface-raised)" : "var(--accent)",
          color: loading ? "var(--text-tertiary)" : "var(--background)",
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Concepts
          </span>
        )}
      </Button>

      <p
        className="text-center text-[12px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        Takes 20-30 seconds · Powered by Paddy Galloway&apos;s framework
      </p>

      {error && (
        <p
          className="text-[13px] text-center"
          style={{ color: "var(--error)" }}
        >
          {error}
        </p>
      )}
    </form>
  );
}
