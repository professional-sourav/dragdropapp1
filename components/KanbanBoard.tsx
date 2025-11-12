"use client";

import { useState, useCallback, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Task, TaskStatus, TaskPriority } from "@/types/tasks";
import { TaskColumn } from "./TaskColumn";
import { AddTaskModal } from "./AddTaskModal";

interface KanbanBoardProps {
  initialTasks: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch: only render interactive components after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
    setEditingTask(null);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id) as TaskStatus;

    const validStatuses = columns.map((c) => c.id);
    if (!validStatuses.includes(overId)) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: overId } : t))
    );
  };

  // Edit / Delete handlers
  const handleEditTask = (task: Task) => {
    setSelectedColumn(task.status);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (id: string, updated: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignees: string[];
  }) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (!confirm("Delete task? This action cannot be undone.")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Render skeleton/placeholder on server to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg p-3 bg-gray-50" />
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={getTasksByStatus(column.id)}
              onAddTask={() => handleColumnAddClick(column.id)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DndContext>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTask={handleAddTask}
        defaultStatus={selectedColumn}
        editTask={editingTask}
        onSave={handleSaveTask}
      />
    </>
  );
}
