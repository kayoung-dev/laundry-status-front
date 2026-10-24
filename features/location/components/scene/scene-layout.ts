import { Box3, Vector3 } from "three";
import { CAMPUS_BUILDINGS, GROUNDS, ROADS } from "@/features/location/campus-data";
import { GROUND_HEIGHT, SCENE_COLOR, STOREY_HEIGHT } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import { FLAT_RISE, LANDMARK_RISE, floorSpacing } from "@/features/location/scene-anchors";
import type { Hall, PlanPoint, PlanRect } from "@/features/location/types";
import type { SceneBox } from "./BoxInstances";

// Which blocks the scenes draw, in plan coordinates (x right, y toward the viewer, z up).
// Label positions live in scene-anchors.ts.

const LINE = 0.03;

function block(r: PlanRect, z: number, h: number, color: string): SceneBox {
  return { x: r.x, y: r.y, z, w: r.w, d: r.d, h, color };
}

/** A storied block plus a thin band at every floor line, like the design's floor strokes. */
function storeys(r: PlanRect, floors: number, color: string, lineColor: string): SceneBox[] {
  const out = [block(r, GROUND_HEIGHT, floors * STOREY_HEIGHT, color)];
  for (let k = 1; k < floors; k++) {
    out.push(block({ x: r.x - 0.02, y: r.y - 0.02, w: r.w + 0.04, d: r.d + 0.04 }, GROUND_HEIGHT + k * STOREY_HEIGHT - LINE / 2, LINE, lineColor));
  }
  return out;
}

function boxBounds(boxes: SceneBox[]): Box3 {
  const box = new Box3();
  boxes.forEach((b) => {
    box.expandByPoint(new Vector3(b.x, b.z, b.y));
    box.expandByPoint(new Vector3(b.x + b.w, b.z + b.h, b.y + b.d));
  });
  return box;
}

// ---- Campus -------------------------------------------------------------

export const CAMPUS_BASE: SceneBox[] = [
  ...GROUNDS.map((g) => block(g, 0, GROUND_HEIGHT, SCENE_COLOR.ground)),
  ...ROADS.map((r) => block(r, GROUND_HEIGHT, 0.01, SCENE_COLOR.road)),
];

export const CAMPUS_CONTEXT_BOXES: SceneBox[] = CAMPUS_BUILDINGS.filter((b) => !b.outline).flatMap((b) =>
  storeys(b.footprint, b.floors, SCENE_COLOR.context, SCENE_COLOR.contextLine),
);

export const CAMPUS_CONTEXT_SHAPES = CAMPUS_BUILDINGS.filter((b) => b.outline).map((b) => ({
  no: b.no,
  outline: b.outline as PlanPoint[],
  height: b.floors * STOREY_HEIGHT,
}));

export const CAMPUS_BOUNDS = boxBounds(CAMPUS_BASE).expandByPoint(new Vector3(0, GROUND_HEIGHT + 10 * STOREY_HEIGHT, 0));

export function campusHallBoxes(selectedId: string | null, dimmed: Set<string>): SceneBox[] {
  return HALL_LIST.flatMap((h) => {
    if (h.id === selectedId) {
      return storeys(h.footprint, h.floors, SCENE_COLOR.hallSelected, SCENE_COLOR.hallSelectedLine);
    }
    return storeys(h.footprint, h.floors, dimmed.has(h.id) ? SCENE_COLOR.hallMuted : SCENE_COLOR.hall, SCENE_COLOR.hallLine);
  });
}

// ---- One hall, floors pulled apart ---------------------------------------

export interface BuildingBlocks {
  solid: SceneBox[];
  /** See-through floors without a laundry room (펼치기 only). */
  ghost: SceneBox[];
  bounds: Box3;
}

/** `spread` 0 = floors stacked (접기), 1 = pulled apart (펼치기); in between while animating. */
export function buildingBlocks(h: Hall, spread: number): BuildingBlocks {
  const { plan } = h;
  const { pitch, slab } = floorSpacing(spread);
  const laundryFloors = new Set(h.laundries.map((l) => l.floor));
  const open = spread > 0.5;
  const top = h.floors - 1;
  const solid: SceneBox[] = [];
  const ghost: SceneBox[] = [];

  for (let k = 0; k <= top; k++) {
    const z = k * pitch;
    const laundry = laundryFloors.has(k + 1);
    plan.wings.forEach((w) => {
      if (laundry) {
        solid.push(block(w, z, slab, SCENE_COLOR.floorLaundry));
      } else {
        (open ? ghost : solid).push(block(w, z, slab, open ? SCENE_COLOR.floorGhost : SCENE_COLOR.floorSolid));
      }
    });
    if (laundry && open) {
      solid.push(block(plan.laundry, z + slab, 0.6, SCENE_COLOR.laundryRoom));
    }
    if (k === top) {
      plan.landmarks.forEach((m) => {
        solid.push(block(m, z + slab, m.flat ? FLAT_RISE : LANDMARK_RISE, m.flat ? SCENE_COLOR.door : SCENE_COLOR.landmark));
      });
    }
  }

  return { solid, ghost, bounds: boxBounds([...solid, ...ghost]) };
}
