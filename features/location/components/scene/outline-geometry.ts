import { ExtrudeGeometry, Shape, Vector2 } from "three";
import type { PlanPoint } from "@/features/location/types";

/** A plan outline raised from height `z` by `height`, in world space (plan y → three.js z). */
export function outlineGeometry(outline: PlanPoint[], z: number, height: number): ExtrudeGeometry {
  // Shape y is flipped because rotating the extrusion upright maps shape y to -z.
  const shape = new Shape(outline.map(([x, y]) => new Vector2(x, -y)));
  // Bake the rotation in, so the normals the palette material reads are world normals.
  return new ExtrudeGeometry(shape, { depth: height, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, z, 0);
}
