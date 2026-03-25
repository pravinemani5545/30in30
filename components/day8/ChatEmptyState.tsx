"use client";

import { FileSearch } from "lucide-react";

interface ChatEmptyStateProps {
  filename: string;
  onSelectQuestion: (question: string) => void;
}

const EXAMPLE_QUESTIONS = [
  "What is the main argument of this document?",
  "Summarise the key findings.",
  "What does the author recommend?",
];

export function ChatEmptyState({
  filename,
  onSelectQuestion,
}: ChatEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 space-y-6">
      <FileSearch className="h-12 w-12 text-[#555250]" />
      <div className="space-y-2">
        <p className="text-[#F5F0E8] text-lg font-serif">
          Ask anything about{" "}
          <span className="text-[#E8A020]">{filename}</span>
        </p>
        <p className="text-[#8A8580] text-sm">
          Your questions will be answered with page citations
        </p>
      </div>

      <div className="space-y-2 w-full max-w-md">
        {EXAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelectQuestion(q)}
            className="w-full text-left px-4 py-3 rounded-lg border border-[#262626] text-[#8A8580] hover:text-[#F5F0E8] hover:border-[#E8A020] transition-colors text-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
