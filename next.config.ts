import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // AVIF first (~20–30% smaller than WebP), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // 90 is used for detail-critical images: hero banners, the campaign banner, Atelier model layers.
    qualities: [75, 90],
    // Images in /public are versioned by filename, so optimised variants can be cached for a month.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
