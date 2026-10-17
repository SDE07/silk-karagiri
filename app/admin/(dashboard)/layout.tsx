import React from "react";
import { AdminProvider } from "@/context/AdminContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Suite — Silk Karagiri",
  description: "E-Commerce Management & Control Portal",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans selection:bg-cyan-500/20 selection:text-cyan-900">
        {/* Dark Luxury Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#f8fafc]">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
