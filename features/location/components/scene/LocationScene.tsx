"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import type { LabelSlots } from "@/features/location/label-slots";
import type { Hall } from "@/features/location/types";
import BuildingScene from "./BuildingScene";
import CameraRig, { type MapHandle } from "./CameraRig";
import CampusScene from "./CampusScene";
import type { FitPadding } from "./iso-fit";
import LabelProjector from "./LabelProjector";
import { CAMPUS_BOUNDS, buildingBlocks } from "./scene-layout";

export interface LocationSceneProps {
  /** Campus map, or one hall when `hall` is set. */
  hall?: Hall;
  /** Floors pulled apart (펼치기): where the view ends up. */
  open: boolean;
  /** 0–1, the animated floor spacing on the way there. */
  spread: number;
  selectedId: string | null;
  dimmedIds: string[];
  reducedMotion: boolean;
  handleRef: RefObject<MapHandle | null>;
  labelSlots: RefObject<LabelSlots>;
  onQuarterChange: (quarter: number) => void;
}

/** Campus pins need room above; floor numbers sit left of the hall. */
function scenePadding(isHall: boolean, compact: boolean): FitPadding {
  if (isHall) {
    return compact ? { top: 36, right: 16, bottom: 36, left: 112 } : { top: 56, right: 200, bottom: 64, left: 150 };
  }
  return compact ? { top: 36, right: 12, bottom: 56, left: 12 } : { top: 64, right: 72, bottom: 40, left: 40 };
}

/**
 * The 3D map: one orthographic iso canvas that redraws only when something
 * moves (frameloop "demand"), at most 2× resolution. Loaded with next/dynamic
 * from MapStage only, so three.js stays out of every other page.
 */
export default function LocationScene(props: LocationSceneProps) {
  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [60, 60, 60], zoom: 10, near: 1, far: 400 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}

function SceneContent({ hall, open, spread, selectedId, dimmedIds, reducedMotion, handleRef, labelSlots, onQuarterChange }: LocationSceneProps) {
  const compact = useThree((s) => s.size.width < 600);
  const padding = useMemo(() => scenePadding(Boolean(hall), compact), [hall, compact]);
  const blocks = useMemo(() => (hall ? buildingBlocks(hall, spread) : null), [hall, spread]);
  // Frame where the floors end up, not where they are mid-animation.
  const bounds = useMemo(() => (hall ? buildingBlocks(hall, open ? 1 : 0).bounds : CAMPUS_BOUNDS), [hall, open]);

  return (
    <>
      <CameraRig
        bounds={bounds}
        fitKey={hall?.id ?? "campus"}
        padding={padding}
        reducedMotion={reducedMotion}
        handleRef={handleRef}
        onQuarterChange={onQuarterChange}
      />
      {blocks ? <BuildingScene blocks={blocks} /> : <CampusScene selectedId={selectedId} dimmedIds={dimmedIds} />}
      <LabelProjector slots={labelSlots} />
    </>
  );
}
