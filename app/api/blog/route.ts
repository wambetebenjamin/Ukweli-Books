import { BLOG_POSTS } from "@/lib/data";

export const revalidate = 300;

/** GET /api/blog — MDX-sourced article list (or ?slug= for full content). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return Response.json({ ok: false, error: "Article not found" }, { status: 404 });
    return Response.json({ ok: true, post });
  }
  return Response.json({
    ok: true,
    posts: BLOG_POSTS.map(({ content: _content, ...meta }) => meta),
  });
}
