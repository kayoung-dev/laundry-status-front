import { CAMPUS_BUILDINGS, ROADS } from "@/features/location/campus-data";
import { GROUND_HEIGHT, STOREY_HEIGHT } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import type { PlanPoint, PlanRect } from "@/features/location/types";

// The campus surroundings from the design canvas "세탁실 위치", in plan units:
// rice paddies, stadium, plaza, parking, tennis court, roads, the forest belt
// along the campus edge and the fog beyond it. Flat parts are painted into the
// ground texture (ground-texture.ts); trees are drawn as 3D instances.

type Box = [x0: number, y0: number, x1: number, y1: number];

/** Area the ground texture covers. */
export const GROUND_EXTENT: Box = [-42, -46, 36, 20];

export interface Tree {
  x: number;
  y: number;
  /** Scale, about 1. */
  size: number;
  kind: "round" | "belt";
}

export interface Field {
  outline: PlanPoint[];
  color: string;
  /** Rice rows and their light edges, clipped to the field when painted. */
  rows: [PlanPoint, PlanPoint][];
  highlights: [PlanPoint, PlanPoint][];
}

// ---- Small geometry helpers ------------------------------------------------

/** Deterministic noise in [0, 1). */
function hash(a: number, b: number): number {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function inBox(x: number, y: number, o: Box, m: number): boolean {
  return x > o[0] - m && x < o[2] + m && y > o[1] - m && y < o[3] + m;
}

function inPoly(x: number, y: number, poly: PlanPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) {
      inside = !inside;
    }
  }
  return inside;
}

function segmentDistance(x: number, y: number, a: PlanPoint, b: PlanPoint): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l));
  return Math.hypot(a[0] + t * dx - x, a[1] + t * dy - y);
}

function lineDistance(x: number, y: number, line: PlanPoint[], closed: boolean): number {
  let m = Infinity;
  for (let i = 0; i < line.length - (closed ? 0 : 1); i++) {
    m = Math.min(m, segmentDistance(x, y, line[i], line[(i + 1) % line.length]));
  }
  return m;
}

