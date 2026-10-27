"use client";

import { BoxGeometry, Matrix4 } from "three";
import { useDisposable } from "@/features/location/hooks/useDisposable";
import { createPaletteMaterial, type FacePalette } from "./palette-material";
import { useInstanceLayout } from "./useInstanceLayout";

/** A block in plan coordinates: x/y on the ground, z up. */
export interface SceneBox {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

interface BoxInstancesProps {
  boxes: SceneBox[];
  palette: FacePalette;
  /** 0–1; below 1 the blocks are see-through (ghost floors). */
  opacity?: number;
}

const matrix = new Matrix4();

/** Every block of one style in a single draw call. Plan y maps to three.js z, height to y. */
export default function BoxInstances({ boxes, palette, opacity = 1 }: BoxInstancesProps) {
  // Unit cube with its corner at the origin, so scale + position place it like a plan rectangle.
  const geometry = useDisposable(() => new BoxGeometry(1, 1, 1).translate(0.5, 0.5, 0.5), []);
  const { top, left, right } = palette;
  const material = useDisposable(() => createPaletteMaterial({ top, left, right }, opacity), [top, left, right, opacity]);
  const ref = useInstanceLayout(boxes, (b) => matrix.makeScale(b.w, b.h, b.d).setPosition(b.x, b.z, b.y));

  // Capacity is fixed per mesh, so a different block count makes a new one.
  return <instancedMesh key={boxes.length} ref={ref} args={[geometry, material, boxes.length]} />;
}
