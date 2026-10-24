"use client";

import { useEffect, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from "three";
import type { SceneBox } from "./BoxInstances";

// Corner indices (bit 0 = x, bit 1 = height, bit 2 = y) joined by the 12 edges of a box.
const EDGES = [0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 1, 3, 4, 6, 5, 7, 0, 4, 1, 5, 2, 6, 3, 7];

/** Outlines of many blocks merged into one line draw, like the design's strokes. */
export default function BoxEdges({ boxes, color }: { boxes: SceneBox[]; color: string }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    boxes.forEach((b) => {
      EDGES.forEach((c) => {
        positions.push(c & 1 ? b.x + b.w : b.x, c & 2 ? b.z + b.h : b.z, c & 4 ? b.y + b.d : b.y);
      });
    });
    return new BufferGeometry().setAttribute("position", new Float32BufferAttribute(positions, 3));
  }, [boxes]);
  const material = useMemo(() => new LineBasicMaterial({ color }), [color]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <lineSegments geometry={geometry} material={material} />;
}
