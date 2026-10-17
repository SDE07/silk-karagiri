"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { ChevronLeft, ChevronRight, Tag, Ruler, Users, Info, ShieldCheck, Sparkles } from "lucide-react";
import { GlassFolder, type FolderFile } from "@/components/ui/glass-folder";
import { SAREE_COLLECTIONS, collectionImage, collectionLooks, collectionDrape } from "@/data/collections.data";
import { ProductDetailPage, type Product as DetailProduct, type BreadcrumbItem, type ProductTag } from "@/components/ui/product-detail-page";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { cn } from "@/lib/utils";

// TypeScript definition for <model-viewer>
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "interaction" | "manual";
          "auto-rotate"?: boolean | string;
          "auto-rotate-delay"?: number | string;
          "rotation-per-second"?: string;
          "camera-controls"?: boolean | string;
          "touch-action"?: string;
          "shadow-intensity"?: string | number;
          "shadow-softness"?: string | number;
          exposure?: string | number;
          "environment-image"?: string;
          "camera-orbit"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "field-of-view"?: string;
          "interaction-prompt"?: string;
          bounds?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

const ART_LIST: Array<"aurora" | "ember" | "dusk" | "verdant" | "glacier"> = [
  "ember",
  "dusk",
  "verdant",
  "aurora",
  "glacier",
  "ember",
  "dusk",
  "aurora",
  "verdant",
  "ember",
  "glacier",
];

const COLLECTION_2LINE_TITLES: Record<string, [string, string]> = {
  "double-warp-soft-silk": ["Double Warp Soft Silk", "Saree"],
  "pure-handloom-double-warp": ["Pure Handloom Double", "Warp Soft Silk"],
  "double-warp-gaja-butta": ["Pure Handloom Double", "Warp — Gaja Butta"],
  "pure-handloom-soft-silk": ["Pure Handloom Soft Silk", "Saree"],
  "rangoli-fresh": ["Rangoli Fresh", "Collection"],
  "small-bhutta-soft-silk": ["Exclusive Small Bhutta", "Soft Silk"],
  "bridal-soft-silk": ["Handloom Exclusive", "Bridal Soft Silk"],
  "pure-handloom-border": ["Pure Handloom", "Border Silk"],
  "kanchipuram-soft-silk": ["Kanchipuram Pure", "Handloom Soft Silk"],
  "banaras-khaddi-chiffon": ["Banaras Khaddi", "Chiffon"],
  "chanderi-semi-katan": ["Chanderi Semi", "Katan Silk"],
  "banaras-kora-organza": ["Banaras Kora", "Organza Silk"],
};

const COLLECTION_PRICES: Record<string, { price: number; originalPrice: number }> = {
  "double-warp-soft-silk": { price: 28500, originalPrice: 34000 },
  "pure-handloom-double-warp": { price: 32000, originalPrice: 38000 },
  "double-warp-gaja-butta": { price: 29800, originalPrice: 35000 },
  "pure-handloom-soft-silk": { price: 24500, originalPrice: 29000 },
  "rangoli-fresh": { price: 22000, originalPrice: 26500 },
  "small-bhutta-soft-silk": { price: 27500, originalPrice: 33000 },
  "bridal-soft-silk": { price: 38500, originalPrice: 45000 },
  "pure-handloom-border": { price: 31000, originalPrice: 36500 },
  "kanchipuram-soft-silk": { price: 35000, originalPrice: 42000 },
  "banaras-khaddi-chiffon": { price: 19500, originalPrice: 23500 },
  "chanderi-semi-katan": { price: 18000, originalPrice: 22000 },
  "banaras-kora-organza": { price: 21500, originalPrice: 26000 },
};

