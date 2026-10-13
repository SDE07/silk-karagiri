"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/* Line-art emblems (24×24, stroke-based) — one motif per weaving centre */
const EMBLEMS = {
  // Temple gopuram — Kanchipuram's temple-border sarees
  gopuram: (
    <path d="M5 21h14M6.5 21v-4h11v4M8 17v-4h8v4M9.5 13V9.5h5V13M11 9.5V7h2v2.5M12 7V4M10.5 4.5h3" />
  ),
  // Diya on the ghats — Banaras
  diya: (
    <>
      <path d="M3.5 13.5c0 3.2 3.8 5.5 8.5 5.5s8.5-2.3 8.5-5.5z" />
      <path d="M12 11c-1.6-1.6-1.6-3.8 0-6.5 1.6 2.7 1.6 4.9 0 6.5z" />
      <path d="M9 21h6" />
    </>
  ),
  // Lotus — Yeola
  lotus: (
    <>
      <path d="M12 19c-1.7-3-1.7-7.5 0-12 1.7 4.5 1.7 9 0 12z" />
      <path d="M12 19c-3.2-1.6-4.8-4.6-4.8-8.4 2.6 1.1 4.2 3.8 4.8 8.4z" />
      <path d="M12 19c3.2-1.6 4.8-4.6 4.8-8.4-2.6 1.1-4.2 3.8-4.8 8.4z" />
      <path d="M3.5 14.5C5.4 17.6 8.4 19 12 19s6.6-1.4 8.5-4.5" />
    </>
  ),
  // Peacock feather — Paithani's signature motif
  feather: (
    <>
      <path d="M12 21.5V13" />
      <path d="M12 2.5c3.3 0 5.6 2.7 5.6 5.7S15.1 14 12 14s-5.6-2.8-5.6-5.8S8.7 2.5 12 2.5z" />
      <circle cx="12" cy="8.4" r="2.2" />
    </>
  ),
  // Thread spool — Coimbatore, India's textile city
  spool: (
    <>
      <path d="M6.5 3.5h11M6.5 20.5h11M8 3.5v17M16 3.5v17" />
      <path d="M8 7.5l8 2M8 11l8 2M8 14.5l8 2" />
    </>
  ),
  // Butti motif — Chanderi
  butti: (
    <>
      <path d="M12 2.5l5.5 9.5-5.5 9.5-5.5-9.5z" />
      <path d="M12 8l2.3 4-2.3 4-2.3-4z" />
    </>
  ),
  // Loom shuttle — Arani
  shuttle: (
    <>
      <path d="M2.5 12c4.5-4.6 14.5-4.6 19 0-4.5 4.6-14.5 4.6-19 0z" />
      <path d="M8.5 12h7" />
    </>
  ),
};

const CENTRES: { name: string; state: string; emblem: keyof typeof EMBLEMS; color: string }[] = [
  { name: "Kanchipuram", state: "Tamil Nadu", emblem: "gopuram", color: "#6b1426" },
  { name: "Banaras", state: "Uttar Pradesh", emblem: "diya", color: "#c07d00" },
  { name: "Yeola", state: "Maharashtra", emblem: "lotus", color: "#9f2d55" },
  { name: "Paithan", state: "Maharashtra", emblem: "feather", color: "#0a7f82" },
  { name: "Coimbatore", state: "Tamil Nadu", emblem: "spool", color: "#004e5e" },
  { name: "Chanderi", state: "Madhya Pradesh", emblem: "butti", color: "#bb3e03" },
  { name: "Arani", state: "Tamil Nadu", emblem: "shuttle", color: "#064e3b" },
];

function CentreLogo({ name, state, emblem, color }: (typeof CENTRES)[number]) {
  return (
    <div
      className="group/logo flex shrink-0 items-center gap-3 px-7 sm:px-9 text-stone-500/90 transition-colors duration-300 hover:text-[var(--c)]"
      style={{ "--c": color } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover/logo:-rotate-6 group-hover/logo:scale-110"
        aria-hidden
      >
        {EMBLEMS[emblem]}
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-heading-main text-[1.35rem] font-semibold tracking-wide">{name}</span>
        <span className="mt-1 font-ui text-[8.5px] font-semibold uppercase tracking-[0.28em] opacity-80">{state}</span>
      </span>
    </div>
  );
}

/**
 * "Trusted by"-style strip: a fixed label on the left, weaving-centre logos gliding endlessly on the right.
 * Hovering eases the scroll to a stop instead of halting abruptly.
 */
export function WeavingCentresStrip() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        const slow = () => gsap.to(loop, { timeScale: 0, duration: 0.8, ease: "power2.out", overwrite: true });
        const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power2.in", overwrite: true });
        viewport.addEventListener("pointerenter", slow);
        viewport.addEventListener("pointerleave", resume);
        return () => {
          viewport.removeEventListener("pointerenter", slow);
          viewport.removeEventListener("pointerleave", resume);
        };
      });
    }, viewport);

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-24 flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
      {/* Left — fixed label */}
      <div className="shrink-0 text-center md:text-left">
        <span className="block font-ui text-[10px] uppercase tracking-[0.3em] font-semibold text-stone-500">
          Weaving Centres
        </span>
        <span className="mt-1.5 block font-heading-sub text-xl sm:text-2xl font-bold italic text-[#004e5e] leading-tight">
          Woven across India.
        </span>
      </div>

      <div className="hidden md:block h-12 w-px shrink-0 bg-gradient-to-b from-transparent via-golden-orange/50 to-transparent" />

      {/* Right — scrolling logos */}
      <div
        ref={viewportRef}
        className="relative min-w-0 flex-1 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
      >
        <div ref={trackRef} className="flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {CENTRES.map((c) => (
                <CentreLogo key={c.name} {...c} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeavingCentresStrip;
