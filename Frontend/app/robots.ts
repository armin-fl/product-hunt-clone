import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    // Next.js 16 file-based metadata: keep crawler rules centralized and explicit.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    sitemap: [`${siteUrl.origin}/sitemap.xml`],
    host: siteUrl.origin
  };
}
