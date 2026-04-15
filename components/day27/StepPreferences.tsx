"use client";

import { useState, useEffect } from "react";
import type { PreferencesData } from "@/types/day27";

interface StepPreferencesProps {
  data: Partial<PreferencesData>;
  onChange: (data: PreferencesData) => void;
  errors: Record<string, string>;
}

const THEME_OPTIONS: { value: PreferencesData["theme"]; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

export function StepPreferences({
  data,
  onChange,
  errors,
}: StepPreferencesProps) {
  const [theme, setTheme] = useState<PreferencesData["theme"]>(
    data.theme ?? "dark",
  );
  const [notifications, setNotifications] = useState(
    data.notifications ?? true,
  );
  const [weeklyDigest, setWeeklyDigest] = useState(
    data.weeklyDigest ?? false,
  );

  useEffect(() => {
    setTheme(data.theme ?? "dark");
    setNotifications(data.notifications ?? true);
    setWeeklyDigest(data.weeklyDigest ?? false);
  }, [data.theme, data.notifications, data.weeklyDigest]);

  function emit(
    t: PreferencesData["theme"],
    n: boolean,
    w: boolean,
  ) {
    onChange({ theme: t, notifications: n, weeklyDigest: w });
  }

  function handleTheme(val: PreferencesData["theme"]) {
    setTheme(val);
    emit(val, notifications, weeklyDigest);
  }

  function handleNotifications(val: boolean) {
    setNotifications(val);
    emit(theme, val, weeklyDigest);
  }

  function handleWeeklyDigest(val: boolean) {
    setWeeklyDigest(val);
    emit(theme, notifications, val);
  }

  return (
    <div className="space-y-6">
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
          STEP 2 — PREFERENCES
        </span>
        <p
          style={{
            fontFamily: "var(--font-day27-body)",
            fontSize: "15px",
            color: "#999",
            lineHeight: 1.5,
          }}
        >
          Customize your experience. These can be changed later.
        </p>
      </div>

      {/* Theme selector */}
      <div>
        <label
          className="block mb-3"
          style={{
            fontFamily: "var(--font-day27-mono)",
            fontSize: "12px",
            color: "#999",
            letterSpacing: "0.5px",
          }}
        >
          Theme
        </label>
        <div className="flex gap-3">
          {THEME_OPTIONS.map((opt) => {
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTheme(opt.value)}
                className="flex-1 py-3 px-4 transition-all"
                style={{
                  fontFamily: "var(--font-day27-mono)",
                  fontSize: "13px",
                  color: isActive ? "#00FF41" : "#555",
                  background: isActive ? "rgba(0,255,65,0.08)" : "#111111",
                  border: isActive
                    ? "1px solid rgba(0,255,65,0.3)"
                    : "1px solid #2a2a2a",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                {isActive && (
                  <span style={{ marginRight: 6 }}>&#x25CF;</span>
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.theme && (
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#ff4444",
            }}
          >
            {errors.theme}
          </p>
        )}
      </div>

      {/* Notifications toggle */}
      <div
        className="flex items-center justify-between p-4"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-day27-body)",
              fontSize: "14px",
              color: "#eeeeee",
              marginBottom: 2,
            }}
          >
            Push Notifications
          </p>
          <p
            style={{
              fontFamily: "var(--font-day27-body)",
              fontSize: "12px",
              color: "#555",
            }}
          >
            Receive alerts for important updates
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleNotifications(!notifications)}
          className="relative transition-all"
          style={{
            width: 44,
            height: 24,
            background: notifications
              ? "rgba(0,255,65,0.2)"
              : "#2a2a2a",
            border: notifications
              ? "1px solid rgba(0,255,65,0.4)"
              : "1px solid #333",
            borderRadius: 0,
            cursor: "pointer",
          }}
        >
          <div
            className="absolute top-1 transition-all"
            style={{
              width: 16,
              height: 16,
              background: notifications ? "#00FF41" : "#555",
              borderRadius: 0,
              left: notifications ? 24 : 3,
            }}
          />
        </button>
      </div>

      {/* Weekly Digest toggle */}
      <div
        className="flex items-center justify-between p-4"
        style={{
          background: "#111111",
          border: "1px solid #2a2a2a",
          borderRadius: 0,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-day27-body)",
              fontSize: "14px",
              color: "#eeeeee",
              marginBottom: 2,
            }}
          >
            Weekly Digest
          </p>
          <p
            style={{
              fontFamily: "var(--font-day27-body)",
              fontSize: "12px",
              color: "#555",
            }}
          >
            Get a summary email every Monday
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleWeeklyDigest(!weeklyDigest)}
          className="relative transition-all"
          style={{
            width: 44,
            height: 24,
            background: weeklyDigest
              ? "rgba(0,255,65,0.2)"
              : "#2a2a2a",
            border: weeklyDigest
              ? "1px solid rgba(0,255,65,0.4)"
              : "1px solid #333",
            borderRadius: 0,
            cursor: "pointer",
          }}
        >
          <div
            className="absolute top-1 transition-all"
            style={{
              width: 16,
              height: 16,
              background: weeklyDigest ? "#00FF41" : "#555",
              borderRadius: 0,
              left: weeklyDigest ? 24 : 3,
            }}
          />
        </button>
      </div>
    </div>
  );
}
