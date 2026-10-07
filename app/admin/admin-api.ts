// Shared client-side access to the admin API (US-008).
//
// Auth is the httpOnly `washon_admin_session` cookie the API sets at login,
// so every call must opt into sending credentials cross-origin
// (frontend :3000 -> backend :8081). The cookie is unreadable from JS by
// design, which is why "am I logged in?" is a request to /admin/auth/me
// rather than a cookie check.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

export type MachineState = "available" | "in_use" | "maintenance" | "error" | "unknown";

export interface DashboardMachine {
  machineId: string;
  label: string;
  type: string;
  roomId: string;
  roomName: string;
  state: MachineState;
  remainingMin: number | null;
  errorCode: string | null;
  overrideActive: boolean;
  overrideBy: string | null;
  needsCheck: boolean;
  reportCount: number;
  version: number;
  updatedAt: string | null;
  lastFrameAt: string | null;
  cameraDown: boolean;
  cameraDownSince: string | null;
}

export interface AuditEntry {
  id: string;
  machineId: string;
  source: string;
  state: MachineState;
  version: number;
  createdAt: string;
  override: { action: "set" | "clear"; adminId: string; adminEmail: string } | null;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  siteScopeId: string | null;
}

/** Thrown for a 401 so callers can redirect to the login page. */
export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
  }
}

export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}
