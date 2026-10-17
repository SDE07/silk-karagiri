"use client";

import React, { useState } from "react";
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  XCircle,
  Phone,
  MapPin,
  ExternalLink,
  RotateCw,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { OrderStatus } from "@/types/order.types";
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

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdmin();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const STATUS_OPTIONS: OrderStatus[] = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs mt-0.5">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Client Orders & Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track customer purchases, packing status, shipping tracking numbers, and delivery confirmation.
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs">
          Total Revenue: <strong className="text-slate-900 ml-1">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</strong>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {["all", "pending", "confirmed", "shipped", "delivered"].map((st) => {
            const count =
              st === "all" ? orders.length : orders.filter((o) => o.status === st).length;
            const isActive = filterStatus === st;

            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-[#0284c7] text-white border-[#0284c7] shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, phone..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Orders Table using Common AdminTable */}
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHead>Order ID & Date</AdminTableHead>
          <AdminTableHead>Customer & Contact</AdminTableHead>
          <AdminTableHead>Delivery Destination</AdminTableHead>
          <AdminTableHead>Ordered Items</AdminTableHead>
          <AdminTableHead>Payment</AdminTableHead>
          <AdminTableHead>Status</AdminTableHead>
          <AdminTableHead align="right">Total</AdminTableHead>
        </AdminTableHeader>

        <AdminTableBody>
          {filteredOrders.length === 0 ? (
            <AdminTableEmpty
              title="No orders found"
              message="No client purchases match your search or filter."
              colSpan={7}
            />
          ) : (
            filteredOrders.map((order) => (
              <AdminTableRow key={order.id}>
                {/* Order ID & Date */}
                <AdminTableCell>
                  <span className="font-mono font-bold text-slate-900 block text-xs">
                    {order.orderNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </AdminTableCell>

                {/* Customer */}
                <AdminTableCell>
                  <div className="font-semibold text-slate-900">{order.customerName}</div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                </AdminTableCell>

                {/* Destination */}
                <AdminTableCell>
                  <div className="flex items-start gap-1 text-slate-600 max-w-[200px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">
                      {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.pincode})
                    </span>
                  </div>
                </AdminTableCell>

                {/* Items */}
                <AdminTableCell>
                  <div className="text-slate-800 font-semibold">
                    {order.items.length} Piece{order.items.length > 1 ? "s" : ""}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                    {order.items[0]?.name}
                  </div>
                </AdminTableCell>

                {/* Payment */}
                <AdminTableCell>
                  <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 block w-fit">
                    {order.paymentMethod}
                  </span>
                  <span
                    className={`text-[10px] font-semibold block mt-0.5 ${
                      order.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </AdminTableCell>

                {/* Status Dropdown */}
                <AdminTableCell>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border appearance-none cursor-pointer focus:outline-hidden ${
                      order.status === "delivered"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : order.status === "shipped"
                        ? "bg-blue-50 text-blue-800 border-blue-200"
                        : order.status === "confirmed"
                        ? "bg-purple-50 text-purple-800 border-purple-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-white text-slate-800 font-normal">
                        {opt.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </AdminTableCell>

                {/* Total Amount */}
                <AdminTableCell align="right">
                  <span className="font-bold text-slate-900 text-sm">
                    {formatPrice(order.total)}
                  </span>
                </AdminTableCell>
              </AdminTableRow>
            ))
          )}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
