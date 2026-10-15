import React from "react";
import type { Metadata } from "next";
import { SilkKaragiriBanner } from "@/components/about/SilkKaragiriBanner";
import { WeaverStorySection } from "@/components/about/WeaverStorySection";
import { DeliveryMapSection } from "@/components/about/DeliveryMapSection";
import { OrderJourneySection } from "@/components/about/OrderJourneySection";
import { LoomCalendarSection } from "@/components/about/LoomCalendarSection";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About Us — ${APP_CONFIG.name}`,
  description:
    "The story of Silk Karagiri: pure handloom silk sarees sourced directly from master weavers in Kanchipuram, Banaras, Yeola, Coimbatore, Paithan and Chanderi.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-12 pt-2 sm:pt-4">
      {/* Hero — layered Silk Karagiri Sarees banner */}
      <SilkKaragiriBanner headingLevel="h1" />

      {/* Our Story — master weaver + brand story (GSAP animated) */}
      <WeaverStorySection />

      {/* Shipping & Delivery — pan-India now, international coming soon (Lightswind WorldMap) */}
      <DeliveryMapSection />

      {/* How It Works — scroll-driven order tracker (replaces the Promise cards) */}
      <OrderJourneySection />

      {/* A Year at the Looms — heat map that rises into a 3D skyline */}
      <LoomCalendarSection />
    </div>
  );
}
