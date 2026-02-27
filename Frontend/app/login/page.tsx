"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ensureCsrfCookie } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const csrfReady = await ensureCsrfCookie();
      if (!csrfReady) {
        setError("Unable to initialize a secure session. Please try again.");
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { detail?: string };
        setError(payload.detail ?? "Login failed.");
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Login failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-6 rounded-2xl border bg-card p-8 shadow-soft">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your Django user account.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="space-y-2">
        <Button type="button" variant="outline" className="w-full" asChild>
          <Link href="/api/auth/social/google">Continue with Google</Link>
        </Button>
        <Button type="button" variant="outline" className="w-full" asChild>
          <Link href="/api/auth/social/github">Continue with GitHub</Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Need an account? Create one from <Link href="/api/auth/signup" className="underline">Django signup</Link>.
      </p>
    </section>
  );
}
