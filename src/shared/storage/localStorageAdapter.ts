export interface JsonStorageAdapter {
  read<T>(key: string, fallback: T): T;
  write<T>(key: string, value: T): void;
  remove(key: string): void;
}

export function createLocalStorageAdapter(storage: Storage): JsonStorageAdapter {
  return {
    read<T>(key: string, fallback: T): T {
      const raw = storage.getItem(key);
      if (raw === null) return fallback;

      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    write<T>(key: string, value: T): void {
      storage.setItem(key, JSON.stringify(value));
    },
    remove(key: string): void {
      storage.removeItem(key);
    },
  };
}
