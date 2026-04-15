"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useClassifier } from "@/hooks/day21/useClassifier";
import { useClassifiedReplies } from "@/hooks/day21/useClassifiedReplies";
import { ClassifyResultCard } from "./ClassifyResultCard";
import { ReplyHistoryTable } from "./ReplyHistoryTable";

export function ReplyClassifierDashboard() {
  const [replyText, setReplyText] = useState("");
  const [sender, setSender] = useState("");

  const {
    classify,
    result,
    loading,
    error,
    authenticated: classifyAuth,
  } = useClassifier();
  const {
    items,
    loading: historyLoading,
    refresh,
    authenticated: repliesAuth,
  } = useClassifiedReplies();

  const authenticated = classifyAuth && repliesAuth;

  async function handleClassify() {
    if (replyText.trim().length < 10) {
      toast("Reply text must be at least 10 characters", {
        style: {
          background: "#161616",
          border: "1px solid rgba(255,68,68,0.15)",
          color: "#ff4444",
          fontFamily: "var(--font-day21-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      return;
    }

    const saved = await classify({
      replyText: replyText.trim(),
      sender: sender.trim() || undefined,
    });

    if (saved) {
      toast("Reply classified successfully", {
        style: {
          background: "#161616",
          border: "1px solid rgba(0,255,65,0.15)",
          color: "#00FF41",
          fontFamily: "var(--font-day21-mono)",
          fontSize: "13px",
          borderRadius: 0,
        },
      });
      refresh();
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "14px",
              color: "#999",
            }}
          >
            {">"} authentication required
          </p>
          <Link
            href={`/login?redirectTo=${encodeURIComponent("/day21")}`}
            className="inline-block px-6 py-3 transition-all"
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "14px",
              fontWeight: 700,
              background: "#00FF41",
              color: "#000",
              borderRadius: 0,
            }}
          >
            [ SIGN IN ]
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Input section */}
      <section className="space-y-4">
        <span
          className="block"
          style={{
            fontFamily: "var(--font-day21-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          CLASSIFY REPLY
        </span>

        {/* Sender field */}
        <div className="space-y-1">
          <label
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "12px",
              color: "#999999",
            }}
          >
            sender (optional)
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="john@company.com"
            className="w-full px-3 py-2"
            style={{
              fontFamily: "var(--font-day21-body)",
              fontSize: "14px",
              color: "#eeeeee",
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
              outline: "none",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "#00FF41")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "#2a2a2a")
            }
          />
        </div>

        {/* Reply text area */}
        <div className="space-y-1">
          <label
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "12px",
              color: "#999999",
            }}
          >
            email reply text
          </label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Paste the email reply here..."
            className="w-full px-3 py-2"
            style={{
              fontFamily: "var(--font-day21-body)",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#eeeeee",
              background: "#111111",
              border: "1px solid #2a2a2a",
              borderRadius: 0,
              outline: "none",
              resize: "none",
              height: "200px",
              overflowY: "auto",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "#00FF41")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "#2a2a2a")
            }
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="p-3"
            style={{
              fontFamily: "var(--font-day21-mono)",
              fontSize: "13px",
              color: "#ff4444",
              background: "rgba(255,68,68,0.05)",
              border: "1px solid rgba(255,68,68,0.15)",
              borderRadius: 0,
            }}
          >
            {">"} error: {error}
          </div>
        )}

        {/* Classify button */}
        <button
          onClick={handleClassify}
          disabled={loading || replyText.trim().length < 10}
          className="w-full py-3 transition-all"
          style={{
            fontFamily: "var(--font-day21-mono)",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "1px",
            color: loading || replyText.trim().length < 10 ? "#555555" : "#000000",
            background:
              loading || replyText.trim().length < 10 ? "#1a1a1a" : "#00FF41",
            border: "1px solid",
            borderColor:
              loading || replyText.trim().length < 10 ? "#2a2a2a" : "#00FF41",
            borderRadius: 0,
            cursor:
              loading || replyText.trim().length < 10
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? "[ CLASSIFYING... ]" : "[ CLASSIFY REPLY ]"}
        </button>
      </section>

      {/* Result card */}
      {result && <ClassifyResultCard item={result} />}

      {/* History section */}
      <section className="space-y-3">
        <span
          className="block"
          style={{
            fontFamily: "var(--font-day21-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          CLASSIFICATION HISTORY
        </span>

        <div
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
            borderRadius: 0,
          }}
        >
          {historyLoading ? (
            <div
              className="p-6 text-center"
              style={{
                fontFamily: "var(--font-day21-mono)",
                fontSize: "13px",
                color: "#555555",
              }}
            >
              {">"} loading history...
            </div>
          ) : (
            <ReplyHistoryTable items={items} />
          )}
        </div>
      </section>
    </main>
  );
}
