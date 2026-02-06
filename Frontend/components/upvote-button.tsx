"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";

type UpvoteButtonProps = {
  initialVotes: number;
  compact?: boolean;
};

export function UpvoteButton({ initialVotes, compact }: UpvoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);

  return (
    <Button
      variant="secondary"
      size={compact ? "sm" : "md"}
      className="rounded-full"
      onClick={() => setVotes((value) => value + 1)}
    >
      <ChevronUp className="h-4 w-4" />
      <span className="text-sm font-semibold">{votes}</span>
    </Button>
  );
}
