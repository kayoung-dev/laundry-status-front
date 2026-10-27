"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { LOCATION_PATH } from "@/constants/navigation";
import type { Hall, Laundry } from "@/features/location/types";
import { firstPick, kindSummary, locationPath } from "@/features/location/utils";
import FloorLevel from "./FloorLevel";
import LocationHero from "./LocationHero";
import styles from "./FloorScreen.module.css";

interface FloorScreenProps {
  hall: Hall;
  laundry: Laundry;
}

/** 층 배치도 page: the whole floor with its machines and the way from the elevator. */
export default function FloorScreen({ hall, laundry }: FloorScreenProps) {
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
        chips={[{ label: summary }]}
        actions={
          <button type="button" className={styles.route} aria-pressed={showRoute} onClick={() => setShowRoute(!showRoute)}>
            <Icon name="route" />
            가는 길
          </button>
        }
      />
      <FloorLevel
        hall={hall}
        laundry={laundry}
        showRoute={showRoute}
        selectedId={machineId}
        onSelect={setMachineId}
      />
    </>
  );
}
