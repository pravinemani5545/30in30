"use client";

import { LogIn } from "lucide-react";

export function SaveNudge() {
  return (
    <div className="flex items-center justify-center gap-2 py-3 px-4 bg-surface border border-border rounded-lg">
      <LogIn className="w-3.5 h-3.5 text-text-muted" />
      <p className="text-xs text-text-muted">
        <a
          href="/login"
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Sign in
        </a>{" "}
        to save your results and track improvement.
      </p>
    </div>
  );
}
