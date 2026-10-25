import { Box3, Vector3 } from "three";
import { CAMPUS_BUILDINGS } from "@/features/location/campus-data";
import { GROUND_HEIGHT, STOREY_HEIGHT } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import { FLAT_RISE, LANDMARK_RISE, floorSpacing } from "@/features/location/scene-anchors";
import type { Hall, PlanPoint, PlanRect } from "@/features/location/types";
import type { SceneBox } from "./BoxInstances";
import type { Pane } from "./Panes";
import { BUILDING_STYLE, CAMPUS_STYLE, WINDOW_COLOR, type BlockStyle } from "./palettes";

// Which blocks, lines and windows the scenes draw, in plan coordinates
// (x right, y toward the viewer, z up). Label positions live in scene-anchors.ts.

function block(r: PlanRect, z: number, h: number): SceneBox {
  return { x: r.x, y: r.y, z, w: r.w, d: r.d, h };
}

function rectOutline(r: PlanRect): PlanPoint[] {
  return [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.d], [r.x, r.y + r.d]];
}

/** Segments ([x, height, y] × 2) around an outline at height z. */
function ring(outline: PlanPoint[], z: number, out: number[]) {
  outline.forEach((p, i) => {
    const q = outline[(i + 1) % outline.length];
    out.push(p[0], z, p[1], q[0], z, q[1]);
  });
}

