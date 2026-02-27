"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SessionUser = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/profile", {
          cache: "no-store",
          credentials: "include"
        });

        if (!isMounted) return;
        if (!response.ok) {
          setUser(null);
          return;
        }

        const payload = (await response.json()) as SessionUser;
        setUser(payload);
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>;
  }

  if (!user) {
    return (
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">You are not logged in.</p>
        <Link href="/login" className="text-sm underline">
          Go to login
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <p className="text-sm">Logged in successfully with session cookie auth.</p>
      <p className="text-sm">User ID: {user.id}</p>
      <p className="text-sm">Username: {user.username}</p>
      <p className="text-sm">Email: {user.email || "No email set"}</p>
      <p className="text-sm">Staff: {user.is_staff ? "Yes" : "No"}</p>
    </section>
  );
}
