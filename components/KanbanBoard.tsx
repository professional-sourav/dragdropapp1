"use client";

import { useState, useCallback, useEffect } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Task, TaskStatus, TaskPriority } from "@/types/tasks";
import { TaskColumn } from "./TaskColumn";
import { AddTaskModal } from "./AddTaskModal";
import { FiltersBar } from "./FiltersBar";
import ExportImport from "./ExportImport";
import { loadTasksFromLocal, saveTasksToLocal, clearTasksLocal } from "@/utils/localStorage";
import { useSyncQueue } from "@/hooks/useSyncQueue";
import SyncIndicator from "./SyncIndicator";

interface KanbanBoardProps {
  initialTasks: Task[];
}

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch: only render interactive components after mount
  useEffect(() => {
    setIsMounted(true);

    // hydrate tasks from localStorage if present
    try {
      const saved = loadTasksFromLocal();
      if (saved && Array.isArray(saved)) {
        const normalized = (saved as any[]).map((t) => ({
          ...t,
          createdAt: typeof t.createdAt === "string" ? new Date(t.createdAt) : t.createdAt,
        })) as Task[];
        setTasks(normalized);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist tasks to localStorage (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        saveTasksToLocal(tasks);
      } catch (e) {
        // ignore
      }
    }, 700);

    return () => clearTimeout(t);
  }, [tasks]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<TaskStatus>("todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // Filters
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all' | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | 'all' | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all' | null>(null);
  const [query, setQuery] = useState<string>('');

  const { enqueue, queueLen, lastSuccess, lastError, isSyncing, start, clearQueue, removeItem, retryItem, queueItems } = useSyncQueue();

  // Import / Export handlers
  const handleImportTasks = useCallback((imported: Task[], mode: "merge" | "replace") => {
    const normalized = imported.map((t) => ({
      ...t,
      createdAt: typeof t.createdAt === "string" ? new Date(t.createdAt) : t.createdAt,
    })) as Task[];

    if (mode === "replace") {
      setTasks(normalized);
      return;
    }

    setTasks((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      normalized.forEach((n) => map.set(n.id, n));
      return Array.from(map.values());
    });
  }, []);

  const handleClearLocal = useCallback(() => {
    if (!confirm("Clear local task data and reset to defaults?")) return;
    clearTasksLocal();
    setTasks(initialTasks);
  }, [initialTasks]);

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
      // enqueue to sync queue
      enqueue("POST", "/api/tasks", { ...task, createdAt: task.createdAt.toISOString() });
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
    // apply filters + search
    return tasks.filter((task) => {
      if (task.status !== status) return false;
      if (filterStatus && filterStatus !== 'all' && task.status !== filterStatus) return false;
      if (filterPriority && filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (filterAssignee && filterAssignee !== 'all') {
        if (!task.assignees || !Array.isArray(task.assignees)) return false;
        if (!task.assignees.includes(filterAssignee)) return false;
      }
      if (query && query.trim().length > 0) {
        const q = query.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(q);
        const inDesc = task.description?.toLowerCase().includes(q);
        if (!inTitle && !inDesc) return false;
      }
      return true;
    });
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

    enqueue("PUT", "/api/tasks", { id, ...updated });
  };

  const handleDeleteTask = (id: string) => {
    if (!confirm("Delete task? This action cannot be undone.")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    enqueue("DELETE", `/api/tasks?id=${encodeURIComponent(id)}`);
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
      <div className="mb-4 flex items-center justify-between">
        <FiltersBar
          priority={filterPriority}
          assignee={filterAssignee}
          status={filterStatus}
          query={query}
          onPriorityChange={(p) => setFilterPriority(p)}
          onAssigneeChange={(a) => setFilterAssignee(a)}
          onStatusChange={(s) => setFilterStatus(s)}
          onQueryChange={(q) => setQuery(q)}
        />

        <div className="ml-4 flex items-center gap-4">
          <ExportImport tasks={tasks} onImport={handleImportTasks} onClearLocal={handleClearLocal} />
          <SyncIndicator
            queueLen={queueLen}
            lastSuccess={lastSuccess}
            lastError={lastError}
            isSyncing={isSyncing}
            onRetry={() => start()}
            onClear={() => clearQueue()}
            queueItems={queueItems.map((q) => ({ id: q.id, method: q.method, url: q.url, attempts: q.attempts, body: q.body, enqueuedAt: q.enqueuedAt }))}
            onRetryItem={(id) => retryItem(id)}
            onRemoveItem={(id) => removeItem(id)}
          />
        </div>
      </div>
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
