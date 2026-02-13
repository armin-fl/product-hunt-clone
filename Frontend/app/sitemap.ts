import type { MetadataRoute } from "next";

import { getProductsPage, getNextPageFromUrl } from "@/lib/api";
import { getBlogPosts } from "@/lib/blog";
import { getAbsoluteUrl } from "@/lib/site";

export const revalidate = 3600;

async function getAllProductEntriesForSitemap() {
  const archiveEntries: MetadataRoute.Sitemap = [];
  const productEntries: MetadataRoute.Sitemap = [];
  const seenSlugs = new Set<string>();
  let pageNumber: number | null = 1;
  let safetyCounter = 0;

  while (pageNumber && safetyCounter < 100) {
    const page = await getProductsPage({ page: pageNumber });
    const archivePath = pageNumber <= 1 ? "/products" : `/products?page=${pageNumber}`;
    const archiveLastModified = page.results[0]?.featured_at ?? page.results[0]?.created_at ?? new Date();

    // SEO: include crawlable archive pagination URLs, not only the first archive page.
    archiveEntries.push({
      url: getAbsoluteUrl(archivePath),
      lastModified: archiveLastModified,
      changeFrequency: "hourly",
      priority: pageNumber <= 1 ? 0.9 : 0.7
    });

    // Next.js 16 sitemap best practice: include each canonical product detail route.
    productEntries.push(...page.results
      .filter((product) => {
        if (seenSlugs.has(product.slug)) return false;
        seenSlugs.add(product.slug);
        return true;
      })
      .map((product) => ({
        url: getAbsoluteUrl(`/products/${product.slug}`),
        lastModified: product.featured_at ?? product.created_at,
        changeFrequency: "daily" as const,
        priority: 0.8
      })));

    pageNumber = getNextPageFromUrl(page.next);
    safetyCounter += 1;
  }

  return { archiveEntries, productEntries };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl("/"), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: getAbsoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: getAbsoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: getAbsoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.4 }
  ];

  const [productSitemap, blogPosts] = await Promise.all([
    getAllProductEntriesForSitemap(),
    getBlogPosts()
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: getAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: post.published_at || now,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [
    ...staticRoutes,
    ...productSitemap.archiveEntries,
    ...productSitemap.productEntries,
    ...blogEntries
  ];
}
