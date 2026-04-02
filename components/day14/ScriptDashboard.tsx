"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useScriptGeneration } from "@/hooks/day14/useScriptGeneration";
import { useSaveScript } from "@/hooks/day14/useSaveScript";
import { useHookValidation } from "@/hooks/day14/useHookValidation";
import { useScripts, useScript } from "@/hooks/day14/useScripts";
import { useDeleteScript } from "@/hooks/day14/useDeleteScript";
import { calcTargetWordCount } from "@/lib/day14/script/structure";
import { ScriptForm } from "./ScriptForm";
import { StreamingScript } from "./StreamingScript";
import { ScriptActions } from "./ScriptActions";
import { HookBadge } from "./HookBadge";
import { ScriptLibrary } from "./ScriptLibrary";
import { EmptyState } from "./EmptyState";
import type { ScriptSection } from "@/types/day14";

type ViewMode = "form" | "generating" | "viewing";

export function ScriptDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [activeTopic, setActiveTopic] = useState("");
  const [activeDuration, setActiveDuration] = useState(8);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);

  // Hooks
  const {
    sections: streamSections,
    isStreaming,
    error: genError,
    wordCount: streamWordCount,
    completion,
    generationMs,
    generate,
    reset,
  } = useScriptGeneration();

  const { saveScript, isSaving, savedScriptId } = useSaveScript();
  const hookValidation = useHookValidation(activeScriptId ?? savedScriptId);
  const { scripts, loading: scriptsLoading, refresh: refreshScripts } = useScripts();
  const { deleteScript } = useDeleteScript();
  const { script: loadedScript, hookValidation: loadedHookVal } = useScript(
    viewMode === "viewing" ? activeScriptId : null,
  );

  // Auto-save after streaming completes
  useEffect(() => {
    if (!isStreaming && completion && viewMode === "generating") {
      const targetWordCount = calcTargetWordCount(activeDuration);
      void saveScript({
        topic: activeTopic,
        targetDuration: activeDuration,
        targetWordCount,
        actualWordCount: streamWordCount,
        scriptContent: completion,
        sections: streamSections,
        generationMs,
      }).then((id) => {
        if (id) {
          setActiveScriptId(id);
          void refreshScripts();
          toast.success("Script saved");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming, completion]);

  // Handle generation errors
  useEffect(() => {
    if (genError) {
      toast.error(genError);
      setViewMode("form");
    }
  }, [genError]);

  const handleGenerate = useCallback(
    (topic: string, duration: number) => {
      reset();
      setActiveTopic(topic);
      setActiveDuration(duration);
      setActiveScriptId(null);
      setViewMode("generating");
      void generate(topic, duration);
    },
    [generate, reset],
  );

  const handleSelectScript = useCallback((id: string) => {
    setActiveScriptId(id);
    setViewMode("viewing");
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = await deleteScript(id);
      if (ok) {
        toast.success("Script deleted");
        if (activeScriptId === id) {
          setActiveScriptId(null);
          setViewMode("form");
        }
        void refreshScripts();
      }
    },
    [deleteScript, activeScriptId, refreshScripts],
  );

  const handleRegenerate = useCallback(() => {
    if (activeTopic) {
      handleGenerate(activeTopic, activeDuration);
    }
  }, [activeTopic, activeDuration, handleGenerate]);

  const handleNewScript = useCallback(() => {
    reset();
    setActiveScriptId(null);
    setActiveTopic("");
    setViewMode("form");
  }, [reset]);

  // Determine what sections and word count to display
  const displaySections: ScriptSection[] =
    viewMode === "viewing" && loadedScript?.sections
      ? (loadedScript.sections as ScriptSection[])
      : streamSections;

  const displayWordCount =
    viewMode === "viewing"
      ? loadedScript?.actual_word_count ?? 0
      : streamWordCount;

  const displayTargetWordCount =
    viewMode === "viewing"
      ? loadedScript?.target_word_count ?? calcTargetWordCount(activeDuration)
      : calcTargetWordCount(activeDuration);

  const displayTopic =
    viewMode === "viewing" ? loadedScript?.topic ?? activeTopic : activeTopic;

  const hookQuality =
    viewMode === "viewing"
      ? loadedHookVal?.quality ?? hookValidation?.quality ?? null
      : hookValidation?.quality ?? null;

  const hookReasoning =
    viewMode === "viewing"
      ? loadedHookVal?.reasoning ?? hookValidation?.reasoning ?? null
      : hookValidation?.reasoning ?? null;

  // Show pending badge once we have a saved script but no validation yet
  const showHookBadge =
    (savedScriptId || activeScriptId) &&
    (viewMode === "generating" || viewMode === "viewing");

  return (
    <div className="flex h-[calc(100vh-49px)]">
      {/* Sidebar — desktop only */}
      <aside
        className="hidden w-72 shrink-0 border-r md:block"
        style={{ borderColor: "var(--border)" }}
      >
        <ScriptLibrary
          scripts={scripts}
          loading={scriptsLoading}
          activeId={activeScriptId}
          onSelect={handleSelectScript}
          onDelete={handleDelete}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">
          {/* Form always visible at top when in form mode or as "new script" */}
          {viewMode === "form" ? (
            <>
              <ScriptForm
                onGenerate={handleGenerate}
                isStreaming={isStreaming}
              />
              <div className="mt-8">
                <EmptyState />
              </div>
            </>
          ) : (
            <>
              {/* Back to new script */}
              <button
                type="button"
                onClick={handleNewScript}
                className="mb-4 text-xs font-medium transition-colors hover:underline"
                style={{ color: "var(--accent)" }}
              >
                + New Script
              </button>

              {/* Topic + hook badge header */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2
                  className="text-lg font-medium"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  {displayTopic}
                </h2>
                {showHookBadge && (
                  <HookBadge quality={hookQuality} reasoning={hookReasoning} />
                )}
              </div>

              {/* Streaming / loaded script */}
              <StreamingScript
                sections={displaySections}
                isStreaming={isStreaming}
                wordCount={displayWordCount}
                targetWordCount={displayTargetWordCount}
              />

              {/* Actions — show after streaming or when viewing */}
              {!isStreaming && displaySections.length > 0 && (
                <div className="mt-4">
                  <ScriptActions
                    sections={displaySections}
                    topic={displayTopic}
                    onRegenerate={handleRegenerate}
                  />
                </div>
              )}

              {isSaving && (
                <p
                  className="mt-3 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Saving script...
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
