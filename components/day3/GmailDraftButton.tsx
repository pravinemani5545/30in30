"use client";

import { Mail } from "lucide-react";
import { useGmailDraft } from "@/hooks/day3/useGmailDraft";

interface GmailDraftButtonProps {
  tweetContent: string;
  articleTitle: string;
  articleUrl: string;
}

export function GmailDraftButton({
  tweetContent,
  articleTitle,
  articleUrl,
}: GmailDraftButtonProps) {
  const { createDraft, isLoading } = useGmailDraft();

  return (
    <button
      onClick={() => createDraft(tweetContent, articleTitle, articleUrl)}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50"
      style={{
        background: "transparent",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
      title="Draft in Gmail"
    >
      <Mail size={13} />
      {isLoading ? "Drafting..." : "Draft in Gmail"}
    </button>
  );
}
