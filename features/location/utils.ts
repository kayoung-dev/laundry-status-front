import { LOCATION_PATH } from "@/constants/navigation";
import { STATE_ORDER } from "./constants";
import { HALL_LIST } from "./hall-data";
import type { Hall, KindFilter, Laundry, LaundryMachine, MachineKind, StateCount } from "./types";

/** `/location`, `/location?hall=hyj`, `/location?hall=hyj&floor=5`. */
export function locationPath(hallId?: string, floor?: number): string {
  if (!hallId) {
    return LOCATION_PATH;
  }
  const query = new URLSearchParams({ hall: hallId });
  if (floor != null) {
    query.set("floor", String(floor));
  }
  return `${LOCATION_PATH}?${query}`;
}

export function findHall(id: string | null | undefined): Hall | undefined {
  return HALL_LIST.find((h) => h.id === id);
}

export function findHallByName(name: string): Hall | undefined {
  return HALL_LIST.find((h) => h.name === name);
}

export function findLaundry(hall: Hall, floor: number | null | undefined): Laundry | undefined {
  return hall.laundries.find((l) => l.floor === floor);
}

export function hallMachines(hall: Hall): LaundryMachine[] {
  return hall.laundries.flatMap((l) => l.machines);
}

export function countKind(machines: LaundryMachine[], kind: MachineKind): number {
  return machines.filter((m) => m.kind === kind).length;
}

export function countFree(machines: LaundryMachine[], kind: MachineKind): number {
  return machines.filter((m) => m.kind === kind && m.state === "available").length;
}

/** Non-empty state groups in list order. */
export function countStates(machines: LaundryMachine[]): StateCount[] {
  return STATE_ORDER.map((state) => ({ state, count: machines.filter((m) => m.state === state).length })).filter((s) => s.count > 0);
}

/** "1·2·3층" */
export function laundryFloorsLabel(hall: Hall): string {
  return `${hall.laundries.map((l) => l.floor).join("·")}층`;
}

/** "세탁기 3 · 건조기 3" */
export function kindSummary(machines: LaundryMachine[]): string {
  return `세탁기 ${countKind(machines, "washer")} · 건조기 ${countKind(machines, "dryer")}`;
}

export function matchesKind(hall: Hall, filter: KindFilter): boolean {
  return filter === "all" ? true : countKind(hallMachines(hall), filter) > 0;
}

export function machineName(machine: LaundryMachine): string {
  return `${machine.kind === "washer" ? "세탁기" : "건조기"} ${machine.no}번`;
}

/** The machine selected when a floor opens: a free washer first, then anything free. */
export function firstPick(machines: LaundryMachine[]): LaundryMachine | undefined {
  return (
    machines.find((m) => m.kind === "washer" && m.state === "available") ??
    machines.find((m) => m.state === "available") ??
    machines[0]
  );
}
