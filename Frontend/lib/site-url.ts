import "server-only";

const DEV_FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): URL {
  const siteUrl = process.env.SITE_URL;

  if (siteUrl) {
    try {
      return new URL(siteUrl);
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[metadataBase] Invalid SITE_URL value \"${siteUrl}\". Falling back to ${DEV_FALLBACK_SITE_URL} in development.`
        );
        return new URL(DEV_FALLBACK_SITE_URL);
      }

      throw new Error(
        `[metadataBase] Invalid SITE_URL value \"${siteUrl}\" in production. Expected an absolute URL like https://example.com.`
      );
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[metadataBase] SITE_URL is missing. Falling back to ${DEV_FALLBACK_SITE_URL} in development.`
    );
    return new URL(DEV_FALLBACK_SITE_URL);
  }

  throw new Error(
    "[metadataBase] SITE_URL is required in production and must be a valid absolute URL (for example: https://example.com)."
  );
}
