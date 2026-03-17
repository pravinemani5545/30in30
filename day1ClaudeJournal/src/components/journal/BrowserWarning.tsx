"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface BrowserWarningProps {
  onFallbackSubmit: (text: string) => void;
  isProcessing: boolean;
}

export function BrowserWarning({ onFallbackSubmit, isProcessing }: BrowserWarningProps) {
  const [text, setText] = useState("");

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-300">
            Voice not supported in this browser
          </p>
          <p className="text-xs text-amber-200/70">
            The Web Speech API isn&apos;t available in Firefox. Use Chrome, Edge, or Safari for voice.
            You can type your journal entry below instead.
          </p>
        </div>
      </div>

      <Textarea
        placeholder="Type your journal entry here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="bg-muted/30 border-border resize-none"
      />

      <Button
        onClick={() => onFallbackSubmit(text)}
        disabled={isProcessing || text.trim().split(/\s+/).length < 5}
        className="w-full"
      >
        {isProcessing ? "Analyzing…" : "Analyze entry"}
      </Button>
    </div>
  );
}
