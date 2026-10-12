"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Crown, Gem, MapPin, Sparkles } from "lucide-react";
import { WheelCarousel, type WheelCarouselItem } from "@/components/ui/wheel-carousel";
import { AnimatedCopyButton } from "@/components/lightswind/animated-copy-button";

const SAREE_WHEEL_ITEMS: WheelCarouselItem[] = [
  {
    label: "Kanchipuram Silk",
    image: "/images/scrollerimg/img1.png",
    imageAlt: "Kanchipuram Pure Silk Saree",
    origin: "Kanchipuram Looms",
    tagline: "Temple Korvai borders & 3-ply twisted silk with authentic gold zari",
  },
  {
    label: "Soft Silk",
    image: "/images/scrollerimg/img2.png",
    imageAlt: "Soft Silk Saree",
    origin: "Coimbatore & Arani",
    tagline: "Featherweight elegance with effortless, breathable drape",
  },
  {
    label: "Banaras Silk",
    image: "/images/scrollerimg/img3.png",
    imageAlt: "Banaras Silk Saree",
    origin: "Varanasi Ghat Looms",
    tagline: "Cutwork meenakari jaal & pure silver electrum brocades",
  },
  {
    label: "Paithani Silk",
    image: "/images/scrollerimg/img4.png",
    imageAlt: "Paithani Silk Saree",
    origin: "Yeola & Paithan",
    tagline: "Regal peacock & muniya borders in vibrant jewel tones",
  },
  {
    label: "Chanderi Silk",
    image: "/images/scrollerimg/img5.png",
    imageAlt: "Chanderi Silk Saree",
    origin: "Madhya Pradesh Looms",
    tagline: "Gossamer sheer texture with shimmering gold tissue motifs",
  },
  {
    label: "Designer Saree’s",
    image: "/images/scrollerimg/img6.png",
    imageAlt: "Designer Saree",
    origin: "Couture Atelier",
    tagline: "Bespoke fusion drapes with intricate artisanal handwork",
  },
];

export function SareeHeritageShowcase() {
  const [activeItem, setActiveItem] = useState<WheelCarouselItem>(SAREE_WHEEL_ITEMS[0]);

  return (
    <section className="w-full max-w-[1536px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
      {/* Clean Unboxed Layout (No background box, seamless with canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-start lg:pt-2">
        
        {/* LEFT SIDE: Interactive Wheel Carousel (Prominent & Majestic) */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start w-full">
         

          {/* Wheel Carousel Component */}
          <div className="w-full flex justify-center">
            <WheelCarousel
              items={SAREE_WHEEL_ITEMS}
              photoSide="left"
              photoWidth={54}
              photoAspect="1/1"
              photoRadius={20}
              radius={340}
              spacing={22}
              visibleItems={5}
              apexInset={20}
              markerColor="#ee9b00"
              selectedColor="#001219"
              textColor="rgba(0, 18, 25, 0.35)"
              background="transparent"
              panelColor="transparent"
              edgeFade={true}
              edgeFadeSize={22}
              contentWidth={980}
              autoPlay={true}
              autoPlayInterval={3500}
              className="h-[460px] sm:h-[530px] lg:h-[590px] xl:h-[620px] w-full"
              onActiveChange={(item) => setActiveItem(item)}
            />
          </div>

          {/* Active Item Origin Pill */}
          
        </div>

        {/* RIGHT SIDE: Silk Karagiri Heritage & Weaver Story */}
        <div className="lg:col-span-5 space-y-6 lg:space-y-6.5 lg:pl-3">
          {/* Eyebrow & Headline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
             
             
              <span className="text-[11px] font-ui uppercase tracking-wider text-dark-teal font-semibold">
                Timeless Tradition. Eternal Elegance.
              </span>
            </div>
            <h2 className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-tight tracking-tight">
              <span className="text-[#064e3b] dark:text-emerald-400">Pure Silk,</span>{" "}
              <span className="text-[#9f2d55] dark:text-rose-400">Direct from Weavers</span>
            </h2>
          </div>

          {/* Brand Narrative with Luxury Spacing, Gem Icon & Equal Line Widths */}
          <div className="space-y-4 font-body text-sm sm:text-base text-ink-black-300">
            <p className="leading-[1.95] sm:leading-[2.05] text-justify [text-justify:inter-word] [text-wrap:pretty]">
              <Gem className="w-3.5 h-3.5 text-golden-orange inline mr-1.5 -mt-0.5 shrink-0" />
              <strong>Elevate Your Elegance with Silk Karagiri</strong> — Discover the timeless beauty of authentic handloom silk sarees sourced directly from master weaver guilds across <strong>Kanchipuram, Yeola, Banaras, Coimbatore</strong>, and beyond.
            </p>
            <p className="text-xs sm:text-sm leading-[1.85] sm:leading-[1.95] text-ink-black-300/90 text-justify [text-justify:inter-word] [text-wrap:pretty]">
              Each handloom saree boasts a rich pallu, signature korvai borders, and electro-spun zari motifs — crafted to perfection for grand weddings, festive celebrations, and heirloom receptions.
            </p>
          </div>

          {/* Value Cards (Silk Mark Assurance & Heritage Craftsmanship) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-vanilla-custard-800/40 border border-golden-orange/20 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold font-ui text-ink-black">
                <CheckCircle2 className="w-4 h-4 text-golden-orange flex-shrink-0" />
                <span>Silk Mark Assurance</span>
              </div>
              <p className="font-body text-xs text-ink-black-300 leading-relaxed">
                Most sarees are Silk Mark certified, guaranteeing 100% natural mulberry purity &amp; authentic thread grade.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-vanilla-custard-800/40 border border-golden-orange/20 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold font-ui text-ink-black">
                <Crown className="w-4 h-4 text-golden-orange flex-shrink-0" />
                <span>Heritage Craftsmanship</span>
              </div>
              <p className="font-body text-xs text-ink-black-300 leading-relaxed">
                Centuries of pit-loom devotion and royal zari artistry woven straight into every drape with zero middlemen.
              </p>
            </div>
          </div>

          {/* Direct Weaver Clusters Tags (Crisp White Background - Not Golden, Clean Rounded Chips) */}
          <div className="pt-1.5">
            <span className="text-[11px] font-ui font-semibold text-ink-black-300 uppercase tracking-wider block mb-2.5">
              Direct Weaver Clusters:
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap w-full overflow-visible">
              {["Kanchipuram", "Yeola", "Banaras", "Coimbatore", "Paithan", "Chanderi"].map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-ui font-semibold bg-white text-ink-black shadow-xs whitespace-nowrap shrink-0 hover:bg-white/90 hover:shadow-sm transition-all"
                >
                  <MapPin className="w-2.5 h-2.5 text-golden-orange shrink-0" />
                  <span>{city}</span>
                </span>
              ))}
            </div>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2.5">
            <AnimatedCopyButton
              textToCopy="https://silkkaragiri.com/products?category=Sarees"
              href="/products?category=Sarees"
              showArrow={true}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark-teal hover:bg-[#9f2d55] text-vanilla-custard font-ui text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 border-0 cursor-pointer"
            >
              Explore Saree Vault
            </AnimatedCopyButton>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 font-ui text-xs font-bold uppercase tracking-wider text-dark-teal hover:text-[#9f2d55] transition-colors"
            >
              <span>View Silk Mark Details →</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
