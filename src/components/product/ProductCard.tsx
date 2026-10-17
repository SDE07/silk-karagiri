"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/product.types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  // Determine badge variant based on curation
  const getBadgeVariant = (badgeText?: string): "gold" | "royal" | "aqua" => {
    if (!badgeText) return "gold";
    const lower = badgeText.toLowerCase();
    if (lower.includes("heritage") || lower.includes("exclusive") || lower.includes("bridal")) {
      return "royal";
    }
    if (lower.includes("trending") || lower.includes("summer")) {
      return "aqua";
    }
    return "gold";
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-vanilla-custard-900 border border-golden-orange/25 overflow-hidden shadow-xs hover:shadow-xl hover:border-golden-orange/50 transition-all duration-300">
      {/* Image Container with Soft Silk Matting */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-vanilla-custard-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Royal Accent / Gold Badge */}
        {product.badge && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <Badge variant={getBadgeVariant(product.badge)}>{product.badge}</Badge>
          </div>
        )}
        {/* Subtle Silk Mark Seal */}
        <div className="absolute bottom-3 right-3 z-10 bg-ink-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-ui tracking-widest uppercase text-vanilla-custard-900 border border-golden-orange/30">
          Silk Mark
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate max-w-[65%]">
              <span className="font-ui text-[11px] uppercase tracking-widest text-dark-teal-400 font-semibold shrink-0">
                {product.category}
              </span>
              {product.fabric && (
                <>
                  <span className="text-[#b8862b]/40 text-[10px] shrink-0">•</span>
                  <span className="font-ui text-[10.5px] text-[#7a5a2e] font-medium truncate">
                    {product.fabric}
                  </span>
                </>
              )}
            </div>
            {/* Star Rating & Review Count in Gold / Zari */}
            {product.rating && (
              <div className="flex items-center gap-1 font-ui text-xs shrink-0">
                <span className="text-golden-orange">★</span>
                <span className="font-medium text-ink-black-300 text-[11px]">
                  {product.rating}
                  {product.reviewCount ? (
                    <span className="text-ink-black-300/60 ml-0.5 font-normal">({product.reviewCount})</span>
                  ) : null}
                </span>
              </div>
            )}
          </div>

          {/* Product Title in Marcellus (H3/H4) */}
          <h3 className="font-heading-sub text-lg font-bold text-ink-black line-clamp-1 group-hover:text-dark-teal transition-colors">
            {product.name}
          </h3>

          {/* Description / Story in EB Garamond */}
          <p className="font-body text-sm text-ink-black-300 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA Container with 1px Gold Divider */}
        <div className="pt-3 border-t border-golden-orange/20 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              {/* Price in Montserrat */}
              <span className="font-ui text-base font-bold text-dark-teal tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="font-ui text-xs line-through text-ink-black-300/50">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {/* Low Stock Urgency Indicator */}
            {product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity <= 4 && (
              <span className="font-ui text-[10px] text-amber-700 font-semibold mt-0.5">
                Only {product.stockQuantity} drapes left
              </span>
            )}
          </div>

          {/* Primary CTA */}
          <Button
            size="sm"
            variant="primary"
            disabled={!product.inStock || product.stockQuantity === 0}
            onClick={() => addItem(product)}
            aria-label={`Add ${product.name} to shopping bag`}
            className={!product.inStock || product.stockQuantity === 0 ? "opacity-50 cursor-not-allowed" : ""}
          >
            {!product.inStock || product.stockQuantity === 0 ? "Sold Out" : "Add to Bag"}
          </Button>
        </div>
      </div>
    </div>
  );
}
