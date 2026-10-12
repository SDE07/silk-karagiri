"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

/**
 * SilkCurtainIntro — Luxury Brand Splash Screen
 * ──────────────────────────────────────────────
 * Design philosophy: Zara / Burberry / Sabyasachi level intro.
 *
 * Phases:
 *   "enter"   0ms     → Elements animate in (logo, text stagger up)
 *   "hold"    600ms   → Brand moment — clean, readable, beautiful
 *   "shimmer" 2200ms  → Gold shimmer sweeps across the brand name
 *   "exit"    2700ms  → Whole screen fades up + slight drift. Site revealed.
 *   "done"    4000ms  → Component unmounts from DOM entirely.
 */
export function SilkCurtainIntro() {
  const [phase, setPhase] = useState<"enter" | "hold" | "shimmer" | "exit" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),    600);
    const t2 = setTimeout(() => setPhase("shimmer"), 2200);
    const t3 = setTimeout(() => setPhase("exit"),    2700);
    const t4 = setTimeout(() => setPhase("done"),    4000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const exiting  = phase === "exit";
  const entered  = phase !== "enter";
  const shimming = phase === "shimmer" || phase === "exit";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      style={{
        opacity:    exiting ? 0 : 1,
        transform:  exiting ? "translateY(-18px)" : "translateY(0)",
        transition: exiting
          ? "opacity 1.15s cubic-bezier(0.4,0,0.2,1), transform 1.15s cubic-bezier(0.4,0,0.2,1)"
          : "none",
      }}
    >
      {/* ── FULL-SCREEN BACKGROUND IMAGE ── */}
      {/* Single image, full viewport, no split, no seam */}
      <Image
        src="/images/sarre1.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        style={{ willChange: "opacity" }}
      />

      {/* ── RICH DARK OVERLAY ── */}
      {/* Darkens the saree image into a luxurious moody backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 70% at 50% 50%, rgba(20,4,4,0.72) 0%, rgba(10,2,2,0.88) 100%),
            linear-gradient(180deg, rgba(20,4,4,0.55) 0%, rgba(10,2,2,0.75) 100%)
          `,
        }}
      />

      {/* ── SUBTLE CORNER GOLD FILIGREE ── */}
      {/* Top-left */}
      <svg className="absolute top-4 left-4 sm:top-7 sm:left-7 w-16 sm:w-24 opacity-30" viewBox="0 0 96 96" fill="none">
        <path d="M4 4 L4 36 Q4 4 36 4Z" stroke="#d4af37" strokeWidth="1"/>
        <path d="M4 4 L24 4 Q4 4 4 24Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="4" cy="4" r="2" fill="#d4af37" opacity="0.7"/>
        <path d="M14 4 Q9 9 4 14" stroke="#d4af37" strokeWidth="0.5" opacity="0.5"/>
      </svg>
      {/* Top-right */}
      <svg className="absolute top-4 right-4 sm:top-7 sm:right-7 w-16 sm:w-24 opacity-30 rotate-90" viewBox="0 0 96 96" fill="none">
        <path d="M4 4 L4 36 Q4 4 36 4Z" stroke="#d4af37" strokeWidth="1"/>
        <path d="M4 4 L24 4 Q4 4 4 24Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="4" cy="4" r="2" fill="#d4af37" opacity="0.7"/>
        <path d="M14 4 Q9 9 4 14" stroke="#d4af37" strokeWidth="0.5" opacity="0.5"/>
      </svg>
      {/* Bottom-left */}
      <svg className="absolute bottom-4 left-4 sm:bottom-7 sm:left-7 w-16 sm:w-24 opacity-30 -rotate-90" viewBox="0 0 96 96" fill="none">
        <path d="M4 4 L4 36 Q4 4 36 4Z" stroke="#d4af37" strokeWidth="1"/>
        <path d="M4 4 L24 4 Q4 4 4 24Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="4" cy="4" r="2" fill="#d4af37" opacity="0.7"/>
        <path d="M14 4 Q9 9 4 14" stroke="#d4af37" strokeWidth="0.5" opacity="0.5"/>
      </svg>
      {/* Bottom-right */}
      <svg className="absolute bottom-4 right-4 sm:bottom-7 sm:right-7 w-16 sm:w-24 opacity-30 rotate-180" viewBox="0 0 96 96" fill="none">
        <path d="M4 4 L4 36 Q4 4 36 4Z" stroke="#d4af37" strokeWidth="1"/>
        <path d="M4 4 L24 4 Q4 4 4 24Z" stroke="#d4af37" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="4" cy="4" r="2" fill="#d4af37" opacity="0.7"/>
        <path d="M14 4 Q9 9 4 14" stroke="#d4af37" strokeWidth="0.5" opacity="0.5"/>
      </svg>

      {/* ── THIN GOLD BORDER FRAME ── */}
      <div
        className="absolute"
        style={{
          inset: "clamp(14px, 2.5vw, 28px)",
          border: "1px solid rgba(212,175,55,0.28)",
          borderRadius: "2px",
          boxShadow: "inset 0 0 40px rgba(212,175,55,0.04)",
          opacity: entered ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      />

      {/* ── CENTRE BRAND CONTENT ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">

        {/* Top ornament — fades + rises in */}
        <div
          className="flex items-center gap-3 mb-5"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}
        >
          <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to right, transparent, #d4af37bb)" }} />
          {/* Diamond ornament */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 0.5L7 4L10.5 5.5L7 7L5.5 10.5L4 7L0.5 5.5L4 4Z" fill="#d4af37" />
          </svg>
          <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to left, transparent, #d4af37bb)" }} />
        </div>

        {/* Logo — scales + fades in */}
        <div
          className="relative mb-4"
          style={{
            width: "clamp(52px, 6vw, 76px)",
            height: "clamp(52px, 6vw, 76px)",
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1) translateY(0)" : "scale(0.88) translateY(8px)",
            transition: "opacity 0.85s ease 0.25s, transform 0.85s cubic-bezier(0.34,1.3,0.64,1) 0.25s",
          }}
        >
          <Image
            src="/images/logo.webp"
            alt="Silk Karagiri"
            fill
            priority
            sizes="76px"
            className="object-contain drop-shadow-2xl"
          />
        </div>

        {/* Brand name — with gold shimmer sweep effect */}
        <div
          className="relative overflow-hidden mb-2"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.85s ease 0.35s, transform 0.85s ease 0.35s",
          }}
        >
          <h1
            className="font-heading-main text-[#fbf7ed] font-bold uppercase"
            style={{
              fontSize: "clamp(1.9rem, 5.5vw, 4rem)",
              letterSpacing: "0.28em",
              textShadow: "0 2px 40px rgba(0,0,0,0.6)",
            }}
          >
            Silk Karagiri
          </h1>
          {/* Gold shimmer sweep — slides across the text once */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.55) 50%, transparent 70%)",
              transform: shimming ? "translateX(120%)" : "translateX(-120%)",
              transition: shimming
                ? "transform 0.85s cubic-bezier(0.4,0,0.2,1)"
                : "none",
            }}
          />
        </div>

        {/* Divider line below name */}
        <div
          className="flex items-center gap-3 my-3"
          style={{
            opacity: entered ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, transparent, #d4af3777)" }} />
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <circle cx="3.5" cy="3.5" r="1.5" fill="#d4af37" opacity="0.9" />
          </svg>
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, transparent, #d4af3777)" }} />
        </div>

        {/* Tagline */}
        <p
          className="font-ui text-[#d4af37]/80 uppercase"
          style={{
            fontSize: "clamp(8.5px, 1.1vw, 11.5px)",
            letterSpacing: "0.42em",
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
          }}
        >
          Timeless Tradition &nbsp;&middot;&nbsp; Exceptional Elegance
        </p>

        {/* Bottom ornament */}
        <div
          className="flex items-center gap-3 mt-5"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.9s ease 0.7s, transform 0.9s ease 0.7s",
          }}
        >
          <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to right, transparent, #d4af37bb)" }} />
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 0.5L7 4L10.5 5.5L7 7L5.5 10.5L4 7L0.5 5.5L4 4Z" fill="#d4af37" />
          </svg>
          <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to left, transparent, #d4af37bb)" }} />
        </div>
      </div>
    </div>
  );
}
