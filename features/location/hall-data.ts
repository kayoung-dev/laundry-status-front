import type { MachineState } from "@/types/machine";
import type { FloorPlan, Hall, Laundry, LaundryMachine, MachineKind, PlanRect } from "./types";

// Static until the backend stores the campus layout, floor plans and machine
// positions (admin "생활관·세탁실 구성"). Values come from the design canvas
// "세탁실 위치"; floor counts and machine states are placeholders.

const LAUNDRY_ROOM_WIDTH = 5.6;
const ROW_PITCH = 0.7;

const SPEC_STATE: Record<string, MachineState> = { a: "available", i: "in_use", m: "maintenance" };

/**
 * Machines laid out in two rows by the door wall: dryers on the left, washers on the right.
 * `spec` lists each machine as kind + state, e.g. "Wa Wi Dm" = 세탁기 비어 있음, 세탁기 동작 중, 건조기 점검 중.
 */
function laundry(floor: number, spec: string): Laundry {
  const counts: Record<MachineKind, number> = { washer: 0, dryer: 0 };
  const machines = spec.split(" ").map((token): LaundryMachine => {
    const kind: MachineKind = token[0] === "W" ? "washer" : "dryer";
    const index = counts[kind]++;
    return {
      id: `${floor}-${kind}-${index + 1}`,
      kind,
      no: index + 1,
      state: SPEC_STATE[token[1]],
      spot: { x: kind === "dryer" ? 0.34 : LAUNDRY_ROOM_WIDTH - 1.96, y: 0.2 + index * ROW_PITCH, w: kind === "dryer" ? 1.56 : 1.51, d: 0.52 },
    };
  });
  return { floor, machines };
}

/** Basic layout for halls without a measured plan: one corridor, elevator on the left, laundry room in the middle. */
function basicPlan(laundries: Laundry[]): FloorPlan {
  const rows = Math.max(3, ...laundries.flatMap((l) => (["washer", "dryer"] as const).map((k) => l.machines.filter((m) => m.kind === k).length)));
  const room: PlanRect = { x: 6, y: 0, w: LAUNDRY_ROOM_WIDTH, d: 0.5 + rows * ROW_PITCH };
  const doorX = room.x + room.w - 2;
  return {
    measured: false,
    outline: [[0, 0], [16, 0], [16, 6.4], [0, 6.4]],
    wings: [{ x: 0, y: 0, w: 16, d: 6.4 }],
    walls: [],
    rooms: [
      { x: 0.3, y: 3.6, w: 2.2, d: 2.5 },
      { x: 0.3, y: 0.3, w: 2.2, d: 1.2 },
      { x: 12.6, y: 0, w: 3.4, d: 2.2 },
      { x: 12.6, y: 4.2, w: 3.4, d: 2.2 },
    ],
    laundry: room,
    doors: [{ x: doorX, y: room.y + room.d - 0.07, w: 1.4, d: 0.14 }],
    landmarks: [
      { label: "엘리베이터", x: 0.3, y: 3.6, w: 2.2, d: 2.5 },
      { label: "호실", x: 12.6, y: 0, w: 3.4, d: 2.2 },
      { label: "호실", x: 12.6, y: 4.2, w: 3.4, d: 2.2 },
    ],
    labels: [
      { text: "엘리베이터", at: [1.4, 4.85] },
      { text: "비상계단", at: [1.4, 0.9], tone: "muted" },
      { text: "호실", at: [14.3, 1.1] },
      { text: "호실", at: [14.3, 5.3] },
      { text: "복도", at: [9.4, room.d + 1.2], tone: "muted" },
    ],
    route: [[2.5, 4.85], [doorX + 0.7, 4.85], [doorX + 0.7, room.d + 0.2]],
    routeSteps: ["엘리베이터에서 내려 복도로 나와요", "복도를 따라 오른쪽으로 가요", "왼쪽 벽 세탁실, 문은 오른쪽 끝이에요"],
  };
}

