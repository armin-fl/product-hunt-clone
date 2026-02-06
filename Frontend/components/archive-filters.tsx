"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ArchiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minVotes, setMinVotes] = useState("");
  const [maxVotes, setMaxVotes] = useState("");
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setMinVotes(searchParams.get("min_votes") ?? "");
    setMaxVotes(searchParams.get("max_votes") ?? "");
    setSearch(searchParams.get("search") ?? "");
    setRating(Number(searchParams.get("min_rating") ?? searchParams.get("reviews_rating") ?? 0));
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (minVotes) params.set("min_votes", minVotes);
    if (maxVotes) params.set("max_votes", maxVotes);
    if (search) params.set("search", search);
    if (rating) {
      params.set("min_rating", rating.toString());
      params.set("reviews_rating", rating.toString());
    }
    const query = params.toString();
    router.push(query ? `/archive?${query}` : "/archive");
  };

  const clearFilters = () => {
    setMinVotes("");
    setMaxVotes("");
    setSearch("");
    setRating(0);
    router.push("/archive");
  };

  return (
    <div className="glass rounded-3xl p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold">Search</p>
          <Input
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Min votes</p>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={minVotes}
            onChange={(event) => setMinVotes(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Max votes</p>
          <Input
            type="number"
            min={0}
            placeholder="1000"
            value={maxVotes}
            onChange={(event) => setMaxVotes(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Reviews rating</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="rounded-full p-1"
                aria-label={`Filter rating ${value}+`}
              >
                <Star
                  className={cn(
                    "h-5 w-5",
                    value <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
            {rating > 0 ? (
              <span className="text-xs text-muted-foreground">{rating}+ stars</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={applyFilters}>Apply filters</Button>
        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
}
