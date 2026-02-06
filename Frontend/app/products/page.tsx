import { ArchiveFilters } from "@/components/archive-filters";
import { ProductsArchiveClient } from "@/components/products-archive-client";
import { getProductsPage } from "@/lib/api";

const pick = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

type ProductsPageProps = {
  searchParams: Promise<{
    min_votes?: string | string[];
    max_votes?: string | string[];
    min_rating?: string | string[];
    reviews_rating?: string | string[];
    search?: string | string[];
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const ratingParam = pick(params.min_rating ?? params.reviews_rating);
  const filters = {
    min_votes: pick(params.min_votes),
    max_votes: pick(params.max_votes),
    min_rating: ratingParam,
    search: pick(params.search),
    ordering: "-featured_at"
  };

  const page = await getProductsPage(filters);
  const initialNextPage = (() => {
    if (!page.next) return null;
    try {
      const url = new URL(page.next);
      const pageParam = url.searchParams.get("page");
      const pageNumber = pageParam ? Number(pageParam) : NaN;
      return Number.isFinite(pageNumber) && pageNumber > 1 ? pageNumber : null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Products
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">Search the launch history</h1>
        <p className="text-base text-muted-foreground">
          Filter by votes, reviews rating, or query to find the launches that mattered.
        </p>
      </section>

      <ArchiveFilters />

      <ProductsArchiveClient
        initialProducts={page.results}
        initialCount={page.count}
        initialNextPage={initialNextPage}
        filters={filters}
      />
    </div>
  );
}
