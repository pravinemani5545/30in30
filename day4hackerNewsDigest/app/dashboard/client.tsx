"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { DigestRun } from "@/types";
import SubscriberForm from "@/components/SubscriberForm";
import SubscriberList from "@/components/SubscriberList";
import LastDigestPreview from "@/components/LastDigestPreview";
import DigestHistory from "@/components/DigestHistory";
import ManualTriggerButton from "@/components/ManualTriggerButton";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

interface SubscriberRow {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

interface DashboardClientProps {
  initialRuns: DigestRun[];
  initialSubscribers: SubscriberRow[];
}

export default function DashboardClient({
  initialRuns,
  initialSubscribers,
}: DashboardClientProps) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [runs, setRuns] = useState(initialRuns);
  const lastRun = runs.length > 0 ? runs[0] : null;

  const refreshData = useCallback(async () => {
    try {
      const [subsRes, runsRes] = await Promise.all([
        fetch("/api/subscribers"),
        fetch("/api/digest/history"),
      ]);
      if (subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscribers(subsData);
      }
      if (runsRes.ok) {
        const runsData = await runsRes.json();
        setRuns(runsData);
      }
    } catch {
      // Fallback: refresh the page
      router.refresh();
    }
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <h1 className="font-heading text-2xl text-text-primary">HN Digest</h1>
          <div className="flex items-center gap-3">
            <ManualTriggerButton onComplete={refreshData} />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-text-tertiary hover:text-text-primary"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[400px_1fr]">
          {/* Left Column: Subscriber Management + History */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-heading text-lg text-text-primary">
                Subscribers
              </h2>
              <SubscriberForm onAdded={refreshData} />
              <SubscriberList subscribers={subscribers} onChanged={refreshData} />
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg text-text-primary">
                Digest History
              </h2>
              <DigestHistory runs={runs} />
            </div>
          </div>

          {/* Right Column: Last Digest Preview */}
          <div>
            <LastDigestPreview lastRun={lastRun} />
          </div>
        </div>
      </main>
    </div>
  );
}
