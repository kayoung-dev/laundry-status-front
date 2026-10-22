import { DEVICE_ID_STORAGE_KEY } from "./constants";

export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server";
  }
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const generated = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    // localStorage unavailable (e.g. private mode) -- fall back to a
    // per-call id; reports still work, they just won't dedupe as one device.
    return crypto.randomUUID();
  }
}

/** JSON value from localStorage, or `fallback` when missing, unreadable or blocked. */
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown) {
  try {
    if (value == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Storage blocked: the value still lives in React state for this visit.
  }
}
