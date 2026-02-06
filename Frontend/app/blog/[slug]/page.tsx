import { notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBlogPost } from "@/lib/blog";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <section className="glass rounded-3xl p-8 shadow-soft md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{post.date}</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{post.title}</h1>
        <p className="mt-3 text-base text-muted-foreground">{post.excerpt}</p>
      </section>

      <Card className="p-6 md:p-8">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Button className="mt-8" asChild>
          <Link href="/blog">Back to blog</Link>
        </Button>
      </Card>
    </div>
  );
}
