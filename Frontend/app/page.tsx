import Link from "next/link";
import type { Metadata } from "next";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/api";
import { groupByFeaturedDay } from "@/lib/format";

export const metadata: Metadata = {
  title: "Product launches, curated daily",
  description:
    "Discover the products teams are shipping right now with PulseLaunch, a calm Product Hunt-inspired feed.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "PulseLaunch",
    description:
      "Discover the products teams are shipping right now with PulseLaunch, a calm Product Hunt-inspired feed.",
    url: "/",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "PulseLaunch",
    description:
      "Discover the products teams are shipping right now with PulseLaunch, a calm Product Hunt-inspired feed."
  }
};

export default async function HomePage() {
  const products = await getProducts();
  const groups = groupByFeaturedDay(products);

  return (
    <div className="space-y-12">
      <section className="glass rounded-3xl p-8 shadow-soft md:p-12">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Daily launches
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Discover the products teams are shipping right now.
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              PulseLaunch curates Product Hunt-inspired drops with clean rankings, fast voting, and a calm,
              focused browsing experience.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/products">Browse products</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">How it works</Link>
              </Button>
            </div>
          </div>
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-glow">
            <p className="text-sm font-semibold text-muted-foreground">Today&apos;s momentum</p>
            <div className="mt-4 space-y-4">
              {products.length ? (
                products.slice(0, 3).map((product) => (
                  <div key={product.ph_id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.tagline}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                      {product.votes_count} votes
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No launches yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.date} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">{group.label}</p>
              <h2 className="text-2xl font-semibold">Featured launches</h2>
            </div>
            <span className="text-sm text-muted-foreground">{group.items.length} products</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {group.items.map((product) => (
              <ProductCard key={product.ph_id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
