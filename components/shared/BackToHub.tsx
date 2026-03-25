"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToHub({ label }: { label?: string }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm transition-colors"
      style={{ color: "var(--text-secondary)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
    >
      <ArrowLeft className="w-4 h-4" />
      {label || "All Days"}
    </Link>
  );
}
