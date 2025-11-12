"use client";

import { useDraggable } from "@dnd-kit/core";
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
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  // Only apply listeners to the draggable area (not the buttons)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Check if click is on a button or inside the button container
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return; // Don't start drag if clicking on buttons
    }
    listeners?.onPointerDown?.(e);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200 p-4 ${
        isDragging ? "opacity-90 scale-105" : "hover:shadow-md"
      } cursor-grab active:cursor-grabbing`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
            title="Edit task"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(task.id)}
            className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
            title="Delete task"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

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
