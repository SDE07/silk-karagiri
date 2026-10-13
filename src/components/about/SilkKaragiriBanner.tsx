"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SAREE_MODELS, type SareeModel } from "@/data/about.data";

interface SilkKaragiriBannerProps {
  /** Render the title as the page's h1 (About page) or as an h2 (inside the home page). */
  headingLevel?: "h1" | "h2";
  className?: string;
}

/* One mannequin layer — sits above the floral art, rises in on scroll and lifts on hover. */
function SareeLayer({
  model,
  index,
  className,
  sizes,
}: {
  model: SareeModel;
  index: number;
  className?: string;
  sizes: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -8, scale: 1.035 }}
      className={cn("group relative z-10 min-w-0", className)}
    >
      {/* Soft ground shadow so each model reads as a separate layer */}
      <span
        aria-hidden
        className="absolute bottom-[1%] left-1/2 h-[5%] w-[70%] -translate-x-1/2 rounded-[50%] bg-[#5a3a1e]/25 blur-[6px] transition-all duration-500 group-hover:w-[60%] group-hover:bg-[#5a3a1e]/15"
      />
      <Image
        src={model.src}
        alt={model.alt}
        fill
        sizes={sizes}
        className="object-contain object-bottom drop-shadow-[0_10px_14px_rgba(70,40,15,0.22)]"
      />
    </motion.div>
  );
}

export function SilkKaragiriBanner({ headingLevel = "h2", className }: SilkKaragiriBannerProps) {
  const reduce = useReducedMotion();
  const Heading = headingLevel;
  const left = SAREE_MODELS.slice(0, 3);
  const right = SAREE_MODELS.slice(3);

  const title = (
    <div className="relative z-20 flex flex-col items-center text-center px-2">
      <span className="font-ui text-[9px] sm:text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.32em] text-[#7a5a2e]">
        Handwoven Heritage
      </span>
      <Heading className="mt-1.5 lg:mt-2 font-heading-main font-bold leading-[0.95] tracking-tight">
        <span className="block text-[2.1rem] md:text-[clamp(1.6rem,3.3vw,3.6rem)] text-[#6b1426]">
          Silk Karagiri
        </span>
        <span className="mt-1 flex items-center justify-center gap-2.5 lg:gap-3.5">
          <span aria-hidden className="h-px w-6 lg:w-10 bg-gradient-to-r from-transparent to-[#b8862b]" />
          <span className="font-heading-sub italic font-normal text-[1.35rem] md:text-[clamp(1rem,2vw,2.1rem)] text-[#004e5e]">
            Sarees
          </span>
          <span aria-hidden className="h-px w-6 lg:w-10 bg-gradient-to-l from-transparent to-[#b8862b]" />
        </span>
      </Heading>
      <p className="mt-2 lg:mt-3 max-w-[22rem] font-body text-[13px] md:text-[clamp(0.7rem,1vw,0.95rem)] leading-snug text-[#4a3b2a]">
        Pure silk drapes, woven by hand and brought straight from the loom to you.
      </p>
    </div>
  );

  return (
    <section
      aria-label="Silk Karagiri Sarees"
      className={cn("w-full max-w-[1720px] mx-auto px-1 sm:px-2 md:px-3", className)}
    >
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-[linear-gradient(180deg,#f1e8dc_0%,#eadccb_60%,#e2d1bc_100%)] shadow-lg ring-1 ring-[#b8862b]/15">
        {/* Layer 0 — warm light falloff */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.45)_0%,transparent_60%)]"
        />

        {/* Layer 1 — floral line art behind the title */}
        <motion.div
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="pointer-events-none absolute inset-y-0 left-1/2 w-[120%] md:w-[40%] -translate-x-1/2 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_78%)]"
        >
          <Image
            src="/images/about/floral-lines.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 120vw, 40vw"
            className="object-cover md:object-contain object-center opacity-95"
          />
        </motion.div>

        {/* Desktop / tablet — 3 models · title · 3 models */}
        <div className="relative hidden md:flex aspect-[3.4/1] lg:aspect-[4.4/1] xl:aspect-[5.2/1] items-stretch px-[1.5%]">
          <div className="flex flex-1 items-end gap-[1.5%] pt-[1.5%]">
            {left.map((m, i) => (
              <SareeLayer key={m.src} model={m} index={i} className="h-[94%] flex-1" sizes="(max-width: 1280px) 16vw, 14vw" />
            ))}
          </div>
          <div className="flex w-[34%] shrink-0 items-center justify-center">{title}</div>
          <div className="flex flex-1 items-end gap-[1.5%] pt-[1.5%]">
            {right.map((m, i) => (
              <SareeLayer key={m.src} model={m} index={i + 3} className="h-[94%] flex-1" sizes="(max-width: 1280px) 16vw, 14vw" />
            ))}
          </div>
        </div>

        {/* Mobile — title on top, models in a 3 × 2 grid */}
        <div className="relative md:hidden px-3 pt-7 pb-4">
          {title}
          <div className="mt-5 grid grid-cols-3 gap-x-2 gap-y-3">
            {SAREE_MODELS.map((m, i) => (
              <SareeLayer key={m.src} model={m} index={i % 3} className="aspect-[3/5]" sizes="33vw" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SilkKaragiriBanner;
