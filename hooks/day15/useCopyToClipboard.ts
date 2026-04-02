"use client";

import { useCallback } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const copy = useCallback(async (text: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
      return true;
    } catch {
      toast.error("Failed to copy");
      return false;
    }
  }, []);

  return { copy };
}
