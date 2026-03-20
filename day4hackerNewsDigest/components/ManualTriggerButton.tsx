"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

interface ManualTriggerButtonProps {
  onComplete: () => void;
}

export default function ManualTriggerButton({ onComplete }: ManualTriggerButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleTrigger() {
    setLoading(true);
    try {
      const res = await fetch("/api/digest/preview", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to trigger digest");
        return;
      }

      if (data.skipped) {
        toast.info("Digest already sent today");
      } else if (data.success) {
        toast.success(
          `Digest sent to ${data.sentCount} subscriber${data.sentCount !== 1 ? "s" : ""}`
        );
      } else {
        toast.error(data.reason || "Digest failed");
      }

      onComplete();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleTrigger}
      disabled={loading}
      variant="outline"
      className="h-10 border-border bg-surface text-text-primary hover:bg-surface-raised hover:text-amber"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      {loading ? "Generating..." : "Send Test Digest"}
    </Button>
  );
}
