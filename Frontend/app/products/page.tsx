import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductsArchiveClient } from "@/components/products-archive-client";
import { getNextPageFromUrl, getPreviousPageFromUrl, getProductsPage } from "@/lib/api";
import { getAbsoluteUrl } from "@/lib/site";

type ProductsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const DEFAULT_PRODUCTS_PAGE_SIZE = 25;

function parseRequestedPage(pageParam?: string): number {
  const parsed = Number(pageParam);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

function getProductsPagePath(pageNumber: number): string {
  return pageNumber <= 1 ? "/products" : `/products?page=${pageNumber}`;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = parseRequestedPage(page);
  const title = currentPage > 1 ? `Products - Page ${currentPage}` : "Products";
  const canonical = getProductsPagePath(currentPage);
  const description = "Browse the PulseLaunch archive of product launches and discover new makers.";

  return {
    // SEO: make each paginated archive URL self-canonical so crawlers can index deeper pages.
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title: `PulseLaunch ${title}`,
      description,
      url: canonical,
      type: "website"
    },
    twitter: {
      card: "summary",
      title: `PulseLaunch ${title}`,
      description
    }
  };
}

function buildSummaryLabel(totalCount: number, currentPage: number, visibleCount: number): string {
  if (!visibleCount || !totalCount) return "No products found";
  const start = (currentPage - 1) * DEFAULT_PRODUCTS_PAGE_SIZE + 1;
  const end = Math.min(start + visibleCount - 1, totalCount);
  return `Showing ${start}-${end} of ${totalCount}`;
}

function serializeJsonLd(value: unknown): string {
  // Hydration safety: escape characters that can break inline <script> JSON parsing in HTML.
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page: requestedPage } = await searchParams;
  const currentPage = parseRequestedPage(requestedPage);
  const page = await getProductsPage({ page: currentPage });
  const initialNextPage = getNextPageFromUrl(page.next);
  const initialPreviousPage = getPreviousPageFromUrl(page.previous);

  if (currentPage > 1 && !page.results.length) {
    // SEO: return 404 for out-of-range pagination URLs to avoid thin/duplicate archive pages.
    notFound();
  }

  const summaryLabel = buildSummaryLabel(page.count, currentPage, page.results.length);
  const listStartPosition = (currentPage - 1) * DEFAULT_PRODUCTS_PAGE_SIZE;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PulseLaunch Products",
    numberOfItems: page.results.length,
    itemListElement: page.results.map((product, index) => ({
      "@type": "ListItem",
      position: listStartPosition + index + 1,
      url: getAbsoluteUrl(`/products/${product.slug}`),
      name: product.name
    }))
  };
  const itemListJsonLdString = serializeJsonLd(itemListJsonLd);

  return (
    <div className="space-y-8">
      {/* SEO: structured data helps crawlers understand this as an ordered archive list. */}
      <script
        id={`products-itemlist-jsonld-page-${currentPage}`}
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: itemListJsonLdString }}
      />

      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Products
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">Browse the launch history</h1>
        <p className="text-base text-muted-foreground">
          Explore recent launches and the stories behind each product.
        </p>
        {currentPage > 1 ? (
          <p className="text-sm text-muted-foreground">Viewing page {currentPage}.</p>
        ) : null}
      </section>

      <ProductsArchiveClient
        products={page.results}
        totalCount={page.count}
        currentPage={currentPage}
        summaryLabel={summaryLabel}
      />

      {/* SEO: expose crawlable pagination links in HTML so all pages are discoverable without JS. */}
      <nav aria-label="Products archive pagination" className="flex flex-wrap items-center justify-between gap-3">
        {initialPreviousPage ? (
          <Link
            href={getProductsPagePath(initialPreviousPage)}
            rel="prev"
            className="text-sm font-medium text-primary hover:underline"
          >
            Previous page
          </Link>
        ) : (
          <span />
        )}
        {initialNextPage ? (
          <Link
            href={getProductsPagePath(initialNextPage)}
            rel="next"
            className="text-sm font-medium text-primary hover:underline"
          >
            Next page
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
