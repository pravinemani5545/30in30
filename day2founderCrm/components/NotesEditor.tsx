"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface NotesEditorProps {
  contactId: string;
  initialNotes: string | null;
}

export function NotesEditor({ contactId, initialNotes }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialNotes ?? "");

  useEffect(() => {
    setNotes(initialNotes ?? "");
    lastSavedRef.current = initialNotes ?? "";
  }, [contactId, initialNotes]);

  function handleChange(value: string) {
    setNotes(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (value === lastSavedRef.current) return;

      setSaving(true);
      try {
        const res = await fetch(`/api/contacts/${contactId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: value }),
        });

        if (!res.ok) throw new Error("Save failed");
        lastSavedRef.current = value;
      } catch {
        toast.error("Failed to save notes");
      } finally {
        setSaving(false);
      }
    }, 1000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p
          style={{
            color: "var(--text-tertiary)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Notes
        </p>
        {saving && (
          <p style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>Saving...</p>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add notes about this contact..."
        rows={4}
        style={{
          width: "100%",
          padding: "10px 12px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          color: "var(--foreground)",
          fontSize: "13px",
          lineHeight: "1.6",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "var(--font-sans)",
          transition: "border-color 150ms",
        }}
        className="focus:border-[color:var(--accent)]"
      />
    </div>
  );
}
