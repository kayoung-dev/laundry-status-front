"use client";

import { BoxGeometry, Euler, Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import { useDisposable } from "@/features/location/hooks/useDisposable";
import { useInstanceLayout } from "./useInstanceLayout";

/** A window on a wall: centre point, size along the wall and up, wall direction, color. */
export interface Pane {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  /** Wall direction in plan, radians from +x toward +y. */
  angle: number;
  /** How far it stands out of the wall; mullions sit in front of glass. */
  depth: number;
  color: string;
}

const matrix = new Matrix4();
const rotation = new Quaternion();
const euler = new Euler();
const position = new Vector3();
const scale = new Vector3();

function placePane(p: Pane): Matrix4 {
  // Plan angle a turns +x toward +y (three.js +z), which is a negative turn about +y.
  rotation.setFromEuler(euler.set(0, -p.angle, 0));
  return matrix.compose(position.set(p.x, p.z, p.y), rotation, scale.set(p.width, p.height, p.depth * 2));
}

/** Every window of the campus in one draw call. */
export default function Panes({ panes }: { panes: Pane[] }) {
  const geometry = useDisposable(() => new BoxGeometry(1, 1, 1), []);
  const material = useDisposable(() => new MeshBasicMaterial(), []);
  const ref = useInstanceLayout(panes, placePane, (p) => p.color);

  return <instancedMesh key={panes.length} ref={ref} args={[geometry, material, panes.length]} />;
}