/** 하용조관 floor plan from the design canvas. */
const HYJ_PLAN: FloorPlan = {
  measured: true,
  outline: [[0, 0], [20, 0], [20, 7], [5, 7], [5, 14.5], [0, 14.5]],
  wings: [
    { x: 0, y: 0, w: 20, d: 7 },
    { x: 0, y: 7, w: 5, d: 7.5 },
  ],
  walls: [
    [[0, 7], [2.85, 7]],
    [[4.7, 7], [5, 7]],
  ],
  rooms: [
    { x: 0.25, y: 7.4, w: 2.08, d: 6.9 },
    { x: 15.3, y: 0, w: 4.7, d: 1.5 },
    { x: 16, y: 5.85, w: 4, d: 1.15 },
    { x: 0.6, y: 0, w: 1.8, d: 0.4 },
  ],
  laundry: { x: 7.7, y: 0, w: LAUNDRY_ROOM_WIDTH, d: 3.17 },
  doors: [
    { x: 2.85, y: 6.93, w: 1.85, d: 0.14 },
    { x: 11.6, y: 3.1, w: 1.4, d: 0.14 },
  ],
  landmarks: [
    { label: "엘리베이터", x: 0.25, y: 7.4, w: 2.08, d: 6.9 },
    { label: "호실", x: 15.3, y: 0, w: 4.7, d: 1.5 },
    { label: "호실", x: 16, y: 5.85, w: 4, d: 1.15 },
    { label: "출입구", x: 2.85, y: 6.85, w: 1.85, d: 0.15, flat: true },
  ],
  labels: [
    { text: "엘리베이터", at: [1.29, 10.85], vertical: true },
    { text: "비상계단", at: [1.5, 0.85], tone: "muted" },
    { text: "호실", at: [17.65, 0.75] },
    { text: "호실", at: [18, 6.42] },
    { text: "출입구", at: [3.78, 7.5], tone: "accent" },
    { text: "복도", at: [16.5, 4], tone: "muted" },
  ],
  route: [[2.33, 10.8], [3.78, 10.8], [3.78, 4.6], [12.3, 4.6], [12.3, 3.35]],
  routeSteps: ["엘리베이터를 내려 출입구로 들어가요", "복도를 따라 오른쪽으로 가요", "왼쪽 벽 세탁실, 문은 오른쪽 끝이에요"],
};

const HYJ_MACHINES: [MachineKind, number, MachineState, PlanRect][] = [
  ["dryer", 1, "in_use", { x: 0.34, y: 0.2, w: 1.56, d: 0.53 }],
  ["dryer", 2, "available", { x: 0.34, y: 0.84, w: 1.56, d: 0.52 }],
  ["dryer", 3, "in_use", { x: 0.34, y: 1.73, w: 1.56, d: 0.49 }],
  ["washer", 1, "in_use", { x: 3.64, y: 0.2, w: 1.51, d: 0.53 }],
  ["washer", 2, "available", { x: 3.64, y: 0.84, w: 1.51, d: 0.52 }],
  ["washer", 3, "maintenance", { x: 3.64, y: 1.73, w: 1.51, d: 0.49 }],
];

function hall(base: Omit<Hall, "plan">, plan?: FloorPlan): Hall {
  return { ...base, plan: plan ?? basicPlan(base.laundries) };
}

export const HALL_LIST: Hall[] = [
  hall({
    id: "vision", no: "503", name: "비전관", floors: 5, footprint: { x: 3.2, y: -1.6, w: 2.8, d: 8 }, pinAt: 0.15,
    laundries: [laundry(1, "Wa Wi Wi Di"), laundry(2, "Wa Wi"), laundry(3, "Wm Di")],
  }),
  hall({ id: "changjo", no: "504", name: "창조관", floors: 5, footprint: { x: -0.4, y: -1.6, w: 2.8, d: 8 }, pinAt: 0.85, laundries: [] }),
  hall({
    id: "bethel", no: "505", name: "벧엘관", floors: 5, footprint: { x: -4, y: -1.6, w: 2.8, d: 8 }, pinAt: 0.3,
    laundries: [laundry(1, "Wa Wa Wa Wi Di")],
  }),
  hall({
    id: "rodem", no: "506", name: "로뎀관", floors: 6, footprint: { x: -7.6, y: -1.6, w: 2.6, d: 8 }, pinAt: 0.85,
    laundries: [laundry(1, "Wa Wi Di"), laundry(3, "Wi")],
  }),
  hall({
    id: "intl", no: "508", name: "국제관", floors: 4, footprint: { x: -11.2, y: -1.6, w: 2.6, d: 8 }, pinAt: 0.15,
    laundries: [laundry(1, "Wa Wi"), laundry(4, "Wa Dm")],
  }),
  hall({
    id: "grace", no: "509", name: "은혜관", floors: 5, footprint: { x: -14.8, y: -1.6, w: 3, d: 8 }, pinAt: 0.85,
    laundries: [laundry(1, "Wa Wi Di"), laundry(2, "Wi Di")],
  }),
  hall(
    {
      id: "hyj", no: "512", name: "하용조관", floors: 10, footprint: { x: -12.8, y: -15.4, w: 3, d: 7 }, pinAt: 0.5,
      laundries: [
        {
          floor: 5,
          machines: HYJ_MACHINES.map(([kind, no, state, spot]) => ({ id: `5-${kind}-${no}`, kind, no, state, spot })),
        },
      ],
    },
    HYJ_PLAN,
  ),
  hall({
    id: "reed", no: "302", name: "갈대상자관", floors: 5, footprint: { x: -11.34, y: -36.21, w: 3.68, d: 5.42 }, pinAt: 0.5,
    outline: [[-9.632, -36.209], [-7.658, -35.491], [-9.368, -30.791], [-11.342, -31.509]], labelAt: [-9.5, -33.5],
    laundries: [laundry(1, "Wi Wi Di")], note: "하용조관 뒤 별도 단지",
  }),
];
