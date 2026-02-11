"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { getNextPageFromUrl, getProductsPage } from "@/lib/api";
import { Product } from "@/lib/types";

type ProductsArchiveClientProps = {
  initialProducts: Product[];
  initialCount: number;
  initialNextPage: number | null;
};

export function ProductsArchiveClient({
  initialProducts,
  initialCount,
  initialNextPage
}: ProductsArchiveClientProps) {
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItems(initialProducts);
    setTotalCount(initialCount);
    setNextPage(initialNextPage);
    setError(null);
  }, [initialProducts, initialCount, initialNextPage]);

  const loadMore = useCallback(async () => {
    if (!nextPage || loading) return;
    setLoading(true);
    setError(null);
    try {
      const page = await getProductsPage({ page: nextPage });
      setItems((prev) => [...prev, ...page.results]);
      setTotalCount(page.count || totalCount);
      setNextPage(getNextPageFromUrl(page.next));
    } catch {
      setError("Could not load more products.");
    } finally {
      setLoading(false);
    }
  }, [loading, nextPage, totalCount]);

  useEffect(() => {
    if (!nextPage) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, nextPage]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Results</h2>
        <span className="text-sm text-muted-foreground">
          {items.length} of {totalCount} products
        </span>
      </div>

      {items.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.ph_id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No products yet.</p>
      )}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {loading ? <p className="text-sm text-muted-foreground">Loading more...</p> : null}

      <div ref={sentinelRef} />
    </section>
  );
}
