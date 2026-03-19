"use client";

import { useState, useEffect, useCallback } from "react";
import type { ContactWithSuggestions } from "@/types";

export function useContact(id: string | null) {
  const [contact, setContact] = useState<ContactWithSuggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/contacts/${id}`);
      if (!res.ok) throw new Error("Contact not found");
      const data = await res.json() as { contact: ContactWithSuggestions };
      setContact(data.contact);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchContact();
  }, [fetchContact]);

  async function updateContact(updates: Record<string, unknown>) {
    if (!id) return;

    // Optimistic update
    setContact((prev) => (prev ? { ...prev, ...updates } : prev));

    const res = await fetch(`/api/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      // Revert on failure
      void fetchContact();
      throw new Error("Failed to update contact");
    }

    const data = await res.json() as { contact: ContactWithSuggestions };
    setContact((prev) =>
      prev ? { ...prev, ...data.contact } : data.contact
    );
    return data.contact;
  }

  return { contact, loading, error, setContact, updateContact, refetch: fetchContact };
}
