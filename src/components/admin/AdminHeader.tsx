"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Store, ExternalLink, ShieldCheck, Tag, LogOut, ChevronDown, User, Settings, Database } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { settings } = useAdmin();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Generate breadcrumb title from path
  const getBreadcrumbTitle = () => {
    if (!pathname || pathname === "/admin" || pathname === "/admin/dashboard") {
      return "Dashboard";
    }
    if (pathname.includes("/coupons")) return "Coupons";
    if (pathname.includes("/orders")) return "Orders";
    if (pathname.includes("/categories")) return "Categories";
    if (pathname.includes("/products/new")) return "Products / Add New";
    if (pathname.includes("/products")) return "Products";
    if (pathname.includes("/settings")) return "Website Settings";
    return "Overview";
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200/90 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="text-slate-400">Admin</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{getBreadcrumbTitle()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Silk Benchmark Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-amber-50/80 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          <span>Pure Silk: ₹{settings.silkRatePerDrape.toLocaleString("en-IN")}/drape</span>
        </div>

        {/* Storefront Button */}
        <Link
          href="/"
          target="_blank"
          prefetch={false}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs"
        >
          <Store className="w-3.5 h-3.5 text-cyan-600" />
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:bg-slate-50 p-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#0d3b4c] text-[#f7e7ce] flex items-center justify-center font-bold text-xs ring-2 ring-[#b8862b]/30 shadow-xs">
              SK
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Master Weaver
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-600 font-medium">Super Admin</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Interactive Profile Dropdown Popover */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 p-3 z-50 animate-fadeIn space-y-3">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d3b4c] text-[#f7e7ce] flex items-center justify-center font-bold text-sm">
                  SK
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    Master Weaver
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block truncate">
                    admin@silkkaragiri.com
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs font-medium">
                <Link
                  href="/admin/settings"
                  prefetch={true}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Website Settings</span>
                </Link>

                <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 text-[11px]">
                  <span className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Database Engine</span>
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">MySQL 8.0</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200 cursor-pointer disabled:opacity-50"
                >
                  <LogOut className={`w-3.5 h-3.5 ${isLoggingOut ? "animate-pulse" : ""}`} />
                  <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Header Sign Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign out of Admin Suite"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <LogOut className={`w-3.5 h-3.5 ${isLoggingOut ? "animate-pulse" : ""}`} />
          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
