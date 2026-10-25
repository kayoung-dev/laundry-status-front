"use client";

import { useFrame } from "@react-three/fiber";
import type { RefObject } from "react";
import { Vector3 } from "three";
import type { LabelSlots } from "@/features/location/label-slots";

const point = new Vector3();

/**
 * Moves the HTML labels over the canvas to their 3D anchors on every drawn
 * frame (like CSS2DRenderer). With frameloop "demand" that is exactly when the
 * camera or the scene changed. Nearer labels stack above farther ones,
 * and a label marked data-raised (the selected hall) above all.
 */
export default function LabelProjector({ slots }: { slots: RefObject<LabelSlots> }) {
  useFrame(({ camera, size }) => {
    slots.current.forEach((slot) => {
      if (!slot.el) {
        return;
      }
      point.set(slot.at[0], slot.at[1], slot.at[2]).project(camera);
      const x = ((point.x + 1) / 2) * size.width;
      const y = ((1 - point.y) / 2) * size.height;
      slot.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      slot.el.style.zIndex = String(Math.round((1 - point.z) * 500) + (slot.el.hasAttribute("data-raised") ? 1000 : 0));
      slot.el.style.visibility = "visible";
    });
  });
  return null;
}
