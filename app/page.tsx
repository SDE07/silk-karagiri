import React from "react";
import { FaqAccordion } from "@/components/common/FaqAccordion";
import { LoomCalendarSection } from "@/components/home/LoomCalendarSection";
import { HeroBannerSlider } from "@/components/home/HeroBannerSlider";
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";
import { SareeHeritageShowcase } from "@/components/home/SareeHeritageShowcase";
import { KaragiriHeritageBanner } from "@/components/home/KaragiriHeritageBanner";
import ThreeDHoverGallery from "@/components/lightswind/3d-hover-gallery";
import { SilkKaragiriBanner } from "@/components/about/SilkKaragiriBanner";
import Link from "next/link";

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

        <ThreeDHoverGallery
          images={[
            "/images/scrollerimg/img1.png",
            "/images/scrollerimg/img2.png",
            "/images/scrollerimg/img3.png",
            "/images/scrollerimg/img4.png",
            "/images/scrollerimg/img5.png",
            "/images/scrollerimg/img6.png",
            "/images/scrollerimg/img7.png",
          ]}
          autoPlay={true}
          autoPlayDelay={4200}
          itemHeight={490}
          perspective={1400}
          hoverScale={1.05}
          transitionDuration={0.65}
        />
      </section>

      {/* About Section — starts with the layered Silk Karagiri Sarees banner */}
      <section id="about" className="scroll-mt-28 w-full space-y-8">
        <SilkKaragiriBanner />
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <p className="font-body text-base sm:text-lg leading-relaxed text-ink-black-300/90">
            Silk Karagiri brings pure handloom silk sarees straight from master weavers in Kanchipuram, Banaras,
            Yeola, Coimbatore and beyond — honest silk, authentic zari, and no middlemen.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark-teal hover:bg-[#9f2d55] text-vanilla-custard font-ui text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Read Our Story →
          </Link>
        </div>
      </section>

      {/* A Year at the Looms — heat map that rises into a 3D skyline */}
      <LoomCalendarSection />

      {/* Authenticity & Care FAQ Accordion */}
      <FaqAccordion />
    </div>
  );
}
