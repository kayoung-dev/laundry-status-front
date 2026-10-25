"use client";

import { useState } from "react";
import { LOCATION_PATH } from "@/constants/navigation";
import { FLOOR_TABS } from "@/features/location/constants";
import type { Hall, Laundry } from "@/features/location/types";
import { firstPick, kindSummary, locationPath } from "@/features/location/utils";
import FloorLevel from "./FloorLevel";
import LocationHero from "./LocationHero";
import SegmentedControl from "./SegmentedControl";
import styles from "./FloorScreen.module.css";

interface FloorScreenProps {
  hall: Hall;
  laundry: Laundry;
}

/** 층 배치도 page: whole floor or the laundry room close up, with the way from the elevator. */
export default function FloorScreen({ hall, laundry }: FloorScreenProps) {
  const [view, setView] = useState<"floor" | "room">("floor");
  const [showRoute, setShowRoute] = useState(true);
  const [machineId, setMachineId] = useState(() => firstPick(laundry.machines)?.id ?? null);
  const summary = kindSummary(laundry.machines);

  return (
    <>
      <LocationHero
        crumbs={[
          { label: "세탁실 위치", href: LOCATION_PATH },
          { label: hall.name, href: locationPath(hall.id) },
          { label: `${laundry.floor}층` },
        ]}
        back={{ href: locationPath(hall.id), label: `${hall.name} 구성도로` }}
        title={`${hall.name} ${laundry.floor}층 세탁실`}
        mobileLead={summary}
        chips={<span className={styles.chip}>{summary}</span>}
        actions={
          <>
            <SegmentedControl label="보기" options={FLOOR_TABS} value={view} onChange={setView} fill />
            <button
              type="button"
              className={styles.route}
              aria-pressed={showRoute && view === "floor"}
              onClick={() => {
                setShowRoute(!(showRoute && view === "floor"));
                setView("floor");
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="3.5" cy="12.5" r="1.8" stroke="currentColor" strokeWidth="1.4" fill="none" />
                <circle cx="12.5" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.4" fill="none" />
                <path d="M5.2 12.5H9a2.5 2.5 0 0 0 0-5H7a2.5 2.5 0 0 1 0-5h3.7" stroke="currentColor" strokeWidth="1.4" fill="none" strokeDasharray="1.6 1.8" strokeLinecap="round" />
              </svg>
              가는 길
            </button>
          </>
        }
      />
      <FloorLevel
        hall={hall}
        laundry={laundry}
        view={view}
        onViewChange={setView}
        showRoute={showRoute}
        selectedId={machineId}
        onSelect={setMachineId}
      />
    </>
  );
}
