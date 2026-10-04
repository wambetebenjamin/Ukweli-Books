import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import { getBook } from "@/lib/data";
import { getSubscription, purchasesFor } from "@/lib/store";
import LibraryClient from "./LibraryClient";

export const dynamic = "force-dynamic"; // protected, personal — never cached

export const metadata: Metadata = {
  title: "My Library",
  description: "Your purchased books, downloads, reading progress, wishlist and subscription on Ukweli Books.",
  robots: { index: false },
};

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/library");
  }
  const email = session.user.email;
  const [purchases, subscription] = await Promise.all([purchasesFor(email), getSubscription(email)]);

  const items = purchases
    .map((p) => {
      const book = getBook(p.bookSlug);
      if (!book) return null;
      return {
        orderId: p.orderId,
        purchasedAt: p.purchasedAt,
        downloadsUsed: p.downloadsUsed,
        downloadToken: p.token,
        method: p.method,
        book: {
          slug: book.slug,
          title: book.title,
          formats: book.formats,
        },
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <LibraryClient
      userName={session.user.name ?? email.split("@")[0]}
      userEmail={email}
      items={items}
      subscription={subscription}
    />
  );
}
