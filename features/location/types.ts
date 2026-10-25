import type { MachineState } from "@/types/machine";

/** A point on a plan: x to the right, y toward the viewer (plan units, about 1 m). */
export type PlanPoint = [x: number, y: number];

/** Axis-aligned rectangle on a plan. */
export interface PlanRect {
  x: number;
  y: number;
  w: number;
  d: number;
}

export type MachineKind = "washer" | "dryer";

export interface LaundryMachine {
  id: string;
  kind: MachineKind;
  /** Number painted on the machine, counted per kind ("세탁기 2번"). */
  no: number;
  state: MachineState;
  /** Spot inside the laundry room, from the room's top-left corner. */
  spot: PlanRect;
}

export interface Laundry {
  floor: number;
  machines: LaundryMachine[];
}

export interface PlanLabel {
  text: string;
  at: PlanPoint;
  tone?: "muted" | "accent";
  vertical?: boolean;
}

/** One floor plan, shared by every floor of a hall. */
export interface FloorPlan {
  /** False when the plan is the generated basic layout, not a measured one. */
  measured: boolean;
  outline: PlanPoint[];
  /** Rectangles that make up the outline, drawn as the 3D floor slabs. */
  wings: PlanRect[];
  /** Inner wall segments. */
  walls: [PlanPoint, PlanPoint][];
  /** Elevator, stairs and rooms other than the laundry room. */
  rooms: PlanRect[];
  laundry: PlanRect;
  doors: PlanRect[];
  /** Raised blocks on the top floor of the exploded view. */
  landmarks: (PlanRect & { label: string; flat?: boolean })[];
  labels: PlanLabel[];
  /** From the elevator to the laundry room door. */
  route: PlanPoint[];
  routeSteps: string[];
}

export interface Hall {
  id: string;
  /** Building number on campus signs. */
  no: string;
  name: string;
  floors: number;
  /** Footprint on the campus plan (the bounding box when `outline` is set). */
  footprint: PlanRect;
  /** Outline when the building is not an axis-aligned rectangle. */
  outline?: PlanPoint[];
  /** Where the pin stands along the footprint depth, 0 = back, 1 = front. */
  pinAt: number;
  /** Pin position for outlined buildings. */
  labelAt?: PlanPoint;
  /** Empty while the hall's laundry rooms are not registered yet. */
  laundries: Laundry[];
  plan: FloorPlan;
  note?: string;
}

/** Non-residence building drawn for orientation. */
export interface CampusBuilding {
  no: string;
  name: string;
  floors: number;
  footprint: PlanRect;
  /** Outline when the building is not a rectangle. */
  outline?: PlanPoint[];
  labelAt?: PlanPoint;
}

export type MapView = "3d" | "list";

export type KindFilter = "all" | MachineKind;

export interface StateCount {
  state: MachineState;
  count: number;
}
