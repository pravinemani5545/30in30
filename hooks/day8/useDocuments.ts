"use client";

import { useState, useEffect, useCallback } from "react";
import type { DocumentSummary } from "@/types/day8";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/day8/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateDocument = useCallback(
    (id: string, updates: Partial<DocumentSummary>) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    []
  );

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addDocument = useCallback((doc: DocumentSummary) => {
    setDocuments((prev) => [doc, ...prev]);
  }, []);

  return {
    documents,
    isLoading,
    refresh,
    updateDocument,
    removeDocument,
    addDocument,
  };
}
