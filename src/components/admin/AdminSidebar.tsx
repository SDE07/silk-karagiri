"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Coins,
  Ticket,
  Layers,
  Package,
  PlusCircle,
  CheckCircle2,
  Settings,
  Store,
  LogOut,
  ChevronDown,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (route: string) => {
    if (route === "/admin/dashboard" && (pathname === "/admin" || pathname === "/admin/dashboard")) {
      return true;
    }
    return pathname === route;
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-[#0a101f] text-slate-300 border-r border-[#1e293b] flex flex-col justify-between z-30 selection:bg-[#b8862b]/30">
      {/* Brand Banner (Pinned Top) */}
      <div className="p-4 border-b border-[#1e293b] flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#6b1426] flex items-center justify-center text-white font-bold text-base shadow-md shadow-cyan-950/40 border border-cyan-400/30">
          SK
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm tracking-tight leading-tight">
            Silk Karagiri
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 font-medium">
              Commerce Suite
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections (Scrollable Middle) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6 text-xs font-medium">
          {/* Section 1: CORE & ANALYTICS */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Core & Analytics
            </span>

            {/* Dashboard */}
            <Link
              href="/admin/dashboard"
              prefetch={true}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all",
                isActive("/admin/dashboard")
                  ? "bg-[#142342] text-white font-semibold shadow-xs border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </Link>

            {/* Orders */}
            <Link
              href="/admin/orders"
              prefetch={true}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all",
                isActive("/admin/orders")
                  ? "bg-[#142342] text-white font-semibold shadow-xs border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span>Orders</span>
            </Link>

            {/* Benchmark Pill */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-[#b8862b]" />
                <span className="text-slate-300">Silk Benchmark</span>
              </div>
              <span className="bg-[#b8862b]/20 text-[#e6b965] border border-[#b8862b]/30 px-1.5 py-0.5 rounded text-[10px] font-bold">
                ₹28.5k/drape
              </span>
            </div>

            {/* Coupons & Offers */}
            <Link
              href="/admin/coupons"
              prefetch={true}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all",
                isActive("/admin/coupons")
                  ? "bg-[#142342] text-white font-semibold shadow-xs border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              <span>Coupons & Offers</span>
            </Link>
          </div>

          {/* Section 2: INVENTORY & CATALOG */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Inventory & Catalog
            </span>

            {/* Categories (Clean direct link, removed subcategories button) */}
            <Link
              href="/admin/categories"
              prefetch={true}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all",
                isActive("/admin/categories")
                  ? "bg-[#142342] text-white font-semibold shadow-xs border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Categories</span>
            </Link>

            {/* Products Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setProductsOpen(!productsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>Products</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                    productsOpen && "rotate-180"
                  )}
                />
              </button>

              {productsOpen && (
                <div className="pl-9 pr-2 py-1 space-y-1">
                  <Link
                    href="/admin/products"
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors",
                      isActive("/admin/products")
                        ? "text-cyan-300 bg-slate-800/60 font-medium"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <span>All Products</span>
                  </Link>
                  <Link
                    href="/admin/products?status=active"
                    prefetch={true}
                    className="flex items-center gap-2 py-1.5 px-2 rounded-md text-slate-400 hover:text-white transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Active Products</span>
                  </Link>
                  <Link
                    href="/admin/products/new"
                    prefetch={true}
                    className={cn(
                      "flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors",
                      isActive("/admin/products/new")
                        ? "text-cyan-300 bg-slate-800/60 font-medium"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <PlusCircle className="w-3 h-3 text-cyan-400" />
                    <span>Add New Product</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: STOREFRONT CMS */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Storefront CMS
            </span>

            {/* Website Settings */}
            <Link
              href="/admin/settings"
              prefetch={true}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all",
                isActive("/admin/settings")
                  ? "bg-[#142342] text-white font-semibold shadow-xs border border-cyan-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Website Settings</span>
            </Link>

            {/* Preview Storefront */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-cyan-400" />
                <span>Preview Storefront</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

      {/* Bottom User Profile & Sign Out Bar (Pinned Bottom - Always Visible) */}
      <div className="p-3 border-t border-[#1e293b] bg-[#070c18] shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#0b1322] border border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative h-8 w-8 rounded-lg bg-[#0d3b4c] text-[#f7e7ce] flex items-center justify-center font-bold text-xs shrink-0 border border-[#b8862b]/30 shadow-xs">
              SK
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#070c18]" />
            </div>
            <div className="overflow-hidden">
              <span className="text-white text-xs font-semibold block truncate">
                Master Weaver
              </span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                admin@silkkaragiri.com
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign out of Admin Suite"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            <LogOut className={cn("w-4 h-4 transition-transform", isLoggingOut ? "animate-pulse text-rose-500" : "hover:-translate-x-0.5")} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
