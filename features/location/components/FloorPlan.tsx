"use client";

import { frameAround, pointStyle, polylinePath, ratioStyle, rectPath, rectStyle, viewBox } from "@/features/location/plan-geometry";
import type { FloorPlan as Plan, LaundryMachine } from "@/features/location/types";
import plan from "@/features/location/styles/plan.module.css";
import styles from "./FloorPlan.module.css";

interface FloorPlanProps {
  floorPlan: Plan;
  machines: LaundryMachine[];
  selectedId: string | null;
  showRoute: boolean;
  onOpenRoom: () => void;
}

/** Whole floor seen from above: rooms, the laundry room with its machines, the way from the elevator. */
export default function FloorPlan({ floorPlan, machines, selectedId, showRoute, onOpenRoom }: FloorPlanProps) {
  const frame = frameAround(floorPlan.outline, 0.6);
  const room = floorPlan.laundry;
  const start = floorPlan.route[0];

  return (
    <div className={plan.viewport}>
      <div className={plan.plan} style={ratioStyle(frame)}>
        <svg className={plan.svg} viewBox={viewBox(frame)} aria-hidden="true">
          <path d={polylinePath(floorPlan.outline, true)} className={styles.outline} />
          <path d={floorPlan.walls.map((w) => polylinePath(w)).join("")} className={styles.wall} />
          <path d={floorPlan.rooms.map(rectPath).join("")} className={styles.room} />
          <path d={rectPath(room)} className={styles.laundry} />
          <path d={floorPlan.doors.map(rectPath).join("")} className={styles.door} />
          {showRoute && (
            <>
              <path d={polylinePath(floorPlan.route)} className={styles.route} />
              <circle cx={start[0]} cy={start[1]} r={0.22} className={styles.start} />
            </>
          )}
        </svg>
        {floorPlan.labels.map((l, i) => (
          <span
            key={`${l.text}-${i}`}
            className={`${plan.mark} ${styles.label}`}
            data-tone={l.tone}
            data-vertical={l.vertical || undefined}
            style={pointStyle(frame, l.at)}
          >
            {l.text}
          </span>
        ))}
        <button type="button" className={styles.zone} style={rectStyle(frame, room)} onClick={onOpenRoom} aria-label="세탁실 확대해서 기기 배치 보기" />
        {machines.map((m) => (
          <span
            key={m.id}
            aria-hidden="true"
            className={styles.machine}
            data-state={m.state}
            data-selected={m.id === selectedId || undefined}
            style={rectStyle(frame, { ...m.spot, x: room.x + m.spot.x, y: room.y + m.spot.y })}
          >
            <span className={styles.machineText}>
              {m.kind === "washer" ? "세탁" : "건조"} {m.no}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
