"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LazyMountProps {
  children: React.ReactNode;
  /**
   * Space reserved until the content mounts (Tailwind min-height classes, can be responsive).
   * Keep it close to the real height so nothing below jumps when the content arrives.
   */
  placeholderClassName?: string;
  /** How far ahead of the viewport to start mounting — enough to fetch and render before it's seen. */
  rootMargin?: string;
  className?: string;
}

/**
 * Renders `children` only once they come near the viewport. Use for heavy, decorative,
 * below-the-fold sections (3D galleries, animated showcases): their JavaScript, images and
 * animations stay out of the initial page load. Not for content that matters for SEO.
 */
export function LazyMount({ children, placeholderClassName, rootMargin = "900px 0px", className }: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn(className, !mounted && placeholderClassName)}>
      {mounted ? children : null}
    </div>
  );
}

export default LazyMount;
