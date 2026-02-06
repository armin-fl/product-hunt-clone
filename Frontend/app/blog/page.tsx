import { BlogCard } from "@/components/blog-card";
import { getBlogPosts } from "@/lib/blog";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Blog</p>
        <h1 className="text-3xl font-semibold md:text-4xl">Insights from the launch desk</h1>
        <p className="text-base text-muted-foreground">
          Product storytelling, discovery strategy, and the craft behind the feed.
        </p>
      </section>
      {blogPosts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No blog posts published yet.</p>
      )}
    </div>
  );
}
