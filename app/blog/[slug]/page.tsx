import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { Markdown } from "@/lib/markdown";
import { BLOG_POSTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.date, images: [{ url: post.image }] },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    image: `${base}${post.image}`,
    mainEntityOfPage: `${base}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <section className="section" style={{ paddingTop: "9.5em", paddingBottom: "3em" }}>
        <div className="container">
          <div className="blog-article">
            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#999", marginBottom: 24 }}>
              <Link href="/blog">Blog</Link> <ChevronRight size={12} /> <span style={{ color: "#4d4d4d" }}>{post.tag}</span>
            </div>
            <span className="badge">{post.tag}</span>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: "14px 0 16px" }}>
              {post.title}
            </h1>
            <div className="blog-meta" style={{ display: "flex", gap: 18, fontSize: 13, color: "#999", marginBottom: 30 }}>
              <span><User size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />{post.author}</span>
              <span><CalendarDays size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} />{formatDate(post.date)}</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <div style={{ position: "relative", aspectRatio: "16/8", overflow: "hidden", marginBottom: 40, boxShadow: "0px 5px 12px -1px rgba(0,0,0,0.06)" }}>
              <Image src={post.image} alt="" fill style={{ objectFit: "cover" }} priority />
            </div>
            <Markdown content={post.content} />
          </div>
        </div>
      </section>
    </>
  );
}
