"use client";

import { LogIn } from "lucide-react";

export function SaveNudge() {
  return (
    <div className="flex items-center justify-center gap-2 py-4 px-5 bg-surface border border-border rounded-lg">
      <LogIn className="w-4 h-4 text-text-muted" />
      <p className="text-sm text-text-muted">
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
