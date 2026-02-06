import { Product } from "./types";

const SERVER_API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

type ProductFilters = {
  min_votes?: number | string;
  max_votes?: number | string;
  min_rating?: number | string;
  max_rating?: number | string;
  search?: string;
  ordering?: string;
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

function buildParams(filters: ProductFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      params.set(key, String(value));
    }
  });
  return params;
}

function getApiBaseUrl() {
  return typeof window === "undefined" ? SERVER_API_BASE_URL : "";
}

function buildProductsUrl(filters: ProductFilters) {
  const baseUrl = getApiBaseUrl();
  const params = buildParams(filters);
  const endpoint = `${baseUrl}/api/products/`;
  return params.toString() ? `${endpoint}?${params}` : endpoint;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const page = await getProductsPage(filters);
  return page.results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const results = await getProducts({ search: slug });
  return results.find((item) => item.slug === slug) ?? null;
}

function getFetchOptions() {
  return typeof window === "undefined" ? { next: { revalidate: 60 } } : undefined;
}

export async function getProductsPage(
  filters: ProductFilters = {}
): Promise<PaginatedResponse<Product>> {
  const url = buildProductsUrl(filters);

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
