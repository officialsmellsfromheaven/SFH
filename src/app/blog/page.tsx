import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/data";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Blog – Fragrance Guides & Tips",
  description: "Expert fragrance guides, tips, and stories from Smells From Heaven.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Soft Heaven atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-28 h-80 w-80 rounded-full bg-[#f3c7d3]/35 blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#bfe1ec]/45 blur-3xl" />
        <div className="absolute left-1/2 top-[52%] h-96 w-96 -translate-x-1/2 rounded-full bg-[#d9cdec]/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1c2540 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* Journal header */}
      <section className="relative px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] border border-[#1c2540]/10 bg-[#fffdf7] px-5 py-9 shadow-[0_24px_70px_rgba(28,37,64,0.10)] sm:px-10 sm:py-12">
            <div className="absolute left-12 top-0 h-9 w-28 -translate-y-1/2 rotate-[-3deg] bg-[#f3c7d3]/70 shadow-sm" />
            <div className="absolute right-10 top-7 hidden rotate-[4deg] bg-[#fff6c9] px-4 py-2 shadow-sm sm:block">
              <span className="caveat text-lg font-semibold">
                little notes from heaven ♡
              </span>
            </div>

            <div className="max-w-3xl">
              <Link
                href="/"
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c2540]/45 transition-colors hover:text-[#b88932]"
              >
                Smells From Heaven
              </Link>

              <p className="caveat mt-7 text-2xl font-semibold text-[#b88932]">
                stories, secrets & scent ✦
              </p>

              <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
                The Heaven Journal
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
                Fragrance guides, expert tips, and little discoveries from the
                world of scent — collected for your next olfactory adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Featured memory */}
          <div className="mb-12">
            <Link
              href={`/blog/${featured.id}`}
              className="group relative grid overflow-hidden rounded-[30px] border border-[#1c2540]/10 bg-[#fffdf7] shadow-[8px_10px_0_rgba(28,37,64,0.055)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_14px_0_rgba(28,37,64,0.07)] lg:grid-cols-[1.08fr_0.92fr]"
            >
              <div className="absolute left-5 top-4 z-20 h-9 w-24 rotate-[-5deg] bg-[#bfe1ec]/80 shadow-sm" />

              <div className="relative min-h-[280px] overflow-hidden bg-[#d9cdec]/60 sm:min-h-[380px]">
                <div className="absolute inset-5 rotate-[-2deg] rounded-[24px] border border-[#1c2540]/10 bg-gradient-to-br from-[#bfe1ec] via-[#d9cdec] to-[#f3c7d3] shadow-[8px_10px_0_rgba(28,37,64,0.08)]" />
                <div className="absolute inset-10 rotate-[3deg] rounded-[20px] border-2 border-white/70 bg-[#fffdf7]/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative flex h-32 w-32 rotate-[-6deg] items-center justify-center rounded-full border-2 border-[#1c2540]/10 bg-[#fffdf7]/85 shadow-[5px_7px_0_rgba(28,37,64,0.08)]">
                    <span className="text-6xl">🌸</span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 rounded-md bg-[#fff6c9] px-4 py-2 shadow-sm rotate-[-3deg]">
                  <span className="caveat text-lg font-semibold">
                    featured ✦
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-9">
                <span className="caveat text-xl font-semibold text-[#b88932]">
                  {featured.category}
                </span>

                <h2 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-[-0.02em] transition-colors group-hover:text-[#b88932] sm:text-3xl">
                  {featured.title}
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#1c2540]/60">
                  {featured.excerpt}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#1c2540]/45">
                  <span className="rounded-full bg-[#f7f0e4] px-3 py-1.5">
                    <Clock className="mr-1 inline-block" size={13} />
                    {featured.readTime}
                  </span>
                  <span>
                    {new Date(featured.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1c2540] transition-all group-hover:gap-3 group-hover:text-[#b88932]">
                  Read this story <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          {/* Categories */}
          <div className="mb-9">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="caveat text-2xl font-semibold text-[#1c2540]/70">
                  browse the shelf...
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  Find your kind of story.
                </h2>
              </div>
              <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-[#1c2540]/35 sm:block">
                journal index
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {["All", "Fragrance Guide", "Education", "Tips & Tricks", "Men's Fragrances", "Care Tips"].map(
                (cat, index) => (
                  <button
                    key={cat}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                      index === 0
                        ? "border-[#1c2540] bg-[#1c2540] text-white shadow-[3px_4px_0_rgba(28,37,64,0.12)]"
                        : index % 3 === 1
                          ? "border-[#f3c7d3]/70 bg-[#f3c7d3]/45 text-[#1c2540] hover:bg-[#f3c7d3]/65"
                          : index % 3 === 2
                            ? "border-[#bfe1ec]/70 bg-[#bfe1ec]/45 text-[#1c2540] hover:bg-[#bfe1ec]/65"
                            : "border-[#cfe6cf]/70 bg-[#cfe6cf]/45 text-[#1c2540] hover:bg-[#cfe6cf]/65"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Post shelf */}
          <div className="relative rounded-[30px] border border-[#1c2540]/10 bg-[#fffdf7]/75 p-4 shadow-[8px_10px_0_rgba(28,37,64,0.045)] sm:p-6">
            <div className="absolute -top-3 left-10 rotate-[-2deg] bg-[#fff6c9] px-4 py-2 shadow-sm">
              <span className="caveat text-lg font-semibold">
                pages worth opening ✦
              </span>
            </div>

            <div className="grid gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className={`group relative overflow-hidden rounded-[24px] border border-[#1c2540]/10 bg-[#fffdf7] shadow-[5px_7px_0_rgba(28,37,64,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_10px_0_rgba(28,37,64,0.08)] ${
                    index % 3 === 1
                      ? "rotate-[0.7deg]"
                      : index % 3 === 2
                        ? "rotate-[-0.7deg]"
                        : ""
                  }`}
                >
                  <div
                    className={`absolute left-1/2 top-0 z-10 h-8 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[2deg] shadow-sm ${
                      index % 3 === 0
                        ? "bg-[#f3c7d3]/80"
                        : index % 3 === 1
                          ? "bg-[#bfe1ec]/80"
                          : "bg-[#fff6c9]/85"
                    }`}
                  />

                  <div className="relative aspect-[1.35/1] overflow-hidden bg-[#f7f0e4]">
                    <div
                      className={`absolute inset-5 rotate-[-2deg] rounded-[18px] border border-[#1c2540]/10 shadow-[4px_5px_0_rgba(28,37,64,0.07)] ${
                        index % 3 === 0
                          ? "bg-[#f3c7d3]"
                          : index % 3 === 1
                            ? "bg-[#bfe1ec]"
                            : "bg-[#cfe6cf]"
                      }`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="relative text-5xl transition-transform duration-500 group-hover:scale-110">
                        {["🧴", "📚", "🌿", "👔", "💡"][parseInt(post.id) % 5]}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="caveat text-xl font-semibold text-[#b88932]">
                      {post.category}
                    </span>

                    <h3 className="mt-1.5 text-lg font-bold leading-snug transition-colors group-hover:text-[#b88932]">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#1c2540]/55">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#1c2540]/10 pt-3 text-xs font-semibold text-[#1c2540]/40">
                      <span>
                        <Clock className="mr-1 inline-block" size={11} />
                        {post.readTime}
                      </span>
                      <span>
                        {new Date(post.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-9 text-center">
            <p className="caveat text-xl font-semibold text-[#1c2540]/60">
              take a page, make it yours, find your signature scent ♡
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}