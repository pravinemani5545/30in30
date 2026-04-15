"use client";

import { useState, useEffect } from "react";
import type { GoalsData } from "@/types/day27";

interface StepGoalsProps {
  data: Partial<GoalsData>;
  onChange: (data: GoalsData) => void;
  errors: Record<string, string>;
}

const TIMELINE_OPTIONS: { value: GoalsData["timeline"]; label: string }[] = [
  { value: "1_month", label: "1 Month" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "1_year", label: "1 Year" },
];

const EXPERIENCE_OPTIONS: {
  value: GoalsData["experience"];
  label: string;
  desc: string;
}[] = [
  { value: "beginner", label: "Beginner", desc: "Just getting started" },
  { value: "intermediate", label: "Intermediate", desc: "Some experience" },
  { value: "advanced", label: "Advanced", desc: "Deep expertise" },
];

export function StepGoals({ data, onChange, errors }: StepGoalsProps) {
  const [primaryGoal, setPrimaryGoal] = useState(data.primaryGoal ?? "");
  const [timeline, setTimeline] = useState<GoalsData["timeline"]>(
    data.timeline ?? "3_months",
  );
  const [experience, setExperience] = useState<GoalsData["experience"]>(
    data.experience ?? "intermediate",
  );

  useEffect(() => {
    setPrimaryGoal(data.primaryGoal ?? "");
    setTimeline(data.timeline ?? "3_months");
    setExperience(data.experience ?? "intermediate");
  }, [data.primaryGoal, data.timeline, data.experience]);

  function emit(
    goal: string,
    tl: GoalsData["timeline"],
    exp: GoalsData["experience"],
  ) {
    onChange({ primaryGoal: goal, timeline: tl, experience: exp });
  }

  function handleGoalChange(val: string) {
    setPrimaryGoal(val);
    emit(val, timeline, experience);
  }

  function handleTimeline(val: GoalsData["timeline"]) {
    setTimeline(val);
    emit(primaryGoal, val, experience);
  }

  function handleExperience(val: GoalsData["experience"]) {
    setExperience(val);
    emit(primaryGoal, timeline, val);
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
          STEP 3 — GOALS
        </span>
        <p
          style={{
            fontFamily: "var(--font-day27-body)",
            fontSize: "15px",
            color: "#999",
            lineHeight: 1.5,
          }}
        >
          What are you looking to achieve? This helps us tailor recommendations.
        </p>
      </div>

      {/* Primary Goal */}
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
          Primary Goal
        </label>
        <textarea
          value={primaryGoal}
          onChange={(e) => handleGoalChange(e.target.value)}
          placeholder="What's your main objective?"
          maxLength={200}
          rows={3}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#060606",
            border: `1px solid ${errors.primaryGoal ? "rgba(255,68,68,0.4)" : "#2a2a2a"}`,
            color: "#eeeeee",
            fontFamily: "var(--font-day27-body)",
            fontSize: "14px",
            outline: "none",
            borderRadius: 0,
            resize: "none",
            height: "80px",
          }}
          className="placeholder:text-[#555] focus:border-[#00FF41]/30 transition-colors"
        />
        <div className="flex justify-between mt-1">
          {errors.primaryGoal ? (
            <p
              style={{
                fontFamily: "var(--font-day27-mono)",
                fontSize: "11px",
                color: "#ff4444",
              }}
            >
              {errors.primaryGoal}
            </p>
          ) : (
            <span />
          )}
          <span
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "10px",
              color: "#555",
            }}
          >
            {primaryGoal.length}/200
          </span>
        </div>
      </div>

      {/* Timeline */}
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
          Timeline
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIMELINE_OPTIONS.map((opt) => {
            const isActive = timeline === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTimeline(opt.value)}
                className="py-3 px-3 transition-all"
                style={{
                  fontFamily: "var(--font-day27-mono)",
                  fontSize: "12px",
                  color: isActive ? "#00FF41" : "#555",
                  background: isActive ? "rgba(0,255,65,0.08)" : "#111111",
                  border: isActive
                    ? "1px solid rgba(0,255,65,0.3)"
                    : "1px solid #2a2a2a",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.timeline && (
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#ff4444",
            }}
          >
            {errors.timeline}
          </p>
        )}
      </div>

      {/* Experience Level */}
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
          Experience Level
        </label>
        <div className="space-y-3">
          {EXPERIENCE_OPTIONS.map((opt) => {
            const isActive = experience === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleExperience(opt.value)}
                className="w-full p-4 text-left transition-all"
                style={{
                  background: isActive ? "rgba(0,255,65,0.08)" : "#111111",
                  border: isActive
                    ? "1px solid rgba(0,255,65,0.3)"
                    : "1px solid #2a2a2a",
                  borderRadius: 0,
                  cursor: "pointer",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      border: isActive
                        ? "2px solid #00FF41"
                        : "2px solid #2a2a2a",
                      borderRadius: 0,
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          background: "#00FF41",
                          borderRadius: 0,
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-day27-body)",
                        fontSize: "14px",
                        color: isActive ? "#eeeeee" : "#999",
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-day27-body)",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      {opt.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.experience && (
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-day27-mono)",
              fontSize: "11px",
              color: "#ff4444",
            }}
          >
            {errors.experience}
          </p>
        )}
      </div>
    </div>
  );
}
