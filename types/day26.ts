// ─── Day 26: AgentOrchestrator Types ────────────────────────────────

export interface AgentDefinition {
  name: string;
  systemPrompt: string;
  description: string;
}

export interface WorkflowDefinition {
  agents: AgentDefinition[];
  inputPrompt: string;
}

export interface AgentExecutionStep {
  agentName: string;
  input: string;
  output: string;
  durationMs: number;
  status: "success" | "error";
}

export interface WorkflowExecution {
  steps: AgentExecutionStep[];
  totalDurationMs: number;
  status: "success" | "partial" | "error";
}

export interface SavedWorkflow {
  id: string;
  user_id: string;
  name: string;
  definition: WorkflowDefinition;
  last_result: WorkflowExecution | null;
  created_at: string;
}
