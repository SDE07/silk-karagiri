"use client";

import type { ComponentProps, ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, MessageCircle, ArrowRight, Clock } from "lucide-react";
import { FaCircleQuestion } from "react-icons/fa6";

export interface FaqItem {
  /** Used as the React key and the accordion value; falls back to `item-<index>`. */
  id?: string;
  question: ReactNode;
  answer: ReactNode;
  category?: string;
}

export interface FaqProps
  extends Omit<ComponentProps<"section">, "title" | "defaultValue"> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items?: FaqItem[];
  /** "split" puts the header on the left and the questions on the right on large screens. */
  layout?: "stacked" | "split";
  /** "single" keeps one answer open at a time; "multiple" lets several stay open. */
  type?: "single" | "multiple";
  /** Item value(s) open on first render: an item's `id`, or `item-<index>`. */
  defaultValue?: string | string[];
  /** Shown under the header, e.g. a link to contact. Pass `null` to hide. */
  footer?: ReactNode;
}

const DEFAULT_SAREE_FAQS: FaqItem[] = [
  {
    id: "silk-mark",
    category: "Certification",
    question: "Are all Silk Karagiri sarees Silk Mark certified?",
    answer:
      "Yes. Every single handloom pure silk saree from Silk Karagiri is certified with an authentic Silk Mark India tag, guaranteeing 100% natural, unadulterated mulberry, tussar, or katan silk fibers directly verified by the Central Silk Board.",
  },
  {
    id: "gold-zari",
    category: "Zari Purity",
    question: "What quality of zari is used in bridal Kanchipuram and Banarasi drapes?",
    answer:
      "Our heirloom bridal collection is handwoven with genuine metallic silver core threads electroplated with pure gold (tested 2G and 3G zari standards), ensuring brilliant luster, exquisite heirloom weight, and antique longevity without tarnishing.",
  },
  {
    id: "direct-weavers",
    category: "Artisan Looms",
    question: "How does Silk Karagiri connect patrons directly with master weavers?",
    answer:
      "We partner directly with verified handloom weaver cooperatives across Kanchipuram, Varanasi, Paithan, and Chanderi. By eliminating middlemen, we ensure fair master-artisan compensation and true loom-direct pricing.",
  },
  {
    id: "saree-care",
    category: "Preservation",
    question: "How should I care for and store my pure silk sarees at home?",
    answer:
      "We recommend professional dry cleaning only. Store your sarees wrapped in breathable unbleached pure cotton or muslin fabric, avoid direct sunlight and plastic bags, and air-unfold every 4-6 months to preserve yarn elasticity.",
  },
  {
    id: "blouse-finishing",
    category: "Tailoring",
    question: "Do the sarees include blouse fabric, fall, and edge tassels?",
    answer:
      "Each saree includes an authentic unstitched 80cm-1m running or contrast blouse piece. Hand-knotted pallu tassels (kuchu) and complimentary roll-press finishing can also be customized during checkout.",
  },
  {
    id: "shipping-returns",
    category: "Orders & Transit",
    question: "Do you offer insured worldwide shipping and domestic returns?",
    answer:
      "We provide fully insured express shipping across India (2-4 business days) and internationally to over 40+ countries. Domestic orders come with a seamless 7-day exchange and return policy.",
  },
];

const DEFAULT_SAREE_TITLE = (
  <>
    <span className="text-[#064e3b] dark:text-emerald-400">Authenticity & Care,</span>{" "}
    <span className="text-[#9f2d55] dark:text-rose-400">Frequently Asked Questions</span>
  </>
);

const DEFAULT_SAREE_EYEBROW = "Timeless Tradition • Care & Authenticity";

const DEFAULT_SAREE_DESCRIPTION =
  "Everything you need to know about certified silk purity, pure zari testing, heirloom preservation, and custom artisan finishing.";

/**
 * Frequently asked questions section:
 * Vertically centered left header with enhanced concierge card, trust seals, and numbered cards.
 */
