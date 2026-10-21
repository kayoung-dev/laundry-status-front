import type { MachineState, WashStage } from "@/types/machine";

// P2-002: stage-specific icon + label, shown instead of the state label for
// an in_use machine with a known stage.
export const STAGE_LABEL: Record<WashStage, string> = {
  wash: "🧺 세탁 중",
  rinse: "💧 헹굼 중",
  spin: "🌀 탈수 중",
};

// Options offered in the "상태가 달라요" picker.
export const REPORTABLE_STATES: MachineState[] = ["available", "in_use", "error", "unknown"];

// Anonymous per-browser identifier sent as device_id on POST /reports (plan
// section 2: student flow has no login). Persisted in localStorage so
// repeated reports from the same browser count as the same device_id, as
// US-007's needs-check threshold expects.
export const DEVICE_ID_STORAGE_KEY = "washon_device_id";
