"use client";

import { KIND_LABEL, LOCATION_STATE_LABEL } from "@/features/location/constants";
import { pointStyle, ratioStyle, rectPath, rectStyle, viewBox, type PlanFrame } from "@/features/location/plan-geometry";
import type { FloorPlan, LaundryMachine } from "@/features/location/types";
import { machineName } from "@/features/location/utils";
import plan from "@/features/location/styles/plan.module.css";
import StatePill from "./StatePill";
import styles from "./LaundryRoomPlan.module.css";

interface LaundryRoomPlanProps {
  floorPlan: FloorPlan;
  machines: LaundryMachine[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** The laundry room close up: one button per machine, where it stands. */
export default function LaundryRoomPlan({ floorPlan, machines, selectedId, onSelect }: LaundryRoomPlanProps) {
  const { w, d } = floorPlan.laundry;
  const frame: PlanFrame = { x: -0.5, y: -0.6, w: w + 1, h: d + 1.2 };
  const door = floorPlan.roomDoor;
  const dryerSpot = machines.find((m) => m.kind === "dryer")?.spot;
  const washerSpot = machines.find((m) => m.kind === "washer")?.spot;

  return (
    <div className={plan.viewport}>
      <div className={plan.plan} style={ratioStyle(frame)}>
        <svg className={plan.svg} viewBox={viewBox(frame)} aria-hidden="true">
          <path d={rectPath({ x: 0, y: 0, w, d })} className={styles.room} />
          <path d={rectPath(door)} className={styles.door} />
        </svg>
        {dryerSpot && (
          <span className={`${plan.mark} ${styles.column}`} style={pointStyle(frame, [dryerSpot.x + dryerSpot.w / 2, -0.25])}>
            왼쪽 줄 · {KIND_LABEL.dryer}
          </span>
        )}
        {washerSpot && (
          <span className={`${plan.mark} ${styles.column}`} style={pointStyle(frame, [washerSpot.x + washerSpot.w / 2, -0.25])}>
            오른쪽 줄 · {KIND_LABEL.washer}
          </span>
        )}
        <span className={`${plan.mark} ${styles.doorLabel}`} style={pointStyle(frame, [door.x + door.w / 2, d + 0.3])}>
          출입문 · 복도 쪽
        </span>
        {machines.map((m) => (
          <button
            key={m.id}
            type="button"
            className={styles.tile}
            data-state={m.state}
            aria-pressed={m.id === selectedId}
            aria-label={`${machineName(m)}, ${LOCATION_STATE_LABEL[m.state]}`}
            style={rectStyle(frame, m.spot)}
            onClick={() => onSelect(m.id)}
          >
            <span className={styles.what}>
              <span aria-hidden="true" className={styles.no}>
                {m.no}
              </span>
              <span className={styles.kind}>{KIND_LABEL[m.kind]}</span>
            </span>
            <span className={styles.state}>
              <StatePill state={m.state}>{LOCATION_STATE_LABEL[m.state]}</StatePill>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
