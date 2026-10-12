"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSlide {
  id: number;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  href: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: "/images/banner1.webp",
    alt: "Sarees — The Essence of Heritage & Grace",
    title: "The Essence of Heritage & Grace",
    subtitle: "Pure Mulberry & Heritage Silks",
    href: "/products?category=Sarees",
  },
  {
    id: 2,
    image: "/images/banner2.webp",
    alt: "Silk Karagiri — Kanjivaram Silk Traditional Craftsmanship & Timeless Elegance",
    title: "Kanjivaram Silk Vault",
    subtitle: "Traditional Craftsmanship & Timeless Elegance",
    href: "/products/kanjivaram-gold-zari-saree",
  },
  {
    id: 3,
    image: "/images/banner3.webp",
    alt: "Silk Karagiri — A Trusted Destination For Pure and Premium Silk Sarees",
    title: "Pure & Premium Handlooms",
    subtitle: "Where Every Thread Tells a Story of Heritage",
    href: "/products",
  },
  {
    id: 4,
    image: "/images/banner4.webp",
    alt: "Silk Karagiri — From Generation to Generation, Our Heritage Lives On",
    title: "Three Generations of Grace",
    subtitle: "Heirloom Silks Handed Down with Love",
    href: "/products?category=Sarees",
  },
  {
    id: 5,
    image: "/images/banner5.webp",
    alt: "Exclusive Banarasi Silk Saree Collection — Traditional Craftsmanship",
    title: "Exclusive Banarasi Collection",
    subtitle: "Pure Silver & Electrum Zari Brocades",
    href: "/products/banarasi-raw-silk-saree",
  },
];

const SLIDES_COUNT = BANNER_SLIDES.length;

// Prepend last slide clone and append first slide clone for seamless infinite wrap
const EXTENDED_SLIDES = [
  BANNER_SLIDES[SLIDES_COUNT - 1], // index 0 (clone of slide 5)
  ...BANNER_SLIDES,                 // indices 1 to 5 (real slides 1 to 5)
  BANNER_SLIDES[0],                 // index 6 (clone of slide 1)
];

const TRANSITION_DURATION = 700; // ms
const AUTO_PLAY_INTERVAL = 3800; // ms (smooth 3.8s auto-scroll)

export function HeroBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(1); // 1-indexed (real slide 1)
  const [enableTransition, setEnableTransition] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isTransitioningRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync ref for rock-solid transition gating without hook recreation
  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Active original slide index (0 to SLIDES_COUNT - 1) for dots
  const activeRealIndex =
    currentIndex === 0
      ? SLIDES_COUNT - 1
      : currentIndex === SLIDES_COUNT + 1
      ? 0
      : currentIndex - 1;

  // Fully stable nextSlide with hard boundary clamp
  const nextSlide = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsTransitioning(true);
    setEnableTransition(true);
    setCurrentIndex((prev) => {
      if (prev >= SLIDES_COUNT + 1) return prev;
      return prev + 1;
    });
  }, []);

  // Fully stable prevSlide with hard boundary clamp
  const prevSlide = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsTransitioning(true);
    setEnableTransition(true);
    setCurrentIndex((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  }, []);

  const goToSlide = useCallback((targetIndex: number) => {
    if (isTransitioningRef.current) return;
    setIsTransitioning(true);
    setEnableTransition(true);
    setCurrentIndex(targetIndex + 1);
  }, []);

  // Bulletproof snap effect: guaranteed timer resets clone boundaries seamlessly
  useEffect(() => {
    if (currentIndex === SLIDES_COUNT + 1) {
      // Reached right clone of slide 1 -> wait for 700ms slide animation, then silent jump to real slide 1
      const timer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(1);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }

    if (currentIndex === 0) {
      // Reached left clone of slide 5 -> wait for 700ms slide animation, then silent jump to real slide 5
      const timer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(SLIDES_COUNT);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }

    // Normal slide transition completed
    const releaseTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
    return () => clearTimeout(releaseTimer);
  }, [currentIndex]);

  // Re-enable smooth transition in next animation frame after silent snap
  useEffect(() => {
    if (!enableTransition) {
      const rId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
      return () => cancelAnimationFrame(rId);
    }
  }, [enableTransition]);

  // Uninterrupted, reliable auto-play timer (3.8 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Pause when browser tab is inactive to prevent desync
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section
      aria-label="Heritage Silk Banners"
      className="relative w-full -mt-20 overflow-hidden select-none border-b border-golden-orange/25"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 90vh Desktop Height Hero Canvas (90% viewport height with 10% bottom peek) */}
      <div className="relative w-full h-[75vh] sm:h-[82vh] md:h-[88vh] lg:h-[90vh] min-h-[440px] sm:min-h-[540px] md:min-h-[640px] lg:min-h-[720px] max-h-[960px]">
        {/* Sliding Track with seamless infinite wrap */}
        <div
          className={`flex h-full w-full will-change-transform ${
            enableTransition
              ? "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              : ""
          }`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: enableTransition ? undefined : "none",
          }}
        >
          {EXTENDED_SLIDES.map((slide, index) => {
            const isCurrent = currentIndex === index;
            const uniqueKey =
              index === 0
                ? "clone-prev"
                : index === EXTENDED_SLIDES.length - 1
                ? "clone-next"
                : `slide-${slide.id}`;

            return (
              <div
                key={uniqueKey}
                className="relative h-full w-full flex-shrink-0 overflow-hidden"
                aria-hidden={!isCurrent}
              >
                <Link
                  href={slide.href}
                  className="block relative h-full w-full group cursor-pointer"
                  tabIndex={isCurrent ? 0 : -1}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index <= 2 || index === EXTENDED_SLIDES.length - 1}
                    sizes="100vw"
                    quality={95}
                    unoptimized
                    className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-102"
                  />

                  {/* Subtle vignette shadow overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/40 via-transparent to-transparent pointer-events-none" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Previous Button (Desktop) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-vanilla-custard-900/85 hover:bg-vanilla-custard-900 text-ink-black border border-golden-orange/35 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer opacity-85 hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-ink-black" />
        </button>

        {/* Next Button (Desktop) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-vanilla-custard-900/85 hover:bg-vanilla-custard-900 text-ink-black border border-golden-orange/35 shadow-xl backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer opacity-85 hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-ink-black" />
        </button>

        {/* Pagination Indicators / Dots */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ink-black/30 backdrop-blur-md border border-golden-orange/25 shadow-lg"
        >
          {BANNER_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeRealIndex === index
                  ? "w-8 sm:w-10 bg-golden-orange shadow-md"
                  : "w-2.5 bg-vanilla-custard-100/50 hover:bg-vanilla-custard-100/90"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
