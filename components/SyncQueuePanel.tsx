"use client";

import React, { useEffect, useMemo, useState } from "react";

interface QueueItemView {
  id: string;
  method: string;
  url: string;
  attempts: number;
  body?: unknown;
  enqueuedAt?: string;
}

interface Props {
  open: boolean;
  items: QueueItemView[];
  onClose: () => void;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
}

// Helper: returns short relative age for an ISO timestamp
function formatAge(iso: string | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - then) / 1000)); // seconds

  if (diff < 5) return "just now";
  if (diff < 60) return `${diff}s ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SyncQueuePanel({ open, items, onClose, onRetry, onRemove }: Props) {
  // Tick state to force re-render every 30s so ages update
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [open]);

  // Memoize rendered rows with formatted age
  const rows = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        age: formatAge(it.enqueuedAt),
        enqueuedAtDisplay: it.enqueuedAt
          ? new Date(it.enqueuedAt).toLocaleString()
          : "—",
      })),
    [items]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg w-11/12 max-w-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Sync Queue ({rows.length})</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-2 py-1 bg-gray-100 rounded">Close</button>
          </div>
        </div>

        <div className="max-h-80 overflow-auto">
          {rows.length === 0 ? (
            <div className="text-sm text-gray-600">Queue is empty.</div>
          ) : (
            rows.map((it) => (
              <div key={it.id} className="border-b py-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                      <div className="font-medium">{it.method} — <span className="text-xs text-gray-500">{it.url}</span></div>
                      <div className="text-xs text-gray-600">Attempts: {it.attempts}</div>
                      {it.enqueuedAt && (
                        <div className="text-xs text-gray-500">
                          Enqueued: {it.enqueuedAtDisplay}
                          <span className="ml-2 text-gray-400">· {it.age}</span>
                        </div>
                      )}
                    </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onRetry(it.id)} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Retry</button>
                    <button onClick={() => onRemove(it.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Remove</button>
                  </div>
                </div>
                {it.body !== undefined && (
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">{String(JSON.stringify(it.body, null, 2))}</pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
