"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { X } from "lucide-react";

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = useCallback(
    (q: string): boolean => {
      if (IS_SERVER) return defaultValue;
      return window.matchMedia(q).matches;
    },
    [defaultValue]
  );

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) return getMatches(query);
    return defaultValue;
  });

  const handleChange = useCallback(() => {
    setMatches(getMatches(query));
  }, [getMatches, query]);

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();

    matchMedia.addEventListener("change", handleChange);
    return () => matchMedia.removeEventListener("change", handleChange);
  }, [query, handleChange]);

  return matches;
}

// All assets from public/images/scrollerimg
const SCROLLER_IMAGES = [
  "/images/scrollerimg/img1.png",
  "/images/scrollerimg/img2.png",
  "/images/scrollerimg/img3.png",
  "/images/scrollerimg/img4.png",
  "/images/scrollerimg/img5.png",
  "/images/scrollerimg/img6.png",
  "/images/scrollerimg/img7.png",
];

export interface ThreeDPhotoCarouselProps {
  cards?: string[];
  className?: string;
  speed?: number; // pixels per second
}

export function ThreeDPhotoCarousel({
  cards = SCROLLER_IMAGES,
  className = "",
  speed = 48,
}: ThreeDPhotoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const offsetRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Triple set for seamless infinite loop across wide displays
  const items = [...cards, ...cards, ...cards];
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClose = useCallback(() => {
    setActiveImg(null);
  }, []);

  // Keyboard escape for modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeImg) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImg, handleClose]);

  // Silky 60fps continuous auto-scroll with subtle 3D curved arc
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const baseItemCount = cards.length;
    // Estimated slot width (image width + gap)
    const slotWidth = 320;
    const cycleWidth = baseItemCount * slotWidth;

    const tick = (currentTime: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Auto-advance unless paused by hover or active drag
      if (!isHoveredRef.current && !isDraggingRef.current && !activeImg) {
        offsetRef.current += speed * delta;
        if (offsetRef.current >= cycleWidth) {
          offsetRef.current -= cycleWidth;
        }
      }

      // Calculate screen geometry for the slight 3D curve
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const halfWidth = containerRect.width / 2;

      // Position each item along the gentle curved arc
      itemRefs.current.forEach((el, index) => {
        if (!el) return;

        // Linear X position in track
        const rawX = index * slotWidth - offsetRef.current;
        // Wrap for continuous presentation
        const wrappedX = ((rawX % (items.length * slotWidth)) + (items.length * slotWidth)) % (items.length * slotWidth) - slotWidth;

        // Normalized distance from center (-1 at left edge, 0 at center, +1 at right edge)
        const itemCenterX = wrappedX + slotWidth / 2;
        const normalized = halfWidth > 0 ? (itemCenterX - centerX) / halfWidth : 0;
        const clamped = Math.max(-1.4, Math.min(1.4, normalized));

        // Very slight curve: subtle rotation (max 11deg) and gentle depth curve (max 38px)
        const rotateY = clamped * 11;
        const translateZ = -Math.pow(clamped, 2) * 38;
        const scale = 1.02 - Math.abs(clamped) * 0.05;
        const translateY = Math.pow(clamped, 2) * 8; // gentle subtle arch

        el.style.transform = `translate3d(${wrappedX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cards, items.length, speed, activeImg]);

  // Touch / Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current += Math.abs(deltaX);
    offsetRef.current -= deltaX * 1.1;
    dragStartXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className={`relative w-full overflow-hidden select-none bg-transparent ${className}`}>
      {/* Lightbox Modal (Box-free pure image inspection) */}
      {activeImg && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-ink-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-8 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl max-h-[85vh] p-2 flex items-center justify-center cursor-default"
          >
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-0 right-0 z-20 w-9 h-9 rounded-full bg-ink-black/75 hover:bg-ink-black text-vanilla-custard border border-golden-orange/40 flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5 text-vanilla-custard" />
            </button>

            <img
              src={activeImg}
              alt="Enlarged Silk Karagiri Collection"
              className="max-h-[80vh] w-auto object-contain rounded-2xl drop-shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Curved 3D Continuous Scroller Viewport (No white backgrounds, No white gradient masks) */}
      <div
        ref={containerRef}
        className="relative w-full h-[220px] sm:h-[250px] md:h-[275px] overflow-hidden flex items-center bg-transparent cursor-grab active:cursor-grabbing"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          isDraggingRef.current = false;
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Continuous Floating Items along the Slight 3D Curved Arc */}
        {items.map((imgUrl, i) => {
          const originalIndex = (i % cards.length) + 1;

          return (
            <div
              key={`curved-item-${imgUrl}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-[270px] sm:w-[300px] md:w-[320px] flex items-center justify-center will-change-transform cursor-pointer group"
              onClick={() => {
                if (dragDistanceRef.current > 6) return;
                setActiveImg(imgUrl);
              }}
            >
              {/* Pure Graphic Saree Emblem: No background box, no borders, natural drop shadow */}
              <img
                src={imgUrl}
                alt={`Silk Karagiri Heritage Saree ${originalIndex}`}
                className="w-auto h-[180px] sm:h-[205px] md:h-[230px] max-w-full object-contain drop-shadow-2xl transition-transform duration-200 group-hover:scale-106 pointer-events-none"
                loading={i < 5 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ThreeDPhotoCarouselDemo() {
  return (
    <div className="w-full py-2 bg-transparent">
      <ThreeDPhotoCarousel />
    </div>
  );
}
