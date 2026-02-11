import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

export const dynamic = "force-dynamic";

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
      cache: "no-store"
    });
    const body = await res.text();
    const contentType = res.headers.get("content-type") ?? "application/json";
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "content-type": contentType
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
