import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SilkCurtainIntro } from "@/components/common/SilkCurtainIntro";
import { APP_CONFIG } from "@/lib/constants";
import {
  Cormorant_Garamond,
  Marcellus,
  EB_Garamond,
  Montserrat,
} from "next/font/google";
import { cn } from "@/lib/utils";

// 1. Main Headings (H1, H2 / Hero): Cormorant Garamond
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading-main",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// 2. Sub-headings (H3, H4 / Product Titles): Marcellus
const marcellus = Marcellus({
  subsets: ["latin"],
  variable: "--font-heading-sub",
  display: "swap",
  weight: "400",
});

// 3. Body / Paragraphs (Fabric, Story, Care): EB Garamond
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// 4. Prices, Buttons & Navigation (UI): Montserrat
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  description:
    "Exquisite handwoven pure mulberry silks, authentic Kanjivaram and Banarasi weaves certified by Silk Mark.",
  icons: {
    icon: [
      { url: "/images/logo.webp" },
      { url: "/favicon.ico" },
    ],
    apple: "/images/logo.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        cormorant.variable,
        marcellus.variable,
        ebGaramond.variable,
        montserrat.variable
      )}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-vanilla-custard-900 text-ink-black-300 font-body antialiased selection:bg-golden-orange/20 selection:text-ink-black"
      >
        <CartProvider>
          {/* Silk Curtain Intro — fires on every page load */}
          <SilkCurtainIntro />
          {/* Announcement Bar: Smart Rotating Carousel */}
          <AnnouncementBar />
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
