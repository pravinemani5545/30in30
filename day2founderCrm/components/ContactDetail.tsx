"use client";

import { useState } from "react";
import { ExternalLink, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { ContactWithSuggestions, ContactStatus } from "@/types";
import { EnrichmentPanel } from "@/components/EnrichmentPanel";
import { NotesEditor } from "@/components/NotesEditor";
import { StatusSelector } from "@/components/StatusSelector";
import { SkeletonEnrichment } from "@/components/SkeletonEnrichment";
import { EmptyState } from "@/components/EmptyState";

interface ContactDetailProps {
  contact: ContactWithSuggestions | null;
  loading?: boolean;
  onBack?: () => void;
  onContactUpdate?: (updates: Partial<ContactWithSuggestions>) => void;
}

export function ContactDetail({
  contact,
  loading,
  onBack,
  onContactUpdate,
}: ContactDetailProps) {
  const [statusLoading, setStatusLoading] = useState(false);

  async function handleStatusChange(newStatus: ContactStatus) {
    if (!contact) return;
    setStatusLoading(true);

    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json() as { contact: ContactWithSuggestions };
      onContactUpdate?.(data.contact);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  }

  if (!contact && !loading) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        {/* Mobile back button */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="flex-1 min-w-0">
          {contact && (
            <>
              <h1
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {contact.full_name ?? contact.linkedin_username}
              </h1>
              {contact.company_name && (
                <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: 0 }}>
                  {contact.company_name}
                </p>
              )}
            </>
          )}
        </div>

        {contact && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusSelector
              status={contact.status}
              onChange={handleStatusChange}
              size="sm"
            />

            <a
              href={contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "4px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                transition: "color 150ms",
              }}
              className="hover:text-[color:var(--accent)]"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {loading ? (
          <SkeletonEnrichment />
        ) : contact ? (
          <div className="space-y-6">
            {/* Last contacted */}
            {contact.last_contacted_at && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                }}
              >
                <Calendar size={12} />
                Last contacted {new Date(contact.last_contacted_at).toLocaleDateString()}
              </div>
            )}

            {/* Enrichment cards */}
            {contact.enriched_at ? (
              <EnrichmentPanel contact={contact} />
            ) : (
              <div
                style={{
                  padding: "20px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  This contact hasn't been enriched yet. Paste their LinkedIn URL above to analyze.
                </p>
              </div>
            )}

            {/* Notes */}
            <NotesEditor
              contactId={contact.id}
              initialNotes={contact.notes}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
