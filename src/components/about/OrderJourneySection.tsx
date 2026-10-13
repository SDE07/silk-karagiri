"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ClipboardCheck, Home, ShoppingBag, ShoppingCart, Truck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  { icon: ShoppingBag, title: "Choose Your Saree" },
  { icon: ShoppingCart, title: "Add to Cart" },
  { icon: ClipboardCheck, title: "Place Your Order" },
  { icon: Truck, title: "Out for Delivery" },
  { icon: Home, title: "Delivered Home" },
];

const PINK = "#9f2d55";

/**
 * Scroll-driven order tracker: as the section scrolls through the viewport the progress line fills
 * and each step turns pink — completed steps get a check, the current one pulses "In progress".
 */
export function OrderJourneySection() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const last = STEPS.length - 1;
      const toIndex = (p: number) => (p <= 0.02 ? -1 : Math.min(last, Math.floor(p * last + 0.05)));

      const mm = gsap.matchMedia();
      mm.add(
        // matchMedia only runs this callback when at least one query matches, so mobile needs its own
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)", reduce: "(prefers-reduced-motion: reduce)" },
        (c) => {
          const { desktop, reduce } = c.conditions as { desktop: boolean; reduce: boolean };
          const fill = q("[data-fill]");

          // Reduced motion: show the finished journey without scroll-scrubbing
          if (reduce) {
            gsap.set(fill, { scaleX: 1, scaleY: 1 });
            setActive(last);
            return;
          }

          gsap.from(q("[data-head]"), {
            autoAlpha: 0,
            y: 24,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 80%" },
          });

          gsap.fromTo(
            fill,
            desktop ? { scaleX: 0, scaleY: 1 } : { scaleX: 1, scaleY: 0 },
            {
              scaleX: 1,
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: track,
                start: desktop ? "top 70%" : "top 65%",
                end: desktop ? "bottom 30%" : "bottom 45%",
                scrub: 0.6,
                onUpdate: (self) => {
                  const next = toIndex(self.progress);
                  setActive((prev) => (prev === next ? prev : next));
                },
              },
            }
          );
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="how-it-works" className="scroll-mt-28 w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-24">
      {/* Heading — same treatment as the Story and Delivery sections */}
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
        <div data-head className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-golden-orange" />
          <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-dark-teal font-semibold">How It Works</span>
          <span className="h-px w-10 bg-golden-orange" />
        </div>
        <h2 data-head className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.12] tracking-tight">
          <span className="text-[#064e3b]">From Our Vault,</span>{" "}
          <span className="text-[#9f2d55]">to Your Home</span>
        </h2>
        <p data-head className="font-body text-sm sm:text-base leading-[1.95] text-ink-black-300/85">
          Five simple steps between you and your next heirloom — keep scrolling to follow the journey.
        </p>
      </div>

      <ol ref={trackRef} className="relative grid grid-cols-1 md:grid-cols-5 gap-9 md:gap-4">
        {/* Track + fill: vertical on mobile, horizontal from md */}
        <span
          aria-hidden
          className="absolute left-7 top-7 bottom-7 w-[3px] -translate-x-1/2 rounded-full bg-stone-200 md:left-[10%] md:right-[10%] md:bottom-auto md:w-auto md:h-[3px] md:translate-x-0 md:-translate-y-1/2"
        />
        <span
          aria-hidden
          data-fill
          className="absolute left-7 top-7 bottom-7 w-[3px] -translate-x-1/2 rounded-full origin-top bg-gradient-to-b from-[#c9973a] via-[#9f2d55] to-[#9f2d55] md:left-[10%] md:right-[10%] md:bottom-auto md:w-auto md:h-[3px] md:translate-x-0 md:-translate-y-1/2 md:origin-left md:bg-gradient-to-r"
          style={{ transform: "scale(0)" }}
        />

        {STEPS.map(({ icon: Icon, title }, i) => {
          const done = i < active;
          const current = i === active;
          const reached = i <= active;
          const status = done ? "Completed" : current ? (i === STEPS.length - 1 ? "Delivered" : "In progress") : "Up next";

          return (
            <li key={title} className="relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center">
              {/* Circle */}
              <span className="relative z-10 shrink-0">
                {current && (
                  <span aria-hidden className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${PINK}33` }} />
                )}
                <span
                  className="relative flex h-14 w-14 items-center justify-center rounded-full transition-[background-color,color,box-shadow,transform] duration-500"
                  style={{
                    backgroundColor: reached ? PINK : "#ffffff",
                    color: reached ? "#fbf7ed" : "#a8a29e",
                    // first layer is a page-coloured gap so the progress line appears to pass behind the circle
                    boxShadow: reached
                      ? `0 0 0 5px #fbf7ed, 0 0 0 9px ${PINK}26, 0 12px 24px -10px ${PINK}99`
                      : "inset 0 0 0 1px #e7e5e4, 0 0 0 5px #fbf7ed",
                    transform: current ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                {/* Completed badge */}
                <span
                  aria-hidden
                  className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-golden-orange text-white ring-2 ring-vanilla-custard transition-[opacity,transform] duration-300 ${
                    done ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  }`}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              </span>

              {/* Text */}
              <div className="min-w-0 pt-1 md:pt-5 space-y-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-ui text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    done
                      ? "bg-golden-orange/15 text-golden-orange-400"
                      : current
                        ? "bg-[#9f2d55]/12 text-[#9f2d55]"
                        : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {current && <span className="h-1.5 w-1.5 rounded-full bg-[#9f2d55] animate-pulse" />}
                  {status}
                </span>
                <h3
                  className={`font-heading-sub text-lg sm:text-xl transition-colors duration-300 ${reached ? "text-ink-black" : "text-stone-400"}`}
                >
                  <span className="font-ui text-[10px] font-bold tracking-[0.25em] text-golden-orange-400 block mb-0.5">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                  {title}
                </h3>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default OrderJourneySection;
