import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "gold" | "royal" | "aqua" | "neutral" | "emerald";
}

export function Badge({ children, className, variant = "gold" }: BadgeProps) {
  const variants = {
    // Metallic / Zari Highlights
    gold: "bg-golden-orange/15 text-golden-orange-400 border-golden-orange/40",
    // Primary Royal Accent (Bridal & Heritage)
    royal: "bg-brown-red/10 text-brown-red border-brown-red/30",
    // Secondary Fresh Accents (Summer / Organza / Loom Mark)
    aqua: "bg-pearl-aqua/25 text-dark-cyan border-pearl-aqua/40",
    // Soft Parchment Neutral
    neutral: "bg-vanilla-custard-800 text-ink-black border-golden-orange/20",
    emerald: "bg-dark-teal/15 text-dark-teal border-dark-teal/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full font-ui text-[10px] font-semibold tracking-widest border uppercase shadow-2xs backdrop-blur-xs",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
