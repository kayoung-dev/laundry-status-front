import type { MachineState, WashStage } from "@/types/machine";

// Wash cycle order, as the OCR stage prefix (W/R/S) reports it.
export const WASH_STAGES: WashStage[] = ["wash", "rinse", "spin"];

export const STAGE_NAME: Record<WashStage, string> = {
  wash: "세탁",
  rinse: "헹굼",
  spin: "탈수",
};

// Typical full cycle per machine type. The backend only sends minutes left, so
// progress dials and the stage guess (when OCR has no stage prefix) use these.
export const CYCLE_MIN: Record<string, number> = {
  washer: 52,
  dryer: 60,
};
export const DEFAULT_CYCLE_MIN = 52;

// Where each stage ends, as a share of a washer cycle (세탁 26 · 헹굼 14 · 탈수 12 of 52 min).
export const STAGE_END_RATIO: Record<WashStage, number> = {
  wash: 0.5,
  rinse: 0.77,
  spin: 1,
};

// "곧 끝나요" from this many minutes left.
export const SOON_MIN = 10;

// Machine types in display order; unknown types follow.
export const TYPE_ORDER = ["washer", "dryer"];

// Options offered in the "상태가 달라요" picker.
export const REPORTABLE_STATES: MachineState[] = ["available", "in_use", "error", "unknown"];

// Anonymous per-browser identifier sent as device_id on POST /reports (plan
// section 2: student flow has no login). Persisted in localStorage so
// repeated reports from the same browser count as the same device_id, as
// US-007's needs-check threshold expects.
export const DEVICE_ID_STORAGE_KEY = "washon_device_id";

// Per-browser until student accounts exist.
export const MY_MACHINE_STORAGE_KEY = "washon.myMachine";
export const ALERTS_STORAGE_KEY = "washon.alerts";
