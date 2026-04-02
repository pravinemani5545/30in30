"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useDeleteSequence() {
  const [deleting, setDeleting] = useState(false);

  const deleteSequence = useCallback(async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/day15/sequences/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Sequence deleted");
        return true;
      }
      toast.error("Failed to delete sequence");
      return false;
    } catch {
      toast.error("Network error");
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteSequence, deleting };
}
