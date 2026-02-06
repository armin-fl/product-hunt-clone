import { Product } from "./types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products/`;

type ProductFilters = {
  min_votes?: number | string;
  max_votes?: number | string;
  min_rating?: number | string;
  max_rating?: number | string;
  search?: string;
  ordering?: string;
};

const SAMPLE_PRODUCTS: Product[] = [
  {
    ph_id: "1069501",
    name: "Atoms",
    slug: "atoms-5",
    tagline: "Turn your ideas into products that sell",
    description:
      "Atoms is a vibe business team that turns your ideas into business. It researches your market, designs the product, builds frontend and backend, connects auth and payments, and ships a live app you can charge for.",
    url: "https://www.producthunt.com/products/atoms-5",
    website: "https://www.producthunt.com/products/atoms-5",
    votes_count: 500,
    reviews_count: 0,
    reviews_rating: 0,
    thumbnail_url: "https://ph-files.imgix.net/5a87efce-da3a-41a5-b945-d6a36eaa863d.webp?auto=format",
    created_at: "2026-02-03T08:01:00Z",
    featured_at: "2026-02-03T08:01:00Z"
  },
  {
    ph_id: "1069502",
    name: "Hugo",
    slug: "hugo-ai-agent",
    tagline: "The AI Agent that doesn't charge 1$ per support ticket",
    description:
      "Hugo is an AI agent for modern support teams. Automate answers, surface knowledge instantly, and keep customers happy without per-ticket pricing.",
    url: "https://www.producthunt.com/products/hugo",
    website: "https://www.producthunt.com/products/hugo",
    votes_count: 467,
    reviews_count: 18,
    reviews_rating: 4.75,
    thumbnail_url: "https://ph-files.imgix.net/01f9324c-b316-4246-a5a0-64b965835af5.png?auto=format",
    created_at: "2026-02-03T10:10:00Z",
    featured_at: "2026-02-03T08:01:00Z"
  },
  {
    ph_id: "1069503",
    name: "findable.",
    slug: "findable",
    tagline: "Free marketing optimization for ChatGPT, Google AI",
    description:
      "Findable helps products get discovered in modern AI search. Optimize your positioning for LLMs, analyze visibility, and improve relevance.",
    url: "https://www.producthunt.com/products/findable",
    website: "https://www.producthunt.com/products/findable",
    votes_count: 400,
    reviews_count: 12,
    reviews_rating: 5,
    thumbnail_url: "https://ph-files.imgix.net/b66aa46f-3dce-4b1c-9cc7-2570b88f624d.png?auto=format",
    created_at: "2026-02-02T07:20:00Z",
    featured_at: "2026-02-02T07:20:00Z"
  }
];

function buildParams(filters: ProductFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      params.set(key, String(value));
    }
  });
  return params;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const params = buildParams(filters);
  const url = params.toString() ? `${PRODUCTS_ENDPOINT}?${params}` : PRODUCTS_ENDPOINT;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return SAMPLE_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const results = await getProducts({ search: slug });
  return results.find((item) => item.slug === slug) ?? null;
}
