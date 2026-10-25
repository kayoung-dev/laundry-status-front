"use client";

import { LOCATION_STATE_LABEL } from "@/features/location/constants";
import type { Hall, Laundry } from "@/features/location/types";
import FloorPlan from "./FloorPlan";
import LaundryRoomPlan from "./LaundryRoomPlan";
import MachineGroups from "./MachineGroups";
import RouteSteps from "./RouteSteps";
import SelectedMachine from "./SelectedMachine";
import styles from "./FloorLevel.module.css";

interface FloorLevelProps {
  hall: Hall;
  laundry: Laundry;
  view: "floor" | "room";
  onViewChange: (view: "floor" | "room") => void;
  showRoute: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const LEGEND = ["available", "in_use", "maintenance"] as const;

/** 층 배치도: the plan on the left, the picked machine, all machines and the way there on the right. */
export default function FloorLevel({ hall, laundry, view, onViewChange, showRoute, selectedId, onSelect }: FloorLevelProps) {
  const { machines } = laundry;
  const selected = machines.find((m) => m.id === selectedId) ?? machines[0];

  return (
    <main className={styles.layout}>
      <section aria-label={`${hall.name} ${laundry.floor}층 ${view === "room" ? "세탁실 확대" : "평면 배치도"}`} className={styles.map}>
        {view === "floor" ? (
          <FloorPlan floorPlan={hall.plan} machines={machines} selectedId={selected?.id ?? null} showRoute={showRoute} onOpenRoom={() => onViewChange("room")} />
        ) : (
          <LaundryRoomPlan floorPlan={hall.plan} machines={machines} selectedId={selected?.id ?? null} onSelect={onSelect} />
        )}
        <ul className={styles.legend} aria-label="범례">
          {LEGEND.map((s) => (
            <li key={s} data-state={s}>
              <span aria-hidden="true" className={styles.dot} />
              {LOCATION_STATE_LABEL[s]}
            </li>
          ))}
        </ul>
        {view === "room" && (
          <button type="button" className={styles.back} onClick={() => onViewChange("floor")}>
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3.5L5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            층 전체
          </button>
        )}
      </section>

      <aside className={styles.side}>
        {selected && <SelectedMachine hall={hall} floor={laundry.floor} machine={selected} />}
        <MachineGroups
          machines={machines}
          selectedId={selected?.id ?? null}
          onSelect={(id) => {
            onSelect(id);
            onViewChange("room");
          }}
        />
        <RouteSteps steps={hall.plan.routeSteps} basic={!hall.plan.measured} />
      </aside>
    </main>
  );
}
