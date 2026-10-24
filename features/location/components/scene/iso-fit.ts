import { Box3, Matrix4, Vector3 } from "three";

/** Isometric view: 45° around, looking down at the cube diagonal (≈35° above the ground). */
export const ISO_AZIMUTH = Math.PI / 4;
export const ISO_POLAR = Math.acos(1 / Math.sqrt(3));
export const QUARTER = Math.PI / 2;

export interface FitPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const basis = new Matrix4();
const right = new Vector3();
const up = new Vector3();
const back = new Vector3();
const eye = new Vector3();
const corner = new Vector3();
const ORIGIN = new Vector3();
const Y_UP = new Vector3(0, 1, 0);

/**
 * Camera target and zoom that frame `box` for an orthographic camera at the
 * given azimuth, keeping the fixed iso angle. camera-controls' own fitToBox
 * turns the camera to face an axis, and drei's <Bounds> expects OrbitControls,
 * so this does their job here. `padding` is in CSS pixels, e.g. extra top room for the pins.
 */
export function isoFrame(
  box: Box3,
  azimuth: number,
  viewport: { width: number; height: number },
  padding: FitPadding,
): { target: Vector3; zoom: number } {
  eye.setFromSphericalCoords(1, ISO_POLAR, azimuth);
  basis.lookAt(eye, ORIGIN, Y_UP).extractBasis(right, up, back);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < 8; i++) {
    corner.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
    const sx = corner.dot(right);
    const sy = corner.dot(up);
    minX = Math.min(minX, sx);
    maxX = Math.max(maxX, sx);
    minY = Math.min(minY, sy);
    maxY = Math.max(maxY, sy);
  }

  const width = Math.max(viewport.width - padding.left - padding.right, 1);
  const height = Math.max(viewport.height - padding.top - padding.bottom, 1);
  const zoom = Math.min(width / (maxX - minX), height / (maxY - minY));
  // Shift the target so the box sits in the padded area, not the full viewport.
  const cx = (minX + maxX) / 2 - (padding.left - padding.right) / 2 / zoom;
  const cy = (minY + maxY) / 2 + (padding.top - padding.bottom) / 2 / zoom;
  const depth = box.getCenter(corner).dot(back);
  const target = new Vector3()
    .addScaledVector(right, cx)
    .addScaledVector(up, cy)
    .addScaledVector(back, depth);
  return { target, zoom };
}

/** Quarter turns away from the starting view, 0–3. */
export function quarterOf(azimuth: number): number {
  const turns = Math.round((azimuth - ISO_AZIMUTH) / QUARTER);
  return ((turns % 4) + 4) % 4;
}
