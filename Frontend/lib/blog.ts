const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const BLOG_ENDPOINT = `${API_BASE_URL}/api/blog-posts/`;
const BLOG_REVALIDATE_SECONDS = 120;
const BLOG_CACHE_TAG = "blog-posts";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  read_time: string;
  published_at: string;
};

function logBlogError(message: string, error: unknown) {
  console.error(`[blog] ${message}`, error);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(BLOG_ENDPOINT, {
      // Next.js 16 caching: keep blog content fast while still refreshing frequently.
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] }
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.results ?? [];
  } catch (error) {
    logBlogError(`Failed to fetch blog posts from ${BLOG_ENDPOINT}`, error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const url = `${BLOG_ENDPOINT}${slug}/`;
  try {
    const res = await fetch(url, {
      // Next.js 16 caching: detail pages share the same revalidation policy as list pages.
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags: [BLOG_CACHE_TAG] }
    });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    logBlogError(`Failed to fetch blog post ${slug}`, error);
    return null;
  }
}
