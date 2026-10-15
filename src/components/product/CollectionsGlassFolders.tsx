"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { GlassFolder, type FolderFile } from "@/components/ui/glass-folder";
import { SAREE_COLLECTIONS, collectionImage, collectionLooks } from "@/data/collections.data";

const ART_LIST: Array<"aurora" | "ember" | "dusk" | "verdant" | "glacier"> = [
  "ember",
  "dusk",
  "verdant",
  "aurora",
  "glacier",
  "ember",
  "dusk",
  "aurora",
  "verdant",
  "ember",
  "glacier",
];

export function CollectionsGlassFolders() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="relative w-full space-y-6 pt-2 pb-8 border-b border-[#b8862b]/20">
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#b8862b]" />
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-[#7a5a2e]">
              Handloom Archives • 11 Master Collections
            </span>
          </div>
          <h2 className="font-heading-main text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6b1426] tracking-tight">
            Curated Silk Vault Folders
          </h2>
          <p className="font-heading-sub italic text-base sm:text-lg text-[#004e5e]">
            Click any frosted glass archive to fan open authentic handwoven drape looks
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll collections left"
            className="p-2.5 rounded-full bg-vanilla-custard-800/80 hover:bg-vanilla-custard-800 text-[#6b1426] border border-[#b8862b]/30 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll collections right"
            className="p-2.5 rounded-full bg-vanilla-custard-800/80 hover:bg-vanilla-custard-800 text-[#6b1426] border border-[#b8862b]/30 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Rail of 11 Glass Folders */}
      <div
        ref={scrollRef}
        className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-8 pt-4 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none [mask-image:linear-gradient(to_right,black_90%,transparent_100%)]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {SAREE_COLLECTIONS.map((col, idx) => {
          const looks = collectionLooks(col);
          const files: FolderFile[] = looks.slice(0, 4).map((lookNum, fileIdx) => ({
            name: `Look ${fileIdx + 1} — ${col.motif || "Pure Silk"}`,
            meta: col.fabric,
            image: collectionImage(col, lookNum),
            href: `/products?category=Sarees`,
          }));

          const artPreset = ART_LIST[idx % ART_LIST.length];

          return (
            <div
              key={col.slug}
              className="snap-start shrink-0 flex flex-col items-center"
              style={{ width: 310 }}
            >
              <GlassFolder
                width={310}
                label={col.name}
                meta={`${col.count} Woven Looks`}
                tone="light"
                art={artPreset}
                image={collectionImage(col, col.cover)}
                files={files}
                action="more"
                menu={[
                  {
                    label: `Explore ${col.name}`,
                    onSelect: () => {
                      window.location.href = `/products?category=Sarees`;
                    },
                  },
                ]}
                appear={true}
                appearDelay={idx * 60}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CollectionsGlassFolders;
