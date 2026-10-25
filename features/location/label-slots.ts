import type { Anchor } from "./scene-anchors";

/** A label element over the 3D map and the point it follows. */
export interface LabelSlot {
  at: Anchor;
  el: HTMLElement | null;
}

/** Shared between the label layer (writes elements and anchors) and the scene (positions them). */
export type LabelSlots = Map<string, LabelSlot>;
