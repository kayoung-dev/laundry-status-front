import { adminFetch, adminRequest, apiUrl } from "@/lib/api/client";
import type { MachineState } from "@/types/machine";
import type { AdminUser, AuditEntry, DashboardMachine } from "./types";

export function getCurrentAdmin(): Promise<AdminUser> {
  return adminFetch<AdminUser>("/admin/auth/me");
}

/** Sets the httpOnly session cookie used by every later admin call. */
export async function login(email: string, password: string): Promise<void> {
  await adminRequest("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export async function logout(): Promise<void> {
  await adminRequest("/admin/auth/logout", { method: "POST" });
}

export function getDashboardMachines(): Promise<DashboardMachine[]> {
  return adminFetch<DashboardMachine[]>("/admin/machines");
}

/** Signals `machine_changed` for every committed state change in any room. */
export function machinesStreamUrl(): string {
  return apiUrl("/admin/machines/stream");
}

export async function setMachineOverride(machineId: string, state: MachineState): Promise<void> {
  await adminFetch(`/admin/machines/${machineId}/override`, { method: "POST", body: JSON.stringify({ state }) });
}

export async function clearMachineOverride(machineId: string): Promise<void> {
  await adminFetch(`/admin/machines/${machineId}/override/clear`, { method: "POST" });
}

export function getOverrideAuditLog(machineId: string): Promise<AuditEntry[]> {
  return adminFetch<AuditEntry[]>(`/admin/machines/${machineId}/events?source=admin_override&limit=20`);
}
