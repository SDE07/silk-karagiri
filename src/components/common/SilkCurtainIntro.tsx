"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SilkCurtainIntro
 * ─────────────────────────────────────────────────────────
 * The saree IS the curtain — fully visible, rich and vivid.
 * Two panels of the saree image close over the page on load,
 * brand identity glows in the center, then they slide apart
 * like real stage curtains made of silk.
 */

export function SilkCurtainIntro() {
  const [phase, setPhase] = useState<"enter" | "hold" | "opening" | "done">(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("silk_curtain_shown")) return "done";
      } catch {}
    }
    return "enter";
  });

  useEffect(() => {
    if (phase === "done") return;
    try {
      sessionStorage.setItem("silk_curtain_shown", "1");
    } catch {}

    const t1 = setTimeout(() => setPhase("hold"), 250);
    const t2 = setTimeout(() => setPhase("opening"), 1500);
    const t3 = setTimeout(() => setPhase("done"), 1500 + 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  if (phase === "done") return null;

  const isOpen = phase === "opening";
  const isVisible = phase === "hold" || phase === "opening";

  return (
    <div
      aria-hidden="true"
      onClick={() => setPhase("done")}
      className="fixed inset-0 z-30 overflow-hidden pointer-events-none select-none"
    >

      {/* ── LEFT CURTAIN PANEL ── full saree visible */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
        animate={{ x: isOpen ? "-100%" : "0%" }}
        transition={{ duration: 1.35, ease: [0.87, 0, 0.13, 1] }}
        style={{ willChange: "transform" }}
      >
        {/* Saree image — fully visible, left half of image */}
        <div className="absolute inset-0">
          <Image
            src="/images/sarre1.webp"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="50vw"
            className="object-cover"
            style={{ objectPosition: "60% center" }}
          />
        </div>

        {/* Subtle dark vignette only on right (inner) edge — creates fold depth */}
        <div
          className="absolute inset-y-0 right-0 w-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(0,0,0,0.65))",
          }}
        />
        {/* Left outer edge vignette */}
        <div
          className="absolute inset-y-0 left-0 w-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
          }}
        />
        {/* Top and bottom vignettes */}
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />
        {/* Subtle gold vertical thread shimmer lines — zari motif */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 28px, rgba(212,175,55,0.06) 28px, rgba(212,175,55,0.06) 29px)",
          }}
        />
      </motion.div>

      {/* ── RIGHT CURTAIN PANEL ── full saree visible */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
        animate={{ x: isOpen ? "100%" : "0%" }}
        transition={{ duration: 1.35, ease: [0.87, 0, 0.13, 1] }}
        style={{ willChange: "transform" }}
      >
        <div className="absolute inset-0">
          <Image
            src="/images/sarre1.webp"
            alt=""
            fill
            preload
            fetchPriority="high"
            sizes="50vw"
            className="object-cover"
            style={{ objectPosition: "40% center" }}
          />
        </div>

        {/* Inner fold depth on left edge */}
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, transparent, rgba(0,0,0,0.65))",
          }}
        />
        {/* Right outer vignette */}
        <div
          className="absolute inset-y-0 right-0 w-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, rgba(0,0,0,0.35), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 28px, rgba(212,175,55,0.06) 28px, rgba(212,175,55,0.06) 29px)",
          }}
        />
      </motion.div>

      {/* ── GOLD CENTRE SEAM ── the split between both curtain panels */}
      <motion.div
        className="absolute inset-y-0 pointer-events-none"
        style={{ left: "calc(50% - 1px)", width: "2px" }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(212,175,55,0.7) 10%, #d4af37 50%, rgba(212,175,55,0.7) 90%, transparent 100%)",
            boxShadow: "0 0 20px 6px rgba(212,175,55,0.3)",
          }}
        />
      </motion.div>

      {/* ── BRAND IDENTITY — dark pill behind text for legibility ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="brand"
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 14 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {/* Dark backdrop pill — only behind content, not full screen */}
            <div
              className="relative flex flex-col items-center px-10 sm:px-14 py-8 sm:py-10 rounded-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(15,3,3,0.88) 0%, rgba(15,3,3,0.75) 60%, transparent 100%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              {/* Top gold rule */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="h-px"
                  style={{
                    width: "clamp(36px, 7vw, 90px)",
                    background: "linear-gradient(to right, transparent, #d4af37)",
                  }}
                />
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect x="4" y="0" width="4" height="4" rx="0.5" transform="rotate(45 4 0)" fill="#d4af37" />
                </svg>
                <div
                  className="h-px"
                  style={{
                    width: "clamp(36px, 7vw, 90px)",
                    background: "linear-gradient(to left, transparent, #d4af37)",
                  }}
                />
              </div>

              {/* Logo */}
              <motion.div
                className="relative mb-4"
                style={{ width: "clamp(52px, 6vw, 76px)", height: "clamp(52px, 6vw, 76px)" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                <Image
                  src="/images/logo.webp"
                  alt="Silk Karagiri"
                  fill
                  priority
                  unoptimized
                  sizes="76px"
                  className="object-contain"
                />
              </motion.div>

              {/* Brand name */}
              <h1
                className="font-heading-main font-bold uppercase"
                style={{
                  fontSize: "clamp(26px, 4vw, 54px)",
                  color: "#fbf7ed",
                  letterSpacing: "0.22em",
                  textShadow: "0 2px 24px rgba(0,0,0,0.8)",
                }}
              >
                Silk Karagiri
              </h1>

              {/* Three-dot gold separator */}
              <div className="flex items-center gap-2 my-3">
                <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.7))" }} />
                <svg width="18" height="5" viewBox="0 0 18 5">
                  <circle cx="2.5" cy="2.5" r="1.8" fill="#d4af37" opacity="0.7" />
                  <circle cx="9"   cy="2.5" r="2.2" fill="#d4af37" />
                  <circle cx="15.5" cy="2.5" r="1.8" fill="#d4af37" opacity="0.7" />
                </svg>
                <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.7))" }} />
              </div>

              {/* Tagline */}
              <p
                className="font-ui uppercase"
                style={{
                  fontSize: "clamp(9px, 1vw, 12px)",
                  color: "rgba(212,175,55,0.9)",
                  letterSpacing: "0.34em",
                }}
              >
                Timeless Tradition &nbsp;·&nbsp; Exceptional Elegance
              </p>

              {/* Bottom gold rule */}
              <div className="flex items-center gap-3 mt-5">
                <div
                  className="h-px"
                  style={{
                    width: "clamp(36px, 7vw, 90px)",
                    background: "linear-gradient(to right, transparent, #d4af37)",
                  }}
                />
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect x="4" y="0" width="4" height="4" rx="0.5" transform="rotate(45 4 0)" fill="#d4af37" />
                </svg>
                <div
                  className="h-px"
                  style={{
                    width: "clamp(36px, 7vw, 90px)",
                    background: "linear-gradient(to left, transparent, #d4af37)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
