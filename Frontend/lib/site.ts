const DEFAULT_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "PulseLaunch";
export const SITE_DESCRIPTION =
  "A Product Hunt-inspired feed for modern product launches.";

export function getSiteUrl(): URL {
  // Next.js 16 metadata warning fix: prefer SITE_URL, then NEXT_PUBLIC_SITE_URL for local/dev compatibility.
  const rawUrl = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL)?.trim();
  if (!rawUrl) return new URL(DEFAULT_SITE_URL);

  try {
    const normalized = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;
    return new URL(normalized);
  } catch {
    // Next.js 16 SEO hardening: fall back to a valid absolute URL if env config is invalid.
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getAbsoluteUrl(pathname: string): string {
  return new URL(pathname, getSiteUrl()).toString();
}
