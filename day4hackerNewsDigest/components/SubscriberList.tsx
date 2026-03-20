"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserMinus } from "lucide-react";

interface SubscriberRow {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

interface SubscriberListProps {
  subscribers: SubscriberRow[];
  onChanged: () => void;
}

export default function SubscriberList({ subscribers, onChanged }: SubscriberListProps) {
  async function handleDeactivate(id: string) {
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to deactivate subscriber");
        return;
      }
      toast.success("Subscriber deactivated");
      onChanged();
    } catch {
      toast.error("Something went wrong");
    }
  }

  if (subscribers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-sm text-text-secondary">
          No subscribers yet. Add the first one above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface divide-y divide-border">
      {subscribers.map((sub) => (
        <div key={sub.id} className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm text-text-primary truncate">{sub.email}</p>
            <p className="text-xs text-text-tertiary">
              {sub.name ? `${sub.name} · ` : ""}
              Added {new Date(sub.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-success/15 text-success">
              Active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeactivate(sub.id)}
              className="h-7 w-7 p-0 text-text-tertiary hover:text-error"
            >
              <UserMinus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
