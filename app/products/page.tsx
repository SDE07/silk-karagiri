import React, { Suspense } from "react";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";

async function ProductsList({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  const products = await productService.getAllProducts(category, search);

  const categories = ["All", "Sarees", "Scarves", "Fabrics", "Apparel"];

  return (
    <>
      {/* Category Filter Pills: Montserrat */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-b border-golden-orange/20 pb-8 font-ui">
        {categories.map((cat) => {
          const isSelected =
            (!category && cat === "All") ||
            (category && category.toLowerCase() === cat.toLowerCase());

          const href = cat === "All" ? "/products" : `/products?category=${cat}`;

          return (
            <Link
              key={cat}
              href={href}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-dark-teal text-vanilla-custard-900 shadow-md border border-dark-teal"
                  : "bg-vanilla-custard-800/60 text-ink-black border border-golden-orange/30 hover:border-dark-teal hover:bg-vanilla-custard-800"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="py-24 text-center space-y-3">
          <p className="font-heading-sub text-2xl font-bold text-ink-black">
            No drapes found in this collection
          </p>
          <p className="font-body text-base text-ink-black-300">
            Please check back soon or explore our other handcrafted silk collections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-golden-orange/20 pb-8">
        <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-dark-teal-400">
          The Royal Silk Vault
        </span>
        <h1 className="font-heading-main text-4xl sm:text-6xl font-bold text-ink-black">
          All Handwoven Collections
        </h1>
        <p className="font-body text-lg sm:text-xl text-ink-black-300 max-w-2xl leading-relaxed">
          Browse through authentic pure mulberry, tussar, and raw silk creations certified with the official Silk Mark of purity.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-24 text-center font-heading-main text-2xl text-dark-teal animate-pulse">
            Loading Royal Silk Collections…
          </div>
        }
      >
        <ProductsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
