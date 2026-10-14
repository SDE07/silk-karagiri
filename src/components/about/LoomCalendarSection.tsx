"use client";

import React from "react";
import dynamic from "next/dynamic";

// Canvas chart that reads today's date and the window size — render it on the client only.
const ContributionSkyline = dynamic(() => import("@/components/ui/contribution-skyline"), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full animate-pulse rounded-2xl bg-vanilla-custard-800/40" />,
});

/* Gold → maroon, lightest activity to heaviest */
const SILK_PALETTE = ["#f1d9a8", "#dca04a", "#b5476d", "#6b1426"];

/**
 * "A Year at the Looms" — a year of loom activity as a heat map that rises into a 3D skyline.
 * Shows a generated sample year until real data is passed in via `data`.
 */
export function LoomCalendarSection() {
  return (
    <section id="loom-calendar" className="w-full max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-24 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-golden-orange" />
          <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-dark-teal font-semibold">
            The Loom Calendar
          </span>
          <span className="h-px w-10 bg-golden-orange" />
        </div>
        <h2 className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.12] tracking-tight">
          <span className="text-[#064e3b]">A Year at</span> <span className="text-[#9f2d55]">the Looms</span>
        </h2>
        <p className="font-body text-sm sm:text-base leading-[1.95] text-ink-black-300/85">
          Every square is a day; every bar is the sarees finished on our weavers&apos; looms. Switch between the
          calendar and the skyline, hover any day, or drag to turn it around.
        </p>
      </div>

      <ContributionSkyline
        className="font-ui"
        surface="#fbf7ed"
        ink="#001219"
        palette={SILK_PALETTE}
        unit="saree"
        title={<span className="font-heading-sub text-lg sm:text-xl text-ink-black">Sarees woven, day by day</span>}
        footer="Illustrative sample year · hover a day for details, drag the skyline to orbit"
        defaultView="3d"
        weekStart={1}
        locale="en-IN"
      />
    </section>
  );
}

export default LoomCalendarSection;
