import React from "react";
import type { Metadata } from "next";
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
    <div className="pb-24 pt-10 sm:pt-16">
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
        <p className="mx-auto max-w-xl font-body text-base sm:text-lg leading-relaxed text-ink-black-300/85">
          Looking for the perfect wedding saree, checking on an order, or planning something custom? Write to us —
          a real person from our team will help you choose.
        </p>
      </header>

      <div className="mx-auto mt-14 sm:mt-20 grid max-w-[1280px] grid-cols-1 gap-12 px-5 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16">
        {/* Left — channels + globe */}
        <aside className="lg:col-span-5 flex flex-col">
          <h2 className="font-heading-sub text-2xl sm:text-3xl text-ink-black">Get in touch</h2>
          <p className="mt-2 max-w-sm font-body text-[15px] leading-relaxed text-ink-black-300/80">
            Reach out on any channel below. {CONTACT_INFO.responseTime}
          </p>

          <ul className="mt-7 space-y-3">
            {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl p-2 -ml-2 transition-colors hover:bg-white/70"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#6b1426] shadow-xs ring-1 ring-stone-200/70 transition-colors group-hover:bg-[#9f2d55] group-hover:text-vanilla-custard">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{label}</span>
                    <span className="mt-1 block truncate font-body text-[16px] text-ink-black group-hover:text-[#9f2d55]">{value}</span>
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
        <section className="lg:col-span-7">
          <div className="rounded-3xl bg-white/85 p-6 sm:p-9 shadow-[0_30px_70px_-35px_rgba(107,20,38,0.35)] ring-1 ring-stone-200/60">
            <h2 className="font-heading-sub text-2xl text-ink-black">Send a message</h2>
            <p className="mt-1.5 mb-7 font-body text-[15px] text-ink-black-300/75">
              Fill in the form and we&apos;ll get back to you promptly.
            </p>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
