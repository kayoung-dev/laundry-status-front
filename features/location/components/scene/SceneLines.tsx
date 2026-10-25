"use client";

import { useEffect, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from "three";

/**
 * Many line segments in one draw, like the design's strokes: block outlines
 * and floor lines. `segments` holds [x, height, y] pairs, six numbers per segment.
 */
export default function SceneLines({ segments, color }: { segments: number[]; color: string }) {
  const geometry = useMemo(() => new BufferGeometry().setAttribute("position", new Float32BufferAttribute(segments, 3)), [segments]);
  const material = useMemo(() => new LineBasicMaterial({ color }), [color]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <lineSegments geometry={geometry} material={material} />;
}
