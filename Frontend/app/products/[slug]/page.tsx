import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/api";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedProductBySlug = cache(async (slug: string) => {
  // Next.js 16 generateMetadata + page rendering can share this cached lookup.
  return getProductBySlug(slug);
});

function buildDescription(summary?: string, fallback?: string) {
  const text = summary || fallback || "";
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

export async function generateMetadata({
  params
}: ProductDetailPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false }
    };
  }

  const previousImages = (await parent).openGraph?.images ?? [];
  const description = buildDescription(product.tagline, product.description);
  const imageUrl = product.thumbnail_url || undefined;
  const imageEntries = imageUrl
    ? [{ url: imageUrl, alt: product.name }, ...previousImages]
    : previousImages;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/products/${product.slug}`
    },
    openGraph: {
      title: product.name,
      description,
      url: `/products/${product.slug}`,
      type: "website",
      images: imageEntries
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : undefined
    }
  };
}

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <section className="glass rounded-3xl p-8 shadow-soft md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-border bg-muted">
              {product.thumbnail_url ? (
                // Performance: use Next.js image optimization for remote product thumbnails.
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Launch profile</p>
              <h1 className="text-3xl font-semibold md:text-4xl">{product.name}</h1>
              <p className="mt-2 text-base text-muted-foreground">{product.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <a href={product.url} target="_blank" rel="noreferrer">
                Visit Website
              </a>
            </Button>
            {product.website ? (
              <Button asChild variant="secondary">
                <a href={product.website} target="_blank" rel="noreferrer">
                  Open Product
                </a>
              </Button>
            ) : null}
            <div className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
              Product Hunt votes {product.votes_count}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-semibold">About this product</h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">{product.description}</p>
        </Card>
        <Card className="p-6 md:p-8">
          <h3 className="text-lg font-semibold">Community signal</h3>
          <div className="mt-4 space-y-3">
            <RatingStars rating={product.reviews_rating} count={product.reviews_count} />
            <div className="text-sm text-muted-foreground">
              Featured on {new Date(product.featured_at ?? product.created_at).toLocaleDateString()}.
            </div>
            <div className="text-sm text-muted-foreground">Slug: {product.slug}</div>
          </div>
          <Button className="mt-6" asChild>
            <Link href="/products">Back to products</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
