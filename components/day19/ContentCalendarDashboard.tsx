"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { LayoutGrid, List } from "lucide-react";
import type { CalendarInput, ContentCalendar } from "@/types/day19";
import { useGenerateCalendar } from "@/hooks/day19/useGenerateCalendar";
import { useCalendars } from "@/hooks/day19/useCalendars";
import { useCalendarFilters } from "@/hooks/day19/useCalendarFilters";
import { CalendarForm } from "./CalendarForm";
import { CalendarGrid } from "./CalendarGrid";
import { ListView } from "./ListView";
import { EffortWindowStrip } from "./EffortWindowStrip";
import { GenericOutputWarning } from "./GenericOutputWarning";
import { ConstraintWarning } from "./ConstraintWarning";
import { CalendarActions } from "./CalendarActions";
import { CalendarHistory } from "./CalendarHistory";

type ViewMode = "grid" | "list";

export function ContentCalendarDashboard() {
  const { generate, loading, error, authenticated } = useGenerateCalendar();
  const {
    calendars,
    loading: historyLoading,
    authenticated: historyAuth,
    refresh,
    loadFull,
    deleteCalendar,
  } = useCalendars();

  const [activeCalendar, setActiveCalendar] = useState<ContentCalendar | null>(
    null,
  );
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const posts = activeCalendar?.posts ?? [];
  const {
    platformFilter,
    setPlatformFilter,
    effortFilter,
    setEffortFilter,
    filtered,
  } = useCalendarFilters(posts);

  const isAuthenticated = authenticated && historyAuth;

  const handleGenerate = useCallback(
    async (input: CalendarInput) => {
      const result = await generate(input);
      if (result) {
        setActiveCalendar(result);
        setFormCollapsed(true);
        refresh();
        toast.success("30-day calendar generated");
      }
    },
    [generate, refresh],
  );

  const handleSelectHistory = useCallback(
    async (id: string) => {
      const full = await loadFull(id);
      if (full) {
        setActiveCalendar(full);
        setFormCollapsed(true);
      }
    },
    [loadFull],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await deleteCalendar(id);
      if (ok) {
        if (activeCalendar?.id === id) {
          setActiveCalendar(null);
          setFormCollapsed(false);
        }
        toast.success("Calendar deleted");
      }
    },
    [deleteCalendar, activeCalendar?.id],
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2
          className="text-xl mb-3"
          style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
        >
          Sign in to generate calendars
        </h2>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          ContentCalendar saves your calendars so you can revisit and refine
          them.
        </p>
        <a
          href={`/login?redirectTo=/day19`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--background)",
          }}
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left sidebar */}
        <div className="space-y-6">
          <CalendarForm
            onGenerate={handleGenerate}
            loading={loading}
            collapsed={formCollapsed}
            onToggleCollapse={() => setFormCollapsed(!formCollapsed)}
          />

          {error && (
            <p className="text-xs" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}

          {!historyLoading && (
            <CalendarHistory
              calendars={calendars}
              onSelect={handleSelectHistory}
              onDelete={handleDelete}
              selectedId={activeCalendar?.id}
            />
          )}
        </div>

        {/* Main content */}
        <div className="space-y-4">
          {!activeCalendar ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p
                  className="text-lg mb-2"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--text-secondary)",
                  }}
                >
                  No calendar yet
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Fill in the form and generate your 30-day content calendar.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2
                    className="text-xl"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "var(--foreground)",
                    }}
                  >
                    {activeCalendar.month_label}
                  </h2>
                  {activeCalendar.calendar_summary && (
                    <p
                      className="text-sm mt-0.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {activeCalendar.calendar_summary}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <CalendarActions calendar={activeCalendar} />
                  <div
                    className="flex items-center rounded-lg border overflow-hidden"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className="p-2 cursor-pointer transition-colors"
                      style={{
                        backgroundColor:
                          viewMode === "grid"
                            ? "var(--accent)"
                            : "var(--surface)",
                        color:
                          viewMode === "grid"
                            ? "var(--background)"
                            : "var(--text-secondary)",
                      }}
                    >
                      <LayoutGrid size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className="p-2 cursor-pointer transition-colors"
                      style={{
                        backgroundColor:
                          viewMode === "list"
                            ? "var(--accent)"
                            : "var(--surface)",
                        color:
                          viewMode === "list"
                            ? "var(--background)"
                            : "var(--text-secondary)",
                      }}
                    >
                      <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              <div className="space-y-2">
                {activeCalendar.generic_output_warning && (
                  <GenericOutputWarning />
                )}
                <ConstraintWarning
                  violations={activeCalendar.constraint_violations}
                />
              </div>

              {/* Effort strip */}
              <EffortWindowStrip posts={posts} />

              {/* Calendar view */}
              <div
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {viewMode === "grid" ? (
                  <CalendarGrid posts={posts} />
                ) : (
                  <ListView
                    posts={filtered}
                    allPosts={posts}
                    platformFilter={platformFilter}
                    effortFilter={effortFilter}
                    onPlatformFilter={setPlatformFilter}
                    onEffortFilter={setEffortFilter}
                  />
                )}
              </div>

              {/* Stats footer */}
              <div
                className="flex items-center gap-4 text-[10px] uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                <span>{posts.length} posts</span>
                <span>
                  {posts.filter((p) => p.effortLevel === "high").length} high-effort
                </span>
                <span>
                  {activeCalendar.generation_ms
                    ? `${(activeCalendar.generation_ms / 1000).toFixed(1)}s generation`
                    : ""}
                </span>
                <span>{activeCalendar.ai_model_used}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
