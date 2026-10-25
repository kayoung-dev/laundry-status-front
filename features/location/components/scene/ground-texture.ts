import type { PlanPoint } from "@/features/location/types";
import {
  BUILDING_SHADOWS,
  CROSSWALK,
  FIELDS,
  FOG_CLEAR,
  GRASS,
  GRAVEL,
  GROUND_EXTENT,
  MAIN_ROAD,
  PARKING,
  PLAZA,
  ROAD_AREAS,
  SHORTENED_GAP,
  STADIUM,
  TENNIS,
  TREES,
  treeShadow,
} from "./landscape";

/** Texture pixels per plan unit. */
const PX = 22;
/** Design strokes are in screen pixels at about 11 px per plan unit. */
const STROKE = 1 / 11;

type Ctx = CanvasRenderingContext2D;

function path(ctx: Ctx, points: PlanPoint[], close = true) {
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  if (close) ctx.closePath();
}

function fill(ctx: Ctx, shapes: PlanPoint[][], color: string, alpha = 1) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  shapes.forEach((s) => path(ctx, s));
  ctx.fill();
  ctx.globalAlpha = 1;
}

function stroke(ctx: Ctx, lines: PlanPoint[][], color: string, px: number, alpha = 1, close = false) {
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = px * STROKE;
  ctx.beginPath();
  lines.forEach((l) => path(ctx, l, close));
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function fillStroke(ctx: Ctx, shapes: PlanPoint[][], color: string, edge: string, px: number) {
  ctx.lineJoin = "round";
  stroke(ctx, shapes, edge, px, 1, true);
  fill(ctx, shapes, color);
}

/**
 * Paints everything flat on the campus into one canvas, in plan coordinates:
 * x right, y down the canvas (toward the viewer). The edge fades out like the
 * design's fog, so the page background shows through.
 */
export function paintGround(): HTMLCanvasElement {
  const [x0, y0, x1, y1] = GROUND_EXTENT;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round((x1 - x0) * PX);
  canvas.height = Math.round((y1 - y0) * PX);
  const ctx = canvas.getContext("2d") as Ctx;
  ctx.setTransform(PX, 0, 0, PX, -x0 * PX, -y0 * PX);
  ctx.lineCap = "round";

  ctx.fillStyle = "#d9e7c5";
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  stroke(ctx, GRASS.map(([x, y]) => [[x - 0.2, y + 0.12], [x, y - 0.1], [x + 0.2, y + 0.12]]), "#9fbd82", 1);

  // Rice paddies with their rows, under a soft sheen.
  ctx.lineJoin = "round";
  FIELDS.forEach((f) => {
    stroke(ctx, [f.outline], "#d2c59a", 3, 1, true);
    fill(ctx, [f.outline], f.color);
    ctx.save();
    ctx.beginPath();
    path(ctx, f.outline);
    ctx.clip();
    stroke(ctx, f.rows, "#5f8a26", 1, 0.5);
    stroke(ctx, f.highlights, "#d6ea8c", 0.8, 0.65);
    ctx.restore();
  });
  const sheen = ctx.createLinearGradient(-33, -22, -19, 9);
  sheen.addColorStop(0, "rgba(255,255,255,0.28)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(47,74,18,0.12)");
  ctx.fillStyle = sheen;
  ctx.beginPath();
  FIELDS.forEach((f) => path(ctx, f.outline));
  ctx.fill();

  // Plaza and walkway.
  fillStroke(ctx, PLAZA.areas, "#d8d5ce", "#c7c3bb", 1);
  stroke(ctx, PLAZA.joints, "#c4c0b8", 0.7);

  // Parking.
  fillStroke(ctx, PARKING.areas, "#c3c6ca", "#d9d6d0", 2.4);
  stroke(ctx, PARKING.stalls, "#ffffff", 0.9, 0.75);
  ctx.setLineDash([5 * STROKE, 5 * STROKE]);
  stroke(ctx, PARKING.lanes, "#e9dcb4", 0.9);
  ctx.setLineDash([]);

  // Tennis court.
  fillStroke(ctx, [TENNIS.area], "#c3d9b6", "#b3cba5", 0.7);
  fill(ctx, [TENNIS.court], "#9cc49a");
  stroke(ctx, [TENNIS.court], "#ffffff", 0.8, 0.8, true);
  stroke(ctx, TENNIS.lines, "#ffffff", 0.8, 0.8);
  stroke(ctx, [TENNIS.net], "#5d6b5a", 1, 0.6);

  // Stadium: apron, red track with lanes, striped pitch.
  fill(ctx, [STADIUM.apron], "#d5dccb");
  ctx.fillStyle = "#d7a597";
  ctx.beginPath();
  path(ctx, STADIUM.trackOuter);
  path(ctx, STADIUM.trackInner.slice().reverse());
  ctx.fill("evenodd");
  stroke(ctx, STADIUM.lanes, "#f6e7df", 0.8, 0.85, true);
  fill(ctx, [STADIUM.pitch], "#a3c893");
  fill(ctx, STADIUM.stripes, "#afd09f");
  stroke(ctx, [...STADIUM.markings], "#ffffff", 1.1, 0.75, true);
  stroke(ctx, [STADIUM.halfway], "#ffffff", 1.1, 0.75);

  // Gravel yard in front of 갈대상자관.
  fillStroke(ctx, [GRAVEL.outline], "#d8d2c6", "#c2bbad", 1);
  [false, true].forEach((light) => {
    ctx.fillStyle = light ? "#f3efe8" : "#a39c8f";
    ctx.beginPath();
    GRAVEL.stones.filter((s) => s.light === light).forEach((s) => {
      ctx.moveTo(s.x + s.r, s.y);
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    });
    ctx.fill();
  });

  // Roads and the entrance road with its crosswalk.
  fillStroke(ctx, ROAD_AREAS, "#8f9398", "#cdd0d3", 1);
  fillStroke(ctx, [MAIN_ROAD], "#8f9398", "#cdd0d3", 2);
  fill(ctx, CROSSWALK, "#ffffff", 0.92);

  // The shortened gap between 하용조관 and 갈대상자관.
  fill(ctx, [SHORTENED_GAP.fill], "#eef3e7");
  stroke(ctx, SHORTENED_GAP.lines, "#7d93a8", 1.6);

  // Shadows of trees and buildings.
  fill(ctx, TREES.map(treeShadow), "#1b3a5c", 0.07);
  fill(ctx, BUILDING_SHADOWS, "#1b3a5c", 0.17);

  fadeEdges(canvas, ctx);
  return canvas;
}

/** Keeps the campus and fades everything beyond its edge, like the design's blurred fog. */
function fadeEdges(canvas: HTMLCanvasElement, ctx: Ctx) {
  const [x0, y0] = GROUND_EXTENT;
  const mask = document.createElement("canvas");
  mask.width = canvas.width;
  mask.height = canvas.height;
  const m = mask.getContext("2d") as Ctx;
  // Blurred fill drawn as the shadow of a shape moved off the canvas (works where ctx.filter does not).
  const away = canvas.width * 2;
  m.setTransform(PX, 0, 0, PX, -x0 * PX - away, -y0 * PX);
  m.shadowColor = "#000000";
  m.shadowBlur = PX * 2.2;
  m.shadowOffsetX = away;
  m.fillStyle = "#000000";
  m.beginPath();
  path(m, FOG_CLEAR);
  m.fill();
  // The back of the clear area reaches far out; fade the texture's own edges too.
  m.setTransform(1, 0, 0, 1, 0, 0);
  m.shadowColor = "transparent";
  m.globalCompositeOperation = "destination-in";
  const edge = PX * 4;
  const fades: [number, number, number, number][] = [
    [0, 0, edge, 0],
    [mask.width, 0, mask.width - edge, 0],
    [0, 0, 0, edge],
    [0, mask.height, 0, mask.height - edge],
  ];
  fades.forEach(([ax, ay, bx, by]) => {
    const g = m.createLinearGradient(ax, ay, bx, by);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,1)");
    m.fillStyle = g;
    m.fillRect(0, 0, mask.width, mask.height);
  });

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(mask, 0, 0);
  ctx.globalCompositeOperation = "source-over";
}
