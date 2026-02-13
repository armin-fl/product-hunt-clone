/** @type {import("next").NextConfig} */
const nextConfig = {
  // Next.js 16 metadata warning fix: ensure SITE_URL is always defined for local/dev metadata resolution.
  env: {
    SITE_URL: process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  },
  images: {
    // Dev stability: bypass optimizer in development to avoid remote image timeout/500 during local compile.
    unoptimized: process.env.NODE_ENV === "development",
    // Performance: allow Next.js image optimization for known Product Hunt asset hosts.
    remotePatterns: [
      { protocol: "https", hostname: "ph-files.imgix.net" },
      { protocol: "https", hostname: "www.producthunt.com" },
      { protocol: "https", hostname: "images.prd.producthunt.com" }
    ],
    formats: ["image/avif", "image/webp"]
  }
};

module.exports = nextConfig;
