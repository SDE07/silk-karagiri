"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfaf7] text-slate-800 p-4 sm:p-6 selection:bg-[#b8862b]/20">
      {/* Subtle Warm Luxury Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#b8862b]/10 via-[#0d3b4c]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main White Luxury Card */}
        <div className="bg-white border border-[#b8862b]/25 rounded-2xl p-7 sm:p-9 shadow-xl shadow-[#0d3b4c]/5">
          {/* Official Silk Karagiri Brand Logo & Title */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="group flex flex-col items-center">
              <div className="relative h-16 w-auto flex items-center justify-center mb-3">
                <Image
                  src="/images/logo.webp"
                  alt="Silk Karagiri"
                  width={160}
                  height={70}
                  priority
                  unoptimized
                  className="h-16 w-auto object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h1 className="font-heading-main text-2xl font-bold text-[#0d3b4c] tracking-tight leading-tight">
                Silk Karagiri
              </h1>
              <p className="font-ui text-[10px] uppercase tracking-[0.25em] font-semibold text-[#7a5a2e] mt-1">
                Pure Heritage Silks &bull; Admin Portal
              </p>
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-bold">•</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-[#0d3b4c] font-ui mb-1.5"
              >
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5a2e]/60" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#b8862b]/30 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden focus:bg-white focus:border-[#0d3b4c] focus:ring-2 focus:ring-[#0d3b4c]/15 transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-[#0d3b4c] font-ui mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5a2e]/60" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#faf8f5] border border-[#b8862b]/30 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden focus:bg-white focus:border-[#0d3b4c] focus:ring-2 focus:ring-[#0d3b4c]/15 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7a5a2e]/70 hover:text-[#0d3b4c] transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 rounded-xl bg-[#0d3b4c] hover:bg-[#072430] text-[#f7e7ce] hover:text-white border border-[#b8862b]/40 font-ui font-semibold text-sm transition-all shadow-md shadow-[#0d3b4c]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#d4a347]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Suite</span>
                  <ArrowRight className="w-4 h-4 text-[#d4a347]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Storefront return link */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="font-ui text-xs text-[#7a5a2e] hover:text-[#0d3b4c] font-medium transition-colors"
          >
            &larr; Return to Karagiri Boutique Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
