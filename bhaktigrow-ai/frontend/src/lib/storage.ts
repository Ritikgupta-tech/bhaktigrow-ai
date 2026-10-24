/**
 * Safe LocalStorage helpers with defensive fallback to prevent crashes from malformed JSON or privacy modes
 */

export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[BhaktiGrow Storage] Failed to parse key "${key}", using default.`, error);
    return defaultValue;
  }
}

export function safeSetItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[BhaktiGrow Storage] Failed to write key "${key}".`, error);
    return false;
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[BhaktiGrow Storage] Failed to remove key "${key}".`, error);
  }
}

export const STORAGE_KEYS = {
  SAVED_ITEMS: 'bhaktigrow_saved_items',
  CALENDAR_ENTRIES: 'bhaktigrow_calendar_entries',
  PREFERENCES: 'bhaktigrow_preferences',
  RECENT_STUDIO: 'bhaktigrow_recent_studio'
} as const;
