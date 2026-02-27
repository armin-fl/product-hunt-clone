import { NextResponse } from "next/server";
import { requireServerEnv } from "@/lib/server-env";

const API_BASE_URL = requireServerEnv("API_BASE_URL");

function buildSiteOrigin(request: Request): string {
  const configuredSiteUrl = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL)?.trim();
  if (configuredSiteUrl) {
    const normalized = configuredSiteUrl.startsWith("http://") || configuredSiteUrl.startsWith("https://")
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`;
    return new URL(normalized).origin;
  }

  return new URL(request.url).origin;
}

function buildNextUrl(request: Request): string {
  const requestUrl = new URL(request.url);
  const nextPath = requestUrl.searchParams.get("next") ?? "/profile";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/profile";
  return new URL(safeNextPath, buildSiteOrigin(request)).toString();
}

export async function GET(request: Request) {
  const backendUrl = new URL("/api/auth/social/google/login/", API_BASE_URL);
  backendUrl.searchParams.set("next", buildNextUrl(request));
  return NextResponse.redirect(backendUrl.toString());
}
