import type { CampusBuilding, PlanRect } from "./types";

// Campus plan from the design canvas "세탁실 위치" (plan units, temporary until
// the real layout is measured). Residence halls live in hall-data.ts.

/** Asphalt roads inside the campus. The landscape around them is in campus-landscape.ts. */
export const ROADS: PlanRect[] = [
  { x: -16, y: -4.6, w: 24.2, d: 1.2 },
  { x: -4, y: -16.5, w: 0.8, d: 11.9 },
  { x: -16, y: -16.5, w: 1, d: 22.9 },
  { x: -16, y: -16.5, w: 12.8, d: 1 },
  { x: -11.5, y: -29, w: 1, d: 13 },
];

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  { no: "501", name: "산학협력관", floors: 3, footprint: { x: 9.8, y: -4.4, w: 2.4, d: 6.4 } },
  { no: "502", name: "에벤에셀관", floors: 4, footprint: { x: 9, y: 3, w: 2.4, d: 6 } },
  {
    no: "511",
    name: "복지동",
    floors: 5,
    footprint: { x: -9.3, y: -14.6, w: 5.1, d: 5.2 },
    outline: [[-9.3, -14.6], [-4.2, -14.6], [-4.2, -9.4], [-6.4, -9.4], [-6.4, -12.8], [-9.3, -12.8]],
    labelAt: [-6.75, -13.7],
  },
  {
    no: "515",
    name: "하늘소리",
    floors: 3,
    footprint: { x: -2.79, y: -14.05, w: 5.18, d: 4.79 },
    outline: [
      [-1.89, -13.94], [-0.94, -13.13], [-0.17, -14.05], [0.83, -13.22], [0.06, -12.3], [2.39, -10.34],
      [1.49, -9.26], [-0.84, -11.22], [-1.61, -10.31], [-2.61, -11.14], [-1.84, -12.06], [-2.79, -12.86],
    ],
    labelAt: [-0.2, -11.6],
  },
];
