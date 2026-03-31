"use client";

import { useState, useCallback } from "react";
import { useInterview } from "@/hooks/day13/useInterview";
import { useSynthesise } from "@/hooks/day13/useSynthesise";
import { useProfiles, useProfile } from "@/hooks/day13/useProfiles";
import { useDeleteProfile } from "@/hooks/day13/useDeleteProfile";
import { CompanyNameInput } from "./CompanyNameInput";
import { ProgressTracker } from "./ProgressTracker";
import { QuestionCard } from "./QuestionCard";
import { PreviousAnswers } from "./PreviousAnswers";
import { SynthesisLoadingState } from "./SynthesisLoadingState";
import { ICPProfile } from "./ICPProfile";
import { ICPHistory } from "./ICPHistory";
import { ICP_QUESTIONS } from "@/lib/day13/icp/questions";
import type { ICPProfile as ICPProfileType } from "@/types/day13";
import { toast } from "sonner";

export function ICPDashboard() {
  const interview = useInterview();
  const { synthesise, loading: synthesising, error: synthError, step } = useSynthesise();
  const { items: historyItems, loading: historyLoading, refresh: refreshHistory } = useProfiles();
  const { deleteProfile, deleting } = useDeleteProfile();

  const [completedProfile, setCompletedProfile] = useState<ICPProfileType | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>(null);

  const { profile: selectedProfile, loading: selectedLoading } = useProfile(selectedHistoryId);

  // Show selected history profile or completed interview profile
  const activeProfile = selectedHistoryId ? selectedProfile : completedProfile;

  const handleSubmitAnswer = useCallback(
    async (value: string) => {
      const isLast = interview.currentIndex === ICP_QUESTIONS.length - 1;
      interview.submitAnswer(value);

      if (isLast) {
        // After submitting last answer, answers are updated via the hook
        // We need the updated answers which include this last one
        const lastQuestion = ICP_QUESTIONS[interview.currentIndex];
        const finalAnswers = {
          ...interview.answers,
          [lastQuestion.key]: value.trim(),
        };

        const profile = await synthesise(interview.companyName, finalAnswers);
        if (profile) {
          setCompletedProfile(profile);
          interview.markComplete();
          refreshHistory();
          toast.success("ICP profile generated");
        } else {
          toast.error(synthError ?? "Synthesis failed");
        }
      }
    },
    [interview, synthesise, synthError, refreshHistory],
  );

  const handleNewInterview = useCallback(() => {
    interview.reset();
    setCompletedProfile(null);
    setSelectedHistoryId(null);
  }, [interview]);

  const handleSelectHistory = useCallback((id: string) => {
    setSelectedHistoryId(id);
    setCompletedProfile(null);
  }, []);

  const handleDeleteProfile = useCallback(
    async (id: string) => {
      const ok = await deleteProfile(id);
      if (ok) {
        if (selectedHistoryId === id) {
          setSelectedHistoryId(null);
        }
        refreshHistory();
        toast.success("Profile deleted");
      }
    },
    [deleteProfile, selectedHistoryId, refreshHistory],
  );

  const handleNodeClick = useCallback((index: number) => {
    setScrollToIndex(index);
    setTimeout(() => setScrollToIndex(null), 500);
  }, []);

  // Show completed profile view
  if (activeProfile && !synthesising) {
    return (
      <div className="flex">
        {/* Sidebar */}
        <aside
          className="hidden lg:block w-56 flex-shrink-0 border-r p-4 min-h-[calc(100vh-49px)]"
          style={{ borderColor: "var(--border)" }}
        >
          <ICPHistory
            items={historyItems}
            loading={historyLoading}
            selectedId={selectedHistoryId ?? activeProfile.id}
            onSelect={handleSelectHistory}
            onDelete={handleDeleteProfile}
            deleting={deleting}
          />
        </aside>

        <main className="flex-1">
          <ICPProfile
            profile={activeProfile}
            onNewInterview={handleNewInterview}
          />
        </main>
      </div>
    );
  }

  // Idle — show company name input
  if (interview.state === "idle") {
    return (
      <div className="flex">
        {historyItems.length > 0 && (
          <aside
            className="hidden lg:block w-56 flex-shrink-0 border-r p-4 min-h-[calc(100vh-49px)]"
            style={{ borderColor: "var(--border)" }}
          >
            <ICPHistory
              items={historyItems}
              loading={historyLoading}
              selectedId={selectedHistoryId}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteProfile}
              deleting={deleting}
            />
          </aside>
        )}
        <main className="flex-1">
          <CompanyNameInput onStart={interview.startInterview} />
        </main>
      </div>
    );
  }

  // Submitting — show loading state
  if (interview.state === "submitting" || synthesising) {
    return <SynthesisLoadingState step={step} />;
  }

  // Active interview — two-panel layout
  return (
    <div className="flex">
      {/* Left: progress tracker (desktop) */}
      <aside
        className="hidden lg:flex flex-col items-center w-16 flex-shrink-0 border-r pt-8"
        style={{ borderColor: "var(--border)" }}
      >
        <ProgressTracker
          currentIndex={interview.currentIndex}
          answeredCount={Object.keys(interview.answers).length}
          onNodeClick={handleNodeClick}
        />
      </aside>

      {/* Mobile progress dots */}
      <div className="lg:hidden fixed top-[49px] left-0 right-0 z-10 flex items-center justify-center gap-1.5 py-2 border-b"
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
      >
        {ICP_QUESTIONS.map((q, i) => {
          const answered = i < Object.keys(interview.answers).length;
          const active = i === interview.currentIndex;
          return (
            <div
              key={q.key}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: answered
                  ? "var(--q-completed)"
                  : active
                    ? "var(--q-active)"
                    : "var(--q-pending)",
              }}
            />
          );
        })}
      </div>

      {/* Right: question area */}
      <main className="flex-1 max-w-2xl mx-auto px-4 pt-8 lg:pt-8 mt-10 lg:mt-0">
        {/* Progress counter */}
        <div
          className="text-xs font-bold mb-6"
          style={{ color: "var(--text-tertiary)" }}
        >
          Question {interview.currentIndex + 1} of {interview.totalQuestions}
        </div>

        {/* Previous answers */}
        <PreviousAnswers
          answers={interview.answers}
          answeredCount={Object.keys(interview.answers).length}
          scrollToIndex={scrollToIndex}
        />

        {/* Current question */}
        {interview.currentQuestion && (
          <QuestionCard
            question={interview.currentQuestion}
            index={interview.currentIndex}
            total={interview.totalQuestions}
            onSubmit={handleSubmitAnswer}
            isLastQuestion={interview.currentIndex === ICP_QUESTIONS.length - 1}
          />
        )}
      </main>
    </div>
  );
}
