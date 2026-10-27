"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { LOCATION_PATH } from "@/constants/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FOCUS_MS, VIEW_SIDES } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import { useEasedValue } from "@/features/location/hooks/useEasedValue";
import type { LabelSlots } from "@/features/location/label-slots";
import { CONTEXT_LABELS, buildingLabels, hallExtent, hallPinAnchor } from "@/features/location/scene-anchors";
import type { Hall } from "@/features/location/types";
import { findHall, locationPath } from "@/features/location/utils";
import type { MapHandle } from "./scene/CameraRig";
import FloorMarker from "./FloorMarker";
import HallPin from "./HallPin";
import MapControls from "./MapControls";
import MapLabel from "./MapLabel";
import MapNote from "./MapNote";
import SceneBoundary from "./SceneBoundary";
import styles from "./MapStage.module.css";

function MapMessage({ children }: { children: string }) {
  return (
    <p role="status" className={styles.message}>
      {children}
    </p>
  );
}

// three.js, React Three Fiber and drei load only here, after the page is up.
const LocationScene = dynamic(() => import("./scene/LocationScene"), {
  ssr: false,
  loading: () => <MapMessage>3D 지도를 불러오는 중이에요</MapMessage>,
});

interface MapStageProps {
  /** Set for the hall view (생활관 구성도); otherwise the campus map. */
  hall?: Hall;
  open: boolean;
  selectedId: string | null;
  dimmedIds: string[];
  onHover: (id: string) => void;
  /** Opens a hall; called once the camera has moved toward it. */
  onPickHall: (id: string) => void;
}

/** The 3D map with its overlays: which side you look from, legend, camera buttons. */
export default function MapStage({ hall, open, selectedId, dimmedIds, onHover, onPickHall }: MapStageProps) {
  const handleRef = useRef<MapHandle>(null);
  const labelSlots = useRef<LabelSlots>(new Map());
  const [quarter, setQuarter] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const spread = useEasedValue(open ? 1 : 0, FOCUS_MS, reducedMotion);
  const floorLabels = useMemo(() => (hall ? buildingLabels(hall, spread) : null), [hall, spread]);
  const onQuarterChange = useCallback((q: number) => setQuarter(q), []);

  // Move toward the hall first, then open it (after FOCUS_MS at most).
  function pickHall(id: string) {
    const target = findHall(id);
    const rig = handleRef.current;
    if (!target || !rig || reducedMotion) {
      onPickHall(id);
      return;
    }
    const arrived = new Promise((resolve) => setTimeout(resolve, FOCUS_MS));
    void Promise.race([rig.focus(hallExtent(target)), arrived]).then(() => onPickHall(id));
  }

  return (
    <section aria-label={hall ? `${hall.name} 층 분해도` : "캠퍼스 지도"} className={styles.stage} data-level={hall ? "building" : "campus"}>
      <SceneBoundary fallback={<MapMessage>이 기기에서는 3D 지도를 볼 수 없어요. 목록으로 확인해 주세요.</MapMessage>}>
        <div className={styles.canvas}>
          <LocationScene
            hall={hall}
            open={open}
            spread={spread}
            selectedId={selectedId}
            dimmedIds={dimmedIds}
            reducedMotion={reducedMotion}
            handleRef={handleRef}
            labelSlots={labelSlots}
            onHover={onHover}
            onPickHall={pickHall}
            onQuarterChange={onQuarterChange}
          />
        </div>
        <div className={styles.labels}>
          {hall && floorLabels ? (
            <>
              {floorLabels.landmarks.map((l) => (
                <MapLabel key={l.id} slots={labelSlots} id={l.id} at={l.at}>
                  <MapNote place="center">{l.label}</MapNote>
                </MapLabel>
              ))}
              {floorLabels.floors.map((l) => (
                <MapLabel key={l.id} slots={labelSlots} id={l.id} at={l.at} raised={l.laundry}>
                  <FloorMarker label={l} hallName={hall.name} href={locationPath(hall.id, l.floor)} />
                </MapLabel>
              ))}
            </>
          ) : (
            <>
              {CONTEXT_LABELS.map((l) => (
                <MapLabel key={l.id} slots={labelSlots} id={l.id} at={l.at}>
                  <MapNote>{l.name}</MapNote>
                </MapLabel>
              ))}
              {HALL_LIST.map((h) => (
                <MapLabel key={h.id} slots={labelSlots} id={`pin-${h.id}`} at={hallPinAnchor(h)} raised={h.id === selectedId}>
                  <HallPin hall={h} selected={h.id === selectedId} onHover={onHover} onPick={pickHall} />
                </MapLabel>
              ))}
            </>
          )}
        </div>
      </SceneBoundary>

      {hall ? (
        <>
          {hall.laundries.length > 0 && (
            <span className={styles.chip}>
              <span aria-hidden="true" className={styles.swatch} data-tone="laundry" />
              세탁실 층 · 누르면 배치도
            </span>
          )}
          <Link href={LOCATION_PATH} className={styles.minimap}>
            <svg width="132" height="64" viewBox="0 0 132 64" aria-hidden="true">
              <path d="M66 4 L128 34 L66 62 L4 34 Z" fill="#f4f8fd" stroke="#cfdcec" />
              <path d="M50 30 l16 -8 l8 4 l-16 8 Z" fill="#ffffff" stroke="#a9c2e3" />
              <path d="M60 40 l16 -8 l8 4 l-16 8 Z" fill="#ffffff" stroke="#a9c2e3" />
              <path d="M30 26 l10 -5 l6 3 l-10 5 Z" fill="#0070f7" stroke="#0064e2" />
            </svg>
            캠퍼스에서 위치 보기
          </Link>
        </>
      ) : (
        <>
          <span className={styles.chip} aria-live="polite">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style={{ transform: `rotate(${-90 * quarter}deg)` }}>
              <path d="M8 1.5l3 6.5H5z" fill="var(--blue-900)" />
              <path d="M8 14.5L5 8h6z" fill="var(--wash-step-ring)" />
            </svg>
            {VIEW_SIDES[quarter]}쪽에서 보는 중
          </span>
          <ul className={styles.legend} aria-label="범례">
            <li>
              <span aria-hidden="true" className={styles.swatch} data-tone="selected" />
              선택한 생활관
            </li>
            <li>
              <span aria-hidden="true" className={styles.swatch} data-tone="hall" />
              생활관 (세탁실 있음)
            </li>
            <li>
              <span aria-hidden="true" className={styles.swatch} data-tone="other" />
              기타 건물
            </li>
          </ul>
        </>
      )}

      <MapControls
        onRotate={(d) => handleRef.current?.rotate(d)}
        onReset={() => handleRef.current?.reset()}
        onZoom={hall ? undefined : (d) => handleRef.current?.zoom(d)}
      />
    </section>
  );
}
