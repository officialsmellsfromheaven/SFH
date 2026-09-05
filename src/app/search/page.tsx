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

  const suggestions = [
    { label: "Oud", query: "Oud", note: "deep & magnetic", paper: "#fff6c9" },
    { label: "Vanilla", query: "Vanilla", note: "warm & addictive", paper: "#f3c7d3" },
    { label: "Woody", query: "Woody", note: "earthy & elegant", paper: "#cfe6cf" },
    { label: "Fresh", query: "Fresh", note: "clean & effortless", paper: "#bfe1ec" },
    { label: "Floral", query: "Floral", note: "soft & romantic", paper: "#d9cdec" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
        <div className="absolute right-[-80px] top-[-50px] h-80 w-80 rounded-full bg-[#f3c7d3]/50 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#d9cdec]/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: "radial-gradient(#1c2540 0.7px, transparent 0.7px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <a
            href="/shop"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1c2540]/55 transition-colors hover:text-[#1c2540]"
          >
            ← back to collection
          </a>

          <span className="hidden rotate-2 rounded-sm border border-[#1c2540]/10 bg-[#fffdf7] px-4 py-2 font-[Caveat,cursive] text-base shadow-[3px_4px_0_rgba(28,37,64,0.07)] sm:block">
            looking for a little magic? ✦
          </span>
        </div>

        <section className="relative mb-14">
          <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-sm bg-[#d9cdec] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.17em] shadow-[3px_3px_0_rgba(28,37,64,0.08)]">
            ✦ fragrance search
          </div>

          <div className="absolute right-4 top-0 hidden rotate-6 rounded-sm border border-[#1c2540]/10 bg-[#fff6c9] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.08)] lg:block">
            <p className="font-[Caveat,cursive] text-lg">find your scent ♡</p>
          </div>

          <h1 className="max-w-5xl font-serif text-5xl leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
            {trimmedQuery ? (
              <>
                Looking for
                <br />
                <span className="italic">“{trimmedQuery}”</span>
                <span className="font-[Caveat,cursive] text-4xl tracking-normal text-[#b88932] sm:text-5xl lg:text-6xl">
                  {" "}✦
                </span>
              </>
            ) : (
              <>
                Find a scent
                <br />
                that feels like <span className="italic">you.</span>
              </>
            )}
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
            Search the SFH collection by fragrance name, notes, accords,
            family, or simply follow your mood.
          </p>

          <form action="/search" method="get" className="relative mt-8 max-w-3xl">
            <div className="absolute -top-3 left-10 z-10 h-6 w-20 rotate-[-3deg] bg-[#f3c7d3]/85" />
            <div className="flex items-center gap-3 border border-[#1c2540]/10 bg-[#fffdf7] p-2.5 shadow-[7px_8px_0_rgba(28,37,64,0.07)]">
              <SearchIcon />
              <input
                type="search"
                name="q"
                defaultValue={trimmedQuery}
                placeholder="Search oud, vanilla, woody, your favourite fragrance..."
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-[#1c2540]/35 sm:text-base"
                aria-label="Search fragrances"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#1c2540] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Search →
              </button>
            </div>
          </form>
        </section>

        <section className="mb-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/55">
                not sure what to type?
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl">Start with a feeling.</h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.15em] text-[#1c2540]/35 sm:block">
              little scent trails ✦
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {suggestions.map((item, index) => {
              const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "-rotate-1"];

              return (
                <a
                  key={item.query}
                  href={`/search?q=${encodeURIComponent(item.query)}`}
                  className={`group relative min-h-[118px] border border-[#1c2540]/10 p-4 shadow-[4px_5px_0_rgba(28,37,64,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0 ${rotations[index]}`}
                  style={{ backgroundColor: item.paper }}
                >
                  <div className="absolute -top-2 left-1/2 h-5 w-12 -translate-x-1/2 rotate-[-2deg] bg-[#fffdf7]/75" />
                  <p className="font-serif text-xl">{item.label}</p>
                  <p className="mt-1 font-[Caveat,cursive] text-base text-[#1c2540]/60">
                    {item.note}
                  </p>
                  <span className="absolute bottom-3 right-3 text-[#1c2540]/35 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-7 flex flex-col gap-3 border-b border-[#1c2540]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/55">
                {trimmedQuery ? "your little scent shelf" : "the whole heaven shelf"}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">
                {trimmedQuery ? "Your matches." : "Explore all fragrances."}
              </h2>
            </div>
            <div className="self-start rounded-full border border-[#1c2540]/10 bg-[#fffdf7] px-4 py-2 text-xs font-semibold text-[#1c2540]/60 shadow-[2px_3px_0_rgba(28,37,64,0.05)] sm:self-auto">
              {results.length} fragrance{results.length === 1 ? "" : "s"} found
            </div>
          </div>

          {results.length > 0 ? (
            <>
              <div className="mb-6 border border-[#1c2540]/8 bg-[#fffdf7]/75 px-4 py-3 text-center shadow-[2px_3px_0_rgba(28,37,64,0.04)]">
                <p className="font-[Caveat,cursive] text-lg text-[#1c2540]/55">
                  ✦ every bottle carries a different memory ✦
                </p>
              </div>

              <div className="grid items-start gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {results.slice(0, 12).map((product, index) => (
                  <div
                    key={product.id}
                    className={`min-w-0 self-start transition-transform duration-300 hover:-translate-y-1 ${
                      index % 4 === 0
                        ? "-rotate-1"
                        : index % 4 === 1
                          ? "rotate-1"
                          : index % 4 === 2
                            ? "-rotate-[0.6deg]"
                            : "rotate-[0.7deg]"
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {results.length > 12 && (
                <div className="mt-10 text-center">
                  <a
                    href={trimmedQuery ? `/shop?search=${encodeURIComponent(trimmedQuery)}` : "/shop"}
                    className="inline-flex items-center gap-2 border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-3 text-sm font-semibold shadow-[3px_4px_0_rgba(28,37,64,0.07)] transition-transform hover:-translate-y-0.5"
                  >
                    See the full collection →
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="relative mx-auto max-w-2xl rotate-[0.4deg] border border-[#1c2540]/10 bg-[#fffdf7] p-8 text-center shadow-[7px_8px_0_rgba(28,37,64,0.08)] sm:p-12">
              <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-2deg] bg-[#f3c7d3]/85" />
              <div className="mx-auto mb-5 flex h-14 w-14 rotate-[-4deg] items-center justify-center rounded-full bg-[#bfe1ec]">
                <SearchIcon />
              </div>
              <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/55">
                hmm... that scent is hiding from us ✦
              </p>
              <h2 className="mt-2 font-serif text-3xl">No fragrances found.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1c2540]/60">
                Try a simpler scent word, or follow one of the little scent trails above.
              </p>
              <a
                href="/shop"
                className="mt-7 inline-flex bg-[#1c2540] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                View all fragrances →
              </a>
            </div>
          )}
        </section>

        <div className="mt-16 text-center">
          <p className="font-[Caveat,cursive] text-xl text-[#1c2540]/45">
            made in heaven · worn by legends ♡
          </p>
        </div>
      </div>
    </main>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="ml-3 h-5 w-5 shrink-0 text-[#1c2540]/45"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}