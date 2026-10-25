"use client";

import { useEffect, useMemo } from "react";
import { ExtrudeGeometry, Shape, Vector2 } from "three";
import type { PlanPoint } from "@/features/location/types";
import { createPaletteMaterial, type FacePalette } from "./palette-material";

interface ExtrudedBlockProps {
  outline: PlanPoint[];
  z: number;
  height: number;
  palette: FacePalette;
}

/** A building that is not an axis-aligned rectangle, raised from its plan outline. */
export default function ExtrudedBlock({ outline, z, height, palette }: ExtrudedBlockProps) {
  const geometry = useMemo(() => {
    // Shape y is flipped because rotating the extrusion upright maps shape y to -z.
    const shape = new Shape(outline.map(([x, y]) => new Vector2(x, -y)));
    const g = new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    // Bake the rotation in, so the normals the material reads are world normals.
    g.rotateX(-Math.PI / 2).translate(0, z, 0);
    return g;
  }, [outline, z, height]);
  const { top, left, right } = palette;
  const material = useMemo(() => createPaletteMaterial({ top, left, right }), [top, left, right]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  return <mesh geometry={geometry} material={material} />;
}
