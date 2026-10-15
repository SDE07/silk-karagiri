"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WeavingCentresStrip } from "@/components/about/WeavingCentresStrip";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Official Handloom Mark India hallmark */
function HandloomMarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 236 262" fill="currentColor" className={className} aria-hidden="true">
      <path d="M236,155.12a28,28,0,0,0-14.12-24.29L101.68,62.32a18.19,18.19,0,0,1-9.16-15.79V.12q-5,1-9.76,2.3V46.53a27.93,27.93,0,0,0,14.1,24.3l120.2,68.5a18.22,18.22,0,0,1,9.16,15.83v52.61A132.47,132.47,0,0,0,236,191.94Z" />
      <path d="M193.51,147.5,74.1,79.06a18.2,18.2,0,0,1-9.17-15.79V8.78q-5,2.19-9.76,4.77V63.23A28,28,0,0,0,69.27,87.5L188.68,156a18.19,18.19,0,0,1,9.17,15.78v65q5.06-3.79,9.75-8.06v-57A28,28,0,0,0,193.51,147.5Z" />
      <path d="M166,163.47,46.52,95.72a18.18,18.18,0,0,1-9.17-15.79V25.15q-5.07,3.92-9.76,8.33V80a28,28,0,0,0,14.17,24.27L161.26,172a18.17,18.17,0,0,1,9.17,15.78V252.6c3.33-1.42,6.58-3,9.75-4.65V187.78A28,28,0,0,0,166,163.47Z" />
      <path d="M138.41,179.91,18.62,108.61A18.25,18.25,0,0,1,9.76,93V53.91A132.28,132.28,0,0,0,0,70V93a28,28,0,0,0,13.64,24l119.83,71.35.09,0a18.18,18.18,0,0,1,9.16,15.83V261q5-.93,9.75-2.2V204.16A27.93,27.93,0,0,0,138.41,179.91Z" />
      <path d="M18.94,139.33l120.19-68.5a28,28,0,0,0,14.12-24.3V2.26Q148.44.94,143.49,0V46.53a18.22,18.22,0,0,1-9.17,15.84L14.12,130.83A28,28,0,0,0,0,155.12v35.62a133.53,133.53,0,0,0,9.76,16.13V155.12A18.19,18.19,0,0,1,18.94,139.33Z" />
      <path d="M47.33,155.92,166.71,87.5a28,28,0,0,0,14.12-24.27v-50q-4.77-2.55-9.76-4.71V63.23a18.19,18.19,0,0,1-9.16,15.84L42.5,147.45a28,28,0,0,0-14.17,24.26v56.36q4.68,4.31,9.75,8.16V171.71A18.2,18.2,0,0,1,47.33,155.92Z" />
      <path d="M74.77,172,194.3,104.17a28,28,0,0,0,14.11-24.26v-47c-3.11-2.89-6.37-5.62-9.75-8.2V79.93a18.22,18.22,0,0,1-9.17,15.79L70,163.47a28,28,0,0,0-14.12,24.27v59.84q4.76,2.55,9.75,4.71V187.74A18.2,18.2,0,0,1,74.77,172Z" />
      <path d="M102.44,188.33,222.36,117A28.06,28.06,0,0,0,236,93V68.83A132.47,132.47,0,0,0,226.24,53V93a18.26,18.26,0,0,1-8.87,15.61L97.58,179.91a27.94,27.94,0,0,0-14.07,24.25v54.41q4.8,1.31,9.75,2.24V204.16A18.18,18.18,0,0,1,102.44,188.33Z" />
    </svg>
  );
}

/* Master Weaver / Karigar loom shuttle emblem */
function KarigarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2.5 12c4-4.5 15-4.5 19 0-4 4.5-15 4.5-19 0z" />
      <ellipse cx="12" cy="12" rx="3.2" ry="1.6" fill="currentColor" fillOpacity="0.25" />
      <path d="M9 12h6" strokeWidth="2" />
      <path d="M7 5.5v-2M12 4.5v-2M17 5.5v-2M7 18.5v2M12 19.5v2M17 18.5v2" strokeWidth="1.3" />
    </svg>
  );
}

/* Official Silk Mark India butterfly hallmark */
function SilkMarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M10.8 5C9.5 3.3 8 2.8 6.5 3M13.2 5c1.3-1.7 2.8-2.2 4.3-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="5.8" r="1.1" />
      <path d="M11.3 7.4h1.4c.3 2.2.3 5.8 0 7.8h-1.4c-.3-2-.3-5.6 0-7.8z" />
      <path d="M11 7.6C8.5 7.4 5.2 8.5 3 11.2c2 1.4 4.8 1.6 7.4.2-.2-1.2-.4-2.4.6-3.8z" />
      <path d="M10.8 10.6c-2.6.2-5.2 1.6-6.6 4.3 2.2.8 4.8.2 6.6-2.2z" />
      <path d="M11 13.3c-2 .6-3.8 2.2-4.2 4.8 1.8.4 3.6-.6 4.4-3.2z" />
      <path d="M13 7.6c2.5-.2 5.8.9 8 3.6-2 1.4-4.8 1.6-7.4.2.2-1.2.4-2.4-.6-3.8z" />
      <path d="M13.2 10.6c2.6.2 5.2 1.6 6.6 4.3-2.2.8-4.8.2-6.6-2.2z" />
      <path d="M13 13.3c2 .6 3.8 2.2 4.2 4.8-1.8.4-3.6-.6-4.4-3.2z" />
    </svg>
  );
}

