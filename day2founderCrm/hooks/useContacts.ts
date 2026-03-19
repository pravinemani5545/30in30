"use client";

import { useState, useEffect, useCallback } from "react";
import type { Contact, ContactStatus } from "@/types";

interface UseContactsOptions {
  status?: ContactStatus | "all";
  search?: string;
}

export function useContacts(options: UseContactsOptions = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (options.status && options.status !== "all") {
      params.set("status", options.status);
    }
    if (options.search) {
      params.set("search", options.search);
    }

    try {
      const res = await fetch(`/api/contacts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json() as { contacts: Contact[] };
      setContacts(data.contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [options.status, options.search]);

  useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  function addContact(contact: Contact) {
    setContacts((prev) => {
      const exists = prev.find((c) => c.id === contact.id);
      if (exists) {
        return prev.map((c) => (c.id === contact.id ? contact : c));
      }
      return [contact, ...prev];
    });
  }

  function updateContact(id: string, updates: Partial<Contact>) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }

  return { contacts, loading, error, refetch: fetchContacts, addContact, updateContact };
}
