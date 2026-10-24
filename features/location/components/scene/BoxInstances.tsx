"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, Matrix4, type InstancedMesh } from "three";
import { createFaceShadeMaterial } from "./face-shade";

/** A block in plan coordinates: x/y on the ground, z up. */
export interface SceneBox {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
}

interface BoxInstancesProps {
  boxes: SceneBox[];
  /** 0–1; below 1 the blocks are see-through (ghost floors). */
  opacity?: number;
}

const matrix = new Matrix4();
const color = new Color();

/** Every block of one kind in a single draw call. Plan y maps to three.js z, height to y. */
export default function BoxInstances({ boxes, opacity = 1 }: BoxInstancesProps) {
  const ref = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  // Unit cube with its corner at the origin, so scale + position place it like a plan rectangle.
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1).translate(0.5, 0.5, 0.5), []);
  const material = useMemo(
    () => createFaceShadeMaterial({ transparent: opacity < 1, opacity, depthWrite: opacity >= 1 }),
    [opacity],
  );

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
      mesh.setColorAt(i, color.set(b.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    mesh.computeBoundingSphere();
    invalidate();
  }, [boxes, invalidate]);

  // Capacity is fixed per mesh, so a different block count makes a new one.
  return <instancedMesh key={boxes.length} ref={ref} args={[geometry, material, boxes.length]} />;
}
