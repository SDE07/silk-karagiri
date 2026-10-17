"use client";

import * as React from "react";
import {
  ChevronRight,
  Star,
  Tag,
  Ruler,
  Info,
  Heart,
  Bookmark,
  Share2,
  ShoppingCart,
  ShoppingBag,
  Check,
  ShieldCheck,
  MessageCircle,
  Plus,
  Minus,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  PenLine,
  CheckCircle2,
  X,
  User,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DrapeStage } from "@/components/home/DrapeStage";

// TypeScript interfaces for component props
export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    name: "Priyanka Sharma",
    location: "Mumbai",
    rating: 5,
    date: "3 days ago",
    title: "Breathtaking handloom artistry",
    comment:
      "The Banarasi kora organza holds its pleats crisply while feeling featherlight. Wore this for my sister's sangeet and received endless compliments on the authentic zari sheen.",
    verified: true,
    helpfulCount: 28,
  },
  {
    id: "rev-2",
    name: "Meera Raghavan",
    location: "Chennai",
    rating: 5,
    date: "1 week ago",
    title: "Silk Mark certified perfection",
    comment:
      "The zari border has that true antique champagne gold lustre—not gaudy at all. Exceptional packaging in a bespoke mulberry box with loom authentication tag.",
    verified: true,
    helpfulCount: 21,
  },
  {
    id: "rev-3",
    name: "Ananya Kulkarni",
    location: "Pune",
    rating: 5,
    date: "2 weeks ago",
    title: "Heirloom grade tissue pallu",
    comment:
      "The tissue pallu shimmers gently under warm lighting without any stiffness. You can feel the generations of master weaver tradition in every motif.",
    verified: true,
    helpfulCount: 19,
  },
  {
    id: "rev-4",
    name: "Sunita Deshmukh",
    location: "Hyderabad",
    rating: 5,
    date: "3 weeks ago",
    title: "Opulent yet weightless drape",
    comment:
      "The organza texture is soft yet structured, and the kadwa buttis are woven with microscopic precision. A treasure to pass down to my daughter.",
    verified: true,
    helpfulCount: 15,
  },
  {
    id: "rev-5",
    name: "Radhika Venkat",
    location: "Bangalore",
    rating: 5,
    date: "1 month ago",
    title: "Stunning jewel colorway",
    comment:
      "Arrived in immaculate condition. The 3D viewer look #5 matches the real saree with 100% color fidelity. Truly a royal unboxing experience.",
    verified: true,
    helpfulCount: 14,
  },
  {
    id: "rev-6",
    name: "Kavita Mathur",
    location: "Jaipur",
    rating: 5,
    date: "1 month ago",
    title: "Magnificent border contrast",
    comment:
      "The contrast between the sheer organza body and the dense broad tissue pallu is majestic. WhatsApp blouse consultation was also fast and helpful.",
    verified: true,
    helpfulCount: 12,
  },
  {
    id: "rev-7",
    name: "Ritu Jain",
    location: "New Delhi",
    rating: 5,
    date: "1 month ago",
    title: "100% Pure Zari authenticity",
    comment:
      "Tested the hallmark with my family jeweler who confirmed the silver and gold core quality. Worth every rupee for an heirloom drape.",
    verified: true,
    helpfulCount: 16,
  },
  {
    id: "rev-8",
    name: "Deepa Nair",
    location: "Kochi",
    rating: 5,
    date: "2 months ago",
    title: "Dignified temple drape",
    comment:
      "Wore it for our family temple consecration. The drape is dignified, opulent, and breathes effortlessly even in humid evening weather.",
    verified: true,
    helpfulCount: 9,
  },
  {
    id: "rev-9",
    name: "Swati Patel",
    location: "Ahmedabad",
    rating: 5,
    date: "2 months ago",
    title: "Flawless master weave",
    comment:
      "Impeccable weave consistency. Not a single loose thread in the scattered zari buttis. Silk atelier team has set a new standard.",
    verified: true,
    helpfulCount: 8,
  },
  {
    id: "rev-10",
    name: "Aarti Ganguly",
    location: "Kolkata",
    rating: 5,
    date: "2 months ago",
    title: "Masterpiece from the holy looms",
    comment:
      "A masterpiece from the Banaras weavers. The tissue pallu is opulent without any prickliness on the skin. Sheer royal luxury.",
    verified: true,
    helpfulCount: 11,
  },
  {
    id: "rev-11",
    name: "Nandini Iyer",
    location: "Bengaluru",
    rating: 5,
    date: "3 months ago",
    title: "Dream wedding reception saree",
    comment:
      "Purchased this for my reception drape. The buttis catch the chandeliers with subtle, timeless glow. Pure handcrafted delight.",
    verified: true,
    helpfulCount: 7,
  },
  {
    id: "rev-12",
    name: "Malini Sen",
    location: "Guwahati",
    rating: 5,
    date: "3 months ago",
    title: "Sheer grace and royalty",
    comment:
      "The lightweight feel of Kora organza combined with the regal tissue pallu makes this an unforgettable saree in my collection.",
    verified: true,
    helpfulCount: 6,
  },
  {
    id: "rev-13",
    name: "Shweta Joshi",
    location: "Indore",
    rating: 5,
    date: "3 months ago",
    title: "Incredible craftsmanship",
    comment:
      "The zari buttis are so neatly finished on the reverse side as well, proving authentic handloom weaving.",
    verified: true,
    helpfulCount: 10,
  },
  {
    id: "rev-14",
    name: "Tanvi Singhania",
    location: "Chandigarh",
    rating: 5,
    date: "4 months ago",
    title: "Will be ordering another look!",
    comment:
      "The hand-tied tassels on the pallu are an exquisite finishing touch. I will definitely be ordering another colorway soon.",
    verified: true,
    helpfulCount: 5,
  },
];

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface ProductTag {
  label: string;
  icon?: React.ElementType;
}

