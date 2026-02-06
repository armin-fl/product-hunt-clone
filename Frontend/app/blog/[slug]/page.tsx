import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBlogPostBySlug } from "@/lib/blog";

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const dateLabel = post.published_at
    ? new Date(post.published_at).toLocaleDateString()
    : "Unpublished";

  const paragraphs = Array.isArray(post.content) ? post.content : [];

  return (
    <div className="space-y-10">
      <section className="glass rounded-3xl p-8 shadow-soft md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {dateLabel}
          {post.read_time ? ` • ${post.read_time}` : ""}
        </p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-base text-muted-foreground">{post.excerpt}</p>
      </section>

      <Card className="p-6 md:p-8">
        {paragraphs.length ? (
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">This post is still being written.</p>
        )}
        <Button className="mt-8" asChild>
          <Link href="/blog">Back to blog</Link>
        </Button>
      </Card>
    </div>
  );
}
