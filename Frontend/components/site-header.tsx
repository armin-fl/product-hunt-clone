"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ensureCsrfCookie } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type SessionUser = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

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
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  async function handleLogout() {
    try {
      const csrfReady = await ensureCsrfCookie();
      if (!csrfReady) {
        return;
      }

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Flame className="h-5 w-5" />
          </span>
          PulseLaunch
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">Explore</Link>
          </Button>
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
