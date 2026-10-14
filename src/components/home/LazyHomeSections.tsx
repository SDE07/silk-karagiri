"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LazyMount } from "@/components/common/LazyMount";
import { SHOWCASE_GALLERY_ITEMS } from "@/data/showcase.data";

/*
 * Heavy, animated home sections far below the fold. Their code is split into separate chunks and
 * only fetched + rendered when the visitor scrolls near them, keeping the initial load light.
 * Placeholder heights are the measured section heights, so the page doesn't jump when they arrive.
 */

const SareeAtelierSection = dynamic(() => import("@/components/home/SareeAtelierSection"), { ssr: false });
const ThreeDHoverGallery = dynamic(() => import("@/components/lightswind/3d-hover-gallery"), { ssr: false });

export function LazySareeAtelier() {
  return (
    <LazyMount placeholderClassName="min-h-[1990px] lg:min-h-[1220px] xl:min-h-[890px]">
      <SareeAtelierSection />
    </LazyMount>
  );
}

export function LazyHoverGallery() {
  return (
    <LazyMount placeholderClassName="min-h-[550px] sm:min-h-[562px]">
      <ThreeDHoverGallery
        items={SHOWCASE_GALLERY_ITEMS}
        autoPlay
        autoPlayDelay={4200}
        itemHeight={490}
        perspective={1400}
        hoverScale={1.05}
        transitionDuration={0.65}
      />
    </LazyMount>
  );
}
