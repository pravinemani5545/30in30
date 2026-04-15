import { z } from "zod";

export const agentDefinitionSchema = z.object({
  name: z
    .string()
    .min(1, "Agent name is required")
    .max(50, "Agent name must be under 50 characters"),
  systemPrompt: z
    .string()
    .min(10, "System prompt must be at least 10 characters")
    .max(2000, "System prompt must be under 2000 characters"),
  description: z
    .string()
    .max(200, "Description must be under 200 characters"),
});

export const workflowDefinitionSchema = z.object({
  agents: z
    .array(agentDefinitionSchema)
    .min(2, "At least 2 agents required")
    .max(4, "Maximum 4 agents allowed"),
  inputPrompt: z
    .string()
    .min(5, "Input prompt must be at least 5 characters")
    .max(2000, "Input prompt must be under 2000 characters"),
});

export const saveWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, "Workflow name is required")
    .max(100, "Workflow name must be under 100 characters"),
  definition: workflowDefinitionSchema,
});
