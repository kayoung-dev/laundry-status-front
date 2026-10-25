"use client";

import { useMemo } from "react";
import { GROUND_HEIGHT } from "@/features/location/constants";
import BoxInstances from "./BoxInstances";
import ExtrudedBlock from "./ExtrudedBlock";
import GroundPlane from "./GroundPlane";
import { TREES } from "./landscape";
import Panes from "./Panes";
import { CAMPUS_CONTEXT, CAMPUS_WINDOWS, campusHalls, type StyledBlocks } from "./scene-layout";
import SceneLines from "./SceneLines";
import Trees from "./Trees";

export interface CampusSceneProps {
  selectedId: string | null;
  /** Halls left out by the 세탁기/건조기 filter, drawn paler. */
  dimmedIds: string[];
}

function Blocks({ group }: { group: StyledBlocks }) {
  const { style } = group;
  return (
    <>
      {group.boxes.length > 0 && <BoxInstances boxes={group.boxes} palette={style} />}
      {group.shapes.map((s) => (
        <ExtrudedBlock key={s.key} outline={s.outline} z={GROUND_HEIGHT} height={s.height} palette={style} />
      ))}
      {style.line && group.lines.length > 0 && <SceneLines segments={group.lines} color={style.line} />}
      {group.edges.length > 0 && <SceneLines segments={group.edges} color={style.edge} />}
    </>
  );
}

/**
 * Campus: painted ground, trees, other buildings, windows (all fixed) and the
 * halls, which recolor when one is selected or left out by the filter.
 */
export default function CampusScene({ selectedId, dimmedIds }: CampusSceneProps) {
  const dimmedKey = dimmedIds.join(",");
  const halls = useMemo(() => campusHalls(selectedId, new Set(dimmedKey ? dimmedKey.split(",") : [])), [selectedId, dimmedKey]);

  return (
    <>
      <GroundPlane />
      <Trees trees={TREES} />
      <Blocks group={CAMPUS_CONTEXT} />
      {halls.map((g) => (
        <Blocks key={g.style.edge} group={g} />
      ))}
      <Panes panes={CAMPUS_WINDOWS} />
    </>
  );
}
