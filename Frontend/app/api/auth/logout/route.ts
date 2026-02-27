import { NextResponse } from "next/server";
import {
  applyNoStoreHeaders,
  buildProxyHeaders,
  getCsrfTokenFromCookieHeader,
  getSetCookieHeaders,
  isTrustedMutationRequest
} from "@/lib/auth-proxy";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function noStoreJson(body: unknown, status: number): NextResponse {
  const response = NextResponse.json(body, { status });
  applyNoStoreHeaders(response.headers);
  return response;
}

export async function POST(request: Request) {
  const backendUrl = new URL("/api/auth/logout/", API_BASE_URL);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const csrfToken = getCsrfTokenFromCookieHeader(cookieHeader);

  if (!isTrustedMutationRequest(request)) {
    return noStoreJson({ detail: "Invalid request origin." }, 403);
  }

  if (!csrfToken) {
    return noStoreJson(
      { detail: "CSRF cookie missing. Call /api/auth/csrf before logout." },
      403
    );
  }

  try {
    const headers = buildProxyHeaders(request, cookieHeader);
    headers["x-csrftoken"] = csrfToken;

    const response = await fetch(backendUrl.toString(), {
      method: "POST",
      headers,
      cache: "no-store",
      redirect: "manual"
    });

    const nextResponse = new NextResponse(null, { status: response.status });
    applyNoStoreHeaders(nextResponse.headers);
    for (const setCookie of getSetCookieHeaders(response.headers)) {
      nextResponse.headers.append("set-cookie", setCookie);
    }

    return nextResponse;
  } catch {
    return noStoreJson({ detail: "Unable to log out." }, 502);
  }
}
