import type {
  WorkflowDefinition,
  WorkflowExecution,
  AgentExecutionStep,
} from "@/types/day26";
import { executeAgent } from "./ai/gemini";

/**
 * Execute a multi-agent workflow sequentially.
 * Output of agent N becomes input to agent N+1.
 * If any agent fails, mark status as "partial" and stop.
 */
export async function executeWorkflow(
  definition: WorkflowDefinition,
): Promise<WorkflowExecution> {
  const steps: AgentExecutionStep[] = [];
  const totalStart = Date.now();

  let currentInput = definition.inputPrompt;

  for (const agent of definition.agents) {
    const stepStart = Date.now();

    try {
      const output = await executeAgent(agent.systemPrompt, currentInput);
      const durationMs = Date.now() - stepStart;

      steps.push({
        agentName: agent.name,
        input: currentInput,
        output,
        durationMs,
        status: "success",
      });

      // Pass output to next agent
      currentInput = output;
    } catch (err) {
      const durationMs = Date.now() - stepStart;

      steps.push({
        agentName: agent.name,
        input: currentInput,
        output:
          err instanceof Error ? err.message : "Agent execution failed",
        durationMs,
        status: "error",
      });

      // Stop pipeline on error
      return {
        steps,
        totalDurationMs: Date.now() - totalStart,
        status: steps.length === 1 ? "error" : "partial",
      };
    }
  }

  return {
    steps,
    totalDurationMs: Date.now() - totalStart,
    status: "success",
  };
}
