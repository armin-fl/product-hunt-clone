import { ArchiveFilters } from "@/components/archive-filters";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/api";

const pick = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

type ArchivePageProps = {
  searchParams: {
    min_votes?: string | string[];
    max_votes?: string | string[];
    min_rating?: string | string[];
    reviews_rating?: string | string[];
    search?: string | string[];
  };
};

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const ratingParam = pick(searchParams.min_rating ?? searchParams.reviews_rating);
  const filters = {
    min_votes: pick(searchParams.min_votes),
    max_votes: pick(searchParams.max_votes),
    min_rating: ratingParam,
    search: pick(searchParams.search),
    ordering: "-featured_at"
  };

  const products = await getProducts(filters);

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Archive
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">Search the launch history</h1>
        <p className="text-base text-muted-foreground">
          Filter by votes, reviews rating, or query to find the launches that mattered.
        </p>
      </section>

      <ArchiveFilters />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Results</h2>
          <span className="text-sm text-muted-foreground">{products.length} products</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.ph_id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
