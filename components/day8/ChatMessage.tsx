"use client";

import { AnswerMessage } from "./AnswerMessage";
import { NoRelevantContentState } from "./NoRelevantContentState";
import { ThinkingDots } from "./ThinkingDots";
import type { ChatMessage as ChatMessageType } from "@/types/day8";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-xl ${
          isUser
            ? "bg-[#E8A02018] border-r-2 border-[#E8A020]"
            : "bg-[#111111]"
        }`}
      >
        {message.isLoading ? (
          <ThinkingDots />
        ) : message.noRelevantContent ? (
          <NoRelevantContentState />
        ) : isUser ? (
          <p className="text-[15px] text-[#F5F0E8] leading-relaxed">
            {message.content}
          </p>
        ) : (
          <AnswerMessage
            answer={message.content}
            sources={message.sources ?? []}
          />
        )}
      </div>
    </div>
  );
}
