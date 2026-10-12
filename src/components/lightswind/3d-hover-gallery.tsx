"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export interface GalleryItem {
  url: string;
  title: string;
  category: string;
  description: string;
  color?: string;
  glow?: string;
  href?: string;
}

export interface ThreeDHoverGalleryProps {
  images?: string[];
  items?: GalleryItem[];
  itemWidth?: number | string;
  itemHeight?: number | string;
  gap?: number | string;
  perspective?: number;
  hoverScale?: number;
  transitionDuration?: number;
  backgroundColor?: string;
  grayscaleStrength?: number;
  brightnessLevel?: number;
  activeWidth?: number | string;
  rotationAngle?: number;
  zDepth?: number;
  enableKeyboardNavigation?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
  style?: React.CSSProperties;
  onImageClick?: (index: number, item: any) => void;
  onImageHover?: (index: number, item: any) => void;
  onImageFocus?: (index: number, item: any) => void;
}

const DEFAULT_SAREE_ITEMS: GalleryItem[] = [
  {
    url: "/images/scrollerimg/img1.png",
    title: "Kanchipuram Silk",
    category: "Bridal Zari",
    description: "Pure mulberry silk with authentic 24K gold zari temple borders handwoven in Tamil Nadu.",
    glow: "rgba(212,175,55,0.45)",
    href: "/products?category=Sarees&tag=kanchipuram"
  },
  {
    url: "/images/scrollerimg/img2.png",
    title: "Banarasi Katan",
    category: "Royal Brocade",
    description: "Intricate floral kadhwa jaal woven on heirloom pit looms by master artisans of Varanasi.",
    glow: "rgba(159,45,85,0.45)",
    href: "/products?category=Sarees&tag=banarasi"
  },
  {
    url: "/images/scrollerimg/img3.png",
    title: "Paithani Handloom",
    category: "Maharashtra Heritage",
    description: "Signature kaleidoscopic peacock pallu with oblique square borders in lustrous pure silk.",
    glow: "rgba(0,78,94,0.45)",
    href: "/products?category=Sarees&tag=paithani"
  },
  {
    url: "/images/scrollerimg/img4.png",
    title: "Chanderi Gossamer",
    category: "Featherlight Weave",
    description: "Delicate sheer silk-cotton blend detailed with shimmering zari bootis and royal motifs.",
    glow: "rgba(212,175,55,0.45)",
    href: "/products?category=Sarees&tag=chanderi"
  },
  {
    url: "/images/scrollerimg/img5.png",
    title: "Mysore Crepe Silk",
    category: "Karnataka Royalty",
    description: "Fluid natural crepe silk with understated solid borders and regal golden zari pallu.",
    glow: "rgba(159,45,85,0.45)",
    href: "/products?category=Sarees&tag=mysore"
  },
  {
    url: "/images/scrollerimg/img6.png",
    title: "Tussar Wild Silk",
    category: "Organic Loom",
    description: "Naturally textured golden wild silk drapes with hand-painted tribal and kantha work.",
    glow: "rgba(197,138,42,0.45)",
    href: "/products?category=Sarees&tag=tussar"
  },
  {
    url: "/images/scrollerimg/img7.png",
    title: "Soft Silk Festive",
    category: "Contemporary Heirloom",
    description: "Lightweight comfortable drapes designed with traditional soul for grand modern celebrations.",
    glow: "rgba(0,78,94,0.45)",
    href: "/products?category=Sarees&tag=soft-silk"
  }
];

