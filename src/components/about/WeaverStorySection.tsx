"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WeavingCentresStrip } from "@/components/about/WeavingCentresStrip";
import { ArrowRight, BadgeCheck, HandHeart, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADING = [
  { text: "Woven by Hand,", className: "text-[#064e3b]" },
  { text: "Chosen with Heart", className: "text-[#9f2d55]" },
];

const HIGHLIGHTS = [
  { icon: Sparkles, label: "Pure Handloom" },
  { icon: HandHeart, label: "Direct from Karigars" },
  { icon: BadgeCheck, label: "Silk Mark Assured" },
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
        const right = gsap.timeline({
          scrollTrigger: { trigger: q("[data-copy]")[0], start: "top 75%" },
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

    return () => ctx.revert();
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
                  src="/images/about/karagir.png"
                  alt="A master weaver presenting a handwoven maroon and royal blue silk saree with gold zari border"
                  fill
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
                  <Icon className="h-3.5 w-3.5 text-golden-orange" />
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
