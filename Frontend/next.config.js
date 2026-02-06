/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ph-files.imgix.net" },
      { protocol: "https", hostname: "www.producthunt.com" }
    ]
  }
};

module.exports = nextConfig;
