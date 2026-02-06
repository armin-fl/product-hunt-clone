import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold">This page wandered off.</h1>
      <p className="text-base text-muted-foreground">
        The launch you&apos;re looking for isn&apos;t here. Head back to the feed.
      </p>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
