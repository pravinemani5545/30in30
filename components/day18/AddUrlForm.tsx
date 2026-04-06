"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddUrlFormProps {
  onAdd: (url: string) => Promise<{ error?: string }>;
  adding: boolean;
}

export function AddUrlForm({ onAdd, adding }: AddUrlFormProps) {
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || adding) return;

    const { error } = await onAdd(url.trim());
    if (error) {
      toast.error(error);
    } else {
      setUrl("");
      toast.success("Company added to watchlist");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://company.com"
        className="flex-1 px-3 py-2 text-sm rounded-md border outline-none transition-colors"
        style={{
          background: "var(--surface-raised)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--accent)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
        disabled={adding}
      />
      <button
        type="submit"
        disabled={adding || !url.trim()}
        className="px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
        style={{
          background: "var(--accent)",
          color: "var(--background)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--accent-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--accent)")
        }
      >
        <Plus size={14} />
        Add
      </button>
    </form>
  );
}
