"use client";

import type { ScriptSection as ScriptSectionType } from "@/types/day14";
import { ScriptSection } from "./ScriptSection";
import { WordCountBar } from "./WordCountBar";

interface StreamingScriptProps {
  sections: ScriptSectionType[];
  isStreaming: boolean;
  wordCount: number;
  targetWordCount: number;
}

export function StreamingScript({
  sections,
  isStreaming,
  wordCount,
  targetWordCount,
}: StreamingScriptProps) {
  return (
    <div className="space-y-3">
      {sections.map((section, i) => (
        <ScriptSection
          key={section.marker}
          section={section}
          isActive={isStreaming && i === sections.length - 1}
        />
      ))}
      {(sections.length > 0 || isStreaming) && (
        <div className="pt-2">
          <WordCountBar current={wordCount} target={targetWordCount} />
        </div>
      )}
    </div>
  );
}
