"use client";

import { useState, useEffect } from "react";
import type { ProfileData } from "@/types/day27";

interface StepProfileProps {
  data: Partial<ProfileData>;
  onChange: (data: ProfileData) => void;
  errors: Record<string, string>;
}

export function StepProfile({ data, onChange, errors }: StepProfileProps) {
  const [displayName, setDisplayName] = useState(data.displayName ?? "");
  const [role, setRole] = useState(data.role ?? "");
  const [company, setCompany] = useState(data.company ?? "");

  // Sync parent data down on mount / external changes
  useEffect(() => {
    setDisplayName(data.displayName ?? "");
    setRole(data.role ?? "");
    setCompany(data.company ?? "");
  }, [data.displayName, data.role, data.company]);

  function handleChange(field: keyof ProfileData, value: string) {
    if (field === "displayName") setDisplayName(value);
    if (field === "role") setRole(value);
    if (field === "company") setCompany(value);

    const updated: ProfileData = {
      displayName: field === "displayName" ? value : displayName,
      role: field === "role" ? value : role,
      company: field === "company" ? value : company,
    };
    onChange(updated);
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    background: "#060606",
    border: `1px solid ${errors[field] ? "rgba(255,68,68,0.4)" : "#2a2a2a"}`,
    color: "#eeeeee",
    fontFamily: "var(--font-day27-body)",
    fontSize: "14px",
    outline: "none",
    borderRadius: 0,
  });

  return (
    <div className="space-y-5">
      <div>
        <span
          className="block mb-4"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#00FF41",
            opacity: 0.75,
          }}
        >
          STEP 1 — PROFILE
        </span>
        <p
          style={{
            fontFamily: "var(--font-day27-body)",
            fontSize: "15px",
            color: "#999",
            lineHeight: 1.5,
          }}
        >
          Tell us about yourself. This helps personalize your experience.
        </p>
      </div>

      {/* Display Name */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "12px",
            color: "#999",
            letterSpacing: "0.5px",
          }}
        >
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => handleChange("displayName", e.target.value)}
          placeholder="Your name..."
          maxLength={50}
          style={inputStyle("displayName")}
          className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
        />
        {errors.displayName && (
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#ff4444",
            }}
          >
            {errors.displayName}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "12px",
            color: "#999",
            letterSpacing: "0.5px",
          }}
        >
          Role
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => handleChange("role", e.target.value)}
          placeholder="e.g. Product Designer, Engineer..."
          maxLength={50}
          style={inputStyle("role")}
          className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
        />
        {errors.role && (
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#ff4444",
            }}
          >
            {errors.role}
          </p>
        )}
      </div>

      {/* Company */}
      <div>
        <label
          className="block mb-2"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "12px",
            color: "#999",
            letterSpacing: "0.5px",
          }}
        >
          Company
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Where do you work?"
          maxLength={100}
          style={inputStyle("company")}
          className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
        />
        {errors.company && (
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#ff4444",
            }}
          >
            {errors.company}
          </p>
        )}
      </div>
    </div>
  );
}
