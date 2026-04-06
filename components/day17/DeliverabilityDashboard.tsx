"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { DomainForm } from "./DomainForm";
import { GradeBadge } from "./GradeBadge";
import { CheckCardList } from "./CheckCardList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { CheckHistory } from "./CheckHistory";
import { useDeliverabilityCheck } from "@/hooks/day17/useDeliverabilityCheck";
import { useCheckHistory } from "@/hooks/day17/useCheckHistory";
import type { Grade } from "@/types/day17";

export function DeliverabilityDashboard() {
  const { report, loading, error, checkDomain, setReport } =
    useDeliverabilityCheck();
  const {
    history,
    loading: historyLoading,
    refresh,
    loadReport,
  } = useCheckHistory();

  const handleCheck = useCallback(
    async (domain: string) => {
      await checkDomain(domain);
      refresh();
    },
    [checkDomain, refresh],
  );

  const handleHistorySelect = useCallback(
    async (id: string) => {
      const loaded = await loadReport(id);
      if (loaded) {
        setReport(loaded);
      } else {
        toast.error("Could not load saved report");
      }
    },
    [loadReport, setReport],
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto px-4 py-8">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col items-center gap-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield size={28} style={{ color: "var(--accent)" }} />
            <h2
              className="text-2xl"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--foreground)",
              }}
            >
              Deliverability Check
            </h2>
            <p
              className="text-sm max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              Enter a domain to check SPF, DKIM, DMARC, MX records, and domain
              age. Get a deliverability grade with actionable remediation steps.
            </p>
          </div>

          {/* Domain form */}
          <DomainForm onSubmit={handleCheck} loading={loading} />

          {/* Error */}
          {error && (
            <p className="text-sm" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <div className="w-full max-w-[620px]">
              <p
                className="text-sm text-center mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Checking DNS records...
              </p>
              <LoadingSkeleton />
            </div>
          )}

          {/* Results */}
          {report && !loading && (
            <div className="w-full max-w-[620px] space-y-8">
              <GradeBadge
                grade={report.overall_grade as Grade}
                score={report.overall_score}
              />

              {/* Overall summary */}
              {report.explanations?.overallSummary && (
                <p
                  className="text-sm text-center leading-relaxed max-w-lg mx-auto"
                  style={{
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                  }}
                >
                  {report.explanations.overallSummary}
                </p>
              )}

              {/* Performance */}
              <div
                className="flex items-center justify-center gap-4 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                <span>DNS: {report.lookup_ms}ms</span>
                <span>AI: {report.ai_ms}ms</span>
                <span>{report.ai_model_used}</span>
              </div>

              <CheckCardList report={report} />
            </div>
          )}
        </div>
      </div>

      {/* History sidebar */}
      <div className="lg:w-[280px] shrink-0">
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.1em" }}
        >
          Recent Checks
        </h3>
        <CheckHistory
          history={history}
          loading={historyLoading}
          onSelect={handleHistorySelect}
        />
      </div>
    </div>
  );
}
