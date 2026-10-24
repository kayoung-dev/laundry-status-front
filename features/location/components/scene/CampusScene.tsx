"use client";

import { useMemo } from "react";
import { GROUND_HEIGHT, SCENE_COLOR } from "@/features/location/constants";
import BoxEdges from "./BoxEdges";
import BoxInstances, { type SceneBox } from "./BoxInstances";
import ExtrudedBlock from "./ExtrudedBlock";
import { CAMPUS_BASE, CAMPUS_CONTEXT_BOXES, CAMPUS_CONTEXT_SHAPES, campusHallBoxes } from "./scene-layout";

export interface CampusSceneProps {
  selectedId: string | null;
  /** Halls left out by the 세탁기/건조기 filter, drawn paler. */
  dimmedIds: string[];
}

/** Outline whole blocks and ground plates, not roads or the thin floor-line bands. */
function isBuilding(b: SceneBox): boolean {
  return b.h > 0.05;
}

const GROUND_OUTLINES = CAMPUS_BASE.filter(isBuilding);
const CONTEXT_OUTLINES = CAMPUS_CONTEXT_BOXES.filter(isBuilding);

/** Campus blocks: ground, roads and other buildings never change; halls recolor on selection. */
export default function CampusScene({ selectedId, dimmedIds }: CampusSceneProps) {
  const dimmedKey = dimmedIds.join(",");
  const hallBoxes = useMemo(() => campusHallBoxes(selectedId, new Set(dimmedKey ? dimmedKey.split(",") : [])), [selectedId, dimmedKey]);
  const outlines = useMemo(() => {
    const blocks = hallBoxes.filter(isBuilding);
    return {
      selected: blocks.filter((b) => b.color === SCENE_COLOR.hallSelected),
      rest: blocks.filter((b) => b.color !== SCENE_COLOR.hallSelected),
    };
  }, [hallBoxes]);

  return (
    <>
      <BoxInstances boxes={CAMPUS_BASE} />
      <BoxInstances boxes={CAMPUS_CONTEXT_BOXES} />
      {CAMPUS_CONTEXT_SHAPES.map((s) => (
        <ExtrudedBlock key={s.no} outline={s.outline} z={GROUND_HEIGHT} height={s.height} color={SCENE_COLOR.context} />
      ))}
      <BoxInstances boxes={hallBoxes} />
      <BoxEdges boxes={GROUND_OUTLINES} color={SCENE_COLOR.edgeGround} />
      <BoxEdges boxes={CONTEXT_OUTLINES} color={SCENE_COLOR.edgeContext} />
      <BoxEdges boxes={outlines.rest} color={SCENE_COLOR.edgeHall} />
      <BoxEdges boxes={outlines.selected} color={SCENE_COLOR.edgeHallSelected} />
    </>
  );
}
