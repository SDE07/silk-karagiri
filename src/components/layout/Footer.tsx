"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-golden-orange/25">
      {/* Panoramic Scenic Background: footer.png */}
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/images/footer.png')" }}
      />

      {/* Subtle Warm Gradient Overlay (Whitish Cast Reduced to Let Scenic Artwork Glow) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbf7ed]/60 via-[#fbf7ed]/35 to-transparent pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-36 sm:pb-48 lg:pb-64">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start">
          
          {/* 1. Brand Identity Column */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
            <Link href="/" className="group inline-flex flex-col items-center lg:items-start">
              {/* Traditional Ornamental Lotus Motif in Logo Teal */}
              <div className="flex items-center gap-2 mb-1 text-golden-orange/80">
                <span className="h-px w-6 sm:w-8 bg-golden-orange/40" />
                <svg
                  className="w-6 h-6 text-[#004e5e] transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M12 3c-1.5 3-4 5-7 6 2 2 4 4 7 11 3-7 5-9 7-11-3-1-5.5-3-7-6z" />
                  <path d="M12 9c-1.5 2-3 3-5 4 1 2 2.5 3.5 5 7 2.5-3.5 4-5 5-7-2-1-3.5-2-5-4z" />
                </svg>
                <span className="h-px w-6 sm:w-8 bg-golden-orange/40" />
              </div>

              {/* Royal Wordmark in Official Logo Greenish-Bluish Peacock Teal */}
              <h3 className="font-heading-main text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-[0.06em] text-[#004e5e] uppercase transition-colors group-hover:text-[#002f38] leading-tight">
                SILK KARAGIRI
              </h3>
              <span className="font-ui text-[10px] uppercase tracking-[0.28em] text-golden-orange font-semibold mt-1">
                TIMELESS TRADITION • PURE SILK
              </span>
            </Link>


          </div>

          {/* Ornamental Divider */}
          <div className="hidden lg:flex lg:col-span-1 justify-center h-44">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-golden-orange/35 to-transparent relative flex items-center justify-center">
              <span className="text-[10px] text-golden-orange absolute bg-[#fbf7ed]/60 px-0.5">✦</span>
            </div>
          </div>

          {/* 2. Quick Links Section */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-4 sm:gap-6 text-left">
            {/* Column A: Shop */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-heading-sub text-lg sm:text-xl font-bold text-[#004e5e]">
                  Shop
                </h4>
                <span className="block h-[2px] w-6 bg-golden-orange/70 rounded-full" />
              </div>
              <ul className="space-y-2 font-body text-sm sm:text-[15px]">
                <li>
                  <Link
                    href="/products?tag=new"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=Sarees"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Silk Sarees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=Bridal"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Bridal Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?tag=bestseller"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Best Sellers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column B: Explore */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-heading-sub text-lg sm:text-xl font-bold text-[#004e5e]">
                  Explore
                </h4>
                <span className="block h-[2px] w-6 bg-golden-orange/70 rounded-full" />
              </div>
              <ul className="space-y-2 font-body text-sm sm:text-[15px]">
                <li>
                  <Link
                    href="/about"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#story"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Craftsmanship
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#weavers"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Weaving Centres
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#journal"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column C: Support */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="font-heading-sub text-lg sm:text-xl font-bold text-[#004e5e]">
                  Support
                </h4>
                <span className="block h-[2px] w-6 bg-golden-orange/70 rounded-full" />
              </div>
              <ul className="space-y-2 font-body text-sm sm:text-[15px]">
                <li>
                  <Link
                    href="/#contact"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#shipping"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Shipping &amp; Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#returns"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    Returns &amp; Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq"
                    className="text-ink-black/85 hover:text-[#004e5e] font-medium transition-colors leading-relaxed block hover:translate-x-0.5 transform duration-150"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Ornamental Divider */}
          <div className="hidden lg:flex lg:col-span-1 justify-center h-44">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-golden-orange/35 to-transparent relative flex items-center justify-center">
              <span className="text-[10px] text-golden-orange absolute bg-[#fbf7ed]/60 px-0.5">✦</span>
            </div>
          </div>

          {/* 3. Newsletter: Stay Inspired */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <div className="space-y-1">
              <h4 className="font-heading-sub text-lg sm:text-xl font-bold text-[#004e5e]">
                Stay Inspired
              </h4>
              <span className="block h-[2px] w-6 bg-golden-orange/70 rounded-full" />
            </div>

            <p className="font-body text-xs sm:text-sm text-ink-black/85 leading-relaxed font-medium">
              Receive exclusive bridal invitations, master weaver stories, and private vault drops.
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="flex items-center bg-white/95 backdrop-blur-xs rounded-full border border-golden-orange/40 p-1 shadow-sm hover:border-golden-orange/70 transition-colors focus-within:border-[#004e5e] focus-within:ring-2 focus-within:ring-[#004e5e]/15">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs font-body text-ink-black placeholder:text-ink-black/50 outline-none font-medium"
                  required
                />
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 rounded-full bg-[#004e5e] hover:bg-[#002f38] text-white font-ui text-xs font-semibold tracking-wider transition-all duration-300 shadow-xs hover:scale-102 cursor-pointer shrink-0"
                >
                  {subscribed ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined</span>
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
export default Footer;
