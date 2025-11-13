"use client";

import React, { useRef, useState } from "react";
import { Task } from "@/types/tasks";
import { TasksArraySchema, TasksArrayType } from "@/lib/schemas/taskSchema";
import { ZodError } from "zod";

interface ExportImportProps {
  tasks: Task[];
  onImport: (tasks: Task[], mode: "merge" | "replace") => void;
  onClearLocal: () => void;
}

export default function ExportImport({ tasks, onImport, onClearLocal }: ExportImportProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<Task[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kanban-tasks-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      void e;
      setError("Failed to export tasks");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreview(null);
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      // Validate with Zod schema
      const validated = TasksArraySchema.parse(parsed) as TasksArrayType;
      // Normalize createdAt to string/date preserved — for preview keep as-is but convert strings to Date
      const normalized: Task[] = validated.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description ?? "",
        status: t.status,
        priority: t.priority,
        assignees: t.assignees ?? [],
        createdAt: typeof t.createdAt === "string" ? new Date(t.createdAt) : t.createdAt ?? new Date(),
      }));
      setPreview(normalized);
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues.map((issue) => issue.message).join("; "));
      } else {
        void err;
        setError("Failed to parse JSON file");
      }
    }
  };

  const handleImport = (mode: "merge" | "replace") => {
    if (!preview) return;
    onImport(preview, mode);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClear = () => {
    if (!confirm("Clear local task data? This cannot be undone.")) return;
    onClearLocal();
  };

  return (
    <div className="flex gap-3 items-center">
      <button onClick={handleExport} className="px-3 py-2 bg-blue-600 text-white rounded">Export JSON</button>

      <label className="px-3 py-2 bg-gray-100 border rounded cursor-pointer">
        <span>Import JSON</span>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleFileChange} className="hidden" />
      </label>

      {preview && (
        <div className="flex gap-2 items-center">
          <button onClick={() => handleImport("merge")} className="px-3 py-2 bg-green-600 text-white rounded">Merge</button>
          <button onClick={() => handleImport("replace")} className="px-3 py-2 bg-red-600 text-white rounded">Replace</button>
        </div>
      )}

      <button onClick={handleClear} className="px-3 py-2 bg-yellow-500 text-white rounded">Clear Local</button>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
