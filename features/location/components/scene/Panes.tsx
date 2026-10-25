"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, Euler, type InstancedMesh, Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from "three";

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
const tint = new Color();

/** Every window of the campus in one draw call. */
export default function Panes({ panes }: { panes: Pane[] }) {
  const ref = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const material = useMemo(() => new MeshBasicMaterial(), []);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    panes.forEach((p, i) => {
      // Plan angle a turns +x toward +y (three.js +z), which is a negative turn about +y.
      rotation.setFromEuler(euler.set(0, -p.angle, 0));
      matrix.compose(position.set(p.x, p.z, p.y), rotation, scale.set(p.width, p.height, p.depth * 2));
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, tint.set(p.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    mesh.computeBoundingSphere();
    invalidate();
  }, [panes, invalidate]);

  return <instancedMesh key={panes.length} ref={ref} args={[geometry, material, panes.length]} />;
}
