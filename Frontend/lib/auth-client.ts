export async function ensureCsrfCookie(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/csrf", {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  }
}
