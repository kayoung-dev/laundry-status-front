"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Matrix4, type InstancedMesh } from "three";
import { createPaletteMaterial, type FacePalette } from "./palette-material";

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
  const ref = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  // Unit cube with its corner at the origin, so scale + position place it like a plan rectangle.
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1).translate(0.5, 0.5, 0.5), []);
  const { top, left, right } = palette;
  const material = useMemo(() => createPaletteMaterial({ top, left, right }, opacity), [top, left, right, opacity]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    boxes.forEach((b, i) => {
      matrix.makeScale(b.w, b.h, b.d).setPosition(b.x, b.z, b.y);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    invalidate();
  }, [boxes, invalidate]);

  // Capacity is fixed per mesh, so a different block count makes a new one.
  return <instancedMesh key={boxes.length} ref={ref} args={[geometry, material, boxes.length]} />;
}
