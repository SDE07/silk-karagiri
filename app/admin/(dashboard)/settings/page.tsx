"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Phone,
  Mail,
  Truck,
  Coins,
  Bell,
  CheckCircle2,
  Save,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdmin();
  const [savedNotification, setSavedNotification] = useState(false);

  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [silkRatePerDrape, setSilkRatePerDrape] = useState(settings.silkRatePerDrape);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(settings.isAnnouncementActive);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      tagline,
      contactEmail,
      contactPhone,
      whatsappNumber,
      freeShippingThreshold: Number(freeShippingThreshold),
      silkRatePerDrape: Number(silkRatePerDrape),
      announcementText,
      isAnnouncementActive,
    });

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs mt-0.5">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Website & Storefront Configuration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage brand parameters, WhatsApp concierge numbers, shipping thresholds, and announcement marquee.
            </p>
          </div>
        </div>

        {savedNotification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-medium">
        {/* Brand Identity */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-cyan-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Brand Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Contact & Concierge */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Customer Support & WhatsApp Concierge
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Toll-Free Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp Bridal Line</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Benchmark Rates */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Coins className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Shipping Threshold & Benchmark Silk Rate
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Complimentary Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Orders with subtotal above this qualify for free insured express delivery.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Silk Zari Benchmark Rate (₹/drape)
              </label>
              <input
                type="number"
                value={silkRatePerDrape}
                onChange={(e) => setSilkRatePerDrape(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Featured on the top admin benchmark pill badge (matches 92.5 Silver style in screenshot).
              </span>
            </div>
          </div>
        </div>

        {/* Announcement Marquee */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Storefront Top Announcement Bar
            </h2>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Announcement Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="announcementActive"
              checked={isAnnouncementActive}
              onChange={(e) => setIsAnnouncementActive(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="announcementActive" className="text-slate-800 font-semibold cursor-pointer">
              Display announcement carousel on storefront header
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-cyan-950/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
