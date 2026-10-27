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

/** Height of a building block on the campus map. */
export function blockHeight(floors: number): number {
  return floors * STOREY_HEIGHT;
}

/** Roof height on the campus map: the block stands on the ground plate. */
export function roofHeight(floors: number): number {
  return GROUND_HEIGHT + blockHeight(floors);
}

export function hallPinAnchor(h: Hall): Anchor {
  if (h.labelAt) {
    return [h.labelAt[0], roofHeight(h.floors), h.labelAt[1]];
  }
  return [h.footprint.x + h.footprint.w / 2, roofHeight(h.floors), h.footprint.y + h.footprint.d * h.pinAt];
}

/** Corners of a hall's block on the campus map, for the camera to move toward. */
export function hallExtent(h: Hall): [Anchor, Anchor] {
  const { x, y, w, d } = h.footprint;
  return [
    [x, 0, y],
    [x + w, roofHeight(h.floors), y + d],
  ];
}

export const CONTEXT_LABELS: (AnchoredLabel & { name: string })[] = CAMPUS_BUILDINGS.map((b) => {
  const [x, y] = b.labelAt ?? [b.footprint.x + b.footprint.w / 2, b.footprint.y + b.footprint.d / 2];
  return { id: `ctx-${b.no}`, name: b.name, at: [x, roofHeight(b.floors), y] };
});

/** Floor spacing of the hall view: `spread` 0 = stacked (접기), 1 = pulled apart (펼치기). */
export function floorSpacing(spread: number): { pitch: number; slab: number } {
  return { pitch: 0.8 + (1.75 - 0.8) * spread, slab: 0.8 - (0.8 - 0.35) * spread };
}

export const LANDMARK_RISE = 0.5;
export const FLAT_RISE = 0.12;

export interface StackedFloor {
  floor: number;
  /** Bottom of the slab. */
  z: number;
  laundry: boolean;
}

/** A hall's floors in the hall view, bottom up, shared by the blocks and their labels. */
export function floorStack(h: Hall, spread: number): { floors: StackedFloor[]; slab: number; open: boolean } {
  const { pitch, slab } = floorSpacing(spread);
  const laundryFloors = new Set(h.laundries.map((l) => l.floor));
  const floors = Array.from({ length: h.floors }, (_, k) => ({ floor: k + 1, z: k * pitch, laundry: laundryFloors.has(k + 1) }));
  return { floors, slab, open: spread > 0.5 };
}

export interface FloorLabel extends AnchoredLabel {
  floor: number;
  laundry: boolean;
}

export interface BuildingLabels {
  floors: FloorLabel[];
  landmarks: (AnchoredLabel & { label: string })[];
}

export function buildingLabels(h: Hall, spread: number): BuildingLabels {
  const { floors: stack, slab, open } = floorStack(h, spread);
  const front = Math.max(...h.plan.wings.map((w) => w.y + w.d));
  const floors: FloorLabel[] = stack
    .filter((f) => f.laundry || open || f.floor === 1 || f.floor === h.floors)
    .map((f) => ({ id: `floor-${f.floor}`, floor: f.floor, laundry: f.laundry, at: [0, f.z + slab / 2, front] as Anchor }));
  const roof = stack[stack.length - 1].z + slab;
  const landmarks = h.plan.landmarks.map((m, i) => ({
    id: `landmark-${i}`,
    label: m.label,
    at: [m.x + m.w / 2, roof + (m.flat ? 0 : LANDMARK_RISE), m.flat ? m.y + 1 : m.y + m.d / 2] as Anchor,
  }));
  return { floors, landmarks };
}
