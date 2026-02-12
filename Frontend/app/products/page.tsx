import type { Metadata } from "next";

import { ProductsArchiveClient } from "@/components/products-archive-client";
import { getNextPageFromUrl, getProductsPage } from "@/lib/api";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the PulseLaunch archive of product launches and discover new makers.",
  alternates: {
    canonical: "/products"
  },
  openGraph: {
    title: "PulseLaunch Products",
    description: "Browse the PulseLaunch archive of product launches and discover new makers.",
    url: "/products",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "PulseLaunch Products",
    description: "Browse the PulseLaunch archive of product launches and discover new makers."
  }
};

export default async function ProductsPage() {
  const page = await getProductsPage();
  const initialNextPage = getNextPageFromUrl(page.next);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Products
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">Browse the launch history</h1>
        <p className="text-base text-muted-foreground">
          Explore recent launches and the stories behind each product.
        </p>
      </section>

      <ProductsArchiveClient
        initialProducts={page.results}
        initialCount={page.count}
        initialNextPage={initialNextPage}
      />
    </div>
  );
}
