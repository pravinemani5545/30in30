"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { CodeInput } from "./CodeInput";
import { ReviewResults } from "./ReviewResults";
import { ReviewHistory } from "./ReviewHistory";
import { ReviewLoadingState } from "./ReviewLoadingState";
import { useReview } from "@/hooks/day10/useReview";
import { useReviews } from "@/hooks/day10/useReviews";
import type { CodeReview } from "@/types/day10";

export function ReviewDashboard() {
  const { review, isLoading, error, submitReview, reset } = useReview();
  const { reviews, isLoading: historyLoading, refetch } = useReviews();
  const [selectedReview, setSelectedReview] = useState<CodeReview | null>(null);

  const handleSubmit = useCallback(
    async (code: string, language: string) => {
      setSelectedReview(null);
      await submitReview(code, language);
      refetch();
    },
    [submitReview, refetch]
  );

  const handleSelectHistory = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/day10/reviews/${id}`);
        const data = await res.json();
        if (res.ok) {
          setSelectedReview(data.review);
          reset();
        }
      } catch {
        toast.error("Failed to load review");
      }
    },
    [reset]
  );

  const activeReview = review ?? selectedReview;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar — History */}
      <aside
        className="w-full lg:w-[280px] shrink-0 overflow-y-auto border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-[11px] font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--text-tertiary)" }}
          >
            History
          </h2>
        </div>
        <ReviewHistory
          reviews={reviews}
          isLoading={historyLoading}
          onSelect={handleSelectHistory}
          selectedId={selectedReview?.id}
          onDeleted={refetch}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1
              className="text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
            >
              AICodeReviewer
            </h1>
            <p
              className="text-[14px] mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Paste code. Get an adversarial production review.
            </p>
          </div>

          {/* Code input */}
          <CodeInput onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Error */}
          {error && (
            <div
              className="p-3 text-[13px]"
              style={{
                background: "rgb(239 68 68 / 0.08)",
                border: "1px solid rgb(239 68 68 / 0.2)",
                borderRadius: 6,
                color: "var(--error)",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && <ReviewLoadingState />}

          {/* Results */}
          {activeReview && activeReview.status === "complete" && (
            <ReviewResults review={activeReview} />
          )}

          {activeReview && activeReview.status === "failed" && (
            <div
              className="p-3 text-[13px]"
              style={{
                background: "rgb(239 68 68 / 0.08)",
                border: "1px solid rgb(239 68 68 / 0.2)",
                borderRadius: 6,
                color: "var(--error)",
              }}
            >
              Review failed: {activeReview.error_message ?? "Unknown error"}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
