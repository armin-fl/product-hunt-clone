import { NextResponse } from "next/server";
import { applyNoStoreHeaders, buildProxyHeaders, getSetCookieHeaders } from "@/lib/auth-proxy";
import { requireServerEnv } from "@/lib/server-env";

const API_BASE_URL = requireServerEnv("API_BASE_URL");
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const backendUrl = new URL("/api/auth/csrf/", API_BASE_URL);
  const cookieHeader = request.headers.get("cookie") ?? "";

  try {
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: buildProxyHeaders(request, cookieHeader),
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
    const nextResponse = NextResponse.json({ detail: "Unable to initialize CSRF." }, { status: 502 });
    applyNoStoreHeaders(nextResponse.headers);
    return nextResponse;
  }
}
