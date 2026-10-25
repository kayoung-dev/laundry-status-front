"use client";

import { useMemo } from "react";
import BoxInstances from "./BoxInstances";
import { BUILDING_STYLE } from "./palettes";
import { boxEdges, type BuildingBlocks } from "./scene-layout";
import SceneLines from "./SceneLines";

/** One hall with its floors pulled apart: laundry floors blue, the rest see-through. */
export default function BuildingScene({ blocks }: { blocks: BuildingBlocks }) {
  const groups = useMemo(() => blocks.groups.filter((g) => g.boxes.length > 0).map((g) => ({ ...g, edges: boxEdges(g.boxes) })), [blocks]);
  return (
    <>
      {groups.map((g) => (
        <BoxInstances key={g.key} boxes={g.boxes} palette={BUILDING_STYLE[g.key]} opacity={g.opacity} />
      ))}
      {groups.map((g) => (
        <SceneLines key={`${g.key}-edges`} segments={g.edges} color={BUILDING_STYLE[g.key].edge} />
      ))}
    </>
  );
}
