import type { MachineState } from "@/types/machine";

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
