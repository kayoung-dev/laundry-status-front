"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { CanvasTexture, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from "three";
import { GROUND_HEIGHT } from "@/features/location/constants";
import { useDisposable } from "@/features/location/hooks/useDisposable";
import { paintGround } from "./ground-texture";
import { GROUND_EXTENT } from "./landscape";

/** The campus ground: one plane with everything flat painted on it once. */
export default function GroundPlane() {
  const gl = useThree((s) => s.gl);
  const [x0, y0, x1, y1] = GROUND_EXTENT;
  const geometry = useDisposable(() => new PlaneGeometry(x1 - x0, y1 - y0).rotateX(-Math.PI / 2), [x0, y0, x1, y1]);
  const material = useMemo(() => {
    const texture = new CanvasTexture(paintGround());
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  }, [gl]);

  useEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );

  // Drawn first, under the buildings, trees and their outlines.
  return <mesh geometry={geometry} material={material} position={[(x0 + x1) / 2, GROUND_HEIGHT, (y0 + y1) / 2]} renderOrder={-1} />;
}
