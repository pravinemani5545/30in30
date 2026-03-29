"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { EmailGrade } from "@/types/day11";
import { useGrade } from "@/hooks/day11/useGrade";
import { useGrades } from "@/hooks/day11/useGrades";
import { SpamHighlighter } from "./SpamHighlighter";
import { ScoreDisplay } from "./ScoreDisplay";
import { DimensionBars } from "./DimensionBars";
import { RewritePanel } from "./RewritePanel";
import { HistorySidebar } from "./HistorySidebar";

export function GradingDashboard() {
  const [email, setEmail] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<EmailGrade | null>(null);
  const { grade, isLoading, error, gradeEmail, reset } = useGrade();
  const { grades: history, refresh: refreshHistory } = useGrades();

  const activeGrade = selectedGrade ?? grade;

  // Refresh history whenever a new grade completes
  useEffect(() => {
    if (grade) {
      refreshHistory();
    }
  }, [grade, refreshHistory]);

  const handleGrade = useCallback(async () => {
    setSelectedGrade(null);
    setShowResults(false);
    setAnimateScore(true);
    await gradeEmail(email);
    setShowResults(true);
    refreshHistory();
  }, [email, gradeEmail, refreshHistory]);

  const handleNewEmail = useCallback(() => {
    setEmail("");
    setShowResults(false);
    setAnimateScore(false);
    setSelectedGrade(null);
    reset();
  }, [reset]);

  const handleHistorySelect = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/day11/grades/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedGrade(data.grade);
        setEmail(data.grade.original_email);
        setShowResults(true);
        setAnimateScore(false);
      }
    } catch {
      // Silently fail
    }
  }, []);

  const charCount = email.length;

  return (
    <div className="flex h-[calc(100vh-49px)]">
      {/* Left: History Sidebar — hidden on mobile, shown on lg */}
      <div
        className="hidden lg:block w-[220px] shrink-0"
        style={{ background: "var(--surface)" }}
      >
        <HistorySidebar
          grades={history}
          onSelect={handleHistorySelect}
          onNew={handleNewEmail}
          activeId={activeGrade?.id}
        />
      </div>

      {/* Main content — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto w-full px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1
              className="font-serif text-2xl"
              style={{ color: "var(--foreground)" }}
            >
              OutreachGrader
            </h1>
            <p
              className="font-sans text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Paste a cold email. Get an honest score and a better version.
            </p>
          </div>

          {/* Main grid: input | score+dimensions | rewrite */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Email Input */}
            <div className="lg:col-span-1">
              <div
                className="rounded-md border p-4"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                {activeGrade && showResults ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-sans font-bold uppercase"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.08em",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        Original email
                      </span>
                      <button
                        type="button"
                        onClick={handleNewEmail}
                        className="text-xs font-sans font-bold"
                        style={{ color: "var(--accent)" }}
                      >
                        New
                      </button>
                    </div>
                    <div
                      className="font-sans whitespace-pre-wrap max-h-[500px] overflow-y-auto"
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "var(--foreground)",
                      }}
                    >
                      <SpamHighlighter
                        text={activeGrade.original_email}
                        spamWords={activeGrade.spam_words_found}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-sans font-bold uppercase"
                        style={{
                          fontSize: "10px",
                          letterSpacing: "0.08em",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        Cold email
                      </span>
                      <span
                        className="text-xs font-sans"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {charCount}/5000
                      </span>
                    </div>
                    <textarea
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Paste a cold email here — subject line, body, and signature..."
                      className="w-full resize-none font-sans focus:outline-none"
                      rows={14}
                      maxLength={5000}
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.6",
                        background: "transparent",
                        color: "var(--foreground)",
                      }}
                    />
                    {error && (
                      <p
                        className="mt-2 text-sm font-sans"
                        style={{ color: "#EF4444" }}
                      >
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleGrade}
                      disabled={isLoading || email.trim().length < 20}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-sans font-bold text-sm transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--background)",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Grading...
                        </>
                      ) : (
                        <>
                          Grade This Email
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Centre: Score + Dimensions */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-md border p-6 flex flex-col items-center justify-center"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      minHeight: "300px",
                    }}
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "var(--accent)" }}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="mt-3 font-sans text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Analyzing email...
                    </p>
                  </motion.div>
                )}

                {activeGrade && showResults && !isLoading && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border p-4 space-y-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <ScoreDisplay
                      score={activeGrade.overall_score}
                      animate={animateScore}
                    />
                    <DimensionBars grade={activeGrade} />
                  </motion.div>
                )}

                {!isLoading && !activeGrade && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-md border p-6 flex flex-col items-center justify-center"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                      minHeight: "300px",
                    }}
                  >
                    <p
                      className="font-sans text-sm text-center"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Paste a cold email and hit Grade to see your score.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Rewrite */}
            <div className="lg:col-span-1">
              {activeGrade && showResults && activeGrade.rewrite_email && (
                <RewritePanel grade={activeGrade} />
              )}
              {activeGrade && showResults && !activeGrade.rewrite_email && (
                <div
                  className="rounded-md border p-4 flex items-center justify-center"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    minHeight: "200px",
                  }}
                >
                  <p
                    className="font-sans text-sm text-center"
                    style={{ color: "#22C55E" }}
                  >
                    Score is 75+ — no rewrite needed. This email is ready to
                    send.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: History below content */}
          <div
            className="lg:hidden mt-6 border-t pt-4"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="font-sans font-bold uppercase mb-3"
              style={{
                fontSize: "10px",
                letterSpacing: "0.08em",
                color: "var(--text-tertiary)",
              }}
            >
              History {history.length > 0 && `(${history.length})`}
            </p>
            {history.length === 0 ? (
              <p
                className="text-xs font-sans"
                style={{ color: "var(--text-tertiary)" }}
              >
                Graded emails appear here.
              </p>
            ) : (
              <div className="space-y-1.5">
                {history.map((g) => {
                  const color =
                    g.overall_score < 60
                      ? "#EF4444"
                      : g.overall_score < 70
                        ? "#F97316"
                        : g.overall_score < 80
                          ? "#E8A020"
                          : "#22C55E";
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleHistorySelect(g.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md border"
                      style={{
                        borderColor:
                          g.id === activeGrade?.id ? color : "var(--border)",
                      }}
                    >
                      <span
                        className="text-xs font-sans truncate mr-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {g.original_email.slice(0, 50)}...
                      </span>
                      <span
                        className="text-xs font-sans font-bold shrink-0"
                        style={{ color }}
                      >
                        {g.overall_score}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
