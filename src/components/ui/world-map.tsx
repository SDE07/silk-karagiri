"use client";

import React, { useId } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/*
 * Dotted world map with animated arcs (Aceternity-style).
 *
 * The dot grid is a static SVG pre-generated once with `dotted-map` (equirectangular projection,
 * region lat -58…82 / lng -180…180, height 100, diagonal grid), so nothing heavy runs in the browser.
 * The projection constants below were fitted against dotted-map's own pin placement, so markers and
 * arcs sit exactly on top of the right dots (max error < 0.7 units, about half a dot gap).
 */
const MAP_SRC = "/images/about/world-dots.svg";
const VIEW_W = 257;
const VIEW_H = 100;
const project = (lat: number, lng: number) => ({
  x: 0.713832 * lng + 128.506,
  y: -0.71396 * lat + 58.5877,
});

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface MapMarker extends MapPoint {
  color?: string;
  /** Radius in map units (the map is 257 × 100). */
  size?: number;
  pulse?: boolean;
  /** Which side of the dot the label sits on. */
  labelSide?: "left" | "right" | "top" | "bottom";
}

export interface MapArc {
  start: MapPoint;
  end: MapPoint;
  color?: string;
}

interface WorldMapProps {
  arcs?: MapArc[];
  markers?: MapMarker[];
  lineColor?: string;
  /** Opacity of the dotted landmass. */
  mapOpacity?: number;
  className?: string;
}

function curvedPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const midX = (a.x + b.x) / 2;
  const lift = Math.min(18, Math.abs(b.x - a.x) * 0.22 + 6);
  const midY = Math.min(a.y, b.y) - lift;
  return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
}

const LABEL_OFFSET = {
  left: { dx: -2.4, dy: 1.1, anchor: "end" },
  right: { dx: 2.4, dy: 1.1, anchor: "start" },
  top: { dx: 0, dy: -2.9, anchor: "middle" },
  bottom: { dx: 0, dy: 4.8, anchor: "middle" },
} as const;

export function WorldMap({ arcs = [], markers = [], lineColor = "#0a9396", mapOpacity = 0.5, className }: WorldMapProps) {
  const gid = useId().replace(/:/g, "");

  return (
    <div className={`relative w-full aspect-[257/100] select-none ${className ?? ""}`}>
      <Image
        src={MAP_SRC}
        alt=""
        fill
        unoptimized
        draggable={false}
        style={{ opacity: mapOpacity }}
        className="pointer-events-none object-fill [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_90%,transparent)]"
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="World map showing delivery locations"
      >
        <defs>
          {arcs.map((arc, i) => (
            <linearGradient key={i} id={`${gid}-arc-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={arc.color ?? lineColor} stopOpacity="0" />
              <stop offset="8%" stopColor={arc.color ?? lineColor} stopOpacity="1" />
              <stop offset="92%" stopColor={arc.color ?? lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor={arc.color ?? lineColor} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {/* Arcs draw in one after another when the map scrolls into view */}
        {arcs.map((arc, i) => {
          const d = curvedPath(project(arc.start.lat, arc.start.lng), project(arc.end.lat, arc.end.lng));
          return (
            <g key={`arc-${i}`}>
              <motion.path
                d={d}
                fill="none"
                stroke={`url(#${gid}-arc-${i})`}
                strokeWidth={0.45}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, delay: 0.35 * i, ease: "easeOut" }}
              />
              {/* A small parcel travelling along each route */}
              <circle r={0.7} fill={arc.color ?? lineColor}>
                <animateMotion path={d} dur="5s" begin={`${1.5 + 0.35 * i}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {markers.map((m, i) => {
          const { x, y } = project(m.lat, m.lng);
          const r = m.size ?? 1;
          const color = m.color ?? lineColor;
          const side = LABEL_OFFSET[m.labelSide ?? "right"];
          return (
            <g key={`m-${i}`}>
              {m.pulse && (
                <circle cx={x} cy={y} r={r} fill={color} opacity={0.5}>
                  <animate attributeName="r" from={r} to={r * 4} dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={r} fill={color} />
              <circle cx={x} cy={y} r={r * 0.4} fill="#fffaf0" />
              {m.label && (
                <text
                  x={x + side.dx * (r > 1.2 ? 1.4 : 1)}
                  y={y + side.dy}
                  textAnchor={side.anchor}
                  className="font-ui"
                  fontSize={3.1}
                  fontWeight={600}
                  fill="#001219"
                  paintOrder="stroke"
                  stroke="#fbf7ed"
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default WorldMap;
