import type { CSSProperties } from "react";
import type { PlanPoint, PlanRect } from "./types";

/** The drawn area of a plan, in plan units. */
export interface PlanFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function frameAround(points: PlanPoint[], margin: number): PlanFrame {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.min(...xs) - margin;
  const y = Math.min(...ys) - margin;
  return { x, y, w: Math.max(...xs) + margin - x, h: Math.max(...ys) + margin - y };
}

export function viewBox(f: PlanFrame): string {
  return `${f.x} ${f.y} ${f.w} ${f.h}`;
}

/** Sizes the plan box to the frame's ratio (see styles/plan.module.css). */
export function ratioStyle(f: PlanFrame): CSSProperties {
  return { "--ratio": f.w / f.h } as CSSProperties;
}

/** Position of a plan point over the drawing, as left/top percentages. */
export function pointStyle(f: PlanFrame, [x, y]: PlanPoint): CSSProperties {
  return { left: `${((x - f.x) / f.w) * 100}%`, top: `${((y - f.y) / f.h) * 100}%` };
}

export function rectStyle(f: PlanFrame, r: PlanRect): CSSProperties {
  return {
    ...pointStyle(f, [r.x, r.y]),
    width: `${(r.w / f.w) * 100}%`,
    height: `${(r.d / f.h) * 100}%`,
  };
}

export function rectPath(r: PlanRect): string {
  return `M${r.x} ${r.y}h${r.w}v${r.d}h${-r.w}Z`;
}

export function polylinePath(points: PlanPoint[], close = false): string {
  return `M${points.map((p) => p.join(" ")).join("L")}${close ? "Z" : ""}`;
}
