import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how PulseLaunch curates a calmer, focused Product Hunt-style launch feed for builders and teams.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "About PulseLaunch",
    description:
      "Learn how PulseLaunch curates a calmer, focused Product Hunt-style launch feed for builders and teams.",
    url: "/about",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "About PulseLaunch",
    description:
      "Learn how PulseLaunch curates a calmer, focused Product Hunt-style launch feed for builders and teams."
  }
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">About</p>
        <h1 className="text-3xl font-semibold md:text-4xl">A calmer way to track launches</h1>
        <p className="text-base text-muted-foreground">
          PulseLaunch reimagines the Product Hunt experience with clarity, rhythm, and focus. The goal is simple:
          give builders and teams a daily feed they can trust.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6 md:p-8">
          <h2 className="text-xl font-semibold">What we believe</h2>
          <ul className="mt-4 space-y-3 text-base text-muted-foreground">
            <li>Launches deserve a clear moment, not an endless scroll.</li>
            <li>Upvotes should feel rewarding, not noisy.</li>
            <li>Discovery should be fast, elegant, and transparent.</li>
          </ul>
        </Card>
        <Card className="p-6 md:p-8">
          <h3 className="text-lg font-semibold">Built on</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Next.js 16, Tailwind CSS, shadcn/ui, and a Django API.</p>
            <p>Dark and light modes with a polished, brand-forward aesthetic.</p>
          </div>
          <Button className="mt-6" asChild>
            <Link href="/contact">Contact the team</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