export function ProductHero3DSection() {
  const [modelReady, setModelReady] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("double-warp-soft-silk");
  const [activeLookIndex, setActiveLookIndex] = useState<number>(0);
  const [cameraOrbit, setCameraOrbit] = useState<string>("0deg 75deg 105%");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [folderWidth, setFolderWidth] = useState<number>(175);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const foldersScrollRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { products } = useAdmin();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        // On mobile view, size folder so 1 folder is seen properly without cut-off
        const idealWidth = Math.min(285, Math.max(250, window.innerWidth - 64));
        setFolderWidth(idealWidth);
      } else {
        setFolderWidth(175);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Import @google/model-viewer dynamically on the client
    import("@google/model-viewer")
      .then(() => {
        // model-viewer custom element registered
      })
      .catch((err) => {
        console.warn("Could not load @google/model-viewer module:", err);
      });
  }, []);

  useEffect(() => {
    const viewer = modelViewerRef.current as any;
    if (!viewer) return;

    const onLoaded = () => {
      setModelReady(true);
    };

    if (viewer.loaded) {
      setModelReady(true);
    } else {
      viewer.addEventListener("load", onLoaded);
      viewer.addEventListener("poster-dismissed", onLoaded);
    }

    const timer = setTimeout(() => {
      setModelReady(true);
    }, 700);

    return () => {
      viewer.removeEventListener("load", onLoaded);
      viewer.removeEventListener("poster-dismissed", onLoaded);
      clearTimeout(timer);
    };
  }, []);

  // Smooth mouse-wheel horizontal scroll & mouse drag for the folders strip
  useEffect(() => {
    const el = foldersScrollRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const atEnd = el.scrollLeft >= maxScroll - 6;
        const atStart = el.scrollLeft <= 6;

        // Scrolling downwards: slide right until end, then naturally release and let the page scroll down!
        if (e.deltaY > 0 && !atEnd) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
        // Scrolling upwards: slide left until start, then naturally release and let the page scroll up!
        else if (e.deltaY < 0 && !atStart) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
    };

    const onMouseUp = () => {
      isDown = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.4;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || !foldersScrollRef.current) return;
    const activeEl = foldersScrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedSlug, isMobile]);

  // Dynamic camera perspective switching tailored when saree variety look or collection changes
  useEffect(() => {
    const lookAngles = [
      "0deg 75deg 105%",   // Look 1: Direct Front drape
      "35deg 78deg 100%",  // Look 2: Elegant 3/4 Pallu perspective
      "70deg 75deg 105%",  // Look 3: Profile zari border
      "-40deg 78deg 100%", // Look 4: Reverse pleat detail
      "180deg 75deg 105%", // Look 5: Full rear cascade
      "-70deg 75deg 105%", // Look 6: Left diagonal drape
    ];
    const targetAngle = lookAngles[activeLookIndex % lookAngles.length];
    setCameraOrbit(targetAngle);
    const viewer = modelViewerRef.current as any;
    if (viewer) {
      try {
        viewer.cameraOrbit = targetAngle;
        if (typeof viewer.jumpCameraToGoal === "function") {
          viewer.jumpCameraToGoal();
        }
      } catch {}
    }
  }, [activeLookIndex, selectedSlug]);

  const scrollFolders = (direction: "left" | "right") => {
    if (!foldersScrollRef.current) return;
    const step = isMobile ? folderWidth + 16 : 220;
    const offset = direction === "left" ? -step : step;
    foldersScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const activeCollection =
    SAREE_COLLECTIONS.find((c) => c.slug === selectedSlug) || SAREE_COLLECTIONS[0];
  const activeLooks = collectionLooks(activeCollection);
  const activeImages = activeLooks.map((n) => collectionImage(activeCollection, n));
  const activeDrapes = activeLooks.map((n) => collectionDrape(activeCollection, n));
  const pricing = COLLECTION_PRICES[activeCollection.slug] || { price: 28500, originalPrice: 34000 };

  // Match live product from Admin Panel (AdminContext)
  const adminProduct = products.find(
    (p) => p.collectionSlug === activeCollection.slug || p.slug === activeCollection.slug
  );
  const effectivePrice = adminProduct?.price ?? pricing.price;
  const effectiveOriginalPrice = adminProduct?.originalPrice ?? pricing.originalPrice;
  const effectiveInStock =
    adminProduct !== undefined
      ? adminProduct.inStock && (adminProduct.stockQuantity ?? 1) > 0
      : true;
  const effectiveStockQuantity = adminProduct?.stockQuantity;

  const detailProduct: DetailProduct = {
    name: activeCollection.name,
    subtitle: activeCollection.tagline,
    price: effectivePrice,
    originalPrice: effectiveOriginalPrice,
    currency: "₹",
    images: activeImages,
    description: activeCollection.story,
    fabric: activeCollection.fabric,
    motif: activeCollection.motif,
    border: activeCollection.border,
    sku: `SK-${activeCollection.slug.toUpperCase().slice(0, 8)}-${String(activeLooks[activeLookIndex] || activeCollection.cover).padStart(2, "0")}`,
    inStock: effectiveInStock,
    stockQuantity: effectiveStockQuantity,
    tags: [
      { label: activeCollection.fabric, icon: Tag },
      { label: "Silk Mark Certified", icon: ShieldCheck },
      { label: activeCollection.motif, icon: Sparkles },
      { label: activeCollection.border, icon: Ruler },
      { label: "100% Pure Zari", icon: Info },
      { label: "Handloom Heirloom", icon: Users },
    ],
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Sarees", href: "/products?category=Sarees" },
    { label: activeCollection.name, href: "#saree-showcase" },
  ];

  return (
    <section className="relative w-full border-b border-[#b8862b]/20 pb-6 sm:pb-8">
      {/* Script fallback in case client bundle needs it */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="lazyOnload"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-3 gap-x-4 lg:gap-x-6 xl:gap-x-8 items-center lg:items-start">
        {/* 1. HEADER ROW: Page Title & Logo — Top on mobile (order-1), top-right on desktop */}
        <div className="lg:col-span-10 xl:col-span-10 lg:col-start-3 space-y-2 text-center lg:text-left order-1 lg:order-2 lg:pt-1">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-1 text-center sm:text-left">
              {/* Eyebrow */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <span className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#b8862b]" />
                <span className="font-ui text-xs sm:text-[13px] font-semibold uppercase tracking-[0.3em] text-[#7a5a2e]">
                  The Royal Silk Vault
                </span>
                <span className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#b8862b] sm:hidden" />
              </div>

              {/* Main Heading */}
              <h1 className="font-heading-main text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#6b1426] tracking-tight leading-[1.06]">
                Explore Our Products
              </h1>
              <p className="font-heading-sub italic text-base sm:text-lg text-[#004e5e]">
                Timeless Handwoven Drapes from India’s Master Looms
              </p>
            </div>

            {/* Silk Karagiri Royal Brand Crest & Logo on Right Side - Clean Borderless */}
            <div className="flex items-center gap-3 shrink-0 self-center sm:self-start select-none">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo.webp"
                  alt="Silk Karagiri Royal Heritage Logo"
                  width={56}
                  height={56}
                  priority
                  unoptimized
                  className="h-full w-full object-contain filter drop-shadow-2xs"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading-main text-base sm:text-lg font-bold text-[#6b1426] tracking-tight leading-tight">
                  Silk Karagiri
                </span>
                <span className="font-ui text-[9px] uppercase tracking-[0.25em] font-semibold text-[#7a5a2e]">
                  Pure Heritage Silks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 3D MODEL: Left column on desktop (lg:order-1), UPPER above folders on mobile (order-2) — ONLY THE MODEL */}
        <div className="lg:col-span-2 xl:col-span-2 lg:col-start-1 lg:row-start-1 lg:row-span-2 flex justify-center lg:justify-start order-2 lg:order-1 py-1">
          <div className="relative w-full max-w-[130px] sm:max-w-[160px] lg:max-w-[170px] h-[230px] sm:h-[280px] lg:h-[330px] flex items-center justify-center">
            {/* Fallback & Loading Skeleton with smooth fade out */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 transition-opacity duration-500",
                modelReady ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
            >
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 rounded-full border-2 border-[#b8862b]/20" />
                <div className="absolute inset-0 rounded-full border-2 border-[#b8862b] border-t-transparent animate-spin" />
              </div>
            </div>

            {/* The 3D GLB Model Viewer — Clean, Pure, Floating Model on Canvas */}
            {/* @ts-expect-error - model-viewer is loaded via client script & npm */}
            <model-viewer
              ref={modelViewerRef}
              src="/4923c6d767f84055868c456a8f4c267b.glb"
              poster={activeDrapes[activeLookIndex] || activeImages[activeLookIndex]}
              alt={`3D Drape of ${activeCollection.name}`}
              auto-rotate=""
              auto-rotate-delay="0"
              rotation-per-second="24deg"
              camera-controls=""
              touch-action="pan-y"
              shadow-intensity="1.2"
              shadow-softness="0.8"
              exposure="1.08"
              camera-orbit={cameraOrbit}
              interaction-prompt="none"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                outline: "none",
                cursor: "grab",
              }}
            />
          </div>
        </div>

        {/* 3. 12 GLASS FOLDERS: DOWNSIDE below 3D model on mobile (order-3), bottom-right on desktop */}
        <div className="lg:col-span-10 xl:col-span-10 lg:col-start-3 lg:row-start-2 pt-1 sm:pt-2 order-3 lg:order-3">
          <div className="flex items-center justify-between pb-1.5 px-1">
            <span className="font-ui text-[10.5px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#7a5a2e]">
              <span className="inline sm:hidden">{SAREE_COLLECTIONS.length} Master Archives • Swipe to explore</span>
              <span className="hidden sm:inline">{SAREE_COLLECTIONS.length} Master Archives • Click any folder to explore its saree colours below</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollFolders("left")}
                aria-label="Previous folder"
                className="p-1 rounded-full bg-vanilla-custard-800/80 hover:bg-vanilla-custard-800 text-[#6b1426] border border-[#b8862b]/30 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollFolders("right")}
                aria-label="Next folder"
                className="p-1 rounded-full bg-vanilla-custard-800/80 hover:bg-vanilla-custard-800 text-[#6b1426] border border-[#b8862b]/30 shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Strip of Glass Folders: 1 full folder visible cleanly on mobile, multiple on desktop */}
          <div
            ref={foldersScrollRef}
            className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 px-4 sm:px-1 sm:scroll-smooth cursor-grab active:cursor-grabbing select-none touch-pan-x [-webkit-overflow-scrolling:touch] overscroll-x-contain snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_4%,black_94%,transparent_100%)] sm:[mask-image:linear-gradient(to_right,black_94%,transparent_100%)]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {SAREE_COLLECTIONS.map((col, idx) => {
              const looks = collectionLooks(col);
              const files: FolderFile[] = looks.slice(0, 4).map((lookNum, fileIdx) => ({
                name: `Look ${fileIdx + 1}`,
                meta: col.fabric,
                image: collectionImage(col, lookNum),
                href: `/products?category=Sarees`,
              }));

              const artPreset = ART_LIST[idx % ART_LIST.length];
              const titlePair = COLLECTION_2LINE_TITLES[col.slug];
              const labelContent = titlePair ? (
                <>
                  <span>{titlePair[0]}</span>
                  <span>{titlePair[1]}</span>
                </>
              ) : (
                col.name
              );

              const isFolderActive = selectedSlug === col.slug;

              return (
                <div
                  key={col.slug}
                  data-active={isFolderActive ? "true" : undefined}
                  className="snap-center sm:snap-start shrink-0 flex flex-col items-center"
                  style={{ width: folderWidth }}
                >
                  <GlassFolder
                    width={folderWidth}
                    label={labelContent}
                    meta={`${col.count} Looks`}
                    tone="light"
                    art={artPreset}
                    image={collectionImage(col, col.cover)}
                    files={files}
                    action="none"
                    active={isFolderActive}
                    onClick={() => {
                      setSelectedSlug(col.slug);
                      setActiveLookIndex(0);
                      setTimeout(() => {
                        showcaseRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                      }, 80);
                    }}
                    appear={true}
                    appearDelay={idx * 35}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SELECTED COLLECTION SAREE COLOURWAYS SHOWCASE (ProductDetailPage with Vertical Thumbnails) */}
      <div ref={showcaseRef} className="pt-8 sm:pt-10 scroll-mt-6" id="saree-showcase">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 px-1 border-b border-[#b8862b]/20 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6b1426] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6b1426]" />
            </span>
            <span className="font-ui text-xs sm:text-sm uppercase tracking-widest text-[#6b1426] font-bold">
              Collection Spotlight • {activeCollection.name}
            </span>
          </div>
          <span className="font-ui text-xs font-semibold text-[#7a5a2e] bg-[#b8862b]/15 px-3 py-1 rounded-full border border-[#b8862b]/30">
            {activeLooks.length} Handcrafted Colourways
          </span>
        </div>

        <ProductDetailPage
          product={detailProduct}
          drapes={activeDrapes}
          breadcrumbs={breadcrumbs}
          currentImageIndex={activeLookIndex}
          onImageChange={(idx) => setActiveLookIndex(idx)}
          onAddToCart={(prod, qty, lookIdx) => {
            const lookNum = activeLooks[lookIdx] || activeCollection.cover;
            const lookSku = `SK-${activeCollection.slug.toUpperCase().slice(0, 8)}-${String(lookNum).padStart(2, "0")}`;
            for (let i = 0; i < qty; i++) {
              addItem({
                id: `${activeCollection.slug}-look-${lookNum}`,
                name: `${activeCollection.name} (Look ${lookIdx + 1})`,
                slug: activeCollection.slug,
                description: activeCollection.story,
                story: activeCollection.story,
                fabric: activeCollection.fabric,
                motif: activeCollection.motif,
                border: activeCollection.border,
                price: effectivePrice,
                originalPrice: effectiveOriginalPrice,
                category: "Sarees",
                inStock: effectiveInStock,
                image: collectionImage(activeCollection, lookNum),
                images: activeImages,
                badge: activeCollection.badge || "Heritage",
                rating: 4.9,
                reviewCount: 38,
                tags: [activeCollection.fabric, activeCollection.motif, activeCollection.border],
                sku: lookSku,
                collectionSlug: activeCollection.slug,
              });
            }
          }}
          onBuyNow={(prod, qty, lookIdx) => {
            const lookNum = activeLooks[lookIdx] || activeCollection.cover;
            const lookSku = `SK-${activeCollection.slug.toUpperCase().slice(0, 8)}-${String(lookNum).padStart(2, "0")}`;
            for (let i = 0; i < qty; i++) {
              addItem({
                id: `${activeCollection.slug}-look-${lookNum}`,
                name: `${activeCollection.name} (Look ${lookIdx + 1})`,
                slug: activeCollection.slug,
                description: activeCollection.story,
                story: activeCollection.story,
                fabric: activeCollection.fabric,
                motif: activeCollection.motif,
                border: activeCollection.border,
                price: effectivePrice,
                originalPrice: effectiveOriginalPrice,
                category: "Sarees",
                inStock: effectiveInStock,
                image: collectionImage(activeCollection, lookNum),
                images: activeImages,
                badge: activeCollection.badge || "Heritage",
                rating: 4.9,
                reviewCount: 38,
                tags: [activeCollection.fabric, activeCollection.motif, activeCollection.border],
                sku: lookSku,
                collectionSlug: activeCollection.slug,
              });
            }
          }}
        />
      </div>
    </section>
  );
}

export default ProductHero3DSection;
