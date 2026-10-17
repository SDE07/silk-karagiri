"use client";

import React, { ReactNode } from "react";
import { Search, RotateCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTableProps {
  children: ReactNode;
  className?: string;
}

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {children}
        </table>
      </div>
    </div>
  );
}

export function AdminTableHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[#f8fafc] text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
      <tr>{children}</tr>
    </thead>
  );
}

export function AdminTableHead({ children, className, align = "left" }: { children: ReactNode; className?: string; align?: "left" | "right" | "center" }) {
  return (
    <th className={cn("py-3.5 px-6 font-bold", align === "right" && "text-right", align === "center" && "text-center", className)}>
      {children}
    </th>
  );
}

export function AdminTableBody({ children }: { children: ReactNode }) {
  return (
    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
      {children}
    </tbody>
  );
}

export function AdminTableRow({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn("hover:bg-slate-50/70 transition-colors", onClick && "cursor-pointer", className)}
    >
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, className, align = "left" }: { children: ReactNode; className?: string; align?: "left" | "right" | "center" }) {
  return (
    <td className={cn("py-4 px-6", align === "right" && "text-right", align === "center" && "text-center", className)}>
      {children}
    </td>
  );
}

export function AdminTableEmpty({ title, message, colSpan = 6 }: { title: string; message: string; colSpan?: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center text-slate-500">
        <div className="max-w-xs mx-auto space-y-2">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-400">{message}</p>
        </div>
      </td>
    </tr>
  );
}

export function AdminTableToggle({ active, onToggle, label }: { active: boolean; onToggle: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-label={label || "Toggle status"}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
          active ? "bg-emerald-500" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            active ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <span className={cn("text-[11px] font-semibold", active ? "text-emerald-700" : "text-slate-400")}>
          {label}
        </span>
      )}
    </div>
  );
}

export function AdminSearchBar({
  query,
  onChange,
  placeholder = "Search...",
  totalCount,
  countLabel = "Items",
  onRefresh,
}: {
  query: string;
  onChange: (val: string) => void;
  placeholder?: string;
  totalCount?: number;
  countLabel?: string;
  onRefresh?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-1">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 shadow-2xs"
        />
      </div>

      {totalCount !== undefined && (
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>
            Total {countLabel}: <strong className="text-slate-800">{totalCount}</strong>
          </span>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh list"
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
