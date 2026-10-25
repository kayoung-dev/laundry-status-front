"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { BoxGeometry, ExtrudeGeometry, MeshBasicMaterial, Shape, Vector2 } from "three";
import { GROUND_HEIGHT, STOREY_HEIGHT } from "@/features/location/constants";
import { HALL_LIST } from "@/features/location/hall-data";
import type { Hall } from "@/features/location/types";

interface HallHitAreasProps {
  onHover: (id: string) => void;
  onPick: (id: string) => void;
}

/** A click that moved further than this (CSS px) was a drag to turn or pan the map. */
const DRAG_PX = 5;

function hitGeometry(h: Hall) {
  const height = h.floors * STOREY_HEIGHT;
  if (h.outline) {
    const shape = new Shape(h.outline.map(([x, y]) => new Vector2(x, -y)));
    return new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, GROUND_HEIGHT, 0);
  }
  const { x, y, w, d } = h.footprint;
  return new BoxGeometry(w, height, d).translate(x + w / 2, GROUND_HEIGHT + height / 2, y + d / 2);
}

/**
 * Invisible copies of the hall blocks that take the pointer: hovering a
 * building selects its hall (and its row in the list), clicking opens it like its pin.
 */
export default function HallHitAreas({ onHover, onPick }: HallHitAreasProps) {
  const areas = useMemo(() => HALL_LIST.map((h) => ({ id: h.id, geometry: hitGeometry(h) })), []);
  const material = useMemo(() => new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), []);

  useEffect(() => () => areas.forEach((a) => a.geometry.dispose()), [areas]);
  useEffect(() => () => material.dispose(), [material]);
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
