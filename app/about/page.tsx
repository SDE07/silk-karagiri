import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <div className="space-y-16 sm:space-y-24 pb-20 pt-2 sm:pt-4">
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

      {/* Closing CTA */}
      <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#004e5e] px-6 py-12 sm:px-12 sm:py-16 text-center shadow-xl">
          <Image
            src="/images/about/floral-lines.webp"
            alt=""
            fill
            sizes="1280px"
            className="object-cover opacity-10 pointer-events-none"
          />
          <div className="relative space-y-4 max-w-2xl mx-auto">
            <h2 className="font-heading-main text-4xl sm:text-5xl font-bold text-vanilla-custard leading-tight">
              Find Your Heirloom Drape
            </h2>
            <p className="font-body text-base sm:text-lg text-vanilla-custard/80 leading-relaxed">
              Explore pure silk sarees woven by India&apos;s finest hands — each one ready to become part of your story.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                href="/products?category=Sarees"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-golden-orange hover:bg-vanilla-custard text-ink-black font-ui text-xs uppercase tracking-widest font-bold shadow-md transition-colors"
              >
                Shop Sarees
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-vanilla-custard/40 hover:border-vanilla-custard text-vanilla-custard font-ui text-xs uppercase tracking-widest font-bold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
