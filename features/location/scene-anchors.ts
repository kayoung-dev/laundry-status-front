import { CAMPUS_BUILDINGS } from "./campus-data";
import { GROUND_HEIGHT, STOREY_HEIGHT } from "./constants";
import type { Hall } from "./types";

// Where the HTML labels over the 3D map sit. Plain numbers (no three.js), so the
// page can lay out labels while the scene itself loads separately.

/** Point in the 3D map, in three.js order: [plan x, height, plan y]. */
export type Anchor = [number, number, number];

export interface AnchoredLabel {
  id: string;
  at: Anchor;
}

function hallTop(h: Hall): number {
  return GROUND_HEIGHT + h.floors * STOREY_HEIGHT;
}

export function hallPinAnchor(h: Hall): Anchor {
  return [h.footprint.x + h.footprint.w / 2, hallTop(h), h.footprint.y + h.footprint.d * h.pinAt];
}

/** Corners of a hall's block on the campus map, for the camera to move toward. */
export function hallExtent(h: Hall): [Anchor, Anchor] {
  const { x, y, w, d } = h.footprint;
  return [
    [x, 0, y],
    [x + w, hallTop(h), y + d],
  ];
}

export const CONTEXT_LABELS: (AnchoredLabel & { name: string })[] = CAMPUS_BUILDINGS.map((b) => {
  const [x, y] = b.labelAt ?? [b.footprint.x + b.footprint.w / 2, b.footprint.y + b.footprint.d / 2];
  return { id: `ctx-${b.no}`, name: b.name, at: [x, GROUND_HEIGHT + b.floors * STOREY_HEIGHT, y] };
});

/** Floor spacing of the hall view: `spread` 0 = stacked (접기), 1 = pulled apart (펼치기). */
export function floorSpacing(spread: number): { pitch: number; slab: number } {
  return { pitch: 0.8 + (1.75 - 0.8) * spread, slab: 0.8 - (0.8 - 0.35) * spread };
}

export const LANDMARK_RISE = 0.5;
export const FLAT_RISE = 0.12;

export interface FloorLabel extends AnchoredLabel {
  floor: number;
  laundry: boolean;
}

export interface BuildingLabels {
  floors: FloorLabel[];
  landmarks: (AnchoredLabel & { label: string })[];
}

export function buildingLabels(h: Hall, spread: number): BuildingLabels {
  const { pitch, slab } = floorSpacing(spread);
  const laundryFloors = new Set(h.laundries.map((l) => l.floor));
  const front = Math.max(...h.plan.wings.map((w) => w.y + w.d));
  const open = spread > 0.5;
  const top = h.floors - 1;
  const floors: FloorLabel[] = [];
  for (let k = 0; k <= top; k++) {
    const laundry = laundryFloors.has(k + 1);
    if (laundry || open || k === 0 || k === top) {
      floors.push({ id: `floor-${k + 1}`, floor: k + 1, laundry, at: [0, k * pitch + slab / 2, front] });
    }
  }
  const roof = top * pitch + slab;
  const landmarks = h.plan.landmarks.map((m, i) => ({
    id: `landmark-${i}`,
    label: m.label,
    at: [m.x + m.w / 2, roof + (m.flat ? 0 : LANDMARK_RISE), m.flat ? m.y + 1 : m.y + m.d / 2] as Anchor,
  }));
  return { floors, landmarks };
}
