"use client";

import React from 'react';
import { TaskPriority, TaskStatus } from '@/types/tasks';
import { DUMMY_ASSIGNEES } from '@/lib/dummy-tasks';

interface FiltersProps {
  priority: TaskPriority | 'all' | null;
  assignee: string | 'all' | null;
  status: TaskStatus | 'all' | null;
  query: string;
  onPriorityChange: (p: TaskPriority | 'all' | null) => void;
  onAssigneeChange: (a: string | 'all' | null) => void;
  onStatusChange: (s: TaskStatus | 'all' | null) => void;
  onQueryChange: (q: string) => void;
}

export function FiltersBar({ priority, assignee, status, query, onPriorityChange, onAssigneeChange, onStatusChange, onQueryChange }: FiltersProps) {
  return (
    <div className="flex gap-3 items-center p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Search title or description..." className="px-3 py-2 border rounded w-full max-w-md" />

      <select value={status ?? 'all'} onChange={(e) => onStatusChange(e.target.value as any)} className="px-2 py-2 border rounded">
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="ready">Ready</option>
        <option value="production">Production</option>
      </select>

      <select value={priority ?? 'all'} onChange={(e) => onPriorityChange(e.target.value === 'all' ? null : (e.target.value as TaskPriority))} className="px-2 py-2 border rounded">
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>

      <select value={assignee ?? 'all'} onChange={(e) => onAssigneeChange(e.target.value === 'all' ? null : e.target.value)} className="px-2 py-2 border rounded">
        <option value="all">All Assignees</option>
        {DUMMY_ASSIGNEES.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}
