import { Product } from "./types";

const SERVER_API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const PRODUCT_REVALIDATE_SECONDS = 60;
const PRODUCT_CACHE_TAG = "products";

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

function resolveApiUrl(pathname: string) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return pathname;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(pathname.replace(/^\//, ""), normalizedBase).toString();
}

function buildProductsUrl(options: ProductsPageOptions = {}) {
  const params = new URLSearchParams();
  if (options.page !== undefined && options.page !== null && String(options.page).length > 0) {
    params.set("page", String(options.page));
  }
  const endpoint = resolveApiUrl("/api/products/");
  return params.toString() ? `${endpoint}?${params}` : endpoint;
}

function buildProductDetailUrl(slug: string) {
  return resolveApiUrl(`/api/products/${encodeURIComponent(slug)}/`);
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

export function getPreviousPageFromUrl(previousUrl: string | null): number | null {
  if (!previousUrl) return null;
  try {
    const url = new URL(previousUrl, "http://localhost");
    const pageParam = url.searchParams.get("page");
    const page = pageParam ? Number(pageParam) : NaN;
    return Number.isFinite(page) && page >= 1 ? page : null;
  } catch {
    return null;
  }
}

export async function getProducts(options: ProductsPageOptions = {}): Promise<Product[]> {
  const page = await getProductsPage(options);
  return page.results;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const url = buildProductDetailUrl(slug);

  try {
    const res = await fetch(url, getFetchOptions());
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    logApiError(`Failed to fetch product ${slug} from ${url}`, error);
    return null;
  }
}

function getFetchOptions() {
  // Next.js 16 caching: tag and revalidate server-side product fetches for consistent ISR behavior.
  return typeof window === "undefined"
    ? { next: { revalidate: PRODUCT_REVALIDATE_SECONDS, tags: [PRODUCT_CACHE_TAG] } }
    : undefined;
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
