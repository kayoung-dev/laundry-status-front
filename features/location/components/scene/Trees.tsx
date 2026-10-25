"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, IcosahedronGeometry, type InstancedMesh, Matrix4 } from "three";
import { GROUND_HEIGHT } from "@/features/location/constants";
import type { Tree } from "./landscape";
import { createPaletteMaterial } from "./palette-material";
import { TREE_STYLE } from "./palettes";

const matrix = new Matrix4();

/** Round crowns on thin trunks: one crown mesh per kind, one trunk mesh, all instanced. */
export default function Trees({ trees }: { trees: Tree[] }) {
  const round = useMemo(() => trees.filter((t) => t.kind === "round"), [trees]);
  const belt = useMemo(() => trees.filter((t) => t.kind === "belt"), [trees]);
  return (
    <>
      <Crowns trees={round} style={TREE_STYLE.round} />
      <Crowns trees={belt} style={TREE_STYLE.belt} />
      <Trunks trees={trees} />
    </>
  );
}

function useInstances(trees: Tree[], place: (t: Tree) => Matrix4) {
  const ref = useRef<InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    trees.forEach((t, i) => mesh.setMatrixAt(i, place(t)));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    invalidate();
    // `place` is left out: each caller passes a fixed layout function.
  }, [trees, invalidate]);
  return ref;
}

function Crowns({ trees, style }: { trees: Tree[]; style: (typeof TREE_STYLE)["round"] }) {
  const geometry = useMemo(() => new IcosahedronGeometry(1, 1), []);
  const material = useMemo(() => createPaletteMaterial({ top: style.highlight, left: style.crown, right: style.crown }), [style]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  const ref = useInstances(trees, (t) => {
    const r = 0.55 * t.size;
    return matrix.makeScale(r, r, r).setPosition(t.x, GROUND_HEIGHT + 1.05 * t.size, t.y);
  });
  return <instancedMesh key={trees.length} ref={ref} args={[geometry, material, trees.length]} />;
}

function Trunks({ trees }: { trees: Tree[] }) {
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);
  const material = useMemo(() => {
    const c = TREE_STYLE.round.trunk;
    return createPaletteMaterial({ top: c, left: c, right: c });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  const ref = useInstances(trees, (t) => matrix.makeScale(0.12, 1.05 * t.size, 0.12).setPosition(t.x, GROUND_HEIGHT, t.y));
  return <instancedMesh key={trees.length} ref={ref} args={[geometry, material, trees.length]} />;
}
