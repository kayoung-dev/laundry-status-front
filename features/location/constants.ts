import { STATE_LABEL, TYPE_LABEL } from "@/constants/machine-labels";
import type { MachineState } from "@/types/machine";
import type { KindFilter, MachineKind, MapView } from "./types";

// The location map names states the way the design canvas does.
export const LOCATION_STATE_LABEL: Record<MachineState, string> = {
  ...STATE_LABEL,
  available: "비어 있음",
  in_use: "동작 중",
};

/** Order of the state groups in the machine list. */
export const STATE_ORDER: MachineState[] = ["available", "in_use", "maintenance", "error", "unknown"];

export const KIND_LABEL = TYPE_LABEL as Record<MachineKind, string>;

export const VIEW_TABS: { id: MapView; label: string; short: string }[] = [
  { id: "3d", label: "3D 지도", short: "3D" },
  { id: "list", label: "목록", short: "목록" },
];

export const KIND_FILTERS: { id: KindFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "washer", label: "세탁기" },
  { id: "dryer", label: "건조기" },
];

export const SPACING_TABS: { id: "open" | "closed"; label: string }[] = [
  { id: "open", label: "펼치기" },
  { id: "closed", label: "접기" },
];

export const FLOOR_TABS: { id: "floor" | "room"; label: string }[] = [
  { id: "floor", label: "층 전체" },
  { id: "room", label: "세탁실 확대" },
];

/** Which side the camera looks from, per quarter turn ("북쪽에서 보는 중"). */
export const VIEW_SIDES = ["북", "동", "남", "서"];

/** Camera moves toward a hall or floor in this long (design: 0.4 s). */
export const FOCUS_MS = 400;

// 3D sizes in plan units.
export const STOREY_HEIGHT = 0.55;
export const GROUND_HEIGHT = 0.2;
