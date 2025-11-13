"use client";

import { useRef, useState, useEffect } from "react";
import { saveQueueToLocal, loadQueueFromLocal, clearQueueLocal } from "@/utils/localStorage";
import { useSyncConfig } from "@/hooks/syncConfig";

type Method = "POST" | "PUT" | "DELETE";

type QueueItem = {
  id: string;
  method: Method;
  url: string;
  body?: unknown;
  attempts: number;
  enqueuedAt?: string;
};

export function useSyncQueue(opts?: { maxAttempts?: number }) {
  const queueRef = useRef<QueueItem[]>([]);
  const processingRef = useRef(false);
  const [queueLen, setQueueLen] = useState(0);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSuccess, setLastSuccess] = useState<Date | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const ctx = useSyncConfig();
  const MAX_ATTEMPTS = opts?.maxAttempts ?? ctx.maxAttempts;
  const BASE_DELAY = opts?.maxAttempts ? 1000 : ctx.baseDelay; // default base delay
  const MAX_JITTER = ctx.maxJitter;

  // hydrate queue from localStorage
  useEffect(() => {
    try {
      const raw = loadQueueFromLocal();
      if (raw && Array.isArray(raw)) {
        queueRef.current = raw as QueueItem[];
        setQueueLen(queueRef.current.length);
        setQueueItems(queueRef.current.slice());
        // start processing if there are items
        if (queueRef.current.length > 0) {
          void processQueue();
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function processItem(item: QueueItem) {
    setIsSyncing(true);
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: { "Content-Type": "application/json" },
        body: item.body ? JSON.stringify(item.body) : undefined,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      setLastSuccess(new Date());
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // increment attempts and re-queue if attempts < max
      item.attempts = (item.attempts ?? 0) + 1;
      if (item.attempts < MAX_ATTEMPTS) {
        // jittered exponential backoff: base * 2^(attempts-1) + random(0..maxJitter)
        const backoffBase = BASE_DELAY * Math.pow(2, item.attempts - 1);
        const jitter = Math.floor(Math.random() * MAX_JITTER);
        const backoff = Math.max(200, Math.round(backoffBase + jitter));
        setTimeout(() => {
          queueRef.current.push(item);
          setQueueLen(queueRef.current.length);
          setQueueItems(queueRef.current.slice());
          try {
            saveQueueToLocal(queueRef.current);
          } catch {
            // ignore
          }
          // kick processor
          void processQueue();
        }, backoff);
      } else {
        setLastError(message);
      }
      return false;
    } finally {
      setIsSyncing(false);
    }
  }

  async function processQueue() {
    if (processingRef.current) return;
    processingRef.current = true;
    try {
      while (queueRef.current.length > 0) {
        const item = queueRef.current.shift() as QueueItem;
        setQueueLen(queueRef.current.length);
        setQueueItems(queueRef.current.slice());
        try {
          await processItem(item);
        } finally {
          // persist current queue state after removing the item
          try {
            saveQueueToLocal(queueRef.current);
          } catch {
            // ignore
          }
        }
        await new Promise((r) => setTimeout(r, 200));
      }
    } finally {
      processingRef.current = false;
      setIsSyncing(false);
    }
  }

  function enqueue(method: Method, url: string, body?: unknown) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: QueueItem = { id, method, url, body, attempts: 0, enqueuedAt: new Date().toISOString() };
    queueRef.current.push(item);
    setQueueLen(queueRef.current.length);
    setQueueItems(queueRef.current.slice());
    try {
      saveQueueToLocal(queueRef.current);
    } catch {
      // ignore
    }
    void processQueue();
    return id;
  }

  function removeItem(id: string) {
    queueRef.current = queueRef.current.filter((i) => i.id !== id);
    setQueueLen(queueRef.current.length);
    setQueueItems(queueRef.current.slice());
    try {
      saveQueueToLocal(queueRef.current);
    } catch {
      // ignore
    }
  }

  function retryItem(id: string) {
    const idx = queueRef.current.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const item = queueRef.current.splice(idx, 1)[0];
    item.attempts = 0; // reset attempts
    // place at front
    queueRef.current.unshift(item);
    setQueueLen(queueRef.current.length);
    setQueueItems(queueRef.current.slice());
    try {
      saveQueueToLocal(queueRef.current);
    } catch {
      // ignore
    }
    void processQueue();
  }

  function start() {
    void processQueue();
  }

  function clearQueue() {
    queueRef.current = [];
    setQueueLen(0);
    setLastError(null);
    try {
      clearQueueLocal();
    } catch {
      // ignore
    }
  }

  return {
    enqueue,
    queueLen,
    queueItems,
    lastSuccess,
    lastError,
    isSyncing,
    start,
    clearQueue,
    removeItem,
    retryItem,
  } as const;
}
