"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bookmark,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(2);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Eager prefetch all core routes on mount for instant zero-lag transitions
  useEffect(() => {
    NAV_LINKS.forEach((link) => {
      router.prefetch(link.href);
    });
  }, [router]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 80;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldBeSolid = !isHome || isScrolled;
  // Over the dark hero photo the bar is transparent, so its text and icons switch to light.
  const onHero = !shouldBeSolid;
  const fg = onHero ? "text-vanilla-custard" : "text-ink-black";
  const fgHover = onHero ? "hover:text-golden-orange" : "hover:text-dark-teal";
  const iconButton = cn(
    "relative p-2.5 rounded-md transition-all duration-100 cursor-pointer border border-transparent active:scale-95 hover:border-golden-orange/30",
    fg,
    onHero ? "hover:bg-white/10" : "hover:bg-vanilla-custard-800"
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full pointer-events-auto transition-[background-color,border-color,box-shadow] duration-200 ease-out",
        shouldBeSolid
          ? "border-b border-golden-orange/15 bg-vanilla-custard-900/95 backdrop-blur-md shadow-2xs"
          : "border-none border-b-0 bg-gradient-to-b from-black/40 via-transparent to-transparent shadow-none"
      )}
    >
      <div className="w-full px-6 sm:px-6 md:px-10 lg:px-12 xl:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Popover Menu Trigger */}
          <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn("group size-9 lg:hidden p-0 active:scale-95 transition-transform", fg, onHero ? "hover:bg-white/10" : "hover:bg-vanilla-custard-800")}
                variant="ghost"
                size="icon"
                aria-label="Toggle navigation menu"
              >
                <svg
                  className="pointer-events-none"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-80 p-5 bg-vanilla-custard-900 border border-golden-orange/20 shadow-xl lg:hidden space-y-5"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search pure silk drapes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-10 text-base sm:text-xs rounded-md border-0 bg-vanilla-custard-800/80 font-ui placeholder:text-ink-black-300/50 focus:bg-white focus-visible:ring-1 focus-visible:ring-dark-teal/40"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-teal"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Mobile Links */}
              <nav className="space-y-3 font-ui text-xs uppercase tracking-wider font-semibold">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        prefetch={true}
                        onClick={() => setMobileOpen(false)}
                        onPointerDown={() => router.prefetch(link.href)}
                        className={cn(
                          "block py-2.5 transition-all duration-75 active:scale-98 cursor-pointer select-none",
                          isActive
                            ? "text-dark-teal font-bold pl-2 border-l-2 border-dark-teal bg-golden-orange/10 rounded-r-md"
                            : "text-ink-black hover:text-dark-teal border-b border-golden-orange/15"
                        )}
                      >
                        {link.label}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-golden-orange/20 flex items-center justify-between text-xs font-ui">
                <span className="text-dark-teal-400 font-semibold">Wishlist Items</span>
                <span className="bg-brown-red text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              </div>
            </PopoverContent>
          </Popover>

          {/* Brand Logo */}
          <Link
            href="/"
            prefetch={true}
            onMouseEnter={() => router.prefetch("/")}
            onPointerDown={() => router.prefetch("/")}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 active:scale-98 transition-transform cursor-pointer"
          >
            <div className="relative h-14 sm:h-16 w-auto flex items-center justify-center shrink-0">
              <Image
                src="/images/logo.webp"
                alt={APP_CONFIG.name}
                width={180}
                height={180}
                priority
                unoptimized
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className={cn("font-heading-main text-lg sm:text-xl font-bold tracking-tight transition-colors leading-tight", fg, onHero ? "group-hover:text-golden-orange" : "group-hover:text-dark-teal")}>
                {APP_CONFIG.name}
              </span>
              <span className={cn("font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-semibold", onHero ? "text-golden-orange" : "text-dark-teal-400")}>
                Pure Heritage Silks
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation with Zero-Lag Instant Click & Eager Prefetch */}
        <nav className="hidden lg:flex items-center justify-center flex-1 mx-6 xl:mx-10" aria-label="Main Navigation">
          <div className="flex flex-row flex-nowrap items-center justify-center gap-6 lg:gap-8 xl:gap-9 whitespace-nowrap">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  onMouseEnter={() => router.prefetch(link.href)}
                  onPointerDown={() => router.prefetch(link.href)}
                  className={cn(
                    "relative inline-flex flex-col items-center justify-center h-10 px-3 font-ui text-xs uppercase tracking-widest outline-none border-none leading-none cursor-pointer select-none transition-all duration-100 active:scale-95",
                    isActive
                      ? onHero
                        ? "text-golden-orange font-bold drop-shadow-xs"
                        : "text-dark-teal font-bold drop-shadow-xs"
                      : cn(fg, fgHover, "font-semibold")
                  )}
                >
                  <span className="py-1">{link.label}</span>
                  {isActive && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 w-5 h-0.5 rounded-full transition-all duration-300",
                        onHero ? "bg-golden-orange shadow-xs" : "bg-dark-teal shadow-xs"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Side: Search Bar, Wishlist, Cart Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Desktop Search Bar: Rectangular with subtle rounded border radius */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-52 lg:w-64"
          >
            <Input
              type="text"
              placeholder="Search pure silk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pr-9 pl-3.5 text-xs rounded-md border-0 bg-vanilla-custard-800/80 hover:bg-vanilla-custard-800 focus:bg-white font-ui text-ink-black placeholder:text-ink-black-300/50 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-teal/40 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 text-dark-teal hover:text-ink-black transition-colors cursor-pointer"
              aria-label="Submit Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Wishlist Button: Elegant Bookmark Icon */}
          <button
            onClick={() => setWishlistCount((prev) => prev + 1)}
            className={iconButton}
            aria-label="Wishlist"
            title="Saved Silk Creations"
          >
            <Bookmark className={cn("w-5 h-5 transition-colors", fgHover)} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-golden-orange text-ink-black rounded-full font-ui text-[9px] font-bold flex items-center justify-center shadow-xs border border-vanilla-custard-900">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={openCart}
            className={iconButton}
            aria-label="Open Shopping Bag"
            title="Open Shopping Bag"
          >
            <ShoppingBag className={cn("w-5 h-5 transition-colors", fgHover)} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brown-red text-vanilla-custard-900 rounded-full font-ui text-[9px] font-bold flex items-center justify-center shadow-md animate-in zoom-in border border-vanilla-custard-900">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
