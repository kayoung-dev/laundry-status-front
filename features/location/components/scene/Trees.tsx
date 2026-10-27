"use client";

import { useMemo } from "react";
import { BoxGeometry, IcosahedronGeometry, Matrix4 } from "three";
import { GROUND_HEIGHT } from "@/features/location/constants";
import { useDisposable } from "@/features/location/hooks/useDisposable";
import type { Tree } from "./landscape";
import { createPaletteMaterial } from "./palette-material";
import { TREE_STYLE } from "./palettes";
import { useInstanceLayout } from "./useInstanceLayout";

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

function placeCrown(t: Tree): Matrix4 {
  const r = 0.55 * t.size;
  return matrix.makeScale(r, r, r).setPosition(t.x, GROUND_HEIGHT + 1.05 * t.size, t.y);
}

function placeTrunk(t: Tree): Matrix4 {
  return matrix.makeScale(0.12, 1.05 * t.size, 0.12).setPosition(t.x, GROUND_HEIGHT, t.y);
}

function Crowns({ trees, style }: { trees: Tree[]; style: (typeof TREE_STYLE)["round"] }) {
  const geometry = useDisposable(() => new IcosahedronGeometry(1, 1), []);
  const material = useDisposable(() => createPaletteMaterial({ top: style.highlight, left: style.crown, right: style.crown }), [style]);
  const ref = useInstanceLayout(trees, placeCrown);
  return <instancedMesh key={trees.length} ref={ref} args={[geometry, material, trees.length]} />;
}

function Trunks({ trees }: { trees: Tree[] }) {
  const geometry = useDisposable(() => new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), []);
  const material = useDisposable(() => {
    const c = TREE_STYLE.round.trunk;
    return createPaletteMaterial({ top: c, left: c, right: c });
  }, []);
  const ref = useInstanceLayout(trees, placeTrunk);
  return <instancedMesh key={trees.length} ref={ref} args={[geometry, material, trees.length]} />;
}
