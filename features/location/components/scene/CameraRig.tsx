"use client";

import { CameraControls, CameraControlsImpl } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, type RefObject } from "react";
import { Box3, Vector3, type OrthographicCamera } from "three";
import type { Anchor } from "@/features/location/scene-anchors";
import { ISO_AZIMUTH, ISO_POLAR, QUARTER, isoFrame, quarterOf, type FitPadding } from "./iso-fit";

/** What the buttons over the map can do with the camera. */
export interface MapHandle {
  rotate: (direction: 1 | -1) => void;
  reset: () => void;
  zoom: (direction: 1 | -1) => void;
  /** Moves toward the box between two corners; resolves when the camera arrives (at once with reduced motion). */
  focus: (corners: [Anchor, Anchor]) => Promise<unknown>;
}

interface CameraRigProps {
  /** What "처음 시점" frames. */
  bounds: Box3;
  /** Changes with the scene (campus / which hall), so the view frames it again at once. */
  fitKey: string;
  padding: FitPadding;
  reducedMotion: boolean;
  handleRef: RefObject<MapHandle | null>;
  onQuarterChange: (quarter: number) => void;
}

const { ACTION } = CameraControlsImpl;
const ZOOM_STEP = 1.3;

/**
 * Fixed-angle iso camera: drag turns it and it settles on the nearest quarter
 * turn, right-drag / one finger pans, wheel / pinch zooms.
 */
export default function CameraRig({ bounds, fitKey, padding, reducedMotion, handleRef, onQuarterChange }: CameraRigProps) {
  const controlsRef = useRef<CameraControlsImpl>(null);
  const turns = useRef(0);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  const animate = !reducedMotion;

  const frame = useCallback(
    (box: Box3, transition: boolean) => {
      const controls = controlsRef.current;
      if (!controls || size.width === 0 || size.height === 0) {
        return Promise.resolve();
      }
      const azimuth = ISO_AZIMUTH + turns.current * QUARTER;
      const { target, zoom } = isoFrame(box, azimuth, size, padding);
      if (box === bounds) {
        controls.minZoom = zoom * 0.6;
        controls.maxZoom = zoom * 6;
      } else {
        controls.maxZoom = Math.max(controls.maxZoom, zoom);
      }
      return Promise.all([
        controls.rotateTo(azimuth, ISO_POLAR, transition),
        controls.moveTo(target.x, target.y, target.z, transition),
        controls.zoomTo(zoom, transition),
      ]);
    },
    [bounds, padding, size],
  );

  useLayoutEffect(() => {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }
    controls.mouseButtons.left = ACTION.ROTATE;
    controls.mouseButtons.middle = ACTION.NONE;
    controls.mouseButtons.right = ACTION.TRUCK;
    controls.mouseButtons.wheel = ACTION.ZOOM;
    controls.touches.one = ACTION.TOUCH_TRUCK;
    controls.touches.two = ACTION.TOUCH_ZOOM_ROTATE;
    controls.touches.three = ACTION.NONE;
  }, []);

  // A new scene frames at once; new bounds in the same scene (펼치기/접기) or a resize move there.
  const lastKey = useRef<string | null>(null);
  useLayoutEffect(() => {
    const sameScene = lastKey.current === fitKey;
    lastKey.current = fitKey;
    void frame(bounds, sameScene && animate);
    // `frame` is left out: it only changes with size and padding, and padding is fixed per scene.
  }, [fitKey, bounds, size.width, size.height]);

  const settle = useCallback(() => {
    onQuarterChange(quarterOf(ISO_AZIMUTH + turns.current * QUARTER));
  }, [onQuarterChange]);

  useImperativeHandle(
    handleRef,
    () => ({
      rotate(direction) {
        turns.current += direction;
        void controlsRef.current?.rotateAzimuthTo(ISO_AZIMUTH + turns.current * QUARTER, animate);
        settle();
      },
      reset() {
        // Back to the nearest full turn, so it never spins more than half a turn.
        turns.current = Math.round(turns.current / 4) * 4;
        void frame(bounds, animate);
        settle();
      },
      zoom(direction) {
        void controlsRef.current?.zoomTo(camera.zoom * ZOOM_STEP ** direction, animate);
      },
      focus([min, max]) {
        return frame(new Box3(new Vector3(...min), new Vector3(...max)), animate);
      },
    }),
    [animate, bounds, camera, frame, settle],
  );

  useEffect(() => settle(), [settle]);

  // After a drag, turn on to the nearest quarter so labels stay upright and readable.
  function snapToQuarter() {
    const controls = controlsRef.current;
    if (!controls) {
      return;
    }
    turns.current = Math.round((controls.azimuthAngle - ISO_AZIMUTH) / QUARTER);
    void controls.rotateAzimuthTo(ISO_AZIMUTH + turns.current * QUARTER, animate);
    settle();
  }

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minPolarAngle={ISO_POLAR}
      maxPolarAngle={ISO_POLAR}
      smoothTime={0.12}
      draggingSmoothTime={0.08}
      dollyToCursor
      onControlEnd={snapToQuarter}
    />
  );
}
