import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { BLOG_POSTS } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Reading Notes",
  description: "Book reviews, reading lists and East African literature spotlights from the Ukweli Books editors.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero title="Reading Notes" crumb="Blog" image="/images/blog-3.jpg" />
      <section className="section">
        <div className="container">
          <div className="grid-blog">
            {BLOG_POSTS.map((post, i) => (
              <Reveal key={post.slug} delay={i * 70}>
                <article className="blog-card">
                  <Link href={`/blog/${post.slug}`} className="blog-img">
                    <Image src={post.image} alt="" width={420} height={263} sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </Link>
                  <div className="blog-body">
                    <div className="blog-meta">
                      <span><CalendarDays /> {formatDate(post.date)}</span>
                      <span>{post.readMinutes} min read</span>
                      <span className="badge">{post.tag}</span>
                    </div>
                    <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                    <p>{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="read-more">Read Article <ArrowRight /></Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
