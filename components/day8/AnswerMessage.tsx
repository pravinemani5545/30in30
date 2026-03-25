"use client";

import { useState } from "react";
import { SourceChunk } from "./SourceChunk";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RetrievedChunk } from "@/types/day8";

interface AnswerMessageProps {
  answer: string;
  sources: RetrievedChunk[];
}

// Regex to find citation markers like (p.24), (pp.12-14), (pp.4,7,12)
const CITATION_REGEX = /\(pp?\.\d+[-,\d]*\)/g;

function renderAnswerWithCitations(text: string) {
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;

  const matches = text.matchAll(CITATION_REGEX);
  for (const match of matches) {
    const index = match.index;
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }
    parts.push(
      <span
        key={index}
        className="inline-flex items-center px-1 py-0.5 mx-0.5 rounded text-[11px] font-bold bg-[#E8A02015] border border-[#E8A020] text-[#E8A020]"
      >
        {match[0].slice(1, -1)}
      </span>
    );
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function AnswerMessage({ answer, sources }: AnswerMessageProps) {
  const [sourcesOpen, setSourcesOpen] = useState(true);

  return (
    <div className="space-y-3">
      <div className="text-[15px] text-[#F5F0E8] leading-relaxed whitespace-pre-wrap">
        {renderAnswerWithCitations(answer)}
      </div>

      {sources.length > 0 && (
        <div className="border-t border-[#262626] pt-2">
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="flex items-center gap-1 text-[13px] text-[#8A8580] hover:text-[#F5F0E8] transition-colors"
          >
            Sources ({sources.length})
            {sourcesOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>

          {sourcesOpen && (
            <div className="mt-1 divide-y divide-[#262626]">
              {sources.map((chunk) => (
                <SourceChunk key={chunk.id} chunk={chunk} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
