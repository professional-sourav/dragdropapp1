"use client";

import React from "react";

import SyncQueuePanel from "./SyncQueuePanel";
import { useState } from "react";

interface Props {
  queueLen: number;
  lastSuccess: Date | null;
  lastError: string | null;
  isSyncing: boolean;
  onRetry?: () => void;
  onClear?: () => void;
  queueItems?: Array<{ id: string; method: string; url: string; attempts: number; body?: unknown }>;
  onRetryItem?: (id: string) => void;
  onRemoveItem?: (id: string) => void;
}

export default function SyncIndicator({ queueLen, lastSuccess, lastError, isSyncing, onRetry, onClear, queueItems = [], onRetryItem, onRemoveItem }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-3 text-sm">
      {queueLen > 0 ? (
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span>Sync queue: {queueLen}</span>
        </div>
      ) : isSyncing ? (
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Syncing…</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span>Synced{lastSuccess ? ` at ${lastSuccess.toLocaleTimeString()}` : ''}</span>
        </div>
      )}

      {lastError && <div className="text-red-600">Err: {lastError}</div>}
      <div className="flex items-center gap-2">
        <button onClick={() => onRetry?.()} className="px-2 py-1 bg-gray-200 rounded text-xs">Retry Now</button>
        <button onClick={() => { if (confirm('Clear sync queue?')) onClear?.(); }} className="px-2 py-1 bg-gray-200 rounded text-xs">Clear Queue</button>
        <button onClick={() => setOpen(true)} className="px-2 py-1 bg-gray-100 rounded text-xs">View Queue</button>
      </div>
      <SyncQueuePanel open={open} items={queueItems} onClose={() => setOpen(false)} onRetry={(id) => onRetryItem?.(id)} onRemove={(id) => onRemoveItem?.(id)} />
    </div>
  );
}
