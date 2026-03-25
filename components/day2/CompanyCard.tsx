import type { Contact } from "@/types/day2";
import { Building2, Globe, TrendingUp } from "lucide-react";

interface CompanyCardProps {
  contact: Contact;
}

export function CompanyCard({ contact }: CompanyCardProps) {
  if (!contact.company_name) return null;

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "6px",
            background: "var(--surface-raised)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Building2 size={16} style={{ color: "var(--text-secondary)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--foreground)",
              margin: "0 0 2px",
            }}
          >
            {contact.company_name}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {contact.company_industry && (
              <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                {contact.company_industry}
              </span>
            )}
            {contact.company_size && (
              <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                {contact.company_size} employees
              </span>
            )}
            {contact.company_domain && (
              <span
                style={{ color: "var(--accent)", fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}
              >
                <Globe size={10} />
                {contact.company_domain}
              </span>
            )}
          </div>
        </div>
      </div>

      {contact.company_description && (
        <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: "1.6", margin: "0 0 12px" }}>
          {contact.company_description}
        </p>
      )}

      {contact.recent_signals && contact.recent_signals.length > 0 && (
        <div>
          <p style={{ color: "var(--text-tertiary)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={10} />
            Recent Signals
          </p>
          <div className="space-y-2">
            {contact.recent_signals.map((signal, i) => (
              <p
                key={i}
                style={{
                  color: "var(--foreground)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  margin: 0,
                  paddingLeft: "12px",
                  borderLeft: "2px solid var(--accent-subtle)",
                }}
              >
                {signal}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
