"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  WorkflowDefinition,
  WorkflowExecution,
  SavedWorkflow,
} from "@/types/day26";

interface UseOrchestratorReturn {
  execute: (definition: WorkflowDefinition) => Promise<void>;
  execution: WorkflowExecution | null;
  workflows: SavedWorkflow[];
  loading: boolean;
  executing: boolean;
  error: string | null;
  saveWorkflow: (name: string, definition: WorkflowDefinition) => Promise<boolean>;
  refreshWorkflows: () => Promise<void>;
  authenticated: boolean;
}

export function useOrchestrator(): UseOrchestratorReturn {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  const refreshWorkflows = useCallback(async () => {
    try {
      const res = await fetch("/api/day26/workflows");
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setWorkflows(data.workflows ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkflows();
  }, [refreshWorkflows]);

  async function execute(definition: WorkflowDefinition) {
    setExecuting(true);
    setError(null);
    setExecution(null);

    try {
      const res = await fetch("/api/day26/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ definition }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Execution failed");
        return;
      }

      setExecution(data.execution);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setExecuting(false);
    }
  }

  async function saveWorkflow(
    name: string,
    definition: WorkflowDefinition,
  ): Promise<boolean> {
    try {
      const res = await fetch("/api/day26/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, definition }),
      });

      if (res.status === 401) {
        setAuthenticated(false);
        return false;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Save failed");
        return false;
      }

      await refreshWorkflows();
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    }
  }

  return {
    execute,
    execution,
    workflows,
    loading,
    executing,
    error,
    saveWorkflow,
    refreshWorkflows,
    authenticated,
  };
}