export interface Seller {
  name: string;
  avatarUrl: string;
  rating: number;
  role?: string;
  location?: string;
}

export interface SareeLookOption {
  lookNumber: number;
  image: string;
  label?: string;
  colorName?: string;
}

export interface Product {
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  shippingCost?: number;
  currency: string;
  images: string[];
  colorOptions?: SareeLookOption[];
  description: string;
  fabric?: string;
  motif?: string;
  border?: string;
  sku?: string;
  inStock?: boolean;
  stockQuantity?: number;
  tags: ProductTag[];
}

export interface ProductDetailPageProps {
  product: Product;
  drapes?: string[];
  seller?: Seller;
  breadcrumbs: BreadcrumbItem[];
  currentImageIndex?: number;
  onImageChange?: (index: number) => void;
  onAddToCart?: (product: Product, quantity: number, lookIndex: number) => void;
  onBuyNow?: (product: Product, quantity: number, lookIndex: number) => void;
  className?: string;
}

// Rating stars component
export const StarRating = ({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3.5 w-3.5",
          i < Math.floor(rating)
            ? "text-[#b8862b] fill-[#b8862b]"
            : "text-[#b8862b]/30"
        )}
      />
    ))}
    <span className="ml-1.5 text-xs font-semibold text-[#7a5a2e]">
      {rating.toFixed(1)}
    </span>
  </div>
);

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  drapes,
  seller,
  breadcrumbs,
  currentImageIndex: controlledIndex,
  onImageChange,
  onAddToCart,
  onBuyNow,
  className,
}) => {
  const [internalIndex, setInternalIndex] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<"model" | "photo">("photo");
  const [quantity, setQuantity] = React.useState(1);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [copiedShare, setCopiedShare] = React.useState(false);

  // Customer Reviews State — Tiered: 4 initially -> Load More to 8 -> Full Pagination
  const [reviewsList, setReviewsList] = React.useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [reviewsViewLimit, setReviewsViewLimit] = React.useState<number>(4);
  const [isPaginationActive, setIsPaginationActive] = React.useState<boolean>(false);
  const [reviewsPage, setReviewsPage] = React.useState<number>(1);
  const [expandedReviewIds, setExpandedReviewIds] = React.useState<Record<string, boolean>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const [helpfulVotes, setHelpfulVotes] = React.useState<Record<string, boolean>>({});

  const toggleReviewExpand = (id: string) => {
    setExpandedReviewIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Review Form Inputs
  const [newRating, setNewRating] = React.useState(5);
  const [newName, setNewName] = React.useState("");
  const [newLocation, setNewLocation] = React.useState("");
  const [newTitle, setNewTitle] = React.useState("");
  const [newComment, setNewComment] = React.useState("");
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  // Lock background scrolling when modal is open & listen for Escape key
  React.useEffect(() => {
    if (isReviewModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsReviewModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isReviewModalOpen]);

  const REVIEWS_PER_PAGE = 8;
  const totalPages = Math.ceil(reviewsList.length / REVIEWS_PER_PAGE);

  // Reviews to display: if paginated, show 8 per page; otherwise show limited count (4 initially, then 8 on Load More)
  const displayedReviews = isPaginationActive
    ? reviewsList.slice((reviewsPage - 1) * REVIEWS_PER_PAGE, reviewsPage * REVIEWS_PER_PAGE)
    : reviewsList.slice(0, reviewsViewLimit);

  const handleHelpfulClick = (id: string) => {
    if (helpfulVotes[id]) return;
    setHelpfulVotes((prev) => ({ ...prev, [id]: true }));
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      location: newLocation.trim() || "India",
      rating: newRating,
      date: "Just now",
      title: newTitle.trim() || "Heirloom Pure Silk Drape",
      comment: newComment.trim(),
      verified: true,
      helpfulCount: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewName("");
    setNewLocation("");
    setNewTitle("");
    setNewComment("");
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsReviewModalOpen(false);
    }, 1200);
  };

  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const handleSelectImage = (idx: number) => {
    if (controlledIndex === undefined) {
      setInternalIndex(idx);
    }
    onImageChange?.(idx);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const imagesList = product.images.length > 0 ? product.images : ["/placeholder.jpg"];
  const currentImage = imagesList[activeIndex] || imagesList[0];
  const currentDrape =
    drapes?.[activeIndex] ||
    drapes?.[0] ||
    currentImage.replace(/\.webp$/, "-drape.webp");

  return (
    <div
      className={cn(
        "w-full rounded-2xl md:rounded-3xl bg-[#fdfbf7] text-[#1a1714] border border-[#b8862b]/30 shadow-xl overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Top Bar: Breadcrumbs — Smaller Font & Stays strictly on 1 Line */}
      <div className="flex items-center justify-between gap-3 px-3 sm:px-7 py-2.5 sm:py-3.5 border-b border-[#b8862b]/15 bg-[#fcfaf5]/80 backdrop-blur-xs overflow-hidden">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center flex-nowrap overflow-x-auto scrollbar-none text-[10.5px] sm:text-xs font-ui font-medium text-[#7a5a2e] whitespace-nowrap min-w-0"
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <a
                  href={item.href}
                  className={cn(
                    "hover:text-[#6b1426] transition-colors shrink-0",
                    isLast && "truncate max-w-[130px] xs:max-w-[190px] sm:max-w-none text-[#2a221b] font-semibold"
                  )}
                  title={item.label}
                >
                  {item.label}
                </a>
                {!isLast && (
                  <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mx-1 sm:mx-1.5 opacity-60 text-[#b8862b] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Main Grid: Left Gallery (Vertical Thumbnails + Big Preview) | Right Saree Spec & Buy */}
      <div className="p-3 sm:p-6 md:p-8 lg:p-9">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT: Saree Colour/Look Vertical Strip + Large Drape Preview */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            
            {/* VERTICAL THUMBNAIL STRIP — Horizontal LTR on mobile, vertical left-scrollbar on desktop */}
            <div
              className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto max-h-[100px] sm:max-h-[680px] md:max-h-[720px] lg:max-h-[760px] xl:max-h-[800px] pl-1 sm:pl-1.5 pr-0 pb-1 sm:pb-0 shrink-0 touch-pan-x [-webkit-overflow-scrolling:touch] sm:[direction:rtl] [scrollbar-color:#b8862b_#f8f5ee] scrollbar-none sm:scrollbar-thin"
              style={{ scrollbarWidth: "thin" }}
            >
              {imagesList.map((imgSrc, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectImage(idx)}
                    className={cn(
                      "relative w-14 h-16 sm:w-16 sm:h-20 md:w-18 md:h-22 rounded-xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer [direction:ltr]",
                      isSelected
                        ? "border-2 border-[#b8862b] shadow-md ring-2 ring-[#6b1426]/30 scale-102 bg-white"
                        : "border border-[#b8862b]/25 bg-white/70 opacity-85 hover:opacity-100 hover:border-[#b8862b]/70"
                    )}
                    aria-label={`Select saree color look ${idx + 1}`}
                  >
                    <img
                      src={imgSrc}
                      alt={`Saree Look ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <span className="absolute bottom-0 right-0 bg-[#6b1426] text-[9.5px] font-mono font-bold text-white px-1.5 py-0.5 rounded-tl-md shadow-xs border-t border-l border-[#b8862b]/30">
                      #{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* LARGE HERO DRAPE PREVIEW - Balanced generous height displaying full model face & drape */}
            <div className="order-1 sm:order-2 flex-1 flex flex-col justify-between gap-2.5">
              <div className="relative w-full h-[520px] xs:h-[580px] sm:h-[660px] md:h-[720px] lg:h-[760px] xl:h-[800px] overflow-hidden rounded-2xl bg-vanilla-custard-800/60 shadow-lg shrink-0 flex items-center justify-center">
                {/* Warm studio spotlight backdrop for 3D model */}
                {viewMode === "model" && (
                  <>
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(120%_75%_at_50%_28%,#fffaf2_0%,#f4e7d5_52%,#e6d1b6_100%)]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#d8c0a0]/80 to-transparent z-[1]"
                    />
                  </>
                )}

                {/* Aspect-Locked Virtual Drape Stage: exactly 533/822 so mask, model, and shade match 100% */}
                <div className="relative h-full w-auto aspect-[533/822] mx-auto overflow-hidden">
                  <DrapeStage
                    drape={currentDrape}
                    photo={currentImage}
                    alt={`Model wearing ${product.name} look ${activeIndex + 1}`}
                    view={viewMode}
                    sweep="look"
                  />
                </div>

                {/* Bespoke Botanical Floral Corner Flourish */}
                <div className="pointer-events-none absolute top-0 left-0 z-[8] w-20 sm:w-24 md:w-28 aspect-[360/580] select-none opacity-40">
                  <img
                    src="/images/floral-corner.png"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-contain opacity-60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
                  />
                </div>

                {/* Top Controls: Floating Circular Action Buttons with Hover Expansion */}
                <div className="absolute top-3.5 right-3.5 z-20 flex flex-col items-end gap-2 select-none">
                  {/* On Model Button - Icon-only circle, expands only on hover */}
                  <button
                    type="button"
                    onClick={() => setViewMode("model")}
                    className={cn(
                      "group flex items-center h-9 rounded-full backdrop-blur-md border transition-all duration-300 ease-out shadow-md cursor-pointer overflow-hidden px-2.5 hover:px-3",
                      viewMode === "model"
                        ? "bg-[#6b1426] text-white border-[#6b1426] shadow-sm scale-102"
                        : "bg-white/95 text-[#7a5a2e] border-[#b8862b]/35 hover:border-[#6b1426]/50 hover:bg-white hover:text-[#6b1426]"
                    )}
                    aria-label="View on Model"
                    aria-pressed={viewMode === "model"}
                    title="View 3D Virtual Drape on Atelier Model"
                  >
                    <User className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-ui text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300 ease-out">
                      On Model
                    </span>
                  </button>

                  {/* Saree Photo Button - Icon-only circle, expands only on hover */}
                  <button
                    type="button"
                    onClick={() => setViewMode("photo")}
                    className={cn(
                      "group flex items-center h-9 rounded-full backdrop-blur-md border transition-all duration-300 ease-out shadow-md cursor-pointer overflow-hidden px-2.5 hover:px-3",
                      viewMode === "photo"
                        ? "bg-[#6b1426] text-white border-[#6b1426] shadow-sm scale-102"
                        : "bg-white/95 text-[#7a5a2e] border-[#b8862b]/35 hover:border-[#6b1426]/50 hover:bg-white hover:text-[#6b1426]"
                    )}
                    aria-label="View Saree Photo"
                    aria-pressed={viewMode === "photo"}
                    title="View High-Resolution Saree Flat Photo"
                  >
                    <Layers className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-ui text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover:max-w-[110px] group-hover:opacity-100 group-hover:ml-1.5 transition-all duration-300 ease-out">
                      Saree Photo
                    </span>
                  </button>

                  {/* Bookmark Floating Button - Fixed Icon-Only Circle */}
                  <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md border transition-all duration-200 shadow-md cursor-pointer shrink-0 self-end",
                      isFavorite
                        ? "bg-[#6b1426] text-white border-[#6b1426] scale-105"
                        : "bg-white/95 text-[#7a5a2e] border-[#b8862b]/35 hover:bg-white hover:text-[#6b1426] hover:scale-105"
                    )}
                    aria-label={isFavorite ? "Bookmarked in your vault" : "Bookmark this drape"}
                    title={isFavorite ? "Bookmarked in your vault" : "Bookmark this drape"}
                  >
                    <Bookmark
                      className={cn(
                        "w-4 h-4 transition-all duration-200",
                        isFavorite ? "fill-white text-white" : "text-[#7a5a2e]"
                      )}
                    />
                  </button>
                </div>

                {/* Dynamic Bottom-Left Badge: Virtual Drape vs Silk Mark Certified */}
                {viewMode === "model" ? (
                  <div className="absolute bottom-3.5 left-3.5 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#b8862b]/35 shadow-xs">
                   
                    <span className="text-[10px] font-ui font-bold uppercase tracking-[0.14em] text-[#6b1426]">
                      Virtual Drape • 3D Model
                    </span>
                  </div>
                ) : (
                  <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 z-20 flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-[#fdfbf7]/95 backdrop-blur-md border border-[#b8862b]/35 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6b1426] shrink-0" />
                    <span className="text-[9.5px] sm:text-[10px] font-ui font-bold uppercase tracking-wider text-[#6b1426]">
                      <span className="inline sm:hidden">Silk Mark</span>
                      <span className="hidden sm:inline">Silk Mark Certified • 100% Pure Silk</span>
                    </span>
                  </div>
                )}

                {/* Look count floating badge */}
                <div className="absolute bottom-2.5 sm:bottom-3.5 right-2.5 sm:right-3.5 z-20 px-2 sm:px-2.5 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-[10px] sm:text-[11px] font-mono font-medium text-white tracking-wider border border-white/20">
                  Look {activeIndex + 1} of {imagesList.length}
                </div>
              </div>

              {/* Thumbnail Dot & Counter row */}
              <div className="flex items-center justify-between px-1 h-5 shrink-0">
                <span className="text-xs font-ui text-[#7a5a2e] font-medium">
                  {imagesList.length} Colourways Handcrafted for this Loom Edition
                </span>
                <span className="text-xs font-mono font-semibold text-[#6b1426]">
                  Active: #{activeIndex + 1}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT: Saree Heirloom Details, Pricing, Specs & Buy CTA - Generous Luxury Spacing & Clear Typography */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between space-y-4 sm:space-y-5">
            
            {/* Header: Title & Subtitle + Right-aligned Bookmark & Share Actions */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <h1
                  className="font-heading-main text-2xl sm:text-3xl lg:text-[2.1rem] font-bold text-[#6b1426] tracking-tight leading-tight truncate sm:whitespace-normal"
                  title={product.name}
                >
                  {product.name}
                </h1>

                {product.subtitle && (
                  <p className="font-heading-sub text-sm sm:text-base md:text-lg text-[#004e5e] font-medium italic truncate sm:whitespace-normal">
                    {product.subtitle}
                  </p>
                )}

                {product.sku && (
                  <p className="font-mono text-xs text-[#7a5a2e]/75 pt-0.5">
                    SKU: {product.sku}
                  </p>
                )}
              </div>

              {/* Bookmark & Share Buttons on the Right Side */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    "h-10 w-10 sm:h-11 sm:w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs",
                    isFavorite
                      ? "bg-[#6b1426] text-white border-[#6b1426] shadow-xs scale-105"
                      : "bg-white text-[#7a5a2e] border-[#b8862b]/35 hover:text-[#6b1426] hover:border-[#6b1426]/40 hover:bg-[#fdfbf7]"
                  )}
                  aria-label={isFavorite ? "Bookmarked" : "Bookmark this saree"}
                  title={isFavorite ? "Saved in your wishlist" : "Bookmark this saree"}
                >
                  <Bookmark
                    className={cn(
                      "h-4.5 w-4.5 transition-transform",
                      isFavorite ? "fill-white text-white" : "text-[#7a5a2e]"
                    )}
                  />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border bg-white text-[#7a5a2e] border-[#b8862b]/35 hover:text-[#6b1426] hover:border-[#6b1426]/40 hover:bg-[#fdfbf7] flex items-center justify-center transition-all cursor-pointer shadow-2xs relative"
                  aria-label="Share saree"
                  title="Share this saree"
                >
                  {copiedShare ? (
                    <Check className="h-4.5 w-4.5 text-emerald-600" />
                  ) : (
                    <Share2 className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Pricing Container — Refined luxury ivory-gold gradient card */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-[#fcfaf5] to-[#f6f0e4] border border-[#b8862b]/30 shadow-xs space-y-1.5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-ui text-3xl sm:text-[2.1rem] font-extrabold text-[#004e5e] tracking-tight">
                  {product.currency}{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <span className="font-ui text-base sm:text-lg line-through text-[#7a5a2e]/60">
                    {product.currency}{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-ui font-bold bg-[#6b1426]/10 text-[#6b1426] border border-[#6b1426]/20">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] font-ui text-[#7a5a2e]">
                <span>Inclusive of all taxes</span>
                <span>•</span>
                {product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity <= 0) ? (
                  <span className="text-rose-700 font-semibold flex items-center gap-1.5 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-600 inline-block animate-ping" />
                    <span className="font-bold text-rose-800">Stock Not Available (Out of Stock)</span>
                  </span>
                ) : product.stockQuantity !== undefined && product.stockQuantity < 5 ? (
                  <>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                      In stock, ready to ship
                    </span>
                    <span>•</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-ui font-bold text-xs border border-rose-300 flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-pulse" />
                      Critical Stock: Only {product.stockQuantity} Left!
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                      In stock, ready to ship
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#6b1426]/10 text-[#6b1426] font-ui font-bold text-xs border border-[#6b1426]/20">
                      {product.stockQuantity !== undefined ? `${product.stockQuantity} drapes available in vault` : "Exclusive Handloom Edition"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Direct Action Buttons: Quantity, ADD TO CART & BUY NOW */}
            <div className="space-y-2.5 pt-0.5">
              <div className="flex items-center gap-2 sm:gap-3">
                {product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity <= 0) ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Button
                      size="default"
                      disabled
                      className="flex-1 min-w-0 bg-neutral-200 text-neutral-500 font-semibold text-xs sm:text-sm uppercase tracking-wider py-3.5 px-4 rounded-xl h-auto cursor-not-allowed justify-center shadow-none"
                    >
                      Sold Out • Stock Not Available
                    </Button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Hi Silk Karagiri, please notify me when ${product.name} (Look ${activeIndex + 1}) is back in stock.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-ui text-xs font-semibold shadow-xs transition-colors shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Notify on Restock</span>
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Quantity Stepper (Total Number) */}
                    <div className="inline-flex items-center rounded-xl border border-[#b8862b]/35 bg-white px-2 py-1.5 sm:px-3 sm:py-2 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#7a5a2e] hover:text-[#6b1426] transition-colors rounded-lg hover:bg-[#b8862b]/10 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 sm:w-8 text-center font-ui font-bold text-sm sm:text-base text-[#2a221b] select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            product.stockQuantity !== undefined
                              ? Math.min(product.stockQuantity, quantity + 1)
                              : quantity + 1
                          )
                        }
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#7a5a2e] hover:text-[#6b1426] transition-colors rounded-lg hover:bg-[#b8862b]/10 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <Button
                      size="default"
                      variant="primary"
                      onClick={() => onAddToCart?.(product, quantity, activeIndex)}
                      className="flex-1 min-w-0 gap-2 bg-[#004e5e] hover:bg-[#003b47] text-white shadow-xs font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 sm:py-4 px-3 sm:px-4 cursor-pointer rounded-xl h-auto whitespace-nowrap justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 shrink-0" />
                      <span>Add To Cart</span>
                    </Button>

                    {/* BUY NOW */}
                    <Button
                      size="default"
                      variant="royal"
                      onClick={() => onBuyNow?.(product, quantity, activeIndex)}
                      className="flex-1 min-w-0 gap-2 bg-[#6b1426] hover:bg-[#520f1d] text-white shadow-xs font-bold text-xs sm:text-sm uppercase tracking-wider py-3.5 sm:py-4 px-3 sm:px-4 cursor-pointer border border-[#b8862b]/30 rounded-xl h-auto whitespace-nowrap justify-center"
                    >
                      <ShoppingBag className="h-4 w-4 shrink-0" />
                      <span>Buy Now</span>
                    </Button>
                  </>
                )}
              </div>

              {/* WhatsApp Support Link */}
              <div className="text-center pt-0.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Inquiry about ${product.name} (Look ${activeIndex + 1})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-ui font-medium text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Need help styling or custom blouse stitching? Chat with us on WhatsApp
                </a>
              </div>
            </div>

            {/* Special Inaugural Offers Card */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-dashed border-[#b8862b]/50 bg-[#fffdf9] flex items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#6b1426]" />
                  <span className="text-xs sm:text-[13px] font-ui font-bold uppercase tracking-wider text-[#6b1426]">
                    15% OFF Master Weaves
                  </span>
                </div>
                <p className="text-xs font-body text-[#7a5a2e]">
                  Flat 15% discount on handcrafted heirloom pure silk drapes
                </p>
              </div>
              <span className="px-3 py-1 rounded-md bg-[#6b1426]/10 text-[#6b1426] font-mono text-xs font-bold border border-[#6b1426]/20 shrink-0">
                SILK15
              </span>
            </div>

            {/* Saree Attributes & Tags: Fixed 2 per row with luxury ivory/gold styling */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-ui font-bold uppercase tracking-widest text-[#7a5a2e]">
                Specifications:
              </span>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {product.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#fdfbf7] border border-[#b8862b]/25 shadow-2xs hover:border-[#b8862b]/50 hover:bg-white transition-all group min-w-0"
                    title={tag.label}
                  >
                    {tag.icon ? (
                      <tag.icon className="h-3.5 w-3.5 text-[#b8862b] shrink-0 group-hover:text-[#6b1426] transition-colors" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b8862b] shrink-0" />
                    )}
                    <span className="text-xs sm:text-[12.5px] font-ui font-semibold uppercase tracking-wider text-[#2a221b] leading-tight line-clamp-1">
                      {tag.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Story / Description */}
            <div className="space-y-1 pt-1.5 border-t border-[#b8862b]/20">
              <span className="text-xs font-ui font-bold uppercase tracking-widest text-[#7a5a2e]">
                The Loom Heritage Story
              </span>
              <p className="font-body text-xs sm:text-sm text-[#413428] leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Quick Customer Review Anchor & Rating Link */}
            <div className="pt-2.5 border-t border-[#b8862b]/15 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-ui">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("customer-reviews-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 text-[#6b1426] hover:text-[#004e5e] font-semibold transition-colors group cursor-pointer text-left flex-wrap"
              >
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-[#2a221b] text-xs sm:text-sm">4.9 / 5</span>
                <span className="text-[#7a5a2e] group-hover:underline text-xs sm:text-sm">
                  ({reviewsList.length} Verified Reviews)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs sm:text-sm font-ui font-semibold text-[#6b1426] hover:text-[#004e5e] transition-colors underline underline-offset-2 cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

          </div>

        </main>

        {/* CUSTOMER REVIEWS & PATRON TESTIMONIALS SECTION */}
        <section
          id="customer-reviews-section"
          className="mt-10 pt-8 border-t border-[#b8862b]/25 space-y-6"
        >
          {/* Section Header: Title, Summary & Write Review CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#b8862b]/15">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-heading-main text-xl sm:text-2xl font-bold text-[#6b1426]">
                  Customer Reviews & Patron Testimonials
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-ui font-bold bg-[#6b1426]/10 text-[#6b1426] border border-[#6b1426]/20">
                  {reviewsList.length} Reviews
                </span>
              </div>
              <p className="font-body text-xs sm:text-sm text-[#7a5a2e]">
                Authentic heirloom experiences from verified silk patrons across India
              </p>
            </div>

            {/* Single Row on Mobile: Rating Badge + Write Review Button side-by-side */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#fcfaf5] to-[#f6f0e4] border border-[#b8862b]/30 shadow-2xs shrink-0">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-ui font-extrabold text-xs sm:text-sm text-[#2a221b]">4.9 / 5</span>
              </div>

              <Button
                type="button"
                variant="royal"
                onClick={() => setIsReviewModalOpen(true)}
                className="gap-1.5 sm:gap-2 bg-[#6b1426] hover:bg-[#520f1d] text-white shadow-xs font-semibold text-[11px] sm:text-xs uppercase tracking-normal sm:tracking-wider py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl cursor-pointer shrink-0 whitespace-nowrap"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </Button>
            </div>
          </div>

          {/* Reviews Grid (2 Columns on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedReviews.map((rev) => {
              const isVoted = helpfulVotes[rev.id];
              const initials = rev.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const isExpanded = !!expandedReviewIds[rev.id];

              return (
                <div
                  key={rev.id}
                  className="rounded-2xl bg-white/90 border border-[#b8862b]/25 shadow-2xs hover:shadow-sm hover:border-[#b8862b]/50 transition-all overflow-hidden"
                >
                  {/* MOBILE 1-LINE VIEW (sm:hidden): Rating + Name + Message Snippet + Dropdown Read More */}
                  <div className="sm:hidden p-3 space-y-2.5">
                    {/* The 1-Line Collapsed Bar */}
                    <div
                      onClick={() => toggleReviewExpand(rev.id)}
                      className="flex items-center justify-between gap-1.5 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {/* Rating with Star */}
                        <div className="flex items-center gap-1 shrink-0 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                          <span className="font-ui font-extrabold text-[11px] text-[#2a221b]">
                            {rev.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Patron Name */}
                        <span className="font-ui font-bold text-xs text-[#2a221b] shrink-0 truncate max-w-[80px]">
                          {rev.name}
                        </span>

                        <span className="text-[#b8862b]/40 shrink-0">:</span>

                        {/* Message Preview in 1 Line */}
                        <span className="font-body text-xs text-[#413428] truncate min-w-0 flex-1 opacity-90">
                          "{rev.comment}"
                        </span>
                      </div>

                      {/* Dropdown / Read More Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReviewExpand(rev.id);
                        }}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-ui font-semibold shrink-0 transition-all cursor-pointer",
                          isExpanded
                            ? "bg-[#6b1426] text-white"
                            : "bg-[#b8862b]/10 text-[#6b1426] hover:bg-[#6b1426] hover:text-white"
                        )}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Collapse review" : "Expand review"}
                      >
                        <span>{isExpanded ? "Less" : "Read More"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* EXPANDED FULL DETAILS (revealed when dropdown/read more is clicked) */}
                    {isExpanded && (
                      <div className="pt-2.5 border-t border-[#b8862b]/20 space-y-2.5 animate-in fade-in-50 duration-200">
                        {/* Header: Avatar, Name, Location, Verified Badge & Date */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6b1426] to-[#004e5e] text-white flex items-center justify-center font-ui text-[11px] font-bold shadow-2xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-ui font-bold text-xs text-[#2a221b]">
                                  {rev.name}
                                </span>
                                {rev.verified && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-ui font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    Verified Patron
                                  </span>
                                )}
                              </div>
                              <span className="text-[10.5px] font-ui text-[#7a5a2e]/80">
                                {rev.location}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10.5px] font-mono text-[#7a5a2e]/70 shrink-0">
                            {rev.date}
                          </span>
                        </div>

                        {/* Title & 5 Stars */}
                        <div className="space-y-0.5">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3.5 h-3.5",
                                  i < Math.floor(rev.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-[#b8862b]/30"
                                )}
                              />
                            ))}
                          </div>
                          <h4 className="font-heading-main font-bold text-xs text-[#6b1426]">
                            {rev.title}
                          </h4>
                        </div>

                        {/* Full Review Comment */}
                        <p className="font-body text-xs text-[#413428] leading-relaxed">
                          "{rev.comment}"
                        </p>

                        {/* Footer: Purchased & Helpful Button */}
                        <div className="pt-2 border-t border-[#b8862b]/15 flex items-center justify-between text-[11px] font-ui">
                          <span className="text-[#7a5a2e]/70 truncate max-w-[160px]">
                            Purchased: Banarasi Kora Organza
                          </span>
                          <button
                            type="button"
                            onClick={() => handleHelpfulClick(rev.id)}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
                              isVoted
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs"
                                : "text-[#7a5a2e] hover:text-[#6b1426] hover:bg-[#b8862b]/10"
                            )}
                          >
                            <ThumbsUp className={cn("w-3 h-3", isVoted && "fill-emerald-600")} />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DESKTOP FULL CARD VIEW (hidden sm:flex) */}
                  <div className="hidden sm:flex p-5 flex-col justify-between space-y-3 h-full">
                    <div className="space-y-2">
                      {/* Header: Avatar, Name, Location, Verified Badge & Date */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6b1426] to-[#004e5e] text-white flex items-center justify-center font-ui text-xs font-bold shadow-2xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-ui font-bold text-xs sm:text-sm text-[#2a221b]">
                                {rev.name}
                              </span>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9.5px] font-ui font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                  Verified Patron
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-ui text-[#7a5a2e]/80">
                              {rev.location}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-[#7a5a2e]/70 shrink-0">
                          {rev.date}
                        </span>
                      </div>

                      {/* Stars & Review Title */}
                      <div className="space-y-0.5 pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3.5 h-3.5",
                                  i < Math.floor(rev.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-[#b8862b]/30"
                                )}
                              />
                            ))}
                          </div>
                          <span className="font-ui font-bold text-xs text-[#2a221b]">
                            {rev.rating.toFixed(1)}
                          </span>
                        </div>
                        <h4 className="font-heading-main font-bold text-sm text-[#6b1426]">
                          {rev.title}
                        </h4>
                      </div>

                      {/* Review Body */}
                      <p className="font-body text-xs sm:text-sm text-[#413428] leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Footer: Helpful Vote */}
                    <div className="pt-2 border-t border-[#b8862b]/15 flex items-center justify-between text-xs font-ui">
                      <span className="text-[11px] text-[#7a5a2e]/70">
                        Purchased: Banarasi Kora Organza
                      </span>
                      <button
                        type="button"
                        onClick={() => handleHelpfulClick(rev.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                          isVoted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs"
                            : "text-[#7a5a2e] hover:text-[#6b1426] hover:bg-[#b8862b]/10"
                        )}
                      >
                        <ThumbsUp className={cn("w-3 h-3", isVoted && "fill-emerald-600")} />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions: 3-Tier Reviews Progression: 4 initial -> Load More to 8 -> Full Pagination */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-t border-[#b8862b]/15">
            {/* Left: View Status */}
            <span className="text-xs font-ui font-medium text-[#7a5a2e] text-center sm:text-left">
              Showing {isPaginationActive ? (reviewsPage - 1) * REVIEWS_PER_PAGE + 1 : 1}–
              {isPaginationActive
                ? Math.min(reviewsPage * REVIEWS_PER_PAGE, reviewsList.length)
                : Math.min(reviewsViewLimit, reviewsList.length)}{" "}
              of {reviewsList.length} reviews
            </span>

            {/* Middle: Load More Tab (Tier 1: 4 -> 8, Tier 2: 8 -> Pagination) */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {!isPaginationActive ? (
                <>
                  {reviewsViewLimit < 8 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setReviewsViewLimit(8)}
                      className="gap-1.5 border-[#b8862b]/40 text-[#6b1426] hover:bg-[#6b1426] hover:text-white font-ui font-semibold text-xs uppercase tracking-wider py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl cursor-pointer transition-all shadow-2xs"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                      Load More Reviews (Showing {reviewsViewLimit} of {reviewsList.length})
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="royal"
                        onClick={() => {
                          setIsPaginationActive(true);
                          setReviewsPage(1);
                        }}
                        className="gap-1.5 bg-[#6b1426] hover:bg-[#520f1d] text-white font-ui font-semibold text-xs uppercase tracking-wider py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl cursor-pointer transition-all shadow-xs"
                      >
                        Explore All with Pagination ({reviewsList.length})
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setReviewsViewLimit(4)}
                        className="gap-1 border-[#b8862b]/40 text-[#7a5a2e] hover:bg-[#7a5a2e]/10 font-ui font-semibold text-xs py-2 sm:py-2.5 px-3 rounded-xl cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        Show 4
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPaginationActive(false);
                    setReviewsViewLimit(4);
                    setReviewsPage(1);
                    const el = document.getElementById("customer-reviews-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="gap-1.5 border-[#b8862b]/40 text-[#7a5a2e] hover:bg-[#7a5a2e] hover:text-white font-ui font-semibold text-xs uppercase tracking-wider py-2 sm:py-2.5 px-4 rounded-xl cursor-pointer transition-all shadow-2xs"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  Show Initial 4 Reviews
                </Button>
              )}
            </div>

            {/* Right: Senior Level Pagination Controls (Active in Paginated View) */}
            {isPaginationActive && totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={reviewsPage === 1}
                  onClick={() => setReviewsPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    "p-2 rounded-lg border text-xs font-ui font-semibold transition-all flex items-center justify-center",
                    reviewsPage === 1
                      ? "opacity-40 cursor-not-allowed border-[#b8862b]/20 text-[#7a5a2e]"
                      : "cursor-pointer border-[#b8862b]/35 text-[#6b1426] hover:bg-[#6b1426] hover:text-white bg-white shadow-2xs"
                  )}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === reviewsPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setReviewsPage(pageNum)}
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-xs font-ui font-bold transition-all cursor-pointer flex items-center justify-center",
                        isActive
                          ? "bg-[#6b1426] text-white border-[#6b1426] shadow-xs scale-105"
                          : "bg-white text-[#7a5a2e] border-[#b8862b]/30 hover:border-[#6b1426] hover:text-[#6b1426]"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={reviewsPage === totalPages}
                  onClick={() => setReviewsPage((p) => Math.min(totalPages, p + 1))}
                  className={cn(
                    "p-2 rounded-lg border text-xs font-ui font-semibold transition-all flex items-center justify-center",
                    reviewsPage === totalPages
                      ? "opacity-40 cursor-not-allowed border-[#b8862b]/20 text-[#7a5a2e]"
                      : "cursor-pointer border-[#b8862b]/35 text-[#6b1426] hover:bg-[#6b1426] hover:text-white bg-white shadow-2xs"
                  )}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* LUXURY WRITE A REVIEW POPUP MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#fdfbf7] border border-[#b8862b]/40 shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#b8862b]/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#b8862b]" />
                    <span className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b1426]">
                      Silk Mark Verified Community
                    </span>
                  </div>
                  <h3 className="font-heading-main text-2xl font-bold text-[#6b1426]">
                    Write a Patron Review
                  </h3>
                  <p className="font-heading-sub italic text-xs text-[#004e5e]">
                    Reviewing: {product.name}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 rounded-full border border-[#b8862b]/30 bg-white/80 hover:bg-[#6b1426] hover:text-white text-[#7a5a2e] transition-colors cursor-pointer shadow-2xs"
                  aria-label="Close review popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form inside Modal */}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Star Rating Picker */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fcfaf5] to-[#f6f0e4] border border-[#b8862b]/25 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="block text-xs font-ui font-bold text-[#7a5a2e] uppercase tracking-wider">
                      Overall Rating
                    </span>
                    <span className="text-[11px] font-ui text-[#2a221b]/80">
                      Tap a star to rate your drape
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-120 transition-transform cursor-pointer"
                        aria-label={`${star} stars`}
                      >
                        <Star
                          className={cn(
                            "w-6 h-6 transition-colors",
                            star <= newRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-[#b8862b]/30"
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-ui font-extrabold text-sm text-[#2a221b] min-w-[50px]">
                      {newRating}.0 / 5
                    </span>
                  </div>
                </div>

                {/* Name & City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-ui font-semibold text-[#7a5a2e] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#b8862b]/30 bg-white text-xs font-ui text-[#2a221b] placeholder:text-[#7a5a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#6b1426]/30 shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-ui font-semibold text-[#7a5a2e] mb-1">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#b8862b]/30 bg-white text-xs font-ui text-[#2a221b] placeholder:text-[#7a5a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#6b1426]/30 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block text-xs font-ui font-semibold text-[#7a5a2e] mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Magnificent Zari sheen & weightless drape!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#b8862b]/30 bg-white text-xs font-ui text-[#2a221b] placeholder:text-[#7a5a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#6b1426]/30 shadow-2xs"
                  />
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-ui font-semibold text-[#7a5a2e] mb-1">
                    Your Review Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe the fabric feel, zari lustre, packaging, and draping comfort..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#b8862b]/30 bg-white text-xs font-ui text-[#2a221b] placeholder:text-[#7a5a2e]/50 focus:outline-none focus:ring-2 focus:ring-[#6b1426]/30 resize-none shadow-2xs"
                  />
                </div>

                {/* Actions & Status */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {formSubmitted ? (
                    <div className="flex items-center gap-1.5 text-xs font-ui font-bold text-emerald-700 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Thank you! Your verified patron review has been posted.
                    </div>
                  ) : (
                    <span className="text-[11px] font-ui text-[#7a5a2e]/80">
                      Verified with Silk Mark pure silk hallmarking.
                    </span>
                  )}

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="flex-1 sm:flex-initial border-[#b8862b]/35 text-[#7a5a2e] hover:bg-[#7a5a2e]/10 text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="royal"
                      className="flex-1 sm:flex-initial gap-2 bg-[#6b1426] hover:bg-[#520f1d] text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl cursor-pointer shadow-md"
                    >
                      Submit Review
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
