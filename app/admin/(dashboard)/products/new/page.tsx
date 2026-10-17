"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Sparkles,
  CheckCircle2,
  Package,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { ProductCategory } from "@/types/product.types";

export default function AdminAddProductPage() {
  const router = useRouter();
  const { addProduct, categories } = useAdmin();

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Sarees");
  const [fabric, setFabric] = useState("Pure Mulberry Silk");
  const [motif, setMotif] = useState("Zari Buttas & Floral Jaal");
  const [border, setBorder] = useState("Contrast Gold Zari Border");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [price, setPrice] = useState<number>(28500);
  const [originalPrice, setOriginalPrice] = useState<number>(34000);
  const [stockQuantity, setStockQuantity] = useState<number>(12);
  const [sku, setSku] = useState("");
  const [inStock, setInStock] = useState(true);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80");
  const [badge, setBadge] = useState("Heritage");
  const [tagsInput, setTagsInput] = useState("Silk Mark, Pure Zari, Handloom");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, "-")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl.trim() || !price) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addProduct({
      name: name.trim(),
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      description: description.trim() || `${fabric} drape adorned with ${motif}.`,
      story: story.trim() || `${name} crafted by master artisans with authentic ${border}.`,
      fabric,
      motif,
      border,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      inStock,
      stockQuantity: Number(stockQuantity),
      image: imageUrl.trim(),
      images: [imageUrl.trim()],
      badge: badge || undefined,
      sku: sku.trim() || `SK-${slug.slice(0, 6).toUpperCase()}-01`,
      rating: 4.9,
      reviewCount: 1,
      tags,
    });

    router.push("/admin/products");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Add New Heirloom Product
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Create a new handloom saree, scarf, or silk piece with complete drape specifications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: PRODUCT IMAGES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ImageIcon className="w-4 h-4 text-cyan-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              1. Product Imagery & Visuals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {/* Live Preview Container */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-xs font-medium">Image Preview</span>
                </div>
              )}
            </div>

            {/* Image Inputs */}
            <div className="md:col-span-2 space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Primary Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-cyan-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Paste high-resolution WebP, JPG, or PNG URL (e.g. Unsplash or `/images/collections/...`)
                </span>
              </div>

              {/* Sample Preset Images for Fast Demo Selection */}
              <div>
                <span className="block text-slate-600 font-semibold mb-2 text-[11px] uppercase tracking-wider">
                  Quick Image Presets:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(url)}
                      className={`relative h-14 w-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                        imageUrl === url ? "border-cyan-500 ring-2 ring-cyan-100" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={url} alt={`Preset ${i}`} fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCT INFORMATION */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              2. Product Details & Weave Lore
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Kanchipuram Pure Gold Zari Saree"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 text-sm font-semibold focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kanchipuram-gold-zari-saree"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-600 font-mono focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white"
              >
                <option value="Sarees">Sarees</option>
                <option value="Scarves">Scarves & Stoles</option>
                <option value="Fabrics">Fabrics & Yardage</option>
                <option value="Apparel">Apparel & Kurtas</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Fabric Type</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. Pure Kanjivaram Mulberry Silk"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Motif / Weave Pattern</label>
              <input
                type="text"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="e.g. Mayil (Peacock) & Rudraksha"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Border Specification</label>
              <input
                type="text"
                value={border}
                onChange={(e) => setBorder(e.target.value)}
                placeholder="e.g. Korvai Contrast Gold Zari Border"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Short Description (for cards)</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Handwoven pure mulberry silk crafted with 3-ply twisted silk yarn..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Heirloom Story (for detail page)</label>
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Handcrafted on pit looms in the holy weaving clusters..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: PRICING & INVENTORY */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              3. Pricing & Inventory Control
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Original MRP (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-600"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-slate-700 font-semibold mb-1">
                Available Quantity (Units)
              </label>
              <input
                type="number"
                required
                min={0}
                value={stockQuantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStockQuantity(val);
                  if (val === 0) setInStock(false);
                  else if (!inStock && val > 0) setInStock(true);
                }}
                className={`w-full px-3 py-2 border rounded-lg font-bold text-sm ${
                  stockQuantity === 0
                    ? "border-rose-400 bg-rose-50/40 text-rose-800"
                    : stockQuantity < 5
                    ? "border-amber-400 bg-amber-50/40 text-amber-900"
                    : "border-slate-200 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="e.g. SK-KANJ-08"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Real-time Inventory Alert Feedback Banner */}
          {stockQuantity === 0 ? (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2.5">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold text-rose-900">Stock Not Available (0 Units)</span> — This saree will automatically be unlisted from customer checkout on the storefront.
              </div>
            </div>
          ) : stockQuantity < 5 ? (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-900 text-xs font-semibold flex items-center gap-2.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold">Critical Low Stock Alert (&lt;5 Units): Only {stockQuantity} unit{stockQuantity > 1 ? "s" : ""} left!</span> — Flagged for emergency replenishment by loom master.
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Optimal Loom Stock: {stockQuantity} units ready for immediate storefront dispatch.</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="stockCheckbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="stockCheckbox" className="text-slate-800 font-semibold text-xs cursor-pointer">
              Mark this saree as Active & In-Stock immediately
            </label>
          </div>
        </div>

        {/* SECTION 4: METADATA & BADGES */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Tag className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              4. Curation Badges & Tags
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Display Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white"
              >
                <option value="Heritage">Heritage</option>
                <option value="Bridal">Bridal</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Trending">Trending</option>
                <option value="Exclusive">Exclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Search & Filter Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Silk Mark, Pure Zari, Handloom"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-cyan-950/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Product to Storefront</span>
          </button>
        </div>
      </form>
    </div>
  );
}
