"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function KaragiriHeritageBanner() {
  return (
    <section className="w-full max-w-[1720px] mx-auto px-1 sm:px-2 md:px-3 py-1 sm:py-2">
      <Link
        href="/products?category=Sarees"
        className="group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl border-0 shadow-lg transition-all duration-500 hover:shadow-2xl"
      >
        <div className="relative w-full aspect-[2025/776] overflow-hidden">
          <Image
            src="/images/banner/karagiri-banner.webp"
            alt="Silk Karagiri — Timeless Tradition, Exceptional Elegance"
            fill
            quality={90}
            sizes="(max-width: 1720px) 100vw, 1720px"
            className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />

          {/* Elegant Subtle Gold Vignette Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-end p-3 sm:p-5 lg:p-6 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-xs text-[#6b1426] font-ui text-xs font-bold uppercase tracking-widest shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

export default KaragiriHeritageBanner;
