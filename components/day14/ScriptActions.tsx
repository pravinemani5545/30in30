"use client";

import { useRouter } from "next/navigation";
import { Copy, Check, RotateCcw, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/day14/useCopyToClipboard";
import { assembleFullText } from "@/lib/day14/script/parser";
import { GmailDraftButton } from "./GmailDraftButton";
import type { ScriptSection } from "@/types/day14";

interface ScriptActionsProps {
  sections: ScriptSection[];
  topic: string;
  scriptId?: string;
  onRegenerate?: () => void;
}

export function ScriptActions({
  sections,
  topic,
  scriptId,
  onRegenerate,
}: ScriptActionsProps) {
  const router = useRouter();
  const { copied, copy } = useCopyToClipboard();
  const fullText = assembleFullText(sections);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copy(fullText)}
        className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
      >
        {copied ? (
          <Check className="mr-1.5 h-3.5 w-3.5 text-[var(--hook-strong)]" />
        ) : (
          <Copy className="mr-1.5 h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy script"}
      </Button>
      <GmailDraftButton topic={topic} fullText={fullText} />
      {scriptId && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/day16?scriptId=${scriptId}`)}
          className="border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-subtle)]"
        >
          <Mic className="mr-1.5 h-3.5 w-3.5" />
          Generate Voiceover
        </Button>
      )}
      {onRegenerate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRegenerate}
          className="border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Re-generate
        </Button>
      )}
    </div>
  );
}
