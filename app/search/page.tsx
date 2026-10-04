import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "./SearchClient";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Ukweli Books catalogue by title, author or genre.",
};

export default function SearchPage() {
  return (
    <>
      <PageHero title="Search the Catalogue" crumb="Search" image="/images/about-shelves.jpg" />
      <section className="section">
        <div className="container">
          <Suspense>
            <SearchClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
