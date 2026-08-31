import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import { searchProducts } from "@/lib/search";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }> | { q?: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams ?? {});
  const query = typeof params.q === "string" ? params.q : "";

  return {
    title: query ? `Search results for “${query}”` : "Search fragrances",
    description: query
      ? `Explore fragrance results for ${query} at Smells From Heaven.`
      : "Search all premium fragrances at Smells From Heaven.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await Promise.resolve(searchParams ?? {});
  const query = typeof params.q === "string" ? params.q : "";
  const trimmedQuery = query.trim();
  const results = trimmedQuery ? searchProducts(trimmedQuery, products) : products;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 border-b border-black/10 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6e6e73]">
          Fragrance search
        </p>
        <h1 className="text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
          {trimmedQuery ? `Search results for “${trimmedQuery}”` : "Explore all fragrances"}
        </h1>
        <p className="text-sm text-[#6e6e73]">
          {results.length} fragrance{results.length === 1 ? "" : "s"} found
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {results.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-[#f5f5f7] p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#1d1d1f]">No fragrances found</h2>
          <p className="mt-3 text-sm text-[#6e6e73]">
            Try searching for: Oud, Vanilla, Woody, Fresh, Floral
          </p>
          <a
            href="/shop"
            className="mt-5 inline-flex rounded-full bg-[#1d1d1f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2e2e2e]"
          >
            View all fragrances
          </a>
        </div>
      )}
    </div>
  );
}
