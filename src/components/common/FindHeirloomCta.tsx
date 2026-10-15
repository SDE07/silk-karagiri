"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// SVG mouth paths with matching quadratic bezier structure (M x y Q cx cy ex ey)
const SAD_MOUTH_PATH = "M 26 66 Q 50 46 74 66";
const HAPPY_MOUTH_PATH = "M 26 49 Q 50 74 74 49";

interface FindHeirloomCtaProps {
  className?: string;
}

export function FindHeirloomCta({ className = "" }: FindHeirloomCtaProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHappy, setIsHappy] = useState(false);

  // Auto smooth smile when scrolled into view on every page
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let timer: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 300ms pause so the visitor clearly experiences the smooth transition into a smile
            timer = setTimeout(() => {
              setIsHappy(true);
            }, 300);
          } else {
            if (timer) clearTimeout(timer);
            setIsHappy(false);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(card);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      aria-label="Find Your Heirloom Drape"
      className={`w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-3 sm:py-5 ${className}`}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-[#004e5e] px-6 py-7 sm:px-10 sm:py-9 lg:px-12 lg:py-10 shadow-xl"
      >
        {/* Fixed clean floral background */}
        <Image
          src="/images/about/floral-lines.webp"
          alt=""
          fill
          sizes="1280px"
          className="object-cover opacity-[0.16] pointer-events-none select-none"
        />

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Text & Action Buttons */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-2.5 sm:space-y-3 text-center lg:text-left">
            <h2 className="font-heading-main text-2xl sm:text-3xl lg:text-4xl font-bold text-vanilla-custard leading-tight tracking-tight">
              Find Your Heirloom Drape
            </h2>
            <p className="font-body text-sm sm:text-base text-vanilla-custard/85 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Explore pure silk sarees woven by India&apos;s finest hands — each one ready to become part of your story.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/products?category=Sarees"
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-golden-orange hover:bg-vanilla-custard text-ink-black font-ui text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102 active:scale-98"
              >
                Shop Sarees
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full border border-vanilla-custard/40 hover:border-golden-orange text-vanilla-custard hover:text-golden-orange hover:bg-white/5 font-ui text-xs uppercase tracking-widest font-bold transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Side: Solid Yellow Outline Face & Text */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: isHappy ? [0.95, 1.04, 1] : 1,
              }}
              transition={{
                duration: 0.85,
                ease: [0.25, 1, 0.5, 1],
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsHappy((prev) => !prev)}
              className="cursor-pointer flex flex-col items-center justify-center select-none"
              title="Click or scroll to toggle smile"
            >
              {/* SVG Face: Golden Yellow Outline, Eyes & Mouth with Transparent Inner Circle */}
              <svg
                viewBox="0 0 100 100"
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 text-[#ee9b00] drop-shadow-[0_6px_20px_rgba(238,155,0,0.35)] transition-colors duration-300 hover:text-[#ffd166]"
                aria-hidden="true"
              >
                {/* Transparent inner circle with golden yellow outline */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Left Eye: Golden Yellow */}
                <circle cx="35" cy="38" r="5" fill="currentColor" />

                {/* Right Eye: Golden Yellow */}
                <circle cx="65" cy="38" r="5" fill="currentColor" />

                {/* Animated Morphing Mouth: Golden Yellow with Smooth Liquid Motion */}
                <motion.path
                  d={isHappy ? HAPPY_MOUTH_PATH : SAD_MOUTH_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  transition={{
                    duration: 0.85,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                />
              </svg>

              {/* Sub-label */}
              <span className="mt-2.5 font-ui text-[11px] sm:text-xs uppercase font-bold tracking-[0.24em] text-[#fbbf24] text-center drop-shadow-sm">
                Pure Silk Smile
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindHeirloomCta;
