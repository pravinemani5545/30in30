"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useDeleteConcept(onDeleted?: (id: string) => void) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const deleteConcept = useCallback(
    async (id: string) => {
      setDeleting(id);
      try {
        const res = await fetch(`/api/day12/concepts/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          toast.success("Deleted");
          onDeleted?.(id);
        } else {
          toast.error("Failed to delete");
        }
      } catch {
        toast.error("Network error");
      } finally {
        setDeleting(null);
      }
    },
    [onDeleted],
  );

  return { deleteConcept, deleting };
}
