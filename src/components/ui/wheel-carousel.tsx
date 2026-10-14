"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export interface WheelCarouselItem {
  label: string;
  image: string;
  imageAlt?: string;
  origin?: string;
  tagline?: string;
}

export type WheelCarouselMode = "system" | "light" | "dark" | "custom";

export interface WheelCarouselProps {
  items?: WheelCarouselItem[];
  mode?: WheelCarouselMode;
  photoSide?: "left" | "right";
  photoWidth?: number;
  photoAspect?: "3/4" | "1/1" | "4/3" | "3/2";
  contentWidth?: number;
  gap?: number;
  photoRadius?: number;
  crossfadeDuration?: number;
  radius?: number;
  spacing?: number;
  visibleItems?: number;
  apexInset?: number;
  textColor?: string;
  selectedColor?: string;
  showMarker?: boolean;
  markerColor?: string;
  markerSize?: number;
  markerGap?: number;
  background?: string;
  panelColor?: string;
  scrollSpeed?: number;
  dragSpeed?: number;
  snap?: boolean;
  momentum?: boolean;
  appear?: boolean;
  edgeFade?: boolean;
  edgeFadeSize?: number;
  initialIndex?: number;
  activeIndex?: number;
  onActiveChange?: (item: WheelCarouselItem, index: number) => void;
  className?: string;
  photoClassName?: string;
  itemClassName?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const wheelCarouselDefaultItems: WheelCarouselItem[] = [
  { label: "Kanchipuram Silk", image: "/images/scrollerimg/img1.webp", origin: "Kanchipuram" },
  { label: "Soft Silk", image: "/images/scrollerimg/img2.webp", origin: "Coimbatore & Arani" },
  { label: "Banaras Silk", image: "/images/scrollerimg/img3.webp", origin: "Varanasi" },
  { label: "Paithani Silk", image: "/images/scrollerimg/img4.webp", origin: "Yeola & Paithan" },
  { label: "Chanderi Silk", image: "/images/scrollerimg/img5.webp", origin: "Chanderi" },
  { label: "Designer Saree’s", image: "/images/scrollerimg/img6.webp", origin: "Atelier" },
];

const aspectRatios = {
  "3/4": "3 / 4",
  "1/1": "1 / 1",
  "4/3": "4 / 3",
  "3/2": "3 / 2",
} as const;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function shortestOffset(index: number, rotation: number, length: number) {
  let offset = index - rotation;
  while (offset > length / 2) offset -= length;
  while (offset < -length / 2) offset += length;
  return offset;
}

export function WheelCarousel({
  items = wheelCarouselDefaultItems,
  mode = "custom",
  photoSide = "left",
  photoWidth = 44,
  photoAspect = "1/1",
  contentWidth = 720,
  gap = 12,
  photoRadius = 24,
  crossfadeDuration = 0.4,
  radius = 290,
  spacing = 20,
  visibleItems = 5,
  apexInset = 32,
  textColor = "rgba(0, 18, 25, 0.42)",
  selectedColor = "#001219",
  showMarker = true,
  markerColor = "#ee9b00",
  markerSize = 12,
  markerGap = 16,
  background = "transparent",
  panelColor = "transparent",
  scrollSpeed = 0.008,
  dragSpeed = 0.02,
  snap = true,
  momentum = true,
  appear = true,
  edgeFade = true,
  edgeFadeSize = 25,
  initialIndex = 0,
  activeIndex,
  onActiveChange,
  autoPlay = true,
  autoPlayInterval = 3800,
  className,
  photoClassName,
  itemClassName,
}: WheelCarouselProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const instanceId = useId();

  const carouselItems = items.length ? items : wheelCarouselDefaultItems;
  const itemCount = carouselItems.length;
  const startingIndex = wrapIndex(activeIndex ?? initialIndex, itemCount);
  const [rotation, setRotation] = useState(startingIndex);
  const [selectedIndex, setSelectedIndex] = useState(startingIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(startingIndex);
  const selectedRef = useRef(startingIndex);
  const appliedActiveIndexRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const dragOriginRef = useRef({ y: 0, rotation: startingIndex });
  const previousDragRotationRef = useRef(startingIndex);
  const frameRef = useRef<number | null>(null);


  useEffect(() => {
    const normalizedIndex = wrapIndex(selectedRef.current, itemCount);

    if (normalizedIndex === selectedRef.current) return;

    selectedRef.current = normalizedIndex;
    rotationRef.current = normalizedIndex;
    setSelectedIndex(normalizedIndex);
    setRotation(normalizedIndex);
  }, [itemCount]);

  const palette = useMemo(() => {
    if (mode === "dark") {
      return {
        background: "#000000",
        text: "rgba(255, 255, 255, 0.5)",
        selected: "#ffffff",
        marker: "#ee9b00",
        panel: "transparent",
      };
    }
    if (mode === "light") {
      return {
        background: "#ffffff",
        text: "rgba(0, 0, 0, 0.38)",
        selected: "#0a0a0a",
        marker: "#ee9b00",
        panel: "transparent",
      };
    }
    return {
      background,
      text: textColor,
      selected: selectedColor,
      marker: markerColor,
      panel: panelColor ?? background,
    };
  }, [
    background,
    markerColor,
    mode,
    panelColor,
    selectedColor,
    textColor,
  ]);

  const commitRotation = useCallback(
    (nextRotation: number) => {
      rotationRef.current = nextRotation;
      setRotation(nextRotation);
      const nextIndex = wrapIndex(Math.round(nextRotation), itemCount);
      if (nextIndex !== selectedRef.current) {
        selectedRef.current = nextIndex;
        setSelectedIndex(nextIndex);
        onActiveChange?.(carouselItems[nextIndex]!, nextIndex);
      }
    },
    [carouselItems, itemCount, onActiveChange],
  );

  // Latest-callback ref for the animation loop; updated after render, not during it.
  const commitRotationRef = useRef(commitRotation);
  useEffect(() => {
    commitRotationRef.current = commitRotation;
  }, [commitRotation]);

  const runAnimation = useCallback(() => {
    if (frameRef.current !== null) return;

    const tick = () => {
      let keepAnimating = false;

      if (!draggingRef.current && Math.abs(velocityRef.current) > 0.0008) {
        commitRotation(rotationRef.current + velocityRef.current);
        velocityRef.current *=
          momentum && !reduceMotion ? (snap ? 0.9 : 0.94) : 0.8;
        keepAnimating = true;
      } else if (!draggingRef.current && snap) {
        velocityRef.current = 0;
        const target = Math.round(rotationRef.current);
        const delta = target - rotationRef.current;
        if (Math.abs(delta) > 0.001 && !reduceMotion) {
          commitRotation(rotationRef.current + delta * 0.22);
          keepAnimating = true;
        } else {
          commitRotation(target);
        }
      } else if (!draggingRef.current) {
        velocityRef.current = 0;
      }

      if (keepAnimating) frameRef.current = requestAnimationFrame(tick);
      else frameRef.current = null;
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [commitRotation, momentum, reduceMotion, snap]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const moveBy = useCallback((amount: number) => {
    if (draggingRef.current) return;
    velocityRef.current = amount * 0.055;
    runAnimation();
  }, [runAnimation]);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      if (!draggingRef.current && !isHovered) {
        moveBy(1);
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isHovered, moveBy]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (event: globalThis.WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      const delta = event.deltaY * scrollSpeed;
      commitRotation(rotationRef.current + delta);
      velocityRef.current = delta * 0.2;
      runAnimation();
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [commitRotation, runAnimation, scrollSpeed]);

  useEffect(() => {
    if (activeIndex === undefined) return;
    const controlledIndex = wrapIndex(activeIndex, itemCount);
    if (appliedActiveIndexRef.current === controlledIndex) return;
    appliedActiveIndexRef.current = controlledIndex;
    const currentIndex = wrapIndex(Math.round(rotationRef.current), itemCount);
    let delta = controlledIndex - currentIndex;
    if (delta > itemCount / 2) delta -= itemCount;
    if (delta < -itemCount / 2) delta += itemCount;
    selectedRef.current = controlledIndex;
    setSelectedIndex(controlledIndex);
    commitRotationRef.current(rotationRef.current + delta);
  }, [activeIndex, itemCount]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    draggingRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    dragOriginRef.current = { y: event.clientY, rotation: rotationRef.current };
    previousDragRotationRef.current = rotationRef.current;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const distance = event.clientY - dragOriginRef.current.y;
    const nextRotation = dragOriginRef.current.rotation - distance * dragSpeed;
    velocityRef.current = nextRotation - previousDragRotationRef.current;
    previousDragRotationRef.current = nextRotation;
    commitRotation(nextRotation);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    runAnimation();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      velocityRef.current = 0;
      commitRotation(rotationRef.current - selectedIndex);
      runAnimation();
    }
    if (event.key === "End") {
      event.preventDefault();
      velocityRef.current = 0;
      const lastIndex = itemCount - 1;
      commitRotation(rotationRef.current + lastIndex - selectedIndex);
      runAnimation();
    }
  };

  const safeSelectedIndex = wrapIndex(selectedIndex, itemCount);
  const selectedItem = carouselItems[safeSelectedIndex]!;
  const mask = edgeFade
    ? `linear-gradient(to bottom, transparent 0%, black ${edgeFadeSize}%, black ${100 - edgeFadeSize}%, transparent 100%)`
    : undefined;

  return (
    <motion.div
      initial={appear && !reduceMotion ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex h-full sm:min-h-[440px] w-full items-center justify-center overflow-hidden bg-transparent select-none",
        className,
      )}
      style={{ backgroundColor: palette.background }}
    >
      {/* Phones: the wheel's text column would be ~170px wide and its stage blocks page scrolling
          (touch-none), so small screens get a compact layout on the same state — full-width photo,
          swipe or arrows to change, the active name in full, and progress dots. */}
      <div className="flex w-full flex-col items-center sm:hidden">
        <motion.div
          className="relative aspect-square w-full max-w-[340px] touch-pan-y"
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 50) moveBy(info.offset.x < 0 ? 1 : -1);
          }}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={`compact-${safeSelectedIndex}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: reduceMotion ? 0 : crossfadeDuration, ease: [0.25, 1, 0.5, 1] }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={selectedItem.image}
                alt={selectedItem.imageAlt ?? selectedItem.label}
                width={1230}
                height={1278}
                sizes="340px"
                className="max-h-full w-auto max-w-full select-none object-contain drop-shadow-2xl"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="mt-4 flex w-full max-w-[360px] items-center gap-3 px-1">
          <button
            type="button"
            onClick={() => moveBy(-1)}
            aria-label="Previous saree"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink-black shadow-sm ring-1 ring-stone-200 transition-colors active:bg-[#9f2d55] active:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1 text-center" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`compact-label-${safeSelectedIndex}`}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="font-heading-main text-[1.45rem] font-bold leading-tight"
                style={{ color: palette.selected }}
              >
                {selectedItem.label}
              </motion.p>
            </AnimatePresence>
            <p className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              {String(safeSelectedIndex + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => moveBy(1)}
            aria-label="Next saree"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink-black shadow-sm ring-1 ring-stone-200 transition-colors active:bg-[#9f2d55] active:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {carouselItems.map((item, index) => (
            <button
              key={`dot-${item.label}-${index}`}
              type="button"
              onClick={() => moveBy(shortestOffset(index, rotation, itemCount))}
              aria-label={`Show ${item.label}`}
              aria-current={index === safeSelectedIndex}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === safeSelectedIndex ? "w-5" : "w-1.5 bg-stone-300",
              )}
              style={index === safeSelectedIndex ? { backgroundColor: palette.marker } : undefined}
            />
          ))}
        </div>
      </div>

      <div
        ref={stageRef}
        role="listbox"
        aria-label="Saree Category Wheel Carousel"
        aria-activedescendant={
          Math.abs(shortestOffset(safeSelectedIndex, rotation, itemCount)) <=
          visibleItems + 1
            ? `${instanceId}-item-${safeSelectedIndex}`
            : undefined
        }
        tabIndex={0}
        className={cn(
          "hidden h-full w-full touch-none select-none items-center overflow-hidden outline-none sm:flex",
          photoSide === "right" && "flex-row-reverse",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        style={{ maxWidth: contentWidth, gap }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Photo Display (Frameless, Drop Shadow, Pure Image) */}
        <div
          className="flex h-full shrink-0 items-center justify-center"
          style={{
            width: `${photoWidth}%`,
            backgroundColor: "transparent",
          }}
        >
          <div
            className={cn(
              "relative w-full h-full max-h-full flex items-center justify-center",
              photoClassName,
            )}
            style={{
              aspectRatio: aspectRatios[photoAspect],
              backgroundColor: "transparent",
            }}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={`${safeSelectedIndex}-${selectedItem.image}`}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: reduceMotion ? 0 : crossfadeDuration, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.imageAlt ?? selectedItem.label}
                  width={1230}
                  height={1278}
                  sizes="(max-width: 640px) 80vw, 520px"
                  className="max-h-full w-auto max-w-full object-contain drop-shadow-2xl select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Rotating Wheel Text Column */}
        <div
          className="relative h-full min-w-0 flex-1 overflow-hidden"
          style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
          {showMarker && (
            <span
              aria-hidden="true"
              className="absolute top-1/2 z-10 -translate-y-1/2 rounded-full shadow-sm"
              style={{
                left: `calc(${apexInset}% - ${markerGap}px)`,
                width: markerSize,
                height: markerSize,
                marginLeft: -markerSize,
                backgroundColor: palette.marker,
              }}
            />
          )}

          {carouselItems.map((item, index) => {
            const offset = shortestOffset(index, rotation, itemCount);
            if (Math.abs(offset) > visibleItems + 1) return null;

            const angle = offset * spacing;
            const radians = (angle * Math.PI) / 180;
            const x = -radius * (1 - Math.cos(radians));
            const y = radius * Math.sin(radians);
            const distance = Math.min(Math.abs(offset) / visibleItems, 1);
            const opacity = Math.cos((distance * Math.PI) / 2);
            const scale = 1 - Math.min(Math.abs(offset) * 0.04, 0.45);
            const selected = Math.abs(offset) < 0.5;

            return (
              <div
                id={`${instanceId}-item-${index}`}
                key={`${item.label}-${index}`}
                role="option"
                aria-selected={selected}
                onClick={() => moveBy(-offset)}
                className={cn(
                  "cursor-pointer pointer-events-auto absolute top-1/2 origin-left whitespace-nowrap text-[clamp(1.2rem,2.2vw,1.8rem)] font-heading-main font-bold leading-none tracking-normal transition-colors duration-200",
                  selected ? "text-ink-black font-extrabold text-[clamp(1.35rem,2.5vw,2.05rem)]" : "text-ink-black/35 hover:text-ink-black/75",
                  itemClassName,
                )}
                style={{
                  left: `${apexInset}%`,
                  color: selected ? palette.selected : palette.text,
                  opacity: Math.max(0.15, opacity),
                  transform: `translate(${x}px, ${y}px) translateY(-50%) rotate(${angle}deg) scale(${scale})`,
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {selectedItem.label}, item {safeSelectedIndex + 1} of {itemCount}
      </span>
    </motion.div>
  );
}

export default WheelCarousel;
