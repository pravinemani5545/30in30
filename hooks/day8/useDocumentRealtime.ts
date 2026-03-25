"use client";

import { useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import type { DocumentStatus } from "@/types/day8";

interface RealtimePayload {
  new: {
    id: string;
    status: DocumentStatus;
    page_count: number | null;
    chunk_count: number;
    error_message: string | null;
  };
}

export function useDocumentRealtime(
  documentId: string | null,
  onStatusChange: (status: DocumentStatus, updates: Record<string, unknown>) => void
) {
  useEffect(() => {
    if (!documentId) return;

    const supabase = createSupabaseBrowser();

    const channel = supabase
      .channel(`document-${documentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
          filter: `id=eq.${documentId}`,
        },
        (payload: RealtimePayload) => {
          const { status, page_count, chunk_count, error_message } =
            payload.new;
          onStatusChange(status, {
            page_count,
            chunk_count,
            error_message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, onStatusChange]);
}
