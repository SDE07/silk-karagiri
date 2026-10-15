import React from "react";
import { ProductHero3DSection } from "@/components/product/ProductHero3DSection";

export default function ProductsPage() {
  return (
    <div className="w-full lg:w-[92%] xl:w-[90%] max-w-[1800px] mx-auto px-2.5 sm:px-5 lg:px-6 pt-3.5 sm:pt-7 pb-10 sm:pb-16 space-y-6 sm:space-y-10">
      {/* 3D GLB Model + Explore Our Products Header with Glass Folders & Heirloom Details */}
      <ProductHero3DSection />
    </div>
  );
}

