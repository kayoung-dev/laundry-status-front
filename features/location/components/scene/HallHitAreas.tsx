"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { MeshBasicMaterial } from "three";
import { GROUND_HEIGHT } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import { useDisposable } from "@/features/location/hooks/useDisposable";
import { rectOutline } from "@/features/location/plan-geometry";
import { blockHeight } from "@/features/location/scene-anchors";
import { outlineGeometry } from "./outline-geometry";

interface HallHitAreasProps {
  onHover: (id: string) => void;
  onPick: (id: string) => void;
}

/** A click that moved further than this (CSS px) was a drag to turn or pan the map. */
const DRAG_PX = 5;

/**
 * Invisible copies of the hall blocks that take the pointer: hovering a
 * building selects its hall (and its row in the list), clicking opens it like its pin.
 */
export default function HallHitAreas({ onHover, onPick }: HallHitAreasProps) {
  const areas = useMemo(
    () => HALL_LIST.map((h) => ({ id: h.id, geometry: outlineGeometry(h.outline ?? rectOutline(h.footprint), GROUND_HEIGHT, blockHeight(h.floors)) })),
    [],
  );
  const material = useDisposable(() => new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), []);

  useEffect(() => () => areas.forEach((a) => a.geometry.dispose()), [areas]);
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  function over(e: ThreeEvent<PointerEvent>, id: string) {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onHover(id);
  }

  function click(e: ThreeEvent<MouseEvent>, id: string) {
    e.stopPropagation();
    if (e.delta <= DRAG_PX) {
      onPick(id);
    }
  }

  return (
    <>
      {areas.map((a) => (
        <mesh
          key={a.id}
          geometry={a.geometry}
          material={material}
          onPointerOver={(e) => over(e, a.id)}
          onPointerOut={() => void (document.body.style.cursor = "")}
          onClick={(e) => click(e, a.id)}
        />
      ))}
    </>
  );
}
