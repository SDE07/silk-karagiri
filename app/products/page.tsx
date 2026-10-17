import React from "react";
import { ProductHero3DSection } from "@/components/product/ProductHero3DSection";

export default function ProductsPage() {
  return (
    <div className="w-full lg:w-[94%] xl:w-[92%] max-w-[1850px] mx-auto px-2.5 sm:px-5 lg:px-6 pt-3.5 sm:pt-6 pb-12 sm:pb-20 space-y-6 sm:space-y-10">
      {/* Flagship Interactive 3D GLB Vault + Glass Folders & Heirloom Saree Spotlight */}
      <ProductHero3DSection />
    </div>
  );
}

