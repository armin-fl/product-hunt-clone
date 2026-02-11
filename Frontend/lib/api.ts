import { Product } from "./types";

const SERVER_API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

type ProductsPageOptions = {
  page?: number | string;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function logApiError(message: string, error: unknown) {
  console.error(`[products] ${message}`, error);
}

function getApiBaseUrl() {
  return typeof window === "undefined" ? SERVER_API_BASE_URL : "";
}

function buildProductsUrl(options: ProductsPageOptions = {}) {
  const baseUrl = getApiBaseUrl();
  const params = new URLSearchParams();
  if (options.page !== undefined && options.page !== null && String(options.page).length > 0) {
    params.set("page", String(options.page));
  }
  const endpoint = `${baseUrl}/api/products/`;
  return params.toString() ? `${endpoint}?${params}` : endpoint;
}

export function getNextPageFromUrl(nextUrl: string | null): number | null {
  if (!nextUrl) return null;
  try {
    const url = new URL(nextUrl, "http://localhost");
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? Number(pageParam) : NaN;
    return Number.isFinite(page) && page > 1 ? page : null;
  } catch {
    return null;
  }
}

export async function getProducts(options: ProductsPageOptions = {}): Promise<Product[]> {
  const page = await getProductsPage(options);
  return page.results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  let nextPage: number | null = 1;
  while (nextPage) {
    const page = await getProductsPage({ page: nextPage });
    const match = page.results.find((item) => item.slug === slug);
    if (match) return match;
    nextPage = getNextPageFromUrl(page.next);
  }
  return null;
}

function getFetchOptions() {
  return typeof window === "undefined" ? { next: { revalidate: 60 } } : undefined;
}

export async function getProductsPage(
  options: ProductsPageOptions = {}
): Promise<PaginatedResponse<Product>> {
  const url = buildProductsUrl(options);

  try {
    const res = await fetch(url, getFetchOptions());
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data
      };
    }
    return {
      count: data.count ?? data.results?.length ?? 0,
      next: data.next ?? null,
      previous: data.previous ?? null,
      results: data.results ?? []
    };
  } catch (error) {
    logApiError(`Failed to fetch products from ${url}`, error);
    return { count: 0, next: null, previous: null, results: [] };
  }
}
