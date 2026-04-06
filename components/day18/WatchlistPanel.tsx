"use client";

import { useState } from "react";
import { Eye, Mail, Loader2, Check } from "lucide-react";
import { AddUrlForm } from "./AddUrlForm";
import { CompanyRow } from "./CompanyRow";
import type { TrackedCompany } from "@/types/day18";

interface WatchlistPanelProps {
  companies: TrackedCompany[];
  loading: boolean;
  adding: boolean;
  addCompany: (url: string) => Promise<{ error?: string }>;
  removeCompany: (id: string) => Promise<{ error?: string }>;
}

export function WatchlistPanel({
  companies,
  loading,
  adding,
  addCompany,
  removeCompany,
}: WatchlistPanelProps) {
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  async function handleTestEmail() {
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/day18/test-email", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTestResult(`Sent to ${data.sent_to}`);
      } else {
        setTestResult(data.error ?? "Failed to send");
      }
    } catch {
      setTestResult("Failed to send");
    } finally {
      setSendingTest(false);
      setTimeout(() => setTestResult(null), 4000);
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: "var(--accent)" }} />
          <h2
            className="text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Watching {companies.length} compan{companies.length === 1 ? "y" : "ies"}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleTestEmail}
          disabled={sendingTest}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium cursor-pointer transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            border: "1px solid var(--border)",
            color: testResult?.startsWith("Sent") ? "var(--success)" : "var(--text-secondary)",
            backgroundColor: "var(--surface-raised)",
          }}
          title="Send a sample digest email to your account email"
        >
          {sendingTest ? (
            <Loader2 size={12} className="animate-spin" />
          ) : testResult?.startsWith("Sent") ? (
            <Check size={12} />
          ) : (
            <Mail size={12} />
          )}
          {testResult ?? "Test email"}
        </button>
      </div>

      <AddUrlForm onAdd={addCompany} adding={adding} />

      <div className="mt-4 space-y-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-md skeleton-pulse"
              style={{ background: "var(--surface-raised)" }}
            />
          ))
        ) : companies.length === 0 ? (
          <p
            className="text-sm py-8 text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            Add a company URL to start tracking
          </p>
        ) : (
          companies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              onRemove={removeCompany}
            />
          ))
        )}
      </div>
    </div>
  );
}
