"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Layers produced by scripts/build-tryon.mjs — all share the model photo's exact frame. */
const LAYERS = "/images/atelier";
const EASE = [0.22, 1, 0.36, 1] as const;
/** The model is a 4× AI-upscaled master; serve the layers at high quality so she stays crisp. */
const QUALITY = 95;
const SIZES = "(max-width: 1024px) 90vw, 420px";

/** Model photo aspect (533 × 822). The stage box must use it so every layer lines up. */
export const DRAPE_ASPECT = "aspect-[533/822]";

const sareeMask: React.CSSProperties = {
  maskImage: `url(${LAYERS}/mask-hd.png)`,
  WebkitMaskImage: `url(${LAYERS}/mask-hd.png)`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskPosition: "center center",
  WebkitMaskPosition: "center center",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  imageRendering: "-webkit-optimize-contrast",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
  transform: "translateZ(0.5px)",
};

interface DrapeStageProps {
  /** Fabric swatch to "wear" (collectionDrape). */
  drape: string;
  /** The real product photo, shown instead of the model when `view` is "photo". */
  photo: string;
  alt: string;
  view: "model" | "photo";
  /** A new collection gets the slower, grander sweep; a new shade of the same one is quicker. */
  sweep: "collection" | "look";
  /** Stops the idle sway (e.g. while the stage is scrolled out of view). */
  paused?: boolean;
}

/* Idle turntable: a slow ±TURN° sway. The model is a single front photo, so it only reads as 3D at
   small angles — past ~30° it flattens and mirrors. A real 360° (side and back views) needs photos
   of the model from multiple angles; see docs/saree-collections-section.md. */
const TURN = 12;
const SWAY = { duration: 7, ease: "easeInOut", repeat: Infinity } as const;

/**
 * Virtual drape: one fixed model, and only her saree changes.
 *
 *   model-hd.webp         the model (4× AI-upscaled), cut out of her background
 *   fabric (masked)       the selected swatch, clipped to the saree by mask-hd.png
 *   shade-hd.png ×multiply  the original folds and shadows, so the new fabric still drapes
 *   gloss-hd.png  +screen    the silk highlights
 *
 * A change unrolls the new fabric from the shoulder down, with a zari-gold light running along
 * the reveal edge. The model sways gently on a turntable; the actual-photo view stays flat.
 */
export function DrapeStage({
  drape,
  photo,
  alt,
  view,
  sweep,
  paused = false,
}: DrapeStageProps) {
  const reduce = useReducedMotion();
  const duration = reduce ? 0.35 : sweep === "collection" ? 1.15 : 0.8;
  const still = reduce || paused || view === "photo";

  return (
    <div className="absolute inset-0">
      {/* Every model layer sits in one box; 1:1 aspect ratio keeps mask, model and folds aligned */}
      <motion.div
        className="absolute inset-0 isolate"
        style={{ scale: 1.0, transformPerspective: 1400 }}
        animate={{ rotateY: still ? 0 : [-TURN, TURN, -TURN] }}
        transition={still ? { duration: 0.6 } : SWAY}
      >
        {/* Ground shadow — the photo's floor was removed with the background */}
        <span
          aria-hidden
          className="absolute left-[33%] top-[90.5%] h-[5%] w-[56%] rounded-[50%] bg-[#4a2c14]/30 blur-[10px]"
        />
        <Image
          src={`${LAYERS}/model-hd.webp`}
          alt={alt}
          fill
          sizes={SIZES}
          quality={QUALITY}
          priority
          className="object-cover [image-rendering:-webkit-optimize-contrast]"
        />

        <AnimatePresence initial={false}>
          <motion.div
            key={drape}
            aria-hidden
            className="absolute inset-0 bg-cover bg-center will-change-[clip-path,opacity]"
            style={{
              ...sareeMask,
              backgroundImage: `url(${drape})`,
              filter: "contrast(1.18) saturate(1.16) brightness(1.02)",
            }}
            initial={
              reduce
                ? { opacity: 0, zIndex: 2 }
                : { clipPath: "inset(0% 0% 100% 0%)", zIndex: 2 }
            }
            animate={{
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              zIndex: 2,
              transition: { duration, ease: EASE },
            }}
            exit={{
              opacity: 0,
              zIndex: 1,
              transition: { duration: 0.2, delay: duration },
            }}
          />
        </AnimatePresence>

        <Image
          src={`${LAYERS}/shade-hd.png`}
          alt=""
          aria-hidden
          fill
          sizes={SIZES}
          quality={QUALITY}
          className="z-[3] object-cover mix-blend-multiply opacity-80"
        />
        <Image
          src={`${LAYERS}/gloss-hd.png`}
          alt=""
          aria-hidden
          fill
          sizes={SIZES}
          quality={QUALITY}
          className="z-[4] object-cover mix-blend-screen opacity-90"
        />

        {/* Zari light that travels with the reveal edge */}
        {!reduce && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
            style={sareeMask}
          >
            <motion.div
              key={drape}
              className="absolute inset-x-0 top-0 h-[12%] bg-[linear-gradient(180deg,transparent,rgba(255,214,140,0.55)_55%,rgba(255,240,205,0.85)_80%,transparent)] mix-blend-screen"
              initial={{ y: "-100%", opacity: 1 }}
              animate={{ y: "830%", opacity: [1, 1, 0] }}
              transition={{ duration, ease: EASE }}
            />
          </div>
        )}
      </motion.div>

      {/* The real photo, for exact colour and detail */}
      <AnimatePresence>
        {view === "photo" && (
          <motion.div
            key={photo}
            className="absolute inset-0 z-[6] bg-vanilla-custard-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <Image
              src={photo}
              alt={alt}
              fill
              sizes={SIZES}
              quality={QUALITY}
              className="object-cover object-top"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DrapeStage;
