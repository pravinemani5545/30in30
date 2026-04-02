"use client";

import { useState, useCallback } from "react";

export function useDeleteScript() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteScript = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/day14/scripts/${id}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { deleteScript, isDeleting };
}
