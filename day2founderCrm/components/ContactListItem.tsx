"use client";

import type { Contact } from "@/types";
import { StatusBadge } from "@/components/StatusSelector";

interface ContactListItemProps {
  contact: Contact;
  isActive?: boolean;
  onClick: () => void;
}

export function ContactListItem({ contact, isActive, onClick }: ContactListItemProps) {
  const name = contact.full_name ?? contact.linkedin_username;
  const initials =
    name.trim().split(/\s+/).length >= 2
      ? (name.trim().split(/\s+/)[0][0] + name.trim().split(/\s+/).at(-1)![0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 12px",
        textAlign: "left",
        background: isActive ? "var(--surface-raised)" : "transparent",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "background 150ms",
        minHeight: "48px",
      }}
      className={!isActive ? "hover:bg-[color:var(--surface)]" : ""}
    >
      {/* Avatar */}
      {contact.avatar_url ? (
        <img
          src={contact.avatar_url}
          alt={name}
          style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
      ) : (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: isActive ? "rgba(232, 160, 32, 0.15)" : "var(--surface-raised)",
            border: `1px solid ${isActive ? "rgba(232, 160, 32, 0.3)" : "var(--border)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isActive ? "var(--accent)" : "var(--text-secondary)",
            fontSize: "11px",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--foreground)",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </p>
        {contact.company_name && (
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {contact.company_name}
          </p>
        )}
      </div>

      <StatusBadge status={contact.status} />
    </button>
  );
}
