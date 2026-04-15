import type { ChecklistSession } from '@/types';

const STORAGE_KEY = 'metacognition_sessions';

export function loadSessions(): ChecklistSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChecklistSession[]) : [];
  } catch {
    return [];
  }
}

export function saveAllSessions(sessions: ChecklistSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function addSession(session: ChecklistSession): void {
  const sessions = loadSessions();
  saveAllSessions([session, ...sessions]);
}

export function getSession(id: string): ChecklistSession | undefined {
  return loadSessions().find((s) => s.id === id);
}

export function deleteSession(id: string): void {
  saveAllSessions(loadSessions().filter((s) => s.id !== id));
}
