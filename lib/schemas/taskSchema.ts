import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "in-progress", "ready", "production"]);
export const TaskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional().nullable().default("").transform((v) => v ?? ""),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  assignees: z.array(z.string()).optional().default([]),
  createdAt: z.union([z.string(), z.date()]).optional(),
});

export const TasksArraySchema = z.array(TaskSchema);

export type TaskSchemaType = z.infer<typeof TaskSchema>;
export type TasksArrayType = z.infer<typeof TasksArraySchema>;