/** Bottom, top and corner edges of a raised outline. */
function outlineEdges(outline: PlanPoint[], z0: number, z1: number, out: number[]) {
  ring(outline, z0, out);
  ring(outline, z1, out);
  outline.forEach((p) => out.push(p[0], z0, p[1], p[0], z1, p[1]));
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

/** A style's blocks with their outlines and floor lines. */
export interface StyledBlocks {
  style: BlockStyle;
  boxes: SceneBox[];
  /** Buildings that are not axis-aligned rectangles. */
  shapes: { key: string; outline: PlanPoint[]; height: number }[];
  edges: number[];
  lines: number[];
}

function styled(style: BlockStyle): StyledBlocks {
  return { style, boxes: [], shapes: [], edges: [], lines: [] };
}

interface Building {
  key: string;
  footprint: PlanRect;
  outline?: PlanPoint[];
  floors: number;
}

/** Adds a building; halls get a line every half floor like the design, others every floor. */
function addBuilding(group: StyledBlocks, b: Building, lineStep: number) {
  const height = b.floors * STOREY_HEIGHT;
  const outline = b.outline ?? rectOutline(b.footprint);
  if (b.outline) {
    group.shapes.push({ key: b.key, outline: b.outline, height });
  } else {
    group.boxes.push(block(b.footprint, GROUND_HEIGHT, height));
  }
  outlineEdges(outline, GROUND_HEIGHT, GROUND_HEIGHT + height, group.edges);
  for (let z = GROUND_HEIGHT + lineStep; z < GROUND_HEIGHT + height - 0.01; z += lineStep) {
    ring(outline, z, group.lines);
  }
}

export const CAMPUS_CONTEXT: StyledBlocks = (() => {
  const group = styled(CAMPUS_STYLE.context);
  CAMPUS_BUILDINGS.forEach((b) => addBuilding(group, { key: b.no, ...b }, STOREY_HEIGHT));
  return group;
})();

/** Halls in their three looks: normal, selected, left out by the filter. */
export function campusHalls(selectedId: string | null, dimmed: Set<string>): StyledBlocks[] {
  const groups = { hall: styled(CAMPUS_STYLE.hall), hallSelected: styled(CAMPUS_STYLE.hallSelected), hallMuted: styled(CAMPUS_STYLE.hallMuted) };
  HALL_LIST.forEach((h) => {
    const key = h.id === selectedId ? "hallSelected" : dimmed.has(h.id) ? "hallMuted" : "hall";
    addBuilding(groups[key], { key: h.id, ...h }, STOREY_HEIGHT / 2);
  });
  return Object.values(groups);
}

/** Frames the halls and nearby buildings (the landscape runs on past it). */
export const CAMPUS_BOUNDS = (() => {
  const box = new Box3();
  [...HALL_LIST, ...CAMPUS_BUILDINGS].forEach(({ footprint: f, floors }) => {
    box.expandByPoint(new Vector3(f.x, 0, f.y));
    box.expandByPoint(new Vector3(f.x + f.w, GROUND_HEIGHT + floors * STOREY_HEIGHT, f.y + f.d));
  });
  return box.expandByVector(new Vector3(1.5, 0, 1.5));
})();

// ---- Windows ------------------------------------------------------------------

/** One wall: start point, direction (unit) and length. */
interface Wall {
  start: PlanPoint;
  dir: PlanPoint;
  length: number;
  /** Outward normal, to set the panes just in front of the wall. */
  normal: PlanPoint;
}

/** The two longest opposite walls, where the design puts the windows. */
function longWalls(outline: PlanPoint[]): Wall[] {
  let area = 0;
  outline.forEach((p, i) => {
    const q = outline[(i + 1) % outline.length];
    area += p[0] * q[1] - q[0] * p[1];
  });
  const walls = outline.map((p, i): Wall => {
    const q = outline[(i + 1) % outline.length];
    const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const dir: PlanPoint = [(q[0] - p[0]) / length, (q[1] - p[1]) / length];
    return { start: p, dir, length, normal: area > 0 ? [dir[1], -dir[0]] : [-dir[1], dir[0]] };
  });
  const longest = walls.reduce((a, b) => (b.length > a.length ? b : a));
  const opposite = walls.filter((w) => w !== longest && w.dir[0] * longest.dir[0] + w.dir[1] * longest.dir[1] < -0.9);
  return [longest, ...opposite.slice(0, 1)];
}

function pane(wall: Wall, a0: number, a1: number, z0: number, z1: number, color: string, depth = 0.02): Pane {
  const along = (a0 + a1) / 2;
  return {
    x: wall.start[0] + wall.dir[0] * along,
    y: wall.start[1] + wall.dir[1] * along,
    z: (z0 + z1) / 2,
    width: a1 - a0,
    height: z1 - z0,
    angle: Math.atan2(wall.dir[1], wall.dir[0]),
    depth,
    color,
  };
}

/** A row of small windows per floor. */
function rowWindows(wall: Wall, floors: number, out: Pane[]) {
  const n = Math.max(1, Math.floor((wall.length - 0.4) / 1.25));
  const gap = (wall.length - n * 0.3) / (n + 1);
  for (let k = 0; k < floors; k++) {
    const z0 = GROUND_HEIGHT + k * STOREY_HEIGHT + 0.16;
    for (let m = 0; m < n; m++) {
      const a = gap + m * (0.3 + gap);
      out.push(pane(wall, a, a + 0.3, z0, z0 + 0.25, WINDOW_COLOR.pane));
    }
  }
}

/** 하용조관: two-storey glass panels, a glazed ground floor and paired windows elsewhere. */
function curtainWindows(wall: Wall, floors: number, out: Pane[]) {
  const len = wall.length;
  const fz = (k: number) => GROUND_HEIGHT + k * STOREY_HEIGHT;
  const panels = [[0.5, 2.3, 7, 9], [0.5, 2.3, 3, 5], [2.9, 4.6, 1, 3], [5, 6.7, 6, 8]].map(([a0, a1, k0, k1]) => [(a0 / 7) * len, (a1 / 7) * len, k0, k1]);
  panels.forEach(([a0, a1, k0, k1]) => {
    const [z0, z1] = [fz(k0) + 0.1, fz(k1) - 0.08];
    out.push(pane(wall, a0, a1, z0, z1, WINDOW_COLOR.curtainWall));
    for (let m = 1; m < 3; m++) {
      const a = a0 + ((a1 - a0) * m) / 3;
      out.push(pane(wall, a - 0.025, a + 0.025, z0, z1, WINDOW_COLOR.pane, 0.03));
    }
    const mid = (fz(k0) + fz(k1)) / 2;
    out.push(pane(wall, a0, a1, mid - 0.02, mid + 0.02, WINDOW_COLOR.pane, 0.03));
  });
  for (let a = 0.25; a + 0.7 <= len - 0.2; a += 0.95) out.push(pane(wall, a, a + 0.7, 0.24, 0.62, WINDOW_COLOR.lobby));
  const bays = Math.floor((len - 0.3) / 0.62);
  for (let k = 1; k < floors; k++) {
    const z0 = fz(k) + 0.14;
    for (let m = 0; m < bays; m++) {
      const a = 0.25 + m * 0.62;
      if (panels.some(([a0, a1, k0, k1]) => a + 0.4 > a0 - 0.1 && a < a1 + 0.1 && k >= k0 && k < k1)) continue;
      out.push(pane(wall, a, a + 0.15, z0, z0 + 0.3, WINDOW_COLOR.pane), pane(wall, a + 0.22, a + 0.37, z0, z0 + 0.3, WINDOW_COLOR.pane));
    }
  }
}

export const CAMPUS_WINDOWS: Pane[] = (() => {
  const out: Pane[] = [];
  HALL_LIST.forEach((h) => {
    longWalls(h.outline ?? rectOutline(h.footprint)).forEach((wall) => {
      if (h.id === "hyj") {
        curtainWindows(wall, h.floors, out);
      } else {
        rowWindows(wall, h.floors, out);
      }
    });
  });
  return out;
})();

// ---- One hall, floors pulled apart ---------------------------------------

export interface BuildingBlocks {
  groups: { key: keyof typeof BUILDING_STYLE; boxes: SceneBox[]; opacity: number }[];
  bounds: Box3;
}

/** `spread` 0 = floors stacked (접기), 1 = pulled apart (펼치기); in between while animating. */
export function buildingBlocks(h: Hall, spread: number): BuildingBlocks {
  const { plan } = h;
  const { pitch, slab } = floorSpacing(spread);
  const laundryFloors = new Set(h.laundries.map((l) => l.floor));
  const open = spread > 0.5;
  const top = h.floors - 1;
  const by: Record<keyof typeof BUILDING_STYLE, SceneBox[]> = {
    laundryFloor: [],
    ghostFloor: [],
    solidFloor: [],
    landmark: [],
    laundryRoom: [],
    door: [],
  };

  for (let k = 0; k <= top; k++) {
    const z = k * pitch;
    const laundry = laundryFloors.has(k + 1);
    const floorKey = laundry ? "laundryFloor" : open ? "ghostFloor" : "solidFloor";
    plan.wings.forEach((w) => by[floorKey].push(block(w, z, slab)));
    if (laundry && open) {
      by.laundryRoom.push(block(plan.laundry, z + slab, 0.6));
    }
    if (k === top) {
      plan.landmarks.forEach((m) => by[m.flat ? "door" : "landmark"].push(block(m, z + slab, m.flat ? FLAT_RISE : LANDMARK_RISE)));
    }
  }

  const groups = (Object.keys(by) as (keyof typeof BUILDING_STYLE)[]).map((key) => ({ key, boxes: by[key], opacity: key === "ghostFloor" ? 0.7 : 1 }));
  return { groups, bounds: boxBounds(Object.values(by).flat()) };
}

/** Outlines for a list of blocks, six numbers per segment. */
export function boxEdges(boxes: SceneBox[]): number[] {
  const out: number[] = [];
  boxes.forEach((b) => outlineEdges(rectOutline(b), b.z, b.z + b.h, out));
  return out;
}