export const ThreeDHoverGallery: React.FC<ThreeDHoverGalleryProps> = ({
  images,
  items,
  itemHeight = 480,
  itemWidth,
  gap = 12,
  perspective = 1200,
  hoverScale = 1.06,
  transitionDuration = 0.5,
  backgroundColor,
  grayscaleStrength = 0.35,
  brightnessLevel = 0.75,
  activeWidth = 5.2,
  rotationAngle = 22,
  zDepth = 35,
  enableKeyboardNavigation = true,
  autoPlay = false,
  autoPlayDelay = 4000,
  className = "",
  style,
  onImageClick,
  onImageHover,
  onImageFocus,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Normalize data sources
  const galleryItems: GalleryItem[] = useMemo(() => {
    if (items && items.length > 0) return items;
    if (images && images.length > 0) {
      return images.map((url, index) => {
        const fallback = DEFAULT_SAREE_ITEMS[index % DEFAULT_SAREE_ITEMS.length];
        return {
          url,
          title: fallback.title,
          category: fallback.category,
          description: fallback.description,
          glow: fallback.glow,
          href: fallback.href
        };
      });
    }
    return DEFAULT_SAREE_ITEMS;
  }, [images, items]);

  // Handle Autoplay Loop (pauses when user hovers over container)
  useEffect(() => {
    if (autoPlay && galleryItems.length > 0 && !isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const nextIndex = prev === null ? 0 : (prev + 1) % galleryItems.length;
          return nextIndex;
        });
      }, autoPlayDelay);

      return () => {
        if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      };
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
  }, [autoPlay, autoPlayDelay, galleryItems.length, isHovered]);

  const handleCardClick = (index: number, item: GalleryItem) => {
    setActiveIndex(activeIndex === index ? null : index);
    onImageClick?.(index, item);
  };

  const handleCardHover = (index: number, item: GalleryItem) => {
    setActiveIndex(index);
    onImageHover?.(index, item);
  };

  const handleContainerLeave = () => {
    setIsHovered(false);
    // keep current index active or reset
  };

  const handleContainerEnter = () => {
    setIsHovered(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (!enableKeyboardNavigation) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleCardClick(index, galleryItems[index]);
        break;
      case "ArrowLeft":
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : galleryItems.length - 1;
        setActiveIndex(prevIndex);
        (containerRef.current?.children[prevIndex] as HTMLElement)?.focus();
        break;
      case "ArrowRight":
        event.preventDefault();
        const nextIndex = index < galleryItems.length - 1 ? index + 1 : 0;
        setActiveIndex(nextIndex);
        (containerRef.current?.children[nextIndex] as HTMLElement)?.focus();
        break;
      case "Escape":
        setActiveIndex(null);
        break;
    }
  };

  const computedGap = typeof gap === "number" ? `${gap}px` : gap;
  const computedHeight = typeof itemHeight === "number" ? `${itemHeight}px` : itemHeight;
  const activeFlex = typeof activeWidth === "number" ? activeWidth : 5;

  return (
    <div
      className={`w-full flex flex-col items-center justify-center overflow-hidden py-3 select-none ${className}`}
      style={{
        backgroundColor: backgroundColor || "transparent",
        ...style,
      }}
      onMouseEnter={handleContainerEnter}
      onMouseLeave={handleContainerLeave}
    >
      <div
        ref={containerRef}
        className="flex justify-center items-stretch w-full max-w-[1720px] mx-auto px-1 sm:px-2 overflow-x-auto sm:overflow-visible no-scrollbar"
        style={{
          perspective: `${perspective}px`,
          transformStyle: "preserve-3d",
          gap: computedGap,
          minHeight: computedHeight,
        }}
      >
        {galleryItems.map((item, index) => {
          const isActive = activeIndex === index;
          const isFocused = focusedIndex === index;

          // Compute 3D rotation angle based on relative distance to active card
          let rotY = 0;
          let translateZ = 0;
          if (activeIndex !== null) {
            if (index < activeIndex) {
              rotY = rotationAngle;
              translateZ = -Math.min(3, activeIndex - index) * 8;
            } else if (index > activeIndex) {
              rotY = -rotationAngle;
              translateZ = -Math.min(3, index - activeIndex) * 8;
            } else {
              rotY = 0;
              translateZ = zDepth;
            }
          }

          return (
            <motion.div
              key={index}
              role="button"
              tabIndex={enableKeyboardNavigation ? 0 : -1}
              onClick={() => handleCardClick(index, item)}
              onMouseEnter={() => handleCardHover(index, item)}
              onFocus={() => {
                setFocusedIndex(index);
                onImageFocus?.(index, item);
              }}
              onBlur={() => setFocusedIndex(null)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={item.title}
              aria-pressed={isActive}
              layout
              animate={{
                rotateY: rotY,
                z: translateZ,
              }}
              transition={{
                layout: { type: "spring", stiffness: 120, damping: 20 },
                rotateY: { type: "spring", stiffness: 100, damping: 18 },
                z: { type: "spring", stiffness: 100, damping: 18 },
              }}
              style={{
                height: computedHeight,
                zIndex: isActive ? 25 : 10 + (galleryItems.length - Math.abs((activeIndex ?? 0) - index)),
                flex: isActive ? activeFlex : 1,
                minWidth: isActive ? "280px" : "55px",
                maxWidth: isActive ? "560px" : "140px",
                transformStyle: "preserve-3d",
              }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 shadow-lg ${
                isActive
                  ? "border-[#d4af37]/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                  : activeIndex === null
                    ? "border-amber-900/15 hover:border-[#d4af37]/60"
                    : "border-stone-200/40 hover:border-amber-900/30"
              } ${
                isFocused
                  ? "ring-2 ring-[#d4af37] ring-offset-2 scale-[1.02]"
                  : ""
              } bg-[#1a120c]`}
            >
              {/* Outer Glow Halo on Active */}
              {isActive && item.glow && (
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-500 z-10"
                  style={{
                    boxShadow: `inset 0 0 28px ${item.glow}, 0 0 22px ${item.glow}`,
                  }}
                />
              )}

              {/* Background Image Container with parallax scale */}
              <motion.div
                animate={{
                  scale: isActive ? hoverScale : 1.0,
                  filter: isActive
                    ? "grayscale(0) brightness(1)"
                    : `grayscale(${grayscaleStrength}) brightness(${brightnessLevel})`,
                }}
                transition={{ duration: transitionDuration, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url(${item.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 25%",
                }}
              />

              {/* Text Readable Gradient Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 z-[2] ${
                  isActive
                    ? "bg-gradient-to-t from-black/95 via-black/55 to-black/10 opacity-100"
                    : "bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 hover:opacity-40"
                }`}
              />

              {/* Vertical Title Tag on Inactive Item */}
              {!isActive && (
                <div className="absolute inset-0 flex items-end justify-center pb-6 z-[3] pointer-events-none">
                  <span className="text-[11px] font-semibold tracking-widest text-[#fbf7ed]/90 uppercase [writing-mode:vertical-rl] rotate-180 drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Active Detailed Saree Card Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 z-[4] text-white overflow-hidden pointer-events-none">
                <AnimatePresence>
                  {isActive && (
                    <div className="flex flex-col items-start w-full pointer-events-auto">
                      {/* Saree Category & Pure Silk Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#9f2d55]/85 border border-[#d4af37]/40 mb-2 shadow-sm"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
                        <span className="text-[9.5px] font-bold tracking-widest uppercase text-[#fbf7ed]">
                          {item.category}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.3, delay: 0.09 }}
                        className="text-lg md:text-xl font-serif font-bold leading-tight tracking-wide mb-1.5 text-[#fbf7ed] drop-shadow-sm"
                      >
                        {item.title}
                      </motion.h4>

                      {/* Artisan Saree Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 0.9, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3, delay: 0.14 }}
                        className="text-[11.5px] md:text-xs font-normal leading-relaxed text-[#fbf7ed]/85 mb-4 line-clamp-3 max-w-[320px]"
                      >
                        {item.description}
                      </motion.p>

                      {/* Explore Pure Silk Action Button */}
                      <motion.a
                        href={item.href || "/products?category=Sarees"}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        transition={{ duration: 0.3, delay: 0.18 }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38f2a] text-[#1a120c] font-semibold text-[11px] tracking-wider uppercase shadow-md hover:brightness-110 active:scale-95 transition-all group/btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Weaves</span>
                        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </motion.a>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreeDHoverGallery;
