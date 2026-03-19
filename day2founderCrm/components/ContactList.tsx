"use client";

import { useState } from "react";
import type { Contact, ContactStatus } from "@/types";
import { ContactListItem } from "@/components/ContactListItem";
import { useContacts } from "@/hooks/useContacts";

const TABS: { label: string; value: ContactStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Replied", value: "replied" },
  { label: "Closed", value: "closed" },
];

interface ContactListProps {
  activeContactId?: string | null;
  onSelectContact: (contact: Contact) => void;
  extraContacts?: Contact[];
}

export function ContactList({ activeContactId, onSelectContact, extraContacts = [] }: ContactListProps) {
  const [activeTab, setActiveTab] = useState<ContactStatus | "all">("all");

  const { contacts, loading } = useContacts({ status: activeTab });

  // extraContacts (recently enriched/updated) are the source of truth — they override
  // stale API results for the same contact, and are filtered by active tab.
  const mergedContacts = (() => {
    const extraIds = new Set(extraContacts.map((c) => c.id));
    const apiOnly = contacts.filter((c) => !extraIds.has(c.id));
    const filteredExtras = extraContacts.filter((c) => {
      if (activeTab === "all") return true;
      return c.status === activeTab;
    });
    return [...filteredExtras, ...apiOnly];
  })();

  return (
    <div className="flex flex-col h-full">
      {/* Status tabs */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          padding: "8px 8px 4px",
          borderBottom: "1px solid var(--border)",
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              border: "none",
              background: activeTab === tab.value ? "var(--surface-raised)" : "transparent",
              color: activeTab === tab.value ? "var(--foreground)" : "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: activeTab === tab.value ? 500 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 150ms, color 150ms",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
        {loading ? (
          <div className="space-y-1 p-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton-pulse"
                style={{
                  height: 48,
                  borderRadius: 6,
                  background: "var(--surface)",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : mergedContacts.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center" }}>
            <p style={{ color: "var(--text-tertiary)", fontSize: "13px" }}>
              {activeTab === "all" ? "No contacts yet." : `No ${activeTab} contacts.`}
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {mergedContacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                isActive={contact.id === activeContactId}
                onClick={() => onSelectContact(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
