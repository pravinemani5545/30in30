"use client";

import { useState, useCallback } from "react";
import { Briefcase, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useGenerateBriefing } from "@/hooks/day9/useGenerateBriefing";
import { useBriefingRealtime } from "@/hooks/day9/useBriefingRealtime";
import { useBriefings } from "@/hooks/day9/useBriefings";
import { BriefingForm } from "@/components/day9/BriefingForm";
import { ResearchStatus } from "@/components/day9/ResearchStatus";
import { BriefingDocument } from "@/components/day9/BriefingDocument";
import { HistorySidebar } from "@/components/day9/HistorySidebar";
import { EmptyState } from "@/components/day9/EmptyState";
import { Button } from "@/components/ui/button";
import type { Briefing } from "@/types/day9";
import Link from "next/link";

export default function DashboardPage() {
  const { generate, isGenerating, error } = useGenerateBriefing();
  const { briefings, isLoading: historyLoading, refresh, removeBriefing, addBriefing } =
    useBriefings();
  const [activeBriefing, setActiveBriefing] = useState<Briefing | null>(null);
  const [pendingBriefingId, setPendingBriefingId] = useState<string | null>(
    null
  );
  const [formInputs, setFormInputs] = useState<{
    personName: string;
    companyName: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const realtimeState = useBriefingRealtime(pendingBriefingId);

  const handleGenerate = useCallback(
    async (personName: string, companyName: string, meetingContext: string) => {
      setActiveBriefing(null);
      setFormInputs({ personName, companyName });

      const result = await generate(personName, companyName, meetingContext);

      if (result && result.status === "complete") {
        setActiveBriefing(result);
        setPendingBriefingId(null);
        setFormInputs(null);
        addBriefing({
          id: result.id,
          person_name: result.person_name,
          company_name: result.company_name,
          meeting_context: result.meeting_context,
          created_at: result.created_at,
          was_cached: result.was_cached,
          status: result.status,
        });
        toast.success("Briefing generated successfully");
      } else if (result) {
        // Got a briefing ID but not complete — subscribe for Realtime
        setPendingBriefingId(result.id);
      } else {
        setFormInputs(null);
      }
    },
    [generate, addBriefing]
  );

  const handleSelectFromHistory = useCallback(async (id: string) => {
    setMobileMenuOpen(false);
    setPendingBriefingId(null);
    setFormInputs(null);

    try {
      const response = await fetch(`/api/day9/briefings/${id}`);
      if (response.ok) {
        const briefing = (await response.json()) as Briefing;
        setActiveBriefing(briefing);
      } else {
        toast.error("Failed to load briefing");
      }
    } catch {
      toast.error("Failed to load briefing");
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/day9/briefings/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        removeBriefing(id);
        if (activeBriefing?.id === id) {
          setActiveBriefing(null);
        }
        toast.success("Briefing deleted");
      } else {
        toast.error("Failed to delete briefing");
      }
    },
    [removeBriefing, activeBriefing]
  );

  async function handleSignOut() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/login?redirectTo=/day9/dashboard";
  }

  const showResearchStatus =
    isGenerating && formInputs && !activeBriefing;

  return (
    <div data-day="9" className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0 print-hidden">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1 text-[var(--text-secondary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Link
            href="/"
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
            title="Back to hub"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Briefcase className="h-5 w-5 text-[#E8A020]" />
          <span className="font-serif text-lg text-[var(--foreground)]">
            MeetingPrep
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-[var(--text-secondary)] hover:text-[var(--foreground)]"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sign out
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane — history sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } lg:block w-full lg:w-72 border-r border-[var(--border)] bg-[var(--background)] shrink-0 overflow-hidden absolute lg:relative z-10 h-[calc(100vh-52px)] lg:h-auto print-hidden`}
        >
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              History
            </h2>
          </div>
          <HistorySidebar
            briefings={briefings}
            activeBriefingId={activeBriefing?.id ?? null}
            onSelect={handleSelectFromHistory}
            onDelete={handleDelete}
            isLoading={historyLoading}
          />
        </aside>

        {/* Right pane — main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 lg:p-8">
            {/* Form section */}
            <div className="mb-8 print-hidden">
              {showResearchStatus ? (
                <ResearchStatus
                  searchSteps={realtimeState.searchSteps}
                  synthesisComplete={realtimeState.synthesisComplete}
                  status={realtimeState.status}
                  personName={formInputs.personName}
                  companyName={formInputs.companyName}
                  errorMessage={realtimeState.errorMessage}
                />
              ) : (
                <BriefingForm
                  onSubmit={handleGenerate}
                  isGenerating={isGenerating}
                />
              )}
              {error && !showResearchStatus && (
                <p className="text-sm text-[#EF4444] mt-3">{error}</p>
              )}
            </div>

            {/* Briefing output */}
            {activeBriefing && activeBriefing.status === "complete" ? (
              <BriefingDocument briefing={activeBriefing} />
            ) : (
              !isGenerating &&
              !activeBriefing && <EmptyState />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
