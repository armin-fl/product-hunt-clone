import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  const dateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString()
    : "Unpublished";
  const readTimeLabel = post.read_time || "Read";

  return (
    <Card className="flex h-full flex-col gap-4 p-6 transition hover:-translate-y-1 hover:shadow-glow animate-fade-up">
      <Badge>{readTimeLabel}</Badge>
      <div className="space-y-2">
        {/* Performance: avoid eager prefetch for every visible blog card link. */}
        <Link href={`/blog/${post.slug}`} prefetch={false} className="text-lg font-semibold hover:text-primary">
          {post.title}
        </Link>
        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
      </div>
      <span className="mt-auto text-xs text-muted-foreground">{dateLabel}</span>
    </Card>
  );
}
