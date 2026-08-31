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
    <div className="min-h-screen bg-stone-50">
      <PageHero
        eyebrow="Knowledge & Inspiration"
        title="The Heaven Journal"
        subtitle="Fragrance guides, expert tips, and everything you need to know about the world of scent."
        showLogo
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* Featured post */}
        <div className="mb-12">
          <Link
            href={`/blog/${featured.id}`}
            className="group grid lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-amber-50 transition-all duration-300"
          >
            <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-amber-100 to-rose-100 relative overflow-hidden lg:min-h-[320px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-700/40 to-stone-900/60 flex items-center justify-center">
                <span className="text-6xl">🌸</span>
              </div>
              <div className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-3">
                {featured.category}
              </span>
              <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-stone-900 mb-3 group-hover:text-amber-700 transition-colors">
                {featured.title}
              </h2>
              <p className="text-stone-500 leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-stone-400">
                  <div className="flex items-center gap-1">
                    <Clock size={13} /> {featured.readTime}
                  </div>
                  <span>{new Date(featured.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Read More <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", "Fragrance Guide", "Education", "Tips & Tricks", "Men's Fragrances", "Care Tips"].map((cat) => (
            <button
              key={cat}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700 transition-colors first:bg-amber-600 first:text-white first:border-amber-600"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-amber-50 transition-all duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-stone-100 to-amber-50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {["🧴", "📚", "🌿", "👔", "💡"][parseInt(post.id) % 5]}
                </div>
              </div>
              <div className="p-5">
                <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
                  {post.category}
                </span>
                <h3 className="font-bold text-stone-800 mt-1.5 mb-2 group-hover:text-amber-700 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center gap-1">
                    <Clock size={11} /> {post.readTime}
                  </div>
                  <span>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
