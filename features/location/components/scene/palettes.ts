import type { FacePalette } from "./palette-material";

// Colors from the design canvas "세탁실 위치": each block has a roof (top), the
// wall facing screen-left and the wall facing screen-right, plus stroke colors.

export interface BlockStyle extends FacePalette {
  /** Outline of the block. */
  edge: string;
  /** Floor lines around the walls; omitted = none. */
  line?: string;
}

export const CAMPUS_STYLE = {
  hall: { top: "#6e5144", left: "#a65a3e", right: "#823f2b", edge: "#4a2519", line: "#bd7357" },
  hallSelected: { top: "#f0d6b8", left: "#c4673f", right: "#a04c2e", edge: "#2e140b", line: "#d98a68" },
  /** Halls left out by the 세탁기/건조기 filter. */
  hallMuted: { top: "#a8968c", left: "#cfaa9a", right: "#bd9584", edge: "#8c6a5c", line: "#dcc0b3" },
  context: { top: "#ebe6de", left: "#d6cfc4", right: "#bfb6a9", edge: "#a39a8d", line: "#e2dcd2" },
} satisfies Record<string, BlockStyle>;

export const BUILDING_STYLE = {
  laundryFloor: { top: "#dcebfd", left: "#9cc4f5", right: "#7fb1f1", edge: "#0064e2" },
  ghostFloor: { top: "#f4f8fd", left: "#e6eef8", right: "#dbe6f3", edge: "#cfdcec" },
  solidFloor: { top: "#f7faff", left: "#e6eef8", right: "#d9e5f3", edge: "#bfd1e7" },
  landmark: { top: "#ffffff", left: "#e3ecf7", right: "#d3e0f1", edge: "#a9c2e3" },
  laundryRoom: { top: "#ffffff", left: "#cfe2fb", right: "#b6d3f8", edge: "#0064e2" },
  door: { top: "#4d4d4d", left: "#4d4d4d", right: "#4d4d4d", edge: "#4d4d4d" },
} satisfies Record<string, BlockStyle>;

export const TREE_STYLE = {
  round: { trunk: "#b39e8a", crown: "#a9c99a", highlight: "#c8e0b8" },
  belt: { trunk: "#9c8b78", crown: "#93bd80", highlight: "#b4d79f" },
};

export const WINDOW_COLOR = {
  pane: "#cfe8f7",
  curtainWall: "#5fa9bb",
  lobby: "#35545c",
};