export function Faq({
  className,
  eyebrow = DEFAULT_SAREE_EYEBROW,
  title = DEFAULT_SAREE_TITLE,
  description = DEFAULT_SAREE_DESCRIPTION,
  items = DEFAULT_SAREE_FAQS,
  layout = "split",
  type = "single",
  defaultValue = "silk-mark",
  footer,
  ...props
}: FaqProps) {
  const split = layout === "split";
  const hasHeader =
    eyebrow != null || title != null || description != null || footer != null;

  const entries = items.map((item, index) => {
    const num = String(index + 1).padStart(2, "0");
    return (
      <AccordionItem
        key={item.id ?? index}
        value={item.id ?? `item-${index}`}
        data-slot="faq-item"
        className="border border-golden-orange/20 rounded-xl px-4 sm:px-5 py-1.5 transition-all duration-300 hover:border-golden-orange/45 bg-white/70 dark:bg-zinc-900/50 shadow-2xs hover:shadow-xs mb-3.5 last:mb-0"
      >
        <AccordionTrigger
          data-slot="faq-question"
          className="text-left font-serif text-base sm:text-lg font-semibold text-[#1a120c] hover:text-[#064e3b] transition-colors py-3.5 gap-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#9f2d55]/80 shrink-0">
              {num}
            </span>
            <span>{item.question}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent
          data-slot="faq-answer"
          className="text-stone-600 dark:text-stone-300 font-body text-sm sm:text-[14.5px] leading-relaxed pb-3.5 pl-7 pr-2"
        >
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    );
  });

  const listClassName = cn(
    "w-full",
    !split && "mx-auto max-w-3xl",
    !split && hasHeader && "mt-10",
  );

  return (
    <section
      id="faq"
      data-slot="faq"
      data-layout={layout}
      className={cn(
        "w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-10 sm:py-16",
        className
      )}
      {...props}
    >
      <div
        data-slot="faq-container"
        className={cn(
          "mx-auto w-full max-w-7xl px-2 sm:px-4",
          split && "grid gap-10 lg:gap-14 xl:gap-16 lg:grid-cols-[1fr_1.45fr] lg:items-center",
        )}
      >
        {hasHeader ? (
          <div
            data-slot="faq-header"
            className={cn(
              "max-w-2xl space-y-4",
              split && "lg:self-center lg:py-4",
              !split && "mx-auto text-center"
            )}
          >
            {/* Eyebrow Badge with FAQ React Icon */}
            {eyebrow != null ? (
              <div className={cn("flex items-center gap-2", !split && "justify-center")}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b]/8 border border-[#064e3b]/20 text-[#064e3b] text-[11px] font-ui uppercase tracking-wider font-semibold">
                  <FaCircleQuestion className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span>{eyebrow}</span>
                </div>
              </div>
            ) : null}

            {/* Dual-Tone Headline */}
            {title != null ? (
              <h2
                data-slot="faq-title"
                className="font-heading-sub text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-tight tracking-tight"
              >
                {title}
              </h2>
            ) : null}

            {/* Description */}
            {description != null ? (
              <p
                data-slot="faq-description"
                className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-lg"
              >
                {description}
              </p>
            ) : null}

            {/* Enhanced Saree Concierge Card */}
            <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white/90 via-amber-50/40 to-white/70 border border-golden-orange/25 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#9f2d55]/10 flex items-center justify-center text-[#9f2d55] shrink-0">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-ink-black">
                    Personal Saree Concierge
                  </h4>
                  <p className="text-[11.5px] text-stone-500">
                    Need drape advice, blouse styling, or video-call viewing?
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#064e3b] text-white text-[11px] font-semibold tracking-wide uppercase hover:bg-[#064e3b]/90 transition-colors shadow-xs active:scale-95"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-300 bg-white/60 text-stone-700 hover:border-[#9f2d55] hover:text-[#9f2d55] text-[11px] font-medium transition-colors"
                >
                  <span>Book Video Call</span>
                </Link>
              </div>
            </div>

            {/* Trust Seals */}
            <div
              className={cn(
                "flex flex-wrap items-center gap-3 pt-2 text-[11px] text-stone-500",
                !split && "justify-center"
              )}
            >
              <span className="inline-flex items-center gap-1 font-medium text-stone-600">
                <ShieldCheck className="w-3.5 h-3.5 text-[#064e3b]" />
                Silk Mark India Certified
              </span>
              <span className="text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 font-medium text-stone-600">
                <Clock className="w-3.5 h-3.5 text-golden-orange" />
                Insured Express Delivery
              </span>
            </div>

            {/* Optional Custom Footer */}
            {footer ? (
              <div
                data-slot="faq-footer"
                className="pt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light"
              >
                {footer}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Right Side Accordion List */}
        {type === "multiple" ? (
          <Accordion
            type="multiple"
            data-slot="faq-list"
            className={listClassName}
            defaultValue={
              defaultValue === undefined
                ? undefined
                : Array.isArray(defaultValue)
                  ? defaultValue
                  : [defaultValue]
            }
          >
            {entries}
          </Accordion>
        ) : (
          <Accordion
            type="single"
            collapsible
            data-slot="faq-list"
            className={listClassName}
            defaultValue={
              Array.isArray(defaultValue) ? defaultValue[0] : defaultValue
            }
          >
            {entries}
          </Accordion>
        )}
      </div>
    </section>
  );
}

export { Faq as FaqAccordion };
export default Faq;
