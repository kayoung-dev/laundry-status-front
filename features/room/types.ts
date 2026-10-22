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

/** Card palette: free green, busy blue, soon blue with an amber badge, off red/gray, unknown gray. */
export type MachineTone = "free" | "busy" | "soon" | "off" | "unknown";

export type StepStatus = "done" | "current" | "todo";

export interface StepView {
  name: string;
  status: StepStatus;
  /** 0–1 of this step, for the "내 세탁" segment bars. */
  fill: number;
}

/** What a machine card shows, derived from one snapshot item and the clock. */
export interface MachineView {
  tone: MachineTone;
  badge: string;
  dialLabel: string;
  dialValue: string;
  /** Dial value is a number ("24분") rather than words; drawn larger. */
  dialNumeric: boolean;
  dialSub: string;
  dialAria: string;
  /** 0–1 of the ring drawn in the tone color. */
  progress: number;
  title: string;
  sub: string;
  steps: StepView[] | null;
  /** Dryer progress bar, 0–1. */
  bar: number | null;
  meta: string;
  /** Minutes left when known, for "다음 빈자리" and the 내 세탁 timer. */
  remainingMin: number | null;
  canNotify: boolean;
  canRegister: boolean;
}

export interface TypeCount {
  type: string;
  total: number;
  available: number;
}
