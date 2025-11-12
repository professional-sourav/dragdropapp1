"use client";

import { Task, TaskPriority } from "@/types/tasks";

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 cursor-grab active:cursor-grabbing">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
          {task.title}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {task.assignees.map((assignee, index) => (
          <div
            key={index}
            className="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
            title={assignee}
          >
            {assignee
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        ))}
      </div>
    </div>
  );
}