const HEADING = [
  { text: "Woven by Hand,", className: "text-[#064e3b]" },
  { text: "Chosen with Heart", className: "text-[#9f2d55]" },
];

const HIGHLIGHTS = [
  { icon: HandloomMarkIcon, label: "Pure Handloom" },
  { icon: KarigarIcon, label: "Direct from Karigars" },
  { icon: SilkMarkIcon, label: "Silk Mark Assured" },
];

/**
 * "Our Story" — master weaver on a layered arch (left), brand story with a Marathi line (right).
 * GSAP + ScrollTrigger drive the reveal; a pointer tilt gives the weaver stage depth.
 */
export function WeaverStorySection() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);

        // Left: arch rises, gold ring draws, weaver steps forward
        const left = gsap.timeline({
          scrollTrigger: { trigger: stage, start: "top 78%" },
          defaults: { ease: "power3.out" },
        });
        left
          .from(q("[data-arch]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.1, ease: "expo.out" })
          .from(q("[data-ring]"), { strokeDashoffset: 1, duration: 1.4, ease: "power2.inOut" }, "-=0.7")
          .from(q("[data-weaver]"), { y: 90, autoAlpha: 0, scale: 0.94, duration: 1.1 }, "-=1.2");

        // Gentle parallax while the section scrolls past
        gsap.to(q("[data-weaver]"), {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: 1 },
        });
        gsap.to(q("[data-floral]"), { rotate: 360, duration: 140, repeat: -1, ease: "none" });

        // Right: eyebrow, word-by-word heading, copy, Marathi card, highlights, CTAs
        const copyTrigger = q("[data-copy]")[0] || root;
        const right = gsap.timeline({
          scrollTrigger: { trigger: copyTrigger, start: "top 75%" },
          defaults: { ease: "power3.out" },
        });
        right
          .from(q("[data-eyebrow]"), { autoAlpha: 0, x: -20, duration: 0.6 })
          .from(q("[data-word]"), { yPercent: 115, duration: 0.8, stagger: 0.06, ease: "power4.out" }, "-=0.3")
          .from(q("[data-para]"), { autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.7 }, "-=0.4")
          .from(q("[data-quote-bar]"), { scaleY: 0, transformOrigin: "50% 0%", duration: 0.6 }, "-=0.3")
          .from(q("[data-quote]"), { autoAlpha: 0, x: 18, stagger: 0.12, duration: 0.7 }, "-=0.4")
          .from(q("[data-chip]"), { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.5 }, "-=0.3")
          .from(q("[data-cta]"), { autoAlpha: 0, y: 14, stagger: 0.1, duration: 0.5 }, "-=0.2");


        // Pointer tilt on the stage (desktop pointers only)
        if (window.matchMedia("(pointer: fine)").matches) {
          const rx = gsap.quickTo(stage, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(stage, "rotationY", { duration: 0.6, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            const r = stage.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 8);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          stage.addEventListener("pointermove", onMove);
          stage.addEventListener("pointerleave", onLeave);
          return () => {
            stage.removeEventListener("pointermove", onMove);
            stage.removeEventListener("pointerleave", onLeave);
          };
        }
      });
    }, root);

    // Refresh ScrollTrigger once DOM/fonts have stabilized after Next.js hydration
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="story" className="scroll-mt-28 w-full overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 xl:gap-32 items-center">
          {/* LEFT — master weaver on a layered arch */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start [perspective:1200px]">
            <div
              ref={stageRef}
              className="relative w-full max-w-[340px] sm:max-w-[400px] xl:max-w-[440px] aspect-[1/1.02] [transform-style:preserve-3d] will-change-transform"
            >
              {/* Arch backdrop */}
              <div
                data-arch
                className="absolute inset-x-[7%] top-[9%] bottom-[3%] rounded-t-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#0a6b7d_0%,#004e5e_45%,#00303a_100%)] shadow-[0_30px_60px_-20px_rgba(0,48,58,0.55)]"
              >
                <div data-floral className="absolute -inset-[20%]">
                  <Image
                    src="/images/about/floral-lines.webp"
                    alt=""
                    fill
                    sizes="440px"
                    className="object-contain opacity-[0.14]"
                  />
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(238,155,0,0.28),transparent_60%)]" />
              </div>

              {/* Gold outline ring, offset for depth */}
              <svg
                aria-hidden
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-x-[4%] top-[6%] bottom-0 w-[92%] h-[94%] overflow-visible [transform:translateZ(-20px)]"
              >
                <path
                  data-ring
                  d="M1 100 V45 A49 45 0 0 1 99 45 V100"
                  fill="none"
                  stroke="#c9973a"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="0"
                  style={{ strokeWidth: 1.25 }}
                />
              </svg>

              {/* Ground shadow */}
              <div className="absolute bottom-[1%] left-1/2 -translate-x-1/2 w-[78%] h-[6%] rounded-[50%] bg-[#3b2410]/30 blur-xl" />

              {/* The weaver — sits above the arch, head breaking out of the frame */}
              <div data-weaver className="absolute inset-x-0 bottom-[3%] top-0 [transform:translateZ(40px)]">
                <Image
                  src="/images/about/karagir.webp"
                  alt="A master weaver presenting a handwoven maroon and royal blue silk saree with gold zari border"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 340px, 440px"
                  className="object-contain object-bottom drop-shadow-[0_18px_28px_rgba(20,10,0,0.35)]"
                />
              </div>

            </div>
          </div>

          {/* RIGHT — the story */}
          <div data-copy className="lg:col-span-7 space-y-6 max-w-[680px]">
            <div data-eyebrow className="flex items-center gap-3">
              <span className="h-px w-10 bg-golden-orange" />
              <span className="text-[11px] font-ui uppercase tracking-[0.25em] text-dark-teal font-semibold">
                Our Story
              </span>
            </div>

            <h2 className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.12] tracking-tight">
              {HEADING.map((line) => (
                <span key={line.text} className={`block ${line.className}`}>
                  {line.text.split(" ").map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-1 align-bottom mr-[0.25em]">
                      <span data-word className="inline-block">
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <div className="space-y-4 font-body text-sm sm:text-base leading-[1.95] sm:leading-[2.05] text-ink-black-300/90 [&_p]:text-justify [&_p]:[text-justify:inter-word] [&_p]:[text-wrap:pretty]">
              <p data-para>
                <strong className="text-ink-black">Silk Karagiri</strong> was born from a simple belief — a genuine
                handloom silk saree should be easy to find, honest in what it promises, and fair to the{" "}
                <em>karigar</em> who weaves it.
              </p>
              <p data-para>
                We visit weaving clusters across India and sit with master weavers in{" "}
                <strong>Kanchipuram, Banaras, Yeola, Paithan and Coimbatore</strong>. Every saree is personally checked
                for its silk, zari and finish, and comes to you directly — no middlemen in between.
              </p>
              <p data-para>
                For us, a saree is never just six yards of fabric. It is a wedding <em>muhurat</em>, a Diwali evening,
                a mother&apos;s blessing passed on to her daughter — an heirloom in the making.
              </p>
            </div>

            {/* Marathi line */}
            <figure className="relative pl-6 py-1">
              <span data-quote-bar className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-golden-orange via-[#c9973a] to-[#9f2d55]" />
              <blockquote
                data-quote
                lang="mr"
                className="font-marathi text-[1.35rem] sm:text-2xl leading-relaxed text-[#6b1426]"
              >
                “धाग्याधाग्यांत विणली परंपरा, प्रत्येक साडीत जपली संस्कृती.”
              </blockquote>
              <figcaption data-quote className="mt-1.5 font-body italic text-sm text-stone-600">
                Tradition woven into every thread; culture treasured in every saree.
              </figcaption>
            </figure>

            <ul className="flex flex-wrap gap-2.5">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  data-chip
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-ui text-[11px] font-semibold text-ink-black shadow-xs ring-1 ring-golden-orange/20"
                >
                  <Icon className="h-4 w-4 text-golden-orange shrink-0" />
                  {label}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <Link
                data-cta
                href="/products?category=Sarees"
                className="group relative inline-flex items-center gap-2 overflow-hidden px-7 py-3.5 rounded-full bg-dark-teal text-vanilla-custard font-ui text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-xl hover:bg-[#9f2d55] transition-[background-color,box-shadow] duration-300"
              >
                {/* shine sweep */}
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 translate-x-[-120%] group-hover:translate-x-[420%] transition-transform duration-700" />
                <span className="relative">Explore the Collection</span>
                <ArrowRight className="relative w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                data-cta
                href="#weavers"
                className="font-ui text-xs font-bold uppercase tracking-wider text-dark-teal hover:text-[#9f2d55] transition-colors"
              >
                Meet our weaving centres →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Weaving-centre logo strip — fixed label, scrolling logos */}
      <div className="mt-14 sm:mt-20 py-6 sm:py-8">
        <WeavingCentresStrip />
      </div>
    </section>
  );
}

export default WeaverStorySection;
