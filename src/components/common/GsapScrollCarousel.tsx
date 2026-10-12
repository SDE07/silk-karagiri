"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Crown, Sparkles, Feather, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeritagePanel {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  href: string;
  price: string;
}

const PANELS: HeritagePanel[] = [
  {
    id: "kanjivaram",
    number: "01",
    title: "Kanjivaram Bridal Heirloom",
    subtitle: "Pure Mulberry Silk × 3-Ply Gold Zari",
    tagline: "Woven on authentic pit-looms with temple korvai borders",
    description:
      "Crafted with pure mulberry silk yarn and interlocking solid gold zari borders that take 25 days of devoted loom work. Certified with authentic Silk Mark authenticity.",
    badge: "GI-Tagged Heritage",
    icon: Crown,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    href: "/products/kanjivaram-gold-zari-saree",
    price: "₹32,000",
  },
  {
    id: "banarasi",
    number: "02",
    title: "Banarasi Meenakari Vault",
    subtitle: "Cutwork Brocade with Pure Silver Electrum",
    tagline: "Ancient Varanasi floral jaal and royal shikargah motifs",
    description:
      "Hand-spun pure silver threads interwoven with rich jewel-toned silk threads over 180 continuous hours of artisan master craftsmanship.",
    badge: "Master Loom Guild",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
    href: "/products/banarasi-raw-silk-saree",
    price: "₹24,500",
  },
  {
    id: "chanderi",
    number: "03",
    title: "Wild Tussar & Chanderi Brocade",
    subtitle: "Breathable Forest Silk with Gold Tissue",
    tagline: "Eco-harvested wild cocoons with feather-light gossamer drape",
    description:
      "A harmonious blend of textured wild tussar silk and sheer Chanderi weave, celebrated for its natural golden sheen and breathable summer comfort.",
    badge: "Eco-Loom Organic",
    icon: Feather,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=80",
    href: "/products?category=Fabrics",
    price: "₹18,500",
  },
  {
    id: "royal-couture",
    number: "04",
    title: "Royal Mulberry Stoles & Drapes",
    subtitle: "Grade 6A Mulberry Silk with Hand-Rolled Hems",
    tagline: "Bespoke elegance tailored for regal celebrations",
    description:
      "Natural madder root, saffron, and indigo dyes hand-applied on gossamer mulberry silk with artisan tassel embellishments.",
    badge: "Silk Mark 100%",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    href: "/products?category=Scarves",
    price: "₹5,800",
  },
];

export function GsapScrollCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || !trackRef.current) return;

    const container = containerRef.current;
    const track = trackRef.current;
    const panels = gsap.utils.toArray<HTMLElement>(".panels-item", track);

    if (panels.length === 0) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll animation matching requested GSAP syntax
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => "+=" + container.offsetWidth,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full border-y border-golden-orange/20 bg-ink-black text-vanilla-custard-900">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-ui text-xs font-semibold uppercase tracking-widest text-golden-orange">
            Master Loom Heritage Journey
          </span>
          <h2 className="font-heading-main text-3xl sm:text-5xl font-bold tracking-tight text-vanilla-custard-900 mt-1">
            Woven Legacy Galleries
          </h2>
        </div>
        <p className="font-body text-sm sm:text-base text-vanilla-custard-900/70 max-w-md">
          Scroll down to glide horizontally through India&apos;s most coveted pure silk saree legacies.
        </p>
      </div>

      {/* Pinned Scroll Container */}
      <div
        ref={containerRef}
        className="container relative w-full h-[85vh] min-h-[580px] max-h-[780px] overflow-hidden"
      >
        {/* Track of sliding panels */}
        <div
          ref={trackRef}
          className="flex flex-row flex-nowrap w-[400%] h-full will-change-transform"
        >
          {PANELS.map((panel) => {
            const Icon = panel.icon;
            return (
              <div
                key={panel.id}
                className="panels-item w-screen h-full flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-12"
              >
                <div className="w-full max-w-6xl h-full rounded-2xl border border-golden-orange/25 bg-gradient-to-br from-ink-black/90 via-ink-black to-ink-black-500/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-md">
                  {/* Left Story Content */}
                  <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                    {/* Top Row: Panel number & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-heading-main text-4xl sm:text-5xl font-bold text-golden-orange/40 tracking-wider">
                        {panel.number}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-ui uppercase font-bold tracking-widest bg-golden-orange/15 text-golden-orange border border-golden-orange/30">
                        <Icon className="w-3.5 h-3.5" />
                        {panel.badge}
                      </span>
                    </div>

                    {/* Middle: Title, Subtitle, Description */}
                    <div className="space-y-3">
                      <span className="font-ui text-xs uppercase tracking-widest text-dark-teal-400 font-semibold block">
                        {panel.subtitle}
                      </span>
                      <h3 className="font-heading-main text-3xl sm:text-4xl lg:text-5xl font-bold text-vanilla-custard-900 leading-tight">
                        {panel.title}
                      </h3>
                      <p className="font-body text-base sm:text-lg text-vanilla-custard-900/80 leading-relaxed pt-1">
                        {panel.description}
                      </p>
                    </div>

                    {/* Bottom: Pricing & CTA */}
                    <div className="pt-4 border-t border-golden-orange/20 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-ui uppercase tracking-wider text-vanilla-custard-900/60 block">
                          Artisan Pricing
                        </span>
                        <span className="font-ui text-2xl font-bold text-golden-orange">
                          {panel.price}
                        </span>
                      </div>
                      <Link href={panel.href}>
                        <Button
                          variant="festive"
                          size="lg"
                          className="font-ui uppercase tracking-wider text-xs inline-flex items-center gap-2 group cursor-pointer"
                        >
                          Explore Drape
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Image Display */}
                  <div className="lg:col-span-6 relative h-64 lg:h-full w-full overflow-hidden border-t lg:border-t-0 lg:border-l border-golden-orange/20">
                    <Image
                      src={panel.image}
                      alt={panel.title}
                      fill
                      className="object-cover object-center filter saturate-105 hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink-black/70 lg:via-transparent lg:to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-ink-black/75 backdrop-blur-md border border-golden-orange/20 text-xs font-ui text-vanilla-custard-900/90 flex items-center justify-between">
                      <span className="truncate">{panel.tagline}</span>
                      <span className="text-golden-orange shrink-0 font-bold ml-2">100% Pure Silk</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
