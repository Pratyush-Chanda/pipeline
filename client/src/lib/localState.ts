export type LocalEntry = { id: string; title?: string; thumbnail?: string; author?: string; watchedAt?: number };

export function readLocal<T>(storage: Pick<Storage, "getItem">, key: string): T[] {
  try { return JSON.parse(storage.getItem(key) || "[]") as T[]; } catch { return []; }
}

export function upsertLocal<T extends { id: string }>(items: T[], entry: T, limit = 50): T[] {
  return [entry, ...items.filter(item => item.id !== entry.id)].slice(0, limit);
}

export function removeLocal<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter(item => item.id !== id);
}
