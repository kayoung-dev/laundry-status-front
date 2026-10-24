"use client";

import { useEffect, useMemo } from "react";
import { ExtrudeGeometry, Shape, Vector2 } from "three";
import type { PlanPoint } from "@/features/location/types";
import { createFaceShadeMaterial } from "./face-shade";

interface ExtrudedBlockProps {
  outline: PlanPoint[];
  z: number;
  height: number;
  color: string;
}

/** A building that is not a rectangle, raised from its plan outline. */
export default function ExtrudedBlock({ outline, z, height, color }: ExtrudedBlockProps) {
  const geometry = useMemo(() => {
    // Shape y is flipped because rotating the extrusion upright maps shape y to -z.
    const shape = new Shape(outline.map(([x, y]) => new Vector2(x, -y)));
    const g = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    // Bake the rotation in, so normals stay axis-aligned for the face shading.
    g.rotateX(-Math.PI / 2).translate(0, z, 0);
    return g;
  }, [outline, z, height]);
  const material = useMemo(() => createFaceShadeMaterial({ color }), [color]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <mesh geometry={geometry} material={material} />;
}
