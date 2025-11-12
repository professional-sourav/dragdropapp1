"use client";

import { useState, useCallback } from "react";
import { Task, TaskStatus } from "@/types/tasks";
import { TaskColumn } from "./TaskColumn";
import { AddTaskModal } from "./AddTaskModal";

interface KanbanBoardProps {
  initialTasks: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>("todo");

  const handleAddTask = useCallback(
    (newTask: {
      title: string;
      description: string;
      status: TaskStatus;
      priority: string;
      assignees: string[];
    }) => {
      const task: Task = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority as "low" | "medium" | "high" | "urgent",
        assignees: newTask.assignees,
        createdAt: new Date(),
      };

      setTasks((prev) => [task, ...prev]);
    },
    []
  );

  const handleColumnAddClick = (status: TaskStatus) => {
    setSelectedColumn(status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    return tasks.filter((task) => task.status === status);
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "ready", title: "Ready" },
    { id: "production", title: "Production" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            tasks={getTasksByStatus(column.id)}
            onAddTask={() => handleColumnAddClick(column.id)}
          />
        ))}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTask={handleAddTask}
        defaultStatus={selectedColumn}
      />
    </>
  );
}
