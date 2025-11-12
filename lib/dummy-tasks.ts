import { Task } from "@/types/tasks";

export const DUMMY_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Design login page",
    description: "Create mockups and design system for the login page UI",
    status: "todo",
    priority: "high",
    assignees: ["John Doe", "Jane Smith"],
    createdAt: new Date("2025-11-10"),
  },
  {
    id: "task-2",
    title: "Setup authentication",
    description: "Implement JWT-based authentication system",
    status: "todo",
    priority: "urgent",
    assignees: ["Mike Johnson"],
    createdAt: new Date("2025-11-11"),
  },
  {
    id: "task-3",
    title: "Database schema design",
    description: "Design and document the database schema for the project",
    status: "todo",
    priority: "medium",
    assignees: ["Sarah Wilson", "Tom Brown"],
    createdAt: new Date("2025-11-12"),
  },
  {
    id: "task-4",
    title: "API endpoint documentation",
    description: "Write comprehensive API documentation using Swagger",
    status: "todo",
    priority: "low",
    assignees: ["Alex Chen"],
    createdAt: new Date("2025-11-09"),
  },
];

export const DUMMY_ASSIGNEES = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "Tom Brown",
  "Alex Chen",
  "Emma Davis",
  "Chris Lee",
];
