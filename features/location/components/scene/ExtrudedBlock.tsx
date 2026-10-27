"use client";

import { useDisposable } from "@/features/location/hooks/useDisposable";
import type { PlanPoint } from "@/features/location/types";
import { outlineGeometry } from "./outline-geometry";
import { createPaletteMaterial, type FacePalette } from "./palette-material";

interface ExtrudedBlockProps {
  outline: PlanPoint[];
  z: number;
  height: number;
  palette: FacePalette;
}

/** A building that is not an axis-aligned rectangle, raised from its plan outline. */
export default function ExtrudedBlock({ outline, z, height, palette }: ExtrudedBlockProps) {
  const geometry = useDisposable(() => outlineGeometry(outline, z, height), [outline, z, height]);
  const { top, left, right } = palette;
  const material = useDisposable(() => createPaletteMaterial({ top, left, right }), [top, left, right]);

  return <mesh geometry={geometry} material={material} />;
}
