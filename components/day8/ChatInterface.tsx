"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { ChatEmptyState } from "./ChatEmptyState";
import type {
  ChatMessage as ChatMessageType,
  DocumentSummary,
  QueryResponse,
} from "@/types/day8";
import { toast } from "sonner";

interface ChatInterfaceProps {
  document: DocumentSummary | null;
}

export function ChatInterface({ document }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when document changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [document?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(question?: string) {
    const q = question ?? input.trim();
    if (!q || !document || document.status !== "ready" || isQuerying) return;

    const userMsg: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: q,
    };

    const loadingMsg: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsQuerying(true);

    try {
      const res = await fetch("/api/day8/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, documentId: document.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Query failed");
      }

      const data: QueryResponse = await res.json();

      const assistantMsg: ChatMessageType = {
        id: loadingMsg.id,
        role: "assistant",
        content: data.answer ?? "",
        sources: data.sources,
        noRelevantContent: data.noRelevantContent,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === loadingMsg.id ? assistantMsg : m))
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process query"
      );
      setMessages((prev) => prev.filter((m) => m.id !== loadingMsg.id));
    } finally {
      setIsQuerying(false);
    }
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full text-[#555250] text-sm">
        Select a document to start asking questions
      </div>
    );
  }

  if (document.status !== "ready") {
    return (
      <div className="flex items-center justify-center h-full text-[#8A8580] text-sm">
        Document is still processing...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <ChatEmptyState
            filename={document.filename}
            onSelectQuestion={(q) => handleSubmit(q)}
          />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[#262626] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={`Ask about ${document.filename}...`}
            className="min-h-[44px] max-h-[120px] resize-none bg-[#0F0F0F] border-[#262626] text-[#F5F0E8] placeholder:text-[#555250] focus:border-[#E8A020] focus:ring-0"
            rows={1}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isQuerying}
            className="shrink-0 bg-[#E8A020] hover:bg-[#D4911A] text-[#0A0A0A] h-11 w-11 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
