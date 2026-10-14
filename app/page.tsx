import React from "react";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { HeroBannerSlider } from "@/components/home/HeroBannerSlider";
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { SareeHeritageShowcase } from "@/components/home/SareeHeritageShowcase";
import { KaragiriHeritageBanner } from "@/components/home/KaragiriHeritageBanner";
import { LazyHoverGallery, LazySareeAtelier } from "@/components/home/LazyHomeSections";

export default function HomePage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Luxury Hero Banner Slider (Banners 1 to 5) */}
      <HeroBannerSlider />

      {/* Interactive 3D Silk Gallery Vault (Full Width Bleed) */}
      <section className="w-full space-y-1 overflow-hidden">
        <div className="w-full overflow-hidden">
          <ThreeDPhotoCarousel />
        </div>
      </section>

      {/* Saree Heritage & Weavers Showcase (Circular Catered Sarees & Direct Weaver Narrative) */}
      <SareeHeritageShowcase />

      {/* Royal Silk Karagiri Campaign Banner (Timeless Tradition, Exceptional Elegance) */}
      <KaragiriHeritageBanner />

      {/* The Saree Atelier — pick a collection, the stage changes look (replaces the About teaser) */}
      <LazySareeAtelier />

      {/* 3D Hover Gallery Showcase - Silk Karagiri Vault */}
      <section className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-6 sm:py-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] font-ui uppercase tracking-wider text-dark-teal font-semibold">
              Timeless Tradition • Artisan 3D Gallery
            </span>
          </div>
          <h2 className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-tight tracking-tight">
            <span className="text-[#064e3b] dark:text-emerald-400">Explore Handloom,</span>{" "}
            <span className="text-[#9f2d55] dark:text-rose-400">Masterpieces</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Hover or touch each drape to unfold 3D weaves, authentic zari patterns, and centuries of handloom mastery.
          </p>
        </div>

        <LazyHoverGallery />
      </section>

      {/* Authenticity & Care FAQ Accordion */}
      <FaqAccordion />
    </div>
  );
}
