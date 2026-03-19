"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { LinkedInInputForm } from "@/components/LinkedInInputForm";
import { ContactList } from "@/components/ContactList";
import { ContactDetail } from "@/components/ContactDetail";
import { useContact } from "@/hooks/useContact";
import type { Contact, ContactWithSuggestions } from "@/types";

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  const { contact, loading: contactLoading, setContact } = useContact(selectedId);

  const supabase = createSupabaseBrowser();

  function handleEnrichmentComplete(enriched: ContactWithSuggestions) {
    setSelectedId(enriched.id);
    setContact(enriched);
    setRecentContacts((prev) => {
      const filtered = prev.filter((c) => c.id !== enriched.id);
      return [enriched as Contact, ...filtered];
    });
    setShowMobileDetail(true);
  }

  function handleSelectContact(c: Contact) {
    setSelectedId(c.id);
    setShowMobileDetail(true);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      {/* Top bar */}
      <header
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "var(--background)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "18px",
            fontWeight: 400,
            color: "var(--foreground)",
            margin: 0,
          }}
        >
          FounderCRM
        </h1>

        <button
          onClick={handleSignOut}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-tertiary)",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12px",
            padding: "4px 6px",
            borderRadius: "4px",
            transition: "color 150ms",
          }}
          className="hover:text-[color:var(--text-secondary)]"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </header>

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar — hidden on mobile when detail is open */}
        <aside
          style={{
            width: "100%",
            maxWidth: "320px",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flexShrink: 0,
          }}
          className={`${showMobileDetail ? "hidden" : "flex"} lg:flex`}
        >
          {/* LinkedIn input */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <LinkedInInputForm onEnrichmentComplete={handleEnrichmentComplete} />
          </div>

          {/* Contact list */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ContactList
              activeContactId={selectedId}
              onSelectContact={handleSelectContact}
              extraContacts={recentContacts}
            />
          </div>
        </aside>

        {/* Detail panel */}
        <main
          style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}
          className={`${showMobileDetail ? "flex" : "hidden"} lg:flex`}
        >
          <ContactDetail
            contact={contact}
            loading={contactLoading}
            onBack={() => setShowMobileDetail(false)}
            onContactUpdate={(updates) => {
              setContact((prev) => (prev ? { ...prev, ...updates } : prev));
              // Keep sidebar in sync: update recentContacts so extraContacts reflects changes
              setRecentContacts((prev) => {
                const exists = prev.find((c) => c.id === selectedId);
                if (exists) {
                  return prev.map((c) =>
                    c.id === selectedId ? { ...c, ...(updates as Partial<Contact>) } : c
                  );
                }
                // Not in recentContacts yet (loaded from API) — add it so sidebar updates
                if (contact) {
                  return [{ ...contact, ...(updates as Partial<Contact>) } as Contact, ...prev];
                }
                return prev;
              });
            }}
          />
        </main>
      </div>
    </div>
  );
}
