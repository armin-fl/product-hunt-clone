import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  count?: number;
  size?: "sm" | "md";
};

export function RatingStars({ rating, count, size = "md" }: RatingStarsProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {stars.map((value) => (
          <Star
            key={value}
            className={cn(
              iconSize,
              value <= Math.round(rating) ? "fill-primary text-primary" : "text-muted-foreground"
            )}
          />
        ))}
      </div>
      {typeof count === "number" ? (
        <span className="text-sm text-muted-foreground">{count} reviews</span>
      ) : null}
    </div>
  );
}
