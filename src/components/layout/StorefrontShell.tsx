"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SilkCurtainIntro } from "@/components/common/SilkCurtainIntro";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FindHeirloomCta } from "@/components/common/FindHeirloomCta";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Silk Curtain Intro — fires on storefront page loads */}
      <SilkCurtainIntro />
      {/* Announcement Bar: Smart Rotating Carousel */}
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <FindHeirloomCta />
      <Footer />
    </>
  );
}
