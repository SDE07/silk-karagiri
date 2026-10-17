"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Ticket,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Clock,
  CheckCircle,
  CheckCircle2,
  Truck,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Activity,
  Award,
  RefreshCw,
  Eye,
  Filter,
  BarChart3,
  PieChart,
  MapPin,
  Compass,
  Users,
  AlertTriangle,
  XCircle,
  X,
  Check,
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
  AdminTableEmpty,
} from "@/components/admin/AdminTable";

export type TimeRange =
  | "today"
  | "yesterday"
  | "7d"
  | "month"
  | "year"
  | "custom_month"
  | "custom_date";

export const MONTH_OPTIONS = [
  "Jan 2026",
  "Feb 2026",
  "Mar 2026",
  "Apr 2026",
  "May 2026",
  "Jun 2026",
  "Jul 2026",
  "Aug 2026",
  "Sep 2026",
  "Oct 2026",
  "Nov 2026",
  "Dec 2026",
];

interface TelemetryPoint {
  label: string;
  revenue: number;
  orders: number;
  fulfilled: number;
}

export default function AdminDashboardPage() {
  const { products, orders, coupons, settings, updateProduct } = useAdmin();
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [selectedMonth, setSelectedMonth] = useState<string>("Oct 2026");
  const [selectedDate, setSelectedDate] = useState<string>("2026-10-16");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [restockToast, setRestockToast] = useState<string | null>(null);

  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null);
  const [hoveredBar, setHoveredBar] = useState<TelemetryPoint | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "delivered">("all");

  // Critical Inventory (< 5 units or 0 units)
  const criticalProducts = useMemo(() => {
    return products.filter((p) => {
      const qty = p.stockQuantity ?? (p.inStock ? 10 : 0);
      return qty < 5;
    });
  }, [products]);

  const handleQuickRestock = (productId: string, addQty: number) => {
    const prod = products.find((p) => p.id === productId);
    const curQty = prod?.stockQuantity ?? (prod?.inStock ? 10 : 0);
    const newQty = curQty + addQty;
    updateProduct(productId, {
      stockQuantity: newQty,
      inStock: true,
    });
    setRestockToast(`Restocked ${prod?.name || "saree"} to ${newQty} units!`);
    setTimeout(() => setRestockToast(null), 3500);
  };

  // Dynamic Telemetry dataset mapped by advanced timeframe selection
  const telemetryData = useMemo<TelemetryPoint[]>(() => {
    if (timeRange === "today") {
      return [
        { label: "09:00", revenue: 8500, orders: 1, fulfilled: 1 },
        { label: "11:00", revenue: 29500, orders: 2, fulfilled: 2 },
        { label: "13:00", revenue: 18200, orders: 2, fulfilled: 2 },
        { label: "15:00", revenue: 12500, orders: 1, fulfilled: 1 },
        { label: "17:00", revenue: 42000, orders: 3, fulfilled: 2 },
        { label: "19:00", revenue: 38400, orders: 2, fulfilled: 2 },
        { label: "21:00", revenue: 24000, orders: 2, fulfilled: 2 },
      ];
    }
    if (timeRange === "yesterday") {
      return [
        { label: "09:00", revenue: 12000, orders: 1, fulfilled: 1 },
        { label: "11:00", revenue: 24500, orders: 2, fulfilled: 2 },
        { label: "13:00", revenue: 14000, orders: 1, fulfilled: 1 },
        { label: "15:00", revenue: 22000, orders: 2, fulfilled: 2 },
        { label: "17:00", revenue: 36000, orders: 2, fulfilled: 2 },
        { label: "19:00", revenue: 48000, orders: 3, fulfilled: 3 },
        { label: "21:00", revenue: 18500, orders: 1, fulfilled: 1 },
      ];
    }
    if (timeRange === "7d") {
      return [
        { label: "Oct 11", revenue: 34500, orders: 2, fulfilled: 2 },
        { label: "Oct 12", revenue: 52000, orders: 3, fulfilled: 3 },
        { label: "Oct 13", revenue: 44000, orders: 2, fulfilled: 2 },
        { label: "Oct 14", revenue: 78500, orders: 4, fulfilled: 4 },
        { label: "Oct 15", revenue: 61000, orders: 3, fulfilled: 3 },
        { label: "Oct 16", revenue: 68500, orders: 3, fulfilled: 3 },
        { label: "Oct 17", revenue: 84000, orders: 4, fulfilled: 4 },
      ];
    }
    if (timeRange === "month") {
      return [
        { label: "Sep 20", revenue: 24500, orders: 1, fulfilled: 1 },
        { label: "Sep 24", revenue: 48000, orders: 2, fulfilled: 2 },
        { label: "Sep 28", revenue: 32500, orders: 2, fulfilled: 2 },
        { label: "Oct 02", revenue: 64200, orders: 3, fulfilled: 3 },
        { label: "Oct 06", revenue: 89000, orders: 4, fulfilled: 3 },
        { label: "Oct 10", revenue: 54000, orders: 2, fulfilled: 2 },
        { label: "Oct 14", revenue: 78500, orders: 3, fulfilled: 3 },
        { label: "Oct 17", revenue: 66749, orders: 4, fulfilled: 4 },
      ];
    }
    if (timeRange === "custom_month") {
      // 4 Weekly intervals for the selected month
      const prefix = selectedMonth.split(" ")[0];
      return [
        { label: `${prefix} W1`, revenue: 82000, orders: 4, fulfilled: 4 },
        { label: `${prefix} W2`, revenue: 115000, orders: 6, fulfilled: 5 },
        { label: `${prefix} W3`, revenue: 98000, orders: 5, fulfilled: 5 },
        { label: `${prefix} W4`, revenue: 142000, orders: 7, fulfilled: 7 },
      ];
    }
    if (timeRange === "custom_date") {
      // Hourly breakdown for custom picked day
      const dayLabel = selectedDate ? selectedDate.slice(5) : "Day";
      return [
        { label: `${dayLabel} 10h`, revenue: 14500, orders: 1, fulfilled: 1 },
        { label: `${dayLabel} 12h`, revenue: 28000, orders: 2, fulfilled: 2 },
        { label: `${dayLabel} 14h`, revenue: 21500, orders: 1, fulfilled: 1 },
        { label: `${dayLabel} 16h`, revenue: 35000, orders: 2, fulfilled: 2 },
        { label: `${dayLabel} 18h`, revenue: 49000, orders: 3, fulfilled: 3 },
        { label: `${dayLabel} 20h`, revenue: 31000, orders: 2, fulfilled: 2 },
      ];
    }
    // Annual / Year
    return [
      { label: "Nov 25", revenue: 185000, orders: 8, fulfilled: 8 },
      { label: "Dec 25", revenue: 245000, orders: 11, fulfilled: 11 },
      { label: "Jan 26", revenue: 298000, orders: 13, fulfilled: 13 },
      { label: "Feb 26", revenue: 165000, orders: 7, fulfilled: 7 },
      { label: "Mar 26", revenue: 210000, orders: 9, fulfilled: 9 },
      { label: "Apr 26", revenue: 320000, orders: 14, fulfilled: 13 },
      { label: "May 26", revenue: 275000, orders: 12, fulfilled: 12 },
      { label: "Jun 26", revenue: 195000, orders: 8, fulfilled: 8 },
      { label: "Jul 26", revenue: 225000, orders: 10, fulfilled: 10 },
      { label: "Aug 26", revenue: 340000, orders: 15, fulfilled: 14 },
      { label: "Sep 26", revenue: 380000, orders: 17, fulfilled: 16 },
      { label: "Oct 26", revenue: 457490, orders: 20, fulfilled: 19 },
    ];
  }, [timeRange, selectedMonth, selectedDate]);

  // Derived calculations
  const totalRevenue = useMemo(() => {
    return telemetryData.reduce((acc, p) => acc + p.revenue, 0);
  }, [telemetryData]);

  const totalPeriodOrders = useMemo(() => {
    return telemetryData.reduce((acc, p) => acc + p.orders, 0);
  }, [telemetryData]);

  const avgOrderValue = useMemo(() => {
    return totalPeriodOrders > 0 ? Math.round(totalRevenue / totalPeriodOrders) : 0;
  }, [totalRevenue, totalPeriodOrders]);

  const activeProductsCount = products.filter((p) => p.inStock).length;
  const activeCouponsCount = coupons.filter((c) => c.isActive).length;

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    if (orderFilter === "pending") return orders.filter((o) => o.status === "pending");
    if (orderFilter === "delivered") return orders.filter((o) => o.status === "delivered");
    return orders;
  }, [orders, orderFilter]);

  // Graph 1: Revenue Spline Coordinate Calculations
  const maxRevenue = Math.max(...telemetryData.map((d) => d.revenue), 10000);
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;

  const points = useMemo(() => {
    const usableWidth = chartWidth - paddingX * 2;
    const usableHeight = chartHeight - paddingY * 2;
    return telemetryData.map((d, index) => {
      const x = paddingX + (index / (telemetryData.length - 1)) * usableWidth;
      const y = chartHeight - paddingY - (d.revenue / maxRevenue) * usableHeight;
      return { x, y, data: d };
    });
  }, [telemetryData, maxRevenue]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${pathD} L ${last.x} ${chartHeight - paddingY} L ${first.x} ${chartHeight - paddingY} Z`;
  }, [pathD, points]);

  // Graph 2: Bar Chart max orders
  const maxOrders = Math.max(...telemetryData.map((d) => d.orders), 5);

  const periodRevenueLabel = useMemo(() => {
    if (timeRange === "today") return "Today's Revenue";
    if (timeRange === "yesterday") return "Yesterday's Revenue";
    if (timeRange === "7d") return "7-Day Revenue";
    if (timeRange === "month") return "30-Day Revenue";
    if (timeRange === "year") return "Annual Revenue";
    if (timeRange === "custom_month") return `${selectedMonth} Revenue`;
    if (timeRange === "custom_date") return `${selectedDate} Revenue`;
    return "Period Revenue";
  }, [timeRange, selectedMonth, selectedDate]);

  return (
    <div className="space-y-7 max-w-7xl mx-auto selection:bg-[#b8862b]/20 relative">
      {/* Restock Confirmation Toast */}
      {restockToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-sky-400 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{restockToast}</span>
        </div>
      )}

      {/* 1. Header & Live Time-Range Switcher Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading-main">
              Executive Telemetry & Analytics Dashboard
            </h1>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-ui">
            Multi-loom master production, live client checkout velocity, and pan-India sales
          </p>
        </div>

        {/* Action Controls & Advanced Time Range Filter Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Preset Buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setTimeRange("today");
                setIsFilterDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === "today"
                  ? "bg-white text-[#0d3b4c] shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeRange("yesterday");
                setIsFilterDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === "yesterday"
                  ? "bg-white text-[#0d3b4c] shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeRange("month");
                setIsFilterDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === "month"
                  ? "bg-white text-[#0d3b4c] shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              This Month (30D)
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeRange("year");
                setIsFilterDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === "year"
                  ? "bg-white text-[#0d3b4c] shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Annual
            </button>
          </div>

          {/* Advanced Date & Month Picker Dropdown (Shadcn UI style) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                timeRange === "custom_month" || timeRange === "custom_date" || timeRange === "7d"
                  ? "bg-sky-50 text-[#0284c7] border-sky-300 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>
                {timeRange === "custom_month"
                  ? selectedMonth
                  : timeRange === "custom_date"
                  ? selectedDate
                  : timeRange === "7d"
                  ? "Last 7 Days"
                  : "Filter Date / Month"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-84 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Filter className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span>Advanced Telemetry Filter</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFilterDropdownOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Section A: Quick Select Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quick Preset Range
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("today");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-all ${
                        timeRange === "today"
                          ? "bg-[#0284c7] text-white font-bold"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Today (Live)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("yesterday");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-all ${
                        timeRange === "yesterday"
                          ? "bg-[#0284c7] text-white font-bold"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Yesterday
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("7d");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-all ${
                        timeRange === "7d"
                          ? "bg-[#0284c7] text-white font-bold"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Last 7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("month");
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-medium transition-all ${
                        timeRange === "month"
                          ? "bg-[#0284c7] text-white font-bold"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Last 30 Days
                    </button>
                  </div>
                </div>

                {/* Section B: 12-Month Selector Grid */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Select Specific Month
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[11px]">
                    {MONTH_OPTIONS.map((m) => {
                      const isSelected = timeRange === "custom_month" && selectedMonth === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setSelectedMonth(m);
                            setTimeRange("custom_month");
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`py-1.5 px-1 rounded-md text-center transition-all cursor-pointer font-semibold ${
                            isSelected
                              ? "bg-[#0284c7] text-white shadow-xs"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {m.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section C: Pick Specific Date */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pick Single Specific Date
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono w-full focus:outline-hidden focus:border-[#0284c7]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("custom_date");
                        setIsFilterDropdownOpen(false);
                      }}
                      className="px-3 py-1.5 bg-[#0284c7] text-white rounded-lg text-xs font-bold hover:bg-[#0369a1] whitespace-nowrap cursor-pointer shadow-xs"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/admin/products/new"
            prefetch={true}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 2. Top 4 Core Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {periodRevenueLabel}
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-ui">
              {formatPrice(totalRevenue)}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+24.6% vs previous period</span>
            </div>
          </div>
          <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
          </div>
        </div>

        {/* Card 2: Period Order Volume */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Order Volume
            </span>
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-ui">
              {totalPeriodOrders} Orders
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-cyan-700 font-semibold">
              <span>Avg Value: {formatPrice(avgOrderValue)}</span>
            </div>
          </div>
          <div className="h-1 w-full bg-cyan-100 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full w-[65%]" />
          </div>
        </div>

        {/* Card 3: Loom Inventory Units & Critical Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Loom Inventory
            </span>
            <div
              className={`p-2 rounded-xl ${
                criticalProducts.length > 0
                  ? "bg-rose-50 text-rose-600 animate-pulse"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-ui">
              {products.reduce((sum, p) => sum + (p.stockQuantity ?? (p.inStock ? 10 : 0)), 0)} Units
            </h3>
            {criticalProducts.length > 0 ? (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-rose-600 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{criticalProducts.length} drapes critical (&lt;5 units)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All catalog drapes stocked</span>
              </div>
            )}
          </div>
          <div className="h-1 w-full bg-amber-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                criticalProducts.length > 0 ? "bg-rose-500 w-[60%]" : "bg-amber-500 w-[82%]"
              }`}
            />
          </div>
        </div>

        {/* Card 4: Storefront Offers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Offers
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-ui">
              {activeCouponsCount} Active
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-purple-700 font-semibold">
              <span>{coupons.length} total promo campaigns</span>
            </div>
          </div>
          <div className="h-1 w-full bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full w-[70%]" />
          </div>
        </div>
      </div>

      {/* 3. DUAL GRAPH SECTION: Graph 1 (Revenue Curve) & Graph 2 (Order Volumes Histogram) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRAPH 1: Revenue Velocity Spline (Span 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0284c7]" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight font-heading-main">
                  Sales Velocity Curve
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Gross drape sales trajectory across {timeRange === "today" || timeRange === "yesterday" || timeRange === "custom_date" ? "hourly checkpoints" : timeRange === "month" || timeRange === "7d" ? "daily intervals" : "period milestones"}
              </p>
            </div>

            {/* Hover Legend */}
            <div className="text-xs font-medium">
              {hoveredPoint ? (
                <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-lg text-cyan-900 font-semibold animate-fadeIn">
                  <span>{hoveredPoint.label}:</span>
                  <span className="font-bold text-[#0284c7]">{formatPrice(hoveredPoint.revenue)}</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Hover points to inspect</span>
              )}
            </div>
          </div>

          {/* Scalable Vector SVG Curve */}
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-52 sm:h-56 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#b8862b" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#b8862b" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.33, 0.66, 1].map((ratio) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                const val = Math.round(maxRevenue * ratio);
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      ₹{(val / 1000).toFixed(0)}k
                    </text>
                  </g>
                );
              })}

              <path d={areaD} fill="url(#revGrad)" />
              <path
                d={pathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((pt, i) => {
                const isHovered = hoveredPoint?.label === pt.data.label;
                return (
                  <g key={i} className="cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(pt.data)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 3.5}
                      fill={isHovered ? "#b8862b" : "#0284c7"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fill={isHovered ? "#0d3b4c" : "#94a3b8"}
                      fontWeight={isHovered ? "bold" : "normal"}
                      fontSize="9.5"
                    >
                      {pt.data.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* GRAPH 2: Order Volume Histogram Bar Chart (Span 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0284c7]" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight font-heading-main">
                  Order Fulfillment Volume
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Completed vs dispatch orders
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10.5px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-[#0284c7] to-[#38bdf8]" />
                <span>Orders</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Bars with Luxury Shadcn UI Gradient */}
          <div className="h-52 sm:h-56 flex items-end justify-between gap-1.5 pt-4 px-2">
            {telemetryData.map((d, idx) => {
              const heightPct = Math.max((d.orders / maxOrders) * 100, 12);
              const isHovered = hoveredBar?.label === d.label;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBar(d)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  {/* Tooltip on Hover */}
                  <div className="relative w-full flex justify-center">
                    {isHovered && (
                      <div className="absolute -top-12 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-mono whitespace-nowrap z-20 shadow-xl border border-sky-400/40 flex flex-col items-center">
                        <span className="font-bold text-sky-300">{d.orders} orders</span>
                        <span className="text-[9px] text-slate-300">₹{(d.revenue / 1000).toFixed(1)}k rev</span>
                      </div>
                    )}
                  </div>

                  {/* Vertical Column Bar with Luxury Gradient */}
                  <div className="w-full max-w-[28px] h-36 bg-gradient-to-b from-slate-100 to-slate-50/70 rounded-lg flex items-end overflow-hidden p-0.5 border border-slate-200/50 shadow-inner">
                    <div
                      className={`w-full rounded-md transition-all duration-300 relative ${
                        isHovered
                          ? "bg-gradient-to-t from-[#b8862b] via-[#d4af37] to-[#fef08a] shadow-[0_0_14px_rgba(184,134,43,0.6)]"
                          : "bg-gradient-to-t from-[#0d3b4c] via-[#0284c7] to-[#38bdf8] shadow-[0_2px_8px_rgba(2,132,199,0.3)]"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    >
                      {/* Top cap highlight line */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/40 rounded-t-md" />
                    </div>
                  </div>

                  {/* Bottom Label */}
                  <span className={`text-[9px] truncate max-w-[36px] ${isHovered ? "text-slate-900 font-bold" : "text-slate-400"}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. DUAL SECTION: Graph 3 (Client Acquisition Donut) & Graph 4 (Geographic State Demand) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GRAPH 3: Acquisition & Channel Radial Donut (Span 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#0d3b4c]" />
              <h3 className="font-bold text-slate-900 text-sm font-heading-main">
                Client Acquisition Channels
              </h3>
            </div>
            <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              100% Direct
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-2">
            {/* SVG Donut Ring */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Channel 1: WhatsApp Concierge (42%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0284c7"
                  strokeWidth="14"
                  strokeDasharray="100 139"
                  strokeDashoffset="0"
                />
                {/* Channel 2: Direct Boutique (30%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#b8862b"
                  strokeWidth="14"
                  strokeDasharray="72 167"
                  strokeDashoffset="-100"
                />
                {/* Channel 3: Bridal Instagram (18%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="43 196"
                  strokeDashoffset="-172"
                />
                {/* Channel 4: Referrals (10%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="14"
                  strokeDasharray="24 215"
                  strokeDashoffset="-215"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-900 leading-tight">4 Channels</span>
                <span className="text-[9px] text-slate-400 font-mono">Verified</span>
              </div>
            </div>

            {/* Channel Breakdown List */}
            <div className="w-full space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                  <span>WhatsApp Concierge</span>
                </span>
                <span className="font-bold text-slate-900">42%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b8862b]" />
                  <span>Direct Boutique</span>
                </span>
                <span className="font-bold text-slate-900">30%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span>Heritage Campaigns</span>
                </span>
                <span className="font-bold text-slate-900">18%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                  <span>Word of Mouth & NRI</span>
                </span>
                <span className="font-bold text-slate-900">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRAPH 4: Geographic Drape Deliveries Across India (Span 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm font-heading-main">
                Regional Indian Drape Demand & Deliveries
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono font-semibold">
              Pan-India Insured Dispatch
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { state: "Maharashtra (Mumbai, Pune, Nagpur)", drapes: "84 Drapes", rev: "₹2,45,000", pct: 84, color: "bg-[#0d3b4c]" },
              { state: "Karnataka (Bangalore, Mysore)", drapes: "62 Drapes", rev: "₹1,82,000", pct: 64, color: "bg-[#0284c7]" },
              { state: "Tamil Nadu (Chennai, Kanchipuram)", drapes: "51 Drapes", rev: "₹1,48,000", pct: 52, color: "bg-[#b8862b]" },
              { state: "Delhi NCR & North Zone", drapes: "38 Drapes", rev: "₹1,12,000", pct: 40, color: "bg-emerald-500" },
              { state: "Telangana & Gujarat", drapes: "32 Drapes", rev: "₹94,000", pct: 33, color: "bg-purple-500" },
            ].map((reg) => (
              <div key={reg.state} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{reg.state}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500 text-[11px]">{reg.drapes}</span>
                    <span className="font-bold text-slate-900">{reg.rev}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${reg.color} rounded-full transition-all duration-500`}
                    style={{ width: `${reg.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Critical Loom Inventory Alerts & Instant Replenishment (< 5 and 0 units) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${criticalProducts.length > 0 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-emerald-50 text-emerald-600"}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-heading-main">
                  Critical Loom Inventory & Stockout Warnings (&lt; 5 Units)
                </h2>
                {criticalProducts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-xs">
                    {criticalProducts.length} Alert{criticalProducts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic silk drapes requiring priority replenishment to avoid storefront order disruption
              </p>
            </div>
          </div>

          <Link
            href="/admin/products?status=low_stock"
            prefetch={true}
            className="text-xs font-semibold text-[#0284c7] hover:underline"
          >
            Manage all inventory &rarr;
          </Link>
        </div>

        {criticalProducts.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">All Loom Inventory Optimal: No drapes currently have stock under 5 units.</span>
            </div>
            <Link href="/admin/products/new" className="font-bold text-emerald-700 underline">
              + Add Drape
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {criticalProducts.map((p) => {
              const qty = p.stockQuantity ?? (p.inStock ? 10 : 0);
              const isOut = qty === 0 || !p.inStock;
              return (
                <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image src={p.image} alt={p.name} fill className="object-cover" unoptimized />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({p.sku || p.id})</span>
                      </div>
                      <span className="text-xs text-slate-500">{p.fabric || p.category} • {formatPrice(p.price)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status badge */}
                    {isOut ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Stock Not Available (0 Units)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border-2 border-rose-400 shadow-xs animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Critical Stock: Only {qty} Left!</span>
                      </span>
                    )}

                    {/* Quick Restock Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(p.id, 5)}
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0284c7] hover:bg-sky-100 text-xs font-bold border border-sky-200 transition-colors cursor-pointer"
                      >
                        +5 Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(p.id, 10)}
                        className="px-2.5 py-1 rounded-lg bg-[#0284c7] text-white hover:bg-[#0369a1] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        +10 Stock
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Recent Loom Orders Section with Unified AdminTable */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading-main">
              Recent Loom Orders & Dispatch
            </h2>
            <p className="text-xs text-slate-500">
              Client purchases requiring packaging, authentication certificate, and insured delivery
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Status Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setOrderFilter("all")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  orderFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("pending")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  orderFilter === "pending" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Pending ({orders.filter((o) => o.status === "pending").length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter("delivered")}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  orderFilter === "delivered" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Delivered ({orders.filter((o) => o.status === "delivered").length})
              </button>
            </div>

            <Link
              href="/admin/orders"
              prefetch={true}
              className="text-xs font-semibold text-[#0284c7] hover:underline whitespace-nowrap pl-2"
            >
              View all orders &rarr;
            </Link>
          </div>
        </div>

        {/* Common Admin Table */}
        <AdminTable>
          <AdminTableHeader>
            <AdminTableHead>Order #</AdminTableHead>
            <AdminTableHead>Client & Contact</AdminTableHead>
            <AdminTableHead>Weave Selection</AdminTableHead>
            <AdminTableHead>Payment Method</AdminTableHead>
            <AdminTableHead>Fulfillment Status</AdminTableHead>
            <AdminTableHead align="right">Amount</AdminTableHead>
          </AdminTableHeader>

          <AdminTableBody>
            {filteredOrders.length === 0 ? (
              <AdminTableEmpty
                title="No orders found"
                message="No recent purchases match the selected filter."
                colSpan={6}
              />
            ) : (
              filteredOrders.slice(0, 6).map((order) => (
                <AdminTableRow key={order.id}>
                  {/* Order Number */}
                  <AdminTableCell>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </AdminTableCell>

                  {/* Customer */}
                  <AdminTableCell>
                    <span className="font-semibold text-slate-800 block text-xs">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {order.customerPhone}
                    </span>
                  </AdminTableCell>

                  {/* Items */}
                  <AdminTableCell>
                    <span className="text-slate-700 font-medium block">
                      {order.items.length} drape{order.items.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                      {order.items[0]?.name}
                    </span>
                  </AdminTableCell>

                  {/* Payment */}
                  <AdminTableCell>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {order.paymentMethod}
                    </span>
                  </AdminTableCell>

                  {/* Status */}
                  <AdminTableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : order.status === "shipped"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : order.status === "confirmed"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {order.status === "delivered" && <CheckCircle className="w-3 h-3" />}
                      {order.status === "shipped" && <Truck className="w-3 h-3" />}
                      {order.status === "pending" && <Clock className="w-3 h-3" />}
                      <span>{order.status}</span>
                    </span>
                  </AdminTableCell>

                  {/* Total */}
                  <AdminTableCell align="right">
                    <span className="font-bold text-slate-900 font-ui text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </AdminTableCell>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
}
