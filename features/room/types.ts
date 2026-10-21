import type { MachineState, WashStage } from "@/types/machine";

export interface MachineSnapshotItem {
  machineId: string;
  type: string;
  label: string;
  state: MachineState;
  remainingMin: number | null;
  washStage: WashStage | null;
  errorCode: string | null;
  overrideActive: boolean;
  version: number;
  updatedAt: string | null;
}

/** `snapshot` event of GET /rooms/{roomId}/stream. */
export interface RoomSnapshotPayload {
  roomId: string;
  machines: MachineSnapshotItem[];
}

/** `machine_changed` event of GET /rooms/{roomId}/stream. */
export interface MachineChangedPayload {
  machineId: string;
  state: MachineState;
  remainingMin: number | null;
  washStage: WashStage | null;
  errorCode: string | null;
  version: number;
  updatedAt: string | null;
}

export type ConnectionStatus = "connecting" | "connected" | "error";

export interface TypeSummary {
  type: string;
  total: number;
  available: number;
}
