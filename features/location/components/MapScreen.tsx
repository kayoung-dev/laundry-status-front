"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LOCATION_PATH } from "@/constants/navigation";
import { useSelectedHall } from "@/hooks/useSelectedHall";
import { LAUNDRY_PENDING, SPACING_TABS, VIEW_TABS } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import type { Hall, KindFilter, MapView } from "@/features/location/types";
import { findHallByName, laundryFloorsLabel, locationPath, matchesKind } from "@/features/location/utils";
import BuildingPanel from "./BuildingPanel";
import HallGrid from "./HallGrid";
import HallList from "./HallList";
import LocationHero from "./LocationHero";
import MapStage from "./MapStage";
import SegmentedControl from "./SegmentedControl";
import styles from "./MapScreen.module.css";

/**
 * Campus map and hall view. They share one MapStage, so the 3D canvas stays
 * mounted when you go from a pin into its hall and the camera keeps moving.
 */
export default function MapScreen({ hall }: { hall?: Hall }) {
  const router = useRouter();
  const myHall = findHallByName(useSelectedHall());
  const [view, setView] = useState<MapView>("3d");
  const [filter, setFilter] = useState<KindFilter>("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const [spacing, setSpacing] = useState<"open" | "closed">("open");

  const selectedId = hovered ?? myHall?.id ?? null;
  const dimmedIds = HALL_LIST.filter((h) => !matchesKind(h, filter)).map((h) => h.id);
  const showMap = Boolean(hall) || view === "3d";

  const laundryLabel = hall && hall.laundries.length > 0 ? `세탁실 ${laundryFloorsLabel(hall)}` : null;

  const hero = hall ? (
    <LocationHero
      crumbs={[{ label: "세탁실 위치", href: LOCATION_PATH }, { label: hall.name }]}
      back={{ href: LOCATION_PATH, label: "캠퍼스 지도로" }}
      title={hall.name}
      code={hall.no}
      mobileLead={`지상 ${hall.floors}층 · ${laundryLabel ?? LAUNDRY_PENDING}`}
      chips={[{ label: `지상 ${hall.floors}층` }, ...(laundryLabel ? [{ label: laundryLabel, accent: true }] : [])]}
      actions={<SegmentedControl label="층 간격" options={SPACING_TABS} value={spacing} onChange={setSpacing} />}
    />
  ) : (
    <LocationHero
      crumbs={[{ label: "세탁실 위치" }]}
      title="세탁실 위치"
      lead="생활관을 누르면 세탁실이 있는 층과 기기 번호까지 보여드려요"
      mobileLead="생활관을 누르면 층과 기기 번호까지"
      actions={<SegmentedControl label="보기 방식" options={VIEW_TABS} value={view} onChange={setView} />}
    />
  );

  return (
    <>
      {hero}
      <main className={styles.layout} data-level={hall ? "building" : "campus"} data-view={showMap ? "3d" : "list"}>
        {showMap ? (
          <MapStage
            hall={hall}
            open={spacing === "open"}
            selectedId={selectedId}
            dimmedIds={dimmedIds}
            onHover={setHovered}
            onPickHall={(id) => router.push(locationPath(id))}
          />
        ) : (
          <HallGrid filter={filter} />
        )}
        <aside className={styles.side}>
          {hall ? (
            <BuildingPanel hall={hall} />
          ) : (
            <HallList filter={filter} onFilterChange={setFilter} selectedId={selectedId} onHover={setHovered} sheet={showMap} />
          )}
        </aside>
      </main>
    </>
  );
}
