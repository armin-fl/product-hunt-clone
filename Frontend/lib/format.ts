import { Product } from "./types";

export function formatDayLabel(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function groupByFeaturedDay(products: Product[]) {
  const map = new Map<string, Product[]>();
  products.forEach((product) => {
    const key = (product.featured_at ?? product.created_at).slice(0, 10);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(product);
  });

  const groups = Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({
      date,
      label: formatDayLabel(date),
      items: items.sort((a, b) => b.votes_count - a.votes_count)
    }));

  return groups;
}
