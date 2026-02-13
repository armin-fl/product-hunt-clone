import Image from "next/image";
import Link from "next/link";

import { RatingStars } from "@/components/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group flex h-full flex-col gap-4 p-5 transition hover:-translate-y-1 hover:shadow-glow animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border bg-muted">
          {product.thumbnail_url ? (
            // Performance: keep list thumbnails on the Next.js image optimization pipeline.
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1">
          {/* Performance: avoid prefetching every detail page in long product grids. */}
          <Link
            href={`/products/${product.slug}`}
            prefetch={false}
            className="text-base font-semibold hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>#{product.slug}</Badge>
            <RatingStars rating={product.reviews_rating} size="sm" />
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(product.featured_at ?? product.created_at).toLocaleDateString()}
        </span>
        <span className="text-xs font-semibold text-muted-foreground">
          Product Hunt votes {product.votes_count}
        </span>
      </div>
    </Card>
  );
}
