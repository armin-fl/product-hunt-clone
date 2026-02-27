import { NextResponse } from "next/server";
import { applyNoStoreHeaders, buildProxyHeaders, getSetCookieHeaders } from "@/lib/auth-proxy";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function noStoreJson(body: unknown, status: number): NextResponse {
  const response = NextResponse.json(body, { status });
  applyNoStoreHeaders(response.headers);
  return response;
}

export async function GET(request: Request) {
  const backendUrl = new URL("/api/auth/profile/", API_BASE_URL);
  const cookieHeader = request.headers.get("cookie") ?? "";

  try {
    const headers = buildProxyHeaders(request, cookieHeader);
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
      redirect: "manual"
    });

    const body = await response.text();
    const nextResponse = new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json"
      }
    });
    applyNoStoreHeaders(nextResponse.headers);

    for (const setCookie of getSetCookieHeaders(response.headers)) {
      nextResponse.headers.append("set-cookie", setCookie);
    }

    return nextResponse;
  } catch {
    return noStoreJson({ detail: "Unable to load profile." }, 502);
  }
}
