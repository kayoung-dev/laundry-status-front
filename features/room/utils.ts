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
