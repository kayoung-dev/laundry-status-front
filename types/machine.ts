// Wire values from the backend API. Keep them exactly as the backend sends them.
export type MachineState = "available" | "in_use" | "maintenance" | "error" | "unknown";

// P2-002: which part of the wash cycle is running. Absent/null whenever the
// machine isn't in_use, or its OCR text doesn't use the wash-stage
// convention (see backend OcrReading.STAGE_PATTERN).
export type WashStage = "wash" | "rinse" | "spin";
