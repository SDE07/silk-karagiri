"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Plus,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Star,
  AlertTriangle,
  Layers,
  XCircle,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableToggle,
  AdminTableEmpty,
  AdminSearchBar,
} from "@/components/admin/AdminTable";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const initialStatus =
    searchParams.get("status") === "active"
      ? "active"
      : searchParams.get("status") === "low_stock"
      ? "low_stock"
      : "all";

  const { products, toggleProductStock, updateProduct, deleteProduct } = useAdmin();
  const [filterTab, setFilterTab] = useState<"all" | "active" | "low_stock">(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");

  const lowStockCount = products.filter(
    (p) => (p.stockQuantity ?? (p.inStock ? 10 : 0)) < 5
  ).length;

  const filteredProducts = products.filter((p) => {
    const qty = p.stockQuantity ?? (p.inStock ? 10 : 0);
    const matchesTab =
      filterTab === "all" ||
      (filterTab === "active" && p.inStock) ||
      (filterTab === "low_stock" && qty < 5);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.fabric && p.fabric.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleAdjustQuantity = (productId: string, currentQty: number, change: number) => {
    const newQty = Math.max(0, currentQty + change);
    updateProduct(productId, {
      stockQuantity: newQty,
      inStock: newQty > 0,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs mt-0.5">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Products & Handloom Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage pure silk sarees, track real-time available stock quantities, and control storefront availability.
            </p>
          </div>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-xs transition-all hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              filterTab === "all"
                ? "bg-[#0284c7] text-white border-[#0284c7] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("active")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterTab === "active"
                ? "bg-[#0284c7] text-white border-[#0284c7] shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Active Products ({products.filter((p) => p.inStock).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("low_stock")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterTab === "low_stock"
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-white text-rose-700 border-rose-200 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Low / Out of Stock (&lt;5)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                filterTab === "low_stock"
                  ? "bg-white text-rose-700"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {lowStockCount}
            </span>
          </button>
        </div>

        {/* Common Search Bar */}
        <div className="w-full sm:w-72">
          <AdminSearchBar
            query={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search title, fabric, SKU..."
          />
        </div>
      </div>

      {/* Common Admin Table */}
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHead>Product</AdminTableHead>
          <AdminTableHead>Category & Fabric</AdminTableHead>
          <AdminTableHead>Price</AdminTableHead>
          <AdminTableHead>Available Quantity</AdminTableHead>
          <AdminTableHead>Storefront Status</AdminTableHead>
          <AdminTableHead>Client Reviews</AdminTableHead>
          <AdminTableHead align="right">Actions</AdminTableHead>
        </AdminTableHeader>

        <AdminTableBody>
          {filteredProducts.length === 0 ? (
            <AdminTableEmpty
              title="No products found"
              message="No sarees or catalog drapes match your filter criteria."
              colSpan={7}
            />
          ) : (
            filteredProducts.map((product) => {
              const qty = product.stockQuantity ?? (product.inStock ? 10 : 0);
              const isLowStock = qty > 0 && qty <= 4;
              const isOutOfStock = qty === 0 || !product.inStock;

              return (
                <AdminTableRow key={product.id}>
                  {/* Thumbnail & Title */}
                  <AdminTableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">
                          {product.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono block">
                          {product.sku || product.id}
                        </span>
                      </div>
                    </div>
                  </AdminTableCell>

                  {/* Category & Fabric */}
                  <AdminTableCell>
                    <span className="font-semibold text-slate-800 block">{product.category}</span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[160px]">
                      {product.fabric || "Pure Mulberry Silk"}
                    </span>
                  </AdminTableCell>

                  {/* Price */}
                  <AdminTableCell>
                    <span className="font-bold text-slate-900 block text-sm">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </AdminTableCell>

                  {/* Available Quantity Column with Stepper & High-Visibility Alert */}
                  <AdminTableCell>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Stock Not Available (0 Units)</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border-2 border-rose-400 shadow-xs animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Critical Stock: Only {qty} Left! (&lt;5)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{qty} Units In Stock</span>
                          </span>
                        )}
                      </div>

                      {/* Quick Quantity Adjuster */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleAdjustQuantity(product.id, qty, -1)}
                          title="Decrease stock"
                          className="h-5 w-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono text-slate-800 font-semibold min-w-5 text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdjustQuantity(product.id, qty, 1)}
                          title="Increase stock"
                          className="h-5 w-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                        >
                          +
                        </button>
                        <span className="text-[10px] text-slate-400">in stock</span>
                      </div>
                    </div>
                  </AdminTableCell>

                  {/* Storefront Stock Toggle Switch */}
                  <AdminTableCell>
                    <AdminTableToggle
                      active={product.inStock}
                      onToggle={() => toggleProductStock(product.id)}
                      label={product.inStock ? "Active on Looms" : "Unlisted / Off"}
                    />
                  </AdminTableCell>

                  {/* Rating & Review Count */}
                  <AdminTableCell>
                    <div className="flex items-center gap-1 text-slate-800 font-semibold">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{product.rating || 4.9}</span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({product.reviewCount || 24} reviews)
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Actions */}
                  <AdminTableCell align="right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <Link
                        href={`/products`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        title="View on storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete ${product.name} from catalog?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
