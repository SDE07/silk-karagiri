import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { RotatingGlobe } from "@/components/ui/rotating-globe";
import { APP_CONFIG, CONTACT_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact Us — ${APP_CONFIG.name}`,
  description:
    "Get in touch with Silk Karagiri for saree enquiries, bridal and custom orders, delivery questions and overseas orders.",
};

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT_INFO.phoneDisplay,
    href: `https://wa.me/${CONTACT_INFO.whatsapp}`,
    external: true,
  },
  { icon: Phone, label: "Call us", value: CONTACT_INFO.phoneDisplay, href: CONTACT_INFO.phoneHref, external: false },
  { icon: Mail, label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}`, external: false },
];

export default function ContactPage() {
  return (
    <div className="pb-24 pt-4 sm:pt-6">
      {/* Heading */}
      <header className="mx-auto max-w-3xl px-5 text-center space-y-5">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-golden-orange" />
          <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] text-dark-teal">
            We&apos;re here to help
          </span>
          <span className="h-px w-10 bg-golden-orange" />
        </div>
        <h1 className="font-heading-sub text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          <span className="text-[#064e3b]">Contact</span> <span className="text-[#9f2d55]">Us</span>
        </h1>
      </header>

      <div className="mx-auto mt-10 sm:mt-12 grid max-w-[1280px] grid-cols-1 gap-12 px-5 sm:px-10 lg:grid-cols-2 lg:gap-14 lg:px-16">
        {/* Left — channels + globe */}
        <aside className="flex min-w-0 flex-col">
          <h2 className="font-heading-sub text-2xl sm:text-3xl text-ink-black">Get in touch</h2>
          <p className="mt-2 max-w-sm font-body text-[15px] leading-relaxed text-ink-black-300/80">
            Reach out on any channel below. {CONTACT_INFO.responseTime}
          </p>

          {/* One row where there's room (tablet, wide desktop); a stacked list in narrower columns. */}
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1.3fr] lg:grid-cols-1 xl:grid-cols-[1fr_1fr_1.3fr]">
            {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label} className="min-w-0">
                <a
                  href={href}
                  title={value}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-center gap-4 rounded-2xl bg-white/60 p-3.5 ring-1 ring-stone-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_30px_-18px_rgba(107,20,38,0.4)] sm:flex-col sm:items-start sm:gap-3 sm:p-4 lg:flex-row lg:items-center lg:gap-4 lg:p-3.5 xl:flex-col xl:items-start xl:gap-3 xl:p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6b1426] shadow-xs ring-1 ring-stone-200/70 transition-colors group-hover:bg-[#9f2d55] group-hover:text-vanilla-custard">
                    <Icon className="h-[17px] w-[17px]" />
                  </span>
                  <span className="min-w-0 w-full leading-tight">
                    <span className="block font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{label}</span>
                    <span className="mt-1 block truncate whitespace-nowrap font-body text-[16px] text-ink-black transition-colors group-hover:text-[#9f2d55]">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Globe — top half shown, fading into the page */}
          <div className="relative mt-10 h-[230px] sm:h-[270px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
            <div className="mx-auto w-full max-w-[460px]">
              <RotatingGlobe />
            </div>
          </div>
          <p className="-mt-2 text-center font-ui text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">
            <span className="text-golden-orange-400">●</span> Delivering across India · worldwide soon
          </p>
        </aside>

        {/* Right — form */}
        <section className="min-w-0">
          <div className="relative overflow-hidden rounded-3xl bg-white/85 p-6 sm:p-9 shadow-[0_30px_70px_-35px_rgba(107,20,38,0.35)] ring-1 ring-stone-200/60">
            {/* Gold zari edge + faint brand watermark */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-golden-orange to-transparent" />
            <Image
              src="/images/logo.webp"
              alt=""
              aria-hidden
              width={320}
              height={320}
              className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 object-contain opacity-[0.05]"
            />

            <div className="relative">
              {/* Brand header */}
              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-golden-orange/20">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-vanilla-custard-900 ring-1 ring-golden-orange/30 shadow-xs">
                  <Image src="/images/logo.webp" alt={APP_CONFIG.name} width={96} height={96} className="h-11 w-11 object-contain" />
                </span>
                <span className="leading-tight">
                  <span className="block font-heading-main text-lg font-bold tracking-tight text-ink-black">{APP_CONFIG.name}</span>
                  <span className="block font-ui text-[9px] font-semibold uppercase tracking-[0.25em] text-dark-teal-400">Pure Heritage Silks</span>
                </span>
              </div>

              <h2 className="font-heading-sub text-2xl sm:text-[28px] text-ink-black">Send a message</h2>
              <p className="mt-1.5 mb-7 font-body text-[15px] text-ink-black-300/75">
                Fill in the form and we&apos;ll get back to you promptly.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
