import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";

type ProductsArchiveClientProps = {
  products: Product[];
  totalCount: number;
  currentPage: number;
  summaryLabel: string;
};

export function ProductsArchiveClient({
  products,
  totalCount,
  currentPage,
  summaryLabel
}: ProductsArchiveClientProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Results</h2>
        <span className="text-sm text-muted-foreground">
          {summaryLabel}
        </span>
      </div>

      {products.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.ph_id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No products yet.</p>
      )}
      <p className="text-xs text-muted-foreground">Page {currentPage} • {totalCount} total products</p>
    </section>
  );
}
