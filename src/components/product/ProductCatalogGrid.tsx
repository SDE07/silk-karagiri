"use client";

import React, { useState, useMemo } from "react";
import { Product, ProductCategory } from "@/types/product.types";
import { ProductCard } from "@/components/product/ProductCard";
import { initialProducts } from "@/data/products.data";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<"All" | ProductCategory> = [
  "All",
  "Sarees",
  "Scarves",
  "Fabrics",
  "Apparel",
];

export function ProductCatalogGrid() {
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProductCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc" | "rating">("recommended");

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter (name, fabric, motif, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.motif && p.motif.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section className="w-full pt-8 sm:pt-14 pb-12 space-y-6 sm:space-y-8" id="catalog-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#b8862b]/20 pb-5">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#b8862b]" />
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-[#7a5a2e]">
              Handloom Treasury • Ready to Drape
            </span>
            <span className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#b8862b] sm:hidden" />
          </div>
          <h2 className="font-heading-main text-3xl sm:text-4xl font-bold text-[#6b1426] tracking-tight">
            The Master Handloom Catalog
          </h2>
          <p className="font-heading-sub italic text-base sm:text-lg text-[#004e5e]">
            Hand-inspected heirloom weaves certified with authentic Silk Mark seals
          </p>
        </div>

        {/* Results Badge */}
        <div className="self-center sm:self-end shrink-0">
          <span className="font-ui text-xs font-semibold text-[#7a5a2e] bg-[#b8862b]/15 px-3.5 py-1.5 rounded-full border border-[#b8862b]/30">
            {filteredProducts.length} Heirloom Creations
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? initialProducts.length
                : initialProducts.filter((p) => p.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "font-ui text-xs font-semibold px-3.5 py-2 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border",
                  isActive
                    ? "bg-[#6b1426] text-vanilla-custard-900 border-[#6b1426] shadow-xs"
                    : "bg-vanilla-custard-800/80 hover:bg-vanilla-custard-800 text-[#7a5a2e] border-[#b8862b]/30 hover:border-[#b8862b]/60"
                )}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-vanilla-custard-900/20 text-vanilla-custard-900"
                      : "bg-[#b8862b]/15 text-[#7a5a2e]"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5a2e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search weaves, fabrics..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-ui bg-vanilla-custard-800/90 border border-[#b8862b]/30 rounded-lg text-ink-black placeholder:text-ink-black-300/50 focus:outline-hidden focus:border-[#6b1426] transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 pl-3 pr-7 text-xs font-ui font-medium bg-vanilla-custard-800/90 border border-[#b8862b]/30 rounded-lg text-[#7a5a2e] focus:outline-hidden focus:border-[#6b1426] transition-colors cursor-pointer appearance-none"
            >
              <option value="recommended">Curated Picks</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a5a2e] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-[#b8862b]/30 rounded-2xl bg-vanilla-custard-800/40 p-8 space-y-3">
          <Sparkles className="w-8 h-8 text-[#b8862b] mx-auto opacity-70" />
          <h3 className="font-heading-main text-xl font-bold text-[#6b1426]">
            No matching drapes found
          </h3>
          <p className="font-body text-sm text-[#7a5a2e] max-w-md mx-auto">
            Try adjusting your search terms or select "All" categories to view our complete royal handloom treasury.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-2 text-xs font-ui font-semibold text-[#6b1426] underline underline-offset-4 hover:text-[#004e5e] cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductCatalogGrid;
