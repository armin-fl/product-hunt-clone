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

export async function GET(request: Request) {
  const backendUrl = new URL("/accounts/signup/", API_BASE_URL);
  backendUrl.searchParams.set("next", new URL("/profile", buildSiteOrigin(request)).toString());
  return NextResponse.redirect(backendUrl.toString());
}
