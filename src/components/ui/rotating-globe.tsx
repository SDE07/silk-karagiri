"use client";

import React, { useEffect, useRef } from "react";

/*
 * Wireframe globe — country borders (Natural Earth 1:110m, public domain) on an orthographic
 * projection, drawn to canvas and turning continuously. One highlighted country (India) is
 * filled in gold with a pulsing pin. Pauses off-screen; holds still for reduced-motion users.
 *
 * Data: /data/world-borders.json → { rings: number[][] (flat lng,lat pairs), highlight: number[] }
 */

type Borders = { rings: number[][]; highlight: number[] };

interface RotatingGlobeProps {
  /** Degrees per second. Positive glides the surface left → right (clockwise on screen); negative reverses it. */
  speed?: number;
  /** Tilt towards the viewer, degrees (positive shows more of the northern hemisphere). */
  tilt?: number;
  /** Longitude facing the viewer at start. */
  startLng?: number;
  lineColor?: string;
  highlightColor?: string;
  /** Where the pin sits. */
  pinLng?: number;
  pinLat?: number;
  className?: string;
}

const RAD = Math.PI / 180;

export function RotatingGlobe({
  speed = 9,
  tilt = 18,
  startLng = 60,
  lineColor = "#004e5e",
  highlightColor = "#c07d00",
  pinLng = 78.9,
  pinLat = 21.1,
  className,
}: RotatingGlobeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let data: Borders | null = null;
    let lambda0 = startLng;
    let size = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let disposed = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phi0 = tilt * RAD;
    const sinP0 = Math.sin(phi0);
    const cosP0 = Math.cos(phi0);

    const resize = () => {
      size = wrap.clientWidth;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      draw();
    };

    // Orthographic projection; returns null for points on the far side.
    const proj = (lng: number, lat: number, r: number, c: number): [number, number] | null => {
      const l = (lng - lambda0) * RAD;
      const p = lat * RAD;
      const cosP = Math.cos(p);
      const cosc = sinP0 * Math.sin(p) + cosP0 * cosP * Math.cos(l);
      if (cosc < 0) return null;
      return [c + r * cosP * Math.sin(l), c - r * (cosP0 * Math.sin(p) - sinP0 * cosP * Math.cos(l))];
    };

    const strokeRing = (flat: number[], r: number, c: number) => {
      let pen = false;
      for (let i = 0; i < flat.length; i += 2) {
        const pt = proj(flat[i], flat[i + 1], r, c);
        if (!pt) {
          pen = false;
          continue;
        }
        if (pen) ctx.lineTo(pt[0], pt[1]);
        else ctx.moveTo(pt[0], pt[1]);
        pen = true;
      }
    };

    const draw = () => {
      if (!size) return;
      const c = size / 2;
      const r = size / 2 - 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      // Sphere: soft inner shading + rim
      const shade = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.1, c, c, r);
      shade.addColorStop(0, "rgba(255,255,255,0.9)");
      shade.addColorStop(1, "rgba(238,227,195,0.55)");
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fillStyle = shade;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = lineColor;
      ctx.globalAlpha = 0.55;
      ctx.stroke();

      // Graticule
      ctx.globalAlpha = 0.1;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let lng = -180; lng < 180; lng += 20) {
        const line: number[] = [];
        for (let lat = -80; lat <= 80; lat += 4) line.push(lng, lat);
        strokeRing(line, r, c);
      }
      for (let lat = -60; lat <= 60; lat += 20) {
        const line: number[] = [];
        for (let lng = -180; lng <= 180; lng += 4) line.push(lng, lat);
        strokeRing(line, r, c);
      }
      ctx.stroke();

      if (data) {
        // Country borders
        ctx.globalAlpha = 0.62;
        ctx.lineWidth = 0.9;
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (const ring of data.rings) strokeRing(ring, r, c);
        ctx.stroke();

        // Highlighted country
        ctx.globalAlpha = 1;
        for (const idx of data.highlight) {
          const ring = data.rings[idx];
          const pts: [number, number][] = [];
          let hidden = false;
          for (let i = 0; i < ring.length; i += 2) {
            const pt = proj(ring[i], ring[i + 1], r, c);
            if (!pt) {
              hidden = true;
              break;
            }
            pts.push(pt);
          }
          if (hidden || pts.length < 3) continue;
          ctx.beginPath();
          pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.closePath();
          ctx.fillStyle = highlightColor;
          ctx.globalAlpha = 0.28;
          ctx.fill();
          ctx.globalAlpha = 0.95;
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.strokeStyle = lineColor;
        }

        // Pin with a breathing halo
        const p = proj(pinLng, pinLat, r, c);
        if (p) {
          const t = (performance.now() / 1600) % 1;
          ctx.globalAlpha = 0.45 * (1 - t);
          ctx.beginPath();
          ctx.arc(p[0], p[1], 4 + t * 14, 0, Math.PI * 2);
          ctx.fillStyle = highlightColor;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p[0], p[1], 1.6, 0, Math.PI * 2);
          ctx.fillStyle = "#fffaf0";
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Decreasing the centre longitude moves the surface left → right across the face.
      lambda0 -= speed * dt;
      draw();
      if (visible && !reduce.matches && !disposed) raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || reduce.matches || !visible || disposed) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    fetch("/data/world-borders.json")
      .then((res) => res.json())
      .then((d: Borders) => {
        if (disposed) return;
        data = d;
        draw();
        start();
      })
      .catch(() => {
        /* the bare sphere and graticule still render */
      });

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(wrap);
    resize();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [speed, tilt, startLng, lineColor, highlightColor, pinLng, pinLat]);

  return (
    <div ref={wrapRef} className={`relative aspect-square w-full ${className ?? ""}`}>
      <canvas ref={canvasRef} className="absolute inset-0" role="img" aria-label="Globe turning slowly, with India highlighted" />
    </div>
  );
}

export default RotatingGlobe;
