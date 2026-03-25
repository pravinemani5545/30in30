import type { Contact } from "@/types/day2";
import { MapPin, Briefcase } from "lucide-react";

interface PersonCardProps {
  contact: Contact;
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "var(--accent-subtle)",
        border: "1px solid rgba(232, 160, 32, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--accent)",
        fontSize: "16px",
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export function PersonCard({ contact }: PersonCardProps) {
  const name = contact.full_name ?? contact.linkedin_username;

  return (
    <div
      style={{
        padding: "16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
      }}
    >
      <div className="flex items-start gap-3">
        {contact.avatar_url ? (
          <img
            src={contact.avatar_url}
            alt={name}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <Initials name={name} />
        )}

        <div className="flex-1 min-w-0">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "20px",
              fontWeight: 400,
              color: "var(--foreground)",
              margin: "0 0 2px",
              lineHeight: 1.2,
            }}
          >
            {name}
          </h2>
          {contact.headline && (
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: "0 0 8px" }}>
              {contact.headline}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {(contact.current_title || contact.company_name) && (
              <span
                style={{ color: "var(--text-secondary)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Briefcase size={11} />
                {[contact.current_title, contact.company_name].filter(Boolean).join(" @ ")}
              </span>
            )}
            {contact.location && (
              <span
                style={{ color: "var(--text-secondary)", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <MapPin size={11} />
                {contact.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Talking points */}
      {contact.key_talking_points && contact.key_talking_points.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <p style={{ color: "var(--text-tertiary)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
            Talking Points
          </p>
          <div className="space-y-2">
            {contact.key_talking_points.map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "var(--accent)", fontSize: "12px", marginTop: "1px", flexShrink: 0 }}>
                  ◆
                </span>
                <p style={{ color: "var(--foreground)", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
