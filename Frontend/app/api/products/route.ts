import { NextResponse } from "next/server";
import { requireServerEnv, requireServerIntEnv } from "@/lib/server-env";

const API_BASE_URL = requireServerEnv("API_BASE_URL");
const PRODUCT_REVALIDATE_SECONDS = requireServerIntEnv("PRODUCT_REVALIDATE_SECONDS");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const backendUrl = new URL("/api/products/", API_BASE_URL);
  const page = searchParams.get("page");
  if (page) {
    backendUrl.searchParams.set("page", page);
  }

  try {
    const res = await fetch(backendUrl.toString(), {
      headers: {
        accept: "application/json"
      },
      // Next.js 16 caching: revalidate proxy responses instead of forcing per-request origin hits.
      next: { revalidate: PRODUCT_REVALIDATE_SECONDS, tags: ["products"] }
    });
    const body = await res.text();
    const contentType = res.headers.get("content-type") ?? "application/json";
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": contentType,
        // Performance: expose edge cache hints for repeated product archive requests.
        "cache-control": `public, s-maxage=${PRODUCT_REVALIDATE_SECONDS}, stale-while-revalidate=300`
      }
    });
  } catch (error) {
    console.error("[products] Proxy fetch failed", error);
    return NextResponse.json(
      { count: 0, next: null, previous: null, results: [] },
      { status: 502 }
    );
  }
}
