import type { CampusBuilding, PlanRect } from "./types";

// Campus plan from the design canvas "세탁실 위치" (plan units, temporary until
// the real layout is measured). Residence halls live in hall-data.ts.

/** Ground plates: the main campus and the separate 갈대상자관 site. */
export const GROUNDS: PlanRect[] = [
  { x: -11, y: -28.5, w: 7, d: 6 },
  { x: -16, y: -19.5, w: 29.5, d: 30 },
];

export const ROADS: PlanRect[] = [
  { x: 7, y: -13, w: 1.2, d: 23 },
  { x: -16, y: -4.6, w: 24.2, d: 1.2 },
  { x: -4, y: -16.5, w: 0.8, d: 11.9 },
  { x: -16, y: -16.5, w: 1, d: 22.9 },
  { x: -16, y: -16.5, w: 12.8, d: 1 },
  { x: -8.1, y: -19.5, w: 1.2, d: 4 },
  { x: -8.1, y: -23, w: 1.2, d: 0.5 },
];

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  { no: "501", name: "산학협력관", floors: 3, footprint: { x: 9.8, y: -4.4, w: 2.4, d: 6.4 } },
  { no: "502", name: "에벤에셀관", floors: 4, footprint: { x: 9, y: 3, w: 2.4, d: 6 } },
  {
    no: "511",
    name: "복지동",
    floors: 3,
    footprint: { x: -8.8, y: -15.2, w: 4.6, d: 3.8 },
    outline: [[-8.8, -15.2], [-4.2, -15.2], [-4.2, -11.4], [-6, -11.4], [-6, -13.4], [-8.8, -13.4]],
    labelAt: [-6.5, -14.3],
  },
  {
    no: "515",
    name: "하늘소리",
    floors: 1,
    footprint: { x: -3, y: -9.6, w: 2.4, d: 2.4 },
    outline: [
      [-2.2, -9.6], [-1.4, -9.6], [-1.4, -8.8], [-0.6, -8.8], [-0.6, -8], [-1.4, -8],
      [-1.4, -7.2], [-2.2, -7.2], [-2.2, -8], [-3, -8], [-3, -8.8], [-2.2, -8.8],
    ],
    labelAt: [-1.8, -8.4],
  },
];
