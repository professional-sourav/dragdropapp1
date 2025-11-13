export const TASKS_LS_KEY = 'kanban_tasks_v1';

export function isBrowser() {
  return typeof window !== 'undefined';
}

export function saveTasksToLocal(tasks: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(TASKS_LS_KEY, JSON.stringify(tasks));
  } catch (e) {
    // ignore
  }
}

export function loadTasksFromLocal() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(TASKS_LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearTasksLocal() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(TASKS_LS_KEY);
  } catch (e) {}
}

export const QUEUE_LS_KEY = 'kanban_sync_queue_v1';

export function saveQueueToLocal(queue: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(QUEUE_LS_KEY, JSON.stringify(queue));
  } catch (e) {}
}

export function loadQueueFromLocal() {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(QUEUE_LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearQueueLocal() {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(QUEUE_LS_KEY);
  } catch (e) {}
}
