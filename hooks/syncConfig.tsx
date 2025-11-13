"use client";

import React, { createContext, useContext } from "react";

export type SyncConfig = {
  maxAttempts: number;
  baseDelay: number; // ms
  maxJitter: number; // ms
};

export const DEFAULT_SYNC_CONFIG: SyncConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxJitter: 300,
};

const SyncConfigContext = createContext<SyncConfig | null>(null);

export function SyncConfigProvider({ children, value }: { children: React.ReactNode; value?: Partial<SyncConfig> }) {
  const merged = { ...DEFAULT_SYNC_CONFIG, ...(value ?? {}) };
  return <SyncConfigContext.Provider value={merged}>{children}</SyncConfigContext.Provider>;
}

export function useSyncConfig() {
  const ctx = useContext(SyncConfigContext);
  return ctx ?? DEFAULT_SYNC_CONFIG;
}
