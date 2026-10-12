"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Crown, Truck, Sparkles } from "lucide-react";

interface AnnouncementItem {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  badge?: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 1,
    icon: ShieldCheck,
    badge: "Government Certified",
    text: "Silk Mark Certified 100% Pure Mulberry & Kanjivaram Heritage Weaves",
  },
  {
    id: 2,
    icon: Crown,
    badge: "Artisan Loom Guilds",
    text: "Hand-Spun Pure Silver & Gold Zari Direct from Master Weavers of Varanasi",
  },
  {
    id: 3,
    icon: Truck,
    badge: "Express Courier",
    text: "Complimentary Insured Pan-India Express Delivery & Safe Worldwide Shipping",
  },
  {
    id: 4,
    icon: Sparkles,
    badge: "Complimentary",
    text: "Bespoke Fall, Pico Finishing & Custom Blouse Stitching with Every Saree",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <aside
      aria-label="Announcements"
      className="relative z-50 bg-ink-black text-vanilla-custard-900 border-b border-golden-orange/20 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-center text-xs font-ui">
        {/* Center Carousel Item with smooth fade transition */}
        <div
          key={current.id}
          className="flex items-center justify-center gap-2 text-center truncate px-2 animate-in fade-in zoom-in-95 duration-500"
          aria-live="polite"
        >
          <Icon className="w-3.5 h-3.5 text-golden-orange shrink-0 animate-pulse" />

          {current.badge && (
            <span className="hidden md:inline-block px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-widest bg-golden-orange/20 text-golden-orange rounded border border-golden-orange/30">
              {current.badge}
            </span>
          )}

          <span className="text-[11px] sm:text-xs tracking-wider uppercase font-medium text-vanilla-custard-900/90 truncate">
            {current.text}
          </span>
        </div>
      </div>
    </aside>
  );
}
