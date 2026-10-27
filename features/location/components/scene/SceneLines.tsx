"use client";

import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from "three";
import { useDisposable } from "@/features/location/hooks/useDisposable";

/**
 * Many line segments in one draw, like the design's strokes: block outlines
 * and floor lines. `segments` holds [x, height, y] pairs, six numbers per segment.
 */
export default function SceneLines({ segments, color }: { segments: number[]; color: string }) {
  const geometry = useDisposable(() => new BufferGeometry().setAttribute("position", new Float32BufferAttribute(segments, 3)), [segments]);
  const material = useDisposable(() => new LineBasicMaterial({ color }), [color]);

  return <lineSegments geometry={geometry} material={material} />;
}