/** Catmull-Rom curve through `points`, `steps` samples per span. */
function spline(points: PlanPoint[], steps: number, closed: boolean): PlanPoint[] {
  const out: PlanPoint[] = [];
  const n = points.length;
  const at = (i: number) => (closed ? points[(i + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (j: 0 | 1) =>
        0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
      out.push([c(0), c(1)]);
    }
  }
  if (!closed) {
    out.push(points[n - 1]);
  }
  return out;
}

function rect(x0: number, y0: number, x1: number, y1: number): PlanPoint[] {
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
}

function circle(cx: number, cy: number, r: number, n: number): PlanPoint[] {
  return Array.from({ length: n }, (_, k): PlanPoint => {
    const a = (k / n) * Math.PI * 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
}

/** Convex hull (monotone chain). */
function hull(points: PlanPoint[]): PlanPoint[] {
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: PlanPoint, a: PlanPoint, b: PlanPoint) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: PlanPoint[] = [];
  const upper: PlanPoint[] = [];
  pts.forEach((p) => {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  });
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/** A strip `width` wide along a center line. */
function ribbon(line: PlanPoint[], width: number): PlanPoint[] {
  const left: PlanPoint[] = [];
  const right: PlanPoint[] = [];
  line.forEach((p, i) => {
    const a = line[Math.max(0, i - 1)];
    const b = line[Math.min(line.length - 1, i + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = (b[0] - a[0]) / l;
    const ty = (b[1] - a[1]) / l;
    left.push([p[0] - (ty * width) / 2, p[1] + (tx * width) / 2]);
    right.push([p[0] + (ty * width) / 2, p[1] - (tx * width) / 2]);
  });
  return left.concat(right.reverse());
}

// ---- Campus edge -------------------------------------------------------------

const BOUNDARY = spline(
  [[-38, 14], [-8, 14], [8, 15.5], [21, 17.5], [29.5, 10], [30.5, -4], [31.5, -16], [32, -28], [26, -38], [5, -40], [-8, -41], [-17, -39], [-31, -29], [-39, -20], [-39, 4]],
  8,
  true,
);

/** The front of the campus (toward the viewer) has a forest belt and fog; the back fades out far away. */
const isFront = (x: number, y: number) => y > -12 && x > -30;

/** Signed distance to the campus edge, negative inside. */
const edgeDistance = (x: number, y: number) => (inPoly(x, y, BOUNDARY) ? -1 : 1) * lineDistance(x, y, BOUNDARY, true);

/** The campus edge pushed outward by `o` (inward when negative). */
function offsetBoundary(o: number): PlanPoint[] {
  const n = BOUNDARY.length;
  return BOUNDARY.map((p, i): PlanPoint => {
    const a = BOUNDARY[(i - 1 + n) % n];
    const b = BOUNDARY[(i + 1) % n];
    let nx = b[1] - a[1];
    let ny = -(b[0] - a[0]);
    const l = Math.hypot(nx, ny) || 1;
    nx /= l;
    ny /= l;
    if (inPoly(p[0] + nx * 0.2, p[1] + ny * 0.2, BOUNDARY)) {
      nx = -nx;
      ny = -ny;
    }
    return [p[0] + nx * o, p[1] + ny * o];
  });
}

/** What stays clear of fog: the edge plus a margin in front, stretched far out behind. */
export const FOG_CLEAR: PlanPoint[] = offsetBoundary(2.2).map((p, i) =>
  isFront(BOUNDARY[i][0], BOUNDARY[i][1]) ? p : [-4 + (p[0] + 4) * 6, -12 + (p[1] + 12) * 6],
);

// ---- Rice paddies (left of the campus) ----------------------------------------

const FIELD_EDGES = [-21.3, -13.8, -6.3, 1.2, 8.9];
const FIELD_X: [number, number] = [-32.8, -19];
const FIELD_COLORS = ["#9fc148", "#8db43c", "#adcc5a", "#97bb44"];

function fieldWave(x: number, k: number): number {
  return (k === 0 || k === 4 ? 0.35 : 1) * (0.9 * Math.sin(0.42 * x + 1.7 * k) + 0.35 * Math.sin(0.95 * x + 0.6 * k));
}

export const FIELDS: Field[] = FIELD_COLORS.map((color, k) => {
  const top: PlanPoint[] = [];
  const bottom: PlanPoint[] = [];
  for (let x = FIELD_X[0]; x <= FIELD_X[1] + 0.01; x += 0.7) {
    top.push([x, FIELD_EDGES[k] + fieldWave(x, k) + (k ? 0.35 : 0)]);
    bottom.push([x, FIELD_EDGES[k + 1] + fieldWave(x, k + 1) - (k < 3 ? 0.35 : 0)]);
  }
  const rows: [PlanPoint, PlanPoint][] = [];
  const highlights: [PlanPoint, PlanPoint][] = [];
  const [x0, x1] = [FIELD_X[0] - 0.5, FIELD_X[1] + 0.5];
  const [y0, y1] = [FIELD_EDGES[k] - 1.4, FIELD_EDGES[k + 1] + 1.4];
  // Rows run across in every other field, along in the rest.
  if (k % 2 === 0) {
    for (let y = y0; y < y1; y += 0.3) {
      rows.push([[x0, y], [x1, y]]);
      highlights.push([[x0, y + 0.1], [x1, y + 0.1]]);
    }
  } else {
    for (let x = x0; x < x1; x += 0.3) {
      rows.push([[x, y0], [x, y1]]);
      highlights.push([[x + 0.1, y0], [x + 0.1, y1]]);
    }
  }
  return { outline: top.concat(bottom.reverse()), color, rows, highlights };
});

const FIELD_BOX: Box = [-33.6, -22.4, -18.6, 10];
const FIELD_TREE_BOX: Box = [-33.6, -22.4, -15.6, 10];

// ---- Stadium: red track around a striped pitch ----------------------------------

const STADIUM_SCALE = 1.6;
const STADIUM_CENTER: PlanPoint = [10, -21];
const STADIUM_HALF_WIDTH = 4.2 * STADIUM_SCALE;
const STADIUM_STRAIGHT = 2 * STADIUM_SCALE;
const TRACK_WIDTH = STADIUM_SCALE;

function stadiumShape(r: number): PlanPoint[] {
  const [cx, cy] = STADIUM_CENTER;
  const pts: PlanPoint[] = [];
  for (let k = 0; k <= 24; k++) {
    const a = -Math.PI / 2 + (k / 24) * Math.PI;
    pts.push([cx + STADIUM_STRAIGHT + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  for (let k = 0; k <= 24; k++) {
    const a = Math.PI / 2 + (k / 24) * Math.PI;
    pts.push([cx - STADIUM_STRAIGHT + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

const PITCH_X = 3.9 * STADIUM_SCALE;
const PITCH_Y = 2.3 * STADIUM_SCALE;

export const STADIUM = (() => {
  const [cx, cy] = STADIUM_CENTER;
  const K = STADIUM_SCALE;
  const inner = STADIUM_HALF_WIDTH - TRACK_WIDTH;
  const stripes: PlanPoint[][] = [];
  const n = 12;
  for (let k = 0; k < n; k += 2) {
    const x0 = cx - PITCH_X + (k * 2 * PITCH_X) / n;
    stripes.push(rect(x0, cy - PITCH_Y, x0 + (2 * PITCH_X) / n, cy + PITCH_Y));
  }
  const boxes = (w: number, h: number) => [
    rect(cx - PITCH_X, cy - h * K, cx - PITCH_X + w * K, cy + h * K),
    rect(cx + PITCH_X - w * K, cy - h * K, cx + PITCH_X, cy + h * K),
  ];
  return {
    apron: stadiumShape(STADIUM_HALF_WIDTH + 0.5 * K),
    trackOuter: stadiumShape(STADIUM_HALF_WIDTH),
    trackInner: stadiumShape(inner),
    lanes: [0.25, 0.5, 0.75].map((d) => stadiumShape(STADIUM_HALF_WIDTH - d * TRACK_WIDTH)),
    pitch: stadiumShape(inner),
    stripes,
    /** Closed outlines of the pitch markings. */
    markings: [
      rect(cx - PITCH_X, cy - PITCH_Y, cx + PITCH_X, cy + PITCH_Y),
      circle(cx, cy, 0.85 * K, 32),
      ...boxes(0.9, 1.1),
      ...boxes(0.35, 0.55),
      rect(cx - PITCH_X - 0.25 * K, cy - 0.3 * K, cx - PITCH_X, cy + 0.3 * K),
      rect(cx + PITCH_X, cy - 0.3 * K, cx + PITCH_X + 0.25 * K, cy + 0.3 * K),
    ],
    halfway: [[cx, cy - PITCH_Y], [cx, cy + PITCH_Y]] as [PlanPoint, PlanPoint],
  };
})();

const STADIUM_BOX: Box = [
  STADIUM_CENTER[0] - STADIUM_STRAIGHT - STADIUM_HALF_WIDTH - 0.6 * STADIUM_SCALE,
  STADIUM_CENTER[1] - STADIUM_HALF_WIDTH - 0.6 * STADIUM_SCALE,
  STADIUM_CENTER[0] + STADIUM_STRAIGHT + STADIUM_HALF_WIDTH + 0.6 * STADIUM_SCALE,
  STADIUM_CENTER[1] + STADIUM_HALF_WIDTH + 0.6 * STADIUM_SCALE,
];

// ---- Plaza, walkway, parking, tennis --------------------------------------------

const PLAZA_BOX: Box = [6.2, -4.4, 9.8, 9.4];
/** Walkway from 은혜관 along the halls to the plaza. */
const WALK_BOX: Box = [-15, 6.65, 6.2, 7.45];

export const PLAZA = (() => {
  const joints: [PlanPoint, PlanPoint][] = [];
  for (let y = -3.4; y < 9.4; y += 1) joints.push([[6.2, y], [y < 2.6 ? 9.8 : 9, y]]);
  for (let x = 7.2; x < 9.8; x += 1) joints.push([[x, -4.4], [x, x < 9 ? 9.4 : 2.6]]);
  for (let x = WALK_BOX[0] + 1.2; x < WALK_BOX[2]; x += 1.2) joints.push([[x, WALK_BOX[1]], [x, WALK_BOX[3]]]);
  return {
    areas: [[[6.2, -4.4], [9.8, -4.4], [9.8, 2.6], [9, 2.6], [9, 9.4], [6.2, 9.4]], rect(...WALK_BOX)] as PlanPoint[][],
    joints,
  };
})();

const LOT: PlanPoint[] = [[12.8, -5.6], [22.7, -5.6], [22.7, 6.6], [19.9, 9.4], [12.8, 9.4]];
const LOT_BOX: Box = [12.8, -5.6, 22.7, 9.4];
const DRIVEWAYS: [number, number][] = [[21.1, 22.7]];

export const PARKING = (() => {
  const stalls: [PlanPoint, PlanPoint][] = [];
  const rows: [number, number, number][] = [[12.9, 15.1, 12.9], [16.7, 18.9, 18.9], [18.9, 21.1, 18.9]];
  const depth = 1.1;
  rows.forEach(([x0, x1, back]) => {
    for (let y = -4.3; y + depth <= 9.3; y += depth) {
      const corners: PlanPoint[] = [[x0 + 0.05, y + 0.05], [x1 - 0.05, y + 0.05], [x0 + 0.05, y + depth - 0.05], [x1 - 0.05, y + depth - 0.05]];
      if (!corners.every((p) => inPoly(p[0], p[1], LOT))) continue;
      stalls.push([[x0, y], [x1, y]], [[x0, y + depth], [x1, y + depth]], [[back, y], [back, y + depth]]);
    }
  });
  return {
    areas: [LOT, ...DRIVEWAYS.map(([x0, x1]) => rect(x0, -7.6, x1, -5.4))],
    stalls,
    lanes: [
      ...[15.9, 21.9].map((x): [PlanPoint, PlanPoint] => [[x, -5], [x, x > 20 ? 7.2 : 8.8]]),
      [[13.4, -4.95], [22.2, -4.95]] as [PlanPoint, PlanPoint],
    ],
  };
})();

const TENNIS_BOX: Box = [6.8, -11.6, 9.2, -7.2];

export const TENNIS = (() => {
  const [c0, c1] = [7.15, 8.85];
  const [y0, y1] = [-11.25, -7.55];
  const ym = (y0 + y1) / 2;
  const xm = (c0 + c1) / 2;
  return {
    area: rect(...TENNIS_BOX),
    court: rect(c0, y0, c1, y1),
    lines: [
      [[c0 + 0.2, y0], [c0 + 0.2, y1]],
      [[c1 - 0.2, y0], [c1 - 0.2, y1]],
      [[c0 + 0.2, ym - 1.05], [c1 - 0.2, ym - 1.05]],
      [[c0 + 0.2, ym + 1.05], [c1 - 0.2, ym + 1.05]],
      [[xm, ym - 1.05], [xm, ym + 1.05]],
    ] as [PlanPoint, PlanPoint][],
    net: [[c0 - 0.1, ym], [c1 + 0.1, ym]] as [PlanPoint, PlanPoint],
  };
})();

// ---- Roads, gravel, the shortened gap -------------------------------------------

const MAIN_ROAD_LINE = spline(
  [[38, -0.5], [31, -5.6], [25, -8], [19, -8.2], [14.6, -8.2], [12.8, -6.8], [10.8, -5.9], [8.6, -5.3], [7.4, -4.4]],
  6,
  false,
);
const MAIN_ROAD_WIDTH = 1.4;
const GATE: PlanPoint = [14.6, -8.2];

export const ROAD_AREAS: PlanPoint[][] = [
  ...ROADS.map((r) => rect(r.x, r.y, r.x + r.w, r.y + r.d)),
  // Short asphalt path in front of 갈대상자관.
  [[-9.885, -30.979], [-10.637, -28.911], [-11.577, -29.253], [-10.825, -31.321]],
];
export const MAIN_ROAD: PlanPoint[] = ribbon(MAIN_ROAD_LINE, MAIN_ROAD_WIDTH);
export const CROSSWALK: PlanPoint[][] = Array.from({ length: 5 }, (_, j) => {
  const y0 = -8.95 + j * 0.32;
  return rect(17.4, y0, 18.4, y0 + 0.18);
});

/** Gravel yard along the long wall of 갈대상자관. */
const YARD_ORIGIN: PlanPoint = [-7.658, -35.491];
const YARD_ALONG: PlanPoint = [-0.342, 0.94];
const YARD_ACROSS: PlanPoint = [0.94, 0.342];
const yardPoint = (s: number, t: number): PlanPoint => [
  YARD_ORIGIN[0] + YARD_ALONG[0] * s + YARD_ACROSS[0] * t,
  YARD_ORIGIN[1] + YARD_ALONG[1] * s + YARD_ACROSS[1] * t,
];

export const GRAVEL = (() => {
  const sign = (v: number) => (v < 0 ? -1 : 1);
  const outline = Array.from({ length: 36 }, (_, k) => {
    const a = (k / 36) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return yardPoint(2.5 + 2.85 * sign(c) * Math.abs(c) ** 0.35, 1.3 + 1.1 * sign(s) * Math.abs(s) ** 0.35);
  });
  const stones = Array.from({ length: 300 }, (_, k) => {
    const [x, y] = yardPoint(-0.2 + 5.4 * hash(k, 3), 0.35 + 1.9 * hash(5, k));
    return { x, y, r: 0.069 * (0.7 + 0.6 * hash(k, 9)), light: k % 3 === 0 };
  });
  return { outline, stones };
})();

/** Wavy double line: the distance between 하용조관 and 갈대상자관 is drawn shorter than it is. */
export const SHORTENED_GAP = (() => {
  const wave = (y0: number) => {
    const pts: PlanPoint[] = [];
    for (let x = -14.5; x <= -6; x += 0.25) pts.push([x, y0 + 0.28 * Math.sin((x + 14.5) * 1.6)]);
    return pts;
  };
  const a = wave(-23);
  const b = wave(-24.1);
  return { lines: [a, b], fill: a.concat(b.slice().reverse()) };
})();

// ---- Shadows --------------------------------------------------------------------

/** Sun from the back left: each building throws its footprint toward +x, +y. */
function castShadow(footprint: PlanPoint[], height: number): PlanPoint[] {
  const dx = 0.45 * height;
  const dy = 0.2 * height;
  return hull(footprint.concat(footprint.map(([x, y]): PlanPoint => [x + dx, y + dy])));
}

function footprintOf(r: PlanRect, outline?: PlanPoint[]): PlanPoint[] {
  return outline ?? rect(r.x, r.y, r.x + r.w, r.y + r.d);
}

export const BUILDING_SHADOWS: PlanPoint[][] = [
  ...HALL_LIST.map((h) => castShadow(footprintOf(h.footprint, h.outline), h.floors * STOREY_HEIGHT + GROUND_HEIGHT)),
  ...CAMPUS_BUILDINGS.map((b) => castShadow(footprintOf(b.footprint, b.outline), b.floors * STOREY_HEIGHT + GROUND_HEIGHT)),
];

// ---- Trees ----------------------------------------------------------------------

const PLANTED: PlanPoint[] = [
  [12.8, -11.5], [11.2, -9.6], [12.9, -7.6], [12.9, 4.6], [12.7, 7.8], [10.6, -12.4],
  [3, -9], [3.6, -8.6], [5.6, -8.2], [2.4, -6.4], [4.6, -13.8], [6.2, -5.6],
  [-14.2, -13.2], [-14, -10.2], [-14.3, -7], [-7.6, -9.4], [-5.8, -6.6], [-8.8, -6.2], [2.9, -15.6], [-2.4, -6.6], [7.6, -9], [7.8, 0.8], [7.6, 5.6],
  [-13.2, -18.4], [-10.6, -18.6], [-5.2, -18.2], [-2, -18.4], [2.2, -17.6], [6, -16.4], [10.6, -17], [12.6, -15.2],
  [-12, -35.2], [-12.2, -32.6], [-7, -34.8], [-7.2, -31.8],
];

const REED_BOX: Box = [-12.2, -36.8, -4.8, -28.4];
const CAMPUS_BOX: Box = [-16.4, -20, 13.9, 10.9];

/** Grass only: between 하용조관 and 갈대상자관, and above the stadium. */
const isClearing = (x: number, y: number) => inBox(x, y, [-22, -32, -3, -16.3], 0) || (x - y > 14 && x - y < 50 && x + y < -22.5 && x + y > -70);

const boxOf = (r: PlanRect): Box => [r.x, r.y, r.x + r.w, r.y + r.d];
const OBSTACLES: Box[] = [
  ...HALL_LIST.map((h) => boxOf(h.footprint)),
  ...CAMPUS_BUILDINGS.map((b) => boxOf(b.footprint)),
  STADIUM_BOX,
  PLAZA_BOX,
  WALK_BOX,
  LOT_BOX,
  TENNIS_BOX,
];

function blocked(x: number, y: number, m: number): boolean {
  return (
    OBSTACLES.some((o) => inBox(x, y, o, m)) ||
    ROADS.some((r) => inBox(x, y, boxOf(r), 0.45)) ||
    lineDistance(x, y, MAIN_ROAD_LINE, false) < MAIN_ROAD_WIDTH / 2 + Math.max(m, 0.45) ||
    Math.hypot(x - GATE[0], y - GATE[1]) < Math.max(m, 0.45) ||
    DRIVEWAYS.some(([x0, x1]) => inBox(x, y, [x0, -7.6, x1, -5.4], 0.3))
  );
}

/** Trees stay well inside the textured ground so none float past its faded edge. */
const TREE_BOX: Box = [GROUND_EXTENT[0] + 5, GROUND_EXTENT[1] + 5, GROUND_EXTENT[2] - 5, GROUND_EXTENT[3] - 5];

function plantTrees(): Tree[] {
  const spots: { x: number; y: number; kind: Tree["kind"] }[] = PLANTED.filter((_, i) => i % 3 === 0)
    .filter(([x, y]) => !inBox(x, y, FIELD_TREE_BOX, 0.3) && !isClearing(x, y))
    .map(([x, y]) => ({ x, y, kind: "round" }));

  // Woods on the empty land; sparse inside the campus.
  for (let i = 0; i < 48; i++) {
    for (let j = 0; j < 48; j++) {
      const x = -48 + i * 1.9 + (hash(i, j) - 0.5) * 1.33;
      const y = -50 + j * 1.9 + (hash(j + 31, i + 17) - 0.5) * 1.33;
      if (hash(i + 11, j + 23) > 0.33 || !inBox(x, y, TREE_BOX, 0)) continue;
      const inCampus = inBox(x, y, CAMPUS_BOX, 0);
      if ((isFront(x, y) && edgeDistance(x, y) > -2.6) || isClearing(x, y)) continue;
      if (inBox(x, y, FIELD_TREE_BOX, 0.3) || inBox(x, y, REED_BOX, 0.3)) continue;
      if (inCampus && hash(i + 5, j + 9) > 0.45) continue;
      if (blocked(x, y, inCampus ? 1.4 : 0.5)) continue;
      if (inCampus && spots.some((t) => Math.abs(t.x - x) < 1.1 && Math.abs(t.y - y) < 1.1)) continue;
      spots.push({ x, y, kind: "round" });
    }
  }

  // Woods around 갈대상자관, open toward the halls.
  for (let ring = 0; ring < 3; ring++) {
    for (let k = 0; k < 26; k++) {
      const a = (k / 26) * Math.PI * 2 + ring * 0.12;
      const s = Math.sin(a);
      if (s > 0.5) continue;
      const r = 4.9 + ring * 1.15 + (hash(k, ring + 40) - 0.5) * 0.6;
      const x = -8.8 + Math.cos(a) * r * 1.05;
      const y = -33 + s * r;
      if (inBox(x, y, REED_BOX, 0.2) || x - y > 27) continue;
      spots.push({ x, y, kind: "round" });
    }
  }

  // Forest belt: four dense rows along the front edge.
  for (let row = 0; row < 4; row++) {
    const edge = offsetBoundary(-1.8 + row * 1.1);
    let carry = (row % 2) * 0.52;
    edge.forEach((a, i) => {
      const b = edge[(i + 1) % edge.length];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      let t = carry;
      while (t < length) {
        const u = t / length;
        const x = a[0] + (b[0] - a[0]) * u + (hash(i * 7 + row, t * 13) - 0.5) * 0.5;
        const y = a[1] + (b[1] - a[1]) * u + (hash(t * 5 + row, i * 3) - 0.5) * 0.5;
        t += 1.05;
        if (!isFront(x, y) || !inBox(x, y, TREE_BOX, 0) || blocked(x, y, 0.4) || inBox(x, y, FIELD_BOX, 0.3) || inBox(x, y, REED_BOX, 0.6)) continue;
        spots.push({ x, y, kind: "belt" });
      }
      carry = t - length;
    });
  }

  // Street trees along the entrance road, leaving the driveway open.
  for (let x = 17.2; x < 30; x += 1.7) {
    if (!DRIVEWAYS.some(([x0, x1]) => x > x0 - 0.4 && x < x1 + 0.4)) spots.push({ x, y: -6.55, kind: "round" });
    spots.push({ x: x + 0.85, y: -9.95, kind: "round" });
  }

  return spots
    .filter(({ x, y }) => {
      const dx = x - YARD_ORIGIN[0];
      const dy = y - YARD_ORIGIN[1];
      const s = dx * YARD_ALONG[0] + dy * YARD_ALONG[1];
      const t = dx * YARD_ACROSS[0] + dy * YARD_ACROSS[1];
      const onYard = s > -0.7 && s < 5.7 && t > -0.3 && t < 2.8;
      return !(
        onYard ||
        inBox(x, y, STADIUM_BOX, 0.3) ||
        inBox(x, y, PLAZA_BOX, 0.3) ||
        inBox(x, y, WALK_BOX, 0.4) ||
        inBox(x, y, LOT_BOX, 0.5) ||
        inBox(x, y, TENNIS_BOX, 0.4)
      );
    })
    .map((t) => ({ ...t, size: (t.kind === "belt" ? 1.08 : 0.92) + 0.18 * hash(t.y * 2.3, t.x * 0.7) }));
}

export const TREES: Tree[] = plantTrees();

/** Soft round shadow beside each tree. */
export function treeShadow(t: Tree): PlanPoint[] {
  return circle(t.x + 0.35 * t.size, t.y + 0.15 * t.size, 0.48 * t.size, 7);
}

/** Grass tufts on the open ground. */
export const GRASS: PlanPoint[] = (() => {
  const out: PlanPoint[] = [];
  for (let i = 0; i < 90; i++) {
    for (let j = 0; j < 90; j++) {
      if (hash(i * 3 + 1, j * 7 + 2) > 0.85) continue;
      const x = -48 + i + (hash(i, j + 50) - 0.5);
      const y = -50 + j + (hash(j, i + 70) - 0.5);
      if (!inBox(x, y, GROUND_EXTENT, 0) || inBox(x, y, FIELD_BOX, 0.2) || inBox(x, y, REED_BOX, 0.1) || blocked(x, y, 0.3)) continue;
      if (isFront(x, y) && edgeDistance(x, y) > 1.5) continue;
      out.push([x, y]);
    }
  }
  return out;
})();
