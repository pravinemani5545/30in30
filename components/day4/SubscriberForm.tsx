"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

interface SubscriberFormProps {
  onAdded: () => void;
}

export default function SubscriberForm({ onAdded }: SubscriberFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/day4/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add subscriber");
        return;
      }

      if (data.reactivated) {
        toast.success("Subscriber reactivated");
      } else {
        toast.success("Subscriber added");
      }

      setEmail("");
      setName("");
      onAdded();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="email"
        placeholder="subscriber@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-10 border-border bg-surface-input text-text-primary placeholder:text-text-tertiary"
      />
      <Input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-10 border-border bg-surface-input text-text-primary placeholder:text-text-tertiary"
      />
      <Button
        type="submit"
        disabled={loading}
        className="h-10 w-full bg-amber text-background hover:bg-amber-hover font-medium"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {loading ? "Adding..." : "Add Subscriber"}
      </Button>
    </form>
  );
}
