"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus } from "@/types/tasks";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
}

export function TaskColumn({ id, title, tasks, onAddTask, onEditTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const containerClass = useMemo(() => {
    const base = "flex-1 rounded-lg p-3 space-y-3 overflow-y-auto";
    const bg = isOver ? "bg-blue-50 ring-2 ring-blue-200" : "bg-gray-50";
    return `${base} ${bg}`;
  }, [isOver]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          title="Add a new task"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v14m7-7H5"
            />
          </svg>
        </button>
      </div>

      <div ref={setNodeRef} className={containerClass} data-column-id={id}>
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p className="text-sm">No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))
        )}
      </div>
    </div>
  );
}
