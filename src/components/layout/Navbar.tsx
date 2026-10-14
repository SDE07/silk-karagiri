"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bookmark,
  ShoppingBag,
  Crown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(2);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Transitions to earlier solid background when scrolling past the hero banner into the next section
      setIsScrolled(window.scrollY > 80);
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
  const navLink = cn(
    "inline-flex items-center justify-center h-9 px-2 font-ui text-xs font-semibold uppercase tracking-widest transition-colors outline-none border-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0 leading-none cursor-pointer",
    fg,
    fgHover
  );
  const iconButton = cn(
    "relative p-2.5 rounded-md transition-colors cursor-pointer border border-transparent hover:border-golden-orange/30",
    fg,
    onHero ? "hover:bg-white/10" : "hover:bg-vanilla-custard-800"
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const productSubmenuItems = [
    {
      title: "Kanjivaram & Banarasi Sarees",
      href: "/products?category=Sarees",
      description: "GI-tagged handwoven pure mulberry silks with 3-ply twisted gold zari.",
      badge: "Bridal & Heritage",
    },
    {
      title: "Mulberry Silk Scarves & Stoles",
      href: "/products?category=Scarves",
      description: "Feather-light 100% grade 6A hand-painted and twill creations.",
      badge: "Trending",
    },
    {
      title: "Raw & Chanderi Brocade Fabrics",
      href: "/products?category=Fabrics",
      description: "Textured sheer elegance sold per meter for bespoke regal tailoring.",
      badge: "Artisan Weave",
    },
    {
      title: "Royal Tailored Apparel",
      href: "/products?category=Apparel",
      description: "Contemporary silhouettes in pure emerald and ruby raw silks.",
      badge: "Exclusive",
    },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500 ease-in-out",
        shouldBeSolid
          ? "border-b border-golden-orange/15 bg-vanilla-custard-900/95 backdrop-blur-md shadow-2xs"
          : "border-b border-transparent bg-gradient-to-b from-black/55 via-black/25 to-transparent shadow-none"
      )}
    >
      <div className="w-full px-6 sm:px-6 md:px-10 lg:px-12 xl:px-12 h-20 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu + Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Popover Menu Trigger (Animated Icon from navigation-menu-4) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn("group size-9 lg:hidden p-0", fg, onHero ? "hover:bg-white/10" : "hover:bg-vanilla-custard-800")}
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
                <div>
                  <Link
                    href="/"
                    className="block py-2 text-ink-black hover:text-dark-teal border-b border-golden-orange/15"
                  >
                    Home
                  </Link>
                </div>
                <div className="space-y-1">
                  <span className="block pt-2 text-[10px] text-dark-teal-400 font-bold uppercase tracking-widest">
                    Collections
                  </span>
                  {productSubmenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-1.5 pl-2 text-ink-black/80 hover:text-dark-teal text-xs"
                    >
                      • {item.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <Link
                    href="/products"
                    className="block py-2 text-ink-black hover:text-dark-teal border-b border-golden-orange/15"
                  >
                    All Vault Products
                  </Link>
                </div>
                <div>
                  <Link
                    href="/about"
                    className="block py-2 text-ink-black hover:text-dark-teal border-b border-golden-orange/15"
                  >
                    About Heritage
                  </Link>
                </div>
                <div>
                  <Link
                    href="/contact"
                    className="block py-2 text-ink-black hover:text-dark-teal"
                  >
                    Artisan &amp; Contact
                  </Link>
                </div>
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
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative h-14 sm:h-16 w-auto flex items-center justify-center shrink-0">
              <Image
                src="/images/logo.webp"
                alt={APP_CONFIG.name}
                width={180}
                height={180}
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className={cn("font-heading-main text-lg sm:text-xl font-bold tracking-tight transition-colors leading-tight", fg, onHero ? "group-hover:text-golden-orange" : "group-hover:text-dark-teal")}>
                {APP_CONFIG.name}
              </span>
              <span className="font-ui text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-dark-teal-400 font-semibold">
                Pure Heritage Silks
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop NavigationMenu with Mega Dropdown */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-6 xl:mx-10">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row flex-nowrap items-center justify-center gap-7 lg:gap-8 xl:gap-9 whitespace-nowrap list-none">
              {/* Home Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className={navLink}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Products Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(navLink, "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent")}>
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[620px] grid-cols-2 gap-3 p-5 bg-vanilla-custard-900 border border-golden-orange/25 rounded-xl shadow-xl">
                    {/* Left featured box */}
                    <div className="p-4 rounded-lg bg-gradient-to-br from-vanilla-custard-800 to-vanilla-custard-800/50 border border-golden-orange/25 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-ui uppercase font-bold tracking-widest bg-brown-red text-white">
                          <Crown className="w-3 h-3" /> Royal Curation
                        </span>
                        <h4 className="font-heading-main text-xl font-bold text-ink-black">
                          The Heritage Saree Vault
                        </h4>
                        <p className="font-body text-xs text-ink-black-300 leading-relaxed">
                          Hand-spun pure zari woven across authentic Kanchipuram and Varanasi loom guilds.
                        </p>
                      </div>
                      <Link
                        href="/products"
                        className="mt-4 font-ui text-[11px] font-bold uppercase tracking-wider text-dark-teal hover:text-ink-black inline-flex items-center gap-1"
                      >
                        Explore Vault Collection →
                      </Link>
                    </div>

                    {/* Right categories list */}
                    <div className="space-y-2">
                      {productSubmenuItems.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="block select-none rounded-lg p-2.5 transition-colors hover:bg-vanilla-custard-800 border border-transparent hover:border-golden-orange/20"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-heading-sub text-sm font-bold text-ink-black">
                                {item.title}
                              </span>
                              <span className="text-[9px] font-ui uppercase tracking-wider text-golden-orange-400 font-semibold">
                                {item.badge}
                              </span>
                            </div>
                            <p className="font-body text-xs text-ink-black-300 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* About Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/about"
                    className={navLink}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Contact Link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contact"
                    className={navLink}
                  >
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>

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
