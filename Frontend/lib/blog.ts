export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-a-daily-launch-feed",
    title: "Building a Daily Launch Feed That People Actually Use",
    excerpt: "Lessons from Product Hunt-style discovery: clarity, tempo, and trust signals.",
    date: "2026-02-02",
    readTime: "6 min read",
    content: [
      "A launch feed is more than a list. It's a rhythm. If the rhythm is off, the community goes quiet.",
      "We obsessed over grouping by day, surfacing momentum, and keeping scans effortless. That means strong hierarchy, predictable layouts, and consistent actions.",
      "If you make it easy to compare and vote, you earn daily visits. Make it noisy, and you lose the feed." 
    ]
  },
  {
    slug: "designing-for-product-teams",
    title: "Designing for Product Teams, Not Just Users",
    excerpt: "How thoughtful UX reduces internal ops friction while delighting your audience.",
    date: "2026-01-28",
    readTime: "5 min read",
    content: [
      "We designed the backend-aware filters to mirror what teams actually need to curate and analyze launches.",
      "The archive is the product ops cockpit. Treat it like one: fast scan, precise control, zero noise.",
      "Small interface affordances create big operational wins." 
    ]
  },
  {
    slug: "theme-toggles-that-feel-premium",
    title: "Theme Toggles That Feel Premium",
    excerpt: "Dark mode isn't just a switch. It's a brand decision.",
    date: "2026-01-20",
    readTime: "4 min read",
    content: [
      "Color and contrast shape perception. We chose warm light surfaces and moody dark surfaces to keep the product feed calm.",
      "The toggle needs to be immediate, reliable, and tasteful. No flashy gimmicks, just smooth control.",
      "If your theme toggle doesn't feel premium, the rest of the product won't either." 
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
