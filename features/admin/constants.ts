import type { MachineState } from "@/types/machine";

// Mirrors OVERRIDABLE_STATES in the backend (dev.washon.admin OverrideRequest/AdminService).
export const OVERRIDABLE_STATES: MachineState[] = ["maintenance", "error", "unknown"];

// A burst of OCR frames collapses into one GET /admin/machines.
export const STREAM_REFETCH_DEBOUNCE_MS = 300;
// cameraDown / needsCheck / reportCount are computed at read time and never
// signalled on the stream, so they are picked up by this periodic re-read.
export const PERIODIC_REFETCH_MS = 15_000;
// EventSource only retries network errors by itself; after a hard failure
// (e.g. a 502/503 while the backend restarts) it is reopened after this delay.
export const STREAM_RECONNECT_MS = 5_000;

export const LOGIN_PATH = "/admin/login";
