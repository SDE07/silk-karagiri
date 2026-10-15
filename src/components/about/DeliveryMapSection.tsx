"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Globe2, PackageCheck, Truck } from "lucide-react";
import WorldMap, { type MapArc, type MapMarker } from "@/components/ui/world-map";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INDIA_GOLD = "#c07d00";
const OVERSEAS_TEAL = "#0a9396";
const INDIA_HUB = { lat: 21.1, lng: 79.0 };

/* Delivering now — across India */
const INDIA_MARKERS: MapMarker[] = [
  { ...INDIA_HUB, label: "India", labelSide: "left", size: 1.5, color: INDIA_GOLD, pulse: true },
  { lat: 28.61, lng: 77.21, size: 0.75, color: INDIA_GOLD, pulse: true }, // New Delhi
  { lat: 19.08, lng: 72.88, size: 0.75, color: INDIA_GOLD, pulse: true }, // Mumbai
  { lat: 22.57, lng: 88.36, size: 0.75, color: INDIA_GOLD, pulse: true }, // Kolkata
  { lat: 12.97, lng: 77.59, size: 0.75, color: INDIA_GOLD, pulse: true }, // Bengaluru
];

/* Coming soon — international */
const OVERSEAS_MARKERS: MapMarker[] = (
  [
    { lat: 25.2, lng: 55.27, label: "Dubai", labelSide: "left" },
    { lat: 51.51, lng: -0.13, label: "London", labelSide: "top" },
    { lat: 40.71, lng: -74.01, label: "New York", labelSide: "bottom" },
    { lat: 43.65, lng: -79.38, label: "Toronto", labelSide: "top" },
    { lat: 1.35, lng: 103.82, label: "Singapore", labelSide: "bottom" },
    { lat: -33.87, lng: 151.21, label: "Sydney", labelSide: "right" },
  ] as MapMarker[]
).map((m) => ({ ...m, size: 0.9, color: OVERSEAS_TEAL }));

const MARKERS = [...OVERSEAS_MARKERS, ...INDIA_MARKERS];

const ARCS: MapArc[] = OVERSEAS_MARKERS.map((m) => ({ start: INDIA_HUB, end: { lat: m.lat, lng: m.lng } }));

const FEATURES = [
  {
    icon: Truck,
    title: "Pan-India Delivery",
    body: "Insured, tracked shipping from Kashmir to Kanyakumari — right up to your doorstep.",
    tag: "Available now",
    tagClass: "bg-golden-orange/15 text-golden-orange-400",
  },
  {
    icon: PackageCheck,
    title: "Packed with Care",
    body: "Every saree is neatly folded and wrapped so it reaches you just as it left the loom.",
    tag: null,
    tagClass: "",
  },
  {
    icon: Globe2,
    title: "International Shipping",
    body: "For our NRI family and saree lovers abroad — UAE, UK, USA, Canada, Singapore, Australia and more.",
    tag: "Coming soon",
    tagClass: "bg-[#0a9396]/12 text-[#0a7f82]",
  },
];

export function DeliveryMapSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        gsap
          .timeline({ scrollTrigger: { trigger: root, start: "top 72%" }, defaults: { ease: "power3.out" } })
          .from(q("[data-reveal]"), { autoAlpha: 0, y: 26, stagger: 0.1, duration: 0.7 })
          .from(q("[data-map]"), { autoAlpha: 0, scale: 0.96, y: 30, duration: 1 }, "-=0.6")
          .from(q("[data-feature]"), { autoAlpha: 0, x: -20, stagger: 0.12, duration: 0.6 }, "-=0.6");
      });
    }, root);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="delivery" className="scroll-mt-28 w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Copy */}
        <div className="lg:col-span-5 space-y-6">
          <div data-reveal className="flex items-center gap-3">
            <span className="h-px w-10 bg-golden-orange" />
            <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-dark-teal font-semibold">
              Shipping &amp; Delivery
            </span>
          </div>

          <h2 data-reveal className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.12] tracking-tight">
            <span className="block text-[#064e3b]">From Our Looms,</span>
            <span className="block text-[#9f2d55]">to Your Doorstep</span>
          </h2>

          <p
            data-reveal
            className="font-body text-sm sm:text-base leading-[1.95] sm:leading-[2.05] text-ink-black-300/90 text-justify [text-justify:inter-word] [text-wrap:pretty]"
          >
            Wherever you are in India, your Silk Karagiri saree travels safely to you — insured, tracked and
            handled with care at every step. And very soon, our looms will reach beyond India too, so our NRI
            family and saree lovers across the world can drape a little bit of home.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FEATURES.map(({ icon: Icon, title, tag, tagClass }) => (
              <li
                key={title}
                data-feature
                className="flex items-center gap-2.5"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-vanilla-custard-800 text-[#6b1426]">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="font-heading-sub text-sm sm:text-base text-ink-black">
                  <span className="text-[#9f2d55]">{title.charAt(0)}</span>
                  {title.slice(1)}
                </h3>
                {tag && (
                  <span className={`rounded-full px-2 py-0.5 font-ui text-[9px] font-bold uppercase tracking-wider ${tagClass}`}>
                    {tag}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <Link
            data-reveal
            href="/contact"
            className="inline-flex items-center gap-1.5 font-ui text-xs font-bold uppercase tracking-wider text-dark-teal hover:text-[#9f2d55] transition-colors"
          >
            Enquire about overseas orders
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Map — sits directly on the page, no card */}
        <div data-map className="lg:col-span-7 space-y-4">
          <WorldMap arcs={ARCS} markers={MARKERS} lineColor={OVERSEAS_TEAL} />

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-ui text-[11px] font-semibold text-ink-black">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c07d00] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c07d00]" />
              </span>
              Delivering across India
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0a9396]" />
              International — coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DeliveryMapSection;
