const CSRF_COOKIE_NAME = "csrftoken";
const NO_STORE_CACHE_CONTROL = "private, no-store, no-cache, max-age=0, must-revalidate";

function getConfiguredSiteOrigin(): string | null {
  const rawSiteUrl = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL)?.trim();
  if (!rawSiteUrl) {
    return null;
  }

  try {
    const normalized = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
      ? rawSiteUrl
      : `https://${rawSiteUrl}`;
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

function parseOrigin(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function buildAllowedOrigins(request: Request): Set<string> {
  const origins = new Set<string>();
  origins.add(new URL(request.url).origin);

  const configuredOrigin = getConfiguredSiteOrigin();
  if (configuredOrigin) {
    origins.add(configuredOrigin);
  }

  return origins;
}

export function getCookieValue(cookieHeader: string, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.trim().split("=");
    if (!rawKey || rest.length === 0) {
      continue;
    }
    if (rawKey !== name) {
      continue;
    }
    const rawValue = rest.join("=");
    try {
      return decodeURIComponent(rawValue);
    } catch {
      // Malformed percent-encoding should not crash auth routes.
      return rawValue;
    }
  }

  return null;
}

export function getCsrfTokenFromCookieHeader(cookieHeader: string): string | null {
  return getCookieValue(cookieHeader, CSRF_COOKIE_NAME);
}

export function getSetCookieHeaders(headers: Headers): string[] {
  // Undici/Node exposes `getSetCookie()` to correctly read multiple Set-Cookie headers
  // (a comma-joined `headers.get("set-cookie")` is ambiguous because Expires contains commas).
  const anyHeaders = headers as unknown as { getSetCookie?: () => string[] };
  if (typeof anyHeaders.getSetCookie === "function") {
    return anyHeaders.getSetCookie();
  }

  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

export function buildProxyHeaders(
  request: Request,
  cookieHeader: string,
  contentType?: string
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["content-type"] = contentType;
  }
  if (cookieHeader) {
    headers.cookie = cookieHeader;
  }

  const origin = request.headers.get("origin");
  if (origin) {
    headers.origin = origin;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    headers.referer = referer;
  }

  return headers;
}

export function applyNoStoreHeaders(headers: Headers): void {
  headers.set("cache-control", NO_STORE_CACHE_CONTROL);
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");

  const varyTokens = new Set(
    (headers.get("vary") ?? "")
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean)
  );
  varyTokens.add("cookie");
  headers.set("vary", Array.from(varyTokens).join(", "));
}

export function isTrustedMutationRequest(request: Request): boolean {
  // NOTE: Our Next.js "BFF" routes automatically copy the CSRF cookie into the
  // `x-csrftoken` header for the Django backend. That means we must be strict
  // about accepting only same-origin browser requests here, otherwise this proxy
  // could be abused for CSRF in clients that don't send Origin/Fetch-Metadata.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return false;
  }

  const allowedOrigins = buildAllowedOrigins(request);
  if (allowedOrigins.size === 0) {
    return false;
  }

  const origin = parseOrigin(request.headers.get("origin"));
  if (origin) {
    return allowedOrigins.has(origin);
  }

  const refererOrigin = parseOrigin(request.headers.get("referer"));
  if (refererOrigin) {
    return allowedOrigins.has(refererOrigin);
  }

  // Reject when we can't validate origin; safer default for cookie-based auth.
  return false;
}
