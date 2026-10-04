import type { MetadataRoute } from "next";
import { AUTHORS, BLOG_POSTS, BOOKS, CATEGORIES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/browse",
    "/categories",
    "/free-books",
    "/subscription",
    "/about",
    "/contact",
    "/blog",
    "/signin",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const books: MetadataRoute.Sitemap = BOOKS.map((b) => ({
    url: `${base}/books/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
    images: [`${base}/api/covers/${b.slug}?w=600`],
  }));

  const authors: MetadataRoute.Sitemap = AUTHORS.map((a) => ({
    url: `${base}/authors/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blog: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...books, ...authors, ...categories, ...blog];
}
