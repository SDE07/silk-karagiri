"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Flower2,
  Layers,
  MessageCircle,
  Play,
  Ribbon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_INFO } from "@/lib/constants";
import {
  SAREE_COLLECTIONS,
  collectionDrape,
  collectionImage,
  collectionLooks,
  collectionVideo,
} from "@/data/collections.data";
import { DRAPE_ASPECT, DrapeStage } from "@/components/home/DrapeStage";

/** How long each collection holds the stage while the showcase plays on its own. */
const AUTOPLAY_MS = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = SAREE_COLLECTIONS.length;

const pad = (n: number) => String(n).padStart(2, "0");
const wrap = (i: number, n: number) => ((i % n) + n) % n;

type View = "model" | "photo";

/* The visitor's On model / Actual photo choice is remembered across visits. Read through
   useSyncExternalStore so the server (no storage) renders "model" without a hydration mismatch. */
const VIEW_KEY = "silk-atelier-view";
const subscribeStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const readStoredView = (): View => {
  try {
    return localStorage.getItem(VIEW_KEY) === "photo" ? "photo" : "model";
  } catch {
    return "model"; // storage blocked (private mode)
  }
};

/* Detail blocks stagger in each time the collection changes. */
const group: Variants = { show: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

/** Scrolls `index`'s child of a scroll container into the middle, without moving the page. */
function centreChild(box: HTMLElement | null, index: number, axis: "x" | "y", smooth: boolean) {
  const child = box?.children[index] as HTMLElement | undefined;
  if (!box || !child) return;
  const behavior = smooth ? "smooth" : "auto";
  if (axis === "x") box.scrollTo({ left: child.offsetLeft - (box.clientWidth - child.clientWidth) / 2, behavior });
  else box.scrollTo({ top: child.offsetTop - (box.clientHeight - child.clientHeight) / 2, behavior });
}

/**
 * "The Saree Atelier" — an inbox of collections on the left, one model in the centre who changes
 * into whichever saree is picked, and the collection's story on the right. Plays itself until the
 * visitor interacts. Content: src/data/collections.data.ts · Notes: docs/saree-collections-section.md
 */
export function SareeAtelierSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const desktopLooksRef = useRef<HTMLDivElement>(null);
  const mobileLooksRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });

  const [active, setActive] = useState(0);
  const [look, setLook] = useState(0);
  const storedView = useSyncExternalStore(subscribeStorage, readStoredView, () => "model" as View);
  const [chosenView, setChosenView] = useState<View | null>(null);
  const view = chosenView ?? storedView;
  const [video, setVideo] = useState<number | null>(null);
  const [sweep, setSweep] = useState<"collection" | "look">("collection");
  const [userTookOver, setUserTookOver] = useState(false);
  const [hovering, setHovering] = useState(false);

  const collection = SAREE_COLLECTIONS[active];
  const looks = useMemo(() => collectionLooks(collection), [collection]);
  const current = looks[look];
  const autoplay = !reduce && !userTookOver && inView && !hovering && video === null;

  // `view` is deliberately not reset here: once a visitor picks "Actual photo" it stays chosen.
  const goTo = useCallback((i: number, byUser = true) => {
    if (byUser) setUserTookOver(true);
    setActive(wrap(i, TOTAL));
    setLook(0);
    setVideo(null);
    setSweep("collection");
  }, []);

  const pickLook = (i: number) => {
    setUserTookOver(true);
    setLook(wrap(i, looks.length));
    setVideo(null);
    setSweep("look");
  };

  const pickView = (v: View) => {
    setUserTookOver(true);
    setVideo(null);
    setChosenView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      // storage blocked (private mode) — the choice still holds for this visit
    }
  };

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => goTo(active + 1, false), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [autoplay, active, goTo]);

  useEffect(() => centreChild(listRef.current, active, "y", !reduce), [active, reduce]);
  useEffect(() => {
    centreChild(desktopLooksRef.current, look, "x", !reduce);
    centreChild(mobileLooksRef.current, look, "x", !reduce);
  }, [look, active, reduce]);

  const renderChangeLook = (isMobileView: boolean) => (
    <div className={cn("border-t border-golden-orange/20 pt-4 sm:pt-5", isMobileView ? "mt-4" : "mt-5")}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-heading-sub text-base sm:text-lg italic text-[#9f2d55]">Change look</span>
        <span className="font-ui text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          Look {look + 1} of {looks.length}
        </span>
      </div>
      <motion.div
        key={collection.slug}
        ref={isMobileView ? mobileLooksRef : desktopLooksRef}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
        className="relative flex gap-2 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]"
      >
        {looks.map((n, i) => {
          const on = i === look && video === null;
          return (
            <button
              key={n}
              type="button"
              onClick={() => pickLook(i)}
              aria-label={`Show look ${i + 1}`}
              aria-pressed={on}
              className={cn(
                "group relative h-[62px] w-[48px] sm:h-[68px] sm:w-[52px] shrink-0 overflow-hidden rounded-lg bg-vanilla-custard-800 transition-all duration-300",
                on
                  ? "ring-2 ring-[#9f2d55] ring-offset-2 ring-offset-vanilla-custard-900"
                  : "ring-1 ring-stone-200 hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
              <Image
                src={collectionImage(collection, n)}
                alt=""
                fill
                sizes="104px"
                className={cn("object-cover transition-[transform,filter] duration-500 group-hover:scale-110", !on && "saturate-[0.85]")}
              />
            </button>
          );
        })}
      </motion.div>
      <p className="mt-2 font-body text-[11px] sm:text-xs italic leading-relaxed text-stone-500 px-2 sm:px-0">
        Virtual drape shows the colour and weave — switch to Actual photo for the exact saree.
      </p>
    </div>
  );

  // Warm the cache so a fabric change never waits on the network mid-sweep.
  useEffect(() => {
    const next = SAREE_COLLECTIONS[(active + 1) % TOTAL];
    const urls = [...looks.map((n) => collectionDrape(collection, n)), collectionDrape(next, next.cover)];
    urls.forEach((src) => {
      new window.Image().src = src;
    });
  }, [active, collection, looks]);

  const whatsapp = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
    `Namaste Silk Karagiri, I'd love to know more about the ${collection.name} collection.`
  )}`;

  const notes = [
    { icon: Layers, title: "Fabric", text: collection.fabric },
    { icon: Flower2, title: "Signature motif", text: collection.motif },
    { icon: Ribbon, title: "Border & pallu", text: collection.border },
  ];

  const iconButton =
    "flex h-8 w-8 items-center justify-center rounded-full text-stone-500 ring-1 ring-stone-200 transition-colors hover:bg-[#9f2d55] hover:text-white hover:ring-[#9f2d55]";

  return (
    <section
      ref={sectionRef}
      id="collections"
      aria-labelledby="atelier-heading"
      className="relative scroll-mt-28 overflow-hidden py-6 sm:py-10"
    >
      <span aria-hidden className="pointer-events-none absolute left-[4%] top-[30%] h-48 w-48 rounded-full bg-golden-orange/10 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute bottom-[10%] right-[4%] h-56 w-56 rounded-full bg-[#9f2d55]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-10 lg:px-12">
        {/* Heading */}
        <header className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-golden-orange" />
            <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] text-dark-teal">The Saree Atelier</span>
            <span className="h-px w-10 bg-golden-orange" />
          </div>
          <h2 id="atelier-heading" className="font-heading-sub text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.65rem]">
            <span className="text-[#064e3b]">Choose Your</span> <span className="text-[#9f2d55]">Drape</span>
          </h2>
          <p className="font-body text-[15px] leading-relaxed text-ink-black-300/85 sm:text-base">
            {TOTAL} handloom collections, straight from our weavers. Pick one and see it drape.
          </p>
        </header>

        {/* Collections · Model · Details */}
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 sm:mt-14 lg:grid-cols-[minmax(0,300px)_minmax(320px,380px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,330px)_minmax(320px,380px)_minmax(0,1fr)] xl:gap-14">
          {/* ── Left: collections inbox (Order 1 on mobile: before the model stage image) ── */}
          <div className="order-1 min-w-0 lg:order-1">
            <div className="overflow-hidden rounded-2xl bg-white/80 shadow-[0_20px_45px_-30px_rgba(107,20,38,0.35)] ring-1 ring-stone-200/80 backdrop-blur">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200/70 px-3.5 sm:px-4 py-2.5 sm:py-3">
                <div className="leading-tight">
                  <span className="block font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-ink-black">Collections</span>
                  <span className="mt-0.5 block font-ui text-[9.5px] tracking-wider text-stone-500">
                    {pad(active + 1)} of {pad(TOTAL)}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous collection" className={iconButton}>
                    <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                  <button type="button" onClick={() => goTo(active + 1)} aria-label="Next collection" className={iconButton}>
                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              <ul
                ref={listRef}
                role="listbox"
                aria-label="Saree collections"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    goTo(active + (e.key === "ArrowDown" ? 1 : -1));
                  }
                }}
                className="relative h-[114px] max-h-[114px] sm:h-auto sm:max-h-[380px] lg:max-h-[520px] divide-y divide-stone-100 overflow-y-auto overscroll-contain outline-none [scrollbar-width:thin] touch-pan-y snap-y snap-mandatory"
              >
                {SAREE_COLLECTIONS.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li key={c.slug} role="option" aria-selected={isActive} className="snap-start shrink-0">
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => goTo(i)}
                        className={cn(
                          "group relative flex w-full items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors h-[57px] sm:h-auto",
                          isActive ? "bg-[#9f2d55]/[0.06]" : "hover:bg-vanilla-custard-800/50"
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="atelier-inbox-active"
                            className="absolute inset-y-0 left-0 w-[3px] bg-[#9f2d55]"
                            transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          />
                        )}
                        <span
                          className={cn(
                            "relative h-8 w-8 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full ring-2 transition-shadow",
                            isActive ? "ring-[#9f2d55]/60" : "ring-white"
                          )}
                        >
                          <Image src={collectionImage(c, c.cover)} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-1.5">
                            <span
                              className={cn(
                                "truncate font-ui text-[12px] sm:text-[13px] tracking-tight",
                                isActive ? "font-bold text-[#6b1426]" : "font-semibold text-ink-black group-hover:text-[#6b1426]"
                              )}
                              title={c.name}
                            >
                              {c.name}
                            </span>
                            <span className="flex shrink-0 items-center gap-1 font-ui text-[9px] sm:text-[10px] text-stone-500">
                              {c.videos && <Play className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-current text-[#9f2d55]" aria-label="Has video" />}
                              {pad(i + 1)}
                            </span>
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5">
                            {c.badge && (
                              <span className="shrink-0 rounded bg-golden-orange/15 px-1.5 py-px font-ui text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider text-[#8a5a00]">
                                {c.badge}
                              </span>
                            )}
                            <span className="truncate font-body text-[11px] sm:text-[13px] text-stone-500">{c.tagline}</span>
                          </span>
                        </span>
                        {isActive && autoplay && (
                          <motion.span
                            key={`progress-${active}`}
                            className="absolute bottom-0 left-0 h-[2px] bg-golden-orange"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Centre: the model (Order 2 on mobile: right below collections inbox) ───────── */}
          <div className="order-2 min-w-0 lg:order-2">
            <motion.div
              onHoverStart={() => setHovering(true)}
              onHoverEnd={() => setHovering(false)}
              onPanEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                  pickLook(look + (info.offset.x < 0 ? 1 : -1));
                }
              }}
              className="relative mx-auto w-full max-w-[380px] touch-pan-y"
            >
              {/* Temple-arch frame */}
              <div className="relative rounded-b-[30px] rounded-t-[999px] bg-white/60 p-2.5 shadow-[0_40px_80px_-40px_rgba(107,20,38,0.45)] ring-1 ring-golden-orange/35">
                <div className={cn("relative overflow-hidden rounded-b-[22px] rounded-t-[999px]", DRAPE_ASPECT)}>
                  {/* Backdrop — warm studio light, faint floral line-art and a floor */}
                  <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_28%,#fffaf2_0%,#f4e7d5_52%,#e6d1b6_100%)]" />
                  <Image
                    src="/images/about/floral-lines.webp"
                    alt=""
                    aria-hidden
                    fill
                    sizes="380px"
                    className="object-cover opacity-[0.22] mix-blend-multiply"
                  />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-[#d8c0a0]/80 to-transparent" />

                  <DrapeStage
                    drape={collectionDrape(collection, current)}
                    photo={collectionImage(collection, current)}
                    alt={`Model wearing the ${collection.name}`}
                    view={view}
                    sweep={sweep}
                    paused={!inView}
                  />

                  <AnimatePresence>
                    {video !== null && (
                      <motion.video
                        key={`video-${collection.slug}-${video}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        src={collectionVideo(collection, video)}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="absolute inset-0 z-[7] h-full w-full bg-black object-cover"
                      />
                    )}
                  </AnimatePresence>

                  {/* Stage chrome */}
                  <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2">
                    {video !== null && (collection.videos ?? 0) > 1 ? (
                      <button
                        type="button"
                        onClick={() => setVideo((v) => ((v ?? 1) % (collection.videos ?? 1)) + 1)}
                        className="rounded-full bg-white/90 px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-ink-black shadow-sm backdrop-blur transition-colors hover:bg-white"
                      >
                        Video {video} / {collection.videos} ›
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span className="rounded-full bg-white/90 px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-ink-black shadow-sm backdrop-blur">
                          {video !== null ? "Video" : view === "model" ? "Virtual drape" : `Actual saree · ${look + 1} / ${looks.length}`}
                        </span>
                      </span>
                    )}
                    {collection.videos &&
                      (video === null ? (
                        <button
                          type="button"
                          onClick={() => {
                            setUserTookOver(true);
                            setVideo(1);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#9f2d55] px-3.5 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-md transition-transform hover:scale-105"
                        >
                          <Play className="h-3 w-3 fill-current" /> Watch video
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setVideo(null)}
                          aria-label="Close video"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-black shadow-md transition-transform hover:scale-105"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Prev / next look */}
              {looks.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => pickLook(look - 1)}
                    aria-label="Previous look"
                    className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-dark-teal text-white shadow-[0_8px_20px_-6px_rgba(0,78,94,0.55)] ring-2 ring-white transition-[background-color,transform] hover:scale-105 hover:bg-[#9f2d55] active:scale-95 sm:left-0 sm:-translate-x-1/2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => pickLook(look + 1)}
                    aria-label="Next look"
                    className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-dark-teal text-white shadow-[0_8px_20px_-6px_rgba(0,78,94,0.55)] ring-2 ring-white transition-[background-color,transform] hover:scale-105 hover:bg-[#9f2d55] active:scale-95 sm:right-0 sm:translate-x-1/2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </motion.div>

            {/* On model ↔ actual photo — the choice sticks across looks and collections */}
            <div className="mx-auto mt-5 flex w-full max-w-[380px] justify-center">
              <div role="group" aria-label="Stage view" className="inline-flex rounded-full bg-white/70 p-1 shadow-xs ring-1 ring-stone-200">
                {(["model", "photo"] as const).map((v) => {
                  const on = view === v && video === null;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => pickView(v)}
                      aria-pressed={on}
                      className={cn(
                        "relative rounded-full px-4 py-1.5 font-ui text-[10px] font-bold uppercase tracking-[0.18em] transition-colors",
                        on ? "text-white" : "text-stone-500 hover:text-ink-black"
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="atelier-view"
                          className="absolute inset-0 rounded-full bg-dark-teal"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">{v === "model" ? "On model" : "Actual photo"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile-only Change look block — placed directly after the model drape image */}
            <div className="block lg:hidden w-full max-w-[380px] mx-auto">
              {renderChangeLook(true)}
            </div>
          </div>

          {/* ── Right: the collection details (Order 3 on mobile) ───────────────────────── */}
          <div className="order-3 min-w-0 lg:order-3 lg:pt-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={collection.slug} variants={group} initial="hidden" animate="show" exit="exit">
                <motion.div variants={item} className="flex items-center gap-3 font-ui text-[11px] font-bold tracking-[0.25em]">
                  <span className="text-[#9f2d55]">{pad(active + 1)}</span>
                  <span className="h-px w-8 bg-golden-orange/60" />
                  <span className="text-stone-400">{pad(TOTAL)}</span>
                  {collection.badge && (
                    <span className="ml-1 rounded-full bg-golden-orange/15 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[#8a5a00]">
                      {collection.badge}
                    </span>
                  )}
                </motion.div>

                <motion.h3
                  variants={item}
                  aria-live="polite"
                  className="mt-4 font-heading-main text-[2rem] font-bold leading-[1.05] tracking-tight text-ink-black sm:text-[2.4rem]"
                >
                  {collection.name}
                </motion.h3>
                <motion.p variants={item} className="mt-2 font-heading-sub text-lg italic text-[#9f2d55]">
                  {collection.tagline}
                </motion.p>
                <motion.p variants={item} className="mt-3 max-w-md font-body text-[15px] leading-relaxed text-ink-black-300/85">
                  {collection.story}
                </motion.p>

                {/* Weave notes — strictly equal in 3 columns, strictly 2 lines of text on mobile & desktop */}
                <motion.ul variants={item} className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-golden-orange/20 pt-5">
                  {notes.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="min-w-0 flex flex-col items-start">
                      <span className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white text-[#6b1426] shadow-xs ring-1 ring-stone-200/70 shrink-0">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-golden-orange ring-2 ring-vanilla-custard-900" />
                      </span>
                      <span className="mt-2 block font-ui text-[8.5px] xs:text-[9px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-stone-500 truncate w-full">
                        {title}
                      </span>
                      <span
                        className="mt-1 block font-body text-[11px] xs:text-[12px] sm:text-[13.5px] leading-tight sm:leading-snug text-ink-black line-clamp-2 h-[2.2rem] xs:h-[2.4rem] sm:h-auto overflow-hidden"
                        title={text}
                      >
                        {text}
                      </span>
                    </li>
                  ))}
                </motion.ul>

              </motion.div>
            </AnimatePresence>

            {/* Desktop-only Change look block */}
            <div className="hidden lg:block">
              {renderChangeLook(false)}
            </div>

            {/* Actions — last, after the visitor has picked a look */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-dark-teal px-6 py-3 font-ui text-xs font-bold uppercase tracking-widest text-vanilla-custard shadow-md transition-[background-color,box-shadow] duration-300 hover:bg-[#9f2d55] hover:shadow-xl"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 translate-x-[-120%] bg-white/25 transition-transform duration-700 group-hover:translate-x-[420%]" />
                <MessageCircle className="relative h-3.5 w-3.5" />
                <span className="relative">Enquire on WhatsApp</span>
              </a>
              <Link
                href="/products?category=Sarees"
                className="group inline-flex items-center gap-1.5 font-ui text-xs font-bold uppercase tracking-wider text-dark-teal transition-colors hover:text-[#9f2d55]"
              >
                Shop sarees
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SareeAtelierSection;
