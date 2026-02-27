import { NextResponse } from "next/server";
import {
  applyNoStoreHeaders,
  buildProxyHeaders,
  getCsrfTokenFromCookieHeader,
  getSetCookieHeaders,
  isTrustedMutationRequest
} from "@/lib/auth-proxy";
import { requireServerEnv } from "@/lib/server-env";

const API_BASE_URL = requireServerEnv("API_BASE_URL");
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function noStoreJson(body: unknown, status: number): NextResponse {
  const response = NextResponse.json(body, { status });
  applyNoStoreHeaders(response.headers);
  return response;
}

export async function POST(request: Request) {
  const backendUrl = new URL("/api/auth/login/", API_BASE_URL);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const csrfToken = getCsrfTokenFromCookieHeader(cookieHeader);

  if (!isTrustedMutationRequest(request)) {
    return noStoreJson({ detail: "Invalid request origin." }, 403);
  }

  if (!csrfToken) {
    return noStoreJson(
      { detail: "CSRF cookie missing. Call /api/auth/csrf before login." },
      403
    );
  }

  try {
    const payload = await request.json();
    const headers = buildProxyHeaders(request, cookieHeader, "application/json");
    headers["x-csrftoken"] = csrfToken;

    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
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
    return noStoreJson({ detail: "Unable to log in." }, 502);
  }
}
