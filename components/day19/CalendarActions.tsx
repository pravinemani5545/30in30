"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import type { ContentCalendar } from "@/types/day19";
import { exportToText } from "@/lib/day19/calendar/exporter";

interface Props {
  calendar: ContentCalendar;
}

export function CalendarActions({ calendar }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = exportToText(calendar);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const text = exportToText(calendar);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content-calendar-${calendar.month_label.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:opacity-80"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
          backgroundColor: "var(--surface)",
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        type="button"
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors hover:opacity-80"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
          backgroundColor: "var(--surface)",
        }}
      >
        <Download size={14} />
        Download
      </button>
    </div>
  );
}
