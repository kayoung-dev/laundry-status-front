"use client";

import { useMemo } from "react";
import { SCENE_COLOR } from "@/features/location/constants";
import BoxEdges from "./BoxEdges";
import BoxInstances from "./BoxInstances";
import type { BuildingBlocks } from "./scene-layout";

const BLUE = new Set<string>([SCENE_COLOR.floorLaundry, SCENE_COLOR.laundryRoom]);

/** One hall with its floors pulled apart: laundry floors solid blue, the rest see-through. */
export default function BuildingScene({ blocks }: { blocks: BuildingBlocks }) {
  const outlines = useMemo(() => {
    const all = [...blocks.solid, ...blocks.ghost];
    return { blue: all.filter((b) => BLUE.has(b.color)), rest: all.filter((b) => !BLUE.has(b.color)) };
  }, [blocks]);
  return (
    <>
      <BoxInstances boxes={blocks.solid} />
      <BoxInstances boxes={blocks.ghost} opacity={0.5} />
      <BoxEdges boxes={outlines.rest} color={SCENE_COLOR.edgeFloor} />
      <BoxEdges boxes={outlines.blue} color={SCENE_COLOR.edgeLaundry} />
    </>
  );
}
