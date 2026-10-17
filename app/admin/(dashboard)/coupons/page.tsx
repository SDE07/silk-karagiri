"use client";

import React, { useState } from "react";
import {
  Ticket,
  Plus,
  Search,
  RotateCw,
  Copy,
  Check,
  Calendar,
  Pencil,
  Trash2,
  X,
  Percent,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { Coupon, CouponType } from "@/types/coupon.types";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableToggle,
  AdminTableEmpty,
} from "@/components/admin/AdminTable";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon, toggleCouponStatus, updateCoupon } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<CouponType>("percentage");
  const [formValue, setFormValue] = useState<number>(15);
  const [formMinOrder, setFormMinOrder] = useState<number>(5000);
  const [formMaxDiscount, setFormMaxDiscount] = useState<number>(3000);
  const [formUsageLimit, setFormUsageLimit] = useState<number>(100);
  const [formExpiry, setFormExpiry] = useState("2026-12-31");
  const [formActive, setFormActive] = useState(true);

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormCode(coupon.code);
      setFormType(coupon.type);
      setFormValue(coupon.value);
      setFormMinOrder(coupon.minOrderValue || 0);
      setFormMaxDiscount(coupon.maxDiscountAmount || 0);
      setFormUsageLimit(coupon.usageLimit || 0);
      setFormExpiry(coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "");
      setFormActive(coupon.isActive);
    } else {
      setEditingCoupon(null);
      setFormCode("");
      setFormType("percentage");
      setFormValue(15);
      setFormMinOrder(5000);
      setFormMaxDiscount(3000);
      setFormUsageLimit(100);
      setFormExpiry("2026-12-31");
      setFormActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) return;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: formCode.toUpperCase().trim(),
        type: formType,
        value: Number(formValue),
        minOrderValue: formMinOrder > 0 ? Number(formMinOrder) : undefined,
        maxDiscountAmount: formMaxDiscount > 0 ? Number(formMaxDiscount) : undefined,
        usageLimit: formUsageLimit > 0 ? Number(formUsageLimit) : undefined,
        expiresAt: formExpiry || undefined,
        isActive: formActive,
      });
    } else {
      addCoupon({
        code: formCode.toUpperCase().trim(),
        type: formType,
        value: Number(formValue),
        minOrderValue: formMinOrder > 0 ? Number(formMinOrder) : undefined,
        maxDiscountAmount: formMaxDiscount > 0 ? Number(formMaxDiscount) : undefined,
        usageLimit: formUsageLimit > 0 ? Number(formUsageLimit) : undefined,
        expiresAt: formExpiry || undefined,
        isActive: formActive,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Row matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs mt-0.5">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Coupons & Offers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage product discounts, storewide promo codes, and special sale offers.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-xs transition-all hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Search and Counts Row matching screenshot */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code or title..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Total Coupons: <strong className="text-slate-800">{coupons.length}</strong></span>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            title="Refresh list"
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Coupons Table using Common AdminTable matching screenshot */}
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHead>Code</AdminTableHead>
          <AdminTableHead>Discount</AdminTableHead>
          <AdminTableHead>Scope</AdminTableHead>
          <AdminTableHead>Min Order</AdminTableHead>
          <AdminTableHead>Usage</AdminTableHead>
          <AdminTableHead>Valid Until</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead align="right">Actions</AdminTableHead>
        </AdminTableHeader>

        <AdminTableBody>
          {filteredCoupons.length === 0 ? (
            <AdminTableEmpty
              title="No coupons found"
              message="No promotional codes match your search query."
              colSpan={8}
            />
          ) : (
            filteredCoupons.map((coupon) => (
              <AdminTableRow key={coupon.id}>
                {/* Code Column with Copy */}
                <AdminTableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100"
                      title="Copy code"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {coupon.type === "percentage"
                      ? `Flat ${coupon.value}% off on handloom drapes`
                      : coupon.type === "fixed"
                      ? `Flat ₹${coupon.value} deduction`
                      : "Complimentary express delivery"}
                  </span>
                </AdminTableCell>

                {/* Discount Badge */}
                <AdminTableCell>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                    <Percent className="w-3 h-3 text-blue-500" />
                    <span>
                      {coupon.type === "percentage"
                        ? `${coupon.value}% OFF`
                        : coupon.type === "fixed"
                        ? `₹${coupon.value} OFF`
                        : "FREE SHIPPING"}
                    </span>
                  </span>
                </AdminTableCell>

                {/* Scope */}
                <AdminTableCell>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    Storewide
                  </span>
                </AdminTableCell>

                {/* Min Order */}
                <AdminTableCell className="text-slate-600">
                  {coupon.minOrderValue ? `₹${coupon.minOrderValue.toLocaleString("en-IN")}` : "None"}
                </AdminTableCell>

                {/* Usage */}
                <AdminTableCell className="font-mono text-slate-600">
                  {coupon.usedCount}/{coupon.usageLimit || "∞"}
                </AdminTableCell>

                {/* Valid Until */}
                <AdminTableCell>
                  {coupon.expiresAt ? (
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(coupon.expiresAt).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Never</span>
                  )}
                </AdminTableCell>

                {/* Status Toggle Switch matching screenshot */}
                <AdminTableCell>
                  <AdminTableToggle
                    active={coupon.isActive}
                    onToggle={() => toggleCouponStatus(coupon.id)}
                  />
                </AdminTableCell>

                {/* Actions Column */}
                <AdminTableCell align="right">
                  <div className="flex items-center justify-end gap-2 text-slate-400">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(coupon)}
                      className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="Edit coupon"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete coupon ${coupon.code}?`)) {
                          deleteCoupon(coupon.id);
                        }
                      }}
                      className="p-1.5 rounded hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>

      {/* Modal Dialog for Create / Edit Coupon */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon & Offer"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SILK20"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-mono text-sm uppercase focus:outline-hidden focus:border-cyan-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CouponType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white"
                  >
                    <option value="percentage">Percentage (% off)</option>
                    <option value="fixed">Fixed Amount (₹ off)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={formMaxDiscount}
                    onChange={(e) => setFormMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Usage Limit (0 for ∞)</label>
                  <input
                    type="number"
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="activeToggle" className="text-slate-800 font-semibold cursor-pointer">
                  Activate this coupon immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold cursor-pointer shadow-xs"
                >
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
