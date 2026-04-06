"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useCompanies } from "@/hooks/day18/useCompanies";
import { useChangeFeed } from "@/hooks/day18/useChangeFeed";
import { WatchlistPanel } from "./WatchlistPanel";
import { ChangeFeed } from "./ChangeFeed";

export function CompanyTrackerDashboard() {
  const companiesState = useCompanies();
  const feedState = useChangeFeed();

  if (!companiesState.loading && !companiesState.authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-4 text-center">
        <LogIn size={32} className="mb-4" style={{ color: "var(--text-tertiary)" }} />
        <h2
          className="text-xl mb-2"
          style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
        >
          Sign in to track companies
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          CompanyTracker monitors websites daily and classifies changes with AI.
          Sign in to create your watchlist.
        </p>
        <Link
          href={`/login?redirectTo=/day18`}
          className="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          style={{ background: "var(--accent)", color: "var(--background)" }}
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)]">
      {/* Left panel — Watchlist (320px on desktop) */}
      <aside
        className="w-full lg:w-[320px] lg:min-w-[320px] border-b lg:border-b-0 lg:border-r overflow-y-auto"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <WatchlistPanel {...companiesState} />
      </aside>

      {/* Right panel — Change Feed */}
      <main className="flex-1 overflow-y-auto">
        <ChangeFeed {...feedState} />
      </main>
    </div>
  );
}
